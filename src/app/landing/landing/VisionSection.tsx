"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import FlowingMenu from "@/components/FlowingMenu";
import styles from "./VisionSection.module.css";

// Constants - matching PurposeSection
const PURPOSE_START_OFFSET = 200; // vh
const PURPOSE_START_MULTIPLIER = 0.98;
const PURPOSE_HEIGHT = 800; // vh
const PHASE_8_START = 0.9;
const VISION_HEIGHT = 300; // vh
const VISION_FADE_IN_DURATION = 0.2; // 20% of section for fade in

export default function VisionSection() {
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

        // Use the same calculation as PurposeSection for consistency
        // Purpose section starts at ~196vh (200vh * 0.98), spans 800vh
        const purposeStart =
          (PURPOSE_START_OFFSET * viewportHeight * PURPOSE_START_MULTIPLIER) /
          100;
        const purposeFullHeight = (PURPOSE_HEIGHT * viewportHeight) / 100;
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
        const visionStartScroll =
          purposeStart + PHASE_8_START * purposeFullHeight;
        const visionEnd =
          visionStartScroll + (VISION_HEIGHT * viewportHeight) / 100;

        // Skip animations if reduced motion is preferred
        if (reduceMotionRef.current) {
          if (scrollY >= visionStartScroll) {
            gsap.set(container, { opacity: 1, visibility: "visible" });
          } else {
            gsap.set(container, { opacity: 0, visibility: "hidden" });
          }
          return;
        }

        if (scrollY >= visionStartScroll && scrollY <= visionEnd) {
          // Calculate progress through Vision section (0 to 1)
          const visionProgress =
            (scrollY - visionStartScroll) / (visionEnd - visionStartScroll);

          // Fade in over the first 20% of Vision section scroll for smoother transition
          const fadeInProgress = Math.min(
            visionProgress / VISION_FADE_IN_DURATION,
            1
          ); // 0 to 1 over 20% of section

          // Start fading out at 80% through Vision section
          const fadeOutStart = 0.8;
          let opacity = fadeInProgress;
          if (visionProgress > fadeOutStart) {
            const fadeOutProgress =
              (visionProgress - fadeOutStart) / (1 - fadeOutStart);
            opacity = Math.max(0, fadeInProgress * (1 - fadeOutProgress));
          }

          const tween = gsap.to(container, {
            opacity: opacity,
            visibility: opacity > 0 ? "visible" : "hidden",
            duration: 0.1,
            ease: "none",
          });
          if (tween) gsapAnimationsRef.current.push(tween);
        } else if (scrollY > visionEnd) {
          // Completely invisible after Vision section ends
          const tween = gsap.to(container, {
            opacity: 0,
            visibility: "hidden",
            duration: 0.1,
            ease: "none",
          });
          if (tween) gsapAnimationsRef.current.push(tween);
        } else if (scrollY < visionStartScroll) {
          // Check if we're in Purpose phase 8 - if so, start very subtle fade-in
          if (purposeProgress >= PHASE_8_START && purposeProgress < 1) {
            // Crossfade: Vision starts appearing as Purpose phase 8 progresses
            const phase8Progress =
              (purposeProgress - PHASE_8_START) / (1 - PHASE_8_START); // 0 to 1 through phase 8
            const earlyFade = phase8Progress * 0.3; // Subtle early fade (max 30% opacity)
            const tween = gsap.to(container, {
              opacity: earlyFade,
              visibility: earlyFade > 0 ? "visible" : "hidden",
              duration: 0.1,
              ease: "none",
            });
            if (tween) gsapAnimationsRef.current.push(tween);
          } else {
            // Completely invisible when still in early Purpose phases
            const tween = gsap.to(container, {
              opacity: 0,
              visibility: "hidden",
              duration: 0.1,
              ease: "none",
            });
            if (tween) gsapAnimationsRef.current.push(tween);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      killAllAnimations();
    };
  }, [updateViewportCache, killAllAnimations]);

  // Accessibility and motion preference
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduce = () => {
      reduceMotionRef.current = media.matches;
    };
    if (media.addEventListener) {
      media.addEventListener("change", updateReduce);
    } else {
      media.addListener(updateReduce);
    }
    updateReduce();
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", updateReduce);
      } else {
        media.removeListener(updateReduce);
      }
    };
  }, []);

  // Resize handler
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
        <h2 className={styles.title}>We are Building</h2>

        <div className={styles.menuWrapper}>
          <FlowingMenu
            items={[
              {
                link: "#spatial-companions",
                text: "Companions Aware of Your Surroundings",
                image: "/assets/placeholder.jpg",
              },
              {
                link: "#contextual-intelligence",
                text: "Intelligence that Understands You",
                image: "/assets/placeholder.jpg",
              },
              {
                link: "#growth-ecosystem",
                text: "Personal Learning Ecosystem",
                image: "/assets/placeholder.jpg",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
