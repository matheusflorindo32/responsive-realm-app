/**
 * Registro do Interactive Science Lab.
 *
 * Para adicionar um experimento:
 *   1. crie a matemática pura em src/lib/lab/<nome>.ts, com testes em tests/;
 *   2. crie o componente em src/components/lab/experiments/<nome>/ (export default);
 *   3. acrescente uma entrada aqui com `status: "disponivel"` e `load`.
 * As páginas /laboratorio e /laboratorio/:slug leem só este arquivo.
 */
import type { ComponentType } from "react";

export const LAB_AREAS = {
  ia: "Inteligência artificial",
  estatistica: "Estatística aplicada",
  dados: "Ciência de dados",
  fisiologia: "Fisiologia translacional",
  desempenho: "Desempenho humano",
  seguranca: "Segurança pública",
  operacional: "Tecnologias operacionais",
} as const;

export type LabArea = keyof typeof LAB_AREAS;

export interface LabExperiment {
  slug: string;
  title: string;
  area: LabArea;
  status: "disponivel" | "planejado";
  /** Uma frase: o que a pessoa consegue entender ao usar. */
  summary: string;
  /** Aula da formação a que o experimento se liga, quando houver. */
  lesson?: string;
  /** Usa visualização 3D (WebGL)? Sempre com alternativa 2D. */
  uses3d?: boolean;
  load?: () => Promise<{ default: ComponentType }>;
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    slug: "espaco-de-embeddings",
    title: "3D Embedding Space Explorer",
    area: "ia",
    status: "disponivel",
    summary: "Veja como palavras viram vetores, meça a similaridade de cosseno e descubra o quanto uma figura 3D distorce a vizinhança real.",
    lesson: "T3 · Aula 3 — Buscar: palavras, significado e busca híbrida",
    uses3d: true,
    load: () => import("@/components/lab/experiments/embedding/EmbeddingExplorer"),
  },
  {
    slug: "amostragem-de-tokens",
    title: "Token Sampling Explorer",
    area: "ia",
    status: "disponivel",
    summary: "Mexa na temperatura, no top-k e no top-p e veja a distribuição de probabilidade da próxima palavra mudar; depois sorteie.",
    lesson: "T0 · Aula 1 — Como um LLM gera texto",
    load: () => import("@/components/lab/experiments/sampling/TokenSamplingExplorer"),
  },
  {
    slug: "retentativas-e-recuo",
    title: "Retry & Backoff Simulator",
    area: "operacional",
    status: "planejado",
    summary: "Por que recuo exponencial com variação aleatória protege um sistema em falha.",
    lesson: "T4 · Aula 4 — Quando dá erro: retentativas, tempo-limite e fila de mortos",
  },
  {
    slug: "intervalo-de-wilson",
    title: "Wilson Confidence Interval Explorer",
    area: "estatistica",
    status: "planejado",
    summary: "Quanta certeza cabe em poucas observações: o intervalo de confiança de uma proporção.",
    lesson: "T4 · Laboratório de falhas",
  },
];

export function findExperiment(slug: string | undefined): LabExperiment | undefined {
  return LAB_EXPERIMENTS.find((e) => e.slug === slug);
}

/** Áreas previstas que ainda não têm nenhum experimento registrado. */
export function areasWithoutExperiments(): LabArea[] {
  const used = new Set(LAB_EXPERIMENTS.map((e) => e.area));
  return (Object.keys(LAB_AREAS) as LabArea[]).filter((a) => !used.has(a));
}
