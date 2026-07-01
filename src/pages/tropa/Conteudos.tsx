import { Helmet } from "react-helmet-async";
import { Play } from "lucide-react";

export default function TropaConteudos() {
  return (
    <>
      <Helmet>
        <title>Conteúdos — Tropa Científica</title>
        <meta name="description" content="Vídeos, posts e materiais educativos da Tropa Científica sobre IA, ciência e segurança pública." />
      </Helmet>
      <section className="container-wide py-20 md:py-28">
        <p className="text-[11px] mono uppercase tracking-[0.25em] text-primary mb-4">Conteúdos</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase leading-[1] neon-text">
          Em produção
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Estamos preparando os primeiros vídeos, artigos e materiais educativos.
          Volte em breve — ou acompanhe pelas redes.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent grid place-items-center border-b border-primary/10">
                <Play size={28} className="text-primary/40" />
              </div>
              <div className="p-5">
                <span className="text-[10px] mono uppercase tracking-[0.2em] text-primary">Em breve</span>
                <h3 className="mt-2 font-bold text-base">Conteúdo #{i + 1}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Slot reservado para próximo episódio.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
