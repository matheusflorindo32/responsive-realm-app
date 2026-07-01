import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-[8px]";

const PRINCIPLES = [
  { t: "Método antes de hype", d: "IA e tecnologia entram quando resolvem problemas reais, com contexto e limites claros." },
  { t: "Linguagem de ponte", d: "Texto acessível para quem está chegando, sem diluir a profundidade técnica." },
  { t: "Aplicação verificável", d: "Projetos, estudos e materiais precisam apontar para uso, evidência ou aprendizagem concreta." },
] as const;

const FORMATS = [
  { n: "01", t: "Vídeos educativos", d: "Explicações visuais para conceitos técnicos e temas em alta." },
  { n: "02", t: "Infográficos", d: "Sínteses visuais para aprender rápido e revisar depois." },
  { n: "03", t: "Estudos aplicados", d: "Casos com dados, método, resultado e limites." },
  { n: "04", t: "Projetos digitais", d: "Experimentos, protótipos e ferramentas com utilidade real." },
] as const;

const PROJECTS = [
  { n: "01", t: "Dashboards e análise de dados", d: "Interfaces para transformar bases e indicadores em leitura acionável." },
  { n: "02", t: "Automações com IA", d: "Fluxos assistidos por modelos para reduzir trabalho repetitivo e melhorar decisão." },
  { n: "03", t: "Educação e simuladores", d: "Experiências didáticas para treinamento, revisão e divulgação científica." },
] as const;

const METHOD = [
  { t: "Investigar", d: "Entender o problema, o público e a evidência disponível." },
  { t: "Traduzir", d: "Transformar conceito técnico em narrativa clara e visual." },
  { t: "Aplicar", d: "Conectar teoria a ferramenta, decisão, aula, projeto ou caso real." },
  { t: "Revisar", d: "Apontar limites, riscos, fontes e próximos passos." },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="ed-rev mono text-[11px] uppercase tracking-[0.26em] text-primary flex items-center gap-3">
      <span aria-hidden className="inline-block w-8 h-px bg-primary/50" />
      {children}
    </p>
  );
}

function Ghost({ n }: { n: string }) {
  return (
    <span aria-hidden className="ed-ghost absolute -top-4 right-2 lg:right-8 mono text-[110px] lg:text-[190px] font-medium leading-none text-foreground/[0.045] select-none pointer-events-none">
      {n}
    </span>
  );
}

export function EditorialHome() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-ed]").forEach((sec) => {
        const els = sec.querySelectorAll(".ed-rev");
        if (els.length)
          gsap.from(els, {
            y: 26,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power2.out",
            scrollTrigger: { trigger: sec, start: "top 80%", once: true },
          });
      });
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>(".ed-ghost").forEach((g) => {
          gsap.fromTo(
            g,
            { yPercent: 24 },
            { yPercent: -24, ease: "none", scrollTrigger: { trigger: g.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-x-clip">
      {/* ============ O QUE É ============ */}
      <section data-ed className="relative py-24 lg:py-32 border-t border-border/70">
        <Ghost n="01" />
        <div className="container-wide relative grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>O que é</Eyebrow>
            <h2 className="ed-rev mt-5 text-3xl lg:text-4xl font-semibold leading-tight text-foreground">Um hub editorial de ciência aplicada.</h2>
            <p className="ed-rev mt-5 text-muted-foreground leading-relaxed">
              Não uma vitrine genérica de tecnologia: um projeto que explica como pensa, produz e transforma conhecimento técnico em material útil.
            </p>
          </div>
          <div className="lg:col-span-8">
            <p className="ed-rev text-xl lg:text-2xl leading-relaxed text-foreground/85 font-medium">
              A Tropa Científica aproxima laboratório, código, campo operacional e educação —{" "}
              <span className="text-primary">traduzindo pesquisa, IA, dados e tecnologia operacional em conhecimento aplicável.</span>
            </p>
            <div className="mt-10 border-t border-border">
              {PRINCIPLES.map((p, i) => (
                <div key={p.t} className="ed-rev grid sm:grid-cols-[56px_220px_1fr] gap-2 sm:gap-6 py-6 border-b border-border items-baseline">
                  <span className="mono text-[11px] tracking-[0.2em] text-[hsl(38,60%,42%)]">0{i + 1}</span>
                  <h3 className="font-semibold text-foreground">{p.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FRENTES EDITORIAIS ============ */}
      <section data-ed className="relative py-24 lg:py-32 border-t border-border/70 bg-white/50">
        <Ghost n="02" />
        <div className="container-wide relative">
          <div className="grid lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Frentes editoriais</Eyebrow>
              <h2 className="ed-rev mt-5 text-3xl lg:text-4xl font-semibold leading-tight text-foreground">Onde a Tropa atua.</h2>
            </div>
            <p className="ed-rev lg:col-span-5 text-sm text-muted-foreground leading-relaxed lg:text-right">
              Áreas separadas por papel editorial — não uma lista de cards iguais.
            </p>
          </div>
          <div className="mt-12 grid lg:grid-cols-12 gap-5">
            <article className="ed-rev lg:col-span-6 relative rounded-[8px] border border-border bg-white p-7 lg:p-9 overflow-hidden">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary via-accent to-transparent" />
              <span className="mono text-[10.5px] uppercase tracking-[0.22em] text-primary">Inteligência aplicada</span>
              <h3 className="mt-4 text-2xl lg:text-3xl font-semibold text-foreground leading-tight">IA, automação e dados para problemas reais.</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Modelos, LLMs, dashboards, automações e análises explicados com casos, limites e critério.
              </p>
              <ul className="mt-6 space-y-2.5">
                {["IA generativa e produtividade", "Ciência e engenharia de dados", "Ferramentas digitais e web"].map((i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                    <span aria-hidden className="w-4 h-px bg-primary/60" />
                    {i}
                  </li>
                ))}
              </ul>
            </article>
            <article className="ed-rev lg:col-span-3 relative rounded-[8px] p-7 overflow-hidden text-slate-100" style={{ background: "linear-gradient(170deg, hsl(222 47% 9%), hsl(221 55% 13%))" }}>
              <span className="mono text-[10.5px] uppercase tracking-[0.22em] text-[hsl(199,89%,60%)]">Campo e sociedade</span>
              <h3 className="mt-4 text-xl font-semibold leading-tight">Segurança pública, drones e tecnologia operacional.</h3>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                Discussão técnica com responsabilidade pública, foco em decisão e aplicação no território.
              </p>
            </article>
            <article className="ed-rev lg:col-span-3 relative rounded-[8px] border border-border bg-white p-7 overflow-hidden">
              <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-[hsl(38,65%,48%)]" />
              <span className="mono text-[10.5px] uppercase tracking-[0.22em] text-[hsl(38,60%,42%)]">Educação científica</span>
              <h3 className="mt-4 text-xl font-semibold text-foreground leading-tight">Conteúdo para formar repertório.</h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Guias, aulas, estudos aplicados e infográficos para acelerar entendimento sem simplismo.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ CONTEÚDOS E FORMATOS ============ */}
      <section data-ed className="relative py-24 lg:py-32 border-t border-border/70">
        <Ghost n="03" />
        <div className="container-wide relative">
          <div className="grid lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Conteúdos</Eyebrow>
              <h2 className="ed-rev mt-5 text-3xl lg:text-4xl font-semibold leading-tight text-foreground">
                Formatos que ajudam a pensar, comparar e aplicar.
              </h2>
            </div>
            <p className="ed-rev lg:col-span-5 text-sm text-muted-foreground leading-relaxed lg:text-right">
              Uma revista técnica: leitura, curadoria e caminhos claros.
            </p>
          </div>
          <div className="mt-12 grid lg:grid-cols-12 gap-5 items-start">
            <article className="ed-rev lg:col-span-5 relative rounded-[8px] p-7 lg:p-9 overflow-hidden text-slate-100" style={{ background: "linear-gradient(165deg, hsl(222 47% 9%), hsl(221 60% 14%))" }}>
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(199,89%,55%)]/70 to-transparent" />
              <span className="mono text-[10.5px] uppercase tracking-[0.22em] text-[hsl(199,89%,60%)]">Publicação principal</span>
              <h3 className="mt-4 text-2xl font-semibold leading-tight">Análises técnicas e guias aprofundados.</h3>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                Materiais de referência para explicar ferramentas, papers, tendências e aplicações com olhar crítico.
              </p>
              <Link to="/conteudos" className={`mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(199,89%,60%)] hover:text-white transition-colors ${focusRing}`}>
                Explorar conteúdos
                <ArrowRight size={15} />
              </Link>
            </article>
            <div className="lg:col-span-7 border-t border-border">
              {FORMATS.map((f) => (
                <div key={f.n} className="ed-rev group grid sm:grid-cols-[56px_1fr_auto] gap-2 sm:gap-6 items-baseline py-6 border-b border-border">
                  <span className="mono text-[11px] tracking-[0.2em] text-muted-foreground">{f.n}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{f.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                  </div>
                  <ArrowUpRight size={16} className="hidden sm:block text-border group-hover:text-primary transition-colors" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROJETOS APLICADOS ============ */}
      <section data-ed className="relative py-24 lg:py-32 border-t border-border/70 bg-white/50">
        <Ghost n="04" />
        <div className="container-wide relative">
          <Eyebrow>Projetos aplicados</Eyebrow>
          <h2 className="ed-rev mt-5 text-3xl lg:text-4xl font-semibold leading-tight text-foreground max-w-2xl">
            Da ideia ao protótipo, do protótipo ao aprendizado público.
          </h2>
          <div className="mt-12 border-t border-border">
            {PROJECTS.map((p) => (
              <div key={p.n} className="ed-rev group grid md:grid-cols-[72px_minmax(0,340px)_1fr_auto] gap-2 md:gap-8 items-baseline py-7 border-b border-border">
                <span className="mono text-[11px] tracking-[0.2em] text-[hsl(38,60%,42%)]">{p.n}</span>
                <h3 className="text-lg font-semibold text-foreground">{p.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                <ArrowUpRight size={16} className="hidden md:block text-border group-hover:text-primary transition-colors" aria-hidden />
              </div>
            ))}
          </div>
          <Link to="/projetos-tropa" className={`ed-rev mt-9 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 ${focusRing}`}>
            Ver todos os projetos
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ============ MÉTODO EDITORIAL ============ */}
      <section data-ed className="relative py-24 lg:py-32 border-t border-border/70">
        <Ghost n="05" />
        <div className="container-wide relative">
          <div className="relative rounded-[8px] overflow-hidden p-8 lg:p-14 text-slate-100" style={{ background: "linear-gradient(165deg, hsl(222 47% 8%), hsl(221 55% 12%))" }}>
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(199,89%,55%)]/70 to-transparent" />
            <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                <p className="ed-rev mono text-[11px] uppercase tracking-[0.26em] text-[hsl(199,89%,60%)] flex items-center gap-3">
                  <span aria-hidden className="inline-block w-8 h-px bg-[hsl(199,89%,60%)]/60" />
                  Método editorial
                </p>
                <h2 className="ed-rev mt-5 text-2xl lg:text-3xl font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Como um tema vira conteúdo confiável.
                </h2>
              </div>
              <ol className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-8">
                {METHOD.map((m, i) => (
                  <li key={m.t} className="ed-rev relative pl-5 border-l border-white/15">
                    <span className="mono text-[11px] tracking-[0.2em] text-[hsl(199,89%,60%)]">0{i + 1}</span>
                    <h3 className="mt-2 font-semibold text-slate-100">{m.t}</h3>
                    <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{m.d}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AUTORIDADE ============ */}
      <section data-ed className="relative py-24 lg:py-32 border-t border-border/70">
        <Ghost n="06" />
        <div className="container-wide relative grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Eyebrow>Autoridade</Eyebrow>
            <h2 className="ed-rev mt-5 text-3xl lg:text-4xl font-semibold leading-tight text-foreground">
              Vivência, ciência, código e responsabilidade educativa.
            </h2>
            <p className="ed-rev mt-6 text-muted-foreground leading-relaxed max-w-xl">
              A Tropa Científica nasce da união entre experiência operacional, formação acadêmica, desenvolvimento tecnológico e compromisso
              com educação pública de qualidade.
            </p>
            <div className="ed-rev mt-7 flex flex-wrap gap-x-8 gap-y-2 mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Mestrado · Business Intelligence</span>
              <span>MBA · Inteligência Artificial</span>
              <span>ADS · IFES</span>
            </div>
            <div className="ed-rev mt-9 flex flex-wrap gap-3">
              <Link
                to="/matheus"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-[8px] font-semibold text-sm border border-border bg-white hover:border-primary/40 hover:text-primary transition-colors ${focusRing}`}
              >
                Conhecer o fundador
                <ArrowUpRight size={15} />
              </Link>
              <Link
                to="/matheus/publicacoes"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-[8px] font-semibold text-sm text-muted-foreground hover:text-primary transition-colors ${focusRing}`}
              >
                Publicações acadêmicas
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
          <aside aria-label="Posicionamento" className="ed-rev lg:col-span-5 relative rounded-[8px] border border-border bg-white p-7 lg:p-8">
            <span aria-hidden className="absolute left-0 top-7 bottom-7 w-[2px] bg-[hsl(38,65%,48%)]" />
            <strong className="mono text-[10.5px] uppercase tracking-[0.22em] text-[hsl(38,60%,42%)] font-medium">Posicionamento</strong>
            <p className="mt-4 text-foreground/85 leading-relaxed">
              Ciência aplicada deve ser compreensível, verificável e útil. A estética precisa passar essa mesma mensagem: sóbria, precisa e
              memorável.
            </p>
          </aside>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section data-ed className="relative py-24 lg:py-36 border-t border-border/70">
        <div className="container-wide relative">
          <div className="relative rounded-[8px] border border-border bg-white overflow-hidden px-6 py-16 lg:py-24 text-center">
            <div aria-hidden className="absolute inset-0 t-grid-bg pointer-events-none" />
            <div className="relative">
              <p className="ed-rev mono text-[11px] uppercase tracking-[0.3em] text-primary">Junte-se à Tropa</p>
              <h2 className="ed-rev mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight max-w-2xl mx-auto">
                Ciência, tecnologia e inteligência para decisões do mundo real.
              </h2>
              <p className="ed-rev mt-6 text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Acompanhe conteúdos, projetos e estudos que conectam IA, dados, segurança pública, educação e inovação aplicada.
              </p>
              <div className="ed-rev mt-10 flex flex-wrap justify-center gap-3">
                <Link to="/conteudos" className={`t-btn-hero inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] font-semibold text-sm ${focusRing}`}>
                  Acompanhar conteúdos
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/projetos-tropa"
                  className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] font-semibold text-sm border border-border bg-white hover:border-primary/40 hover:text-primary transition-colors ${focusRing}`}
                >
                  Ver projetos
                </Link>
                <a
                  href="mailto:contato@tropacientifica.com"
                  className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] font-semibold text-sm text-muted-foreground hover:text-primary transition-colors ${focusRing}`}
                >
                  <Mail size={16} />
                  Falar com a Tropa
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
