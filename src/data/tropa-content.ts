import {
  Brain,
  BarChart3,
  Shield,
  Radar,
  GraduationCap,
  FlaskConical,
  Code2,
  Zap,
  PlayCircle,
  Image as ImageIcon,
  FileText,
  BookOpen,
  Rocket,
  ClipboardList,
  Youtube,
  Instagram,
  Linkedin,
  Sparkles,
  Layers,
  Cpu,
  Eye,
  Lightbulb,
} from "lucide-react";

type Area = {
  icon: typeof Brain;
  title: string;
  text: string;
  span?: string;
};

export const areas: readonly Area[] = [
  { icon: Brain, title: "Inteligência Artificial", text: "Modelos, LLMs e IA aplicada a problemas reais.", span: "md:col-span-2" },
  { icon: BarChart3, title: "Ciência de Dados", text: "Análise, visualização e engenharia de dados." },
  { icon: Shield, title: "Segurança Pública", text: "Tecnologia, dados e política a serviço da sociedade." },
  { icon: Radar, title: "Drones & Tecnologia Operacional", text: "Sensoriamento, mapeamento e sistemas embarcados." },
  { icon: GraduationCap, title: "Educação Científica", text: "Divulgação e formação em linguagem acessível.", span: "md:col-span-2" },
  { icon: FlaskConical, title: "Pesquisa Aplicada", text: "Do laboratório ao mundo real, com rigor e método." },
  { icon: Code2, title: "Desenvolvimento Web", text: "Aplicações, dashboards e produtos digitais." },
  { icon: Zap, title: "Automação & Ferramentas", text: "Processos otimizados por código e IA." },
];


export const contents = [
  { icon: PlayCircle, title: "Vídeos educativos", text: "Explicações visuais de conceitos técnicos." },
  { icon: ImageIcon, title: "Infográficos", text: "Ciência em uma imagem." },
  { icon: FileText, title: "Análises técnicas", text: "Ferramentas, papers e tendências dissecadas." },
  { icon: BookOpen, title: "Artigos e guias", text: "Materiais aprofundados de referência." },
  { icon: Rocket, title: "Projetos digitais", text: "Código aberto e experimentos reais." },
  { icon: ClipboardList, title: "Estudos aplicados", text: "Casos e resultados com dados." },
  { icon: Youtube, title: "YouTube", text: "Séries longas e reviews técnicos." },
  { icon: Instagram, title: "Instagram", text: "Insights rápidos e reels científicos." },
  { icon: Linkedin, title: "LinkedIn", text: "Reflexões e produção autoral." },
] as const;

export const benefits = [
  { icon: Sparkles, title: "Técnico, mas acessível", text: "Linguagem simples sem perder a profundidade." },
  { icon: Layers, title: "Ciência + prática", text: "Do conceito à aplicação, sempre com contexto." },
  { icon: Cpu, title: "IA aplicada", text: "Casos reais de uso, não apenas hype." },
  { icon: Shield, title: "Segurança pública", text: "Tecnologia a serviço de decisões públicas." },
  { icon: GraduationCap, title: "Educação digital", text: "Materiais que respeitam o tempo e a inteligência." },
  { icon: Eye, title: "Análise crítica", text: "Curadoria com senso crítico e evidência." },
] as const;

export const tech = [
  "IA Generativa",
  "Python",
  "React",
  "Análise de Dados",
  "Drones",
  "Automação",
  "Cloud",
  "Pesquisa Científica",
  "Segurança Pública",
  "Educação Digital",
] as const;

export const authorityIcon = Lightbulb;
