// Push pending_push rows from Postgres back to Google Sheets.
// Called by the app after mutations, or by the cron / manual button.
import { cors, svc, pushSheet, startRun, finishRun, SYNCED_SHEETS } from "../_shared/sheets.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  // Auth: require signed-in user (any role) OR service_role (cron calls)
  const authHeader = req.headers.get("Authorization");
  let userId: string | undefined;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data } = await client.auth.getClaims(token);
    userId = data?.claims?.sub as string | undefined;
  }

  let body: { sheet?: string; sheets?: string[] } = {};
  if (req.method === "POST") {
    try { body = await req.json(); } catch { /* empty body ok */ }
  }
  const targets = body.sheets ?? (body.sheet ? [body.sheet] : SYNCED_SHEETS);

  const sb = svc();
  const runId = await startRun(sb, "manual", "push", targets.length === 1 ? targets[0] : undefined, userId);
  let pushed = 0;
  const errors: string[] = [];

  for (const s of targets) {
    if (!SYNCED_SHEETS.includes(s)) continue;
    try {
      const r = await pushSheet(sb, s);
      pushed += r.pushed; errors.push(...r.errors);
    } catch (e) { errors.push(`${s}: ${(e as Error).message}`); }
  }

  await finishRun(sb, runId, {
    status: errors.length ? (pushed ? "partial" : "error") : "ok",
    rows_pushed: pushed, errors: errors.length ? errors : null,
  });

  return new Response(JSON.stringify({ ok: true, pushed, errors }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
