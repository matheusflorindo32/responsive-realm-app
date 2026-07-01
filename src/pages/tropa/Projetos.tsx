import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowUpRight, FolderGit2 } from "lucide-react";

export default function TropaProjetos() {
  return (
    <>
      <Helmet>
        <title>Projetos — Tropa Científica</title>
        <meta name="description" content="Projetos, experimentos e ferramentas open-source produzidos pela Tropa Científica." />
      </Helmet>
      <section className="container-wide py-20 md:py-28">
        <p className="text-[11px] mono uppercase tracking-[0.25em] text-primary mb-4">Projetos</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase leading-[1] neon-text">
          Feito com código
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Ferramentas, experimentos e projetos open-source. Também mantemos um portfólio
          institucional completo no site do fundador.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="glass rounded-lg p-6 hover:border-primary/40 transition-colors">
            <FolderGit2 className="text-primary mb-4" />
            <h3 className="font-bold uppercase tracking-[0.1em] mb-2">Slot em breve</h3>
            <p className="text-sm text-muted-foreground">Novos projetos serão adicionados nas próximas semanas.</p>
          </div>
          <Link
            to="/matheus/projetos"
            className="glass rounded-lg p-6 hover:border-primary/40 transition-colors group flex flex-col"
          >
            <FolderGit2 className="text-primary mb-4" />
            <h3 className="font-bold uppercase tracking-[0.1em] mb-2">Portfólio institucional</h3>
            <p className="text-sm text-muted-foreground flex-1">
              Ver todos os projetos, incluindo trabalhos acadêmicos e profissionais do fundador.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-primary text-sm mono uppercase tracking-[0.15em] group-hover:underline">
              Acessar <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
