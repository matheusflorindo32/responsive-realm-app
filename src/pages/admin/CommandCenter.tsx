import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  DatabaseZap,
  FolderKanban,
  GraduationCap,
  Megaphone,
  MonitorCog,
  PackageOpen,
  RefreshCw,
  ShieldAlert,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type AdminMetrics = Record<string, number>;

type ModuleCard = {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  status: "ativo" | "fundação";
};

const modules: ModuleCard[] = [
  { title: "Projetos", description: "Prioridades, prazos, responsáveis e próximas ações.", to: "/admin/projetos", icon: FolderKanban, status: "fundação" },
  { title: "Clientes & alunos", description: "CRM, turmas, suporte, progresso e retenção.", to: "/admin/relacionamentos", icon: Users, status: "fundação" },
  { title: "Produtos & cursos", description: "Ofertas, cursos, matrículas e certificados.", to: "/admin/ensino", icon: GraduationCap, status: "ativo" },
  { title: "Conteúdo", description: "Peça-mestre para YouTube, Instagram, LinkedIn e X.", to: "/admin/conteudo", icon: Megaphone, status: "fundação" },
  { title: "Pesquisa", description: "Estudos, evidências, publicações e revisão.", to: "/admin/pesquisa", icon: BookOpen, status: "fundação" },
  { title: "Agentes", description: "Tarefas, custos, execuções, qualidade e limites.", to: "/admin/agentes", icon: Bot, status: "fundação" },
  { title: "Sites & sistemas", description: "Repositórios, deploys, domínios, custos e incidentes.", to: "/admin/sistemas", icon: MonitorCog, status: "fundação" },
  { title: "Vault JARVIS", description: "Saúde do export, revisões e conflitos de sincronização.", to: "/admin/vault", icon: DatabaseZap, status: "fundação" },
];

export default function CommandCenter() {
  const overview = useQuery({
    queryKey: ["jarvis-command-center"],
    queryFn: async () => {
      const [metricsResult, syncResult, conflictsResult] = await Promise.all([
        supabase.rpc("admin_metrics"),
        supabase
          .from("sync_runs")
          .select("status, finished_at, rows_pulled, rows_pushed, conflicts")
          .order("started_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("sync_conflicts")
          .select("*", { count: "exact", head: true })
          .eq("resolved", false),
      ]);

      if (metricsResult.error) throw metricsResult.error;

      return {
        metrics: (metricsResult.data ?? {}) as AdminMetrics,
        lastSync: syncResult.data,
        openConflicts: conflictsResult.count ?? 0,
      };
    },
  });

  const metrics = overview.data?.metrics ?? {};
  const metricCards = [
    { label: "Alunos", value: metrics.students_total ?? 0, icon: Users },
    { label: "Matrículas ativas", value: metrics.enrollments_active ?? 0, icon: GraduationCap },
    { label: "Cursos publicados", value: metrics.courses_published ?? 0, icon: BookOpen },
    { label: "Conflitos de sync", value: overview.data?.openConflicts ?? 0, icon: RefreshCw },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">JARVIS Command Center</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Visão de hoje</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Um cockpit privado para conectar conhecimento, projetos, ensino, produtos, conteúdo e tecnologia.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link to="/admin/agenda"><CalendarDays className="mr-2 h-4 w-4" />Agenda</Link></Button>
          <Button asChild><Link to="/admin/projetos"><FolderKanban className="mr-2 h-4 w-4" />Projetos</Link></Button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metricCards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/70 bg-card/80 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              {overview.isLoading ? <Skeleton className="mt-3 h-8 w-16" /> : <p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p>}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">Mapa operacional</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {modules.map(({ title, description, to, icon: Icon, status }) => (
              <Link key={title} to={to} className="group rounded-xl border border-border/70 bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                  <Badge variant={status === "ativo" ? "default" : "secondary"}>{status}</Badge>
                </div>
                <h2 className="mt-4 font-semibold">{title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
                <span className="mt-3 inline-flex items-center text-xs font-medium text-primary">Abrir <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-amber-200 bg-amber-50/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-amber-950"><ShieldAlert className="h-4 w-4" />Portões de segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-amber-950/80">
              <p className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Privatizar o vault antes de sincronizar dados internos.</p>
              <p className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Remover o .env do histórico e rotacionar qualquer segredo exposto.</p>
              <p className="text-xs">Até esses portões serem fechados, o JARVIS opera sem importar o vault bruto.</p>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Saúde das integrações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <StatusLine label="Supabase" ok />
              <StatusLine label="Ensino" ok />
              <StatusLine label="Google Sheets" ok={overview.data?.lastSync?.status === "ok"} detail={overview.data?.lastSync?.finished_at ? new Date(overview.data.lastSync.finished_at).toLocaleString("pt-BR") : "sem rodada confirmada"} />
              <StatusLine label="Vault JARVIS" ok={false} detail="aguardando proteção e contrato de exportação" />
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="border-border/70 bg-gradient-to-r from-primary/[0.06] to-emerald-500/[0.05]">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-medium"><PackageOpen className="h-4 w-4 text-primary" />Próxima fase</p>
            <p className="mt-1 text-sm text-muted-foreground">Cadastrar dez projetos como piloto antes de automatizar calendário, e-mail e publicação.</p>
          </div>
          <Button asChild variant="outline"><Link to="/admin/projetos">Preparar piloto</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusLine({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <div>
        <p className="font-medium">{label}</p>
        {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
      </div>
      {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
    </div>
  );
}
