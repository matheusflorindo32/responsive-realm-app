import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { TextureLoader, type Mesh, type Group, DoubleSide, SRGBColorSpace } from "three";
import iconUrl from "@/assets/tropa-icon.png";

function GlobeShell() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.15;
      ref.current.rotation.x -= delta * 0.03;
    }
  });
  return (
    <Sphere ref={ref} args={[2, 32, 20]}>
      <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.3} />
    </Sphere>
  );
}

function FloatingLogo() {
  const texture = useLoader(TextureLoader, iconUrl);
  texture.colorSpace = SRGBColorSpace;

  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.08;
    }
  });

  const size = 2.2; // ~55% of globe diameter (4)
  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          map={texture}
          transparent
          side={DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function TropaLogo3D() {
  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto overflow-visible">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(187 96% 55% / 0.45), transparent 65%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[4, 4, 4]} intensity={1.4} color="#06b6d4" />
        <pointLight position={[-4, -2, -3]} intensity={0.8} color="#3b82f6" />
        <Suspense fallback={null}>
          <Float speed={1.6} rotationIntensity={0} floatIntensity={1.1}>
            <FloatingLogo />
          </Float>
          <GlobeShell />
        </Suspense>
      </Canvas>
    </div>
  );
}
