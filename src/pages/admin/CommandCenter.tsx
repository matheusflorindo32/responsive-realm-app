import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Clock3,
  DatabaseZap,
  FolderKanban,
  GraduationCap,
  Megaphone,
  MonitorCog,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { isJarvisSupabaseConfigured, jarvisSupabase } from "@/integrations/supabase/jarvis-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  { title: "Vault JARVIS", description: "Exportações validadas, revisões e sincronização protegida.", to: "/admin/vault", icon: DatabaseZap, status: "fundação" },
];

const nextActions = [
  { title: "Escolher uma frente de trabalho", detail: "Use o iniciador visual para abrir um fluxo sem escrever prompt.", to: "/admin/iniciar", icon: PlayCircle },
  { title: "Preparar o piloto de projetos", detail: "Cadastrar primeiro os projetos prioritários e suas próximas ações.", to: "/admin/projetos", icon: FolderKanban },
  { title: "Validar integrações antes de automatizar", detail: "Calendário, e-mail e vault entram em modo leitura e com evidência.", to: "/admin/sync", icon: RefreshCw },
];

export default function CommandCenter() {
  const overview = useQuery({
    queryKey: ["jarvis-command-center"],
    queryFn: async () => {
      if (!isJarvisSupabaseConfigured || !jarvisSupabase) throw new Error("JARVIS Supabase não configurado");
      const client = jarvisSupabase;
      const [projects, tasks, skills, agents, blockedTasks] = await Promise.all([
        client.from("jarvis_projects").select("id", { count: "exact", head: true }),
        client.from("jarvis_tasks").select("id", { count: "exact", head: true }).neq("status", "done"),
        client.from("jarvis_skills").select("id", { count: "exact", head: true }),
        client.from("jarvis_agents").select("id", { count: "exact", head: true }),
        client.from("jarvis_tasks").select("id", { count: "exact", head: true }).eq("status", "blocked"),
      ]);
      const firstError = [projects, tasks, skills, agents, blockedTasks].find((result) => result.error)?.error;
      if (firstError) throw firstError;
      return {
        projects: projects.count ?? 0,
        openTasks: tasks.count ?? 0,
        skills: skills.count ?? 0,
        agents: agents.count ?? 0,
        blockedTasks: blockedTasks.count ?? 0,
      };
    },
  });

  const metricCards = [
    { label: "Projetos", value: overview.data?.projects ?? 0, icon: FolderKanban },
    { label: "Tarefas abertas", value: overview.data?.openTasks ?? 0, icon: Clock3 },
    { label: "Skills", value: overview.data?.skills ?? 0, icon: BookOpen },
    { label: "Agentes", value: overview.data?.agents ?? 0, icon: Bot },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardContent className="p-6 md:p-8">
            <Badge variant="secondary" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Ambiente privado</Badge>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">JARVIS Command Center</p>
            <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-5xl">Menos ferramentas abertas. Mais decisões concluídas.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Comece pelo objetivo. O JARVIS indica o módulo, as skills e os agentes certos antes de qualquer automação ou envio externo.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg"><Link to="/admin/iniciar"><PlayCircle className="mr-2 h-4 w-4" />Iniciar algo</Link></Button>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground"><kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px]">Ctrl/⌘ K</kbd> abre o iniciador</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card">
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Clock3 className="h-4 w-4 text-primary" />Agora</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {nextActions.map(({ title, detail, to, icon: Icon }, index) => (
              <Link key={title} to={to} className="group flex gap-3 rounded-xl p-3 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">{index + 1}</span>
                <span className="min-w-0 flex-1"><span className="flex items-center gap-2 text-sm font-medium">{title}<Icon className="h-3.5 w-3.5 text-muted-foreground" /></span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{detail}</span></span>
                <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      {overview.isError && (
        <Card className="border-amber-300 bg-amber-50/80">
          <CardContent className="flex gap-3 p-4 text-sm text-amber-950"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><span>As métricas não foram confirmadas pelo banco neste momento. O painel mostra o estado como indisponível, não como zero.</span></CardContent>
        </Card>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Métricas do comando">
        {metricCards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/70 bg-card/80 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{label}</span><Icon className="h-4 w-4 text-primary" /></div>
              {overview.isLoading ? <Skeleton className="mt-3 h-8 w-16" /> : <p className="mt-3 text-2xl font-semibold tabular-nums">{overview.isError ? "—" : value}</p>}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="border-border/70">
          <CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-lg">Espaços de trabalho</CardTitle><p className="mt-1 text-sm text-muted-foreground">Abra o módulo quando precisar aprofundar; comece pelo iniciador quando precisar decidir.</p></div><Button asChild variant="ghost" size="sm"><Link to="/admin/iniciar">Ver fluxos <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {modules.map(({ title, description, to, icon: Icon, status }) => (
              <Link key={title} to={to} className="group rounded-xl border border-border/70 bg-background p-4 transition hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="flex items-start justify-between gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div><Badge variant={status === "ativo" ? "default" : "secondary"}>{status === "ativo" ? "ativo" : "em preparação"}</Badge></div>
                <h2 className="mt-4 font-semibold">{title}</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70"><CardHeader className="pb-3"><CardTitle className="text-base">Sinais e proteção</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
            <StatusLine label="Vault JARVIS" state="protegido" ok detail="Repositório privado confirmado; exportação controlada ainda é a próxima etapa." />
            <StatusLine label="Build do painel" state="verificado" ok detail="PR com validação de build em Node 22." />
            <StatusLine label="Supabase JARVIS" state={overview.isError ? "indisponível" : overview.isLoading ? "verificando" : "verificado"} ok={overview.isSuccess} detail="Backend pessoal isolado, com RLS e políticas administrativas endurecidas." />
            <StatusLine label="Tarefas bloqueadas" state={overview.isError ? "indisponível" : `${overview.data?.blockedTasks ?? 0} registrada(s)`} ok={overview.isSuccess && (overview.data?.blockedTasks ?? 0) === 0} detail="Indicador operacional do novo banco JARVIS." />
          </CardContent></Card>
          <Card className="border-amber-200 bg-amber-50/70"><CardContent className="p-5 text-sm text-amber-950"><p className="flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4" />Antes de integrar dados reais</p><p className="mt-2 leading-relaxed text-amber-950/80">Validar RLS, permissões por perfil e o contrato de exportação do vault. O iniciador não envia e-mails, altera agenda ou publica conteúdo.</p></CardContent></Card>
        </div>
      </section>
    </div>
  );
}

function StatusLine({ label, state, ok, detail }: { label: string; state: string; ok: boolean; detail?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <div><p className="font-medium">{label}</p><p className="mt-0.5 text-xs font-medium text-muted-foreground">{state}</p>{detail && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>}</div>
      {ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-label="Em dia" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-label="Atenção" />}
    </div>
  );
}
