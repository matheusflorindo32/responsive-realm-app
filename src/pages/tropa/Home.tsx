import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Brain,
  Shield,
  FlaskConical,
  GraduationCap,
  Sparkles,
  Play,
  ArrowUpRight,
} from "lucide-react";

const pillars = [
  {
    icon: FlaskConical,
    title: "Ciência aberta",
    text: "Traduzimos pesquisa acadêmica em conteúdo acessível, com rigor e sem sensacionalismo.",
  },
  {
    icon: Brain,
    title: "Inteligência Artificial",
    text: "Aplicações práticas de IA, machine learning e automações que resolvem problemas reais.",
  },
  {
    icon: Shield,
    title: "Segurança Pública",
    text: "Interseção entre tecnologia, dados e política pública para uma sociedade mais segura.",
  },
  {
    icon: GraduationCap,
    title: "Educação",
    text: "Materiais educativos, tutoriais e trilhas de aprendizado para desenvolvedores e pesquisadores.",
  },
];

export default function TropaHome() {
  return (
    <>
      <Helmet>
        <title>Tropa Científica — Ciência, IA e Segurança Pública</title>
        <meta
          name="description"
          content="Divulgação científica com foco em Inteligência Artificial, tecnologia e segurança pública. Conteúdo, projetos e materiais educativos."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="container-wide py-24 md:py-36 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neon-border text-[11px] mono uppercase tracking-[0.25em] text-primary mb-8">
              <Sparkles size={12} />
              Divulgação científica · 2026
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.95] neon-text">
              Tropa
              <br />
              Científica
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Onde ciência, inteligência artificial e segurança pública se encontram.
              Conteúdos, pesquisas e experimentos para quem constrói o futuro com base em evidência.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/conteudos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold uppercase tracking-[0.15em] text-sm hover:brightness-110 transition"
              >
                <Play size={16} />
                Explorar conteúdos
              </Link>
              <Link
                to="/projetos-tropa"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md neon-border text-primary font-semibold uppercase tracking-[0.15em] text-sm hover:bg-primary/10 transition"
              >
                Ver projetos
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="container-wide py-20">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-4">
            <p className="text-[11px] mono uppercase tracking-[0.25em] text-primary mb-3">Manifesto</p>
            <h2 className="text-3xl md:text-4xl font-bold uppercase leading-tight">
              A ciência precisa de tropa.
            </h2>
          </div>
          <div className="md:col-span-8 space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              Vivemos a maior revolução tecnológica desde a internet — e, ao mesmo tempo,
              a maior crise de confiança na ciência das últimas décadas.
            </p>
            <p className="text-foreground">
              A Tropa Científica existe para reduzir essa distância. Produzimos conteúdo
              técnico, projetos de código aberto e experimentos que unem rigor acadêmico
              e utilidade prática — especialmente nas áreas de <span className="text-primary">IA aplicada</span>{" "}
              e <span className="text-primary">segurança pública</span>.
            </p>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="container-wide py-20">
        <div className="mb-12">
          <p className="text-[11px] mono uppercase tracking-[0.25em] text-primary mb-3">Pilares</p>
          <h2 className="text-3xl md:text-4xl font-bold uppercase">Onde atuamos</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="glass rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="h-11 w-11 rounded-md grid place-items-center neon-border mb-5 group-hover:scale-105 transition-transform">
                <p.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTEÚDOS PLACEHOLDER */}
      <section className="container-wide py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[11px] mono uppercase tracking-[0.25em] text-primary mb-3">Últimos conteúdos</p>
            <h2 className="text-3xl md:text-4xl font-bold uppercase">Em produção</h2>
          </div>
          <Link
            to="/conteudos"
            className="text-sm mono uppercase tracking-[0.15em] text-primary hover:underline inline-flex items-center gap-1.5"
          >
            Ver tudo <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-lg overflow-hidden group">
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent grid place-items-center border-b border-primary/10">
                <Play size={32} className="text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all" />
              </div>
              <div className="p-5">
                <span className="text-[10px] mono uppercase tracking-[0.2em] text-primary">Em breve</span>
                <h3 className="mt-2 font-bold text-base">Episódio piloto #{i}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                  Novos conteúdos sobre IA, ciência e segurança pública estão sendo produzidos.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER CTA */}
      <section className="container-wide py-20">
        <div className="glass rounded-lg p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <p className="text-[11px] mono uppercase tracking-[0.25em] text-primary mb-3">Fundador</p>
              <h2 className="text-2xl md:text-3xl font-bold uppercase leading-tight mb-4">
                Matheus Florindo de Deus
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                Estudante de Análise e Desenvolvimento de Sistemas pelo IFES, pesquisador
                em IA aplicada à segurança pública e desenvolvedor full-stack. Conheça o
                currículo acadêmico, publicações e projetos institucionais.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                to="/matheus"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold uppercase tracking-[0.15em] text-sm hover:brightness-110 transition"
              >
                Site institucional
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
