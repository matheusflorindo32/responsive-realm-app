/**
 * Matemática do Token Sampling Explorer: como temperatura, top-k e top-p
 * transformam pontuações (logits) em probabilidades da próxima palavra.
 * Funções puras; testes em tests/lab-sampling.test.ts.
 */

/** Softmax com temperatura: p_i = exp(z_i / T) / Σ_j exp(z_j / T). Estável para T pequeno. */
export function softmax(logits: number[], temperature = 1): number[] {
  if (!(temperature > 0)) throw new RangeError("A temperatura precisa ser maior que zero.");
  const scaled = logits.map((z) => z / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((z) => Math.exp(z - max));
  const sum = exps.reduce((s, x) => s + x, 0);
  return exps.map((x) => x / sum);
}

/** Índices em ordem decrescente de probabilidade (empates: menor índice primeiro). */
function ranked(probs: number[]): number[] {
  return probs.map((_, i) => i).sort((a, b) => probs[b] - probs[a] || a - b);
}

/** Top-k: mantém os k itens mais prováveis. Devolve quais índices ficam. */
export function topKKeep(probs: number[], k: number): boolean[] {
  const keep = new Array(probs.length).fill(false);
  ranked(probs)
    .slice(0, Math.max(1, Math.floor(k)))
    .forEach((i) => (keep[i] = true));
  return keep;
}

/**
 * Top-p (núcleo): mantém o menor conjunto de itens mais prováveis cuja soma
 * atinge p. O item que cruza o limite é incluído.
 */
export function topPKeep(probs: number[], p: number): boolean[] {
  const keep = new Array(probs.length).fill(false);
  let acc = 0;
  for (const i of ranked(probs)) {
    keep[i] = true;
    acc += probs[i];
    if (acc >= p - 1e-12) break;
  }
  return keep;
}

export interface SamplingParams {
  temperature: number;
  topK: number;
  topP: number;
}

export interface SamplingResult {
  /** Probabilidades só com a temperatura aplicada. */
  base: number[];
  /** Quais itens sobrevivem aos filtros top-k e top-p (aplicados nessa ordem). */
  kept: boolean[];
  /** Distribuição final: itens cortados valem 0 e o restante é renormalizado. */
  final: number[];
}

export function applySampling(logits: number[], { temperature, topK, topP }: SamplingParams): SamplingResult {
  const base = softmax(logits, temperature);
  const byK = topKKeep(base, topK);
  const afterK = renormalize(base.map((p, i) => (byK[i] ? p : 0)));
  const byP = topPKeep(afterK, topP);
  const kept = byK.map((k, i) => k && byP[i]);
  return { base, kept, final: renormalize(base.map((p, i) => (kept[i] ? p : 0))) };
}

export function renormalize(values: number[]): number[] {
  const sum = values.reduce((s, x) => s + x, 0);
  return sum === 0 ? values.slice() : values.map((x) => x / sum);
}

/** Entropia de Shannon em bits: H = −Σ p_i log₂ p_i (0·log 0 = 0). */
export function entropyBits(probs: number[]): number {
  const h = -probs.reduce((s, p) => (p > 0 ? s + p * Math.log2(p) : s), 0);
  return h === 0 ? 0 : h; // evita −0 quando a distribuição é determinística
}

/** Número efetivo de opções: 2^H. Vale n para n opções igualmente prováveis. */
export function effectiveChoices(probs: number[]): number {
  return 2 ** entropyBits(probs);
}

/** Sorteia um índice segundo a distribuição, com `u` uniforme em [0, 1). */
export function sampleIndex(probs: number[], u: number): number {
  let acc = 0;
  let last = 0;
  for (let i = 0; i < probs.length; i++) {
    if (probs[i] <= 0) continue;
    acc += probs[i];
    last = i;
    if (u < acc) return i;
  }
  return last;
}

/** Sorteia n vezes e devolve a contagem por índice. */
export function sampleCounts(probs: number[], n: number, rand: () => number): number[] {
  const counts = new Array(probs.length).fill(0);
  for (let i = 0; i < n; i++) counts[sampleIndex(probs, rand())]++;
  return counts;
}

/** Cenários didáticos. Os logits foram ESCOLHIDOS À MÃO; não saíram de modelo algum. */
export const SCENARIOS = [
  {
    id: "fato",
    label: "Resposta única",
    prompt: "A capital do Brasil é",
    tokens: ["Brasília", "Rio", "São", "uma", "a", "Salvador", "conhecida", "linda", "grande", "Lisboa"],
    logits: [8.1, 3.9, 3.4, 2.6, 2.2, 1.9, 1.4, 0.8, 0.5, -0.6],
  },
  {
    id: "descricao",
    label: "Várias respostas boas",
    prompt: "O céu hoje está",
    tokens: ["azul", "nublado", "limpo", "lindo", "cinza", "claro", "escuro", "estrelado", "vermelho", "quadrado"],
    logits: [4.2, 3.7, 3.2, 2.8, 2.5, 2.1, 1.5, 1.0, 0.2, -2.0],
  },
  {
    id: "aberto",
    label: "Pergunta aberta",
    prompt: "Meu passatempo favorito é",
    tokens: ["ler", "cozinhar", "correr", "pescar", "desenhar", "viajar", "jogar", "dançar", "programar", "dormir"],
    logits: [2.6, 2.5, 2.4, 2.2, 2.2, 2.1, 2.0, 1.8, 1.7, 1.5],
  },
] as const;
