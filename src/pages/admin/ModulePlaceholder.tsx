import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  CalendarDays,
  DatabaseZap,
  FileSearch,
  FolderKanban,
  Inbox,
  Megaphone,
  MonitorCog,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const modules = {
  projetos: { title: "Projetos", description: "Portfólio, prioridade, prazo, responsável, próxima ação e vínculos com GitHub, site e vault.", icon: FolderKanban },
  relacionamentos: { title: "Clientes & alunos", description: "CRM, entregas, suporte, turmas, progresso, caderno de erros e retenção.", icon: Users },
  conteudo: { title: "Conteúdo multicanal", description: "Uma peça-mestre distribuída para YouTube, Instagram, LinkedIn e X com métricas e CTA.", icon: Megaphone },
  pesquisa: { title: "Pesquisa & evidências", description: "Artigos, fontes, claims, revisão, DOI, ABNT e prontidão de publicação.", icon: FileSearch },
  agentes: { title: "Agentes", description: "Tarefas, ferramentas, custos, última execução, qualidade, permissões e falhas.", icon: Bot },
  sistemas: { title: "Sites & sistemas", description: "URLs, repositórios, deploys, domínios, bancos, custos, receita e incidentes.", icon: MonitorCog },
  agenda: { title: "Agenda", description: "Visão consolidada dos compromissos e prazos. Integrações começam em modo leitura.", icon: CalendarDays },
  inbox: { title: "Caixa de entrada", description: "Triagem de mensagens e pendências sem envio automático.", icon: Inbox },
  vault: { title: "Vault JARVIS", description: "Exportações validadas, revisões, checksums, conflitos e histórico de sincronização.", icon: DatabaseZap },
  metricas: { title: "Métricas", description: "Projetos, alunos, conteúdo, produtos, receita e saúde tecnológica.", icon: BarChart3 },
  riscos: { title: "Riscos & auditoria", description: "Riscos científicos, jurídicos, financeiros, reputacionais, técnicos e de prazo.", icon: ShieldAlert },
} satisfies Record<string, { title: string; description: string; icon: LucideIcon }>;

export type ModuleKey = keyof typeof modules;

export default function ModulePlaceholder({ module }: { module: ModuleKey }) {
  const item = modules[module];
  const Icon = item.icon;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">JARVIS OS</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight">{item.title}</h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{item.description}</p>
      </div>

      <Card className="border-dashed border-primary/30 bg-primary/[0.03]">
        <CardContent className="p-8 text-center">
          <Badge variant="secondary">Fundação instalada</Badge>
          <h2 className="mt-4 text-lg font-semibold">Módulo preparado para integração incremental</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Primeiro validaremos o modelo e as permissões com dados de teste. Automações e conectores externos só entram depois dos portões de segurança.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
