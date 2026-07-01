/**
 * Camadas atmosféricas cinematográficas — linguagem: holograma volumétrico,
 * bokeh/silhueta desfocada, vidro fosco, esquema técnico de precisão e HUD.
 * Nada de contorno figurativo. Containers aria-hidden + pointer-events-none.
 * Classes .atm-* são alvos da timeline GSAP em CinematicJourney.
 */
const MONO = "'JetBrains Mono', ui-monospace, monospace";

/* ---------------- peças ---------------- */

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

/** Drone como holograma volumétrico — gradientes desfocados, sem contorno. */
function HoloDrone() {
  return (
    <div className="relative w-full aspect-[3/1]">
      <div className="absolute inset-0" style={{ filter: "blur(6px)" }}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[24%] h-[44%] rounded-[45%]"
          style={{ background: "radial-gradient(ellipse at 50% 45%, hsl(199 89% 62% / 0.4), hsl(199 89% 55% / 0.12) 60%, transparent 78%)" }}
        />
        <div className="absolute left-[12%] right-[12%] top-1/2 h-[7%] -translate-y-1/2 rotate-[7deg]" style={{ background: "linear-gradient(90deg, transparent, hsl(199 89% 60% / 0.26) 18%, hsl(199 89% 60% / 0.26) 82%, transparent)" }} />
        <div className="absolute left-[12%] right-[12%] top-1/2 h-[7%] -translate-y-1/2 -rotate-[7deg]" style={{ background: "linear-gradient(90deg, transparent, hsl(199 89% 60% / 0.26) 18%, hsl(199 89% 60% / 0.26) 82%, transparent)" }} />
        {[{ l: "3%", t: "8%" }, { l: "73%", t: "8%" }, { l: "3%", t: "52%" }, { l: "73%", t: "52%" }].map((p, i) => (
          <div
            key={i}
            className="atm-rotor absolute w-[24%] aspect-square rounded-full opacity-90"
            style={{ left: p.l, top: p.t, background: "radial-gradient(circle, hsl(199 89% 66% / 0.28), hsl(199 89% 60% / 0.09) 52%, transparent 70%)" }}
          />
        ))}
      </div>
      <span className="absolute left-[15%] top-[28%] w-1 h-1 rounded-full bg-[hsl(38,80%,60%)] shadow-[0_0_8px_hsl(38_80%_60%/0.9)]" />
      <span className="absolute right-[15%] top-[28%] w-1 h-1 rounded-full bg-[hsl(199,89%,65%)] shadow-[0_0_8px_hsl(199_89%_65%/0.9)]" />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[26%] w-[46%] h-[24%] rounded-full" style={{ background: "radial-gradient(ellipse, hsl(199 89% 55% / 0.10), transparent 70%)" }} />
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

/** Forma humana distante e fora de foco — apenas bokeh, sem anatomia. */
function BokehFigure({ tone = "bg-slate-300" }: { tone?: string }) {
  return (
    <div className="relative w-10 h-16" style={{ filter: "blur(6px)" }}>
      <div className={`absolute left-1/2 -translate-x-1/2 top-0 w-5 h-5 rounded-full ${tone}/25`} />
      <div className={`absolute left-1/2 -translate-x-1/2 top-4 w-8 h-11 rounded-[45%] ${tone}/20`} />
    </div>
  );
}

function DescentLayer() {
  return (
    <div className="relative w-full h-full">
      <span className="absolute left-[30%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      <span className="absolute left-[68%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      <div className="atm-rappel-fig absolute left-[30%] -translate-x-1/2 top-[22%]"><BokehFigure /></div>
      <div className="atm-rappel-fig absolute left-[68%] -translate-x-1/2 top-[48%]"><BokehFigure /></div>
    </div>
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

/** Painel de treino de medicina operacional — vidro fosco + esquema geométrico de precisão. */
function MedTrainingPanel() {
  return (
    <div className="w-full rounded-[8px] border border-border/80 bg-white/60 backdrop-blur-md p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.28)]">
      <div className="flex items-center justify-between">
        <span className="mono text-[9.5px] uppercase tracking-[0.22em] text-[hsl(221,45%,40%)]">Medicina operacional · treino</span>
        <span className="mono text-[9.5px] tracking-[0.18em] text-[hsl(38,60%,42%)]">TQ · 14:32</span>
      </div>
      <div className="mt-5">
        <svg viewBox="0 0 300 122" fill="none" stroke="hsl(221 45% 35%)" className="w-full">
          <line className="atm-draw" pathLength={1} x1="20" y1="38" x2="280" y2="38" strokeOpacity="0.5" />
          <line className="atm-draw" pathLength={1} x1="20" y1="86" x2="280" y2="86" strokeOpacity="0.5" />
          <ellipse className="atm-draw" pathLength={1} cx="21" cy="62" rx="9" ry="24" strokeOpacity="0.3" />
          <rect className="atm-draw" pathLength={1} x="120" y="30" width="34" height="64" rx="6" strokeOpacity="0.85" strokeWidth="1.4" />
          <line className="atm-draw" pathLength={1} x1="137" y1="9" x2="137" y2="30" strokeWidth="1.4" strokeOpacity="0.85" />
          <line className="atm-draw" pathLength={1} x1="118" y1="9" x2="156" y2="9" strokeWidth="2" strokeOpacity="0.85" />
          <path className="atm-draw" pathLength={1} d="M164 7 a 26 26 0 0 1 10 18" strokeOpacity="0.45" strokeDasharray="3 4" />
          <path d="M172 28 l 4 -7 -8 1 z" fill="hsl(221 45% 35%)" stroke="none" opacity="0.45" />
          <line className="atm-draw" pathLength={1} x1="120" y1="106" x2="154" y2="106" strokeOpacity="0.4" />
          <line x1="120" y1="102" x2="120" y2="110" strokeOpacity="0.4" />
          <line x1="154" y1="102" x2="154" y2="110" strokeOpacity="0.4" />
          <text x="160" y="110" fontSize="8" fill="hsl(221 45% 40%)" stroke="none" fontFamily={MONO}>zona de aplicação</text>
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
        {["posicionamento", "tensão controlada", "fixação da haste", "registro de hora"].map((t, i) => (
          <div key={t} className="flex items-center gap-2 mono text-[9.5px] uppercase tracking-[0.14em] text-[hsl(221,30%,45%)]">
            <span className={`w-3 h-3 rounded-[3px] border ${i < 2 ? "bg-[hsl(199,89%,48%)]/15 border-[hsl(199,89%,48%)]/60" : "border-[hsl(221,30%,60%)]/50"}`} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Automação como massa industrial fora de foco — sem mascote, sem contorno. */
function IndustrialForm() {
  return (
    <div className="relative w-full aspect-[5/2]">
      <div className="absolute inset-0" style={{ filter: "blur(7px)" }}>
        <div className="absolute left-[8%] right-[22%] top-[22%] bottom-[30%] rounded-[14px]" style={{ background: "linear-gradient(165deg, hsl(222 40% 26% / 0.45), hsl(222 45% 12% / 0.6))" }} />
        <div className="absolute right-[10%] top-[30%] w-[16%] h-[26%] rounded-[8px]" style={{ background: "hsl(222 45% 16% / 0.55)" }} />
        {[18, 36, 58, 76].map((l, i) => (
          <div
            key={i}
            className="absolute w-[3.5%] top-[62%] bottom-[6%] rounded-full"
            style={{ left: `${l}%`, background: "linear-gradient(180deg, hsl(222 45% 14% / 0.55), transparent)", transform: i % 2 ? "rotate(6deg)" : "rotate(-5deg)" }}
          />
        ))}
      </div>
      <div className="absolute left-[8%] right-[22%] top-[22%] h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(199 89% 48% / 0.35), transparent)" }} />
      <span className="absolute right-[16%] top-[33%] w-1.5 h-1.5 rounded-full bg-[hsl(199,89%,48%)] shadow-[0_0_10px_hsl(199_89%_48%/0.8)]" />
      <div className="absolute left-[10%] right-[24%] -bottom-[4%] h-[14%] rounded-full" style={{ background: "radial-gradient(ellipse, hsl(222 45% 20% / 0.18), transparent 70%)" }} />
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
      <div className={`atm-paper-1 absolute top-[12%] right-[7%] w-48 lg:w-56 ${cinematic ? "opacity-0" : "opacity-40"}`}>
        <GlassDoc tag="Paper · DOI 10.5281" lines={[80, 62, 71, 48]} />
      </div>
      {cinematic && (
        <div className="atm-paper-2 absolute top-[50%] right-[2%] w-40 opacity-0" style={{ filter: "blur(2px)" }}>
          <GlassDoc tag="Dataset · v12" lines={[70, 54, 63]} />
        </div>
      )}
      <div className={`atm-neural absolute bottom-[10%] right-[12%] w-56 lg:w-64 ${cinematic ? "opacity-0" : "opacity-30"}`}>
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
      <div className={`atm-drone absolute left-1/2 top-[24%] -ml-48 w-80 lg:w-[420px] ${cinematic ? "opacity-0" : "opacity-30"}`}>
        <HoloDrone />
      </div>
      {cinematic && (
        <div className="atm-track absolute left-1/2 top-[23%] -ml-24 w-44 h-32 opacity-0 text-[hsl(38,70%,58%)]">
          <TrackBox label="TRK-01 · UAV · LOCK" />
        </div>
      )}
    </div>
  );
}

export function AtmoField({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className={`atm-team absolute bottom-[12%] left-[8%] ${cinematic ? "opacity-0" : "opacity-10"}`}>
        <BlurredTeam />
      </div>
      <div className={`atm-rappel absolute top-0 right-4 lg:right-10 h-[130%] w-36 lg:w-44 ${cinematic ? "opacity-0" : "opacity-20"}`}>
        <DescentLayer />
      </div>
      {cinematic && (
        <div className="absolute right-6 lg:right-14 top-1/2 -translate-y-1/2">
          <AltScale />
        </div>
      )}
    </div>
  );
}

export function AtmoMedic({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className={`atm-medic absolute top-1/2 -translate-y-1/2 left-[1%] w-[300px] lg:w-[380px] ${cinematic ? "opacity-0" : "opacity-40"}`}>
        <MedTrainingPanel />
      </div>
    </div>
  );
}

export function AtmoFuture({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none text-[hsl(221,50%,35%)]">
      <div className={`atm-ar absolute inset-6 lg:inset-12 ${cinematic ? "opacity-0" : "opacity-20"}`}>
        <ArFrame />
        <div className="atm-ar-panel absolute left-[6%] top-[18%] w-44 rounded-[8px] border border-border/70 bg-white/55 backdrop-blur-md p-3.5">
          <span className="mono text-[9px] uppercase tracking-[0.2em] text-[hsl(221,45%,40%)]">Automação · on</span>
          <div className="mt-2.5 space-y-1.5">
            <div className="h-[3px] w-4/5 rounded-full bg-[hsl(221,45%,40%)]/25" />
            <div className="h-[3px] w-3/5 rounded-full bg-[hsl(221,45%,40%)]/15" />
          </div>
        </div>
        <div className="atm-ar-panel absolute right-[6%] bottom-[16%] w-44 rounded-[8px] border border-border/70 bg-white/55 backdrop-blur-md p-3.5">
          <span className="mono text-[9px] uppercase tracking-[0.2em] text-[hsl(221,45%,40%)]">Educação · dados</span>
          <svg viewBox="0 0 100 26" className="mt-2 w-full">
            <polyline points="0,22 16,14 32,18 48,8 64,13 80,5 100,10" fill="none" stroke="hsl(221 45% 40% / 0.4)" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className={`atm-robot absolute bottom-[6%] left-1/2 -ml-36 w-72 lg:w-80 ${cinematic ? "opacity-0" : "opacity-25"}`}>
        <IndustrialForm />
        {cinematic && (
          <div className="absolute -top-8 left-10 w-40 h-28 text-[hsl(38,70%,48%)] opacity-80">
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
