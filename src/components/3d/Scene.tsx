"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, PerspectiveCamera } from "@react-three/drei";

interface SceneProps {
  children: React.ReactNode;
  className?: string;
}

export default function Scene({ children, className = "" }: SceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Suspense fallback={null}>
          {children}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
