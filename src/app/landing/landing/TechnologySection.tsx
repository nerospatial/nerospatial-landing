"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NeuralPathway from "@/components/NeuralPathway";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Wake Up",
    description: "Device activates upon user interaction or specific triggers, initiating the spatial awareness protocols.",
    icon: "power_settings_new",
  },
  {
    number: "02",
    title: "Sense",
    description: "Gathers high-fidelity data from the environment via advanced LiDAR, cameras, and audio sensors.",
    icon: "visibility",
  },
  {
    number: "03",
    title: "Personalize",
    description: "Adapts to the user's unique preferences and learning style using on-device neural processing.",
    icon: "fingerprint",
  },
  {
    number: "04",
    title: "Understand",
    description: "Processes complex spatial and contextual data to find patterns and derive deep meaning.",
    icon: "psychology",
  },
  {
    number: "05",
    title: "Respond",
    description: "Delivers intuitive audio-visual feedback and guidance through the spatial interface.",
    icon: "record_voice_over",
  },
  {
    number: "06",
    title: "Evolve",
    description: "Continuously learns from interactions to improve accuracy and helpfulness over time.",
    icon: "auto_graph",
  },
];

export default function TechnologySection() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pathwayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const pathway = pathwayRef.current;

    if (!container || !title || !pathway) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      title,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
    ).fromTo(
      pathway,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.out" },
      "-=0.5"
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="technology"
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-start py-32 bg-black overflow-hidden"
    >
      {/* Background Elements - Subtle Monochrome */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/20 via-black to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col gap-12">
        <div className="flex flex-col items-center text-center">
          <h2
            ref={titleRef}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase mb-8 opacity-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Neural Path</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl text-lg md:text-xl font-light leading-relaxed">
            Tracing the flow of intelligence from perception to action.
          </p>
        </div>

        <div ref={pathwayRef} className="w-full opacity-0">
          <NeuralPathway steps={steps} />
        </div>
      </div>
    </section>
  );
}
