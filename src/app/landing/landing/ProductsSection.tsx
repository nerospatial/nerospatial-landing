"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BentoGrid, BentoCard } from "@/components/magic-bento";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    title: "Spatial Companion",
    description:
      "An AI that understands your physical environment and provides context-aware assistance.",
    icon: <span className="material-symbols-outlined">view_in_ar</span>,
    colSpan: 2,
    rowSpan: 2,
    cta: "Learn More",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
    ),
  },
  {
    title: "Context Engine",
    description:
      "Real-time processing of spatial data to deliver hyper-relevant information.",
    icon: <span className="material-symbols-outlined">psychology</span>,
    colSpan: 1,
    rowSpan: 1,
    cta: "Explore API",
  },
  {
    title: "Learning Ecosystem",
    description:
      "Adaptive learning pathways that evolve with your spatial interactions.",
    icon: <span className="material-symbols-outlined">hub</span>,
    colSpan: 1,
    rowSpan: 1,
    cta: "View Platform",
  },
  {
    title: "Developer SDK",
    description:
      "Build your own spatial applications with our powerful set of tools and APIs.",
    icon: <span className="material-symbols-outlined">code</span>,
    colSpan: 3,
    rowSpan: 1,
    cta: "Start Building",
    background: (
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10" />
    ),
  },
];

export default function ProductsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;

    if (!container || !title || !grid) return;

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
      grid.children,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.8, ease: "back.out(1.2)" },
      "-=0.5"
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="products"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 bg-[var(--bg-nero)]"
      data-section="products"
    >
      <h2
        ref={titleRef}
        className="text-4xl md:text-6xl font-bold text-white mb-16 tracking-tight"
      >
        Our <span className="text-[var(--accent-primary)]">Products</span>
      </h2>

      <div ref={gridRef} className="w-full px-6">
        <BentoGrid>
          {products.map((product, i) => (
            <BentoCard key={i} {...product} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
