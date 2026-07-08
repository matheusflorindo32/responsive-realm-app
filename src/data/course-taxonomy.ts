import {
  Shield, Dog, HeartPulse, Dumbbell, Leaf, Cpu, Plane, BookOpen, BarChart3, Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Course } from "@/data/types";

export type CompetencyId =
  | "seguranca" | "cinotecnia" | "aph" | "performance" | "ambiental"
  | "tech" | "drones" | "pesquisa" | "gestao" | "outros";

export interface Competency {
  id: CompetencyId;
  label: string;
  short: string;
  icon: LucideIcon;
  description: string;
  keywords: RegExp[];
}

// Ordem semântica (autoridade científica primeiro, depois operacional, técnico, gestão)
export const COMPETENCIES: Competency[] = [
  {
    id: "pesquisa",
    label: "Pesquisa Científica",
    short: "Pesquisa",
    icon: BookOpen,
    description: "Produção acadêmica, grupos de pesquisa, congressos, monitorias e eventos científicos.",
    keywords: [
      /pesquisa/i, /cient[ií]fic/i, /congress?o/i, /simp[oó]sio/i, /semin[aá]rio/i,
      /monitoria/i, /artigo/i, /public/i, /iniciac/i, /extens[aã]o universit/i,
      /tutoria de educa/i, /neuroeduca/i, /didática/i, /formação de professor/i,
    ],
  },
  {
    id: "tech",
    label: "Tecnologia, IA & Dados",
    short: "Tech & IA",
    icon: Cpu,
    description: "Desenvolvimento, ciência de dados, inteligência artificial, ML/DL e engenharia de prompt.",
    keywords: [
      /intelig[eê]ncia artificial/i, /\bia\b/i, /\bai\b/i, /\bml\b/i, /machine learning/i,
      /deep learning/i, /generative/i, /generativa/i, /openai/i, /google/i, /python/i,
      /\bsql\b/i, /banco de dados/i, /power ?bi/i, /business intelligence/i,
      /realidade virtual/i, /pensamento computa/i, /computa[cç][aã]o/i, /cloud/i,
      /desenvolvimento web/i, /\bads\b/i, /\bgit\b/i, /github/i, /microsoft/i, /prompt/i,
      /bootcamp/i, /engenharia de dados/i, /ci[eê]ncia de dados/i, /designer gr[aá]fico/i,
      /recursos tecnol[oó]gicos/i, /tecnol[oó]gic/i, /pesquisa cl[ií]nica/i,
    ],
  },
  {
    id: "drones",
    label: "Drones & Geotecnologias",
    short: "Drones & GEO",
    icon: Plane,
    description: "Operações com drones, aerofotogrametria, sensoriamento remoto, GIS e cartografia.",
    keywords: [
      /drone/i, /rpas/i, /aerofotogram/i, /sensoriamento remoto/i,
      /geoprocessamento/i, /cartografia/i, /\bgis\b/i, /topografia/i,
      /geopol[ií]tic/i, /aeroesp/i, /google ?hear?th/i, /geografia/i, /censo demogr/i,
    ],
  },
  {
    id: "aph",
    label: "APH & Medicina Tática",
    short: "APH",
    icon: HeartPulse,
    description: "Atendimento pré-hospitalar, TCCC/TECC, Stop the Bleed, urgência e emergência.",
    keywords: [
      /\baph\b/i, /pr[eé][- ]hospitalar/i, /tccc/i, /tecc/i, /stop the bleed/i,
      /primeiros socorros/i, /urg[eê]ncia/i, /emerg[eê]ncia/i, /suporte b[aá]sico de vida/i,
      /\bsbv\b/i, /\bacls\b/i, /medicina t[aá]tica/i, /diabetes/i, /resgate/i,
    ],
  },
  {
    id: "cinotecnia",
    label: "Cinotecnia",
    short: "Cinotecnia",
    icon: Dog,
    description: "Emprego operacional de cães: adestramento, faro, busca e salvamento, patrulha K9.",
    keywords: [
      /cinotecnia/i, /\bc[aã]es?\b/i, /\bcanina\b/i, /\bk9\b/i, /adestr/i, /faro/i,
    ],
  },
  {
    id: "seguranca",
    label: "Segurança Pública & Operações",
    short: "Segurança",
    icon: Shield,
    description: "Formação militar, polícia militar, ações táticas, patrulhamento e cursos operacionais.",
    keywords: [
      /pol[ií]cia/i, /policial/i, /\bpmes\b/i, /militar/i, /marinha/i, /fuzileir/i,
      /a[cç][oõ]es t[aá]ticas/i, /t[aá]tic/i, /patrulha/i, /opera[cç][aã]o/i, /operaciona/i,
      /forma[cç][aã]o de soldado/i, /tiro/i, /fuzil/i, /explosiv/i, /viatura/i,
      /conduto?r? de ve[ií]culo/i, /viol[eê]ncia contra mulher/i, /seguran[cç]a p[uú]blica/i,
      /pol[ií]cia federal/i, /\bdpf\b/i, /especial/i,
    ],
  },
  {
    id: "performance",
    label: "Educação Física & Performance",
    short: "Performance",
    icon: Dumbbell,
    description: "Bacharelado, fisiologia do exercício, preparação física, treinamento e avaliação.",
    keywords: [
      /educa[cç][aã]o f[ií]sica/i, /bachar[eê]l/i, /fisiologia/i, /exerc[ií]cio/i,
      /muscula[cç][aã]o/i, /treinamento/i, /performance/i, /avalia[cç][aã]o f[ií]sica/i,
      /prepara[cç][aã]o f[ií]sica/i, /esporte/i, /pr[aá]ticas corporais/i, /aba liberta/i,
      /comportamento aplicad/i, /grupos especiais/i,
    ],
  },
  {
    id: "ambiental",
    label: "Ambiental & Sustentabilidade",
    short: "Ambiental",
    icon: Leaf,
    description: "Gestão ambiental, educação ambiental, políticas públicas e meio ambiente.",
    keywords: [
      /ambient/i, /meio ambiente/i, /sustentab/i, /\ba3p\b/i, /ecolog/i, /clima/i,
    ],
  },
  {
    id: "gestao",
    label: "Gestão, Liderança & Qualidade",
    short: "Gestão",
    icon: BarChart3,
    description: "Six Sigma, gestão pública, liderança, planejamento estratégico e administração.",
    keywords: [
      /six sigma/i, /gest[aã]o p[uú]blica/i, /gest[aã]o/i, /lideran[cç]a/i,
      /planejamento estrat/i, /administra[cç][aã]o/i, /\bmba\b/i, /qualidade/i,
    ],
  },
  {
    id: "outros",
    label: "Outros",
    short: "Outros",
    icon: Sparkles,
    description: "Cursos complementares que não se encaixam nas competências acima.",
    keywords: [],
  },
];

const COMP_BY_ID = new Map(COMPETENCIES.map((c) => [c.id, c]));

export function getCompetency(id: CompetencyId): Competency {
  return COMP_BY_ID.get(id) ?? COMPETENCIES[COMPETENCIES.length - 1];
}

/**
 * Classifica um curso em uma competência.
 * Regra: itera na ordem de COMPETENCIES e devolve o primeiro match.
 * A ordem foi escolhida para resolver ambiguidades naturalmente
 * (ex.: "pesquisa clínica" cai em pesquisa antes de tech; "cães" cai em
 * cinotecnia antes de segurança).
 */
export function classifyCourse(c: Pick<Course, "course" | "institution" | "tags" | "category">): CompetencyId {
  const hay = [
    c.course ?? "",
    c.institution ?? "",
    (c.tags ?? []).join(" "),
    c.category ?? "",
  ].join(" · ").normalize("NFC");
  for (const comp of COMPETENCIES) {
    if (comp.id === "outros") continue;
    if (comp.keywords.some((rx) => rx.test(hay))) return comp.id;
  }
  return "outros";
}

export interface GroupedCompetency {
  competency: Competency;
  courses: Course[];
}

export function groupCoursesByCompetency(courses: Course[]): GroupedCompetency[] {
  const bucket = new Map<CompetencyId, Course[]>();
  for (const c of courses) {
    const id = classifyCourse(c);
    if (!bucket.has(id)) bucket.set(id, []);
    bucket.get(id)!.push(c);
  }
  return COMPETENCIES
    .map((comp) => ({ competency: comp, courses: bucket.get(comp.id) ?? [] }))
    .filter((g) => g.courses.length > 0)
    .sort((a, b) => b.courses.length - a.courses.length);
}
