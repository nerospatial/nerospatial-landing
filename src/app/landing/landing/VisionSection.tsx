"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowingMenu from "@/components/FlowingMenu";

gsap.registerPlugin(ScrollTrigger);

export default function VisionSection() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const menu = menuRef.current;

    if (!container || !title || !menu) return;

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
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    ).fromTo(
      menu,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="vision"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 bg-[var(--bg-nero)]"
    >
      <h2
        ref={titleRef}
        className="text-4xl md:text-6xl font-bold text-white mb-16 tracking-tight"
      >
        We are <span className="text-[var(--accent-primary)]">Building</span>
      </h2>

      <div ref={menuRef} className="w-full max-w-7xl h-[60vh]">
        <FlowingMenu
          items={[
            {
              link: "#spatial-companions",
              text: "Spatial Companions",
              image: "/images/spatial-companions.jpg", // Placeholder, will need real assets
            },
            {
              link: "#contextual-intelligence",
              text: "Contextual Intelligence",
              image: "/images/contextual-intelligence.jpg",
            },
            {
              link: "#growth-ecosystem",
              text: "Learning Ecosystem",
              image: "/images/learning-ecosystem.jpg",
            },
          ]}
        />
      </div>
    </section>
  );
}
