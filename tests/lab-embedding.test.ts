import { describe, expect, test } from "bun:test";
import {
  BRIDGES,
  GROUPS,
  angleDegrees,
  cosineSimilarity,
  dot,
  generateEmbeddings,
  mulberry32,
  nearestByCosine,
  nearestByDistance,
  neighborPreservation,
  norm,
  project,
  randomOrthonormalBasis,
  topEigen,
} from "../src/lib/lab/embedding";

describe("similaridade de cosseno", () => {
  test("valores conhecidos", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1, 12);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 12);
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1, 12);
    // cos 45° = √2/2
    expect(cosineSimilarity([1, 0], [1, 1])).toBeCloseTo(Math.SQRT1_2, 12);
    // (1·4 + 2·5 + 3·6) / (√14 · √77) = 32 / √1078
    expect(cosineSimilarity([1, 2, 3], [4, 5, 6])).toBeCloseTo(32 / Math.sqrt(1078), 12);
  });
  test("não depende do comprimento do vetor", () => {
    expect(cosineSimilarity([3, 4], [30, 40])).toBeCloseTo(1, 12);
    expect(cosineSimilarity([1, 2, 3], [4, 5, 6])).toBeCloseTo(cosineSimilarity([10, 20, 30], [0.4, 0.5, 0.6]), 12);
  });
  test("vetor nulo resulta em 0, sem NaN", () => {
    expect(cosineSimilarity([0, 0], [1, 2])).toBe(0);
  });
  test("ângulo em graus", () => {
    expect(angleDegrees([1, 0], [0, 1])).toBeCloseTo(90, 9);
    expect(angleDegrees([1, 0], [1, 1])).toBeCloseTo(45, 9);
  });
});

describe("dados simulados", () => {
  const total = GROUPS.reduce((s, g) => s + g.terms.length, 0) + BRIDGES.length;
  test("mesma semente gera os mesmos vetores", () => {
    const a = generateEmbeddings({ seed: 7, noise: 0.45 });
    const b = generateEmbeddings({ seed: 7, noise: 0.45 });
    expect(a).toEqual(b);
    expect(a.length).toBe(total);
    expect(a[0].vector.length).toBe(16);
  });
  test("sementes diferentes geram vetores diferentes", () => {
    const a = generateEmbeddings({ seed: 7, noise: 0.45 });
    const b = generateEmbeddings({ seed: 8, noise: 0.45 });
    expect(a[0].vector).not.toEqual(b[0].vector);
  });
  test("com pouco ruído, termos do mesmo grupo são mais parecidos entre si", () => {
    const pts = generateEmbeddings({ seed: 3, noise: 0.2 });
    const regular = pts.filter((p) => p.bridgeTo === undefined);
    let intra = 0, nIntra = 0, inter = 0, nInter = 0;
    for (const a of regular)
      for (const b of regular) {
        if (a.id >= b.id) continue;
        const c = cosineSimilarity(a.vector, b.vector);
        if (a.group === b.group) { intra += c; nIntra++; } else { inter += c; nInter++; }
      }
    expect(intra / nIntra).toBeGreaterThan(0.9);
    expect(intra / nIntra).toBeGreaterThan(inter / nInter + 0.4);
  });
  test("termo-ponte fica entre os dois grupos", () => {
    const pts = generateEmbeddings({ seed: 3, noise: 0.05 });
    const drone = pts.find((p) => p.term === "drone")!;
    const tech = pts.find((p) => p.term === "algoritmo")!;
    const transp = pts.find((p) => p.term === "carro")!;
    const clima = pts.find((p) => p.term === "chuva")!;
    const toTech = cosineSimilarity(drone.vector, tech.vector);
    const toTransp = cosineSimilarity(drone.vector, transp.vector);
    expect(Math.abs(toTech - toTransp)).toBeLessThan(0.15);
    expect(toTech).toBeGreaterThan(cosineSimilarity(drone.vector, clima.vector));
  });
  test("gerador uniforme fica em [0, 1)", () => {
    const r = mulberry32(1);
    for (let i = 0; i < 1000; i++) {
      const x = r();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});

describe("projeções", () => {
  test("autovetores de uma matriz diagonal", () => {
    const { vectors, values } = topEigen([[5, 0, 0], [0, 2, 0], [0, 0, 1]], 3);
    expect(values[0]).toBeCloseTo(5, 6);
    expect(values[1]).toBeCloseTo(2, 6);
    expect(values[2]).toBeCloseTo(1, 6);
    expect(Math.abs(vectors[0][0])).toBeCloseTo(1, 6);
    expect(Math.abs(vectors[1][1])).toBeCloseTo(1, 6);
  });
  test("PCA recupera toda a variância de dados que vivem em 3 dimensões", () => {
    const rand = mulberry32(5);
    // 40 pontos em 8 dimensões, mas só as 3 primeiras variam.
    const data = Array.from({ length: 40 }, () => [rand() * 4, rand() * 2, rand(), 0, 0, 0, 0, 0]);
    const p = project(data, "pca");
    expect(p.explained[0] + p.explained[1] + p.explained[2]).toBeCloseTo(1, 6);
    expect(p.explained[0]).toBeGreaterThanOrEqual(p.explained[1]);
    expect(p.explained[1]).toBeGreaterThanOrEqual(p.explained[2]);
    // Sem perda de informação, a figura mostra exatamente os mesmos vizinhos euclidianos.
    for (let i = 0; i < data.length; i++) expect(nearestByDistance(p.coords, i, 5)).toEqual(nearestByDistance(data, i, 5));
  });
  test("PCA retém pelo menos tanta variância quanto as outras projeções lineares", () => {
    const vectors = generateEmbeddings({ seed: 11, noise: 0.6 }).map((p) => p.vector);
    const sum = (e: number[]) => e[0] + e[1] + e[2];
    const pca = sum(project(vectors, "pca").explained);
    expect(pca).toBeGreaterThanOrEqual(sum(project(vectors, "random", 4).explained) - 1e-9);
    expect(pca).toBeGreaterThanOrEqual(sum(project(vectors, "axes").explained) - 1e-9);
    expect(pca).toBeLessThanOrEqual(1 + 1e-9);
  });
  test("base aleatória é ortonormal", () => {
    const b = randomOrthonormalBasis(16, 42);
    for (let i = 0; i < 3; i++) {
      expect(norm(b[i])).toBeCloseTo(1, 10);
      for (let j = i + 1; j < 3; j++) expect(dot(b[i], b[j])).toBeCloseTo(0, 10);
    }
  });
});

describe("vizinhança", () => {
  const vectors = [[1, 0], [0.9, 0.1], [0, 1], [-1, 0]];
  test("vizinhos por cosseno em ordem decrescente de similaridade", () => {
    expect(nearestByCosine(vectors, 0, 3)).toEqual([1, 2, 3]);
  });
  test("o próprio ponto nunca é vizinho de si mesmo", () => {
    expect(nearestByCosine(vectors, 1, 3)).not.toContain(1);
    expect(nearestByDistance(vectors, 1, 3)).not.toContain(1);
  });
  test("preservação é 1 quando a projeção não perde informação e fica entre 0 e 1 no caso geral", () => {
    // Vetores unitários: ordenar por cosseno e por distância euclidiana dá o mesmo resultado.
    const unit = [0, 0.3, 0.7, 1.4, 2.2, 3.0, 4.1].map((a) => [Math.cos(a), Math.sin(a)]);
    expect(neighborPreservation(unit, unit, 2)).toBeCloseTo(1, 12);
    const hi = generateEmbeddings({ seed: 2, noise: 0.9 }).map((p) => p.vector);
    const v = neighborPreservation(hi, project(hi, "axes").coords, 5);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(1);
  });
});
