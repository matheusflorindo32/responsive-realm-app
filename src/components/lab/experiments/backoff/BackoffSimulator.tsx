import { useMemo, useState } from "react";
import { RotateCcw, Shuffle } from "lucide-react";
import { STRATEGIES, WINDOW_MS, binSeries, simulateBackoff, type BackoffParams, type BackoffResult, type Strategy } from "@/lib/lab/backoff";
import { B, Formula, Notes, Panel, Range, Segmented, SimBadge, Stat, btn, eyebrow, num, type LabRef } from "../../ui";

const DEFAULTS = { strategy: "jitter" as Strategy, clients: 100, outageS: 8, capacityPerS: 100, maxAttempts: 8, baseS: 0.5, capS: 20, seed: 1 };

const OK = "#2563eb";
const FAIL = "#D55E00";

const REFS: LabRef[] = [
  {
    cite: "BROOKER, M. Exponential backoff and jitter. AWS Architecture Blog, 2015.",
    href: "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/",
    why: "Compara, por simulação, recuo exponencial com e sem variação aleatória; origem da estratégia de variação total usada aqui.",
  },
  {
    cite: "BROOKER, M. Timeouts, retries, and backoff with jitter. The Amazon Builders' Library.",
    href: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
    why: "Quando tentar de novo, quando desistir e por que retentativas só são seguras em operações idempotentes.",
  },
  {
    cite: "ULRICH, M. Addressing cascading failures. In: BEYER, B. et al. (org.). Site Reliability Engineering. O'Reilly, 2016. cap. 22.",
    href: "https://sre.google/sre-book/addressing-cascading-failures/",
    why: "Como retentativas em massa transformam uma falha curta em sobrecarga prolongada.",
  },
  {
    cite: "FIELDING, R.; NOTTINGHAM, M.; RESCHKE, J. (ed.). RFC 9110: HTTP Semantics. IETF, 2022. Seção 10.2.3 (Retry-After).",
    href: "https://www.rfc-editor.org/rfc/rfc9110#section-10.2.3",
    why: "O cabeçalho com que o próprio destino diz quanto esperar — que este simulador não modela.",
  },
];

const secs = (ms: number | null) => (ms === null ? "—" : `${num(ms / 1000, 1)} s`);

function Chart({ r, outageMs, capacityPerWindow }: { r: BackoffResult; outageMs: number; capacityPerWindow: number }) {
  const W = 800;
  const H = 280;
  const pad = { l: 44, r: 12, t: 16, b: 34 };
  const { ok, failed, windowsPerBar } = binSeries(r.ok, r.failed, 110);
  const n = Math.max(ok.length, 1);
  const barMs = windowsPerBar * WINDOW_MS;
  const cap = capacityPerWindow * windowsPerBar;
  const top = Math.max(cap * 1.15, ...ok.map((v, i) => v + failed[i]), 1);
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x = (i: number) => pad.l + (i / n) * iw;
  const y = (v: number) => pad.t + ih - (v / top) * ih;
  const bw = Math.max(1, iw / n - 1);
  const totalS = (n * barMs) / 1000;
  const stepS = totalS <= 12 ? 1 : totalS <= 30 ? 5 : totalS <= 90 ? 10 : 30;
  const ticks = Array.from({ length: Math.floor(totalS / stepS) + 1 }, (_, i) => i * stepS);
  const outageX = pad.l + Math.min(1, outageMs / (n * barMs)) * iw;
  const yTicks = [0, top / 2, top].map((v) => Math.round(v));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Chamadas recebidas pelo destino ao longo do tempo. Total de ${r.totalCalls} chamadas; pico de ${r.peakPerWindow} em 100 milissegundos.`}>
      <rect x={pad.l} y={pad.t} width={outageX - pad.l} height={ih} fill="hsl(18 90% 45% / 0.07)" />
      <text x={Math.max(pad.l + 120, outageX - 6)} y={pad.t + 14} fontSize="11" textAnchor="end" fill="hsl(18 80% 32%)">
        destino fora do ar
      </text>
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="hsl(215 20% 91%)" strokeWidth="1" />
          <text x={pad.l - 6} y={y(v) + 3.5} fontSize="10.5" textAnchor="end" fill="hsl(215 16% 42%)">
            {v}
          </text>
        </g>
      ))}
      {ok.map((v, i) => (
        <g key={i}>
          {failed[i] > 0 && <rect x={x(i)} y={y(v + failed[i])} width={bw} height={y(v) - y(v + failed[i])} fill={FAIL} />}
          {v > 0 && <rect x={x(i)} y={y(v)} width={bw} height={y(0) - y(v)} fill={OK} />}
        </g>
      ))}
      <line x1={outageX} x2={W - pad.r} y1={y(cap)} y2={y(cap)} stroke="hsl(222 47% 20%)" strokeWidth="1" strokeDasharray="5 4" />
      <text x={W - pad.r} y={y(cap) - 5} fontSize="10.5" textAnchor="end" fill="hsl(222 47% 20%)">
        capacidade
      </text>
      {ticks.map((t) => (
        <text key={t} x={pad.l + (t / totalS) * iw} y={H - 14} fontSize="10.5" textAnchor="middle" fill="hsl(215 16% 42%)">
          {t} s
        </text>
      ))}
      <text x={pad.l} y={H - 1} fontSize="10" fill="hsl(215 16% 42%)">
        chamadas a cada {barMs >= 1000 ? `${num(barMs / 1000, 1)} s` : `${barMs} ms`}
      </text>
    </svg>
  );
}

export default function BackoffSimulator() {
  const [strategy, setStrategy] = useState<Strategy>(DEFAULTS.strategy);
  const [clients, setClients] = useState(DEFAULTS.clients);
  const [outageS, setOutageS] = useState(DEFAULTS.outageS);
  const [capacityPerS, setCapacityPerS] = useState(DEFAULTS.capacityPerS);
  const [maxAttempts, setMaxAttempts] = useState(DEFAULTS.maxAttempts);
  const [baseS, setBaseS] = useState(DEFAULTS.baseS);
  const [capS, setCapS] = useState(DEFAULTS.capS);
  const [seed, setSeed] = useState(DEFAULTS.seed);

  const shared: Omit<BackoffParams, "strategy"> = useMemo(
    () => ({ clients, outageMs: outageS * 1000, capacityPerWindow: Math.max(1, Math.round(capacityPerS / (1000 / WINDOW_MS))), maxAttempts, baseMs: baseS * 1000, capMs: capS * 1000, seed }),
    [clients, outageS, capacityPerS, maxAttempts, baseS, capS, seed],
  );
  const all = useMemo(() => STRATEGIES.map((s) => ({ ...s, r: simulateBackoff({ ...shared, strategy: s.id }) })), [shared]);
  const current = all.find((s) => s.id === strategy)!;
  const r = current.r;

  const reset = () => {
    setStrategy(DEFAULTS.strategy);
    setClients(DEFAULTS.clients);
    setOutageS(DEFAULTS.outageS);
    setCapacityPerS(DEFAULTS.capacityPerS);
    setMaxAttempts(DEFAULTS.maxAttempts);
    setBaseS(DEFAULTS.baseS);
    setCapS(DEFAULTS.capS);
    setSeed(DEFAULTS.seed);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <div className="rounded-[12px] border border-border bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{current.label}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{current.note}</p>
              </div>
              <SimBadge>Simulação</SimBadge>
            </div>
            <div className="mt-5">
              <Chart r={r} outageMs={shared.outageMs} capacityPerWindow={shared.capacityPerWindow} />
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted-foreground">
              <li className="flex items-center gap-2"><span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: OK }} />atendidas</li>
              <li className="flex items-center gap-2"><span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: FAIL }} />recusadas (queda ou sobrecarga)</li>
            </ul>
          </div>

          <dl aria-live="polite" className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3">
            <Stat label="Clientes atendidos" value={`${r.served} de ${clients}`} hint={r.gaveUp ? `${r.gaveUp} desistiram` : "ninguém desistiu"} />
            <Stat label="Total de chamadas" value={r.totalCalls.toLocaleString("pt-BR")} hint={`${num(r.totalCalls / clients, 1)} por cliente`} />
            <Stat label="Pico após a volta" value={String(r.peakAfterRecovery)} hint={`em 100 ms; capacidade ${shared.capacityPerWindow}`} />
            <Stat label="Chamadas recusadas" value={(r.totalCalls - r.served).toLocaleString("pt-BR")} />
            <Stat label="Último atendimento" value={secs(r.lastSuccessMs)} hint={`a queda terminou em ${outageS} s`} />
            <Stat label="Pico geral" value={String(r.peakPerWindow)} hint="chamadas em 100 ms" />
          </dl>
        </div>

        <div className="lg:col-span-4">
          <Panel title="Controles" id="bo-ctl">
            <Segmented<Strategy> label="Estratégia do cliente" columns={2} options={STRATEGIES.map((s) => ({ id: s.id, label: s.label }))} value={strategy} onChange={setStrategy} />
            <Range label="Clientes" display={String(clients)} min={10} max={300} step={10} value={clients} onChange={setClients} />
            <Range label="Duração da queda" display={`${outageS} s`} min={1} max={30} step={1} value={outageS} onChange={setOutageS} />
            <Range label="Capacidade do destino" display={`${capacityPerS}/s`} min={10} max={400} step={10} value={capacityPerS} onChange={setCapacityPerS} hint="Chamadas aceitas por segundo depois que ele volta." />
            <Range label="Espera base" display={`${num(baseS, 1)} s`} min={0.1} max={2} step={0.1} value={baseS} onChange={setBaseS} />
            <Range label="Teto da espera" display={`${capS} s`} min={1} max={60} step={1} value={capS} onChange={setCapS} />
            <Range label="Máximo de tentativas" display={String(maxAttempts)} min={2} max={12} step={1} value={maxAttempts} onChange={setMaxAttempts} hint="Conta a primeira chamada." />
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btn} onClick={() => setSeed((s) => s + 1)}>
                <Shuffle size={14} aria-hidden />
                Nova amostra
              </button>
              <button type="button" className={btn} onClick={reset}>
                <RotateCcw size={14} aria-hidden />
                Restaurar
              </button>
            </div>
            <p className="mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">Semente {seed}</p>
          </Panel>
        </div>
      </div>

      <section aria-labelledby="bo-cmp" className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="bo-cmp" className="text-2xl font-semibold leading-tight text-foreground">As quatro estratégias, na mesma falha.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Mesmos clientes, mesma queda, mesma capacidade. Só muda como cada cliente espera antes de tentar de novo.</p>
        </div>
        <div className="overflow-x-auto lg:col-span-8">
          <table className="w-full min-w-[520px] text-left text-sm">
            <caption className="sr-only">Resultado de cada estratégia com os parâmetros atuais</caption>
            <thead>
              <tr className="border-b border-border mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <th scope="col" className="py-2 font-medium">Estratégia</th>
                <th scope="col" className="py-2 text-right font-medium">Atendidos</th>
                <th scope="col" className="py-2 text-right font-medium">Chamadas</th>
                <th scope="col" className="py-2 text-right font-medium">Pico após a volta</th>
                <th scope="col" className="py-2 text-right font-medium">Último atendimento</th>
              </tr>
            </thead>
            <tbody>
              {all.map((s) => (
                <tr key={s.id} className={`border-b border-border ${s.id === strategy ? "bg-primary/[0.05]" : ""}`}>
                  <th scope="row" className="py-3 pr-3 font-semibold text-foreground">
                    <button type="button" onClick={() => setStrategy(s.id)} className="text-left hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded">
                      {s.label}
                    </button>
                    {s.id === strategy && <span className="ml-2 mono text-[9.5px] uppercase tracking-[0.14em] text-primary">no gráfico</span>}
                  </th>
                  <td className={`py-3 text-right tabular-nums ${s.r.served < clients ? "font-semibold text-[hsl(18,90%,38%)]" : ""}`}>
                    {s.r.served} de {clients}
                  </td>
                  <td className="py-3 text-right tabular-nums">{s.r.totalCalls.toLocaleString("pt-BR")}</td>
                  <td className="py-3 text-right tabular-nums">{s.r.peakAfterRecovery}</td>
                  <td className="py-3 text-right tabular-nums">{secs(s.r.lastSuccessMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="O que observar">
        <h2 className={eyebrow}>O que observar</h2>
        <ol className="mt-4 grid gap-x-6 gap-y-6 sm:grid-cols-3">
          {[
            { t: "Escolha «Sem espera»", d: "Todas as tentativas são gastas em menos de um segundo, com o destino ainda fora do ar. Ninguém é atendido." },
            { t: "Compare «Exponencial» com a variação", d: "Sem sorteio, os clientes que falharam juntos voltam juntos. A variação desfaz as rajadas." },
            { t: "Reduza a capacidade para 20/s", d: "A queda acaba, mas o destino continua recusando chamadas: a própria fila de retentativas vira a sobrecarga." },
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
            t: "A manada",
            body: (
              <p>
                Quando um serviço cai, todos os clientes falham quase ao mesmo tempo. Se todos tentarem de novo no mesmo ritmo, as chamadas chegam em rajadas sincronizadas — e a rajada pode
                derrubar o serviço outra vez no instante em que ele volta.
              </p>
            ),
          },
          {
            t: "Recuo exponencial com teto",
            body: (
              <>
                <Formula label="espera é igual ao mínimo entre o teto e a base vezes dois elevado ao número de falhas">espera = min(teto, base × 2ⁿ)</Formula>
                <p>A cada falha a espera dobra, o que reduz depressa a carga sobre um destino doente. O teto impede esperas absurdas depois de muitas falhas.</p>
              </>
            ),
          },
          {
            t: "Variação aleatória",
            body: (
              <>
                <Formula label="espera é igual a um sorteio uniforme entre zero e o mínimo entre o teto e a base vezes dois elevado a n">espera = sorteio(0, min(teto, base × 2ⁿ))</Formula>
                <p>Cada cliente sorteia sua espera dentro do intervalo. As chamadas deixam de chegar juntas e a carga se espalha no tempo.</p>
              </>
            ),
          },
        ]}
        limits={[
          <>
            <B>É uma simulação simplificada.</B> O destino só tem dois estados (fora do ar ou no ar com capacidade fixa), toda falha volta em 50 ms e os clientes são idênticos. Sistemas reais
            degradam aos poucos e têm latência variável.
          </>,
          <>
            <B>Os números valem para este modelo.</B> Eles mostram o comportamento relativo das estratégias, não preveem o desempenho de nenhum serviço.
          </>,
          <>
            <B>Tentar de novo só é seguro em operações idempotentes.</B> Se a primeira chamada foi processada e apenas a resposta se perdeu, a retentativa repete o efeito — duas cobranças,
            dois cadastros. O simulador não modela esse risco.
          </>,
          <>
            <B>Faltam proteções que um sistema real deveria ter:</B> respeitar o cabeçalho Retry-After, disjuntor, limite global de retentativas e fila de mensagens que não puderam ser
            entregues.
          </>,
        ]}
        refs={REFS}
      />
    </div>
  );
}
