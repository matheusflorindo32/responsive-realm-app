import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Z_BY_LEVEL, coverageCurve, wald, wilson, type Interval, type Level } from "@/lib/lab/wilson";
import { B, Formula, Notes, Panel, Range, Segmented, Stat, btn, eyebrow, num, pct, type LabRef } from "../../ui";

const DEFAULTS = { n: 36, k: 33, level: 95 as Level };

const WILSON = "#2563eb";
const WALD = "#D55E00";

const PRESETS = [
  { label: "33 de 36", n: 36, k: 33, note: "3 rodadas de 12 checagens" },
  { label: "10 de 10", n: 10, k: 10, note: "tudo aprovado, poucos dados" },
  { label: "0 de 5", n: 5, k: 0, note: "nenhuma aprovação" },
  { label: "180 de 200", n: 200, k: 180, note: "mesma taxa, muito mais dados" },
] as const;

const REFS: LabRef[] = [
  {
    cite: "WILSON, E. B. Probable inference, the law of succession, and statistical inference. Journal of the American Statistical Association, v. 22, n. 158, p. 209–212, 1927.",
    href: "https://doi.org/10.1080/01621459.1927.10502953",
    why: "Artigo original do intervalo calculado aqui.",
  },
  {
    cite: "BROWN, L. D.; CAI, T. T.; DASGUPTA, A. Interval estimation for a binomial proportion. Statistical Science, v. 16, n. 2, p. 101–133, 2001.",
    href: "https://doi.org/10.1214/ss/1009213286",
    why: "Mostra que a cobertura do intervalo de Wald é errática mesmo com amostras grandes e recomenda Wilson para amostras pequenas.",
  },
  {
    cite: "AGRESTI, A.; COULL, B. A. Approximate is better than \"exact\" for interval estimation of binomial proportions. The American Statistician, v. 52, n. 2, p. 119–126, 1998.",
    href: "https://doi.org/10.1080/00031305.1998.10480550",
    why: "Compara os métodos e explica por que o intervalo de Wilson se comporta melhor.",
  },
];

const range = (ci: Interval) => `${pct(ci.low, 1)} a ${pct(ci.high, 1)}`;

/** Régua de 0 a 100% com os dois intervalos e a proporção observada. */
function Ruler({ p, wi, wa, level }: { p: number; wi: Interval; wa: Interval; level: Level }) {
  const W = 800;
  const H = 150;
  const l = 24;
  const r = 24;
  const x = (v: number) => l + v * (W - l - r);
  const bar = (ci: Interval, y: number, color: string, name: string) => (
    <g>
      <line x1={x(ci.low)} x2={x(ci.high)} y1={y} y2={y} stroke={color} strokeWidth="8" strokeLinecap="round" />
      {/* Intervalo de largura zero: marca visível mesmo assim. */}
      {ci.high - ci.low < 0.004 && <circle cx={x(ci.low)} cy={y} r="6" fill={color} />}
      <text x={x(Math.min(0.86, Math.max(0, ci.low)))} y={y - 12} fontSize="12" fill={color} fontWeight="600" stroke="#fff" strokeWidth="4" paintOrder="stroke">
        {name} · {range(ci)}
      </text>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Intervalo de Wilson de ${range(wi)} e intervalo de Wald de ${range(wa)}, com ${level}% de confiança. Proporção observada: ${pct(p, 1)}.`}>
      <line x1={x(0)} x2={x(1)} y1={118} y2={118} stroke="hsl(215 20% 80%)" strokeWidth="1" />
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={112} y2={124} stroke="hsl(215 20% 70%)" strokeWidth="1" />
          <text x={x(t)} y={142} fontSize="11" textAnchor="middle" fill="hsl(215 16% 42%)">
            {pct(t)}
          </text>
        </g>
      ))}
      {bar(wi, 40, WILSON, "Wilson")}
      {bar(wa, 86, WALD, "Wald")}
      <line x1={x(p)} x2={x(p)} y1={22} y2={118} stroke="hsl(222 47% 12%)" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx={x(p)} cy={118} r="4.5" fill="hsl(222 47% 12%)" />
    </svg>
  );
}

/** Cobertura exata de cada método em função da proporção verdadeira. */
function CoverageChart({ n, z, level }: { n: number; z: number; level: Level }) {
  const data = useMemo(() => ({ wilson: coverageCurve("wilson", n, z), wald: coverageCurve("wald", n, z) }), [n, z]);
  const W = 800;
  const H = 280;
  const pad = { l: 46, r: 14, t: 14, b: 34 };
  const lo = 0.5;
  const x = (p: number) => pad.l + p * (W - pad.l - pad.r);
  const y = (c: number) => pad.t + (1 - (Math.max(lo, c) - lo) / (1 - lo)) * (H - pad.t - pad.b);
  const path = (pts: { p: number; c: number }[]) => pts.map((d, i) => `${i ? "L" : "M"}${x(d.p).toFixed(1)},${y(d.c).toFixed(1)}`).join(" ");
  const mean = (pts: { c: number }[]) => pts.reduce((s, d) => s + d.c, 0) / pts.length;
  const min = (pts: { c: number }[]) => Math.min(...pts.map((d) => d.c));
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Cobertura real dos intervalos com ${n} checagens. Wilson: média ${pct(mean(data.wilson), 1)}, mínimo ${pct(min(data.wilson), 1)}. Wald: média ${pct(mean(data.wald), 1)}, mínimo ${pct(min(data.wald), 1)}.`}>
        {[0.5, 0.6, 0.7, 0.8, 0.9, 1].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="hsl(215 20% 91%)" strokeWidth="1" />
            <text x={pad.l - 6} y={y(v) + 3.5} fontSize="10.5" textAnchor="end" fill="hsl(215 16% 42%)">
              {v === lo ? `≤ ${pct(v)}` : pct(v)}
            </text>
          </g>
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={y(level / 100)} y2={y(level / 100)} stroke="hsl(222 47% 20%)" strokeWidth="1" strokeDasharray="5 4" />
        <text x={W - pad.r} y={y(level / 100) - 5} fontSize="10.5" textAnchor="end" fill="hsl(222 47% 20%)">
          nível prometido · {level}%
        </text>
        <path d={path(data.wald)} fill="none" stroke={WALD} strokeWidth="1.6" strokeLinejoin="round" />
        <path d={path(data.wilson)} fill="none" stroke={WILSON} strokeWidth="2" strokeLinejoin="round" />
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <text key={t} x={x(t)} y={H - 14} fontSize="10.5" textAnchor="middle" fill="hsl(215 16% 42%)">
            {pct(t)}
          </text>
        ))}
        <text x={pad.l} y={H - 1} fontSize="10" fill="hsl(215 16% 42%)">
          proporção verdadeira
        </text>
      </svg>
      <table className="mt-3 w-full text-left text-sm">
        <caption className="sr-only">Cobertura média e mínima de cada método</caption>
        <thead>
          <tr className="border-b border-border mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <th scope="col" className="py-2 font-medium">Método</th>
            <th scope="col" className="py-2 text-right font-medium">Cobertura média</th>
            <th scope="col" className="py-2 text-right font-medium">Pior caso</th>
          </tr>
        </thead>
        <tbody>
          {([["Wilson", data.wilson, WILSON], ["Wald", data.wald, WALD]] as const).map(([name, pts, color]) => (
            <tr key={name} className="border-b border-border">
              <th scope="row" className="py-2.5 font-semibold text-foreground">
                <span aria-hidden className="mr-2 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: color }} />
                {name}
              </th>
              <td className="py-2.5 text-right tabular-nums">{pct(mean(pts), 1)}</td>
              <td className="py-2.5 text-right tabular-nums">{pct(min(pts), 1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function WilsonExplorer() {
  const [n, setN] = useState(DEFAULTS.n);
  const [kRaw, setK] = useState(DEFAULTS.k);
  const [level, setLevel] = useState<Level>(DEFAULTS.level);
  const k = Math.min(kRaw, n);
  const z = Z_BY_LEVEL[level];
  const p = k / n;
  const wi = wilson(k, n, z);
  const wa = wald(k, n, z);
  const collapsed = wa.high - wa.low < 1e-9;

  // Para a mesma taxa observada, quanto o intervalo estreita com mais checagens.
  const growth = [n, n * 3, n * 10, n * 30].map((m) => {
    const c = wilson(Math.round(p * m), m, z);
    return { m, low: c.low, high: c.high, width: c.high - c.low };
  });

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <div className="rounded-[12px] border border-border bg-white p-5 sm:p-7">
            <h2 className="text-xl font-semibold text-foreground">
              {k} de {n} checagens aprovadas · {level}% de confiança
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">A linha tracejada é a proporção observada. As barras são o que cada método diz sobre a taxa verdadeira.</p>
            <div className="mt-4">
              <Ruler p={p} wi={wi} wa={wa} level={level} />
            </div>
            {collapsed && (
              <p role="status" className="mt-3 rounded-[8px] border border-[hsl(18,90%,45%)]/30 bg-[hsl(18,90%,97%)] px-4 py-3 text-sm leading-relaxed text-[hsl(18,80%,26%)]">
                O intervalo de Wald ficou com largura zero: ele afirma certeza absoluta a partir de {n} {n === 1 ? "observação" : "observações"}. O de Wilson continua admitindo a dúvida.
              </p>
            )}
          </div>
          <dl aria-live="polite" className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4">
            <Stat label="Observado" value={pct(p, 1)} hint={`${k} de ${n}`} />
            <Stat label="Wilson, limite inferior" value={pct(wi.low, 1)} />
            <Stat label="Wilson, limite superior" value={pct(wi.high, 1)} />
            <Stat label="Largura" value={`${num((wi.high - wi.low) * 100, 1)} p.p.`} hint="pontos percentuais" />
          </dl>
        </div>

        <div className="lg:col-span-4">
          <Panel title="Controles" id="wi-ctl">
            <Range label="Checagens (n)" display={String(n)} min={1} max={200} step={1} value={n} onChange={setN} />
            <Range label="Aprovadas (k)" display={String(k)} min={0} max={n} step={1} value={k} onChange={setK} />
            <Segmented<"90" | "95" | "99"> label="Nível de confiança" options={[{ id: "90", label: "90%" }, { id: "95", label: "95%" }, { id: "99", label: "99%" }]} value={String(level) as "90" | "95" | "99"} onChange={(v) => setLevel(Number(v) as Level)} />
            <div>
              <p className="text-[13px] font-semibold text-foreground">Exemplos</p>
              <ul className="mt-2 space-y-1.5">
                {PRESETS.map((s) => (
                  <li key={s.label}>
                    <button type="button" className={`${btn} w-full justify-between`} onClick={() => { setN(s.n); setK(s.k); }}>
                      <span>{s.label}</span>
                      <span className="text-[12px] font-normal text-muted-foreground">{s.note}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className={btn} onClick={() => { setN(DEFAULTS.n); setK(DEFAULTS.k); setLevel(DEFAULTS.level); }}>
              <RotateCcw size={14} aria-hidden />
              Restaurar
            </button>
          </Panel>
        </div>
      </div>

      <section aria-labelledby="wi-grow" className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="wi-grow" className="text-2xl font-semibold leading-tight text-foreground">Quanto custa estreitar o intervalo.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Mantendo a taxa observada de {pct(p, 1)}, veja o intervalo com mais checagens. A largura cai mais ou menos com a raiz quadrada de n: para cortar pela metade é preciso
            quadruplicar os dados.
          </p>
        </div>
        <div className="overflow-x-auto lg:col-span-8">
          <table className="w-full min-w-[420px] text-left text-sm">
            <caption className="sr-only">Intervalo de Wilson para a mesma taxa com mais checagens</caption>
            <thead>
              <tr className="border-b border-border mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <th scope="col" className="py-2 font-medium">Checagens</th>
                <th scope="col" className="py-2 font-medium">Intervalo de Wilson</th>
                <th scope="col" className="py-2 text-right font-medium">Largura</th>
              </tr>
            </thead>
            <tbody>
              {growth.map((g, i) => (
                <tr key={g.m} className={`border-b border-border ${i === 0 ? "bg-primary/[0.05]" : ""}`}>
                  <th scope="row" className="py-3 font-semibold tabular-nums text-foreground">
                    {g.m.toLocaleString("pt-BR")}
                    {i === 0 && <span className="ml-2 mono text-[9.5px] uppercase tracking-[0.14em] text-primary">atual</span>}
                  </th>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-[128px] shrink-0 tabular-nums">{range(g)}</span>
                      <span aria-hidden className="relative h-1.5 flex-1 rounded-full bg-muted">
                        <span className="absolute inset-y-0 rounded-full bg-primary" style={{ left: `${g.low * 100}%`, width: `${Math.max(0.6, g.width * 100)}%` }} />
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right tabular-nums">{num(g.width * 100, 1)} p.p.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="wi-cov" className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="wi-cov" className="text-2xl font-semibold leading-tight text-foreground">O intervalo cumpre o que promete?</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Um intervalo de {level}% deveria conter a taxa verdadeira em cerca de {level}% das vezes. O gráfico mostra a cobertura <B>real</B> de cada método para n = {n}, calculada de forma
            exata pela distribuição binomial — sem sorteio.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Perto de 0% e de 100%, o método de Wald despenca. O de Wilson oscila em torno do nível prometido.</p>
        </div>
        <div className="lg:col-span-8">
          <CoverageChart n={n} z={z} level={level} />
        </div>
      </section>

      <section aria-label="O que observar">
        <h2 className={eyebrow}>O que observar</h2>
        <ol className="mt-4 grid gap-x-6 gap-y-6 sm:grid-cols-3">
          {[
            { t: "Abra «10 de 10»", d: "100% de aprovação com 10 checagens ainda é compatível com uma taxa verdadeira perto de 72%." },
            { t: "Compare «33 de 36» com «180 de 200»", d: "A taxa observada é quase a mesma; o intervalo com 200 checagens tem menos da metade da largura." },
            { t: "Suba o nível para 99%", d: "Mais confiança custa largura. Não existe intervalo estreito e muito confiável com poucos dados." },
          ].map((s, i) => (
            <li key={s.t} className="border-t border-border pt-4">
              <span className="mono text-[11px] tabular-nums tracking-[0.2em] text-[hsl(38,60%,38%)]">0{i + 1}</span>
              <h3 className="mt-1.5 font-semibold text-foreground">{s.t}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <Notes
        explain={[
          {
            t: "Uma proporção nunca vem sozinha",
            body: (
              <p>
                "33 de 36 aprovadas" é o que aconteceu nesta amostra. A taxa verdadeira do sistema pode ser maior ou menor. O intervalo de confiança diz quais taxas são compatíveis com o que
                foi observado.
              </p>
            ),
          },
          {
            t: "A conta de Wilson",
            body: (
              <>
                <Formula label="centro é igual a p chapéu mais z ao quadrado sobre dois n, tudo dividido por um mais z ao quadrado sobre n">centro = (p̂ + z²/2n) / (1 + z²/n)</Formula>
                <Formula label="margem é igual a z vezes a raiz de p chapéu vezes um menos p chapéu sobre n mais z ao quadrado sobre quatro n ao quadrado, dividido por um mais z ao quadrado sobre n">
                  margem = z·√(p̂(1−p̂)/n + z²/4n²) / (1 + z²/n)
                </Formula>
                <p>p̂ é a proporção observada (k/n) e z vem do nível de confiança (1,96 para 95%). O centro é puxado em direção a 50%, mais forte quando n é pequeno.</p>
              </>
            ),
          },
          {
            t: "Como ler os 95%",
            body: (
              <p>
                Se o mesmo teste fosse repetido muitas vezes, cerca de 95% dos intervalos calculados conteriam a taxa verdadeira. Não é o mesmo que dizer que há 95% de chance de a taxa estar
                neste intervalo específico — a diferença é sutil, mas é a leitura correta.
              </p>
            ),
          },
        ]}
        limits={[
          <>
            <B>A conta supõe checagens independentes e com a mesma chance de aprovação.</B> Checagens da mesma rodada costumam falhar juntas (mesma causa, mesmo ambiente). Nesse caso o
            intervalo real é mais largo do que o mostrado.
          </>,
          <>
            <B>O intervalo mede incerteza de amostragem, não a qualidade do teste.</B> Se as checagens não representam o uso real, um intervalo estreito continua descrevendo a coisa errada.
          </>,
          <>
            <B>A cobertura de Wilson não é exatamente o nível nominal.</B> Ela oscila em torno dele e pode ficar um pouco abaixo para algumas combinações de n e taxa, como o gráfico mostra.
          </>,
          <>
            <B>Existem outros métodos</B> (Clopper–Pearson, Agresti–Coull, Jeffreys) com compromissos diferentes entre largura e cobertura. Este experimento compara apenas Wilson e Wald.
          </>,
        ]}
        refs={REFS}
      />
    </div>
  );
}
