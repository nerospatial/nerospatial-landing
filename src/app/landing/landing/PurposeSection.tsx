"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AntiGravityBackground from "@/components/core/AntiGravityBackground";

gsap.registerPlugin(ScrollTrigger);

export default function PurposeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const text = textRef.current;
    
    if (!container || !content || !text) return;

    // Split text for animation (simple word split)
    const words = text.innerText.split(" ");
    text.innerHTML = words.map(word => `<span class="word inline-block opacity-0 translate-y-10 filter blur-sm mr-[0.2em]">${word}</span>`).join(" ");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.to(content, {
      opacity: 1,
      duration: 0.5,
    })
    .to(".word", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.1,
      duration: 2,
      ease: "power4.out",
    })
    .to(content, {
      scale: 0.9,
      opacity: 0,
      filter: "blur(10px)",
      duration: 1,
      delay: 1,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Anti-Gravity Background */}
      <div className="absolute inset-0 opacity-80">
        <AntiGravityBackground />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-6xl px-6 text-center opacity-0">
        <h2 
          ref={textRef}
          className="text-4xl md:text-7xl font-black leading-tight tracking-tight uppercase"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          We believe technology should understand you, not just compute for you.
        </h2>
        
        <div className="mt-12 flex flex-col gap-6 items-center">
          <div className="w-px h-24 bg-gradient-to-b from-white to-transparent opacity-50" />
          <p className="text-sm md:text-base font-mono text-white/60 uppercase tracking-widest">
            The New Standard of Interaction
          </p>
        </div>
      </div>
    </section>
  );
}
