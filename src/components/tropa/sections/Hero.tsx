import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Mail, Sparkles } from "lucide-react";
import { useRef } from "react";
import iconUrl from "@/assets/tropa-icon.png";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, prefersReducedMotion ? 1 : 0.92]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -6]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-8 pb-24 md:pt-14 md:pb-32"
    >
      <div aria-hidden className="absolute inset-0 t-grid-bg pointer-events-none" />

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur-sm px-3.5 py-1.5 text-[11px] mono uppercase tracking-[0.22em] text-primary">
              <Sparkles size={12} />
              Divulgação Científica · 2026
            </span>

            <h1
              id="hero-title"
              className="mt-7 text-[2.6rem] leading-[1.02] sm:text-5xl md:text-6xl lg:text-[4.2rem] font-semibold text-foreground tracking-[-0.03em]"
            >
              Ciência, tecnologia e{" "}
              <span className="t-gradient-text">inteligência</span>
              <br className="hidden sm:block" /> aplicadas ao mundo real.
            </h1>

            <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              A <strong className="text-foreground font-semibold">Tropa Científica</strong> é um
              projeto de divulgação científica e inovação que conecta inteligência artificial,
              análise de dados, segurança pública, educação, pesquisa aplicada e tecnologia
              operacional.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/sobre-a-tropa"
                className="t-btn-hero inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm"
              >
                Conhecer a Tropa Científica
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/conteudos"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm border border-border bg-white hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Play size={16} />
                Ver Conteúdos
              </Link>
              <a
                href="mailto:contato@tropacientifica.com"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={16} />
                Entrar em Contato
              </a>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { k: "8", v: "áreas de atuação" },
                { k: "9", v: "formatos de conteúdo" },
                { k: "10+", v: "tecnologias" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl md:text-3xl font-semibold text-foreground">{s.k}</dt>
                  <dd className="mt-1 text-[11px] mono uppercase tracking-[0.15em] text-muted-foreground">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            style={{ y, scale, rotate, opacity }}
            className="lg:col-span-5 will-change-transform"
          >
            {isMobile ? (
              <div className="relative w-full aspect-square max-w-[420px] mx-auto">
                <div
                  aria-hidden
                  className="absolute inset-[-10%] rounded-full blur-3xl pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, hsl(213 94% 68% / 0.35), transparent 70%)",
                  }}
                />
                <img
                  src={iconUrl}
                  alt="Emblema Tropa Científica"
                  width={520}
                  height={520}
                  className="relative w-full h-full object-contain"
                />
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="relative w-full aspect-square max-w-[560px] mx-auto">
                    <img
                      src={iconUrl}
                      alt=""
                      className="w-full h-full object-contain opacity-70"
                    />
                  </div>
                }
              >
                <TropaLogo3D />
              </Suspense>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
