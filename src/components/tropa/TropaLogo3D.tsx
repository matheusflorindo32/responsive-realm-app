import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Billboard } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import {
  TextureLoader,
  DoubleSide,
  SRGBColorSpace,
  AdditiveBlending,
  type Mesh,
  type Group,
  type Points,
} from "three";
import iconUrl from "@/assets/tropa-icon.png";

/** Dotted sphere on Fibonacci lattice — subtle on light bg. */
function DottedGlobe() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const N = 1100;
    const R = 2.0;
    const arr = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      arr[i * 3] = Math.cos(theta) * radius * R;
      arr[i * 3 + 1] = y * R;
      arr[i * 3 + 2] = Math.sin(theta) * radius * R;
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.14;
      ref.current.rotation.x -= delta * 0.03;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#2563eb"
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function OrbitRing({
  radius,
  tilt,
  speed,
  color = "#60a5fa",
  opacity = 0.45,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color?: string;
  opacity?: number;
}) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.005, 16, 180]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function OrbitNode({
  radius,
  tilt,
  speed,
  phase = 0,
  color = "#2563eb",
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  phase?: number;
  color?: string;
}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    ref.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  });
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} blending={AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
}

function FloatingLogo() {
  const texture = useLoader(TextureLoader, iconUrl);
  texture.colorSpace = SRGBColorSpace;
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.05;
  });
  return (
    <Billboard follow>
      <group ref={group}>
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[1.4, 48]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.12} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <planeGeometry args={[2.05, 2.05]} />
          <meshBasicMaterial map={texture} transparent side={DoubleSide} toneMapped={false} depthWrite={false} />
        </mesh>
      </group>
    </Billboard>
  );
}

export function TropaLogo3D() {
  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto">
      <div
        aria-hidden
        className="absolute inset-[-10%] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(213 94% 68% / 0.35), hsl(199 89% 48% / 0.14) 45%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-[18%] rounded-full border border-primary/15 pointer-events-none"
      />
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={1.4} color="#60a5fa" />
        <pointLight position={[-5, -3, -4]} intensity={0.8} color="#2563eb" />
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0} floatIntensity={1}>
            <FloatingLogo />
          </Float>
          <DottedGlobe />
          <OrbitRing radius={2.55} tilt={[Math.PI / 2.2, 0, 0]} speed={0.22} opacity={0.5} />
          <OrbitRing radius={2.75} tilt={[Math.PI / 3, Math.PI / 4, 0]} speed={-0.16} color="#2563eb" opacity={0.35} />
          <OrbitRing radius={2.95} tilt={[Math.PI / 2, Math.PI / 3, Math.PI / 6]} speed={0.12} opacity={0.28} />
          <OrbitNode radius={2.55} tilt={[Math.PI / 2.2, 0, 0]} speed={0.55} />
          <OrbitNode radius={2.75} tilt={[Math.PI / 3, Math.PI / 4, 0]} speed={-0.4} phase={2.1} color="#60a5fa" />
          <OrbitNode radius={2.95} tilt={[Math.PI / 2, Math.PI / 3, Math.PI / 6]} speed={0.3} phase={4.2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
