import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  FolderKanban,
  GraduationCap,
  Megaphone,
  MonitorCog,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type LaunchPath = {
  id: string;
  label: string;
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  skills: string[];
  agents: string[];
  needs: string;
};

const launchPaths: LaunchPath[] = [
  {
    id: "conteudo",
    label: "Conteúdo",
    title: "Transformar uma ideia em conteúdo",
    description: "Partir de uma fonte, aula ou projeto e criar a peça-mestre para os canais certos.",
    to: "/admin/conteudo",
    icon: Megaphone,
    skills: ["Produção multicanal", "Revisão de evidências"],
    agents: ["Curadoria editorial", "Revisão de qualidade"],
    needs: "Escolha uma fonte, uma ideia ou um objetivo de audiência.",
  },
  {
    id: "curso",
    label: "Curso",
    title: "Criar ou atualizar um curso",
    description: "Organizar objetivo, trilha, materiais, alunos e próxima entrega sem começar por uma tela em branco.",
    to: "/admin/ensino",
    icon: GraduationCap,
    skills: ["Gestão de clientes e alunos", "Operação de produtos digitais"],
    agents: ["Estrutura pedagógica", "Qualidade de material"],
    needs: "Defina público, transformação educacional e formato da entrega.",
  },
  {
    id: "projeto",
    label: "Projeto",
    title: "Planejar um projeto",
    description: "Converter uma intenção em escopo, próximo passo, evidência, risco e responsável.",
    to: "/admin/projetos",
    icon: FolderKanban,
    skills: ["Orquestração do ecossistema", "Gestão de portfólio digital"],
    agents: ["Orquestrador JARVIS", "Revisão de risco"],
    needs: "Informe o resultado observável que você quer alcançar.",
  },
  {
    id: "pesquisa",
    label: "Pesquisa",
    title: "Investigar ou revisar evidências",
    description: "Organizar fontes, método, lacunas, citações e um entregável acadêmico rastreável.",
    to: "/admin/pesquisa",
    icon: FileSearch,
    skills: ["Revisão de evidências científicas", "Documentos premium"],
    agents: ["Pesquisa e evidências", "Revisão por pares"],
    needs: "Adicione a pergunta, documento ou fonte inicial.",
  },
  {
    id: "sistema",
    label: "Sistema",
    title: "Melhorar um site ou sistema",
    description: "Definir a experiência, selecionar componentes e abrir uma melhoria segura em branch.",
    to: "/admin/sistemas",
    icon: MonitorCog,
    skills: ["Frontend Elite 21st", "Gestão de portfólio digital"],
    agents: ["Direção de interface", "QA de acessibilidade"],
    needs: "Selecione o sistema, a rota e a ação que precisa melhorar.",
  },
  {
    id: "pendencia",
    label: "Pendência",
    title: "Resolver uma pendência importante",
    description: "Encontrar o que está bloqueado e transformar em uma sequência pequena e verificável de ações.",
    to: "/admin/inbox",
    icon: ClipboardCheck,
    skills: ["Orquestração do ecossistema"],
    agents: ["Triagem operacional"],
    needs: "Diga o que está travado ou escolha uma pendência existente.",
  },
];

export default function AdminStart() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(launchPaths[0].id);
  const selected = launchPaths.find((path) => path.id === selectedId) ?? launchPaths[0];

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-1"><Sparkles className="h-3.5 w-3.5" />Iniciador JARVIS</Badge>
          <span className="text-xs text-muted-foreground">Escolha por intenção, não por ferramenta.</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">O que você quer movimentar?</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Este espaço organiza o próximo passo, mostra as skills e os agentes envolvidos e só então abre o módulo certo. Nenhuma integração externa é acionada aqui.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Caminhos de início rápido">
        {launchPaths.map((path) => {
          const Icon = path.icon;
          const isSelected = path.id === selected.id;
          return (
            <button
              key={path.id}
              type="button"
              onClick={() => setSelectedId(path.id)}
              aria-pressed={isSelected}
              className={`group rounded-2xl border p-5 text-left transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isSelected ? "border-primary bg-primary/[0.06] shadow-sm" : "border-border/70 bg-card hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" aria-label="Selecionado" />}
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{path.label}</p>
              <h2 className="mt-2 font-semibold tracking-tight">{path.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{path.description}</p>
            </button>
          );
        })}
      </section>

      <Card className="border-primary/20 bg-card shadow-sm">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Plano sugerido</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{selected.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{selected.needs}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => navigate(selected.to)}><ArrowRight className="mr-2 h-4 w-4" />Abrir espaço de trabalho</Button>
              <Button asChild variant="ghost"><Link to="/admin/hoje"><ArrowLeft className="mr-2 h-4 w-4" />Voltar para Hoje</Link></Button>
            </div>
          </div>
          <div className="grid gap-4 rounded-xl border border-border/70 bg-background/70 p-4 sm:grid-cols-2 lg:grid-cols-1">
            <PlanGroup label="Skills selecionadas" values={selected.skills} icon={BookOpen} />
            <PlanGroup label="Agentes de apoio" values={selected.agents} icon={Sparkles} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PlanGroup({ label, values, icon: Icon }: { label: string; values: string[]; icon: LucideIcon }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => <Badge key={value} variant="secondary">{value}</Badge>)}
      </div>
    </div>
  );
}
