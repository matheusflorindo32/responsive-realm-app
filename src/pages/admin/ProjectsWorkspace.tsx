import { useQuery } from "@tanstack/react-query";
import { CalendarClock, CheckCircle2, CircleAlert, FolderKanban, ListTodo, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isJarvisSupabaseConfigured, jarvisSupabase } from "@/integrations/supabase/jarvis-client";

type Project = { id: string; code: string; title: string; objective: string | null; phase: string; priority: number; next_action: string | null; next_action_at: string | null };
type Task = { id: string; code: string; title: string; status: string; priority: number; due_at: string | null; project_id: string | null };

const phaseLabel: Record<string, string> = { idea: "ideia", validation: "validação", planning: "planejamento", production: "produção", review: "revisão", published: "publicado", operation: "operação", maintenance: "manutenção", paused: "pausado", closed: "encerrado" };
const taskLabel: Record<string, string> = { backlog: "backlog", next: "próxima", in_progress: "em andamento", blocked: "bloqueada", waiting: "aguardando", done: "concluída", cancelled: "cancelada" };

export default function ProjectsWorkspace() {
  const workspace = useQuery({
    queryKey: ["jarvis-projects-workspace"],
    queryFn: async () => {
      if (!isJarvisSupabaseConfigured || !jarvisSupabase) throw new Error("JARVIS Supabase não configurado.");
      const client = jarvisSupabase;
      const [projects, tasks] = await Promise.all([
        client.from("jarvis_projects").select("id, code, title, objective, phase, priority, next_action, next_action_at").order("priority", { ascending: true }),
        client.from("jarvis_tasks").select("id, code, title, status, priority, due_at, project_id").neq("status", "done").neq("status", "cancelled").order("priority", { ascending: true }),
      ]);
      if (projects.error) throw projects.error;
      if (tasks.error) throw tasks.error;
      return { projects: (projects.data ?? []) as Project[], tasks: (tasks.data ?? []) as Task[] };
    },
  });

  const priorityTasks = workspace.data?.tasks.filter((task) => task.status !== "backlog") ?? [];
  return <div className="space-y-7">
    <section className="max-w-3xl"><Badge variant="secondary" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Operação rastreável</Badge><div className="mt-4 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><FolderKanban className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Portfólio JARVIS</p><h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Projetos e próximas ações</h1></div></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">Cada projeto preserva objetivo, prioridade e uma única próxima ação verificável. As tarefas evitam que uma intenção importante se perca entre ferramentas.</p></section>

    {workspace.isError && <Card className="border-amber-300 bg-amber-50/80"><CardContent className="flex gap-3 p-4 text-sm text-amber-950"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />Não foi possível confirmar projetos e tarefas no banco pessoal do JARVIS.</CardContent></Card>}

    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="border-border/70"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FolderKanban className="h-4 w-4 text-primary" />Projetos</CardTitle></CardHeader><CardContent className="space-y-3">
        {workspace.isLoading && <><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></>}
        {workspace.data?.projects.map((project) => <article key={project.id} className="rounded-xl border border-border/70 bg-background p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{project.title}</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">{project.code}</p></div><Badge variant="secondary">{phaseLabel[project.phase] ?? project.phase}</Badge></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.objective ?? "Objetivo ainda não detalhado."}</p><div className="mt-4 rounded-lg bg-primary/[0.05] p-3"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Próxima ação</p><p className="mt-1 text-sm">{project.next_action ?? "Definir próxima ação."}</p></div></article>)}
        {workspace.isSuccess && workspace.data.projects.length === 0 && <Empty message="Nenhum projeto registrado." />}
      </CardContent></Card>
      <Card className="border-border/70"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><ListTodo className="h-4 w-4 text-primary" />Fila de ação</CardTitle></CardHeader><CardContent className="space-y-2">
        {workspace.isLoading && <><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></>}
        {priorityTasks.map((task) => <article key={task.id} className="flex gap-3 rounded-xl border border-border/70 p-3"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">{task.priority}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{task.title}</p><Badge variant={task.status === "blocked" ? "destructive" : "secondary"}>{taskLabel[task.status] ?? task.status}</Badge></div><p className="mt-1 font-mono text-[11px] text-muted-foreground">{task.code}</p>{task.due_at && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" />{new Date(task.due_at).toLocaleDateString("pt-BR")}</p>}</div></article>)}
        {workspace.isSuccess && priorityTasks.length === 0 && <Empty message="Nenhuma ação prioritária pendente." />}
      </CardContent></Card>
    </section>
    <Card className="border-primary/20 bg-primary/[0.03]"><CardContent className="flex gap-3 p-5 text-sm leading-relaxed text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />A criação e alteração de projetos será a próxima camada, com confirmação humana e eventos de auditoria. Este painel já lê somente dados protegidos por RLS.</CardContent></Card>
  </div>;
}

function Empty({ message }: { message: string }) { return <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">{message}</div>; }
