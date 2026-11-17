import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import iconUrl from "@/assets/tropa-icon.png";
import { prefersReducedMotion, type ChapterId } from "./narrative";

// Three.js + React Three Fiber só são baixados quando o hero decide montar a cena.
const ScienceConstellation = lazy(() => import("./ScienceConstellation"));

export type HeroVisualProps = {
  /** Capítulo em destaque (vindo do índice do hero ou da própria cena). */
  active: ChapterId | null;
  onHover: (id: ChapterId | null) => void;
  onSelect: (id: ChapterId) => void;
};

/**
 * Emblema estático da marca. Aparece de imediato e continua sendo o visual do
 * hero quando a cena 3D não pode rodar (sem WebGL, erro ou ainda carregando).
 */
function EmblemPoster({ hidden }: { hidden: boolean }) {
  return (
    <div aria-hidden={hidden} className={`absolute inset-0 transition-opacity duration-700 ${hidden ? "opacity-0" : "opacity-100"}`}>
      <svg className="absolute inset-[-8%] w-[116%] h-[116%]" viewBox="0 0 200 200" fill="none" aria-hidden>
        <circle cx="100" cy="100" r="96" stroke="hsl(221 83% 53% / 0.22)" strokeWidth="0.5" strokeDasharray="2 6" />
        <circle cx="100" cy="100" r="78" stroke="hsl(199 89% 48% / 0.28)" strokeWidth="0.5" />
        <circle cx="100" cy="22" r="2.2" fill="hsl(199 89% 48%)" />
      </svg>
      <img
        src={iconUrl}
        alt={hidden ? "" : "Emblema da Tropa Científica"}
        width={640}
        height={640}
        decoding="async"
        className="absolute inset-[9%] w-[82%] h-[82%] object-contain drop-shadow-[0_24px_56px_rgba(37,99,235,0.3)]"
      />
    </div>
  );
}

/** Qualquer falha da cena (contexto WebGL perdido, erro de shader, rede) cai no emblema estático. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisual({ active, onHover, onSelect }: HeroVisualProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [running, setRunning] = useState(true);
  const [animate] = useState(() => !prefersReducedMotion());
  const [compact] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);

  // Monta a cena só depois que o texto do hero já foi pintado e o navegador está ocioso.
  useEffect(() => {
    if (!hasWebGL()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    if (w.requestIdleCallback) {
      const h = w.requestIdleCallback(() => setMount(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(h);
    }
    const t = window.setTimeout(() => setMount(true), 300);
    return () => window.clearTimeout(t);
  }, []);

  // Pausa o laço de renderização fora da tela ou com a aba em segundo plano.
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let onScreen = true;
    const sync = () => setRunning(onScreen && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const live = mount && !failed;
  const showScene = live && ready;

  return (
    <figure className="m-0">
      <div ref={wrap} className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[520px] mx-auto aspect-square">
        <div
          aria-hidden
          className="absolute inset-[-6%] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(213 94% 68% / 0.3), transparent 66%)" }}
        />
        <EmblemPoster hidden={showScene} />
        {live && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
            <SceneBoundary onError={() => setFailed(true)}>
              <Suspense fallback={null}>
                <ScienceConstellation
                  active={active}
                  animate={animate}
                  running={running}
                  compact={compact}
                  onHover={onHover}
                  onSelect={onSelect}
                  onReady={() => setReady(true)}
                />
              </Suspense>
            </SceneBoundary>
          </div>
        )}
      </div>
      {showScene && (
        <figcaption className="mt-3 text-center mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Mapa da narrativa · selecione um nó
        </figcaption>
      )}
    </figure>
  );
}
