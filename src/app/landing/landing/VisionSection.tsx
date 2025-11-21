"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowingMenu from "@/components/FlowingMenu";

gsap.registerPlugin(ScrollTrigger);

export default function VisionSection() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const statement = statementRef.current;
    const menu = menuRef.current;

    if (!container || !title || !statement || !menu) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      title,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
    )
      .fromTo(
        statement,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(
        menu,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
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
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-32 bg-black overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/20 via-black to-black pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center">
        <h2
          ref={titleRef}
          className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase opacity-0"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          The <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Vision</span>
        </h2>

        <p
          ref={statementRef}
          className="max-w-2xl text-lg md:text-xl text-neutral-400 mb-24 font-light leading-relaxed opacity-0"
        >
          We are architecting a future where digital and physical realities converge seamlessly. 
          Our mission is to build the spatial computing infrastructure that empowers human potential.
        </p>

        <div ref={menuRef} className="w-full h-[50vh] md:h-[60vh] opacity-0">
          <FlowingMenu
            items={[
              {
                link: "#spatial-companions",
                text: "Spatial Companions",
                image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", // Abstract Fluid Dark
              },
              {
                link: "#contextual-intelligence",
                text: "Contextual Intelligence",
                image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop", // Abstract Glitch/Data
              },
              {
                link: "#learning-ecosystem",
                text: "Learning Ecosystem",
                image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop", // Abstract Particles
              },
              {
                link: "#adaptive-reality",
                text: "Adaptive Reality",
                image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop", // Abstract Smoke/Fluid
              }
            ]}
          />
        </div>
      </div>
    </section>
  );
}
