import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { TextureLoader, type Mesh, type Group, DoubleSide, SRGBColorSpace } from "three";
import logoAsset from "@/assets/tropa-logo.png.asset.json";

function GlobeShell() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
      ref.current.rotation.x += delta * 0.04;
    }
  });
  return (
    <Sphere ref={ref} args={[2.1, 24, 18]}>
      <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.28} />
    </Sphere>
  );
}

function FloatingLogo() {
  const texture = useLoader(TextureLoader, logoAsset.url, (loader) => {
    loader.setCrossOrigin("anonymous");
  });
  texture.colorSpace = SRGBColorSpace;

  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={group}>
      {/* Front face */}
      <mesh>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial
          map={texture}
          transparent
          side={DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      {/* Cross plane for pseudo-3D effect */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial
          map={texture}
          transparent
          side={DoubleSide}
          toneMapped={false}
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
    </group>
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
            "radial-gradient(circle at 50% 50%, hsl(187 96% 55% / 0.45), transparent 65%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[4, 4, 4]} intensity={1.4} color="#06b6d4" />
        <pointLight position={[-4, -2, -3]} intensity={0.8} color="#3b82f6" />
        <Suspense fallback={null}>
          {/* Logo rendered FIRST and in front — never occluded by the globe */}
          <Float speed={2} rotationIntensity={0.3} floatIntensity={1.2}>
            <FloatingLogo />
          </Float>
          <GlobeShell />
        </Suspense>
      </Canvas>
    </div>
  );
}
