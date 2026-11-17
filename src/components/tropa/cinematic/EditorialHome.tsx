import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { Chapter, ChapterMark, Ghost, focusRing, useReveal } from "./narrative";

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

const CREDENTIALS = [
  "Mestrado em Business Intelligence · Em andamento",
  "MBA em Inteligência Artificial · Em andamento",
  "ADS no IFES · Em andamento",
] as const;

const GOLD = "text-[hsl(38,60%,38%)]";

/**
 * Fechamento da home: capítulos 04–06 (Aplicação → Educação → Inovação) e chamada final.
 * Continua a numeração iniciada em CinematicJourney; fluxo vertical normal (AGENTS.md).
 */
export function EditorialHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div ref={rootRef} className="relative overflow-x-clip">
      {/* ================= 04 · APLICAÇÃO ================= */}
      <Chapter id="aplicacao" className="!border-t-0">
        <Ghost n="04" />
        <div className="container-wide relative">
          <div className="grid lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <ChapterMark n="04" label="Aplicação" />
              <h2 className="rv mt-5 text-3xl lg:text-[2.5rem] lg:leading-[1.08] font-semibold text-foreground">
                Da ideia ao protótipo, do protótipo ao aprendizado público.
              </h2>
            </div>
            <p className="rv lg:col-span-4 lg:col-start-9 text-sm text-muted-foreground leading-relaxed">
              Áreas separadas por papel editorial — não uma lista de cards iguais.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-12 gap-5">
            <article className="rv lg:col-span-6 relative rounded-[10px] border border-border bg-white p-7 lg:p-9 overflow-hidden">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary via-accent to-transparent" />
              <p className="mono text-[10.5px] uppercase tracking-[0.22em] text-primary">Inteligência aplicada</p>
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
            <article className="rv lg:col-span-3 relative rounded-[10px] p-7 overflow-hidden text-slate-100 bg-[hsl(222_47%_8%)]">
              <p className="mono text-[10.5px] uppercase tracking-[0.22em] text-[hsl(199,89%,62%)]">Campo e sociedade</p>
              <h3 className="mt-4 text-xl font-semibold leading-tight">Segurança pública, drones e tecnologia operacional.</h3>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                Discussão técnica com responsabilidade pública, foco em decisão e aplicação no território.
              </p>
            </article>
            <article className="rv lg:col-span-3 relative rounded-[10px] border border-border bg-white p-7 overflow-hidden">
              <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-[hsl(38,65%,48%)]" />
              <p className={`mono text-[10.5px] uppercase tracking-[0.22em] ${GOLD}`}>Educação científica</p>
              <h3 className="mt-4 text-xl font-semibold text-foreground leading-tight">Conteúdo para formar repertório.</h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Guias, aulas, estudos aplicados e infográficos para acelerar entendimento sem simplismo.
              </p>
            </article>
          </div>

          <div className="mt-14">
            <span aria-hidden className="rv-rule block h-px bg-border" />
            {PROJECTS.map((p) => (
              <div key={p.n} className="rv grid md:grid-cols-[72px_minmax(0,340px)_1fr] gap-2 md:gap-8 items-baseline py-7 border-b border-border">
                <span className={`mono text-[11px] tracking-[0.2em] tabular-nums ${GOLD}`}>{p.n}</span>
                <h3 className="text-lg font-semibold text-foreground">{p.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
          <Link to="/projetos-tropa" className={`rv mt-9 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 ${focusRing}`}>
            Ver todos os projetos
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </Chapter>

      {/* ================= 05 · EDUCAÇÃO ================= */}
      <Chapter id="educacao" className="bg-white/60">
        <Ghost n="05" />
        <div className="container-wide relative">
          <div className="grid lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <ChapterMark n="05" label="Educação" />
              <h2 className="rv mt-5 text-3xl lg:text-[2.5rem] lg:leading-[1.08] font-semibold text-foreground">
                Formatos que ajudam a pensar, comparar e aplicar.
              </h2>
            </div>
            <p className="rv lg:col-span-4 lg:col-start-9 text-sm text-muted-foreground leading-relaxed">
              Uma revista técnica: leitura, curadoria e caminhos claros.
            </p>
          </div>
          <div className="mt-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <article className="rv lg:col-span-5 relative rounded-[10px] p-7 lg:p-9 overflow-hidden text-slate-100 bg-[hsl(222_47%_8%)]">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(199,89%,55%)]/70 to-transparent" />
              <p className="mono text-[10.5px] uppercase tracking-[0.22em] text-[hsl(199,89%,62%)]">Publicação principal</p>
              <h3 className="mt-4 text-2xl font-semibold leading-tight">Análises técnicas e guias aprofundados.</h3>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                Materiais de referência para explicar ferramentas, papers, tendências e aplicações com olhar crítico.
              </p>
              <Link
                to="/conteudos"
                className={`mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(199,89%,62%)] hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(199,89%,62%)] rounded-[6px]`}
              >
                Explorar conteúdos
                <ArrowRight size={15} aria-hidden />
              </Link>
            </article>
            <div className="lg:col-span-7">
              <span aria-hidden className="rv-rule block h-px bg-border" />
              {FORMATS.map((f) => (
                <div key={f.n} className="rv grid grid-cols-[44px_1fr] sm:grid-cols-[56px_1fr] gap-x-4 items-baseline py-6 border-b border-border">
                  <span className="mono text-[11px] tracking-[0.2em] text-muted-foreground tabular-nums">{f.n}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{f.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Chapter>

      {/* ================= 06 · INOVAÇÃO ================= */}
      <Chapter id="inovacao">
        <Ghost n="06" />
        <div className="container-wide relative grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <ChapterMark n="06" label="Inovação" />
            <h2 className="rv mt-5 text-3xl lg:text-[2.5rem] lg:leading-[1.08] font-semibold text-foreground">
              Vivência, ciência, código e responsabilidade educativa.
            </h2>
            <p className="rv mt-6 text-muted-foreground leading-relaxed max-w-xl">
              A Tropa Científica nasce da união entre experiência operacional, formação acadêmica, desenvolvimento tecnológico e compromisso com
              educação pública de qualidade — pesquisa aplicada, publicações e sistemas em produção.
            </p>
            <ul className="rv mt-7 flex flex-wrap gap-x-8 gap-y-2 mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {CREDENTIALS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="rv mt-9 flex flex-wrap gap-3">
              <Link
                to="/matheus"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-[8px] font-semibold text-sm border border-border bg-white hover:border-primary/40 hover:text-primary transition-colors ${focusRing}`}
              >
                Conhecer o fundador
                <ArrowUpRight size={15} aria-hidden />
              </Link>
              <Link
                to="/matheus/publicacoes"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-[8px] font-semibold text-sm text-muted-foreground hover:text-primary transition-colors ${focusRing}`}
              >
                Publicações acadêmicas
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
          </div>
          <aside aria-label="Posicionamento" className="rv lg:col-span-5 relative pl-7 py-1">
            <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[2px] bg-[hsl(38,65%,48%)]" />
            <p className={`mono text-[10.5px] uppercase tracking-[0.22em] ${GOLD}`}>Posicionamento</p>
            <p className="mt-4 text-xl lg:text-2xl leading-snug text-foreground/85 font-medium" style={{ fontFamily: "var(--font-display)" }}>
              Ciência aplicada deve ser compreensível, verificável e útil. A estética precisa passar essa mesma mensagem: sóbria, precisa e
              memorável.
            </p>
          </aside>
        </div>
      </Chapter>

      {/* ================= CHAMADA FINAL ================= */}
      <section data-chapter className="relative py-20 lg:py-28 border-t border-border/70 overflow-hidden">
        <div aria-hidden className="absolute inset-0 t-grid-bg pointer-events-none" />
        <div className="container-wide relative text-center">
          <p className="rv mono text-[11px] uppercase tracking-[0.3em] text-primary">Junte-se à Tropa</p>
          <h2 className="rv mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.04] tracking-[-0.03em] max-w-3xl mx-auto">
            Ciência não precisa ficar distante da prática.
          </h2>
          <p className="rv mt-6 text-muted-foreground text-base lg:text-lg max-w-xl mx-auto leading-relaxed">
            Acompanhe conteúdos, projetos e estudos que conectam IA, dados, segurança pública, educação e inovação aplicada.
          </p>
          <div className="rv mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/conteudos" className={`t-btn-hero inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] font-semibold text-sm ${focusRing}`}>
              Acompanhar conteúdos
              <ArrowRight size={16} aria-hidden />
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
              <Mail size={16} aria-hidden />
              Falar com a Tropa
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
