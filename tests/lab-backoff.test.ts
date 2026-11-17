import { describe, expect, test } from "bun:test";
import { LATENCY_MS, WINDOW_MS, backoffDelay, binSeries, simulateBackoff, type BackoffParams } from "../src/lib/lab/backoff";

const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);

const base: BackoffParams = {
  strategy: "exponential",
  clients: 100,
  outageMs: 8000,
  capacityPerWindow: 10,
  maxAttempts: 8,
  baseMs: 500,
  capMs: 20000,
  seed: 1,
};

describe("espera entre tentativas", () => {
  test("sem espera e espera fixa", () => {
    expect(backoffDelay("none", 3, 500, 20000)).toBe(0);
    expect(backoffDelay("fixed", 0, 500, 20000)).toBe(500);
    expect(backoffDelay("fixed", 7, 500, 20000)).toBe(500);
  });
  test("exponencial dobra a cada falha e respeita o teto", () => {
    expect([0, 1, 2, 3, 4].map((n) => backoffDelay("exponential", n, 500, 20000))).toEqual([500, 1000, 2000, 4000, 8000]);
    expect(backoffDelay("exponential", 6, 500, 20000)).toBe(20000);
    expect(backoffDelay("exponential", 30, 500, 20000)).toBe(20000);
  });
  test("variação sorteia entre zero e o valor exponencial", () => {
    expect(backoffDelay("jitter", 2, 500, 20000, 0)).toBe(0);
    expect(backoffDelay("jitter", 2, 500, 20000, 0.5)).toBe(1000);
    expect(backoffDelay("jitter", 2, 500, 20000, 0.999)).toBeLessThan(2000);
    expect(backoffDelay("jitter", 10, 500, 20000, 0.5)).toBe(10000);
  });
});

describe("simulação", () => {
  test("mesma semente, mesmo resultado", () => {
    expect(simulateBackoff(base)).toEqual(simulateBackoff(base));
    expect(simulateBackoff({ ...base, strategy: "jitter" })).not.toEqual(simulateBackoff({ ...base, strategy: "jitter", seed: 2 }));
  });
  test("todo cliente termina atendido ou desiste, e as contas fecham", () => {
    for (const strategy of ["none", "fixed", "exponential", "jitter"] as const) {
      const r = simulateBackoff({ ...base, strategy });
      expect(r.served + r.gaveUp).toBe(base.clients);
      expect(sum(r.ok)).toBe(r.served);
      expect(sum(r.ok) + sum(r.failed)).toBe(r.totalCalls);
      expect(r.totalCalls).toBeLessThanOrEqual(base.clients * base.maxAttempts);
      expect(r.totalCalls).toBeGreaterThanOrEqual(base.clients);
    }
  });
  test("o destino nunca atende durante a queda nem acima da capacidade", () => {
    const r = simulateBackoff({ ...base, strategy: "jitter" });
    const firstUp = Math.floor(base.outageMs / WINDOW_MS);
    r.ok.forEach((v, w) => {
      if (w < firstUp) expect(v).toBe(0);
      expect(v).toBeLessThanOrEqual(base.capacityPerWindow);
    });
  });
  test("sem queda e com capacidade sobrando, uma chamada por cliente", () => {
    const r = simulateBackoff({ ...base, outageMs: 0, capacityPerWindow: 1000 });
    expect(r.totalCalls).toBe(base.clients);
    expect(r.served).toBe(base.clients);
    expect(r.gaveUp).toBe(0);
  });
  test("sem espera, as tentativas acabam antes de o destino voltar", () => {
    const r = simulateBackoff({ ...base, strategy: "none" });
    // 8 chamadas separadas por 50 ms terminam em menos de 1,5 s; a queda dura 8 s.
    expect((base.maxAttempts - 1) * LATENCY_MS + 1000).toBeLessThan(base.outageMs);
    expect(r.served).toBe(0);
    expect(r.gaveUp).toBe(base.clients);
    expect(r.totalCalls).toBe(base.clients * base.maxAttempts);
    expect(r.lastSuccessMs).toBeNull();
  });
  test("exponencial pura mantém os clientes sincronizados; a variação espalha o pico", () => {
    // Chegadas simultâneas: o pior caso para a manada.
    const p = { ...base, arrivalSpreadMs: 0 };
    const exp = simulateBackoff({ ...p, strategy: "exponential" });
    const jit = simulateBackoff({ ...p, strategy: "jitter" });
    expect(exp.peakAfterRecovery).toBe(p.clients);
    expect(jit.peakAfterRecovery).toBeLessThan(exp.peakAfterRecovery / 2);
  });
  test("espera maior reduz o total de chamadas durante a queda", () => {
    const fixed = simulateBackoff({ ...base, strategy: "fixed", maxAttempts: 30 });
    const exp = simulateBackoff({ ...base, strategy: "exponential", maxAttempts: 30 });
    expect(exp.totalCalls).toBeLessThan(fixed.totalCalls);
  });
});

describe("agrupamento para o gráfico", () => {
  test("preserva os totais", () => {
    const r = simulateBackoff(base);
    const b = binSeries(r.ok, r.failed, 40);
    expect(b.ok.length).toBeLessThanOrEqual(40);
    expect(sum(b.ok)).toBe(sum(r.ok));
    expect(sum(b.failed)).toBe(sum(r.failed));
  });
  test("não agrupa quando já cabe", () => {
    expect(binSeries([1, 2, 3], [0, 1, 0], 10)).toEqual({ ok: [1, 2, 3], failed: [0, 1, 0], windowsPerBar: 1 });
  });
});
