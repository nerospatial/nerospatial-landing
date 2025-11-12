"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import styles from "./ProductsSection.module.css";

// Constants - matching Vision/Purpose pattern
const PURPOSE_START_OFFSET = 200; // vh
const PURPOSE_START_MULTIPLIER = 0.98;
const PURPOSE_HEIGHT = 800; // vh
const VISION_HEIGHT = 300; // vh
const PRODUCTS_HEIGHT = 300; // vh
const PRODUCTS_FADE_IN_DURATION = 0.2; // 20% of section for fade in

export default function ProductsSection() {
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

        // Skip animations if reduced motion is preferred
        if (reduceMotionRef.current) {
          if (scrollY >= productsStartScroll) {
            gsap.set(container, { opacity: 1, visibility: "visible" });
          } else {
            gsap.set(container, { opacity: 0, visibility: "hidden" });
          }
          return;
        }

        if (scrollY >= productsStartScroll && scrollY <= productsEnd) {
          // Calculate progress through Products section (0 to 1)
          const productsProgress =
            (scrollY - productsStartScroll) /
            (productsEnd - productsStartScroll);

          // Fade in over the first 20% of Products section scroll
          const fadeInProgress = Math.min(
            productsProgress / PRODUCTS_FADE_IN_DURATION,
            1
          );

          // Force complete fade out at 95% through Products section
          let opacity = fadeInProgress;
          if (productsProgress > 0.95) {
            opacity = 0;
          } else if (productsProgress > 0.9) {
            // Quick fade out from 90% to 95%
            const fadeOutProgress = (productsProgress - 0.9) / 0.05;
            opacity = Math.max(0, fadeInProgress * (1 - fadeOutProgress));
          }

          const tween = gsap.to(container, {
            opacity: opacity,
            visibility: opacity > 0 ? "visible" : "hidden",
            duration: 0.1,
            ease: "none",
          });
          gsapAnimationsRef.current.push(tween);
        } else if (scrollY > productsEnd) {
          // Completely invisible after Products section ends
          const tween = gsap.to(container, {
            opacity: 0,
            visibility: "hidden",
            duration: 0.1,
            ease: "none",
          });
          gsapAnimationsRef.current.push(tween);
        } else if (scrollY < productsStartScroll && scrollY >= visionEnd) {
          // Scrolling backward from Products to Vision - fade out as Vision fades in
          const reverseProgress =
            (productsStartScroll - scrollY) / (productsStartScroll - visionEnd);
          const opacity = Math.max(0, 1 - reverseProgress);

          const tween = gsap.to(container, {
            opacity: opacity,
            visibility: opacity > 0 ? "visible" : "hidden",
            duration: 0.1,
            ease: "none",
          });
          gsapAnimationsRef.current.push(tween);
        } else if (scrollY < visionEnd) {
          // Completely invisible when scrolling back past Vision section
          const tween = gsap.to(container, {
            opacity: 0,
            visibility: "hidden",
            duration: 0.1,
            ease: "none",
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

  const products = [
    {
      name: "NeroCore",
      tagline: "Audio-first smart glasses for everyday learners",
    },
    {
      name: "NeroGlance",
      tagline: "AR glasses bringing concepts to life visually",
    },
    {
      name: "NeroDivine",
      tagline: "AI toys teaching values through stories",
    },
    {
      name: "NeroPersonas",
      tagline: "Cloud AI mentors powering all NeroSpatial devices",
    },
  ];

  return (
    <section className={styles.section}>
      <div ref={containerRef} className={styles.container}>
        <h2 className={styles.title}>Products — The Form Factors</h2>
        <p className={styles.description}>
          Ground the vision into real products. Show the ecosystem, not just
          gadgets.
        </p>

        <div className={styles.productsGrid}>
          {products.map((product, index) => (
            <div key={index} className={styles.productCard}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productTagline}>{product.tagline}</p>
              <button className={styles.productLink}>Learn More →</button>
            </div>
          ))}
        </div>

        <div className={styles.visualNote}>
          [Each card: clean render, short line, link → dedicated product page]
        </div>
      </div>
    </section>
  );
}
