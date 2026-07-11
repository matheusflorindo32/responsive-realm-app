import { Link } from "react-router-dom";
import { ArrowRight, Bot, BookOpen, CheckCircle2, FolderKanban, MonitorCog, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Projetos", value: "1", icon: FolderKanban },
  { label: "Tarefas abertas", value: "1", icon: PlayCircle },
  { label: "Skills", value: "11", icon: BookOpen },
  { label: "Agentes", value: "7", icon: Bot },
];

export default function JarvisPreview() {
  return <main className="theme-tropa min-h-screen bg-background text-foreground"><div className="mx-auto max-w-7xl px-4 py-7 md:px-7 md:py-10">
    <header className="mb-10 flex flex-wrap items-center justify-between gap-4"><Link to="/" className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></div><div><p className="font-semibold tracking-tight">JARVIS OS</p><p className="text-xs text-muted-foreground">Command Center</p></div></Link><Badge variant="secondary" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Demonstração visual · dados simulados</Badge></header>

    <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]"><Card className="border-primary/20 bg-card shadow-sm"><CardContent className="p-6 md:p-9"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">JARVIS Command Center</p><h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-6xl">Menos abas. Mais decisões concluídas.</h1><p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">Um painel privado para conectar projetos, conhecimento, agentes, sistemas e próximas ações com controle humano.</p><div className="mt-7 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/admin/auth">Acessar ambiente privado <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild variant="outline" size="lg"><a href="#projetos">Ver estrutura</a></Button></div></CardContent></Card>
      <Card><CardHeader className="pb-3"><CardTitle className="text-base">Agora</CardTitle></CardHeader><CardContent className="space-y-4"><PreviewAction index="1" title="Ativar conta administrativa" text="Cadastrar conta, validar e-mail e configurar MFA AAL2." /><PreviewAction index="2" title="Organizar primeira frente" text="Escolher projeto e definir uma próxima ação verificável." /><PreviewAction index="3" title="Conectar com segurança" text="Integrar vault, agenda e e-mail somente após os portões de proteção." /></CardContent></Card></section>

    <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(({ label, value, icon: Icon }) => <Card key={label} className="bg-card/80"><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label}</span><Icon className="h-4 w-4 text-primary" /></div><p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p></CardContent></Card>)}</section>

    <section id="projetos" className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><FolderKanban className="h-4 w-4 text-primary" />Projeto prioritário</CardTitle></CardHeader><CardContent><article className="rounded-xl border border-border/70 bg-background p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">JARVIS Command Center</p><p className="mt-1 font-mono text-xs text-muted-foreground">JARVIS-OS</p></div><Badge>produção</Badge></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Centralizar decisões, projetos, conhecimento, agentes e operação digital com segurança e rastreabilidade.</p><div className="mt-5 rounded-lg bg-primary/[0.06] p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Próxima ação</p><p className="mt-1 text-sm">Criar primeira conta administrativa e validar MFA AAL2.</p></div></article></CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-4 w-4 text-primary" />Equipe digital</CardTitle></CardHeader><CardContent className="space-y-3"><MiniRow icon={Bot} title="JARVIS Orchestrator" detail="Seleciona fluxo, skills e controles." /><MiniRow icon={BookOpen} title="Research Reviewer" detail="Evidências e revisão científica." /><MiniRow icon={MonitorCog} title="Frontend Director" detail="Experiência, acessibilidade e interface." /></CardContent></Card></section>

    <p className="mt-8 text-center text-xs text-muted-foreground">Prévia pública sem dados pessoais, sem conexão com o vault e sem acesso administrativo.</p>
  </div></main>;
}

function PreviewAction({ index, title, text }: { index: string; title: string; text: string }) { return <div className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">{index}</span><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p></div></div>; }
function MiniRow({ icon: Icon, title, detail }: { icon: typeof Bot; title: string; detail: string }) { return <div className="flex gap-3 rounded-xl border border-border/70 p-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div><CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-600" /></div>; }
