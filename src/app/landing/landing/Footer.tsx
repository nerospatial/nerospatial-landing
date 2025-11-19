"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

import { useLenis } from "@/components/core/SmoothScroll";

export default function Footer() {
  const lenis = useLenis();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    // Map link names to section IDs
    const sectionMap: { [key: string]: string } = {
      "Vision": "#vision",
      "Technology": "#technology",
      "Contact": "#contact",
      "NeroDivine": "#products", 
      "NeroPersonas": "#products",
      "NeroGlasses": "#products"
    };

    const targetId = sectionMap[id];

    if (targetId) {
      if (lenis) {
        lenis.scrollTo(targetId, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        const element = document.querySelector(targetId);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Scroll to top for non-existent sections
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };
  return (
    <footer className="relative w-full bg-white text-black pt-24 pb-12 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col justify-between min-h-[60vh]">
        
        {/* Top Section: Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-24">
          {/* Brand / Mission */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Mission
            </span>
            <p className="text-xl md:text-2xl font-medium leading-tight max-w-sm">
              Architecting the infrastructure for a spatially aware digital future.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2 md:col-start-7 flex flex-col gap-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Platform
            </span>
            <ul className="flex flex-col gap-3">
              {["NeroDivine", "NeroGlasses","NeroPersonas"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    onClick={(e) => scrollToSection(e, item)}
                    className="text-lg font-bold hover:text-neutral-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Company
            </span>
            <ul className="flex flex-col gap-3">
              {["Vision", "Technology", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    onClick={(e) => scrollToSection(e, item)}
                    className="text-lg font-bold hover:text-neutral-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Socials
            </span>
            <ul className="flex flex-col gap-3">
              {[
                { name: "Twitter", href: "https://x.com/NeroSpatial" },
                { name: "LinkedIn", href: "https://www.linkedin.com/company/nerospatial/" }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold hover:text-neutral-500 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Massive Text */}
        <div className="flex flex-col gap-8">
          <div className="w-full h-[1px] bg-black/10" />
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="flex gap-6 text-sm font-mono text-neutral-500 uppercase tracking-wider">
<Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-black transition-colors">Terms of Service</Link>
            </div>
            <span className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
              © {new Date().getFullYear()} NeroSpatial Inc.
            </span>
          </div>

          <h1 
            className="text-[10vw] leading-[0.8] font-black tracking-tighter uppercase text-center md:text-left mt-8 select-none flex flex-nowrap justify-center md:justify-start"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {"NeroSpatial".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ rotateY: 0 }}
                whileInView={{ rotateY: 360 }}
                viewport={{ once: false, margin: "-10%" }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeInOut", 
                  delay: index * 0.05 
                }}
                className="inline-block origin-center"
                style={{ perspective: "1000px" }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </div>
      </div>
    </footer>
  );
}
