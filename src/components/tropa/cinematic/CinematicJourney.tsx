import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import iconUrl from "@/assets/tropa-icon.png";
import { AtmoEntry, AtmoResearch, AtmoOps, AtmoField, AtmoMedic, AtmoFuture } from "./Atmosphere";

gsap.registerPlugin(ScrollTrigger);

const FRONTS = [
  { n: "01", t: "Ciência aplicada", d: "Método e evidência orientando problemas concretos." },
  { n: "02", t: "Inteligência artificial", d: "Modelos e LLMs com contexto, limites e critério." },
  { n: "03", t: "Dados e automação", d: "Pipelines, indicadores e decisões acionáveis." },
  { n: "04", t: "Segurança pública", d: "Tecnologia com responsabilidade no território." },
  { n: "05", t: "Drones e tecnologia operacional", d: "Sensoriamento, mapeamento e operação real." },
  { n: "06", t: "Educação e treinamento", d: "Formação técnica que respeita a inteligência." },
  { n: "07", t: "Desenvolvimento de sistemas", d: "Aplicações, dashboards e produtos digitais." },
] as const;

const IDX = ["01", "02", "03", "04", "05", "06"] as const;

const CHIPS = ["IA generativa", "Ciência de dados", "Drones & sensores", "Automação", "Pesquisa aplicada", "Sistemas & web"] as const;

const METERS = [
  { l: "Modelos & LLMs · avaliação aplicada", v: "0.82", w: "w-[82%]" },
  { l: "Telemetria UAV · cobertura de voo", v: "0.64", w: "w-[64%]" },
  { l: "Pipeline de dados · indicadores públicos", v: "0.78", w: "w-[78%]" },
  { l: "Automação · rotinas assistidas", v: "0.58", w: "w-[58%]" },
] as const;

const STATEMENT = ["Do laboratório ao campo.", "Do dado à decisão.", "Da pesquisa à prática."] as const;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-[8px]";

export function CinematicJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [cinematic, setCinematic] = useState(false);

  useLayoutEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCinematic(wide.matches && !reduce.matches);
    update();
    wide.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (cinematic) {
        const scenes = gsap.utils.toArray<HTMLElement>(".cj-scene");
        gsap.set(scenes.slice(1), { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".cj-stage",
            start: "top top",
            end: "+=560%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        const enter = (sel: string, at: number) =>
          tl.fromTo(
            sel,
            { autoAlpha: 0, y: 90, scale: 0.94, filter: "blur(10px)" },
            { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 4, ease: "power1.out" },
            at,
          );
        const exit = (sel: string, at: number) =>
          tl.to(sel, { autoAlpha: 0, y: -80, scale: 1.06, filter: "blur(8px)", duration: 4, ease: "power1.in" }, at);

        tl.fromTo(".cj-cam", { scale: 1.06 }, { scale: 1, duration: 8, ease: "power1.out" }, 0)
          .to(".cj-cam", { xPercent: -2.5, duration: 12, ease: "power1.inOut" }, 12)
          .to(".cj-cam", { xPercent: 1.5, duration: 12, ease: "power1.inOut" }, 30)
          .to(".cj-cam", { xPercent: 0, duration: 8, ease: "power1.inOut" }, 50)
          .to(".cj-grid", { yPercent: -16, duration: 60 }, 0)
          .to(".cj-linework", { yPercent: -26, scale: 1.06, duration: 60 }, 0)
          .to(".cj-glow", { xPercent: 20, yPercent: -18, scale: 1.35, duration: 60 }, 0)
          .to(".cj-bar", { scaleX: 1, duration: 60 }, 0)
          .to(".cj-railfill", { scaleY: 1, duration: 60 }, 0)
          .to(".cj-cue", { autoAlpha: 0, duration: 2 }, 2);

        const inAt = [0, 8, 17, 31, 42, 51];
        const outAt = [7, 16, 30, 41, 50];
        IDX.forEach((_, i) => {
          if (i > 0) tl.to(`.cj-idx[data-i="${i}"]`, { opacity: 1, duration: 1.5 }, inAt[i]);
          if (i < 5) tl.to(`.cj-idx[data-i="${i}"]`, { opacity: 0.35, duration: 1.5 }, outAt[i]);
        });

        tl.fromTo(".cj-emblem", { yPercent: 4, scale: 1.05 }, { yPercent: -4, scale: 0.97, duration: 10, ease: "power1.inOut" }, 0)
          .to(".cj-orbit", { rotation: 70, duration: 60, svgOrigin: "100 100" }, 0);
        exit(".cj-s1", 7);

        tl.to(".cj-dark", { autoAlpha: 1, duration: 5 }, 7);

        enter(".cj-s2", 8);
        tl.fromTo(".cj-line", { y: 64, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 3, stagger: 1.6, ease: "power2.out" }, 9.5);
        exit(".cj-s2", 16);

        enter(".cj-s3", 17);
        tl.fromTo(
          ".cj-panel",
          { y: 110, scale: 0.88, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 3, stagger: 0.9, ease: "power2.out" },
          18.5,
        )
          .to(".cj-panel-a", { y: -18, duration: 5, ease: "power1.inOut" }, 25)
          .to(".cj-panel-b", { y: 14, duration: 5, ease: "power1.inOut" }, 25);
        exit(".cj-s3", 30);

        enter(".cj-s4", 31);
        tl.to(".cj-radar", { rotation: 140, svgOrigin: "60 60", duration: 12 }, 31)
          .fromTo(".cj-meter", { scaleX: 0.15, transformOrigin: "left center" }, { scaleX: 1, duration: 6, stagger: 0.5, ease: "power1.inOut" }, 32)
          .fromTo(".cj-chip", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 2, stagger: 0.5, ease: "power2.out" }, 32.5)
          .to(".cj-chip", { y: -10, duration: 6, stagger: 0.4, ease: "power1.inOut" }, 36);
        exit(".cj-s4", 41);

        tl.to(".cj-dark", { autoAlpha: 0, duration: 5 }, 41);

        enter(".cj-s5", 42);
        exit(".cj-s5", 50);

        tl.fromTo(".cj-s6", { autoAlpha: 0, y: 70, scale: 1.05 }, { autoAlpha: 1, y: 0, scale: 1.02, duration: 4, ease: "power1.out" }, 51)
          .to(".cj-s6", { scale: 1, duration: 8, ease: "power2.out" }, 55);

        gsap.utils.toArray<HTMLElement>(".cj-dot").forEach((d, i) => {
          tl.to(d, { y: -(20 + (i % 5) * 14), duration: 60 }, 0);
        });

        /* ATMOSFERA CINEMATOGRÁFICA */

        tl.fromTo(".atm-datacol", { autoAlpha: 0, y: 30 }, { autoAlpha: 0.55, y: -20, duration: 8, ease: "none" }, 0.5)
          .fromTo(".atm-scan", { y: 0, autoAlpha: 0 }, { autoAlpha: 0.7, y: () => window.innerHeight * 0.9, duration: 7, ease: "power1.inOut" }, 1)
          .to(".atm-scan", { autoAlpha: 0, duration: 1.5 }, 8);

        tl.fromTo(".cj-s2 .atm-draw", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 5, stagger: 0.4, ease: "none" }, 9)
          .fromTo(".atm-circuit", { autoAlpha: 0 }, { autoAlpha: 0.55, duration: 3 }, 9)
          .fromTo(".atm-paper-1", { xPercent: 140, yPercent: -6, autoAlpha: 0, scale: 0.9 }, { xPercent: -10, yPercent: 2, autoAlpha: 0.5, scale: 1, duration: 5, ease: "none" }, 9)
          .to(".atm-paper-1", { xPercent: -160, autoAlpha: 0, duration: 4.5, ease: "none" }, 14.5)
          .fromTo(".atm-paper-2", { xPercent: 90, yPercent: 20, autoAlpha: 0 }, { xPercent: -180, yPercent: 6, autoAlpha: 0.3, duration: 10, ease: "none" }, 8.8)
          .fromTo(".atm-neural", { autoAlpha: 0, scale: 0.92, y: 30 }, { autoAlpha: 0.5, scale: 1, y: 0, duration: 4 }, 10)
          .fromTo(".atm-flow", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 9, ease: "none" }, 9.5)
          .to(".atm-neural", { autoAlpha: 0, y: -40, duration: 3.5 }, 16.5);

        tl.fromTo(".atm-map", { autoAlpha: 0, yPercent: 8 }, { autoAlpha: 0.32, yPercent: 0, duration: 3.5 }, 17.5)
          .fromTo(".atm-mission", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 12, ease: "none" }, 18)
          .fromTo(".atm-wp", { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 1.2, stagger: 1.6 }, 18.5)
          .to(".atm-map", { yPercent: -6, duration: 10, ease: "none" }, 21)
          .to(".atm-map", { autoAlpha: 0, duration: 3 }, 30.5);

        tl.set(".atm-drone", { xPercent: 260, yPercent: -70, scale: 0.45, autoAlpha: 0 }, 17.8)
          .to(
            ".atm-drone",
            {
              keyframes: [
                { xPercent: 70, yPercent: -20, scale: 0.85, autoAlpha: 0.8, duration: 4, ease: "power1.out" },
                { xPercent: -60, yPercent: 10, scale: 1.1, autoAlpha: 0.8, duration: 4, ease: "none" },
                { xPercent: -260, yPercent: 55, scale: 1.4, autoAlpha: 0, duration: 4, ease: "power1.in" },
              ],
            },
            18,
          )
          .to(".atm-rotor", { scaleX: 0.35, duration: 0.35, repeat: 33, yoyo: true, ease: "none" }, 18);

        tl.set(".atm-track", { xPercent: 300, yPercent: -80, autoAlpha: 0 }, 18.2)
          .to(
            ".atm-track",
            {
              keyframes: [
                { xPercent: 95, yPercent: -30, autoAlpha: 0.9, duration: 4, ease: "power1.out" },
                { xPercent: -35, yPercent: 5, autoAlpha: 0.9, duration: 4, ease: "none" },
                { xPercent: -230, yPercent: 50, autoAlpha: 0, duration: 3.6, ease: "power1.in" },
              ],
            },
            18.45,
          );

        tl.fromTo(".atm-rappel", { autoAlpha: 0, yPercent: -46 }, { autoAlpha: 0.5, yPercent: -30, duration: 3, ease: "power1.out" }, 31.5)
          .to(".atm-rappel", { yPercent: 26, duration: 9, ease: "none" }, 34)
          .to(".atm-rappel", { autoAlpha: 0, duration: 2.5 }, 41.5)
          .to(".atm-rappel-fig", { x: 7, duration: 2.6, repeat: 3, yoyo: true, ease: "sine.inOut" }, 32)
          .fromTo(".atm-team", { xPercent: -35, autoAlpha: 0 }, { xPercent: 20, autoAlpha: 0.2, duration: 10.5, ease: "none" }, 31.5)
          .to(".atm-team", { autoAlpha: 0, duration: 2.5 }, 41.5);

        tl.fromTo(".atm-medic", { xPercent: -14, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 0.55, duration: 3.5, ease: "power1.out" }, 43)
          .fromTo(".atm-medic .atm-draw", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 6, stagger: 0.3, ease: "none" }, 43.2)
          .to(".atm-medic", { y: -24, duration: 6, ease: "none" }, 47)
          .to(".atm-medic", { autoAlpha: 0, duration: 2.5 }, 50.5);

        tl.set(".atm-robot", { xPercent: -380, autoAlpha: 0 }, 51.6)
          .to(".atm-robot", { xPercent: -60, autoAlpha: 0.55, duration: 4, ease: "none" }, 52)
          .to(".atm-robot", { xPercent: 205, duration: 4, ease: "power1.in" }, 56.2)
          .to(".atm-robot", { autoAlpha: 0.12, filter: "blur(2px)", duration: 2.5 }, 57.5)
          .to(".atm-robot", { y: -5, duration: 0.7, repeat: 10, yoyo: true, ease: "sine.inOut" }, 52)
          .to(".atm-leg-a", { rotation: 9, duration: 0.7, repeat: 10, yoyo: true, ease: "sine.inOut" }, 52)
          .to(".atm-leg-b", { rotation: -9, duration: 0.7, repeat: 10, yoyo: true, ease: "sine.inOut" }, 52)
          .fromTo(".atm-ar", { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 0.45, scale: 1, duration: 4, ease: "power1.out" }, 52.5)
          .fromTo(".atm-ar-panel", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 2.5, stagger: 0.8 }, 53)
          .fromTo(".atm-glass", { autoAlpha: 0 }, { autoAlpha: 1, duration: 3 }, 53);
      } else {
        gsap.utils.toArray<HTMLElement>(".cj-scene").forEach((s) => {
          const els = s.querySelectorAll(".cj-rev");
          if (els.length)
            gsap.from(els, {
              y: 26,
              autoAlpha: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: { trigger: s, start: "top 82%", once: true },
            });
        });
        gsap.to(".cj-emblem", {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: ".cj-s1", start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [cinematic]);

  const darkBg = "bg-[hsl(222_47%_7%)]";
  const scene = (n: number, extra = "") =>
    cinematic
      ? `cj-scene cj-s${n} absolute inset-0 flex items-center will-change-transform ${extra}`
      : `cj-scene cj-s${n} relative flex items-center overflow-hidden py-20 sm:py-24 ${extra}`;

  return (
    <div ref={rootRef} className="relative overflow-x-clip">
      <div className={cinematic ? "cj-stage relative h-screen overflow-hidden" : "cj-stage relative"}>
        {cinematic && (
          <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
            <div
              className="cj-grid absolute inset-[-12%]"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(215 25% 88% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(215 25% 88% / 0.5) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
                maskImage: "radial-gradient(ellipse 75% 65% at 50% 42%, black 30%, transparent 78%)",
                WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 42%, black 30%, transparent 78%)",
              }}
            />
            <div
              className="cj-glow absolute -top-1/3 left-1/4 w-[70vw] aspect-square rounded-full"
              style={{ background: "radial-gradient(circle, hsl(199 89% 48% / 0.16), transparent 65%)", filter: "blur(40px)" }}
            />
            <svg
              className="cj-linework absolute inset-0 w-full h-full opacity-60"
              viewBox="0 0 1440 900"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              <circle cx="1160" cy="240" r="180" stroke="hsl(221 83% 53% / 0.10)" strokeWidth="1" />
              <circle cx="1160" cy="240" r="260" stroke="hsl(221 83% 53% / 0.07)" strokeWidth="1" strokeDasharray="3 9" />
              <line x1="0" y1="700" x2="1440" y2="520" stroke="hsl(199 89% 48% / 0.10)" strokeWidth="1" />
              <line x1="120" y1="0" x2="480" y2="900" stroke="hsl(221 83% 53% / 0.07)" strokeWidth="1" />
              <path d="M40 120h14M47 113v14" stroke="hsl(221 83% 53% / 0.35)" strokeWidth="1" />
              <path d="M1380 760h14M1387 753v14" stroke="hsl(199 89% 48% / 0.35)" strokeWidth="1" />
            </svg>
            <div className="absolute inset-0">
              {Array.from({ length: 14 }).map((_, i) => (
                <i
                  key={i}
                  className="cj-dot absolute block w-1 h-1 rounded-full bg-primary/40"
                  style={{ left: `${(i * 47 + 9) % 100}%`, top: `${(i * 31 + 13) % 100}%` }}
                />
              ))}
            </div>
            <div
              className="cj-dark absolute inset-0 opacity-0"
              style={{ background: "linear-gradient(180deg, hsl(222 47% 7%), hsl(221 55% 10%))" }}
            />
          </div>
        )}

        {cinematic && (
          <>
            <div
              aria-hidden
              className="cj-bar absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 z-30"
              style={{ background: "linear-gradient(90deg, hsl(221 83% 53%), hsl(199 89% 48%))" }}
            />
            <div aria-hidden className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 items-center gap-4 mix-blend-difference">
              <div className="relative h-44 w-px bg-white/25 overflow-hidden">
                <span className="cj-railfill absolute inset-0 origin-top scale-y-0 bg-white block" />
              </div>
              <div className="flex flex-col gap-4">
                {IDX.map((n, i) => (
                  <span key={n} data-i={i} className="cj-idx mono text-[10px] tracking-[0.22em] text-white" style={{ opacity: i === 0 ? 1 : 0.35 }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        <div className={cinematic ? "cj-cam relative z-10 h-full" : "cj-cam relative z-10"}>
          {/* CENA 01 */}
          <article className={scene(1, cinematic ? "" : "min-h-[86vh]")} aria-labelledby="cj-title">
            {!cinematic && <div aria-hidden className="absolute inset-0 t-grid-bg pointer-events-none" />}
            <AtmoEntry cinematic={cinematic} />
            <div className="container-wide relative z-10 grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <p className="cj-rev mono text-[11px] uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                  <span aria-hidden className="inline-block w-8 h-px bg-primary/60" />
                  01 · Divulgação científica aplicada
                </p>
                <h1 id="cj-title" className="cj-rev mt-6 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-semibold text-foreground">
                  Tropa
                  <br />
                  Científica
                </h1>
                <p className="cj-rev mt-6 text-xl lg:text-2xl text-foreground/80 font-medium max-w-xl">
                  Ciência, tecnologia e inteligência para decisões do mundo real.
                </p>
                <p className="cj-rev mt-4 text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Pesquisa, IA, dados, drones e tecnologia operacional traduzidos em conhecimento aplicável — do laboratório ao campo.
                </p>
              </div>
              <div className="cj-rev lg:col-span-5 relative">
                <div className="cj-emblem relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] mx-auto aspect-square">
                  <svg className="cj-orbit absolute inset-[-10%] w-[120%] h-[120%]" viewBox="0 0 200 200" fill="none" aria-hidden>
                    <circle cx="100" cy="100" r="96" stroke="hsl(221 83% 53% / 0.25)" strokeWidth="0.5" strokeDasharray="2 6" />
                    <circle cx="100" cy="100" r="78" stroke="hsl(199 89% 48% / 0.3)" strokeWidth="0.5" />
                    <circle cx="100" cy="22" r="2.5" fill="hsl(199 89% 48%)" />
                  </svg>
                  <div
                    aria-hidden
                    className="absolute inset-[-14%] rounded-full"
                    style={{ background: "radial-gradient(circle, hsl(213 94% 68% / 0.4), transparent 68%)", filter: "blur(32px)" }}
                  />
                  <img
                    src={iconUrl}
                    alt="Emblema da Tropa Científica"
                    width={640}
                    height={640}
                    className="relative w-full h-full object-contain drop-shadow-[0_24px_64px_rgba(37,99,235,0.35)]"
                  />
                </div>
              </div>
            </div>
            {cinematic && (
              <div aria-hidden className="cj-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
                <span className="mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
                <span className="w-px h-9 bg-gradient-to-b from-primary/70 to-transparent" />
              </div>
            )}
          </article>

          {/* CENA 02 */}
          <article className={scene(2, cinematic ? "" : darkBg)}>
            <AtmoResearch cinematic={cinematic} />
            <div className="container-wide relative z-10">
              <p className="cj-rev mono text-[11px] uppercase tracking-[0.3em] text-[hsl(199,89%,60%)] flex items-center gap-3">
                <span aria-hidden className="inline-block w-8 h-px bg-[hsl(199,89%,60%)]/60" />
                02 · Transição de mundo
              </p>
              <div className="mt-8 space-y-2">
                {STATEMENT.map((l, i) => (
                  <p
                    key={l}
                    className={`cj-line cj-rev text-3xl sm:text-5xl lg:text-6xl font-semibold leading-tight ${
                      i === 1 ? "text-[hsl(199,89%,60%)]" : "text-slate-100"
                    }`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {l}
                  </p>
                ))}
              </div>
              <p className="cj-rev mt-8 max-w-2xl text-slate-400 text-base lg:text-lg leading-relaxed">
                A prática operacional evolui rápido. A produção científica também. O desafio — e o trabalho da Tropa — é conectar esses dois
                mundos com clareza, método e aplicação real.
              </p>
            </div>
          </article>

          {/* CENA 03 */}
          <article className={scene(3, cinematic ? "" : darkBg)}>
            <AtmoOps cinematic={cinematic} />
            <div className="container-wide relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <header className="lg:col-span-4">
                <p className="cj-rev mono text-[11px] uppercase tracking-[0.3em] text-[hsl(199,89%,60%)] flex items-center gap-3">
                  <span aria-hidden className="inline-block w-8 h-px bg-[hsl(199,89%,60%)]/60" />
                  03 · Frentes de atuação
                </p>
                <h2 className="cj-rev mt-6 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-100 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Sete frentes. Uma missão.
                </h2>
                <p className="cj-rev mt-5 text-slate-400 text-sm lg:text-base leading-relaxed">
                  A Tropa traduz pesquisa, IA, dados e tecnologia operacional em conteúdo, sistemas e treinamento aplicados.
                </p>
              </header>
              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4 lg:gap-5">
                <div className="space-y-4 lg:space-y-5">
                  {FRONTS.filter((_, i) => i % 2 === 0).map((f) => (
                    <article key={f.n} className="cj-panel cj-panel-a cj-rev relative rounded-[8px] border border-white/10 bg-white/[0.045] px-5 py-4 overflow-hidden backdrop-blur-[2px]">
                      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(199,89%,55%)]/70 to-transparent" />
                      <div className="flex items-baseline justify-between">
                        <span className="mono text-[11px] tracking-[0.2em] text-[hsl(199,89%,60%)]">{f.n}</span>
                        <span aria-hidden className="w-6 h-px bg-white/15" />
                      </div>
                      <h3 className="mt-2.5 text-[15px] lg:text-base font-semibold text-slate-100">{f.t}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{f.d}</p>
                    </article>
                  ))}
                </div>
                <div className="space-y-4 lg:space-y-5 sm:mt-12">
                  {FRONTS.filter((_, i) => i % 2 === 1).map((f) => (
                    <article key={f.n} className="cj-panel cj-panel-b cj-rev relative rounded-[8px] border border-white/10 bg-white/[0.045] px-5 py-4 overflow-hidden backdrop-blur-[2px]">
                      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(199,89%,55%)]/70 to-transparent" />
                      <div className="flex items-baseline justify-between">
                        <span className="mono text-[11px] tracking-[0.2em] text-[hsl(199,89%,60%)]">{f.n}</span>
                        <span aria-hidden className="w-6 h-px bg-white/15" />
                      </div>
                      <h3 className="mt-2.5 text-[15px] lg:text-base font-semibold text-slate-100">{f.t}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{f.d}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* CENA 04 */}
          <article className={scene(4, cinematic ? "" : darkBg)}>
            <AtmoField cinematic={cinematic} />
            <div className="container-wide relative z-10 grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5">
                <p className="cj-rev mono text-[11px] uppercase tracking-[0.3em] text-[hsl(199,89%,60%)] flex items-center gap-3">
                  <span aria-hidden className="inline-block w-8 h-px bg-[hsl(199,89%,60%)]/60" />
                  04 · Ambiente tecnológico
                </p>
                <h2 className="cj-rev mt-6 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-100 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Menos hype. Mais método, evidência e aplicação.
                </h2>
                <p className="cj-rev mt-5 text-slate-400 text-sm lg:text-base leading-relaxed">
                  IA, dados, drones, automação e pesquisa aplicada operando juntos. Novas formas de aprender, decidir e agir nascem quando
                  método e tecnologia se encontram.
                </p>
                <div className="cj-rev mt-7 flex flex-wrap gap-2">
                  {CHIPS.map((c) => (
                    <span key={c} className="cj-chip mono text-[10.5px] uppercase tracking-[0.14em] text-slate-300 border border-white/10 rounded-[6px] px-3 py-1.5 bg-white/[0.03]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="cj-rev lg:col-span-7">
                <div className="relative rounded-[8px] border border-white/10 bg-[hsl(222_45%_9%)]/90 p-5 sm:p-7 overflow-hidden">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(199,89%,55%)]/70 to-transparent" />
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10px] uppercase tracking-[0.24em] text-slate-500">Painel operacional · simulação</span>
                    <span aria-hidden className="flex gap-1.5">
                      <i className="w-1.5 h-1.5 rounded-full bg-[hsl(199,89%,55%)]" />
                      <i className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <i className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </span>
                  </div>
                  <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-8 items-center">
                    <div className="space-y-5">
                      {METERS.map((m) => (
                        <div key={m.l}>
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="mono text-[11px] text-slate-400">{m.l}</span>
                            <span className="mono text-[11px] text-[hsl(199,89%,60%)]">{m.v}</span>
                          </div>
                          <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                            <span className={`cj-meter block h-full rounded-full ${m.w}`} style={{ background: "linear-gradient(90deg, hsl(221 83% 53%), hsl(199 89% 48%))" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <svg viewBox="0 0 120 120" className="w-36 h-36 lg:w-44 lg:h-44 mx-auto" fill="none" aria-hidden>
                      {[54, 40, 26].map((r) => (
                        <circle key={r} cx="60" cy="60" r={r} stroke="hsl(199 89% 55% / 0.25)" strokeWidth="0.6" />
                      ))}
                      <line x1="6" y1="60" x2="114" y2="60" stroke="hsl(199 89% 55% / 0.15)" strokeWidth="0.6" />
                      <line x1="60" y1="6" x2="60" y2="114" stroke="hsl(199 89% 55% / 0.15)" strokeWidth="0.6" />
                      <g className="cj-radar">
                        <line x1="60" y1="60" x2="60" y2="8" stroke="hsl(199 89% 60%)" strokeWidth="1" />
                        <circle cx="60" cy="20" r="2.4" fill="hsl(199 89% 60%)" />
                      </g>
                      <circle cx="60" cy="60" r="2.6" fill="hsl(199 89% 60%)" />
                      <circle cx="84" cy="42" r="1.8" fill="hsl(38 70% 55%)" />
                      <circle cx="38" cy="78" r="1.8" fill="hsl(221 83% 63%)" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CENA 05 */}
          <article className={scene(5)}>
            <AtmoMedic cinematic={cinematic} />
            <div className="container-wide relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <span aria-hidden className="cj-rev mx-auto block w-12 h-px bg-[hsl(38,65%,48%)]" />
                <p className="cj-rev mt-6 mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">05 · Autoridade</p>
                <h2 className="cj-rev mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
                  Método, evidência e responsabilidade pública.
                </h2>
                <p className="cj-rev mt-6 text-muted-foreground text-base lg:text-lg leading-relaxed">
                  A Tropa Científica nasce da união entre vivência operacional, formação acadêmica e desenvolvimento tecnológico — pesquisa
                  aplicada, publicações e sistemas em produção.
                </p>
                <div className="cj-rev mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>Mestrado · Business Intelligence</span>
                  <span>MBA · Inteligência Artificial</span>
                  <span>ADS · IFES</span>
                </div>
                <div className="cj-rev mt-9 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/matheus"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-[8px] font-semibold text-sm border border-border bg-white hover:border-primary/40 hover:text-primary transition-colors ${focusRing}`}
                  >
                    Conhecer o fundador
                    <ArrowUpRight size={15} />
                  </Link>
                  <Link
                    to="/matheus/publicacoes"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-[8px] font-semibold text-sm text-muted-foreground hover:text-primary transition-colors ${focusRing}`}
                  >
                    Publicações acadêmicas
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* CENA 06 */}
          <article className={scene(6)}>
            <AtmoFuture cinematic={cinematic} />
            <div className="container-wide relative z-10 text-center">
              <p className="cj-rev mono text-[11px] uppercase tracking-[0.3em] text-primary">06 · Junte-se à Tropa</p>
              <h2 className="cj-rev mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.05] max-w-3xl mx-auto">
                Ciência não precisa ficar distante da prática.
              </h2>
              <p className="cj-rev mt-6 text-muted-foreground text-base lg:text-lg max-w-xl mx-auto leading-relaxed">
                Acompanhe conteúdos, projetos e estudos que conectam IA, dados, segurança pública, educação e inovação aplicada.
              </p>
              <div className="cj-rev mt-10 flex flex-wrap justify-center gap-3">
                <Link to="/conteudos" className={`t-btn-hero inline-flex items-center gap-2 px-7 py-3.5 rounded-[8px] font-semibold text-sm ${focusRing}`}>
                  Acompanhar conteúdos
                  <ArrowRight size={16} />
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
                  <Mail size={16} />
                  Falar com a Tropa
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
