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

/** Dotted wireframe sphere built from a Points cloud on a Fibonacci lattice. */
function DottedGlobe() {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const N = 1400;
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
      ref.current.rotation.y -= delta * 0.18;
      ref.current.rotation.x -= delta * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#22d3ee"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/** Thin orbital ring — three of these tilted differently. */
function OrbitRing({
  radius,
  tilt,
  speed,
  color = "#06b6d4",
  opacity = 0.55,
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
      <torusGeometry args={[radius, 0.006, 16, 200]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Small energy nodes travelling along a ring. */
function OrbitNode({
  radius,
  tilt,
  speed,
  phase = 0,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  phase?: number;
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
          <meshBasicMaterial color="#67e8f9" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.25}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

/** Logo billboard — always faces the camera, gentle self-rotation via group. */
function FloatingLogo() {
  const texture = useLoader(TextureLoader, iconUrl);
  texture.colorSpace = SRGBColorSpace;

  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.06;
  });

  return (
    <Billboard follow>
      <group ref={group}>
        {/* Soft glow behind the emblem */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[1.35, 48]} />
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.18}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial
            map={texture}
            transparent
            side={DoubleSide}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Billboard>
  );
}

export function TropaLogo3D() {
  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto">
      {/* Ambient radial halo behind the canvas */}
      <div
        aria-hidden
        className="absolute inset-[-10%] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(187 96% 55% / 0.35), hsl(217 91% 60% / 0.12) 45%, transparent 70%)",
        }}
      />
      {/* Pulsing inner ring — pure CSS */}
      <div
        aria-hidden
        className="absolute inset-[18%] rounded-full border border-primary/20 animate-pulse pointer-events-none"
      />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={1.1} />
        <pointLight position={[5, 5, 5]} intensity={1.4} color="#06b6d4" />
        <pointLight position={[-5, -3, -4]} intensity={0.9} color="#3b82f6" />

        <Suspense fallback={null}>
          {/* Logo in front, faces camera */}
          <Float speed={1.6} rotationIntensity={0} floatIntensity={1.1}>
            <FloatingLogo />
          </Float>

          {/* Wireframe dotted globe */}
          <DottedGlobe />

          {/* Orbital rings */}
          <OrbitRing radius={2.55} tilt={[Math.PI / 2.2, 0, 0]} speed={0.25} opacity={0.6} />
          <OrbitRing radius={2.75} tilt={[Math.PI / 3, Math.PI / 4, 0]} speed={-0.18} color="#3b82f6" opacity={0.4} />
          <OrbitRing radius={2.95} tilt={[Math.PI / 2, Math.PI / 3, Math.PI / 6]} speed={0.14} opacity={0.35} />

          {/* Energy nodes */}
          <OrbitNode radius={2.55} tilt={[Math.PI / 2.2, 0, 0]} speed={0.6} />
          <OrbitNode radius={2.75} tilt={[Math.PI / 3, Math.PI / 4, 0]} speed={-0.45} phase={2.1} />
          <OrbitNode radius={2.95} tilt={[Math.PI / 2, Math.PI / 3, Math.PI / 6]} speed={0.35} phase={4.2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
