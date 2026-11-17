/**
 * Narrativa da página inicial — capítulos, âncoras e motion compartilhados.
 *
 * Regra de arquitetura (AGENTS.md): as seções ficam no fluxo vertical normal.
 * Nada aqui fixa cenas na tela nem sequestra a rolagem; as animações apenas
 * revelam conteúdo que já está no documento.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const CHAPTERS = [
  { n: "01", id: "ciencia", label: "Ciência", hint: "Método e evidência" },
  { n: "02", id: "pesquisa", label: "Pesquisa", hint: "Do laboratório ao campo" },
  { n: "03", id: "tecnologia", label: "Tecnologia", hint: "IA, dados e sistemas" },
  { n: "04", id: "aplicacao", label: "Aplicação", hint: "Projetos e decisões" },
  { n: "05", id: "educacao", label: "Educação", hint: "Conteúdos e formação" },
  { n: "06", id: "inovacao", label: "Inovação", hint: "Laboratório interativo" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-[8px]";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let glideFrame = 0;

/**
 * Rola até `top` com duração proporcional à distância (0,9 s a 2,6 s) e curva suave.
 * É um salto pedido pela pessoa, não um sequestro: qualquer roda, toque ou tecla o cancela
 * na hora e devolve o controle à rolagem nativa.
 */
function glideTo(top: number) {
  cancelAnimationFrame(glideFrame);
  const from = window.scrollY;
  const dist = top - from;
  if (Math.abs(dist) < 2) return;
  const duration = Math.min(2600, Math.max(900, Math.abs(dist) * 0.45));
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const t0 = performance.now();
  const stop = () => {
    cancelAnimationFrame(glideFrame);
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((e) => window.removeEventListener(e, stop));
  };
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }));
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, from + dist * ease(t));
    if (t < 1) glideFrame = requestAnimationFrame(step);
    else stop();
  };
  glideFrame = requestAnimationFrame(step);
}

/** Leva o leitor a um capítulo sem prender a rolagem; move o foco para leitores de tela. */
export function scrollToChapter(id: ChapterId) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 56; // altura da barra fixa
  if (prefersReducedMotion()) window.scrollTo(0, top);
  else glideTo(top);
  el.focus({ preventScroll: true });
  if (window.history?.replaceState) window.history.replaceState(null, "", `#${id}`);
}

/**
 * Motion da narrativa. Nada aqui fixa cenas nem altera a rolagem; só responde a ela.
 *
 * - `.rv`        bloco que entra quando ELE chega à tela (não quando o capítulo chega),
 *                para que cada parte apareça no ritmo de quem rola.
 * - `.rv-scrub`  frase que acende conforme atravessa a tela (ligada à posição da rolagem).
 * - `.rv-rule`   fio que se desenha conforme a rolagem.
 * - `.rv-depart` elemento que recua e esmaece enquanto sua seção sai de cena.
 * - `.rv-drift`  luz de fundo com paralaxe lenta.
 * - `.rv-ghost`  numeral fantasma com paralaxe (telas largas).
 *
 * Com `prefers-reduced-motion`, nada é animado e todo o conteúdo fica visível.
 */
export function useReveal(rootRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>(".rv");
      gsap.set(blocks, { autoAlpha: 0, y: 34 });
      ScrollTrigger.batch(blocks, {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>(".rv-scrub").forEach((el) => {
        gsap.fromTo(el, { opacity: 0.16, x: -18 }, { opacity: 1, x: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 90%", end: "top 48%", scrub: 0.6 } });
      });
      gsap.utils.toArray<HTMLElement>(".rv-rule").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 94%", end: "top 58%", scrub: 0.5 } });
      });
      gsap.utils.toArray<HTMLElement>(".rv-depart").forEach((el) => {
        const sec = el.closest("[data-chapter]") ?? el;
        gsap.to(el, { yPercent: 9, scale: 0.92, opacity: 0.35, ease: "none", scrollTrigger: { trigger: sec, start: "top top", end: "bottom top", scrub: 0.4 } });
      });
      gsap.utils.toArray<HTMLElement>(".rv-drift").forEach((el) => {
        gsap.fromTo(el, { yPercent: -18 }, { yPercent: 28, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>(".rv-ghost").forEach((g) => {
          gsap.fromTo(
            g,
            { yPercent: 30 },
            { yPercent: -30, ease: "none", scrollTrigger: { trigger: g.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}

/**
 * Trilho de capítulos (telas largas): mostra onde o leitor está na narrativa e permite
 * ir a qualquer capítulo. É posicionamento fixo de navegação, não uma cena fixada.
 */
export function ChapterRail() {
  const [active, setActive] = useState<ChapterId | null>(null);
  useEffect(() => {
    const triggers = CHAPTERS.map((c) => {
      const el = document.getElementById(c.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => setActive((cur) => (self.isActive ? c.id : cur === c.id ? null : cur)),
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);
  return (
    <nav
      aria-label="Progresso na narrativa"
      className={`hidden min-[1400px]:flex fixed right-5 top-1/2 z-40 -translate-y-1/2 flex-col items-end gap-3 mix-blend-difference transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {CHAPTERS.map((c) => {
        const on = active === c.id;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-current={on ? "true" : undefined}
            tabIndex={active ? 0 : -1}
            onClick={(e) => {
              e.preventDefault();
              scrollToChapter(c.id);
            }}
            className="group flex items-center gap-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded"
          >
            <span className={`mono text-[10px] uppercase tracking-[0.2em] transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100`}>
              {c.label}
            </span>
            <span className={`mono text-[10px] tabular-nums tracking-[0.18em] transition-opacity duration-300 ${on ? "opacity-100" : "opacity-45"}`}>{c.n}</span>
            <span aria-hidden className={`block h-px bg-white transition-all duration-500 ${on ? "w-8 opacity-100" : "w-3 opacity-45"}`} />
          </a>
        );
      })}
    </nav>
  );
}

/** Fio de progresso de leitura no topo. Só reflete a rolagem nativa; não a controla. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const bar = ref.current;
    if (!bar || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 pointer-events-none motion-reduce:hidden"
      style={{ background: "linear-gradient(90deg, hsl(221 83% 53%), hsl(199 89% 48%))" }}
    />
  );
}

type Tone = "light" | "dark";

/** Marca editorial do capítulo: «03 — Tecnologia». */
export function ChapterMark({ n, label, tone = "light" }: { n: string; label: string; tone?: Tone }) {
  return (
    <p
      className={`rv mono text-[11px] uppercase tracking-[0.28em] flex items-center gap-3 ${
        tone === "dark" ? "text-[hsl(199,89%,62%)]" : "text-primary"
      }`}
    >
      <span className="tabular-nums">{n}</span>
      <span aria-hidden className="inline-block w-8 h-px bg-current opacity-50" />
      {label}
    </p>
  );
}

/** Numeral fantasma: profundidade editorial, só em telas largas. */
export function Ghost({ n }: { n: string }) {
  return (
    <span
      aria-hidden
      className="rv-ghost hidden lg:block absolute top-10 right-8 mono text-[180px] font-medium leading-none text-foreground/[0.04] select-none pointer-events-none"
    >
      {n}
    </span>
  );
}

/** Capítulo: âncora navegável, foco programático e alvo das revelações. */
export function Chapter({
  id,
  tone = "light",
  className = "",
  children,
}: {
  id: ChapterId;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  const label = CHAPTERS.find((c) => c.id === id)?.label;
  return (
    <section
      id={id}
      data-chapter
      tabIndex={-1}
      aria-label={label}
      className={`relative scroll-mt-16 outline-none py-24 sm:py-28 lg:py-40 ${
        tone === "dark" ? "bg-[hsl(222_47%_7%)] text-slate-100" : "border-t border-border/70"
      } ${className}`}
    >
      {children}
    </section>
  );
}
