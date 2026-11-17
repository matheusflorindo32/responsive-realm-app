/**
 * Narrativa da página inicial — capítulos, âncoras e motion compartilhados.
 *
 * Regra de arquitetura (AGENTS.md): as seções ficam no fluxo vertical normal.
 * Nada aqui fixa cenas na tela nem sequestra a rolagem; as animações apenas
 * revelam conteúdo que já está no documento.
 */
import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
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

/** Leva o leitor a um capítulo sem prender a rolagem; move o foco para leitores de tela. */
export function scrollToChapter(id: ChapterId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
  if (window.history?.replaceState) window.history.replaceState(null, "", `#${id}`);
}

/**
 * Revela `.rv` (blocos) e `.rv-rule` (fios) quando o capítulo entra na tela.
 * Sem pin e sem scrub de layout. Com movimento reduzido, nada é animado.
 */
export function useReveal(rootRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((sec) => {
        const st = { trigger: sec, start: "top 80%", once: true };
        const blocks = sec.querySelectorAll(".rv");
        if (blocks.length)
          gsap.from(blocks, { y: 22, autoAlpha: 0, duration: 0.75, stagger: 0.055, ease: "power3.out", scrollTrigger: st });
        const rules = sec.querySelectorAll(".rv-rule");
        if (rules.length)
          gsap.from(rules, { scaleX: 0, transformOrigin: "left center", duration: 1, stagger: 0.05, ease: "power2.out", scrollTrigger: st });
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>(".rv-ghost").forEach((g) => {
          gsap.fromTo(
            g,
            { yPercent: 18 },
            { yPercent: -18, ease: "none", scrollTrigger: { trigger: g.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
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
      className={`relative scroll-mt-16 outline-none py-20 sm:py-24 lg:py-32 ${
        tone === "dark" ? "bg-[hsl(222_47%_7%)] text-slate-100" : "border-t border-border/70"
      } ${className}`}
    >
      {children}
    </section>
  );
}
