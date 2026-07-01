import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

export function FinalCTA() {
  return (
    <section aria-labelledby="cta-title" className="py-20 md:py-28">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(213 94% 68% / 0.25), transparent 60%), linear-gradient(135deg, hsl(0 0% 100%), hsl(210 30% 97%))",
            boxShadow: "var(--shadow-hero)",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 t-grid-bg opacity-70 pointer-events-none"
          />

          <div className="relative">
            <span className="t-eyebrow">Junte-se à tropa</span>
            <h2
              id="cta-title"
              className="mt-4 text-3xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.05] tracking-[-0.02em] max-w-4xl mx-auto"
            >
              Ciência não precisa ficar{" "}
              <span className="t-gradient-text">distante da prática</span>.
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Acompanhe a Tropa Científica e veja como tecnologia, IA e pesquisa aplicada podem
              transformar a forma como aprendemos, trabalhamos e tomamos decisões.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link
                to="/conteudos"
                className="t-btn-hero inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm"
              >
                Acompanhar Conteúdos
                <ArrowRight size={16} />
              </Link>
              <a
                href="mailto:contato@tropacientifica.com"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm border border-border bg-white hover:border-primary/40 hover:text-primary transition-colors"
              >
                <MessageCircle size={16} />
                Falar com a Tropa Científica
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
