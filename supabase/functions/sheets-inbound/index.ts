// Webhook receiver called by Google Apps Script on every edit.
// Public endpoint, protected by HMAC signature.
import { cors, hmacHex, safeEq, svc, pullSheet, startRun, finishRun, SYNCED_SHEETS } from "../_shared/sheets.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  const secret = Deno.env.get("SHEETS_WEBHOOK_SECRET");
  if (!secret) {
    return new Response(JSON.stringify({ error: "webhook secret not configured" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const raw = await req.text();
  const sig = req.headers.get("x-sheets-signature") ?? "";
  const expected = await hmacHex(secret, raw);
  if (!safeEq(sig, expected)) {
    return new Response(JSON.stringify({ error: "invalid signature" }),
      { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
  }

  let payload: { sheet?: string; sheets?: string[] };
  try { payload = JSON.parse(raw); } catch {
    return new Response(JSON.stringify({ error: "invalid json" }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const targets = payload.sheets ??
    (payload.sheet ? [payload.sheet] : SYNCED_SHEETS);

  const sb = svc();
  const runId = await startRun(sb, "webhook", "pull", targets.length === 1 ? targets[0] : undefined);
  let pulled = 0, conflicts = 0;
  const errors: string[] = [];

  for (const s of targets) {
    if (!SYNCED_SHEETS.includes(s)) { errors.push(`skipped unknown sheet: ${s}`); continue; }
    try {
      const r = await pullSheet(sb, s);
      pulled += r.pulled; conflicts += r.conflicts; errors.push(...r.errors);
    } catch (e) { errors.push(`${s}: ${(e as Error).message}`); }
  }

  await finishRun(sb, runId, {
    status: errors.length ? (pulled ? "partial" : "error") : "ok",
    rows_pulled: pulled, conflicts, errors: errors.length ? errors : null,
  });

  return new Response(JSON.stringify({ ok: true, pulled, conflicts, errors }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
