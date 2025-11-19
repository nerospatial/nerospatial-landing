"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const count = 12000; // Significantly increased for density
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Ring Distribution
      const innerRadius = 6.0;
      const outerRadius = 16.0; // Slightly wider
      
      const r = innerRadius + Math.random() * (outerRadius - innerRadius);
      const theta = Math.random() * 2 * Math.PI;
      
      // More vertical spread for a thicker, more 3D ring
      const y = (Math.random() - 0.5) * 2.0; 
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    // Constant Rotation
    ref.current.rotation.y += 0.0015; 
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.06} // Increased size for better visibility
        sizeAttenuation={true}
        depthWrite={false}
        opacity={1.0} // Max opacity
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function AntiGravityBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <Canvas camera={{ position: [0, 4, 16], fov: 45 }}>
        <fog attach="fog" args={['black', 10, 35]} />
        {/* Tilted on X for view angle, and Z for the requested diagonal tilt */}
        <group rotation={[0.55, 0, 0.2]}> 
          <Particles />
        </group>
      </Canvas>
    </div>
  );
}
