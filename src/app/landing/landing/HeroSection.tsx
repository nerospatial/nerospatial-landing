"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import SpatialBackground from "@/components/core/SpatialBackground";
import MagneticButton from "@/components/ui/MagneticButton";

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Text Reveal Animation
    const title = titleRef.current;
    if (title) {
      // Wrap each letter in a span
      title.innerHTML = title.textContent?.replace(/\S/g, "<span class='letter'>$&</span>") || "";
      
      createTimeline({ loop: false })
        .add('.letter', {
          translateY: [100, 0],
          translateZ: 0,
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 1400,
          delay: (_el: any, i: number) => 300 + 30 * i
        })
        .add(subtitleRef.current!, {
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "easeOutQuad",
          duration: 800,
        }, "-=1000")
        .add(ctaRef.current!, {
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "easeOutQuad",
          duration: 800,
        }, "-=600");
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-black text-white">
      {/* 3D Background */}
      <SpatialBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-7xl mx-auto">
        <h1 
          ref={titleRef} 
          className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase mix-blend-difference overflow-hidden"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          NeroSpatial
        </h1>
        
        <p 
          ref={subtitleRef} 
          className="mt-8 text-xl md:text-2xl font-light tracking-widest text-white/80 uppercase opacity-0"
        >
          Spatially Context Aware AI Companions
        </p>

        <div ref={ctaRef} className="mt-12 flex gap-6 opacity-0">
          <MagneticButton 
            className="px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-colors"
            strength={0.3}
          >
            Explore Vision
          </MagneticButton>
          <MagneticButton 
            className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-colors"
            strength={0.3}
          >
            Watch Demo
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-white/50" />
      </div>
    </section>
  );
}
