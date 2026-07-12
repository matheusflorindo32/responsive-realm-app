import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, CheckCircle2, CircleAlert, FolderKanban, ListTodo, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { isJarvisSupabaseConfigured, jarvisSupabase } from "@/integrations/supabase/jarvis-client";

type Project = { id: string; code: string; title: string; objective: string | null; phase: string; priority: number; next_action: string | null; next_action_at: string | null };
type Task = { id: string; code: string; title: string; status: string; priority: number; due_at: string | null; project_id: string | null };
type ProjectForm = { code: string; title: string; objective: string; phase: string; priority: string; next_action: string };
type TaskForm = { project_id: string; code: string; title: string; status: string; priority: string; due_at: string };

const phaseLabel: Record<string, string> = { idea: "ideia", validation: "validação", planning: "planejamento", production: "produção", review: "revisão", published: "publicado", operation: "operação", maintenance: "manutenção", paused: "pausado", closed: "encerrado" };
const taskLabel: Record<string, string> = { backlog: "backlog", next: "próxima", in_progress: "em andamento", blocked: "bloqueada", waiting: "aguardando", done: "concluída", cancelled: "cancelada" };
const emptyProject: ProjectForm = { code: "", title: "", objective: "", phase: "planning", priority: "3", next_action: "" };
const emptyTask: TaskForm = { project_id: "unassigned", code: "", title: "", status: "next", priority: "3", due_at: "" };

export default function ProjectsWorkspace() {
  const queryClient = useQueryClient();
  const [projectOpen, setProjectOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProject);
  const [taskForm, setTaskForm] = useState<TaskForm>(emptyTask);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const workspace = useQuery({
    queryKey: ["jarvis-projects-workspace"],
    queryFn: async () => {
      if (!isJarvisSupabaseConfigured || !jarvisSupabase) throw new Error("JARVIS Supabase não configurado.");
      const [projects, tasks] = await Promise.all([
        jarvisSupabase.from("jarvis_projects").select("id, code, title, objective, phase, priority, next_action, next_action_at").order("priority", { ascending: true }),
        jarvisSupabase.from("jarvis_tasks").select("id, code, title, status, priority, due_at, project_id").neq("status", "done").neq("status", "cancelled").order("priority", { ascending: true }),
      ]);
      if (projects.error) throw projects.error;
      if (tasks.error) throw tasks.error;
      return { projects: (projects.data ?? []) as Project[], tasks: (tasks.data ?? []) as Task[] };
    },
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["jarvis-projects-workspace"] });
  const createProject = useMutation({
    mutationFn: async (form: ProjectForm) => {
      if (!jarvisSupabase) throw new Error("JARVIS Supabase não configurado.");
      const { error } = await jarvisSupabase.from("jarvis_projects").insert({ code: form.code.trim().toUpperCase(), title: form.title.trim(), objective: form.objective.trim() || null, phase: form.phase, priority: Number(form.priority), next_action: form.next_action.trim() || null });
      if (error) throw error;
    },
    onSuccess: () => { refresh(); setProjectOpen(false); setProjectForm(emptyProject); toast.success("Projeto criado e registrado na auditoria."); },
    onError: (error: Error) => toast.error(error.message),
  });
  const createTask = useMutation({
    mutationFn: async (form: TaskForm) => {
      if (!jarvisSupabase) throw new Error("JARVIS Supabase não configurado.");
      const { error } = await jarvisSupabase.from("jarvis_tasks").insert({ project_id: form.project_id === "unassigned" ? null : form.project_id, code: form.code.trim().toUpperCase(), title: form.title.trim(), status: form.status, priority: Number(form.priority), due_at: form.due_at ? new Date(form.due_at + "T12:00:00").toISOString() : null });
      if (error) throw error;
    },
    onSuccess: () => { refresh(); setTaskOpen(false); setTaskForm(emptyTask); toast.success("Tarefa criada e registrada na auditoria."); },
    onError: (error: Error) => toast.error(error.message),
  });
  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      if (!jarvisSupabase) throw new Error("JARVIS Supabase não configurado.");
      const { error } = await jarvisSupabase.from("jarvis_tasks").delete().eq("id", taskId);
      if (error) throw error;
    },
    onSuccess: () => { refresh(); setTaskToDelete(null); toast.success("Tarefa excluída e registrada na auditoria."); },
    onError: (error: Error) => toast.error(error.message),
  });
  const priorityTasks = workspace.data?.tasks.filter((task) => task.status !== "backlog") ?? [];
  return <div className="space-y-7">
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div className="max-w-3xl"><Badge variant="secondary" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Operação rastreável</Badge><div className="mt-4 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><FolderKanban className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Portfólio JARVIS</p><h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Projetos e próximas ações</h1></div></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">Registre somente o que já tem intenção e próxima ação. Cada criação fica vinculada ao seu acesso administrativo e entra na trilha de auditoria.</p></div><div className="flex flex-wrap gap-2"><ProjectDialog open={projectOpen} onOpenChange={setProjectOpen} form={projectForm} setForm={setProjectForm} save={createProject} /><TaskDialog open={taskOpen} onOpenChange={setTaskOpen} form={taskForm} setForm={setTaskForm} projects={workspace.data?.projects ?? []} save={createTask} /></div></section>
    {workspace.isError && <Card className="border-amber-300 bg-amber-50/80"><CardContent className="flex gap-3 p-4 text-sm text-amber-950"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />Não foi possível confirmar projetos e tarefas no banco pessoal do JARVIS.</CardContent></Card>}
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"><Card className="border-border/70"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FolderKanban className="h-4 w-4 text-primary" />Projetos</CardTitle></CardHeader><CardContent className="space-y-3">{workspace.isLoading && <><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></>}{workspace.data?.projects.map((project) => <article key={project.id} className="rounded-xl border border-border/70 bg-background p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{project.title}</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">{project.code}</p></div><Badge variant="secondary">{phaseLabel[project.phase] ?? project.phase}</Badge></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.objective ?? "Objetivo ainda não detalhado."}</p><div className="mt-4 rounded-lg bg-primary/[0.05] p-3"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Próxima ação</p><p className="mt-1 text-sm">{project.next_action ?? "Definir próxima ação."}</p></div></article>)}{workspace.isSuccess && workspace.data.projects.length === 0 && <Empty message="Nenhum projeto registrado." />}</CardContent></Card><Card className="border-border/70"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><ListTodo className="h-4 w-4 text-primary" />Fila de ação</CardTitle></CardHeader><CardContent className="space-y-2">{workspace.isLoading && <><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></>}{priorityTasks.map((task) => <article key={task.id} className="flex gap-3 rounded-xl border border-border/70 p-3"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">{task.priority}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{task.title}</p><Badge variant={task.status === "blocked" ? "destructive" : "secondary"}>{taskLabel[task.status] ?? task.status}</Badge></div><p className="mt-1 font-mono text-[11px] text-muted-foreground">{task.code}</p>{task.due_at && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" />{new Date(task.due_at).toLocaleDateString("pt-BR")}</p>}</div><Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => setTaskToDelete(task)} aria-label={`Excluir tarefa ${task.title}`}><Trash2 className="h-4 w-4" /></Button></article>)}{workspace.isSuccess && priorityTasks.length === 0 && <Empty message="Nenhuma ação prioritária pendente." />}</CardContent></Card></section>
    <Card className="border-primary/20 bg-primary/[0.03]"><CardContent className="flex gap-3 p-5 text-sm leading-relaxed text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Projetos e tarefas criados aqui são protegidos por RLS, exigem o seu MFA administrativo e geram um evento de auditoria no banco pessoal do JARVIS.</CardContent></Card>
    <AlertDialog open={Boolean(taskToDelete)} onOpenChange={(open) => { if (!open && !deleteTask.isPending) setTaskToDelete(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir esta tarefa?</AlertDialogTitle><AlertDialogDescription>A tarefa “{taskToDelete?.title}” será removida da fila. A exclusão ficará registrada na auditoria do JARVIS.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={deleteTask.isPending}>Cancelar</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteTask.isPending} onClick={(event) => { event.preventDefault(); if (taskToDelete) deleteTask.mutate(taskToDelete.id); }}>{deleteTask.isPending ? "Excluindo…" : "Excluir tarefa"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}
function ProjectDialog({ open, onOpenChange, form, setForm, save }: { open: boolean; onOpenChange: (open: boolean) => void; form: ProjectForm; setForm: (form: ProjectForm) => void; save: ReturnType<typeof useMutation<void, Error, ProjectForm>> }) { return <Dialog open={open} onOpenChange={(value) => { onOpenChange(value); if (!value) setForm(emptyProject); }}><DialogTrigger asChild><Button onClick={() => setForm(emptyProject)}><Plus className="mr-2 h-4 w-4" />Novo projeto</Button></DialogTrigger><DialogContent className="max-w-xl"><DialogHeader><DialogTitle>Novo projeto</DialogTitle></DialogHeader><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); save.mutate(form); }}><div className="grid gap-4 sm:grid-cols-2"><Field label="Código"><Input required placeholder="JARVIS-002" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.replace(/s+/g, "-") })} /></Field><Field label="Prioridade"><PrioritySelect value={form.priority} onChange={(priority) => setForm({ ...form, priority })} /></Field></div><Field label="Título"><Input required placeholder="Nome claro do projeto" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field><Field label="Objetivo"><Textarea rows={3} placeholder="Resultado que este projeto precisa gerar" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Fase"><Select value={form.phase} onValueChange={(phase) => setForm({ ...form, phase })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(phaseLabel).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></Field><Field label="Próxima ação"><Input placeholder="Ação pequena e verificável" value={form.next_action} onChange={(e) => setForm({ ...form, next_action: e.target.value })} /></Field></div><Button className="w-full" disabled={save.isPending} type="submit">{save.isPending ? "Criando…" : "Criar projeto"}</Button></form></DialogContent></Dialog>; }
function TaskDialog({ open, onOpenChange, form, setForm, projects, save }: { open: boolean; onOpenChange: (open: boolean) => void; form: TaskForm; setForm: (form: TaskForm) => void; projects: Project[]; save: ReturnType<typeof useMutation<void, Error, TaskForm>> }) { return <Dialog open={open} onOpenChange={(value) => { onOpenChange(value); if (!value) setForm(emptyTask); }}><DialogTrigger asChild><Button variant="outline" onClick={() => setForm(emptyTask)}><Plus className="mr-2 h-4 w-4" />Nova tarefa</Button></DialogTrigger><DialogContent className="max-w-xl"><DialogHeader><DialogTitle>Nova tarefa</DialogTitle></DialogHeader><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); save.mutate(form); }}><div className="grid gap-4 sm:grid-cols-2"><Field label="Código"><Input required placeholder="JARVIS-002-01" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.replace(/s+/g, "-") })} /></Field><Field label="Projeto"><Select value={form.project_id} onValueChange={(project_id) => setForm({ ...form, project_id })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="unassigned">Sem projeto</SelectItem>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.code} · {project.title}</SelectItem>)}</SelectContent></Select></Field></div><Field label="Título"><Input required placeholder="Ação pequena e verificável" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field><div className="grid gap-4 sm:grid-cols-3"><Field label="Status"><Select value={form.status} onValueChange={(status) => setForm({ ...form, status })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(taskLabel).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></Field><Field label="Prioridade"><PrioritySelect value={form.priority} onChange={(priority) => setForm({ ...form, priority })} /></Field><Field label="Prazo"><Input type="date" value={form.due_at} onChange={(e) => setForm({ ...form, due_at: e.target.value })} /></Field></div><Button className="w-full" disabled={save.isPending} type="submit">{save.isPending ? "Criando…" : "Criar tarefa"}</Button></form></DialogContent></Dialog>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }
function PrioritySelect({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <Select value={value} onValueChange={onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1, 2, 3, 4, 5].map((priority) => <SelectItem key={priority} value={String(priority)}>P{priority} {priority === 1 ? "· crítica" : priority === 2 ? "· alta" : priority === 3 ? "· normal" : "· baixa"}</SelectItem>)}</SelectContent></Select>; }
function Empty({ message }: { message: string }) { return <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">{message}</div>; }
