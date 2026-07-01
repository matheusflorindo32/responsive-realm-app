import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { TextureLoader, type Mesh, DoubleSide } from "three";
import logoAsset from "@/assets/tropa-logo.png.asset.json";

function GlobeShell() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
      ref.current.rotation.x += delta * 0.05;
    }
  });
  return (
    <Sphere ref={ref} args={[1.9, 48, 48]}>
      <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.35} />
    </Sphere>
  );
}

function InnerGlow() {
  return (
    <Sphere args={[1.85, 32, 32]}>
      <meshBasicMaterial color="#0ea5e9" transparent opacity={0.06} />
    </Sphere>
  );
}

function FloatingLogo() {
  const texture = useLoader(TextureLoader, logoAsset.url);
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });
  return (
    <mesh ref={ref}>
      <planeGeometry args={[2.2, 2.2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

export function TropaLogo3D() {
  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(187 96% 55% / 0.4), transparent 65%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={1} />
        <pointLight position={[4, 4, 4]} intensity={1.4} color="#06b6d4" />
        <pointLight position={[-4, -2, -3]} intensity={0.8} color="#3b82f6" />
        <Suspense fallback={null}>
          <GlobeShell />
          <InnerGlow />
          <Float speed={2} rotationIntensity={0.4} floatIntensity={1.4}>
            <FloatingLogo />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
