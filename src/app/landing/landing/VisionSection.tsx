"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./VisionSection.module.css";

export default function VisionSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial state
    gsap.set(container, { opacity: 0, visibility: "hidden" });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Compute Purpose section boundaries from the DOM for precise alignment
      const purposeSection = document.querySelector(
        'section[data-section="purpose"]'
      ) as HTMLElement | null;

      let purposeEnd: number;
      if (purposeSection) {
        // Use bounding rect + scrollY for robust positioning regardless of layout/positioning contexts
        const rect = purposeSection.getBoundingClientRect();
        const purposeTop = rect.top + window.scrollY;
        const purposeHeight = rect.height;
        purposeEnd = purposeTop + purposeHeight; // End of Purpose section in px
      } else {
        // Fallback to previous assumptions if element not found
        const purposeStart = (200 * viewportHeight * 0.98) / 100;
        const purposeFullHeight = (800 * viewportHeight) / 100;
        purposeEnd = purposeStart + purposeFullHeight;
      }

      // Vision section starts AFTER Purpose section completes (with a small buffer to avoid overlap)
      const visionStart = purposeEnd + viewportHeight * 0.01; // 1vh buffer
      const visionEnd = visionStart + (300 * viewportHeight) / 100; // 300vh total for Vision section

      if (scrollY >= visionStart && scrollY <= visionEnd) {
        // Calculate progress through Vision section (0 to 1)
        const progress = (scrollY - visionStart) / (visionEnd - visionStart);

        // Fade in over the first 10% of Vision section scroll
        const fadeProgress = Math.min(progress * 10, 1); // 0 to 1 over 10% of section

        gsap.to(container, {
          opacity: fadeProgress,
          visibility: fadeProgress > 0 ? "visible" : "hidden",
          duration: 0.1,
          ease: "none",
        });
      } else if (scrollY > visionEnd) {
        // Fully visible after Vision section
        gsap.to(container, {
          opacity: 1,
          visibility: "visible",
          duration: 0.1,
          ease: "none",
        });
      } else if (scrollY < visionStart) {
        // Completely invisible when still in Purpose section
        gsap.to(container, {
          opacity: 0,
          visibility: "hidden",
          duration: 0.1,
          ease: "none",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={styles.section}>
      <div ref={containerRef} className={styles.container}>
        <h2 className={styles.title}>Vision — What We&apos;re Building</h2>
        <p className={styles.description}>
          Explain what NeroSpatial is, but philosophically — not feature-wise.
        </p>

        <div className={styles.subsections}>
          <div className={styles.subsection}>
            <h3 className={styles.subtitle}>Spatial Companions</h3>
            <p className={styles.subtext}>AI that perceives the real world.</p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subtitle}>Contextual Intelligence</h3>
            <p className={styles.subtext}>
              Learns from your environment and behavior.
            </p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subtitle}>Personal Growth Ecosystem</h3>
            <p className={styles.subtext}>Evolves with you over time.</p>
          </div>
        </div>

        <div className={styles.visualNote}>
          [Tone: aspirational; show humans interacting seamlessly with devices,
          not screens]
        </div>
      </div>
    </section>
  );
}
