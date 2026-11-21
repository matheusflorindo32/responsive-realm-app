/**
 * Mapa tridimensional da narrativa da home.
 *
 * Função (não é decoração): os seis vértices de um octaedro são os seis
 * capítulos da página. As arestas mostram como as áreas se conectam, um pulso
 * percorre a ordem de leitura e cada nó leva ao seu capítulo. O emblema da
 * marca fica no centro, sempre de frente para a câmera.
 *
 * Este arquivo é importado sob demanda por HeroVisual; Three.js não entra no
 * pacote inicial. Custo de renderização: ~20 malhas simples, sem sombras nem
 * pós-processamento, DPR limitado a 1,5 e laço pausado fora da tela.
 */
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { MathUtils, SRGBColorSpace, TextureLoader, Vector3, type Group, type Mesh } from "three";
import iconUrl from "@/assets/tropa-icon.png";
import { CHAPTERS, type ChapterId } from "./narrative";

const R = 1.95;
/** Vértices do octaedro na ordem dos capítulos: vizinhos na leitura são vizinhos no sólido. */
const VERTS: [number, number, number][] = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [-1, 0, 0],
  [0, -1, 0],
  [0, 0, -1],
];
const NODES = CHAPTERS.map((c, i) => ({ ...c, pos: new Vector3(...VERTS[i]).multiplyScalar(R) }));
/** Arestas do percurso de leitura (01→02→…→06→01). */
const PATH: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]];
/** Demais arestas do octaedro: conexões entre áreas fora da ordem de leitura. */
const CROSS: [number, number][] = [[0, 2], [0, 4], [1, 3], [1, 5], [2, 4], [3, 5]];

const BLUE = "#2563eb";
const CYAN = "#0ea5e9";

function segments(pairs: [number, number][]): Float32Array {
  const out: number[] = [];
  pairs.forEach(([a, b]) => out.push(...NODES[a].pos.toArray(), ...NODES[b].pos.toArray()));
  return new Float32Array(out);
}

function spokes(): Float32Array {
  const out: number[] = [];
  NODES.forEach((n) => out.push(0, 0, 0, ...n.pos.toArray()));
  return new Float32Array(out);
}

function Lines({ data, color, opacity }: { data: Float32Array; color: string; opacity: number }) {
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  );
}

/** Casca de pontos em espiral de Fibonacci: dá profundidade sem custo relevante. */
function Shell({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      arr.set([Math.cos(t) * r * 2.75, y * 2.75, Math.sin(t) * r * 2.75], i * 3);
    }
    return arr;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={BLUE} size={0.018} sizeAttenuation transparent opacity={0.28} depthWrite={false} />
    </points>
  );
}

function Emblem() {
  const texture = useLoader(TextureLoader, iconUrl);
  texture.colorSpace = SRGBColorSpace;
  return (
    <Billboard>
      <mesh renderOrder={2}>
        <planeGeometry args={[1.9, 1.9]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </Billboard>
  );
}

type NodeProps = {
  node: (typeof NODES)[number];
  active: boolean;
  animate: boolean;
  onHover: (id: ChapterId | null) => void;
  onSelect: (id: ChapterId) => void;
};

function ChapterNode({ node, active, animate, onHover, onSelect }: NodeProps) {
  const core = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  useFrame((_, dt) => {
    const k = animate ? Math.min(1, dt * 8) : 1;
    const s = active ? 1.75 : 1;
    if (core.current) core.current.scale.setScalar(MathUtils.lerp(core.current.scale.x, s, k));
    if (halo.current) halo.current.scale.setScalar(MathUtils.lerp(halo.current.scale.x, active ? 1.5 : 1, k));
  });
  const labelPos = node.pos.clone().normalize().multiplyScalar(0.42);
  return (
    <group position={node.pos}>
      <mesh ref={core}>
        <sphereGeometry args={[0.075, 20, 20]} />
        <meshBasicMaterial color={active ? CYAN : BLUE} toneMapped={false} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshBasicMaterial color={active ? CYAN : BLUE} transparent opacity={active ? 0.22 : 0.1} depthWrite={false} />
      </mesh>
      {/* Área de toque generosa (invisível) para cursor e dedo. */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(node.id);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
      >
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html center position={labelPos} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <span
          className={`mono whitespace-nowrap text-[10px] uppercase tracking-[0.18em] px-1.5 py-0.5 rounded transition-colors duration-200 ${
            active ? "bg-primary text-white" : "bg-white/80 text-[hsl(222,47%,22%)]"
          }`}
        >
          {node.n} {node.label}
        </span>
      </Html>
    </group>
  );
}

/** Pulso que percorre o caminho de leitura — o fluxo ciência → inovação. */
function Pulse() {
  const ref = useRef<Mesh>(null);
  const tmp = useMemo(() => new Vector3(), []);
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.32) % PATH.length;
    const i = Math.floor(t);
    const [a, b] = PATH[i];
    tmp.lerpVectors(NODES[a].pos, NODES[b].pos, MathUtils.smoothstep(t - i, 0, 1));
    ref.current.position.copy(tmp);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 14, 14]} />
      <meshBasicMaterial color={CYAN} toneMapped={false} />
    </mesh>
  );
}

function Scene({ active, animate, compact, onHover, onSelect }: Omit<ConstellationProps, "running" | "onReady">) {
  const group = useRef<Group>(null);
  const spin = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  const data = useMemo(() => ({ path: segments(PATH), cross: segments(CROSS), spokes: spokes() }), []);

  // Com movimento reduzido o laço é sob demanda: redesenha só quando o destaque muda.
  useEffect(() => {
    invalidate();
  }, [active, invalidate]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    if (animate) spin.current += dt * 0.11;
    const k = animate ? Math.min(1, dt * 2.5) : 1;
    // Paralaxe leve com o ponteiro; em toque o ponteiro fica em zero e só a rotação lenta atua.
    g.rotation.y = MathUtils.lerp(g.rotation.y, 0.62 + spin.current + state.pointer.x * 0.28, k);
    g.rotation.x = MathUtils.lerp(g.rotation.x, 0.42 - state.pointer.y * 0.2, k);
  });

  return (
    <group ref={group} rotation={[0.42, 0.62, 0.18]}>
      <Shell count={compact ? 360 : 720} />
      <Lines data={data.spokes} color={BLUE} opacity={0.12} />
      <Lines data={data.cross} color={BLUE} opacity={0.2} />
      <Lines data={data.path} color={BLUE} opacity={0.55} />
      {animate && <Pulse />}
      {NODES.map((n) => (
        <ChapterNode key={n.id} node={n} active={active === n.id} animate={animate} onHover={onHover} onSelect={onSelect} />
      ))}
      <Suspense fallback={null}>
        <Emblem />
      </Suspense>
    </group>
  );
}

export type ConstellationProps = {
  active: ChapterId | null;
  /** false com prefers-reduced-motion: cena estática, redesenhada só sob demanda. */
  animate: boolean;
  /** false fora da tela ou com a aba oculta: o laço de renderização para. */
  running: boolean;
  /** Menos pontos em telas pequenas. */
  compact: boolean;
  onHover: (id: ChapterId | null) => void;
  onSelect: (id: ChapterId) => void;
  onReady: () => void;
};

export default function ScienceConstellation({ running, onReady, ...scene }: ConstellationProps) {
  return (
    <Canvas
      aria-hidden
      camera={{ position: [0, 0, scene.compact ? 10 : 8.6], fov: 40 }}
      dpr={[1, 1.5]}
      frameloop={!running ? "never" : scene.animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      // A cena nunca captura a rolagem vertical da página no toque.
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = "pan-y";
        onReady();
      }}
    >
      <Scene {...scene} />
    </Canvas>
  );
}
