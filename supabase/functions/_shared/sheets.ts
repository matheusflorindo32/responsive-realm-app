// Shared helpers for Google Sheets sync edge functions
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

export const SPREADSHEET_ID = "1HzpG3PDDxAPKo6FuTIh-Ms3tcXQJGmwSRD5JI34og20";
export const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

export function svc(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export function gwHeaders(): Record<string, string> {
  return {
    "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
    "X-Connection-Api-Key": Deno.env.get("GOOGLE_SHEETS_API_KEY")!,
    "Content-Type": "application/json",
  };
}

export async function gw(
  path: string,
  init?: { method?: string; query?: Record<string, string>; body?: unknown },
): Promise<any> {
  const qs = init?.query
    ? "?" + Object.entries(init.query).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")
    : "";
  const res = await fetch(`${GATEWAY}${path}${qs}`, {
    method: init?.method ?? "GET",
    headers: gwHeaders(),
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  const txt = await res.text();
  if (!res.ok) throw new Error(`Sheets gateway ${res.status}: ${txt}`);
  return txt ? JSON.parse(txt) : {};
}

/** Read a full sheet tab as array of objects keyed by header row. */
export async function readSheet(sheetName: string): Promise<{
  headers: string[];
  rows: Array<{ rowNumber: number; values: string[]; data: Record<string, unknown>; rowId: string }>;
}> {
  const res = await gw(`/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}`, {
    query: { valueRenderOption: "UNFORMATTED_VALUE" },
  });
  const values: string[][] = res.values ?? [];
  if (values.length === 0) return { headers: [], rows: [] };
  const headers = (values[0] ?? []).map((h) => String(h ?? "").trim());
  const idColIdx = headers.findIndex((h) => h.toLowerCase() === "id");
  const rows = values.slice(1).map((raw, i) => {
    const data: Record<string, unknown> = {};
    headers.forEach((h, j) => { if (h) data[h] = raw[j] ?? null; });
    const rowNumber = i + 2; // header is row 1
    const rowId = idColIdx >= 0 && raw[idColIdx]
      ? String(raw[idColIdx])
      : `row:${rowNumber}`;
    return { rowNumber, values: raw, data, rowId };
  });
  return { headers, rows };
}

/** All syncable sheets — skip meta/dictionary tabs. */
export const SYNCED_SHEETS = [
  "01_Profile", "02_Bio", "03_Dashboard",
  "04_Publicacoes", "05_Anais_CONACIPS",
  "06_Formacao", "07_Cursos", "08_Certificacoes",
  "09_Experiencia", "10_Projetos", "11_Skills",
  "12_Instituicoes", "13_Links", "14_SEO_CMS",
  "16_Settings",
];

/** Pull one sheet into sheet_rows, respecting conflicts. Returns counters. */
export async function pullSheet(
  sb: SupabaseClient,
  sheetName: string,
): Promise<{ pulled: number; conflicts: number; errors: string[] }> {
  const errors: string[] = [];
  let conflicts = 0;
  let pulled = 0;

  const { rows } = await readSheet(sheetName);
  const { data: existing, error: exErr } = await sb
    .from("sheet_rows")
    .select("id, sheet_row_id, data, source, sync_status, updated_at")
    .eq("sheet_name", sheetName);
  if (exErr) throw exErr;

  const byRowId = new Map(existing?.map((r) => [r.sheet_row_id, r]) ?? []);
  const seen = new Set<string>();

  for (const row of rows) {
    seen.add(row.rowId);
    const prev = byRowId.get(row.rowId);
    if (!prev) {
      const { error } = await sb.from("sheet_rows").insert({
        sheet_name: sheetName,
        sheet_row_id: row.rowId,
        sheet_row_number: row.rowNumber,
        data: row.data,
        source: "sheets",
        sync_status: "synced",
        last_synced_at: new Date().toISOString(),
      });
      if (error) errors.push(`insert ${row.rowId}: ${error.message}`);
      else pulled++;
      continue;
    }
    // Skip if no change
    if (JSON.stringify(prev.data) === JSON.stringify(row.data)) {
      await sb.from("sheet_rows")
        .update({ sheet_row_number: row.rowNumber, last_synced_at: new Date().toISOString() })
        .eq("id", prev.id);
      continue;
    }
    // Conflict: app has pending push AND data differs
    if (prev.sync_status === "pending_push") {
      await sb.from("sync_conflicts").insert({
        sheet_row_id: prev.id,
        app_version: prev.data,
        sheet_version: row.data,
        app_updated_at: prev.updated_at,
        sheet_updated_at: new Date().toISOString(),
      });
      await sb.from("sheet_rows")
        .update({ sync_status: "conflict", conflict_status: "app_vs_sheet", conflict_payload: row.data })
        .eq("id", prev.id);
      conflicts++;
      continue;
    }
    // Normal pull: sheet wins
    const { error } = await sb.from("sheet_rows").update({
      data: row.data,
      sheet_row_number: row.rowNumber,
      source: "sheets",
      sync_status: "synced",
      last_synced_at: new Date().toISOString(),
    }).eq("id", prev.id);
    if (error) errors.push(`update ${row.rowId}: ${error.message}`);
    else pulled++;
  }

  return { pulled, conflicts, errors };
}

/** Push all pending_push rows for a sheet back to Google Sheets. */
export async function pushSheet(
  sb: SupabaseClient,
  sheetName: string,
): Promise<{ pushed: number; errors: string[] }> {
  const errors: string[] = [];
  let pushed = 0;

  const { data: pending, error } = await sb
    .from("sheet_rows")
    .select("id, sheet_row_id, sheet_row_number, data")
    .eq("sheet_name", sheetName)
    .eq("sync_status", "pending_push");
  if (error) throw error;
  if (!pending || pending.length === 0) return { pushed: 0, errors: [] };

  const { headers } = await readSheet(sheetName);
  if (headers.length === 0) return { pushed: 0, errors: ["empty header row"] };

  for (const row of pending) {
    const values = headers.map((h) => (row.data as any)?.[h] ?? "");
    try {
      if (row.sheet_row_number && row.sheet_row_number > 1) {
        const range = `${sheetName}!A${row.sheet_row_number}`;
        await gw(`/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`, {
          method: "PUT",
          query: { valueInputOption: "USER_ENTERED" },
          body: { values: [values] },
        });
      } else {
        const range = `${sheetName}!A1`;
        const appended = await gw(
          `/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append`,
          { method: "POST", query: { valueInputOption: "USER_ENTERED" }, body: { values: [values] } },
        );
        // extract new row number from updatedRange e.g. Sheet!A25:F25
        const match = appended?.updates?.updatedRange?.match(/!A(\d+)/);
        if (match) {
          await sb.from("sheet_rows")
            .update({ sheet_row_number: parseInt(match[1], 10) })
            .eq("id", row.id);
        }
      }
      await sb.from("sheet_rows").update({
        sync_status: "synced",
        last_synced_at: new Date().toISOString(),
        error_message: null,
      }).eq("id", row.id);
      pushed++;
    } catch (e) {
      const msg = (e as Error).message;
      errors.push(`push ${row.sheet_row_id}: ${msg}`);
      await sb.from("sheet_rows")
        .update({ sync_status: "error", error_message: msg })
        .eq("id", row.id);
    }
  }
  return { pushed, errors };
}

export async function startRun(sb: SupabaseClient, trigger: string, direction: string, sheet?: string, user?: string) {
  const { data } = await sb.from("sync_runs").insert({
    trigger, direction, sheet_name: sheet, triggered_by: user,
  }).select("id").single();
  return data!.id as string;
}

export async function finishRun(
  sb: SupabaseClient,
  runId: string,
  patch: { status: string; rows_pulled?: number; rows_pushed?: number; conflicts?: number; errors?: unknown },
) {
  const started = await sb.from("sync_runs").select("started_at").eq("id", runId).single();
  const startedAt = started.data ? new Date(started.data.started_at).getTime() : Date.now();
  await sb.from("sync_runs").update({
    ...patch,
    errors: patch.errors ?? null,
    finished_at: new Date().toISOString(),
    duration_ms: Date.now() - startedAt,
  }).eq("id", runId);
}

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sheets-signature",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

/** Constant-time compare. */
export function safeEq(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
