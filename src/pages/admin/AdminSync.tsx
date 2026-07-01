import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RefreshCw, LogOut, AlertTriangle, CheckCircle2, Clock, Database } from "lucide-react";

type SyncRun = {
  id: string; trigger: string; direction: string; sheet_name: string | null;
  status: string; rows_pulled: number; rows_pushed: number; conflicts: number;
  errors: unknown; started_at: string; finished_at: string | null; duration_ms: number | null;
};

type Conflict = {
  id: string; sheet_row_id: string;
  app_version: Record<string, unknown>; sheet_version: Record<string, unknown>;
  app_updated_at: string | null; sheet_updated_at: string | null;
  resolved: boolean;
};

type Stats = {
  totalRows: number; pending: number; conflicts: number;
  errors: number; lastSync: string | null; lastSource: string | null;
};

export default function AdminSync() {
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [runs, setRuns] = useState<SyncRun[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRows: 0, pending: 0, conflicts: 0, errors: 0, lastSync: null, lastSource: null });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { nav("/admin"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const admin = roles?.some((r) => r.role === "admin") ?? false;
      setIsAdmin(admin);
      if (admin) load();
    })();
  }, [nav]);

  const load = async () => {
    const [runsRes, conflictsRes, rowsCount, pendingCount, errorCount, lastPullRun] = await Promise.all([
      supabase.from("sync_runs").select("*").order("started_at", { ascending: false }).limit(20),
      supabase.from("sync_conflicts").select("*").eq("resolved", false).order("created_at", { ascending: false }).limit(20),
      supabase.from("sheet_rows").select("*", { count: "exact", head: true }),
      supabase.from("sheet_rows").select("*", { count: "exact", head: true }).eq("sync_status", "pending_push"),
      supabase.from("sheet_rows").select("*", { count: "exact", head: true }).eq("sync_status", "error"),
      supabase.from("sync_runs").select("finished_at, trigger").eq("status", "ok").order("finished_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    setRuns((runsRes.data ?? []) as SyncRun[]);
    setConflicts((conflictsRes.data ?? []) as unknown as Conflict[]);
    setStats({
      totalRows: rowsCount.count ?? 0,
      pending: pendingCount.count ?? 0,
      conflicts: conflictsRes.data?.length ?? 0,
      errors: errorCount.count ?? 0,
      lastSync: lastPullRun.data?.finished_at ?? null,
      lastSource: lastPullRun.data?.trigger ?? null,
    });
  };

  const syncNow = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sheets-sync", { body: {} });
      if (error) throw error;
      toast.success(`Sync ok — ${data?.pulled ?? 0} lidas, ${data?.pushed ?? 0} enviadas, ${data?.conflicts ?? 0} conflitos`);
      await load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSyncing(false); }
  };

  const resolveConflict = async (id: string, keep: "app" | "sheet") => {
    const c = conflicts.find((x) => x.id === id);
    if (!c) return;
    const newData = keep === "app" ? c.app_version : c.sheet_version;
    const newStatus = keep === "app" ? "pending_push" : "synced";
    const { error: e1 } = await supabase.from("sheet_rows")
      .update({ data: newData, sync_status: newStatus, conflict_status: null, conflict_payload: null, source: keep === "app" ? "app" : "sheets" })
      .eq("id", c.sheet_row_id);
    if (e1) return toast.error(e1.message);
    const { error: e2 } = await supabase.from("sync_conflicts")
      .update({ resolved: true, resolution: keep === "app" ? "kept_app" : "kept_sheet", resolved_at: new Date().toISOString() })
      .eq("id", id);
    if (e2) return toast.error(e2.message);
    toast.success(`Mantido: ${keep}`);
    await load();
  };

  const signOut = async () => { await supabase.auth.signOut(); nav("/admin"); };

  if (isAdmin === null) return <div className="min-h-screen grid place-items-center">Carregando…</div>;
  if (!isAdmin) return (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Sem permissão</h1>
        <p className="text-muted-foreground mb-4">Você não é admin deste projeto.</p>
        <Button onClick={signOut}>Sair</Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Sincronização · Admin</title></Helmet>
      <main className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container-wide flex items-center justify-between py-6">
            <div>
              <p className="text-xs mono uppercase tracking-widest text-muted-foreground">Painel</p>
              <h1 className="text-2xl font-semibold">Sincronização Google Sheets</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={syncNow} disabled={syncing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                Sincronizar agora
              </Button>
              <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
            </div>
          </div>
        </header>

        <div className="container-wide py-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard icon={Database} label="Linhas" value={stats.totalRows} />
            <StatCard icon={Clock} label="Pendentes" value={stats.pending} tone={stats.pending ? "warn" : undefined} />
            <StatCard icon={AlertTriangle} label="Conflitos" value={stats.conflicts} tone={stats.conflicts ? "danger" : undefined} />
            <StatCard icon={AlertTriangle} label="Erros" value={stats.errors} tone={stats.errors ? "danger" : undefined} />
            <StatCard icon={CheckCircle2} label="Última sync" value={stats.lastSync ? new Date(stats.lastSync).toLocaleTimeString() : "—"} sub={stats.lastSource ?? undefined} />
          </div>

          <section>
            <h2 className="text-lg font-semibold mb-3">Conflitos pendentes</h2>
            {conflicts.length === 0 ? (
              <p className="text-sm text-muted-foreground t-card p-6">Nenhum conflito. Tudo em ordem.</p>
            ) : (
              <div className="space-y-3">
                {conflicts.map((c) => (
                  <div key={c.id} className="t-card p-5">
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <p className="text-xs mono text-muted-foreground">
                        Row {c.sheet_row_id.slice(0, 8)}… · app {c.app_updated_at ? new Date(c.app_updated_at).toLocaleString() : "?"} vs sheet {c.sheet_updated_at ? new Date(c.sheet_updated_at).toLocaleString() : "?"}
                      </p>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => resolveConflict(c.id, "app")}>Manter app</Button>
                        <Button size="sm" variant="outline" onClick={() => resolveConflict(c.id, "sheet")}>Manter sheet</Button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-xs">
                      <pre className="bg-muted p-3 rounded overflow-auto max-h-48">{JSON.stringify(c.app_version, null, 2)}</pre>
                      <pre className="bg-muted p-3 rounded overflow-auto max-h-48">{JSON.stringify(c.sheet_version, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Últimas rodadas</h2>
            <div className="t-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Quando</th>
                    <th className="p-3 font-medium">Origem</th>
                    <th className="p-3 font-medium">Direção</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium text-right">Pull</th>
                    <th className="p-3 font-medium text-right">Push</th>
                    <th className="p-3 font-medium text-right">Conf.</th>
                    <th className="p-3 font-medium text-right">ms</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="p-3">{new Date(r.started_at).toLocaleString()}</td>
                      <td className="p-3"><Badge variant="outline">{r.trigger}</Badge></td>
                      <td className="p-3">{r.direction}</td>
                      <td className="p-3">
                        <Badge variant={r.status === "ok" ? "default" : r.status === "error" ? "destructive" : "secondary"}>
                          {r.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">{r.rows_pulled}</td>
                      <td className="p-3 text-right">{r.rows_pushed}</td>
                      <td className="p-3 text-right">{r.conflicts}</td>
                      <td className="p-3 text-right">{r.duration_ms ?? "—"}</td>
                    </tr>
                  ))}
                  {runs.length === 0 && (
                    <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">Sem rodadas ainda. Clique "Sincronizar agora".</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone }: {
  icon: any; label: string; value: string | number; sub?: string; tone?: "warn" | "danger";
}) {
  const color = tone === "danger" ? "text-destructive" : tone === "warn" ? "text-amber-600" : "text-foreground";
  return (
    <div className="t-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}
