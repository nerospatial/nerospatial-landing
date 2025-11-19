"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Particles(props: any) {
  const ref = useRef<THREE.Points>(null);
  const [data, setData] = useState<{ positions: Float32Array; colors: Float32Array } | null>(null);

  useEffect(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Spatial distribution
      const r = Math.random() * 10;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color gradient based on position
      color.setHSL(0.6 + (x / 20), 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData({ positions, colors });
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    
    // Rotate the entire cloud
    ref.current.rotation.x = state.clock.getElapsedTime() / 10;
    ref.current.rotation.y = state.clock.getElapsedTime() / 15;

    // Mouse interaction (subtle parallax)
    const { mouse } = state;
    ref.current.rotation.x += (mouse.y * 0.1 - ref.current.rotation.x) * 0.1;
    ref.current.rotation.y += (mouse.x * 0.1 - ref.current.rotation.y) * 0.1;
  });

  if (!data) return null;

  return (
    <Points ref={ref} positions={data.positions} colors={data.colors} stride={3} frustumCulled={false} {...props}>
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function SpatialBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={['black', 5, 15]} />
        <Particles />
      </Canvas>
    </div>
  );
}
