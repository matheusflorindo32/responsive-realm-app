// Full pull+push reconciliation. Called by pg_cron every 10 min and
// by the admin "Sincronizar agora" button.
import { cors, svc, pullSheet, pushSheet, startRun, finishRun, SYNCED_SHEETS } from "../_shared/sheets.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const authHeader = req.headers.get("Authorization");
  const cronSecret = req.headers.get("x-cron-secret");
  const expectedCronSecret = Deno.env.get("SHEETS_WEBHOOK_SECRET");
  let userId: string | undefined;
  let trigger: "cron" | "manual" = "cron";
  let authorized = false;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data } = await client.auth.getClaims(token);
    if (data?.claims?.sub) {
      userId = data.claims.sub as string;
      trigger = "manual";
      const sbSvc = svc();
      const { data: isAdmin } = await sbSvc.rpc("has_role", { _user_id: userId, _role: "admin" });
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "admin required" }),
          { status: 403, headers: { ...cors, "Content-Type": "application/json" } });
      }
      authorized = true;
    }
  } else if (cronSecret && expectedCronSecret && cronSecret === expectedCronSecret) {
    authorized = true;
  }

  if (!authorized) {
    return new Response(JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const sb = svc();
  const runId = await startRun(sb, trigger, "both", undefined, userId);
  let pulled = 0, pushed = 0, conflicts = 0;
  const errors: string[] = [];

  for (const s of SYNCED_SHEETS) {
    try {
      const pull = await pullSheet(sb, s);
      pulled += pull.pulled; conflicts += pull.conflicts; errors.push(...pull.errors);
      const push = await pushSheet(sb, s);
      pushed += push.pushed; errors.push(...push.errors);
    } catch (e) { errors.push(`${s}: ${(e as Error).message}`); }
  }

  await finishRun(sb, runId, {
    status: errors.length ? (pulled + pushed ? "partial" : "error") : "ok",
    rows_pulled: pulled, rows_pushed: pushed, conflicts,
    errors: errors.length ? errors : null,
  });

  return new Response(JSON.stringify({ ok: true, pulled, pushed, conflicts, errors }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
