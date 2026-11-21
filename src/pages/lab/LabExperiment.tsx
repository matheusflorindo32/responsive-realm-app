import { Suspense, lazy, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LAB_AREAS, findExperiment } from "@/data/lab-experiments";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-[6px]";

function BackLink() {
  return (
    <Link to="/laboratorio" className={`inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors ${focus}`}>
      <ArrowLeft size={15} aria-hidden />
      Interactive Science Lab
    </Link>
  );
}

export default function LabExperiment() {
  const { slug } = useParams<{ slug: string }>();
  const experiment = findExperiment(slug);
  const Body = useMemo(() => (experiment?.load ? lazy(experiment.load) : null), [experiment]);

  if (!experiment || !Body) {
    return (
      <section className="container-wide py-24">
        <BackLink />
        <h1 className="mt-8 text-3xl lg:text-4xl font-semibold text-foreground">
          {experiment ? `${experiment.title} ainda está em preparação.` : "Experimento não encontrado."}
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
          {experiment ? experiment.summary : "O endereço não corresponde a nenhum experimento do laboratório."}
        </p>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{experiment.title} — Interactive Science Lab · Tropa Científica</title>
        <meta name="description" content={experiment.summary} />
        <link rel="canonical" href={`/laboratorio/${experiment.slug}`} />
      </Helmet>
      <div className="container-wide pt-10 pb-8 lg:pt-14">
        <BackLink />
        <header className="mt-8 max-w-3xl">
          <p className="mono text-[11px] uppercase tracking-[0.26em] text-primary">{LAB_AREAS[experiment.area]}</p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground">{experiment.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-foreground/80">{experiment.summary}</p>
          {experiment.lesson && <p className="mt-3 text-sm text-muted-foreground">Relacionado a: {experiment.lesson}</p>}
        </header>
        <div className="mt-10">
          <Suspense
            fallback={
              <p role="status" className="py-24 text-center text-sm text-muted-foreground">
                Carregando experimento…
              </p>
            }
          >
            <Body />
          </Suspense>
        </div>
      </div>
    </>
  );
}
