/**
 * Matemática do Wilson Confidence Interval Explorer: intervalo de confiança
 * para uma proporção (k aprovações em n checagens).
 * Nada aqui é simulado: tudo é cálculo exato a partir de n, k e do nível.
 * Funções puras; testes em tests/lab-wilson.test.ts.
 */

/** Quantis da normal padrão para os níveis de confiança oferecidos (bilateral). */
export const Z_BY_LEVEL = { 90: 1.6448536269514722, 95: 1.959963984540054, 99: 2.5758293035489004 } as const;
export type Level = keyof typeof Z_BY_LEVEL;

export interface Interval {
  low: number;
  high: number;
}

/**
 * Intervalo de Wilson (1927):
 *   centro = (p̂ + z²/2n) / (1 + z²/n)
 *   margem = z · √( p̂(1−p̂)/n + z²/4n² ) / (1 + z²/n)
 * Nunca sai de [0, 1] e não colapsa quando k = 0 ou k = n.
 */
export function wilson(k: number, n: number, z: number): Interval & { center: number } {
  if (n <= 0) return { low: 0, high: 1, center: 0.5 };
  const p = k / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  // Nos extremos o limite é exatamente 0 ou 1; o ajuste evita ruído de ponto flutuante.
  return { low: k === 0 ? 0 : Math.max(0, center - margin), high: k === n ? 1 : Math.min(1, center + margin), center };
}

/**
 * Intervalo "ingênuo" de Wald: p̂ ± z · √( p̂(1−p̂)/n ), cortado em [0, 1].
 * Incluído só para comparação: com k = 0 ou k = n a margem vira zero.
 */
export function wald(k: number, n: number, z: number): Interval {
  if (n <= 0) return { low: 0, high: 1 };
  const p = k / n;
  const margin = z * Math.sqrt((p * (1 - p)) / n);
  return { low: Math.max(0, p - margin), high: Math.min(1, p + margin) };
}

/** P(K = k) para K ~ Binomial(n, p), k = 0..n. Calculado em logaritmo para não zerar com n grande. */
export function binomialPmf(n: number, p: number): number[] {
  if (p <= 0) return Array.from({ length: n + 1 }, (_, k) => (k === 0 ? 1 : 0));
  if (p >= 1) return Array.from({ length: n + 1 }, (_, k) => (k === n ? 1 : 0));
  const out: number[] = [];
  let logC = 0; // ln C(n, 0)
  for (let k = 0; k <= n; k++) {
    out.push(Math.exp(logC + k * Math.log(p) + (n - k) * Math.log(1 - p)));
    logC += Math.log(n - k) - Math.log(k + 1);
  }
  return out;
}

export type Method = "wilson" | "wald";

/**
 * Cobertura exata: probabilidade de o intervalo conter a proporção verdadeira p,
 * somando a binomial sobre todos os resultados possíveis k = 0..n.
 */
export function coverage(method: Method, n: number, p: number, z: number): number {
  const pmf = binomialPmf(n, p);
  const eps = 1e-12;
  let total = 0;
  for (let k = 0; k <= n; k++) {
    const ci = method === "wilson" ? wilson(k, n, z) : wald(k, n, z);
    if (ci.low - eps <= p && p <= ci.high + eps) total += pmf[k];
  }
  return total;
}

/** Cobertura para uma grade de proporções verdadeiras (para o gráfico). */
export function coverageCurve(method: Method, n: number, z: number, points = 99): { p: number; c: number }[] {
  return Array.from({ length: points }, (_, i) => {
    const p = (i + 1) / (points + 1);
    return { p, c: coverage(method, n, p, z) };
  });
}
