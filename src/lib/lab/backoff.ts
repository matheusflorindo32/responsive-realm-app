/**
 * Matemática do Retry & Backoff Simulator.
 *
 * Modelo: N clientes chamam um destino que fica fora do ar por um tempo e, ao
 * voltar, só aceita um número fixo de chamadas por janela de 100 ms. Cada
 * cliente que falha tenta de novo segundo uma estratégia de espera.
 *
 * É uma simulação de eventos discretos, determinística por semente.
 * Funções puras; testes em tests/lab-backoff.test.ts.
 */
import { mulberry32 } from "./embedding";

export type Strategy = "none" | "fixed" | "exponential" | "jitter";

export const STRATEGIES: { id: Strategy; label: string; note: string }[] = [
  { id: "none", label: "Sem espera", note: "Tenta de novo assim que a chamada falha." },
  { id: "fixed", label: "Espera fixa", note: "Sempre a mesma espera entre tentativas." },
  { id: "exponential", label: "Exponencial", note: "A espera dobra a cada falha, até o teto." },
  { id: "jitter", label: "Exponencial + variação", note: "Sorteia a espera entre zero e o valor exponencial." },
];

/** Janela usada para medir carga e capacidade, em milissegundos. */
export const WINDOW_MS = 100;
/** Tempo que uma chamada leva para voltar com erro antes de o cliente poder reagir. */
export const LATENCY_MS = 50;

/**
 * Espera antes da próxima tentativa.
 * @param retry índice da retentativa, começando em 0 (0 = espera após a 1ª falha)
 * @param u número uniforme em [0, 1), usado só na estratégia com variação
 */
export function backoffDelay(strategy: Strategy, retry: number, baseMs: number, capMs: number, u = 0): number {
  if (strategy === "none") return 0;
  if (strategy === "fixed") return baseMs;
  const exp = Math.min(capMs, baseMs * 2 ** retry);
  return strategy === "jitter" ? u * exp : exp;
}

export interface BackoffParams {
  strategy: Strategy;
  clients: number;
  /** Duração da queda do destino, a partir de t = 0. */
  outageMs: number;
  /** Chamadas aceitas por janela de WINDOW_MS depois que o destino volta. */
  capacityPerWindow: number;
  /** Total de chamadas que um cliente pode fazer (a primeira + as retentativas). */
  maxAttempts: number;
  baseMs: number;
  capMs: number;
  seed: number;
  /** As primeiras chamadas chegam espalhadas uniformemente neste intervalo. */
  arrivalSpreadMs?: number;
}

export interface BackoffResult {
  /** Chamadas atendidas por janela. */
  ok: number[];
  /** Chamadas que falharam por janela (queda ou sobrecarga). */
  failed: number[];
  totalCalls: number;
  /** Maior número de chamadas recebidas pelo destino em uma janela. */
  peakPerWindow: number;
  /** Idem, contando só depois que o destino voltou. */
  peakAfterRecovery: number;
  served: number;
  gaveUp: number;
  /** Instante do último atendimento, ou null se ninguém foi atendido. */
  lastSuccessMs: number | null;
}

type Event = { t: number; client: number; attempt: number };

/** Fila de prioridade mínima por tempo (desempate: ordem de inserção). */
class MinHeap {
  private items: (Event & { seq: number })[] = [];
  private seq = 0;
  get size() {
    return this.items.length;
  }
  push(e: Event) {
    const a = this.items;
    a.push({ ...e, seq: this.seq++ });
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(a[p], a[i])) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): Event {
    const a = this.items;
    const top = a[0];
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && this.less(a[l], a[m])) m = l;
        if (r < a.length && this.less(a[r], a[m])) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
  private less(x: Event & { seq: number }, y: Event & { seq: number }) {
    return x.t < y.t || (x.t === y.t && x.seq < y.seq);
  }
}

export function simulateBackoff(p: BackoffParams): BackoffResult {
  const rand = mulberry32(p.seed);
  const spread = p.arrivalSpreadMs ?? 1000;
  const heap = new MinHeap();
  for (let c = 0; c < p.clients; c++) heap.push({ t: rand() * spread, client: c, attempt: 1 });

  const ok: number[] = [];
  const failed: number[] = [];
  const bump = (arr: number[], w: number) => {
    while (arr.length <= w) arr.push(0);
    arr[w]++;
  };
  let served = 0;
  let gaveUp = 0;
  let totalCalls = 0;
  let lastSuccessMs: number | null = null;

  while (heap.size) {
    const e = heap.pop();
    const w = Math.floor(e.t / WINDOW_MS);
    totalCalls++;
    const up = e.t >= p.outageMs;
    if (up && (ok[w] ?? 0) < p.capacityPerWindow) {
      bump(ok, w);
      served++;
      lastSuccessMs = e.t;
      continue;
    }
    bump(failed, w);
    if (e.attempt >= p.maxAttempts) {
      gaveUp++;
      continue;
    }
    const wait = backoffDelay(p.strategy, e.attempt - 1, p.baseMs, p.capMs, rand());
    heap.push({ t: e.t + LATENCY_MS + wait, client: e.client, attempt: e.attempt + 1 });
  }

  const n = Math.max(ok.length, failed.length);
  while (ok.length < n) ok.push(0);
  while (failed.length < n) failed.push(0);
  const firstUp = Math.floor(p.outageMs / WINDOW_MS);
  let peakPerWindow = 0;
  let peakAfterRecovery = 0;
  for (let i = 0; i < n; i++) {
    const v = ok[i] + failed[i];
    if (v > peakPerWindow) peakPerWindow = v;
    if (i >= firstUp && v > peakAfterRecovery) peakAfterRecovery = v;
  }
  return { ok, failed, totalCalls, peakPerWindow, peakAfterRecovery, served, gaveUp, lastSuccessMs };
}

/** Agrupa janelas vizinhas para o gráfico caber em no máximo `maxBars` barras. */
export function binSeries(ok: number[], failed: number[], maxBars: number): { ok: number[]; failed: number[]; windowsPerBar: number } {
  const windowsPerBar = Math.max(1, Math.ceil(ok.length / maxBars));
  const out = { ok: [] as number[], failed: [] as number[], windowsPerBar };
  for (let i = 0; i < ok.length; i += windowsPerBar) {
    let a = 0;
    let b = 0;
    for (let j = i; j < Math.min(ok.length, i + windowsPerBar); j++) {
      a += ok[j];
      b += failed[j];
    }
    out.ok.push(a);
    out.failed.push(b);
  }
  return out;
}
