"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PurposeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    
    if (!container || !text) return;

    // Pinning the section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=200%", // Pin for 200vh duration
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Animation Sequence
    // 1. Fade in title
    tl.fromTo(
      text.querySelector("h2"),
      { opacity: 0, y: 50, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }
    )
    // 2. Reveal paragraph line by line
    .fromTo(
      text.querySelectorAll("p"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.3, duration: 1 },
      "-=0.5"
    )
    // 3. Scale up and fade out to transition to next section
    .to(text, {
      scale: 1.1,
      opacity: 0,
      filter: "blur(20px)",
      duration: 1,
      delay: 0.5
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="purpose"
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--bg-nero)]"
    >
      <div ref={textRef} className="max-w-4xl px-6 text-center z-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent-primary)] mb-8">
          Our Purpose
        </h2>
        
        <div className="space-y-8">
          <p className="text-4xl md:text-6xl font-semibold leading-tight text-white">
            We believe technology should <span className="text-[var(--accent-glow)]">understand</span> you, not just compute for you.
          </p>
          
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
            We&apos;re building the infrastructure for the next generation of AI interactions.
            Where digital entities aren&apos;t just chatbots, but spatially aware companions.
          </p>
          
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
            It&apos;s not just about AR. It&apos;s about creating a seamless bridge between the digital and physical worlds, where AI becomes a natural extension of your mind.
          </p>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-primary)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
