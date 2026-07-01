import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function TropaSobre() {
  return (
    <>
      <Helmet>
        <title>Manifesto — Tropa Científica</title>
        <meta name="description" content="O manifesto da Tropa Científica: ciência aberta, IA e segurança pública com rigor e utilidade." />
      </Helmet>
      <section className="container-wide py-20 md:py-28">
        <p className="text-[11px] mono uppercase tracking-[0.25em] text-primary mb-4">Manifesto</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase leading-[1] neon-text max-w-3xl">
          A ciência
          <br />precisa de tropa.
        </h1>

        <div className="mt-12 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Este é um projeto de divulgação científica independente, criado para reduzir
              a distância entre a pesquisa acadêmica e o público que constrói tecnologia
              todos os dias.
            </p>
            <p>
              Nossos temas: <span className="text-foreground">Inteligência Artificial aplicada</span>,{" "}
              <span className="text-foreground">segurança pública baseada em evidência</span>,{" "}
              engenharia de software e educação técnica. Sempre com fontes, sempre com código,
              sempre reprodutível.
            </p>
            <p>
              Não vendemos hype. Não simplificamos ao ponto de mentir. E não escondemos
              limitações — porque ciência boa é ciência honesta.
            </p>
          </div>
          <aside className="md:col-span-4">
            <div className="glass rounded-lg p-6 space-y-4">
              <p className="text-[11px] mono uppercase tracking-[0.2em] text-primary">Princípios</p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3"><span className="text-primary">01</span> Rigor acadêmico</li>
                <li className="flex gap-3"><span className="text-primary">02</span> Código aberto</li>
                <li className="flex gap-3"><span className="text-primary">03</span> Reprodutibilidade</li>
                <li className="flex gap-3"><span className="text-primary">04</span> Utilidade pública</li>
                <li className="flex gap-3"><span className="text-primary">05</span> Zero sensacionalismo</li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-16">
          <Link
            to="/matheus"
            className="inline-flex items-center gap-2 text-primary hover:underline mono text-sm uppercase tracking-[0.15em]"
          >
            Conheça o fundador <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
