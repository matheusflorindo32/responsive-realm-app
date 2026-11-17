import iconUrl from "@/assets/tropa-icon.png";
import type { ChapterId } from "./narrative";

export type HeroVisualProps = {
  /** Capítulo em destaque (vindo do índice do hero ou do próprio visual). */
  active: ChapterId | null;
  onHover: (id: ChapterId | null) => void;
  onSelect: (id: ChapterId) => void;
};

/**
 * Emblema estático da marca. É o visual padrão do hero e também a alternativa
 * exibida quando a cena 3D não pode rodar (sem WebGL, erro ou carregamento).
 */
export function EmblemPoster({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-700 ${dimmed ? "opacity-0" : "opacity-100"}`}>
      <svg className="absolute inset-[-8%] w-[116%] h-[116%]" viewBox="0 0 200 200" fill="none" aria-hidden>
        <circle cx="100" cy="100" r="96" stroke="hsl(221 83% 53% / 0.22)" strokeWidth="0.5" strokeDasharray="2 6" />
        <circle cx="100" cy="100" r="78" stroke="hsl(199 89% 48% / 0.28)" strokeWidth="0.5" />
        <circle cx="100" cy="22" r="2.2" fill="hsl(199 89% 48%)" />
      </svg>
      <img
        src={iconUrl}
        alt="Emblema da Tropa Científica"
        width={640}
        height={640}
        decoding="async"
        className="absolute inset-[9%] w-[82%] h-[82%] object-contain drop-shadow-[0_24px_56px_rgba(37,99,235,0.3)]"
      />
    </div>
  );
}

export function HeroVisual(_props: HeroVisualProps) {
  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[500px] mx-auto aspect-square">
      <div
        aria-hidden
        className="absolute inset-[-6%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(213 94% 68% / 0.3), transparent 66%)" }}
      />
      <EmblemPoster />
    </div>
  );
}
