import { Component, Suspense, lazy, useEffect, useMemo, useState, type ReactNode } from "react";
import { Minus, Pause, Play, Plus, RotateCcw, Shuffle } from "lucide-react";
import {
  DEFAULT_DIMS,
  GROUPS,
  angleDegrees,
  cosineSimilarity,
  fitToRadius,
  generateEmbeddings,
  nearestByCosine,
  nearestByDistance,
  neighborPreservation,
  project,
  type ProjectionKind,
} from "@/lib/lab/embedding";
import type { ScenePoint } from "./EmbeddingScene";
import { EmbeddingNotes } from "./EmbeddingNotes";

const EmbeddingScene = lazy(() => import("./EmbeddingScene"));

/** Paleta categórica de Okabe e Ito, legível para os tipos mais comuns de daltonismo. */
const PALETTE = ["#56B4E9", "#E69F00", "#009E73", "#F0E442", "#CC79A7", "#D55E00"] as const;

const KINDS: { id: ProjectionKind; label: string; note: string }[] = [
  { id: "pca", label: "PCA", note: "As 3 direções em que os dados mais variam." },
  { id: "random", label: "Aleatória", note: "3 direções sorteadas, ortogonais entre si." },
  { id: "axes", label: "Eixos 1–3", note: "As 3 primeiras coordenadas; as outras 13 são descartadas." },
];

const DEFAULTS = { seed: 1, noise: 0.45, k: 5, kind: "pca" as ProjectionKind, distance: 7.8 };

const pct = (v: number) => `${Math.round(v * 100)}%`;
const num = (v: number, d = 2) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

const btn =
  "inline-flex items-center justify-center gap-2 rounded-[8px] border border-border bg-white px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50";
const stageBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/15 bg-slate-900/70 text-slate-200 backdrop-blur transition-colors hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(199,89%,62%)]";

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Alternativa sem WebGL: os dois primeiros eixos da mesma projeção, em SVG. */
function Scatter2D({ points, a, b, neighbors, onPick }: { points: ScenePoint[]; a: number | null; b: number | null; neighbors: number[]; onPick: (id: number) => void }) {
  const near = new Set(neighbors);
  const xy = (p: ScenePoint) => [50 + p.pos[0] * 15, 50 - p.pos[1] * 15] as const;
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
      <line x1="5" y1="50" x2="95" y2="50" stroke="#94a3b8" strokeOpacity="0.25" strokeWidth="0.2" />
      <line x1="50" y1="5" x2="50" y2="95" stroke="#94a3b8" strokeOpacity="0.25" strokeWidth="0.2" />
      {a !== null &&
        neighbors.map((i) => {
          const [x1, y1] = xy(points[a]);
          const [x2, y2] = xy(points[i]);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e2e8f0" strokeOpacity="0.6" strokeWidth="0.25" />;
        })}
      {points.map((p) => {
        const [x, y] = xy(p);
        const on = p.id === a || p.id === b;
        return (
          <g key={p.id} onClick={() => onPick(p.id)} style={{ cursor: "pointer" }}>
            <circle cx={x} cy={y} r={on ? 2 : near.has(p.id) ? 1.5 : 1.1} fill={p.color} fillOpacity={a !== null && !on && !near.has(p.id) ? 0.3 : 1} stroke={on ? "#fff" : "none"} strokeWidth="0.4" />
            {(on || near.has(p.id)) && (
              <text x={x + 2.4} y={y + 1} fontSize="2.6" fill="#e2e8f0">
                {p.term}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function EmbeddingExplorer() {
  const [seed, setSeed] = useState(DEFAULTS.seed);
  const [noise, setNoise] = useState(DEFAULTS.noise);
  const [k, setK] = useState(DEFAULTS.k);
  const [kind, setKind] = useState<ProjectionKind>(DEFAULTS.kind);
  const [a, setA] = useState<number | null>(null);
  const [b, setB] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  // Em tela estreita o palco é vertical: a câmera começa mais longe para a nuvem caber inteira.
  const [home] = useState(() => (typeof window !== "undefined" && window.innerWidth < 640 ? 11 : DEFAULTS.distance));
  const [distance, setDistance] = useState(home);
  const [wheelZoom, setWheelZoom] = useState(false);
  const [animate] = useState(() => !(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches));
  const [autoRotate, setAutoRotate] = useState(animate);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => setWebgl(hasWebGL()), []);

  // --- Matemática (src/lib/lab/embedding.ts): recalculada só quando um parâmetro muda. ---
  const data = useMemo(() => generateEmbeddings({ seed, noise }), [seed, noise]);
  const vectors = useMemo(() => data.map((p) => p.vector), [data]);
  const projections = useMemo(
    () => Object.fromEntries(KINDS.map((x) => [x.id, project(vectors, x.id, seed)])) as Record<ProjectionKind, ReturnType<typeof project>>,
    [vectors, seed],
  );
  const comparison = useMemo(
    () =>
      KINDS.map((x) => ({
        ...x,
        variance: projections[x.id].explained.reduce((s, v) => s + v, 0),
        preservation: neighborPreservation(vectors, projections[x.id].coords, k),
      })),
    [projections, vectors, k],
  );
  const raw = projections[kind].coords;
  const points: ScenePoint[] = useMemo(() => {
    const fitted = fitToRadius(raw, 2.5);
    return data.map((p, i) => ({ id: p.id, term: p.term, color: PALETTE[p.group], pos: fitted[i] }));
  }, [data, raw]);

  const trueNeighbors = useMemo(() => (a === null ? [] : nearestByCosine(vectors, a, k)), [vectors, a, k]);
  const seenNeighbors = useMemo(() => (a === null ? [] : nearestByDistance(raw, a, k)), [raw, a, k]);
  const rank3d = useMemo(() => (a === null ? [] : nearestByDistance(raw, a, data.length - 1)), [raw, a, data.length]);
  const kept = trueNeighbors.filter((i) => seenNeighbors.includes(i)).length;
  const current = comparison.find((c) => c.id === kind)!;

  const pick = (id: number) => {
    if (a === null) setA(id);
    else if (id === a) {
      setA(b);
      setB(null);
    } else setB(id === b ? null : id);
  };
  const byTerm = (t: string) => data.find((p) => p.term === t)?.id ?? null;
  const reset = () => {
    setSeed(DEFAULTS.seed);
    setNoise(DEFAULTS.noise);
    setK(DEFAULTS.k);
    setKind(DEFAULTS.kind);
    setDistance(home);
    setA(null);
    setB(null);
  };

  const tour = [
    { t: "Selecione «gato»", d: "As linhas ligam o ponto aos vizinhos mais parecidos pelo cosseno nas 16 dimensões.", run: () => { setKind("pca"); setNoise(0.45); setA(byTerm("gato")); setB(null); } },
    { t: "Troque para a projeção aleatória", d: "Os vizinhos verdadeiros se espalham: a figura deixa de mostrar quem está perto de quem.", run: () => { setKind("random"); if (a === null) setA(byTerm("gato")); } },
    { t: "Aumente o ruído para 1,0", d: "Os grupos se misturam no espaço original; nenhuma projeção consegue separá-los.", run: () => { setKind("pca"); setNoise(1); } },
    { t: "Compare «drone» com «algoritmo»", d: "«drone» foi gerado entre Tecnologia e Transporte. Veja o cosseno e o ângulo entre A e B.", run: () => { setKind("pca"); setNoise(0.45); setA(byTerm("drone")); setB(byTerm("algoritmo")); } },
  ];

  const use3d = webgl === true && !failed;
  const A = a !== null ? data[a] : null;
  const B = b !== null ? data[b] : null;

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* ---------------- Palco ---------------- */}
        <div className="lg:col-span-8">
          <div className="relative h-[58vh] min-h-[340px] max-h-[640px] overflow-hidden rounded-[12px] bg-[hsl(222_47%_7%)] lg:h-auto lg:aspect-[4/3] lg:max-h-none">
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, hsl(221 83% 53% / 0.14), transparent 70%)" }} />
            {use3d ? (
              <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
                <SceneBoundary onError={() => setFailed(true)}>
                  <Suspense fallback={null}>
                    <EmbeddingScene
                      points={points}
                      a={a}
                      b={b}
                      hover={hover}
                      neighbors={trueNeighbors}
                      autoRotate={autoRotate}
                      wheelZoom={wheelZoom}
                      distance={distance}
                      animate={animate}
                      onPick={pick}
                      onHover={setHover}
                      onReady={() => setReady(true)}
                    />
                  </Suspense>
                </SceneBoundary>
              </div>
            ) : (
              webgl !== null && <Scatter2D points={points} a={a} b={b} neighbors={trueNeighbors} onPick={pick} />
            )}
            {use3d && !ready && (
              <p role="status" className="absolute inset-0 grid place-items-center mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Carregando cena 3D…
              </p>
            )}

            <p className="pointer-events-none absolute left-3 top-3 rounded-[6px] border border-[hsl(38,92%,60%)]/40 bg-slate-900/70 px-2.5 py-1 mono text-[10px] uppercase tracking-[0.18em] text-[hsl(38,92%,68%)] backdrop-blur">
              Dados simulados
            </p>
            {!use3d && webgl !== null && (
              <p className="pointer-events-none absolute right-3 top-3 max-w-[60%] rounded-[6px] bg-slate-900/70 px-2.5 py-1 text-right text-[11px] text-slate-300 backdrop-blur">
                Vista 2D (eixos 1 e 2): este navegador não disponibilizou WebGL.
              </p>
            )}

            <ul className="pointer-events-none absolute bottom-3 left-3 hidden max-w-[62%] flex-wrap gap-x-3 gap-y-1 sm:flex" aria-label="Legenda de grupos">
              {GROUPS.map((g, i) => (
                <li key={g.name} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: PALETTE[i] }} />
                  {g.name}
                </li>
              ))}
            </ul>

            {use3d && (
              <div className="absolute bottom-3 right-3 flex gap-1.5">
                <button type="button" className={stageBtn} onClick={() => setAutoRotate((v) => !v)} aria-pressed={autoRotate} aria-label={autoRotate ? "Pausar rotação automática" : "Ativar rotação automática"} disabled={!animate}>
                  {autoRotate ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
                </button>
                <button type="button" className={stageBtn} onClick={() => setDistance((d) => Math.max(3.5, d - 1.2))} aria-label="Aproximar">
                  <Plus size={15} aria-hidden />
                </button>
                <button type="button" className={stageBtn} onClick={() => setDistance((d) => Math.min(13, d + 1.2))} aria-label="Afastar">
                  <Minus size={15} aria-hidden />
                </button>
              </div>
            )}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 sm:hidden" aria-label="Legenda de grupos">
            {GROUPS.map((g, i) => (
              <li key={g.name} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <span aria-hidden className="h-2 w-2 rounded-full ring-1 ring-black/10" style={{ background: PALETTE[i] }} />
                {g.name}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            {use3d ? "Arraste para girar. Clique em um ponto para escolher A; clique em outro para comparar com B." : "Clique em um ponto para escolher A; clique em outro para comparar com B."} A lista de
            termos abaixo faz o mesmo pelo teclado.
          </p>
        </div>

        {/* ---------------- Painéis ---------------- */}
        <div className="space-y-5 lg:col-span-4">
          <section aria-labelledby="ctl-title" className="rounded-[12px] border border-border bg-white p-5">
            <h2 id="ctl-title" className="mono text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
              Controles
            </h2>

            <fieldset className="mt-4">
              <legend className="text-[13px] font-semibold text-foreground">Projeção de 16 para 3 dimensões</legend>
              <div className="mt-2 grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Projeção">
                {KINDS.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    role="radio"
                    aria-checked={kind === x.id}
                    onClick={() => setKind(x.id)}
                    className={`rounded-[8px] border px-2 py-2 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      kind === x.id ? "border-primary bg-primary text-white" : "border-border bg-white text-foreground hover:border-primary/40"
                    }`}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{KINDS.find((x) => x.id === kind)!.note}</p>
            </fieldset>

            <label className="mt-5 block">
              <span className="flex items-baseline justify-between text-[13px] font-semibold text-foreground">
                Vizinhos (k) <span className="mono tabular-nums text-primary">{k}</span>
              </span>
              <input type="range" min={3} max={8} step={1} value={k} onChange={(e) => setK(+e.target.value)} className="mt-2 w-full accent-[hsl(221,83%,53%)]" />
            </label>

            <label className="mt-4 block">
              <span className="flex items-baseline justify-between text-[13px] font-semibold text-foreground">
                Ruído dentro do grupo <span className="mono tabular-nums text-primary">{num(noise)}</span>
              </span>
              <input type="range" min={0.1} max={1.2} step={0.05} value={noise} onChange={(e) => setNoise(+e.target.value)} className="mt-2 w-full accent-[hsl(221,83%,53%)]" />
              <span className="mt-1 block text-[12.5px] text-muted-foreground">Baixo: grupos compactos. Alto: grupos misturados.</span>
            </label>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className={btn} onClick={() => setSeed((s) => s + 1)}>
                <Shuffle size={14} aria-hidden />
                Nova amostra
              </button>
              <button type="button" className={btn} onClick={reset}>
                <RotateCcw size={14} aria-hidden />
                Restaurar
              </button>
            </div>
            {use3d && (
              <label className="mt-4 flex items-start gap-2 text-[12.5px] text-muted-foreground">
                <input type="checkbox" checked={wheelZoom} onChange={(e) => setWheelZoom(e.target.checked)} className="mt-0.5 accent-[hsl(221,83%,53%)]" />
                Zoom com a roda do mouse ou pinça (desligado por padrão para não interferir na rolagem da página)
              </label>
            )}
            <p className="mt-4 mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
              Semente {seed} · {data.length} termos · {DEFAULT_DIMS} dimensões
            </p>
          </section>

          <section aria-labelledby="read-title" aria-live="polite" className="rounded-[12px] border border-border bg-white p-5">
            <h2 id="read-title" className="mono text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
              Leitura
            </h2>
            {!A ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Escolha um termo no gráfico ou na lista para ver seus vizinhos e medir a similaridade.</p>
            ) : (
              <>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  <strong className="font-semibold">A · {A.term}</strong>{" "}
                  <span className="text-muted-foreground">
                    ({GROUPS[A.group].name}
                    {A.bridgeTo !== undefined ? ` ↔ ${GROUPS[A.bridgeTo].name}, termo-ponte` : ""})
                  </span>
                </p>
                {B && (
                  <dl className="mt-3 grid grid-cols-3 gap-2 rounded-[8px] bg-muted/60 p-3 text-center">
                    <div>
                      <dt className="mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">cos(A, B)</dt>
                      <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">{num(cosineSimilarity(A.vector, B.vector), 3)}</dd>
                    </div>
                    <div>
                      <dt className="mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">Ângulo</dt>
                      <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">{num(angleDegrees(A.vector, B.vector), 1)}°</dd>
                    </div>
                    <div>
                      <dt className="mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">Posição em 3D</dt>
                      <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">{rank3d.indexOf(B.id) + 1}º</dd>
                    </div>
                    <p className="col-span-3 text-left text-[12.5px] leading-relaxed text-muted-foreground">
                      B · <strong className="font-semibold text-foreground">{B.term}</strong> ({GROUPS[B.group].name}). Cosseno medido nas {DEFAULT_DIMS} dimensões; "posição em 3D" é a ordem de
                      proximidade de B em relação a A na figura.
                    </p>
                  </dl>
                )}
                <table className="mt-4 w-full text-left text-[13px]">
                  <caption className="mb-2 text-left text-[12.5px] leading-relaxed text-muted-foreground">
                    Os {k} vizinhos verdadeiros de A. <strong className="font-semibold text-foreground">{kept} de {k}</strong> também estão entre os {k} mais próximos na figura.
                  </caption>
                  <thead>
                    <tr className="border-b border-border mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
                      <th scope="col" className="py-1.5 font-medium">Termo</th>
                      <th scope="col" className="py-1.5 text-right font-medium">Cosseno</th>
                      <th scope="col" className="py-1.5 text-right font-medium">Em 3D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trueNeighbors.map((i) => {
                      const r = rank3d.indexOf(i) + 1;
                      return (
                        <tr key={i} className="border-b border-border/70">
                          <td className="py-1.5">
                            <button type="button" onClick={() => setB(i)} className="inline-flex items-center gap-2 rounded hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                              <span aria-hidden className="h-2 w-2 rounded-full ring-1 ring-black/10" style={{ background: PALETTE[data[i].group] }} />
                              {data[i].term}
                            </button>
                          </td>
                          <td className="py-1.5 text-right tabular-nums">{num(cosineSimilarity(A.vector, data[i].vector), 3)}</td>
                          <td className={`py-1.5 text-right tabular-nums ${r > k ? "font-semibold text-[hsl(18,90%,38%)]" : ""}`}>
                            {r}º{r > k ? " · fora" : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button type="button" className={`${btn} mt-4`} onClick={() => { setA(null); setB(null); }}>
                  Limpar seleção
                </button>
              </>
            )}
          </section>
        </div>
      </div>

      {/* ---------------- Comparação entre representações ---------------- */}
      <section aria-labelledby="cmp-title" className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="cmp-title" className="text-2xl font-semibold leading-tight text-foreground">A mesma nuvem, três figuras diferentes.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Os vetores não mudam quando você troca a projeção; muda só o que cabe em três eixos. Com a configuração atual, a figura retém{" "}
            <strong className="font-semibold text-foreground">{pct(current.variance)}</strong> da variância e mostra, em média,{" "}
            <strong className="font-semibold text-foreground">{pct(current.preservation)}</strong> dos {k} vizinhos verdadeiros de cada ponto.
          </p>
        </div>
        <div className="lg:col-span-8">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Comparação das três projeções com os parâmetros atuais</caption>
            <thead>
              <tr className="border-b border-border mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th scope="col" className="py-2 font-medium">Projeção</th>
                <th scope="col" className="py-2 font-medium">Variância retida</th>
                <th scope="col" className="py-2 font-medium">Vizinhança preservada (k = {k})</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((c) => (
                <tr key={c.id} className={`border-b border-border ${c.id === kind ? "bg-primary/[0.05]" : ""}`}>
                  <th scope="row" className="py-3 pr-3 font-semibold text-foreground">
                    {c.label}
                    {c.id === kind && <span className="ml-2 mono text-[9.5px] uppercase tracking-[0.14em] text-primary">em uso</span>}
                    <span className="block text-[12.5px] font-normal text-muted-foreground">{c.note}</span>
                  </th>
                  {[c.variance, c.preservation].map((v, i) => (
                    <td key={i} className="py-3 pr-4 align-middle">
                      <div className="flex items-center gap-3">
                        <span className="w-10 tabular-nums font-medium text-foreground">{pct(v)}</span>
                        <span aria-hidden className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <span className="block h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: pct(Math.min(1, v)) }} />
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            Vizinhança preservada: para cada ponto, a fração dos k vizinhos por cosseno (16 dimensões) que continuam entre os k mais próximos por distância na figura; a tabela mostra a média.
          </p>
        </div>
      </section>

      {/* ---------------- Roteiro guiado ---------------- */}
      <section aria-labelledby="tour-title">
        <h2 id="tour-title" className="mono text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          Roteiro em quatro passos
        </h2>
        <ol className="mt-4 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {tour.map((s, i) => (
            <li key={s.t} className="border-t border-border pt-4">
              <span className="mono text-[11px] tabular-nums tracking-[0.2em] text-[hsl(38,60%,38%)]">0{i + 1}</span>
              <h3 className="mt-1.5 font-semibold text-foreground">{s.t}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.d}</p>
              <button type="button" className={`${btn} mt-3`} onClick={s.run}>
                Aplicar
              </button>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- Lista de termos (teclado e leitores de tela) ---------------- */}
      <section aria-labelledby="terms-title">
        <h2 id="terms-title" className="mono text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          Termos por grupo
        </h2>
        <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g, gi) => (
            <div key={g.name}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ background: PALETTE[gi] }} />
                {g.name}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data
                  .filter((p) => p.group === gi)
                  .map((p) => {
                    const on = p.id === a ? "A" : p.id === b ? "B" : null;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={!!on}
                        onClick={() => pick(p.id)}
                        className={`rounded-[6px] border px-2 py-1 text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                          on ? "border-primary bg-primary text-white" : "border-border bg-white text-foreground hover:border-primary/40"
                        }`}
                      >
                        {on && <span className="mr-1 font-semibold">{on} ·</span>}
                        {p.term}
                        {p.bridgeTo !== undefined && <span className="ml-1 opacity-70">↔</span>}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12.5px] text-muted-foreground">↔ indica termo-ponte, gerado a meio caminho entre dois grupos.</p>
      </section>

      <EmbeddingNotes />
    </div>
  );
}
