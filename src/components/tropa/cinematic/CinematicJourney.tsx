import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";
import { HeroVisual } from "./HeroVisual";
import {
  CHAPTERS,
  Chapter,
  ChapterMark,
  Ghost,
  focusRing,
  scrollToChapter,
  useReveal,
  type ChapterId,
} from "./narrative";

const PRINCIPLES = [
  { t: "Método antes de hype", d: "IA e tecnologia entram quando resolvem problemas reais, com contexto e limites claros." },
  { t: "Linguagem de ponte", d: "Texto acessível para quem está chegando, sem diluir a profundidade técnica." },
  { t: "Aplicação verificável", d: "Projetos, estudos e materiais precisam apontar para uso, evidência ou aprendizagem concreta." },
] as const;

const STATEMENT = ["Do laboratório ao campo.", "Do dado à decisão.", "Da pesquisa à prática."] as const;

const METHOD = [
  { t: "Investigar", d: "Entender o problema, o público e a evidência disponível." },
  { t: "Traduzir", d: "Transformar conceito técnico em narrativa clara e visual." },
  { t: "Aplicar", d: "Conectar teoria a ferramenta, decisão, aula, projeto ou caso real." },
  { t: "Revisar", d: "Apontar limites, riscos, fontes e próximos passos." },
] as const;

const FRONTS = [
  { n: "01", t: "Ciência aplicada", d: "Método e evidência orientando problemas concretos." },
  { n: "02", t: "Inteligência artificial", d: "Modelos e LLMs com contexto, limites e critério." },
  { n: "03", t: "Dados e automação", d: "Pipelines, indicadores e decisões acionáveis." },
  { n: "04", t: "Segurança pública", d: "Tecnologia com responsabilidade no território." },
  { n: "05", t: "Drones e tecnologia operacional", d: "Sensoriamento, mapeamento e operação real." },
  { n: "06", t: "Educação e treinamento", d: "Formação técnica que respeita a inteligência." },
  { n: "07", t: "Desenvolvimento de sistemas", d: "Aplicações, dashboards e produtos digitais." },
] as const;

const CHIPS = ["IA generativa", "Ciência de dados", "Drones & sensores", "Automação", "Pesquisa aplicada", "Sistemas & web"] as const;

const CY = "text-[hsl(199,89%,62%)]";

/**
 * Abertura da home: hero + capítulos 01–03 (Ciência → Pesquisa → Tecnologia).
 * Tudo em fluxo vertical normal (ver AGENTS.md): nenhuma cena é fixada na tela.
 */
export function CinematicJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ChapterId | null>(null);
  useReveal(rootRef);

  return (
    <div ref={rootRef} className="relative overflow-x-clip">
      {/* ================= HERO ================= */}
      <section data-chapter aria-labelledby="hero-title" className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 t-grid-bg pointer-events-none" />
        <div className="container-wide relative pt-14 sm:pt-20 lg:pt-24 pb-10 lg:pb-14">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            <div className="lg:col-span-7">
              <p className="rv mono text-[11px] uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                <span aria-hidden className="inline-block w-8 h-px bg-primary/60" />
                Divulgação científica aplicada
              </p>
              <h1
                id="hero-title"
                className="rv mt-6 font-semibold text-foreground leading-[0.94] tracking-[-0.035em] text-[clamp(3.1rem,9.2vw,6.75rem)]"
              >
                Tropa
                <br />
                Científica
              </h1>
              <p className="rv mt-7 text-xl lg:text-[1.65rem] lg:leading-snug text-foreground/85 font-medium max-w-xl">
                Ciência, tecnologia e inteligência para decisões do mundo real.
              </p>
              <p className="rv mt-4 text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Pesquisa, IA, dados, drones e tecnologia operacional traduzidos em conhecimento aplicável — do laboratório ao campo.
              </p>
              <div className="rv mt-9 flex flex-wrap items-center gap-3">
                <Link to="/conteudos" className={`t-btn-hero inline-flex items-center gap-2 px-6 py-3.5 rounded-[8px] font-semibold text-sm ${focusRing}`}>
                  Acompanhar conteúdos
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <a
                  href="#ciencia"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToChapter("ciencia");
                  }}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-[8px] font-semibold text-sm border border-border bg-white/80 text-foreground hover:border-primary/40 hover:text-primary transition-colors ${focusRing}`}
                >
                  Percorrer a narrativa
                  <ArrowDown size={16} aria-hidden />
                </a>
              </div>
            </div>

            <div className="rv lg:col-span-5">
              <div className="rv-depart will-change-transform">
                <HeroVisual active={active} onHover={setActive} onSelect={scrollToChapter} />
              </div>
            </div>
          </div>

          {/* Índice de capítulos: âncoras reais, funcionam sem JavaScript. */}
          <nav aria-label="Capítulos desta página" className="rv mt-14 lg:mt-20">
            <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-1">
              {CHAPTERS.map((c) => {
                const on = active === c.id;
                return (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToChapter(c.id);
                      }}
                      onMouseEnter={() => setActive(c.id)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(c.id)}
                      onBlur={() => setActive(null)}
                      className={`group block border-t pt-3 pb-4 transition-colors ${on ? "border-primary" : "border-border hover:border-primary/60"} ${focusRing}`}
                    >
                      <span className={`mono text-[10.5px] tracking-[0.22em] tabular-nums transition-colors ${on ? "text-primary" : "text-muted-foreground"}`}>
                        {c.n}
                      </span>
                      <span className={`mt-1 block text-[15px] font-semibold transition-colors ${on ? "text-primary" : "text-foreground"}`}>{c.label}</span>
                      <span className="mt-0.5 block text-[12.5px] text-muted-foreground leading-snug">{c.hint}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </section>

      {/* ================= 01 · CIÊNCIA ================= */}
      <Chapter id="ciencia">
        <Ghost n="01" />
        <div className="container-wide relative grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <ChapterMark n="01" label="Ciência" />
            <h2 className="rv mt-5 text-3xl lg:text-[2.5rem] lg:leading-[1.08] font-semibold text-foreground">Um hub editorial de ciência aplicada.</h2>
            <p className="rv mt-5 text-muted-foreground leading-relaxed">
              Não uma vitrine genérica de tecnologia: um projeto que explica como pensa, produz e transforma conhecimento técnico em material útil.
            </p>
          </div>
          <div className="lg:col-span-8">
            <p className="rv text-xl lg:text-2xl leading-relaxed text-foreground/85 font-medium">
              A Tropa Científica aproxima laboratório, código, campo operacional e educação —{" "}
              <span className="text-primary">traduzindo pesquisa, IA, dados e tecnologia operacional em conhecimento aplicável.</span>
            </p>
            <div className="mt-10">
              <span aria-hidden className="rv-rule block h-px bg-border" />
              {PRINCIPLES.map((p, i) => (
                <div key={p.t} className="rv grid sm:grid-cols-[56px_220px_1fr] gap-2 sm:gap-6 py-6 border-b border-border items-baseline">
                  <span className="mono text-[11px] tracking-[0.2em] text-[hsl(38,60%,38%)] tabular-nums">0{i + 1}</span>
                  <h3 className="font-semibold text-foreground">{p.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Chapter>

      {/* ================= 02 · PESQUISA ================= */}
      <Chapter id="pesquisa" tone="dark" className="overflow-hidden">
        <div
          aria-hidden
          className="rv-drift absolute -top-40 right-[-10%] w-[60vw] max-w-[820px] aspect-square rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(221 83% 53% / 0.16), transparent 62%)" }}
        />
        <div className="container-wide relative">
          <ChapterMark n="02" label="Pesquisa" tone="dark" />
          <div className="mt-10 lg:mt-14 space-y-3 lg:space-y-6">
            {STATEMENT.map((l, i) => (
              <p
                key={l}
                className={`rv-scrub text-[2rem] leading-[1.08] sm:text-5xl lg:text-[4.25rem] font-semibold tracking-[-0.03em] ${i === 1 ? CY : "text-slate-100"}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {l}
              </p>
            ))}
          </div>
          <p className="rv mt-10 lg:mt-14 max-w-2xl text-slate-400 text-base lg:text-lg leading-relaxed">
            A prática operacional evolui rápido. A produção científica também. O desafio — e o trabalho da Tropa — é conectar esses dois mundos
            com clareza, método e aplicação real.
          </p>

          <div className="mt-20 lg:mt-36 grid lg:grid-cols-12 gap-8 lg:gap-10">
            <h2 className="rv lg:col-span-4 text-2xl lg:text-3xl font-semibold leading-tight text-slate-100">
              Como um tema vira conteúdo confiável.
            </h2>
            <ol className="lg:col-span-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {METHOD.map((m, i) => (
                <li key={m.t} className="rv relative pt-5">
                  <span aria-hidden className="rv-rule absolute inset-x-0 top-0 h-px bg-white/20" />
                  <span aria-hidden className="absolute left-0 -top-[3px] w-[7px] h-[7px] rounded-full bg-[hsl(199,89%,60%)]" />
                  <span className={`mono text-[11px] tracking-[0.2em] tabular-nums ${CY}`}>0{i + 1}</span>
                  <h3 className="mt-2 font-semibold text-slate-100">{m.t}</h3>
                  <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{m.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Chapter>

      {/* ================= 03 · TECNOLOGIA ================= */}
      <Chapter id="tecnologia" tone="dark" className="!pt-0 overflow-hidden">
        <div className="container-wide relative">
          <span aria-hidden className="rv-rule block h-px bg-white/10 mb-20 lg:mb-28" />
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <ChapterMark n="03" label="Tecnologia" tone="dark" />
              <h2 className="rv mt-5 text-3xl lg:text-[2.5rem] lg:leading-[1.08] font-semibold text-slate-100">
                Menos hype. Mais método, evidência e aplicação.
              </h2>
              <p className="rv mt-5 text-slate-400 leading-relaxed">
                IA, dados, drones, automação e pesquisa aplicada operando juntos. Novas formas de aprender, decidir e agir nascem quando método e
                tecnologia se encontram.
              </p>
              <ul className="rv mt-7 flex flex-wrap gap-2" aria-label="Temas técnicos">
                {CHIPS.map((c) => (
                  <li key={c} className="mono text-[10.5px] uppercase tracking-[0.14em] text-slate-300 border border-white/12 rounded-[6px] px-3 py-1.5 bg-white/[0.03]">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <h3 className={`rv mono text-[11px] uppercase tracking-[0.24em] font-medium ${CY}`}>Sete frentes. Uma missão.</h3>
              <p className="rv mt-3 text-sm text-slate-400 leading-relaxed max-w-lg">
                A Tropa traduz pesquisa, IA, dados e tecnologia operacional em conteúdo, sistemas e treinamento aplicados.
              </p>
              <ol className="mt-7">
                {FRONTS.map((f) => (
                  <li key={f.n} className="rv group grid grid-cols-[44px_1fr] sm:grid-cols-[52px_minmax(0,230px)_1fr] gap-x-4 gap-y-1 items-baseline py-4 border-t border-white/10 last:border-b">
                    <span className={`mono text-[11px] tracking-[0.2em] tabular-nums ${CY}`}>{f.n}</span>
                    <span className="font-semibold text-slate-100 text-[15px] lg:text-base transition-colors group-hover:text-white">{f.t}</span>
                    <span className="col-start-2 sm:col-start-3 text-[13.5px] leading-relaxed text-slate-400">{f.d}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Chapter>
    </div>
  );
}
