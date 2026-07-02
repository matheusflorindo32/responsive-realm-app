/**
 * Camadas atmosféricas cinematográficas — footage real tratado.
 * Fotografia royalty-free (Unsplash/Pexels) com grading frio navy/ciano,
 * grain de filme, máscaras esfumadas, vidro fosco e HUD nítido.
 * Containers aria-hidden + pointer-events-none. Classes .atm-* = alvos GSAP.
 */
import type { CSSProperties } from "react";

const MONO = "'JetBrains Mono', ui-monospace, monospace";

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E";

const IMG = {
  datacenter: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=70",
  drone: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Romanian_DJI_Matrice_300%2C_Eastern_Phoenix_2026_exercise.jpg/1280px-Romanian_DJI_Matrice_300%2C_Eastern_Phoenix_2026_exercise.jpg",
  heliRapel: "https://images.unsplash.com/photo-1763656444141-e011b6c1f81f?auto=format&fit=crop&w=1100&q=70",
  heliFundo: "https://images.unsplash.com/photo-1694931458368-33f1e05c06db?auto=format&fit=crop&w=1000&q=65",
  medTreino: "https://images.pexels.com/photos/34104787/pexels-photo-34104787/free-photo-of-cpr-training-demonstration-on-mannequin.jpeg?auto=compress&cs=tinysrgb&w=1100",
  tq: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Combat_lifesaver_class_not_just_for_combat_130704-M-UY543-109.jpg/1280px-Combat_lifesaver_class_not_just_for_combat_130704-M-UY543-109.jpg",
  robo: "https://images.unsplash.com/photo-1778689015315-46cd9cde1419?auto=format&fit=crop&w=1400&q=70",
  arOperador: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1100&q=70",
} as const;

/* ---------------- footage tratado ---------------- */

type FootageProps = {
  src: string;
  mask?: "radial" | "left" | "right" | "bottom" | "none";
  blur?: number;
  grade?: number;
  pos?: string;
  className?: string;
};

function Footage({ src, mask = "radial", blur = 0, grade = 0.45, pos, className = "" }: FootageProps) {
  const masks: Record<string, string | undefined> = {
    radial: "radial-gradient(ellipse 68% 62% at 50% 50%, black 36%, transparent 74%)",
    left: "linear-gradient(90deg, black 42%, transparent 96%)",
    right: "linear-gradient(270deg, black 42%, transparent 96%)",
    bottom: "linear-gradient(0deg, black 40%, transparent 95%)",
    none: undefined,
  };
  const m = masks[mask];
  const style: CSSProperties = m ? { maskImage: m, WebkitMaskImage: m } : {};
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        style={{ objectPosition: pos, filter: `saturate(0.55) contrast(1.1) brightness(0.78)${blur ? ` blur(${blur}px)` : ""}` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, hsla(222, 60%, 18%, ${0.3 + grade * 0.4}), hsla(199, 80%, 35%, 0.16))`,
          mixBlendMode: "multiply",
        }}
      />
      <div className="absolute inset-0" style={{ background: "hsl(199 89% 55% / 0.07)", mixBlendMode: "color" }} />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.09]"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "160px 160px" }}
      />
    </div>
  );
}

function FootagePanel({ src, tag, sub, className = "" }: { src: string; tag: string; sub: string; className?: string }) {
  return (
    <div className={`rounded-[8px] border border-border/70 bg-white/55 backdrop-blur-md p-2.5 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] ${className}`}>
      <Footage src={src} mask="none" grade={0.3} className="rounded-[6px] aspect-[4/3]" />
      <div className="flex items-center justify-between px-1.5 pt-2 pb-1">
        <span className="mono text-[9px] uppercase tracking-[0.2em] text-[hsl(221,45%,40%)]">{tag}</span>
        <span className="mono text-[9px] tracking-[0.16em] text-[hsl(38,60%,42%)]">{sub}</span>
      </div>
    </div>
  );
}


/* ---------------- HUD e instrumentos ---------------- */

function GlassDoc({ tag, lines }: { tag: string; lines: number[] }) {
  return (
    <div className="w-full rounded-[8px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-4 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.65)]">
      <div className="flex items-center justify-between">
        <span className="mono text-[9px] uppercase tracking-[0.2em] text-white/45">{tag}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(199,89%,55%)]/80" />
      </div>
      <div className="mt-3 space-y-2">
        {lines.map((w, i) => (
          <div key={i} className="h-[3px] rounded-full bg-gradient-to-r from-white/25 to-white/5" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-4 h-9 rounded-[4px] relative overflow-hidden" style={{ background: "linear-gradient(60deg, hsl(221 83% 53% / 0.14), hsl(199 89% 48% / 0.05))" }}>
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <polyline points="0,20 15,14 30,17 45,9 60,12 75,6 100,10" fill="none" stroke="hsl(199 89% 60% / 0.5)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

function Constellation() {
  const N: [number, number][] = [[20, 30], [15, 90], [30, 150], [95, 55], [100, 120], [175, 40], [182, 100], [170, 155]];
  const E: [number, number][] = [[0, 3], [1, 3], [1, 4], [2, 4], [3, 5], [3, 6], [4, 6], [4, 7]];
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full" fill="none">
      {E.map(([a, b], i) => (
        <line key={i} className="atm-flow" pathLength={1} style={{ strokeDasharray: "0.16 0.08" }} x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} stroke="hsl(199 89% 60%)" strokeOpacity="0.28" strokeWidth="0.8" />
      ))}
      {N.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="hsl(199 89% 60%)" opacity="0.10" />
          <circle cx={x} cy={y} r="1.8" fill="hsl(199 89% 70%)" opacity="0.65" />
        </g>
      ))}
    </svg>
  );
}

function SpectrumBars() {
  const H = [34, 58, 42, 70, 50, 64, 38, 76, 46, 60, 52, 68];
  return (
    <div className="atm-bars flex items-end gap-[6px] h-20">
      {H.map((h, i) => (
        <span key={i} className="atm-bar w-[3px] rounded-full" style={{ height: `${h}%`, background: "linear-gradient(180deg, hsl(199 89% 60% / 0.5), hsl(221 83% 53% / 0.06))" }} />
      ))}
    </div>
  );
}

function TacMap() {
  const WPS = [
    { x: 90, y: 420, l: "WP-0" },
    { x: 260, y: 330, l: "WP-1" },
    { x: 430, y: 360, l: "WP-2" },
    { x: 590, y: 240, l: "WP-3" },
    { x: 780, y: 200, l: "LZ" },
  ];
  return (
    <svg viewBox="0 0 900 500" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <path d="M80 380 C 180 300, 240 340, 330 280 S 520 180, 620 220 S 800 260, 870 200" strokeOpacity="0.14" />
      <path d="M40 320 C 160 250, 260 290, 350 230 S 540 130, 660 170 S 820 210, 890 150" strokeOpacity="0.10" />
      <path d="M120 440 C 220 360, 300 400, 390 340 S 560 240, 680 280" strokeOpacity="0.10" />
      <circle cx="620" cy="220" r="60" strokeOpacity="0.12" strokeDasharray="4 8" />
      <circle cx="620" cy="220" r="110" strokeOpacity="0.08" strokeDasharray="2 10" />
      <path className="atm-mission" pathLength={1} d="M90 420 L 260 330 L 430 360 L 590 240 L 780 200" strokeOpacity="0.5" style={{ strokeDasharray: "0.02 0.014" }} strokeWidth="1.2" />
      {WPS.map((w) => (
        <g key={w.l} className="atm-wp">
          <rect x={w.x - 4} y={w.y - 4} width="8" height="8" transform={`rotate(45 ${w.x} ${w.y})`} strokeOpacity="0.7" />
          <text x={w.x + 9} y={w.y - 7} fontSize="10" fill="currentColor" fillOpacity="0.5" stroke="none" fontFamily={MONO}>{w.l}</text>
        </g>
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={60 + i * 70} y1="16" x2={60 + i * 70} y2="24" strokeOpacity="0.25" />
      ))}
    </svg>
  );
}

function BlurredTeam() {
  return (
    <div className="flex items-end gap-12" style={{ filter: "blur(9px)" }}>
      {[0.9, 1, 0.85].map((s, i) => (
        <div key={i} style={{ transform: `scale(${s})` }} className="relative w-12 h-24">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-6 rounded-full bg-slate-300/20" />
          <div className="absolute left-1/2 -translate-x-1/2 top-5 w-10 h-16 rounded-[40%] bg-slate-300/[0.17]" />
        </div>
      ))}
    </div>
  );
}

function AltScale() {
  return (
    <div className="atm-alt flex flex-col items-end gap-6 mono text-[9px] tracking-[0.14em] text-slate-500">
      {["-04.0 m", "-08.0 m", "-12.0 m", "-16.0 m", "-20.0 m"].map((v) => (
        <div key={v} className="flex items-center gap-2">
          <span>{v}</span>
          <span className="w-4 h-px bg-white/20" />
        </div>
      ))}
    </div>
  );
}

/* ---------------- card de torniquete (foto real + HUD + microcopy) ---------------- */

function MedTQCard() {
  return (
    <div className="w-full rounded-[8px] border border-border/80 bg-white/60 backdrop-blur-md p-2.5 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.28)]">
      <div className="relative rounded-[6px] overflow-hidden aspect-[4/3]">
        <Footage src={IMG.tq} mask="none" grade={0.35} pos="30% 38%" className="absolute inset-0" />
        <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-[hsl(199,89%,65%)]" fill="none" stroke="currentColor" strokeWidth="0.45">
          <path d="M5 12 v-7 h7" strokeOpacity="0.8" />
          <path d="M95 12 v-7 h-7" strokeOpacity="0.8" />
          <path d="M5 63 v7 h7" strokeOpacity="0.8" />
          <path d="M95 63 v7 h-7" strokeOpacity="0.8" />
          <circle cx="52" cy="38" r="9" strokeOpacity="0.65" />
          <line x1="61" y1="38" x2="74" y2="30" strokeOpacity="0.5" />
          <line x1="30" y1="38" x2="43" y2="38" strokeOpacity="0.5" strokeDasharray="2 2" />
        </svg>
        <span className="absolute right-2 top-2 mono text-[8px] tracking-[0.14em] text-[hsl(38,80%,70%)] bg-[hsl(222,47%,10%)]/55 rounded-[4px] px-1.5 py-0.5 backdrop-blur-sm">5–7 cm</span>
        <span className="absolute left-2 bottom-2 mono text-[8.5px] uppercase tracking-[0.18em] text-white/90 bg-[hsl(222,47%,10%)]/55 rounded-[4px] px-2 py-1 backdrop-blur-sm">
          Torniquete de extremidade
        </span>
      </div>
      <div className="px-1.5 pt-2.5 pb-1 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {["5–7 cm acima da lesão", "Evitar articulação", "Entre a lesão e o tronco", "Registrar horário"].map((t) => (
          <span key={t} className="mono text-[8.5px] uppercase tracking-[0.12em] text-[hsl(221,30%,42%)] flex items-center gap-1.5">
            <i className="w-1 h-1 rounded-full bg-[hsl(38,60%,48%)] shrink-0" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function TrackBox({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
      <path d="M4 22 v-18 h18" />
      <path d="M116 22 v-18 h-18" />
      <path d="M4 68 v18 h18" />
      <path d="M116 68 v18 h-18" />
      <line x1="60" y1="4" x2="60" y2="12" strokeOpacity="0.5" />
      <text x="8" y="84" fontSize="8.5" fill="currentColor" stroke="none" fontFamily={MONO} fillOpacity="0.85">{label}</text>
    </svg>
  );
}

function ArFrame() {
  return (
    <svg viewBox="0 0 800 480" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <path d="M24 64 v-40 h40" strokeOpacity="0.4" strokeWidth="1.2" />
      <path d="M776 64 v-40 h-40" strokeOpacity="0.4" strokeWidth="1.2" />
      <path d="M24 416 v40 h40" strokeOpacity="0.4" strokeWidth="1.2" />
      <path d="M776 416 v40 h-40" strokeOpacity="0.4" strokeWidth="1.2" />
      <line x1="330" y1="240" x2="470" y2="240" strokeOpacity="0.2" />
      <line x1="400" y1="232" x2="400" y2="248" strokeOpacity="0.3" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1={340 + i * 20} y1="236" x2={340 + i * 20} y2="244" strokeOpacity="0.15" />
      ))}
    </svg>
  );
}

/* ---------------- camadas por cena ---------------- */

type AtmoProps = { cinematic: boolean };

export function AtmoEntry({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {cinematic && <div className="atm-scan absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />}
      <div className={`atm-datacol absolute left-6 xl:left-10 bottom-20 hidden lg:flex flex-col gap-2 mono text-[10px] tracking-[0.18em] text-muted-foreground ${cinematic ? "opacity-0" : "opacity-40"}`}>
        {["SYS · TROPA-CORE v2.6", "LAT -20.3155 · LON -40.3128", "UPLINK 99.2% · 41 ms", "MODELO v4.2 · EVAL 0.87", "SENSOR ARRAY · OK"].map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function AtmoResearch({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className={`atm-dc absolute right-[-4%] top-[10%] w-[420px] lg:w-[540px] ${cinematic ? "opacity-0" : "opacity-30"}`}>
        <Footage src={IMG.datacenter} mask="radial" className="aspect-[16/10]" />
      </div>
      <div className={`atm-paper-1 absolute top-[58%] right-[7%] w-44 lg:w-52 ${cinematic ? "opacity-0" : "opacity-40"}`}>
        <GlassDoc tag="Paper · DOI 10.5281" lines={[80, 62, 71, 48]} />
      </div>
      <div className={`atm-neural absolute bottom-[8%] right-[30%] w-52 lg:w-60 hidden lg:block ${cinematic ? "opacity-0" : "opacity-30"}`}>
        <Constellation />
      </div>
      <div className={`absolute top-[16%] left-[4%] ${cinematic ? "" : "opacity-30"}`}>
        <SpectrumBars />
      </div>
    </div>
  );
}

export function AtmoOps({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none text-[hsl(199,89%,62%)]">
      <div className={`atm-map absolute inset-x-0 bottom-0 h-[72%] ${cinematic ? "opacity-0" : "opacity-15"}`}>
        <TacMap />
      </div>
      <div className={`atm-drone absolute left-1/2 top-[22%] -ml-[300px] w-[480px] lg:w-[640px] ${cinematic ? "opacity-0" : "opacity-45"}`}>
        <Footage src={IMG.drone} mask="radial" grade={0.7} className="aspect-[16/10]" />
      </div>
      {cinematic && (
        <div className="atm-track absolute left-1/2 top-[26%] -ml-28 w-52 h-36 opacity-0 text-[hsl(38,70%,58%)]">
          <TrackBox label="TRK-01 · UAV · LOCK" />
        </div>
      )}
    </div>
  );
}

export function AtmoField({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className={`atm-heli2 absolute left-[2%] top-[6%] w-[280px] hidden lg:block ${cinematic ? "opacity-0" : "opacity-20"}`}>
        <Footage src={IMG.heliFundo} mask="radial" blur={2} className="aspect-[16/10]" />
      </div>
      <div className={`atm-rappel absolute right-0 lg:right-[1%] top-[4%] w-[280px] lg:w-[360px] ${cinematic ? "opacity-0" : "opacity-30"}`}>
        <Footage src={IMG.heliRapel} mask="radial" className="aspect-[3/4]" />
      </div>
      <div className={`atm-team absolute bottom-[12%] left-[8%] ${cinematic ? "opacity-0" : "opacity-10"}`}>
        <BlurredTeam />
      </div>
      {cinematic && (
        <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2">
          <AltScale />
        </div>
      )}
    </div>
  );
}

export function AtmoMedic({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className={`atm-medic absolute top-1/2 -translate-y-1/2 left-[2%] w-[260px] lg:w-[320px] ${cinematic ? "opacity-0" : "opacity-40"}`}>
        <FootagePanel src={IMG.medTreino} tag="Medicina operacional" sub="Treino · RCP" />
      </div>
      <div className={`atm-medb absolute top-1/2 -translate-y-1/2 right-[2%] w-[280px] lg:w-[320px] hidden xl:block ${cinematic ? "opacity-0" : "opacity-40"}`}>
        <MedTQCard />
      </div>
    </div>
  );
}

export function AtmoFuture({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none text-[hsl(221,50%,35%)]">
      <div className={`atm-ar absolute inset-6 lg:inset-12 ${cinematic ? "opacity-0" : "opacity-20"}`}>
        <ArFrame />
      </div>
      <div className={`atm-arop absolute right-[2%] top-[10%] w-44 lg:w-52 ${cinematic ? "opacity-0" : "opacity-35"}`}>
        <FootagePanel src={IMG.arOperador} tag="Realidade aumentada" sub="HUD · ativo" />
      </div>
      <div className={`atm-robot absolute bottom-[2%] left-1/2 -ml-56 w-[420px] lg:w-[500px] ${cinematic ? "opacity-0" : "opacity-30"}`}>
        <Footage src={IMG.robo} mask="radial" className="aspect-[16/9]" />
        {cinematic && (
          <div className="absolute top-[18%] left-[14%] w-36 h-24 text-[hsl(38,70%,48%)] opacity-90">
            <TrackBox label="UGV-02 · AUTO" />
          </div>
        )}
      </div>
      {cinematic && (
        <div className="atm-glass absolute right-[5%] top-1/2 -translate-y-1/2 h-[62%] w-36 lg:w-44 rounded-[8px] border border-border bg-white/40 backdrop-blur-md hidden lg:block" />
      )}
    </div>
  );
}
