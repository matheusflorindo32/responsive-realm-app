import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Torus, TorusKnot } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Core() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.15;
      ref.current.rotation.y += delta * 0.2;
    }
  });
  return (
    <Icosahedron ref={ref} args={[1.15, 1]}>
      {/* Neon cyan distorted material */}
      <MeshDistortMaterial
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={0.6}
        distort={0.35}
        speed={2}
        roughness={0.15}
        metalness={0.8}
        wireframe
      />
    </Icosahedron>
  );
}

function Ring() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.4;
      ref.current.rotation.z -= delta * 0.2;
    }
  });
  return (
    <Torus ref={ref} args={[1.9, 0.015, 16, 128]}>
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
    </Torus>
  );
}

function Knot() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.25;
      ref.current.rotation.x += delta * 0.1;
    }
  });
  return (
    <TorusKnot ref={ref} args={[1.55, 0.008, 200, 16]}>
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.55} />
    </TorusKnot>
  );
}

export function TropaLogo3D() {
  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      {/* Neon glow backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(187 96% 55% / 0.35), transparent 65%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={1.4} color="#06b6d4" />
        <pointLight position={[-4, -2, -3]} intensity={0.8} color="#3b82f6" />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
            <Core />
            <Ring />
            <Knot />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
