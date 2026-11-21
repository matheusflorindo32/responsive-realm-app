import { describe, expect, test } from "bun:test";
import { mulberry32 } from "../src/lib/lab/embedding";
import {
  SCENARIOS,
  applySampling,
  effectiveChoices,
  entropyBits,
  sampleCounts,
  sampleIndex,
  softmax,
  topKKeep,
  topPKeep,
} from "../src/lib/lab/sampling";

const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);

describe("softmax com temperatura", () => {
  test("valores conhecidos", () => {
    // logits [0, ln 3] → [1/4, 3/4]
    const p = softmax([0, Math.log(3)]);
    expect(p[0]).toBeCloseTo(0.25, 12);
    expect(p[1]).toBeCloseTo(0.75, 12);
    // T = 2 tira a raiz: pesos 1 e √3
    const q = softmax([0, Math.log(3)], 2);
    expect(q[1]).toBeCloseTo(Math.sqrt(3) / (1 + Math.sqrt(3)), 12);
  });
  test("soma 1 e não muda com um deslocamento constante dos logits", () => {
    const a = softmax([1.2, -0.3, 4.1, 0]);
    const b = softmax([101.2, 99.7, 104.1, 100]);
    expect(sum(a)).toBeCloseTo(1, 12);
    a.forEach((x, i) => expect(x).toBeCloseTo(b[i], 10));
  });
  test("temperatura baixa concentra, alta espalha", () => {
    const z = [3, 2, 1];
    expect(softmax(z, 0.1)[0]).toBeGreaterThan(0.999);
    expect(softmax(z, 0.5)[0]).toBeGreaterThan(softmax(z, 1)[0]);
    expect(softmax(z, 1)[0]).toBeGreaterThan(softmax(z, 2)[0]);
    softmax(z, 1000).forEach((p) => expect(p).toBeCloseTo(1 / 3, 2));
  });
  test("não estoura com logits grandes e T pequeno", () => {
    softmax([800, 790, 0], 0.05).forEach((p) => expect(Number.isFinite(p)).toBe(true));
  });
  test("temperatura zero ou negativa é rejeitada", () => {
    expect(() => softmax([1, 2], 0)).toThrow();
    expect(() => softmax([1, 2], -1)).toThrow();
  });
});

describe("filtros", () => {
  const p = [0.5, 0.3, 0.15, 0.05];
  test("top-k mantém os k mais prováveis e nunca menos de 1", () => {
    expect(topKKeep(p, 2)).toEqual([true, true, false, false]);
    expect(topKKeep(p, 0)).toEqual([true, false, false, false]);
    expect(topKKeep(p, 99)).toEqual([true, true, true, true]);
  });
  test("top-p inclui o item que cruza o limite", () => {
    expect(topPKeep(p, 0.5)).toEqual([true, false, false, false]);
    expect(topPKeep(p, 0.6)).toEqual([true, true, false, false]);
    expect(topPKeep(p, 0.8)).toEqual([true, true, false, false]);
    expect(topPKeep(p, 0.81)).toEqual([true, true, true, false]);
    expect(topPKeep(p, 1)).toEqual([true, true, true, true]);
  });
  test("distribuição final soma 1 e zera os cortados", () => {
    const r = applySampling([2, 1, 0, -1], { temperature: 1, topK: 2, topP: 1 });
    expect(sum(r.final)).toBeCloseTo(1, 12);
    expect(r.final[2]).toBe(0);
    expect(r.final[3]).toBe(0);
    // Entre os dois mantidos a razão continua e¹.
    expect(r.final[0] / r.final[1]).toBeCloseTo(Math.E, 10);
  });
  test("sem filtros, a distribuição final é a própria softmax", () => {
    const z = [...SCENARIOS[1].logits];
    const r = applySampling(z, { temperature: 0.8, topK: z.length, topP: 1 });
    r.final.forEach((x, i) => expect(x).toBeCloseTo(r.base[i], 12));
  });
});

describe("entropia", () => {
  test("valores conhecidos", () => {
    expect(entropyBits([1, 0, 0])).toBe(0);
    expect(entropyBits([0.5, 0.5])).toBeCloseTo(1, 12);
    expect(entropyBits([0.25, 0.25, 0.25, 0.25])).toBeCloseTo(2, 12);
    expect(effectiveChoices(new Array(8).fill(1 / 8))).toBeCloseTo(8, 10);
  });
  test("aumentar a temperatura aumenta a entropia", () => {
    const z = [...SCENARIOS[0].logits];
    expect(entropyBits(softmax(z, 1.5))).toBeGreaterThan(entropyBits(softmax(z, 0.5)));
  });
});

describe("sorteio", () => {
  test("índice por faixas acumuladas", () => {
    const p = [0.2, 0.5, 0.3];
    expect(sampleIndex(p, 0)).toBe(0);
    expect(sampleIndex(p, 0.19)).toBe(0);
    expect(sampleIndex(p, 0.2)).toBe(1);
    expect(sampleIndex(p, 0.69)).toBe(1);
    expect(sampleIndex(p, 0.7)).toBe(2);
    expect(sampleIndex(p, 0.9999)).toBe(2);
  });
  test("nunca sorteia um item cortado", () => {
    const counts = sampleCounts([0.6, 0, 0.4, 0], 2000, mulberry32(9));
    expect(counts[1]).toBe(0);
    expect(counts[3]).toBe(0);
    expect(sum(counts)).toBe(2000);
  });
  test("frequências se aproximam das probabilidades", () => {
    const p = [0.5, 0.3, 0.2];
    const counts = sampleCounts(p, 20000, mulberry32(4));
    counts.forEach((c, i) => expect(c / 20000).toBeCloseTo(p[i], 1));
  });
});
