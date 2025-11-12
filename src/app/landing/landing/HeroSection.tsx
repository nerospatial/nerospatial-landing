"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const hero = heroRef.current;
    const content = contentRef.current;

    if (!hero || !content) return;

    // Clear any previous ScrollTriggers
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Set initial state
    gsap.set(content, {
      scale: 1,
      opacity: 1,
      z: 0,
    });

    if (isMobile) {
      // Simple fade out on scroll for mobile; no heavy scaling
      const onScroll = () => {
        const rect = hero.getBoundingClientRect();
        const viewport = window.innerHeight;
        const progress = Math.min(
          1,
          Math.max(0, (viewport - Math.max(0, rect.top)) / (viewport * 0.8))
        );
        const opacity = 1 - progress;
        content.style.opacity = String(opacity);
        if (opacity <= 0.02 && !isHidden) setIsHidden(true);
        else if (opacity > 0.02 && isHidden) setIsHidden(false);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    } else {
      // Desktop: keep ScrollTrigger zoom/fade
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          onUpdate: (self) => {
            if (self.progress >= 0.98) {
              if (!isHidden) {
                setIsHidden(true);
              }
            } else if (self.progress < 0.98) {
              if (isHidden) {
                setIsHidden(false);
              }
            }
          },
        },
      });

      tl.to(content, {
        scale: 5.5,
        opacity: 0,
        z: 1000,
        ease: "power2.inOut",
      });

      scrollTriggerRef.current = tl.scrollTrigger as ScrollTrigger;

      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [isHidden]);

  // Use a separate effect to handle the hiding
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (isHidden) {
      // Force hide with multiple methods to ensure it stays hidden
      content.style.cssText = `
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        display: none !important;
      `;
    } else {
      // Reset to allow animation
      content.style.cssText = `
        opacity: "";
        visibility: "";
        pointer-events: "";
        display: "";
      `;
    }
  }, [isHidden]);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div ref={contentRef} className={styles.heroContent}>
        <h1 className={styles.mainTitle}>NeroSpatial</h1>
        <h2 className={styles.subtitle}>Building Spatially Aware AI Tutors</h2>
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Explore the Vision</span>
          <svg
            className={styles.scrollArrow}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 19L5 12L6.41 10.59L12 16.17L17.59 10.59L19 12L12 19Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
