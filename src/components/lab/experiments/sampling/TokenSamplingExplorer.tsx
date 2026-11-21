import { useMemo, useState } from "react";
import { Dices, RotateCcw } from "lucide-react";
import { mulberry32 } from "@/lib/lab/embedding";
import { SCENARIOS, applySampling, effectiveChoices, entropyBits, sampleCounts } from "@/lib/lab/sampling";
import { B, Formula, Notes, Panel, Range, Segmented, SimBadge, Stat, btn, btnPrimary, eyebrow, num, pct, type LabRef } from "../../ui";

type ScenarioId = (typeof SCENARIOS)[number]["id"];

const DEFAULTS = { scenario: "descricao" as ScenarioId, temperature: 1, topK: 10, topP: 1 };

const REFS: LabRef[] = [
  {
    cite: "HOLTZMAN, A. et al. The curious case of neural text degeneration. International Conference on Learning Representations (ICLR), 2020. arXiv:1904.09751.",
    href: "https://arxiv.org/abs/1904.09751",
    why: "Propõe a amostragem por núcleo (top-p) e compara com top-k e com a escolha sempre do mais provável.",
  },
  {
    cite: "FAN, A.; LEWIS, M.; DAUPHIN, Y. Hierarchical neural story generation. Annual Meeting of the Association for Computational Linguistics (ACL), 2018. arXiv:1805.04833.",
    href: "https://arxiv.org/abs/1805.04833",
    why: "Uso de amostragem top-k em geração de texto.",
  },
  {
    cite: "SHANNON, C. E. A mathematical theory of communication. Bell System Technical Journal, v. 27, n. 3, p. 379–423, 1948.",
    href: "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
    why: "Define a entropia usada aqui para medir o quanto a escolha está espalhada.",
  },
];

export default function TokenSamplingExplorer() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>(DEFAULTS.scenario);
  const [temperature, setTemperature] = useState(DEFAULTS.temperature);
  const [topK, setTopK] = useState(DEFAULTS.topK);
  const [topP, setTopP] = useState(DEFAULTS.topP);
  const [draws, setDraws] = useState<{ seed: number; n: number } | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const result = useMemo(() => applySampling([...scenario.logits], { temperature, topK, topP }), [scenario, temperature, topK, topP]);
  const counts = useMemo(() => (draws ? sampleCounts(result.final, draws.n, mulberry32(draws.seed)) : null), [draws, result.final]);

  const keptCount = result.kept.filter(Boolean).length;
  const top = Math.max(...result.final);
  const topToken = scenario.tokens[result.final.indexOf(top)];
  const scale = Math.max(...result.base, top);
  const lastDraw = draws && counts ? scenario.tokens[counts.indexOf(Math.max(...counts))] : null;

  // Mudar qualquer parâmetro invalida os sorteios anteriores: eles eram de outra distribuição.
  const change = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setDraws(null);
  };
  const reset = () => {
    setScenarioId(DEFAULTS.scenario);
    setTemperature(DEFAULTS.temperature);
    setTopK(DEFAULTS.topK);
    setTopP(DEFAULTS.topP);
    setDraws(null);
  };
  const draw = (n: number) => setDraws((d) => ({ seed: (d?.seed ?? 0) + 1, n }));

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="rounded-[12px] border border-border bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-xl font-medium text-foreground sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                {scenario.prompt} <span className="rounded bg-primary/10 px-2 text-primary">{draws?.n === 1 && lastDraw ? lastDraw : "___"}</span>
              </p>
              <SimBadge>Pontuações inventadas</SimBadge>
            </div>

            <table className="mt-6 w-full border-collapse text-[13px]">
              <caption className="sr-only">Probabilidade de cada palavra candidata com os parâmetros atuais</caption>
              <thead>
                <tr className="mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
                  <th scope="col" className="w-[92px] pb-2 text-left font-medium sm:w-[110px]">Palavra</th>
                  <th scope="col" className="pb-2 text-left font-medium">Probabilidade</th>
                  <th scope="col" className="w-[56px] pb-2 text-right font-medium">Final</th>
                  {counts && <th scope="col" className="w-[64px] pb-2 text-right font-medium">Sorteios</th>}
                </tr>
              </thead>
              <tbody>
                {scenario.tokens.map((t, i) => {
                  const kept = result.kept[i];
                  return (
                    <tr key={t} className="border-t border-border/70">
                      <th scope="row" className={`py-2 pr-2 text-left font-medium ${kept ? "text-foreground" : "text-muted-foreground line-through decoration-1"}`}>
                        {t}
                      </th>
                      <td className="py-2">
                        <div className="relative h-5" aria-hidden>
                          {/* Fantasma: só a temperatura, antes dos cortes. */}
                          <span className="absolute inset-y-1 left-0 rounded-sm bg-slate-200" style={{ width: `${(result.base[i] / scale) * 100}%` }} />
                          <span
                            className="absolute inset-y-0 left-0 rounded-sm bg-primary transition-[width] duration-200 motion-reduce:transition-none"
                            style={{ width: `${(result.final[i] / scale) * 100}%` }}
                          />
                          {counts && draws && (
                            <span
                              className="absolute -inset-y-0.5 w-[2px] bg-[hsl(18,90%,45%)]"
                              style={{ left: `calc(${Math.min(100, (counts[i] / draws.n / scale) * 100)}% - 1px)` }}
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-2 text-right tabular-nums text-foreground">{kept ? pct(result.final[i], 1) : "cortada"}</td>
                      {counts && <td className="py-2 text-right tabular-nums text-muted-foreground">{counts[i]}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted-foreground">
              <li className="flex items-center gap-2"><span aria-hidden className="h-2.5 w-4 rounded-sm bg-primary" />distribuição final</li>
              <li className="flex items-center gap-2"><span aria-hidden className="h-1.5 w-4 rounded-sm bg-slate-200" />só temperatura, antes dos cortes</li>
              {counts && <li className="flex items-center gap-2"><span aria-hidden className="h-3 w-[2px] bg-[hsl(18,90%,45%)]" />frequência observada nos sorteios</li>}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button type="button" className={btnPrimary} onClick={() => draw(1)}>
                <Dices size={14} aria-hidden />
                Sortear 1 palavra
              </button>
              <button type="button" className={btn} onClick={() => draw(100)}>
                Sortear 100
              </button>
              <button type="button" className={btn} onClick={() => draw(5000)}>
                Sortear 5.000
              </button>
              {draws && (
                <p role="status" className="text-[12.5px] text-muted-foreground">
                  {draws.n === 1 ? `Saiu «${lastDraw}».` : `${draws.n.toLocaleString("pt-BR")} sorteios, semente ${draws.seed}.`}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-4">
          <Panel title="Controles" id="ts-ctl">
            <Segmented label="Situação" columns={1} options={SCENARIOS.map((s) => ({ id: s.id, label: s.label }))} value={scenarioId} onChange={(v) => { setScenarioId(v); setDraws(null); }} />
            <Range label="Temperatura" display={num(temperature)} min={0.1} max={2} step={0.05} value={temperature} onChange={change(setTemperature)} hint="Abaixo de 1 concentra na palavra mais provável; acima de 1 espalha." />
            <Range label="Top-k" display={String(topK)} min={1} max={scenario.tokens.length} step={1} value={topK} onChange={change(setTopK)} hint="Mantém só as k palavras mais prováveis." />
            <Range label="Top-p" display={num(topP)} min={0.1} max={1} step={0.05} value={topP} onChange={change(setTopP)} hint="Mantém as mais prováveis até a soma chegar a p." />
            <button type="button" className={btn} onClick={reset}>
              <RotateCcw size={14} aria-hidden />
              Restaurar
            </button>
          </Panel>

          <Panel title="Leitura" id="ts-read" live>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <Stat label="Mais provável" value={pct(top, 1)} hint={`«${topToken}»`} />
              <Stat label="Palavras no sorteio" value={`${keptCount} de ${scenario.tokens.length}`} />
              <Stat label="Entropia" value={`${num(entropyBits(result.final))} bits`} />
              <Stat label="Opções efetivas" value={num(effectiveChoices(result.final), 1)} hint="2 elevado à entropia" />
            </dl>
          </Panel>
        </div>
      </div>

      <section aria-label="O que observar">
        <h2 className={eyebrow}>O que observar</h2>
        <ol className="mt-4 grid gap-x-6 gap-y-6 sm:grid-cols-3">
          {[
            { t: "Leve a temperatura a 0,10", d: "A palavra mais provável fica com mais de 99% da chance. O texto fica repetível — e repetitivo." },
            { t: "Suba para 2,00 em «Resposta única»", d: "Palavras erradas ganham chance real. Mais variedade também é mais risco de erro." },
            { t: "Baixe o top-p para 0,80", d: "A cauda de palavras improváveis é cortada sem achatar as que ficaram." },
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
            t: "De pontuação a probabilidade",
            body: (
              <>
                <p>Para cada palavra candidata o modelo calcula uma pontuação (logit). A função softmax transforma as pontuações em probabilidades que somam 1.</p>
                <Formula label="p índice i é igual a exponencial de z índice i dividido por T, sobre a soma das exponenciais de z índice j dividido por T">pᵢ = exp(zᵢ / T) / Σⱼ exp(zⱼ / T)</Formula>
              </>
            ),
          },
          {
            t: "Temperatura, top-k e top-p",
            body: (
              <p>
                A temperatura T divide as pontuações antes da softmax: T pequeno exagera as diferenças, T grande as apaga. Top-k e top-p não mudam a forma da distribuição; cortam a cauda e
                redistribuem a probabilidade entre as palavras que ficaram.
              </p>
            ),
          },
          {
            t: "Por que a IA erra com convicção",
            body: (
              <p>
                O sorteio escolhe a palavra <em>provável</em>, não a verdadeira. Se a pontuação de uma resposta errada for alta, ela será sorteada com frequência — e o texto sai com a mesma
                fluência de uma resposta certa. Por isso a conferência precisa acontecer fora do modelo.
              </p>
            ),
          },
        ]}
        limits={[
          <>
            <B>As pontuações foram escolhidas à mão.</B> Não saíram de nenhum modelo de linguagem; servem só para mostrar o efeito dos parâmetros.
          </>,
          <>
            <B>Um modelo real escolhe entre dezenas de milhares de tokens,</B> e um token nem sempre é uma palavra inteira. Aqui há dez palavras por situação.
          </>,
          <>
            <B>Cada provedor aplica os filtros de um jeito.</B> A ordem (top-k antes de top-p, como aqui) e os limites aceitos variam; alguns modelos nem expõem todos os parâmetros.
          </>,
          <>
            <B>Este experimento mostra um passo.</B> Um texto é uma sequência de sorteios, e cada palavra sorteada muda as pontuações do passo seguinte.
          </>,
        ]}
        refs={REFS}
      />
    </div>
  );
}
