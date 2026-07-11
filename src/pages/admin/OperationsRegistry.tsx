import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Bot, BookOpen, CircleAlert, ExternalLink, MonitorCog, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isJarvisSupabaseConfigured, jarvisSupabase } from "@/integrations/supabase/jarvis-client";

type RegistryKind = "agents" | "skills" | "systems";

const config = {
  agents: {
    title: "Agentes",
    eyebrow: "Equipe digital",
    description: "Responsabilidades claras, limites de atuação e estado de cada agente antes de qualquer automação.",
    table: "jarvis_agents",
    icon: Bot,
    empty: "Nenhum agente foi registrado ainda.",
  },
  skills: {
    title: "Skills",
    eyebrow: "Biblioteca operacional",
    description: "Habilidades reutilizáveis que o JARVIS seleciona conforme a intenção, o risco e o tipo de entrega.",
    table: "jarvis_skills",
    icon: BookOpen,
    empty: "Nenhuma skill foi registrada ainda.",
  },
  systems: {
    title: "Sites & sistemas",
    eyebrow: "Mapa tecnológico",
    description: "Sistemas, repositórios e provedores com origem, responsabilidade e estado operacional visíveis.",
    table: "jarvis_systems",
    icon: MonitorCog,
    empty: "Nenhum sistema foi registrado ainda.",
  },
} as const;

const sections: { id: RegistryKind; to: string; label: string }[] = [
  { id: "agents", to: "/admin/agentes", label: "Agentes" },
  { id: "skills", to: "/admin/skills", label: "Skills" },
  { id: "systems", to: "/admin/sistemas", label: "Sistemas" },
];

export default function OperationsRegistry({ kind }: { kind: RegistryKind }) {
  const current = config[kind];
  const Icon = current.icon;
  const registry = useQuery({
    queryKey: ["jarvis-registry", kind],
    queryFn: async () => {
      if (!isJarvisSupabaseConfigured || !jarvisSupabase) throw new Error("JARVIS Supabase não configurado.");
      const { data, error } = await jarvisSupabase.from(current.table).select("*").order("title", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-7">
      <section className="max-w-3xl">
        <Badge variant="secondary" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Registro controlado</Badge>
        <div className="mt-4 flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{current.eyebrow}</p><h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{current.title}</h1></div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{current.description}</p>
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="Registros operacionais">
        {sections.map((section) => <Button key={section.id} asChild size="sm" variant={section.id === kind ? "default" : "outline"}><Link to={section.to}>{section.label}</Link></Button>)}
      </nav>

      {registry.isError && <Card className="border-amber-300 bg-amber-50/80"><CardContent className="flex gap-3 p-4 text-sm text-amber-950"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><span>O registro não foi confirmado pelo banco. Verifique a sessão administrativa e a configuração do JARVIS Supabase.</span></CardContent></Card>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {registry.isLoading && Array.from({ length: 6 }).map((_, index) => <Card key={index}><CardContent className="space-y-3 p-5"><Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-2/3" /><Skeleton className="h-12 w-full" /></CardContent></Card>)}
        {registry.isSuccess && registry.data.length === 0 && <Card className="border-dashed md:col-span-2 xl:col-span-3"><CardContent className="p-8 text-center"><Sparkles className="mx-auto h-5 w-5 text-primary" /><p className="mt-3 font-medium">{current.empty}</p><p className="mt-1 text-sm text-muted-foreground">A primeira inclusão será registrada no banco pessoal do JARVIS e ficará sujeita às políticas administrativas.</p></CardContent></Card>}
        {registry.data?.map((item: Record<string, unknown>) => <RegistryCard key={String(item.id)} item={item} kind={kind} />)}
      </section>

      <Card className="border-primary/20 bg-primary/[0.03]"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><RefreshCw className="h-4 w-4 text-primary" />Próxima evolução</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-muted-foreground">A inclusão e edição entrarão com trilha de auditoria, confirmação explícita e validação de campos. Nesta etapa o painel é deliberadamente somente leitura.</CardContent></Card>
    </div>
  );
}

function RegistryCard({ item, kind }: { item: Record<string, unknown>; kind: RegistryKind }) {
  const title = String(item.title ?? item.name ?? "Sem título");
  const detail = kind === "agents" ? item.responsibility : kind === "skills" ? item.purpose : item.provider;
  const link = kind === "systems" ? (item.public_url ?? item.repository_url) : null;
  return <Card className="border-border/70 bg-card transition hover:border-primary/30 hover:shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><Badge variant={item.status === "active" ? "default" : "secondary"}>{String(item.status ?? "draft")}</Badge><code className="max-w-[12rem] truncate text-[11px] text-muted-foreground">{String(item.slug ?? item.code ?? "")}</code></div><h2 className="mt-4 font-semibold tracking-tight">{title}</h2><p className="mt-2 min-h-10 text-sm leading-relaxed text-muted-foreground">{String(detail ?? "Sem descrição operacional registrada.")}</p>{link && typeof link === "string" && <a href={link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">Abrir referência <ExternalLink className="h-3.5 w-3.5" /></a>}</CardContent></Card>;
}
