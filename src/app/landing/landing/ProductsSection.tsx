"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MonochromeDeck from "@/components/MonochromeDeck";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: "nerodivine",
    title: "NeroDivine",
    subtitle: "Learning",
    description: "AI toys teaching values through stories. An interactive companion that grows with your child, fostering emotional intelligence and creativity through personalized storytelling.",
    image: "/assets/landing/toy_image-nobg.png",
    price: "$50",
    status: "coming_soon" as const,
  },
  {
    id: "neroglasses",
    title: "NeroGlasses",
    subtitle: "Vision",
    description: "AIAR glasses bringing concepts to life visually. See the world with new eyes through our advanced optical display system and real-time object recognition.",
    image: "/assets/landing/glasses.png",
    price: "$299",
    status: "coming_soon" as const,
  },
  {
    id: "neropersonas",
    title: "NeroPersonas",
    subtitle: "AI Cloud",
    description: "Cloud AI mentors powering all NeroSpatial devices. Your personal guide in the spatial web, adapting to your learning style and preferences over time.",
    image: "/assets/landing/nero-personas.png",
    price: "$10/mo",
    status: "coming_soon" as const,
  }
];

export default function ProductsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const deck = deckRef.current;

    if (!container || !title || !deck) return;

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
      deck,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.8"
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
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-16 md:py-32 bg-black overflow-hidden"
    >
      {/* Background Elements - Subtle Monochrome */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/20 via-black to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col gap-24">
        <div className="flex flex-col items-center text-center">
          <h2
            ref={titleRef}
            className="text-4xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter uppercase mb-8 opacity-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Products</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl text-base md:text-lg lg:text-xl font-light leading-relaxed">
            Precision-engineered hardware and software, designed to seamlessly integrate into your reality.
          </p>
        </div>

        <div ref={deckRef} className="w-full opacity-0">
          <MonochromeDeck products={products} />
        </div>
      </div>
    </section>
  );
}
