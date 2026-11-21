import { describe, expect, test } from "bun:test";
import { Z_BY_LEVEL, binomialPmf, coverage, coverageCurve, wald, wilson } from "../src/lib/lab/wilson";

const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);

describe("intervalo de Wilson", () => {
  test("valores conhecidos com z = 1,96", () => {
    // k = 0, n = 10: limite superior = z² / (n + z²) = 3,8416 / 13,8416
    const zero = wilson(0, 10, 1.96);
    expect(zero.low).toBe(0);
    expect(zero.high).toBeCloseTo(3.8416 / 13.8416, 12);
    // k = n = 10: limite inferior = n / (n + z²)
    const all = wilson(10, 10, 1.96);
    expect(all.high).toBe(1);
    expect(all.low).toBeCloseTo(10 / 13.8416, 12);
    // k = 5, n = 10: resultado tabelado (0,2366; 0,7634)
    const half = wilson(5, 10, 1.96);
    expect(half.center).toBeCloseTo(0.5, 12);
    expect(half.low).toBeCloseTo(0.2366, 4);
    expect(half.high).toBeCloseTo(0.7634, 4);
  });
  test("é simétrico: trocar aprovações por reprovações espelha o intervalo", () => {
    for (const [k, n] of [[3, 12], [1, 40], [17, 36]] as const) {
      const a = wilson(k, n, Z_BY_LEVEL[95]);
      const b = wilson(n - k, n, Z_BY_LEVEL[95]);
      expect(a.low).toBeCloseTo(1 - b.high, 12);
      expect(a.high).toBeCloseTo(1 - b.low, 12);
    }
  });
  test("fica sempre em [0, 1], contém a proporção observada e estreita com mais dados", () => {
    for (let n = 1; n <= 60; n++)
      for (let k = 0; k <= n; k++) {
        const ci = wilson(k, n, Z_BY_LEVEL[99]);
        expect(ci.low).toBeGreaterThanOrEqual(0);
        expect(ci.high).toBeLessThanOrEqual(1);
        expect(ci.low).toBeLessThanOrEqual(k / n + 1e-12);
        expect(ci.high).toBeGreaterThanOrEqual(k / n - 1e-12);
      }
    const w = (n: number) => { const c = wilson(n * 0.8, n, Z_BY_LEVEL[95]); return c.high - c.low; };
    expect(w(1000)).toBeLessThan(w(100));
    expect(w(100)).toBeLessThan(w(10));
  });
  test("mais confiança, intervalo mais largo", () => {
    const w = (z: number) => { const c = wilson(30, 36, z); return c.high - c.low; };
    expect(w(Z_BY_LEVEL[99])).toBeGreaterThan(w(Z_BY_LEVEL[95]));
    expect(w(Z_BY_LEVEL[95])).toBeGreaterThan(w(Z_BY_LEVEL[90]));
  });
  test("sem dados, o intervalo é tudo", () => {
    expect(wilson(0, 0, 1.96)).toEqual({ low: 0, high: 1, center: 0.5 });
  });
});

describe("intervalo de Wald (comparação)", () => {
  test("colapsa nos extremos", () => {
    expect(wald(0, 10, 1.96)).toEqual({ low: 0, high: 0 });
    expect(wald(10, 10, 1.96)).toEqual({ low: 1, high: 1 });
  });
  test("valor conhecido", () => {
    // 0,5 ± 1,96 · √(0,25/100) = 0,5 ± 0,098
    const ci = wald(50, 100, 1.96);
    expect(ci.low).toBeCloseTo(0.402, 10);
    expect(ci.high).toBeCloseTo(0.598, 10);
  });
});

describe("binomial e cobertura exata", () => {
  test("distribuição binomial", () => {
    expect(binomialPmf(2, 0.5).map((x) => +x.toFixed(12))).toEqual([0.25, 0.5, 0.25]);
    expect(sum(binomialPmf(200, 0.03))).toBeCloseTo(1, 10);
    expect(sum(binomialPmf(200, 0.99))).toBeCloseTo(1, 10);
    expect(binomialPmf(5, 0)).toEqual([1, 0, 0, 0, 0, 0]);
    expect(binomialPmf(5, 1)).toEqual([0, 0, 0, 0, 0, 1]);
  });
  test("cobertura com n = 10 e p = 0,5 (contas feitas à mão)", () => {
    // Wald contém 0,5 para k = 3..7: (120+210+252+210+120)/1024
    expect(coverage("wald", 10, 0.5, 1.96)).toBeCloseTo(912 / 1024, 12);
    // Wilson contém 0,5 para k = 2..8: (45+120+210+252+210+120+45)/1024
    expect(coverage("wilson", 10, 0.5, 1.96)).toBeCloseTo(1002 / 1024, 12);
  });
  test("perto dos extremos, Wald fica muito abaixo do nível nominal e Wilson não", () => {
    const z = Z_BY_LEVEL[95];
    expect(coverage("wald", 20, 0.02, z)).toBeLessThan(0.5);
    expect(coverage("wilson", 20, 0.02, z)).toBeGreaterThan(0.9);
  });
  test("em média, Wilson fica perto de 95% e acima de Wald", () => {
    const z = Z_BY_LEVEL[95];
    const mean = (m: "wilson" | "wald") => sum(coverageCurve(m, 30, z).map((x) => x.c)) / 99;
    expect(mean("wilson")).toBeGreaterThan(0.94);
    expect(mean("wilson")).toBeLessThan(0.97);
    expect(mean("wilson")).toBeGreaterThan(mean("wald"));
  });
});
