"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import styles from "./TechnologySection.module.css";

// Constants - matching Vision/Purpose pattern
const PURPOSE_START_OFFSET = 200; // vh
const PURPOSE_START_MULTIPLIER = 0.98;
const PURPOSE_HEIGHT = 800; // vh
const VISION_HEIGHT = 300; // vh
const PRODUCTS_HEIGHT = 300; // vh
const TECHNOLOGY_HEIGHT = 300; // vh
const TECHNOLOGY_FADE_IN_DURATION = 0.2; // 20% of section for fade in

export default function TechnologySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const gsapAnimationsRef = useRef<gsap.core.Tween[]>([]);
  const reduceMotionRef = useRef<boolean>(false);
  const viewportHeightRef = useRef(0);

  const updateViewportCache = useCallback(() => {
    if (typeof window === "undefined") return;
    viewportHeightRef.current = window.innerHeight;
  }, []);

  // Kill all GSAP animations
  const killAllAnimations = useCallback(() => {
    gsapAnimationsRef.current.forEach((anim) => {
      if (anim && anim.kill) anim.kill();
    });
    gsapAnimationsRef.current = [];
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial state
    gsap.set(container, { opacity: 0, visibility: "hidden" });

    updateViewportCache();

    const handleScroll = () => {
      // Kill any pending animations from previous scroll
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        updateViewportCache();
        const viewportHeight = viewportHeightRef.current;

        // Calculate Purpose section bounds
        const purposeStart =
          (PURPOSE_START_OFFSET * viewportHeight * PURPOSE_START_MULTIPLIER) /
          100;
        const purposeFullHeight = (PURPOSE_HEIGHT * viewportHeight) / 100;

        // Vision section starts at Purpose phase 8 (90%)
        const visionStartScroll = purposeStart + 0.9 * purposeFullHeight;
        const visionEnd =
          visionStartScroll + (VISION_HEIGHT * viewportHeight) / 100;

        // Products section starts immediately after Vision ends
        const productsStartScroll = visionEnd;
        const productsEnd =
          productsStartScroll + (PRODUCTS_HEIGHT * viewportHeight) / 100;

        // Technology section starts immediately after Products ends
        const technologyStartScroll = productsEnd;
        const technologyEnd =
          technologyStartScroll + (TECHNOLOGY_HEIGHT * viewportHeight) / 100;

        // Skip animations if reduced motion is preferred
        if (reduceMotionRef.current) {
          if (scrollY >= technologyStartScroll) {
            gsap.set(container, { opacity: 1, visibility: "visible" });
          } else {
            gsap.set(container, { opacity: 0, visibility: "hidden" });
          }
          return;
        }

        if (scrollY >= technologyStartScroll && scrollY <= technologyEnd) {
          // Calculate progress through Technology section (0 to 1)
          const technologyProgress =
            (scrollY - technologyStartScroll) /
            (technologyEnd - technologyStartScroll);

          // Fade in over the first 20% of Technology section scroll
          const fadeProgress = Math.min(
            technologyProgress / TECHNOLOGY_FADE_IN_DURATION,
            1
          );

          const tween = gsap.to(container, {
            opacity: fadeProgress,
            visibility: fadeProgress > 0 ? "visible" : "hidden",
            duration: 0.1,
          });

          gsapAnimationsRef.current.push(tween);
        } else if (scrollY < technologyStartScroll) {
          // Before Technology section
          const tween = gsap.to(container, {
            opacity: 0,
            visibility: "hidden",
            duration: 0.1,
          });
          gsapAnimationsRef.current.push(tween);
        } else if (scrollY > technologyEnd) {
          // After Technology section - keep visible or fade out for next section
          const tween = gsap.to(container, {
            opacity: 1,
            visibility: "visible",
            duration: 0.1,
          });
          gsapAnimationsRef.current.push(tween);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      killAllAnimations();
    };
  }, [updateViewportCache, killAllAnimations]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      updateViewportCache();
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [updateViewportCache]);

  return (
    <section className={styles.section}>
      <div ref={containerRef} className={styles.container}>
        <h2 className={styles.title}>Technology — How It Works (High-Level)</h2>
        <p className={styles.description}>
          Show intellectual depth, but remain approachable.
        </p>

        <div className={styles.flow}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Perceive</h3>
            <p className={styles.stepText}>
              Cameras, mics, spatial inputs sense surroundings.
            </p>
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Understand</h3>
            <p className={styles.stepText}>AI contextualizes your world.</p>
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Respond</h3>
            <p className={styles.stepText}>
              Personalized audio/visual mentorship.
            </p>
          </div>
        </div>

        <div className={styles.visualNote}>
          [Visual: animated schematic (simple geometric shapes, minimal text)]
        </div>
      </div>
    </section>
  );
}
