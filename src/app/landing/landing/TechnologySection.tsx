"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassCard from "@/components/ui/GlassCard";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Wake Up",
    description: "Device activates upon user interaction or specific triggers.",
    icon: "power_settings_new",
  },
  {
    number: "02",
    title: "Sense",
    description: "Gathers data from the environment via cameras and sensors.",
    icon: "visibility",
  },
  {
    number: "03",
    title: "Personalize",
    description: "Adapts to the user's unique preferences and learning style.",
    icon: "fingerprint",
  },
  {
    number: "04",
    title: "Understand",
    description: "Processes data to find patterns and derive meaning.",
    icon: "psychology",
  },
  {
    number: "05",
    title: "Respond",
    description: "Delivers audio-visual feedback and guidance.",
    icon: "record_voice_over",
  },
  {
    number: "06",
    title: "Evolve",
    description: "Continuously learns from interactions to improve over time.",
    icon: "auto_graph",
  },
];

export default function TechnologySection() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;

    if (!container || !title || !cards) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=150%", // Pin for 150vh
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 1. Title Animation
    tl.fromTo(
      title,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    // 2. Cards Stagger Animation
    .fromTo(
      cards.children,
      { opacity: 0, y: 100, rotateX: -10 },
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.2, duration: 1.5, ease: "power3.out" },
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
      className="relative h-screen w-full flex flex-col items-center justify-center py-24 bg-[var(--bg-nero)] overflow-hidden"
    >
      <h2
        ref={titleRef}
        className="text-4xl md:text-6xl font-bold text-white mb-16 tracking-tight text-center"
      >
        How It <span className="text-[var(--accent-primary)]">Works</span>
      </h2>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl px-6 w-full"
      >
        {steps.map((step, i) => (
          <GlassCard
            key={i}
            className="p-8 flex flex-col gap-4 min-h-[240px] group"
            spotlightColor="rgba(59, 130, 246, 0.1)"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-5xl font-bold text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors duration-500">
                {step.number}
              </span>
              <span className="material-symbols-outlined text-3xl text-[var(--text-secondary)]">
                {step.icon}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{step.title}</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {step.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
