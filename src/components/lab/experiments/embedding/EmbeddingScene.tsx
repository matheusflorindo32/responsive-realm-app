/**
 * Cena 3D do Embedding Space Explorer (React Three Fiber).
 * Importada sob demanda por EmbeddingExplorer. Só desenha: toda a matemática
 * vem pronta por props, calculada em src/lib/lab/embedding.ts.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, type Mesh } from "three";

export type ScenePoint = { id: number; term: string; color: string; pos: [number, number, number] };

export type EmbeddingSceneProps = {
  points: ScenePoint[];
  a: number | null;
  b: number | null;
  hover: number | null;
  /** Vizinhos verdadeiros de A (cosseno, espaço original). */
  neighbors: number[];
  autoRotate: boolean;
  wheelZoom: boolean;
  distance: number;
  animate: boolean;
  onPick: (id: number) => void;
  onHover: (id: number | null) => void;
  onReady: () => void;
};

const AXES: { to: [number, number, number]; label: string }[] = [
  { to: [2.9, 0, 0], label: "eixo 1" },
  { to: [0, 2.9, 0], label: "eixo 2" },
  { to: [0, 0, 2.9], label: "eixo 3" },
];

function Axes() {
  const data = useMemo(() => new Float32Array(AXES.flatMap((x) => [-x.to[0], -x.to[1], -x.to[2], ...x.to])), []);
  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#94a3b8" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
      {AXES.map((x) => (
        <Html key={x.label} center position={x.to} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
          <span className="mono whitespace-nowrap text-[9px] uppercase tracking-[0.18em] text-slate-500">{x.label}</span>
        </Html>
      ))}
    </group>
  );
}

function Links({ from, to }: { from: [number, number, number]; to: [number, number, number][] }) {
  const data = useMemo(() => new Float32Array(to.flatMap((t) => [...from, ...t])), [from, to]);
  if (!to.length) return null;
  return (
    <lineSegments key={data.join(",")}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#e2e8f0" transparent opacity={0.55} depthWrite={false} />
    </lineSegments>
  );
}

type DotProps = {
  p: ScenePoint;
  role: "a" | "b" | "neighbor" | "dim" | "idle";
  hovered: boolean;
  animate: boolean;
  onPick: (id: number) => void;
  onHover: (id: number | null) => void;
};

function Dot({ p, role, hovered, animate, onPick, onHover }: DotProps) {
  const ref = useRef<Mesh>(null);
  const scale = role === "a" ? 1.9 : role === "b" ? 1.7 : role === "neighbor" ? 1.3 : hovered ? 1.4 : 1;
  useFrame((_, dt) => {
    if (!ref.current) return;
    const k = animate ? Math.min(1, dt * 10) : 1;
    ref.current.scale.setScalar(MathUtils.lerp(ref.current.scale.x, scale, k));
  });
  const labeled = role === "a" || role === "b" || role === "neighbor" || hovered;
  return (
    <group position={p.pos}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.062, 18, 18]} />
        <meshBasicMaterial color={p.color} transparent opacity={role === "dim" ? 0.28 : 1} toneMapped={false} />
      </mesh>
      {(role === "a" || role === "b") && (
        <mesh>
          <sphereGeometry args={[0.17, 18, 18]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.16} depthWrite={false} />
        </mesh>
      )}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(p.id);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPick(p.id);
        }}
      >
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {labeled && (
        <Html center position={[0, 0.24, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <span
            className={`whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium ${
              role === "a" ? "bg-white text-slate-900" : role === "b" ? "bg-[hsl(38,92%,60%)] text-slate-900" : "bg-slate-900/85 text-slate-100 ring-1 ring-white/15"
            }`}
          >
            {role === "a" ? "A · " : role === "b" ? "B · " : ""}
            {p.term}
          </span>
        </Html>
      )}
    </group>
  );
}

function Rig({ distance, autoRotate, wheelZoom, animate }: Pick<EmbeddingSceneProps, "distance" | "autoRotate" | "wheelZoom" | "animate">) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  // Os botões de zoom mudam só a distância; a direção escolhida pela pessoa é mantida.
  useEffect(() => {
    camera.position.setLength(distance);
    invalidate();
  }, [camera, distance, invalidate]);
  // OrbitControls marca o elemento com touch-action: none, o que impede rolar a página
  // quando o dedo começa sobre o palco. Por padrão devolvemos a rolagem vertical ao
  // navegador (arrasto horizontal continua girando a nuvem); só quem liga o zoom por
  // pinça entrega todos os gestos à cena. Este efeito roda depois do efeito do filho.
  const target = useThree((s) => (s.events.connected as HTMLElement | undefined) ?? s.gl.domElement);
  useEffect(() => {
    const touch = wheelZoom ? "none" : "pan-y";
    target.style.touchAction = touch;
    gl.domElement.style.touchAction = touch;
  }, [target, gl, wheelZoom]);
  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableZoom={wheelZoom}
      enableDamping={animate}
      autoRotate={autoRotate && animate}
      autoRotateSpeed={0.55}
      minDistance={3.5}
      maxDistance={13}
    />
  );
}

export default function EmbeddingScene({ points, a, b, hover, neighbors, autoRotate, wheelZoom, distance, animate, onPick, onHover, onReady }: EmbeddingSceneProps) {
  const near = useMemo(() => new Set(neighbors), [neighbors]);
  const from = a !== null ? points[a].pos : null;
  const to = useMemo(() => neighbors.map((i) => points[i].pos), [neighbors, points]);
  return (
    <Canvas
      aria-hidden
      camera={{ position: [4.6, 3.1, 5.4], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      onCreated={onReady}
      onPointerMissed={() => onHover(null)}
    >
      <Rig distance={distance} autoRotate={autoRotate} wheelZoom={wheelZoom} animate={animate} />
      <Axes />
      {from && <Links from={from} to={to} />}
      {points.map((p) => {
        const role = p.id === a ? "a" : p.id === b ? "b" : near.has(p.id) ? "neighbor" : a !== null ? "dim" : "idle";
        return <Dot key={p.id} p={p} role={role} hovered={hover === p.id} animate={animate} onPick={onPick} onHover={onHover} />;
      })}
    </Canvas>
  );
}
