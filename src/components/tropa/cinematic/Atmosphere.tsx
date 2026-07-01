/**
 * Camadas atmosféricas cinematográficas da home.
 * Arte vetorial autoral (blueprint/outline/silhueta) — puramente decorativa.
 * Todos os containers são aria-hidden e pointer-events-none.
 * As classes .atm-* são alvos da timeline GSAP em CinematicJourney.
 */
import type { CSSProperties } from "react";

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const rotorStyle: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };
const legStyle: CSSProperties = { transformBox: "fill-box", transformOrigin: "top center" };

/* ---------------- peças reutilizáveis ---------------- */

function PaperDoc({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 140 180" fill="none" className="w-full h-full">
      <rect x="1" y="1" width="138" height="178" rx="4" stroke="currentColor" strokeOpacity="0.5" />
      <line x1="14" y1="24" x2="98" y2="24" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6" />
      <line x1="14" y1="33" x2="72" y2="33" stroke="currentColor" strokeOpacity="0.35" />
      {[52, 62, 72, 82, 92, 102].map((y, i) => (
        <line key={y} x1="14" y1={y} x2={i % 2 ? 104 : 126} y2={y} stroke="currentColor" strokeOpacity="0.22" />
      ))}
      <polyline points="14,152 34,134 54,142 74,120 94,128 122,108" stroke="currentColor" strokeOpacity="0.7" fill="none" />
      <text x="14" y="170" fontSize="7.5" fill="currentColor" fillOpacity="0.55" fontFamily={MONO}>{title}</text>
    </svg>
  );
}

function NeuralNet() {
  const L1 = [30, 70, 110, 150];
  const L2 = [40, 90, 140];
  const L3 = [65, 115];
  return (
    <svg viewBox="0 0 220 185" fill="none" className="w-full h-full">
      {L1.map((a) => L2.map((b) => (
        <line key={`a${a}-${b}`} x1="30" y1={a} x2="110" y2={b} stroke="currentColor" strokeOpacity="0.16" />
      )))}
      {L2.map((a) => L3.map((b) => (
        <line key={`b${a}-${b}`} className="atm-flow" pathLength={1} style={{ strokeDasharray: "0.14 0.09" }} x1="110" y1={a} x2="190" y2={b} stroke="currentColor" strokeOpacity="0.5" />
      )))}
      {L1.map((y) => <circle key={`c${y}`} cx="30" cy={y} r="4" stroke="currentColor" strokeOpacity="0.6" />)}
      {L2.map((y) => <circle key={`d${y}`} cx="110" cy={y} r="5" stroke="currentColor" strokeOpacity="0.7" />)}
      {L3.map((y) => <circle key={`e${y}`} cx="190" cy={y} r="6" stroke="currentColor" strokeOpacity="0.8" />)}
      <text x="24" y="178" fontSize="8" fill="currentColor" fillOpacity="0.5" fontFamily={MONO}>MODELO · INFERÊNCIA</text>
    </svg>
  );
}

function Circuit() {
  return (
    <svg viewBox="0 0 200 140" fill="none" stroke="currentColor" className="w-full h-full">
      {["M10 130 h50 v-40 h40", "M10 100 h30 v-60 h60", "M190 10 v50 h-46", "M190 92 h-36 v34"].map((d, i) => (
        <path key={i} className="atm-draw" pathLength={1} d={d} strokeOpacity="0.5" />
      ))}
      {[[100, 90], [100, 40], [144, 60], [154, 126]].map(([x, y], i) => (
        <rect key={i} x={x - 3} y={y - 3} width="6" height="6" fill="currentColor" fillOpacity="0.6" stroke="none" />
      ))}
    </svg>
  );
}

function DroneRig() {
  return (
    <svg viewBox="0 0 320 150" fill="none" stroke="currentColor" className="w-full h-full">
      <rect x="128" y="60" width="64" height="26" rx="7" strokeWidth="1.4" />
      <rect x="146" y="52" width="28" height="8" rx="3" strokeOpacity="0.7" />
      <line x1="132" y1="64" x2="62" y2="48" />
      <line x1="188" y1="64" x2="258" y2="48" />
      <line x1="140" y1="60" x2="102" y2="34" strokeOpacity="0.7" />
      <line x1="180" y1="60" x2="218" y2="34" strokeOpacity="0.7" />
      <rect x="56" y="42" width="12" height="10" rx="2" />
      <rect x="252" y="42" width="12" height="10" rx="2" />
      <rect x="97" y="29" width="10" height="8" rx="2" strokeOpacity="0.7" />
      <rect x="213" y="29" width="10" height="8" rx="2" strokeOpacity="0.7" />
      <g className="atm-rotor" style={rotorStyle}><ellipse cx="62" cy="40" rx="40" ry="6" strokeOpacity="0.8" /></g>
      <g className="atm-rotor" style={rotorStyle}><ellipse cx="258" cy="40" rx="40" ry="6" strokeOpacity="0.8" /></g>
      <g className="atm-rotor" style={rotorStyle}><ellipse cx="102" cy="27" rx="30" ry="4.5" strokeOpacity="0.55" /></g>
      <g className="atm-rotor" style={rotorStyle}><ellipse cx="218" cy="27" rx="30" ry="4.5" strokeOpacity="0.55" /></g>
      <path d="M138 86 l-10 26 h18" strokeOpacity="0.8" />
      <path d="M182 86 l10 26 h-18" strokeOpacity="0.8" />
      <circle cx="160" cy="96" r="9" />
      <circle cx="160" cy="96" r="4" strokeOpacity="0.7" />
      <circle cx="62" cy="52" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="258" cy="52" r="1.8" fill="currentColor" stroke="none" />
      <text x="118" y="134" fontSize="8" fill="currentColor" fillOpacity="0.55" stroke="none" fontFamily={MONO}>UAV-01 · SENSORIAMENTO</text>
    </svg>
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
      <path d="M80 380 C 180 300, 240 340, 330 280 S 520 180, 620 220 S 800 260, 870 200" strokeOpacity="0.16" />
      <path d="M40 320 C 160 250, 260 290, 350 230 S 540 130, 660 170 S 820 210, 890 150" strokeOpacity="0.12" />
      <path d="M120 440 C 220 360, 300 400, 390 340 S 560 240, 680 280" strokeOpacity="0.12" />
      <circle cx="620" cy="220" r="60" strokeOpacity="0.14" strokeDasharray="4 8" />
      <circle cx="620" cy="220" r="110" strokeOpacity="0.09" strokeDasharray="2 10" />
      <path className="atm-mission" pathLength={1} d="M90 420 L 260 330 L 430 360 L 590 240 L 780 200" strokeOpacity="0.6" style={{ strokeDasharray: "0.02 0.014" }} strokeWidth="1.4" />
      {WPS.map((w) => (
        <g key={w.l} className="atm-wp">
          <rect x={w.x - 5} y={w.y - 5} width="10" height="10" transform={`rotate(45 ${w.x} ${w.y})`} strokeOpacity="0.8" />
          <text x={w.x + 10} y={w.y - 8} fontSize="11" fill="currentColor" fillOpacity="0.6" stroke="none" fontFamily={MONO}>{w.l}</text>
        </g>
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={60 + i * 70} y1="16" x2={60 + i * 70} y2="26" strokeOpacity="0.3" />
      ))}
    </svg>
  );
}

function RappelTeam() {
  const Fig = () => (
    <g fill="currentColor">
      <circle cx="0" cy="0" r="7" />
      <path d="M-8 8 q 8 -6 16 0 l 4 20 q -2 8 -10 8 q -10 0 -12 -8 z" />
      <path d="M-6 34 l -14 14 7 5 13 -13 z" />
      <path d="M6 36 l -4 20 8 2 5 -17 z" />
      <path d="M8 12 l 9 -14 5 3 -8 14 z" />
    </g>
  );
  return (
    <svg viewBox="0 0 220 460" fill="none" className="w-full h-full">
      <line x1="70" y1="0" x2="70" y2="460" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="1 6" />
      <line x1="150" y1="0" x2="150" y2="460" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="1 6" />
      <g transform="translate(70 120)"><g className="atm-rappel-fig"><Fig /></g></g>
      <g transform="translate(150 250)"><g className="atm-rappel-fig"><Fig /></g></g>
      <text x="40" y="444" fontSize="9" fill="currentColor" fillOpacity="0.5" fontFamily={MONO}>DESCIDA TÉCNICA · TREINO</text>
    </svg>
  );
}

function TeamSilhouettes() {
  const Fig = ({ x, s }: { x: number; s: number }) => (
    <g transform={`translate(${x} 0) scale(${s})`} fill="currentColor">
      <circle cx="34" cy="16" r="8" />
      <path d="M24 26 q 12 -6 22 2 l 6 16 -5 4 -8 -10 -1 22 -7 18 -8 -3 6 -18 -3 -16 z" />
      <path d="M30 66 l -12 20 6 4 13 -18 z" />
      <path d="M38 64 l 9 22 -7 3 -10 -20 z" />
      <rect x="18" y="28" width="8" height="16" rx="3" />
    </g>
  );
  return (
    <svg viewBox="0 0 300 110" fill="none" className="w-full h-full">
      <Fig x={0} s={1} />
      <Fig x={100} s={0.92} />
      <Fig x={196} s={1.05} />
    </svg>
  );
}

function MedicBlueprint() {
  return (
    <svg viewBox="0 0 400 260" fill="none" stroke="currentColor" className="w-full h-full">
      <path className="atm-draw" pathLength={1} d="M20 150 C 80 138, 150 136, 220 140 C 262 142, 304 146, 352 142" strokeOpacity="0.75" />
      <path className="atm-draw" pathLength={1} d="M20 196 C 80 200, 150 198, 224 192 C 266 188, 308 182, 352 178" strokeOpacity="0.75" />
      <path className="atm-draw" pathLength={1} d="M352 142 q 28 4 26 20 q -2 16 -26 16" strokeOpacity="0.7" />
      <path className="atm-draw" pathLength={1} d="M150 128 q 22 -8 44 0 l 6 74 q -26 10 -52 0 z" strokeWidth="1.6" strokeOpacity="0.9" />
      <line className="atm-draw" pathLength={1} x1="172" y1="96" x2="172" y2="130" strokeWidth="1.6" strokeOpacity="0.9" />
      <line className="atm-draw" pathLength={1} x1="148" y1="96" x2="196" y2="96" strokeWidth="2" strokeOpacity="0.9" />
      <path className="atm-draw" pathLength={1} d="M206 86 a 32 32 0 0 1 12 24" strokeDasharray="3 4" strokeOpacity="0.6" />
      <path d="M215 114 l 5 -9 -10 1 z" fill="currentColor" stroke="none" fillOpacity="0.6" />
      <path className="atm-draw" pathLength={1} d="M148 66 q 22 -14 44 -2 q 6 10 -2 16 l -32 4 q -12 -6 -10 -18 z" strokeOpacity="0.7" />
      <line x1="196" y1="152" x2="252" y2="122" strokeOpacity="0.35" />
      <text x="256" y="120" fontSize="9" fill="currentColor" fillOpacity="0.7" stroke="none" fontFamily={MONO}>banda de constrição</text>
      <line x1="176" y1="98" x2="240" y2="70" strokeOpacity="0.35" />
      <text x="244" y="68" fontSize="9" fill="currentColor" fillOpacity="0.7" stroke="none" fontFamily={MONO}>haste · rotação controlada</text>
      <line x1="120" y1="188" x2="88" y2="224" strokeOpacity="0.35" />
      <text x="20" y="238" fontSize="9" fill="currentColor" fillOpacity="0.7" stroke="none" fontFamily={MONO}>fixação · registrar hora</text>
      <text x="20" y="34" fontSize="10" fill="currentColor" fillOpacity="0.8" stroke="none" fontFamily={MONO} letterSpacing="2">MEDICINA OPERACIONAL · PROCEDIMENTO DE TREINO</text>
      <line x1="20" y1="42" x2="228" y2="42" strokeOpacity="0.3" />
    </svg>
  );
}

function MedChecklist() {
  return (
    <svg viewBox="0 0 200 220" fill="none" stroke="currentColor" className="w-full h-full">
      <rect x="1" y="1" width="198" height="218" rx="6" strokeOpacity="0.4" />
      <rect x="16" y="16" width="26" height="26" rx="6" strokeOpacity="0.7" />
      <path d="M29 22 v14 M22 29 h14" strokeWidth="2" strokeOpacity="0.8" />
      <text x="52" y="34" fontSize="10" fill="currentColor" fillOpacity="0.7" stroke="none" fontFamily={MONO}>MED · TREINO</text>
      {["posicionar", "tensionar", "fixar haste", "registrar hora"].map((t, i) => (
        <g key={t} strokeOpacity="0.6">
          <rect x="18" y={58 + i * 32} width="12" height="12" rx="2" />
          {i < 2 && <path d={`M20 ${64 + i * 32} l 3 4 6 -8`} strokeWidth="1.6" />}
          <text x="40" y={68 + i * 32} fontSize="10" fill="currentColor" fillOpacity="0.6" stroke="none" fontFamily={MONO}>{t}</text>
        </g>
      ))}
      <polyline points="16,198 40,198 48,186 56,206 64,192 84,198 184,198" strokeOpacity="0.6" />
    </svg>
  );
}

function RobotWalker() {
  return (
    <svg viewBox="0 0 280 180" fill="none" stroke="currentColor" className="w-full h-full">
      <rect x="70" y="58" width="130" height="38" rx="10" strokeWidth="1.4" />
      <rect x="196" y="64" width="26" height="20" rx="4" />
      <circle cx="216" cy="74" r="4" strokeOpacity="0.8" />
      <line x1="86" y1="56" x2="86" y2="40" strokeOpacity="0.7" />
      <rect x="80" y="32" width="12" height="8" rx="2" strokeOpacity="0.7" />
      <rect x="108" y="46" width="44" height="10" rx="3" strokeOpacity="0.7" />
      <g className="atm-leg-a" style={legStyle}><path d="M92 96 L 78 124 L 92 150" /><circle cx="93" cy="153" r="3.5" strokeOpacity="0.8" /></g>
      <g className="atm-leg-b" style={legStyle}><path d="M124 96 L 136 126 L 124 152" /><circle cx="123" cy="155" r="3.5" strokeOpacity="0.8" /></g>
      <g className="atm-leg-a" style={legStyle}><path d="M158 96 L 146 124 L 160 150" /><circle cx="161" cy="153" r="3.5" strokeOpacity="0.8" /></g>
      <g className="atm-leg-b" style={legStyle}><path d="M188 96 L 198 126 L 186 152" /><circle cx="185" cy="155" r="3.5" strokeOpacity="0.8" /></g>
      <circle cx="192" cy="66" r="2" fill="currentColor" stroke="none" />
      <text x="70" y="172" fontSize="8" fill="currentColor" fillOpacity="0.55" stroke="none" fontFamily={MONO}>UGV-02 · AUTOMAÇÃO DE CAMPO</text>
    </svg>
  );
}

function ArHud() {
  return (
    <svg viewBox="0 0 800 480" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <path d="M24 64 v-40 h40" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M776 64 v-40 h-40" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M24 416 v40 h40" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M776 416 v40 h-40" strokeOpacity="0.5" strokeWidth="1.5" />
      <line x1="330" y1="240" x2="470" y2="240" strokeOpacity="0.25" />
      <line x1="400" y1="232" x2="400" y2="248" strokeOpacity="0.35" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1={340 + i * 20} y1="236" x2={340 + i * 20} y2="244" strokeOpacity="0.2" />
      ))}
      <g className="atm-ar-panel" strokeOpacity="0.5">
        <rect x="70" y="120" width="130" height="72" rx="4" />
        <line x1="82" y1="140" x2="180" y2="140" strokeOpacity="0.5" />
        <line x1="82" y1="154" x2="156" y2="154" strokeOpacity="0.3" />
        <line x1="82" y1="168" x2="168" y2="168" strokeOpacity="0.3" />
        <text x="82" y="184" fontSize="9" fill="currentColor" fillOpacity="0.55" stroke="none" fontFamily={MONO}>AUTOMAÇÃO · ON</text>
      </g>
      <g className="atm-ar-panel" strokeOpacity="0.5">
        <rect x="600" y="300" width="130" height="64" rx="4" />
        <polyline points="612,348 630,332 648,340 666,320 684,330 716,312" strokeOpacity="0.6" />
        <text x="612" y="318" fontSize="9" fill="currentColor" fillOpacity="0.55" stroke="none" fontFamily={MONO}>EDUCAÇÃO · DADOS</text>
      </g>
    </svg>
  );
}

function TrackBox({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 120 90" fill="none" stroke="currentColor" className="w-full h-full">
      <path d="M4 22 v-18 h18" />
      <path d="M116 22 v-18 h-18" />
      <path d="M4 68 v18 h18" />
      <path d="M116 68 v18 h-18" />
      <line x1="60" y1="4" x2="60" y2="14" strokeOpacity="0.5" />
      <text x="8" y="84" fontSize="9" fill="currentColor" stroke="none" fontFamily={MONO} fillOpacity="0.85">{label}</text>
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
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none text-[hsl(199,89%,62%)]">
      <div className={`atm-paper-1 absolute top-[12%] right-[8%] w-36 lg:w-44 ${cinematic ? "opacity-0" : "opacity-25"}`}>
        <PaperDoc title="DOI 10.5281 · PREPRINT" />
      </div>
      {cinematic && (
        <div className="atm-paper-2 absolute top-[48%] right-[3%] w-32 opacity-0 blur-[2px]">
          <PaperDoc title="DATASET · v12" />
        </div>
      )}
      <div className={`atm-neural absolute bottom-[10%] right-[10%] w-56 lg:w-64 ${cinematic ? "opacity-0" : "opacity-25"}`}>
        <NeuralNet />
      </div>
      <div className={`atm-circuit absolute top-[14%] left-[4%] w-40 lg:w-52 ${cinematic ? "opacity-0" : "opacity-20"}`}>
        <Circuit />
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
      <div className={`atm-drone absolute left-1/2 top-[26%] -ml-44 w-72 lg:w-96 ${cinematic ? "opacity-0" : "opacity-20"}`}>
        <DroneRig />
      </div>
      {cinematic && (
        <div className="atm-track absolute left-1/2 top-[24%] -ml-24 w-44 h-32 opacity-0 text-[hsl(38,70%,58%)]">
          <TrackBox label="TRK-01 · UAV · LOCK" />
        </div>
      )}
    </div>
  );
}

export function AtmoField({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none text-slate-300">
      <div className={`atm-team absolute bottom-[14%] left-[6%] w-[380px] lg:w-[440px] blur-[3px] ${cinematic ? "opacity-0" : "opacity-10"}`}>
        <TeamSilhouettes />
      </div>
      <div className={`atm-rappel absolute top-0 right-2 h-[130%] w-40 lg:w-52 ${cinematic ? "opacity-0" : "opacity-15"}`}>
        <RappelTeam />
      </div>
    </div>
  );
}

export function AtmoMedic({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none text-[hsl(221,55%,32%)]">
      <div className={`atm-medic absolute top-1/2 -translate-y-1/2 left-[2%] w-[300px] lg:w-[400px] ${cinematic ? "opacity-0" : "opacity-20"}`}>
        <MedicBlueprint />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-[3%] hidden xl:block w-52 opacity-[0.14]">
        <MedChecklist />
      </div>
    </div>
  );
}

export function AtmoFuture({ cinematic }: AtmoProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none select-none text-[hsl(221,50%,35%)]">
      <div className={`atm-ar absolute inset-6 lg:inset-12 ${cinematic ? "opacity-0" : "opacity-15"}`}>
        <ArHud />
      </div>
      <div className={`atm-robot absolute bottom-[8%] left-1/2 -ml-32 w-64 lg:w-72 ${cinematic ? "opacity-0" : "opacity-15"}`}>
        <RobotWalker />
        {cinematic && (
          <div className="absolute -top-8 left-8 w-40 h-28 text-[hsl(38,70%,48%)] opacity-80">
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
