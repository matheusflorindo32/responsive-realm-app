/**
 * Matemática do 3D Embedding Space Explorer.
 *
 * Tudo aqui é função pura e determinística (semente fixa → mesmo resultado),
 * sem dependência de React nem de Three.js, para poder ser testado isoladamente
 * (tests/lab-embedding.test.ts).
 *
 * IMPORTANTE: os vetores são SIMULADOS. Não vêm de nenhum modelo de linguagem.
 * São gerados como "centro do grupo + ruído gaussiano" apenas para ensinar a
 * geometria de similaridade e os limites de projeções em 3D.
 */

export type Vec = number[];

/* ------------------------------------------------------------------ */
/* Aleatoriedade determinística                                        */
/* ------------------------------------------------------------------ */

/** Gerador mulberry32: uniforme em [0, 1), reprodutível por semente. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Normal padrão por Box–Muller. */
export function gaussian(rand: () => number): number {
  let u = 0;
  while (u === 0) u = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

/* ------------------------------------------------------------------ */
/* Álgebra vetorial                                                    */
/* ------------------------------------------------------------------ */

export function dot(a: Vec, b: Vec): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export function norm(a: Vec): number {
  return Math.sqrt(dot(a, a));
}

export function normalize(a: Vec): Vec {
  const n = norm(a);
  return n === 0 ? a.slice() : a.map((x) => x / n);
}

/**
 * Similaridade de cosseno: cos θ = (a · b) / (‖a‖ ‖b‖), no intervalo [-1, 1].
 * Mede o ângulo entre os vetores e ignora o comprimento. Vetor nulo → 0.
 */
export function cosineSimilarity(a: Vec, b: Vec): number {
  const d = norm(a) * norm(b);
  if (d === 0) return 0;
  return Math.max(-1, Math.min(1, dot(a, b) / d));
}

/** Ângulo entre dois vetores, em graus. */
export function angleDegrees(a: Vec, b: Vec): number {
  return (Math.acos(cosineSimilarity(a, b)) * 180) / Math.PI;
}

export function euclidean(a: Vec, b: Vec): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2;
  return Math.sqrt(s);
}

/* ------------------------------------------------------------------ */
/* Dados simulados                                                     */
/* ------------------------------------------------------------------ */

export const GROUPS = [
  { name: "Animais", terms: ["gato", "cachorro", "cavalo", "pássaro", "peixe", "leão", "abelha", "tartaruga"] },
  { name: "Alimentos", terms: ["arroz", "feijão", "pão", "queijo", "maçã", "café", "tomate", "mel"] },
  { name: "Tecnologia", terms: ["algoritmo", "sensor", "servidor", "software", "robô", "rede", "chip", "satélite"] },
  { name: "Saúde", terms: ["médico", "vacina", "hospital", "exame", "sono", "coração", "treino", "nutrição"] },
  { name: "Transporte", terms: ["carro", "ônibus", "bicicleta", "avião", "navio", "trem", "estrada", "metrô"] },
  { name: "Clima", terms: ["chuva", "vento", "neve", "sol", "nuvem", "tempestade", "seca", "neblina"] },
] as const;

/** Termos-ponte: gerados a meio caminho entre dois grupos, para mostrar ambiguidade. */
export const BRIDGES = [
  { term: "drone", groups: [2, 4] },
  { term: "leite", groups: [0, 1] },
  { term: "ambulância", groups: [3, 4] },
] as const;

export interface EmbeddingPoint {
  id: number;
  term: string;
  /** Grupo de origem. Em termos-ponte, o primeiro dos dois grupos. */
  group: number;
  /** Segundo grupo, só em termos-ponte. */
  bridgeTo?: number;
  vector: Vec;
}

export interface EmbeddingOptions {
  seed: number;
  /** Norma esperada do ruído em relação ao centro do grupo (centro tem norma 1). */
  noise: number;
  dims?: number;
}

export const DEFAULT_DIMS = 16;

/**
 * Gera o conjunto simulado: cada grupo recebe um centro aleatório de norma 1 e
 * cada termo é esse centro mais ruído gaussiano com norma esperada `noise`.
 */
export function generateEmbeddings({ seed, noise, dims = DEFAULT_DIMS }: EmbeddingOptions): EmbeddingPoint[] {
  const rand = mulberry32(seed);
  const randVec = () => Array.from({ length: dims }, () => gaussian(rand));
  const centers = GROUPS.map(() => normalize(randVec()));
  const sigma = noise / Math.sqrt(dims);
  const jitter = (c: Vec) => c.map((x) => x + gaussian(rand) * sigma);

  const points: EmbeddingPoint[] = [];
  GROUPS.forEach((g, gi) => {
    g.terms.forEach((term) => points.push({ id: points.length, term, group: gi, vector: jitter(centers[gi]) }));
  });
  BRIDGES.forEach((b) => {
    const [a, c] = b.groups;
    const mid = normalize(centers[a].map((x, i) => x + centers[c][i]));
    points.push({ id: points.length, term: b.term, group: a, bridgeTo: c, vector: jitter(mid) });
  });
  return points;
}

/* ------------------------------------------------------------------ */
/* Projeções para 3D                                                   */
/* ------------------------------------------------------------------ */

export type ProjectionKind = "pca" | "random" | "axes";

export interface Projection {
  kind: ProjectionKind;
  /** Coordenadas 3D de cada ponto, centradas na média. */
  coords: [number, number, number][];
  /** Fração da variância total retida em cada um dos 3 eixos. */
  explained: [number, number, number];
}

function centerRows(data: Vec[]): Vec[] {
  const d = data[0].length;
  const mean = new Array(d).fill(0);
  data.forEach((r) => r.forEach((x, i) => (mean[i] += x / data.length)));
  return data.map((r) => r.map((x, i) => x - mean[i]));
}

function covariance(centered: Vec[]): number[][] {
  const n = centered.length;
  const d = centered[0].length;
  const c = Array.from({ length: d }, () => new Array(d).fill(0));
  for (const r of centered) for (let i = 0; i < d; i++) for (let j = i; j < d; j++) c[i][j] += (r[i] * r[j]) / (n - 1);
  for (let i = 0; i < d; i++) for (let j = 0; j < i; j++) c[i][j] = c[j][i];
  return c;
}

function matVec(m: number[][], v: Vec): Vec {
  return m.map((row) => dot(row, v));
}

/**
 * Autovetores dominantes de uma matriz simétrica por iteração de potência com
 * deflação. Suficiente para as 16 dimensões usadas aqui.
 */
export function topEigen(matrix: number[][], k: number, iterations = 300): { vectors: Vec[]; values: number[] } {
  const d = matrix.length;
  const m = matrix.map((r) => r.slice());
  const vectors: Vec[] = [];
  const values: number[] = [];
  const rand = mulberry32(12345);
  for (let c = 0; c < k; c++) {
    let v = normalize(Array.from({ length: d }, () => rand() - 0.5));
    for (let it = 0; it < iterations; it++) {
      let w = matVec(m, v);
      // Reortogonaliza contra os componentes já encontrados (estabilidade numérica).
      for (const u of vectors) {
        const p = dot(w, u);
        w = w.map((x, i) => x - p * u[i]);
      }
      const n = norm(w);
      if (n < 1e-12) break;
      v = w.map((x) => x / n);
    }
    const lambda = dot(v, matVec(m, v));
    vectors.push(v);
    values.push(Math.max(0, lambda));
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) m[i][j] -= lambda * v[i] * v[j];
  }
  return { vectors, values };
}

/** Base ortonormal aleatória de 3 direções (Gram–Schmidt sobre vetores gaussianos). */
export function randomOrthonormalBasis(dims: number, seed: number): Vec[] {
  const rand = mulberry32(seed);
  const basis: Vec[] = [];
  while (basis.length < 3) {
    let v = Array.from({ length: dims }, () => gaussian(rand));
    for (const u of basis) {
      const p = dot(v, u);
      v = v.map((x, i) => x - p * u[i]);
    }
    if (norm(v) > 1e-9) basis.push(normalize(v));
  }
  return basis;
}

/**
 * Projeta os vetores em 3 eixos.
 * - "pca": as 3 direções de maior variância (melhor projeção LINEAR em erro quadrático).
 * - "random": 3 direções ortonormais sorteadas.
 * - "axes": as 3 primeiras coordenadas, descartando as demais.
 */
export function project(vectors: Vec[], kind: ProjectionKind, seed = 1): Projection {
  const centered = centerRows(vectors);
  const d = centered[0].length;
  const cov = covariance(centered);
  const total = cov.reduce((s, r, i) => s + r[i], 0) || 1;

  let basis: Vec[];
  if (kind === "pca") basis = topEigen(cov, 3).vectors;
  else if (kind === "random") basis = randomOrthonormalBasis(d, seed * 7919 + 17);
  else basis = [0, 1, 2].map((i) => Array.from({ length: d }, (_, j) => (i === j ? 1 : 0)));

  const coords = centered.map((r) => basis.map((b) => dot(r, b)) as [number, number, number]);
  // Variância ao longo de uma direção unitária u: uᵀ Σ u.
  const explained = basis.map((b) => dot(b, matVec(cov, b)) / total) as [number, number, number];
  return { kind, coords, explained };
}

/* ------------------------------------------------------------------ */
/* Vizinhança e distorção                                              */
/* ------------------------------------------------------------------ */

/** Índices dos k vizinhos mais próximos pelo cosseno no espaço original (maior = mais próximo). */
export function nearestByCosine(vectors: Vec[], index: number, k: number): number[] {
  return vectors
    .map((v, i) => ({ i, s: i === index ? -Infinity : cosineSimilarity(vectors[index], v) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, k)
    .map((x) => x.i);
}

/** Índices dos k vizinhos mais próximos pela distância euclidiana (o que o olho vê em 3D). */
export function nearestByDistance(coords: Vec[], index: number, k: number): number[] {
  return coords
    .map((v, i) => ({ i, d: i === index ? Infinity : euclidean(coords[index], v) }))
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .slice(0, k)
    .map((x) => x.i);
}

/**
 * Preservação de vizinhança@k: fração média dos k vizinhos verdadeiros (cosseno,
 * espaço original) que continuam entre os k mais próximos na projeção 3D.
 * 1 = a figura mostra os mesmos vizinhos; valores baixos = a figura engana.
 */
export function neighborPreservation(vectors: Vec[], coords: Vec[], k: number): number {
  let sum = 0;
  for (let i = 0; i < vectors.length; i++) {
    const truth = new Set(nearestByCosine(vectors, i, k));
    sum += nearestByDistance(coords, i, k).filter((j) => truth.has(j)).length / k;
  }
  return sum / vectors.length;
}

/** Escala as coordenadas para caberem em uma esfera de raio `radius` (só para desenhar). */
export function fitToRadius(coords: [number, number, number][], radius: number): [number, number, number][] {
  const max = Math.max(...coords.map((c) => Math.hypot(c[0], c[1], c[2])), 1e-9);
  const s = radius / max;
  return coords.map((c) => [c[0] * s, c[1] * s, c[2] * s]);
}
