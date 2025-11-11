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

      // Purpose section ends at ~686vh (700vh * 0.98), Vision section starts there
      const visionStart = (700 * viewportHeight * 0.98) / 100; // ~686vh in pixels
      const visionEnd = visionStart + (300 * viewportHeight) / 100; // 300vh total for Vision section

      if (scrollY >= visionStart && scrollY <= visionEnd) {
        // Calculate progress through Vision section (0 to 1)
        const progress = (scrollY - visionStart) / (visionEnd - visionStart);

        // Fade in over the first 20% of Vision section scroll
        const fadeProgress = Math.min(progress * 5, 1); // 0 to 1 over 20% of section

        gsap.to(container, {
          opacity: fadeProgress,
          visibility: fadeProgress > 0 ? "visible" : "hidden",
          duration: 0.1, // Quick update for smooth scrolling
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
        // Completely invisible when scrolled back to Purpose section
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
