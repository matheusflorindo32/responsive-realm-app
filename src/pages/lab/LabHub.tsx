import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LAB_AREAS, LAB_EXPERIMENTS, areasWithoutExperiments } from "@/data/lab-experiments";

const PRINCIPLES = [
  { t: "Dados simulados, identificados", d: "Nada aqui é resultado de pesquisa. Cada experimento diz como seus dados foram gerados." },
  { t: "Matemática verificável", d: "As contas ficam em funções isoladas, com testes automatizados e fórmulas à vista." },
  { t: "Roda no seu navegador", d: "Sem cadastro e sem envio de dados: nenhum experimento chama servidor ou modelo." },
] as const;

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-[8px]";

export default function LabHub() {
  const pending = areasWithoutExperiments();
  return (
    <>
      <Helmet>
        <title>Interactive Science Lab — Tropa Científica</title>
        <meta name="description" content="Laboratório científico interativo da Tropa Científica: experimentos didáticos de inteligência artificial, estatística e dados que rodam no navegador." />
        <link rel="canonical" href="/laboratorio" />
      </Helmet>

      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 t-grid-bg pointer-events-none" />
        <div className="container-wide relative pt-14 pb-12 sm:pt-20 lg:pt-24 lg:pb-16">
          <p className="mono text-[11px] uppercase tracking-[0.3em] text-primary flex items-center gap-3">
            <span aria-hidden className="inline-block w-8 h-px bg-primary/60" />
            Tropa Científica
          </p>
          <h1 className="mt-6 font-semibold text-foreground leading-[0.98] tracking-[-0.03em] text-[clamp(2.5rem,7vw,5rem)]">
            Interactive
            <br />
            Science Lab
          </h1>
          <p className="mt-6 max-w-2xl text-lg lg:text-xl leading-relaxed text-foreground/80">
            Experimentos para entender, mexendo, os conceitos que aparecem nas aulas e nos conteúdos da Tropa. Cada um mostra a conta, os limites e as fontes.
          </p>
          <dl className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.t} className="border-t border-border pt-4">
                <dt className="font-semibold text-foreground">{p.t}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="exp-title" className="border-t border-border/70 py-16 lg:py-24">
        <div className="container-wide">
          <h2 id="exp-title" className="mono text-[11px] font-medium uppercase tracking-[0.26em] text-primary">
            Experimentos
          </h2>
          <ul className="mt-6">
            {LAB_EXPERIMENTS.map((e, i) => {
              const open = e.status === "disponivel";
              const body = (
                <div className="grid gap-x-8 gap-y-2 py-7 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-baseline">
                  <span className="mono text-[11px] tabular-nums tracking-[0.2em] text-[hsl(38,60%,38%)]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className={`text-xl lg:text-2xl font-semibold leading-tight ${open ? "text-foreground group-hover:text-primary transition-colors" : "text-foreground/60"}`}>{e.title}</h3>
                    <p className="mt-1.5 mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                      {LAB_AREAS[e.area]}
                      {e.uses3d ? " · 3D" : ""}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm leading-relaxed ${open ? "text-muted-foreground" : "text-muted-foreground/80"}`}>{e.summary}</p>
                    {e.lesson && <p className="mt-1.5 text-[12.5px] text-muted-foreground/90">Relacionado a: {e.lesson}</p>}
                  </div>
                  {open ? (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Abrir
                      <ArrowRight size={15} aria-hidden />
                    </span>
                  ) : (
                    <span className="mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">Em preparação</span>
                  )}
                </div>
              );
              return (
                <li key={e.slug} className="border-t border-border last:border-b">
                  {open ? (
                    <Link to={`/laboratorio/${e.slug}`} className={`group block ${focus}`}>
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>

          {pending.length > 0 && (
            <div className="mt-14 grid gap-6 lg:grid-cols-12">
              <h2 className="lg:col-span-4 text-2xl font-semibold leading-tight text-foreground">Áreas previstas</h2>
              <div className="lg:col-span-8">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A estrutura do laboratório já aceita experimentos destas áreas. Ainda não há nenhum publicado nelas.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {pending.map((a) => (
                    <li key={a} className="mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground border border-border rounded-[6px] px-3 py-1.5 bg-white">
                      {LAB_AREAS[a]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
