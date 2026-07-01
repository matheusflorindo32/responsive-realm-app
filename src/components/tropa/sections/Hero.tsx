import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";
import {
  ArrowRight,
  Play,
  Mail,
  Sparkles,
  Brain,
  Database,
  Shield,
  Plane,
  Microscope,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import iconUrl from "@/assets/tropa-icon.png";

/* ------------------------------------------------------------------ */
/*  Small helpers                                                     */
/* ------------------------------------------------------------------ */

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const on = () => setM(mql.matches);
    on();
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);
  return m;
}

/* ------------------------------------------------------------------ */
/*  Floating cards around the emblem                                  */
/* ------------------------------------------------------------------ */

const FLOATING = [
  { label: "Inteligência Artificial", Icon: Brain },
  { label: "Ciência de Dados", Icon: Database },
  { label: "Segurança Pública", Icon: Shield },
  { label: "Drones & Sensores", Icon: Plane },
  { label: "Pesquisa Aplicada", Icon: Microscope },
] as const;

function FloatingCards({ p }: { p: MotionValue<number> }) {
  return (
    <div className="absolute left-4 xl:left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-20 pointer-events-none">
      {FLOATING.map((c, i) => {
        const start = 0.30 + i * 0.05;
        const end = start + 0.15;
        const opacity = useTransform(p, [start - 0.02, end, 0.92, 1], [0, 1, 1, 0.85]);
        const x = useTransform(p, [start, end], [-40, 0]);
        const scale = useTransform(p, [start, end], [0.9, 1]);
        const Icon = c.Icon;
        return (
          <motion.div
            key={c.label}
            style={{ x, opacity, scale }}
            className="will-change-transform lg:w-[210px] xl:w-[240px]"
          >
            <div className="t-glass w-full rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-[var(--shadow-glass)]">
              <span className="grid place-items-center w-7 h-7 rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon size={14} />
              </span>
              <span className="text-[12px] font-semibold text-foreground">
                {c.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Orbit rings (SVG, cheap)                                          */
/* ------------------------------------------------------------------ */

function Orbits({ rotate }: { rotate: MotionValue<number> }) {
  return (
    <motion.svg
      viewBox="-100 -100 200 200"
      style={{ rotate }}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    >
      <defs>
        <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(213 94% 68%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(213 94% 68%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r="70" fill="url(#orbGlow)" />
      {[62, 78, 92].map((r, i) => (
        <ellipse
          key={r}
          cx="0"
          cy="0"
          rx={r}
          ry={r * 0.42}
          fill="none"
          stroke="hsl(221 83% 53%)"
          strokeOpacity={0.28 - i * 0.06}
          strokeWidth={0.4}
          transform={`rotate(${i * 30})`}
        />
      ))}
      {[
        { r: 62, a: 0, rot: 0 },
        { r: 78, a: 140, rot: 30 },
        { r: 92, a: 240, rot: 60 },
      ].map((n, i) => {
        const rad = (n.a * Math.PI) / 180;
        const x = Math.cos(rad) * n.r;
        const y = Math.sin(rad) * n.r * 0.42;
        return (
          <g key={i} transform={`rotate(${n.rot})`}>
            <circle cx={x} cy={y} r="2.4" fill="hsl(221 83% 53%)" />
            <circle cx={x} cy={y} r="6" fill="hsl(213 94% 68%)" fillOpacity="0.25" />
          </g>
        );
      })}
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Particle field (lightweight canvas)                               */
/* ------------------------------------------------------------------ */

function Particles({ opacity }: { opacity: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 70;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      vy: (Math.random() - 0.5) * 0.15 * dpr,
      r: (Math.random() * 1.4 + 0.4) * dpr,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(37, 99, 235, 0.55)";
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <motion.canvas
      ref={ref}
      style={{ opacity }}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main Hero                                                          */
/* ------------------------------------------------------------------ */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const pinned = !prefersReducedMotion && !isMobile;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  // Logo transforms
  const logoScale = useTransform(p, [0, 0.2, 0.55, 1], [1, 1.08, 0.92, 0.95]);
  const logoRotY = useTransform(p, [0, 0.35, 0.8, 1], [0, 18, -6, 0]);
  const logoRotX = useTransform(p, [0, 0.35, 0.8, 1], [0, -8, 4, 0]);
  const logoX = useTransform(p, [0, 0.55, 1], ["0%", "-6%", "-4%"]);
  const logoY = useTransform(p, [0, 0.5, 1], ["0%", "-4%", "0%"]);

  // Background layers
  const gridY = useTransform(p, [0, 1], ["0%", "-14%"]);
  const gridOpacity = useTransform(p, [0, 0.4, 1], [0.5, 0.9, 0.6]);
  const blobsScale = useTransform(p, [0, 1], [1, 1.35]);
  const particlesOp = useTransform(p, [0, 0.2, 1], [0, 0.7, 0.4]);
  const orbitsRot = useTransform(p, [0, 1], [0, 90]);

  // Text staging
  const titleY = useTransform(p, [0, 0.3], ["0%", "-30%"]);
  const titleOp = useTransform(p, [0, 0.35], [1, 0]);
  const subY = useTransform(p, [0.55, 0.85], ["30px", "0px"]);
  const subOp = useTransform(p, [0.55, 0.85], [0, 1]);
  const ctaOp = useTransform(p, [0.78, 1], [0, 1]);
  const ctaY = useTransform(p, [0.78, 1], ["20px", "0px"]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className={pinned ? "relative h-[320vh]" : "relative"}
    >
      <div
        className={
          pinned
            ? "sticky top-0 h-screen w-full overflow-hidden flex items-center"
            : "relative min-h-[92vh] w-full overflow-hidden flex items-center py-16"
        }
      >
        {/* Layer 0 — grid */}
        <motion.div
          aria-hidden
          style={{ y: pinned ? gridY : 0, opacity: pinned ? gridOpacity : 0.6 }}
          className="absolute inset-0 t-grid-bg pointer-events-none"
        />

        {/* Layer 1 — gradient blobs */}
        <motion.div
          aria-hidden
          style={{ scale: pinned ? blobsScale : 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, hsl(213 94% 68% / 0.28), hsl(199 89% 48% / 0.10) 40%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Layer 2 — particles */}
        {pinned && <Particles opacity={particlesOp} />}

        {/* Floating cards — anchored to left edge of viewport */}
        {pinned && <FloatingCards p={p} />}


        <div className="container-wide relative w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text column */}
            <motion.div
              style={pinned ? { y: titleY, opacity: titleOp } : undefined}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 relative"
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

              {/* CTAs — always visible on mobile, staged on desktop */}
              <motion.div
                style={pinned ? { opacity: ctaOp, y: ctaY } : undefined}
                className="mt-10 flex flex-wrap gap-3"
              >
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
              </motion.div>

              {/* Secondary block — appears mid-scroll on desktop */}
              <motion.dl
                style={pinned ? { opacity: subOp, y: subY } : undefined}
                className="mt-14 grid grid-cols-3 gap-6 max-w-lg"
              >
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
              </motion.dl>
            </motion.div>

            {/* Emblem column */}
            <div className="lg:col-span-5">
              <div
                className="relative w-full aspect-square max-w-[560px] mx-auto"
                style={{ perspective: 1200 }}
              >
                {/* Orbits behind */}
                {pinned && <Orbits rotate={orbitsRot} />}

                {/* Pulsing halo */}
                <motion.div
                  aria-hidden
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: [0.35, 0.6, 0.35], scale: [1, 1.06, 1] }
                  }
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-[-12%] rounded-full blur-3xl pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, hsl(213 94% 68% / 0.55), hsl(199 89% 48% / 0.20) 45%, transparent 72%)",
                  }}
                />

                {/* Logo (scroll-driven) */}
                <motion.div
                  style={
                    pinned
                      ? {
                          scale: logoScale,
                          rotateY: logoRotY,
                          rotateX: logoRotX,
                          x: logoX,
                          y: logoY,
                          transformStyle: "preserve-3d",
                        }
                      : undefined
                  }
                  className="relative w-full h-full will-change-transform"
                >
                  <motion.img
                    src={iconUrl}
                    alt="Emblema Tropa Científica"
                    width={640}
                    height={640}
                    animate={
                      prefersReducedMotion || pinned
                        ? undefined
                        : { y: [0, -14, 0], rotate: [0, 1.5, 0] }
                    }
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(37,99,235,0.35)]"
                  />
                </motion.div>
                {/* Floating cards moved to stage-level (left edge) */}

              </div>

              {/* Mobile fallback chips */}
              {!pinned && (
                <div className="mt-8 grid grid-cols-2 gap-2 md:hidden">
                  {FLOATING.map(({ label, Icon }) => (
                    <div
                      key={label}
                      className="t-glass rounded-xl px-3 py-2.5 flex items-center gap-2"
                    >
                      <span className="grid place-items-center w-7 h-7 rounded-lg bg-primary/10 text-primary">
                        <Icon size={14} />
                      </span>
                      <span className="text-[12px] font-semibold text-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        {pinned && (
          <motion.div
            style={{ opacity: useTransform(p, [0, 0.15], [1, 0]) }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-[10px] mono uppercase tracking-[0.25em]">scroll</span>
            <span className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
