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

      // Use the same calculation as PurposeSection for consistency
      // Purpose section starts at ~196vh (200vh * 0.98), spans 800vh
      const purposeStart = (200 * viewportHeight * 0.98) / 100;
      const purposeFullHeight = (800 * viewportHeight) / 100;
      const purposeEnd = purposeStart + purposeFullHeight;

      // Calculate Purpose progress to detect when phase 8 starts (90% progress)
      let purposeProgress = 0;
      if (scrollY >= purposeStart && scrollY <= purposeEnd) {
        purposeProgress = (scrollY - purposeStart) / purposeFullHeight;
      } else if (scrollY > purposeEnd) {
        purposeProgress = 1;
      }

      // Vision section starts when Purpose phase 8 begins (at 90% progress)
      // This allows smooth crossfade: Vision fades in as Purpose fades out
      const visionStartProgress = 0.9; // Start when Purpose phase 8 begins
      const visionStartScroll =
        purposeStart + visionStartProgress * purposeFullHeight;
      const visionEnd = visionStartScroll + (300 * viewportHeight) / 100; // 300vh total for Vision section

      if (scrollY >= visionStartScroll && scrollY <= visionEnd) {
        // Calculate progress through Vision section (0 to 1)
        const visionProgress =
          (scrollY - visionStartScroll) / (visionEnd - visionStartScroll);

        // Fade in over the first 20% of Vision section scroll for smoother transition
        const fadeProgress = Math.min(visionProgress * 5, 1); // 0 to 1 over 20% of section

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
      } else if (scrollY < visionStartScroll) {
        // Check if we're in Purpose phase 8 - if so, start very subtle fade-in
        if (purposeProgress >= 0.9 && purposeProgress < 1) {
          // Crossfade: Vision starts appearing as Purpose phase 8 progresses
          const phase8Progress = (purposeProgress - 0.9) / 0.1; // 0 to 1 through phase 8
          const earlyFade = phase8Progress * 0.3; // Subtle early fade (max 30% opacity)
          gsap.to(container, {
            opacity: earlyFade,
            visibility: earlyFade > 0 ? "visible" : "hidden",
            duration: 0.1,
            ease: "none",
          });
        } else {
          // Completely invisible when still in early Purpose phases
          gsap.to(container, {
            opacity: 0,
            visibility: "hidden",
            duration: 0.1,
            ease: "none",
          });
        }
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
