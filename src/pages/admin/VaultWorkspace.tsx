import { useQuery } from "@tanstack/react-query";
import { Archive, BookOpen, CheckCircle2, Clock3, DatabaseZap, FileText, FolderKanban, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isJarvisSupabaseConfigured, jarvisSupabase } from "@/integrations/supabase/jarvis-client";

type Project = { id: string; code: string; title: string; phase: string; next_action: string | null; updated_at: string };
type Decision = { id: string; code: string; subject: string; decision: string; decided_at: string };
type Source = { id: string; title: string; source_type: string; canonical_url: string | null; verified_at: string | null; created_at: string };
type Audit = { id: number; action: string; entity_type: string; occurred_at: string; metadata: { title?: string; code?: string } | null };

const formatDate = (value: string | null) => value ? new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Ainda não verificado";

export default function VaultWorkspace() {
  const vault = useQuery({
    queryKey: ["jarvis-vault-workspace"],
    queryFn: async () => {
      if (!isJarvisSupabaseConfigured || !jarvisSupabase) throw new Error("JARVIS Supabase não configurado.");
      const [projects, decisions, sources, audit] = await Promise.all([
        jarvisSupabase.from("jarvis_projects").select("id, code, title, phase, next_action, updated_at").order("updated_at", { ascending: false }).limit(6),
        jarvisSupabase.from("jarvis_decisions").select("id, code, subject, decision, decided_at").order("decided_at", { ascending: false }).limit(5),
        jarvisSupabase.from("jarvis_sources").select("id, title, source_type, canonical_url, verified_at, created_at").order("created_at", { ascending: false }).limit(6),
        jarvisSupabase.from("jarvis_audit_events").select("id, action, entity_type, occurred_at, metadata").order("occurred_at", { ascending: false }).limit(6),
      ]);
      for (const result of [projects, decisions, sources, audit]) if (result.error) throw result.error;
      return { projects: (projects.data ?? []) as Project[], decisions: (decisions.data ?? []) as Decision[], sources: (sources.data ?? []) as Source[], audit: (audit.data ?? []) as Audit[] };
    },
  });
  const data = vault.data;
  return <div className="space-y-7">
    <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div className="max-w-3xl"><Badge variant="secondary" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Modo leitura controlada</Badge><div className="mt-4 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Memória operacional</p><h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Vault JARVIS</h1></div></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">A camada visual do Vault organiza evidências, decisões e próximas ações já protegidas no JARVIS. Nenhum arquivo do Obsidian é lido, enviado ou alterado nesta etapa.</p></div><Button variant="outline" onClick={() => { vault.refetch(); toast.success("Painel atualizado. Nenhum arquivo externo foi acessado."); }} disabled={vault.isFetching}><RefreshCw className={`mr-2 h-4 w-4 ${vault.isFetching ? "animate-spin" : ""}`} />Atualizar painel</Button></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={FolderKanban} label="Projetos mapeados" value={data?.projects.length ?? "—"} /><Metric icon={FileText} label="Fontes registradas" value={data?.sources.length ?? "—"} /><Metric icon={CheckCircle2} label="Decisões recentes" value={data?.decisions.length ?? "—"} /><Metric icon={Archive} label="Eventos auditados" value={data?.audit.length ?? "—"} /></section>
    {vault.isError && <Card className="border-amber-300 bg-amber-50/80"><CardContent className="p-4 text-sm text-amber-950">Não foi possível carregar o inventário do Vault no banco pessoal do JARVIS.</CardContent></Card>}
    <section className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FolderKanban className="h-4 w-4 text-primary" />Frentes vinculáveis</CardTitle></CardHeader><CardContent className="space-y-3">{vault.isLoading && <><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></>}{data?.projects.map((project) => <article key={project.id} className="rounded-xl border border-border/70 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{project.title}</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">{project.code}</p></div><Badge variant="secondary">{project.phase}</Badge></div><p className="mt-3 text-sm text-muted-foreground">{project.next_action ?? "Definir próxima ação antes de vincular notas."}</p></article>)}{vault.isSuccess && !data?.projects.length && <Empty text="Ainda não há projetos para relacionar ao Vault." />}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><DatabaseZap className="h-4 w-4 text-primary" />Contrato de sincronização</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><div className="rounded-xl border border-primary/20 bg-primary/[.03] p-4"><p className="font-medium">Fase atual: inventário local</p><p className="mt-1 text-muted-foreground">O painel lê apenas registros internos protegidos por RLS e MFA.</p></div><Step done label="Acesso administrativo e MFA" /><Step done label="Auditoria para projetos e tarefas" /><Step label="Conectar repositório privado do Vault em leitura" /><Step label="Validar mapa de pastas e metadados" /><Step label="Liberar sincronização manual com confirmação" /></CardContent></Card></section>
    <section className="grid gap-4 xl:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-4 w-4 text-primary" />Evidências e documentos</CardTitle></CardHeader><CardContent className="space-y-2">{data?.sources.map((source) => <article key={source.id} className="rounded-lg border border-border/70 p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium">{source.title}</p><p className="mt-1 text-xs text-muted-foreground">{source.source_type} · {formatDate(source.verified_at)}</p></div>{source.canonical_url && <Badge variant="secondary">link</Badge>}</div></article>)}{vault.isSuccess && !data?.sources.length && <Empty text="Ainda não existem documentos importados. A conexão ao Obsidian será em modo leitura." />}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Clock3 className="h-4 w-4 text-primary" />Trilha recente</CardTitle></CardHeader><CardContent className="space-y-2">{data?.audit.map((event) => <article key={event.id} className="rounded-lg border border-border/70 p-3"><p className="text-sm font-medium">{event.metadata?.title ?? event.action.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-muted-foreground">{event.metadata?.code ?? event.entity_type} · {formatDate(event.occurred_at)}</p></article>)}{vault.isSuccess && !data?.audit.length && <Empty text="Nenhum evento recente registrado." />}</CardContent></Card></section>
  </div>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string | number }) { return <Card className="border-border/70"><CardContent className="p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5 text-primary" />{label}</div><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>; }
function Step({ label, done = false }: { label: string; done?: boolean }) { return <div className="flex items-center gap-2"><span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${done ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{done ? "✓" : "·"}</span><span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span></div>; }
function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">{text}</div>; }
