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
const TECHNOLOGY_HEIGHT = 800; // vh
const TECHNOLOGY_FADE_IN_DURATION = 0.1; // 10% of section for fade in
const TITLE_ANIMATION_DURATION = 0.25; // 25% of section for title animation (0 to 0.25)
const CARDS_ANIMATION_START = 0.25; // Cards start animating at 25% of section

// Technology process data
const technologySteps = [
  {
    id: 1,
    shortTitle: "Wake Up",
    hoverTitle: "Human Interaction Activation",
  },
  {
    id: 2,
    shortTitle: "Sense",
    hoverTitle: "Real-time Audio & Video Capture",
  },
  {
    id: 3,
    shortTitle: "Understand",
    hoverTitle: "Cloud Spatial Intelligence",
  },
  {
    id: 4,
    shortTitle: "Personalize",
    hoverTitle: "Memory & Context Layer",
  },
  {
    id: 5,
    shortTitle: "Respond",
    hoverTitle: "Multimodal Real-time Output",
  },
  {
    id: 6,
    shortTitle: "Evolve",
    hoverTitle: "Continuous Learning & Growth",
  },
];

export default function TechnologySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const gsapAnimationsRef = useRef<gsap.core.Tween[]>([]);
  const reduceMotionRef = useRef<boolean>(false);
  const viewportHeightRef = useRef(0);
  const viewportWidthRef = useRef(0);

  const updateViewportCache = useCallback(() => {
    if (typeof window === "undefined") return;
    viewportHeightRef.current = window.innerHeight;
    viewportWidthRef.current = window.innerWidth;
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
        const viewportWidth = viewportWidthRef.current;

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
            const titleWidth = viewportWidth * 0.12;
            const spacerLeft = titleWidth / 2;
            const targetX = -viewportWidth / 2 + spacerLeft;
            gsap.set(titleRef.current, {
              opacity: 1,
              visibility: "visible",
              x: targetX,
              rotation: -90,
              transformOrigin: "center center",
            });
            gsap.set(cardsWrapperRef.current, {
              opacity: 1,
              visibility: "visible",
            });
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

          // Fade in over the first 10% of Technology section scroll
          const fadeProgress = Math.min(
            technologyProgress / TECHNOLOGY_FADE_IN_DURATION,
            1
          );

          gsap.set(container, {
            opacity: fadeProgress,
            visibility: fadeProgress > 0 ? "visible" : "hidden",
          });

          // Phase 1: Title animation (0 to 25% of section) - from center to left with rotation
          if (technologyProgress <= TITLE_ANIMATION_DURATION) {
            const titleProgress = technologyProgress / TITLE_ANIMATION_DURATION;

            // Calculate target position: move from center to left edge of spacer
            // Title starts centered (50% of viewport), moves to left edge of spacer (12% from left)
            const titleWidth = viewportWidth * 0.12; // 12% of viewport
            const spacerLeft = titleWidth / 2; // Left edge of spacer (center of title width)
            const targetX = -viewportWidth / 2 + spacerLeft; // Move from center to spacer left edge

            // Animate: fade in, rotate -90°, and translate to left
            gsap.set(titleRef.current, {
              opacity: titleProgress,
              visibility: titleProgress > 0 ? "visible" : "hidden",
              x: titleProgress * targetX,
              rotation: titleProgress * -90,
              transformOrigin: "center center",
            });
          } else {
            // Lock title in final state
            const titleWidth = viewportWidth * 0.12;
            const spacerLeft = titleWidth / 2;
            const targetX = -viewportWidth / 2 + spacerLeft;
            gsap.set(titleRef.current, {
              opacity: 1,
              visibility: "visible",
              x: targetX,
              rotation: -90,
              transformOrigin: "center center",
            });
          }

          // Phase 2: Cards animation (25% to end of section)
          if (technologyProgress >= CARDS_ANIMATION_START) {
            const cardsProgress =
              (technologyProgress - CARDS_ANIMATION_START) /
              (1 - CARDS_ANIMATION_START);

            // Fade in cards wrapper
            gsap.set(cardsWrapperRef.current, {
              opacity: Math.min(cardsProgress * 3, 1), // Quick fade in
              visibility: "visible",
            });

            // Sequential card animations - cards animate in place (no movement)
            const cardDuration = 1 / 6; // Each card takes 1/6 of the remaining animation time

            cardRefs.current.forEach((card, index) => {
              if (!card) return;

              const cardStart = index * cardDuration;
              const cardEnd = (index + 1) * cardDuration;

              if (cardsProgress >= cardStart && cardsProgress <= cardEnd) {
                const cardProgress = (cardsProgress - cardStart) / cardDuration;
                // Stamp effect: scale from 0.8 to 1.0, fade in opacity
                const stampProgress = Math.min(cardProgress / 0.5, 1); // Stamp in first 50%
                const scaleValue = 0.8 + (1 - 0.8) * stampProgress; // Scale from 0.8 to 1.0
                const opacityValue = stampProgress;

                gsap.set(card, {
                  opacity: opacityValue,
                  visibility: "visible",
                  scale: scaleValue,
                });
              } else if (cardsProgress < cardStart) {
                // Before this card's animation starts
                gsap.set(card, {
                  opacity: 0,
                  visibility: "hidden",
                  scale: 0.8,
                });
              } else {
                // After this card's animation completes - lock in final state
                gsap.set(card, {
                  opacity: 1,
                  visibility: "visible",
                  scale: 1,
                });
              }
            });
          } else {
            // Hide cards before animation starts
            gsap.set(cardsWrapperRef.current, {
              opacity: 0,
              visibility: "hidden",
            });
            // Reset all cards to initial state
            cardRefs.current.forEach((card) => {
              if (card) {
                gsap.set(card, {
                  opacity: 0,
                  visibility: "hidden",
                  scale: 0.8,
                });
              }
            });
          }
        } else if (scrollY < technologyStartScroll) {
          // Before Technology section
          gsap.set(container, { opacity: 0, visibility: "hidden" });
        } else if (scrollY > technologyEnd) {
          // After Technology section - keep final state
          gsap.set(container, { opacity: 1, visibility: "visible" });
          const titleWidth = viewportWidth * 0.12;
          const spacerLeft = titleWidth / 2;
          const targetX = -viewportWidth / 2 + spacerLeft;
          gsap.set(titleRef.current, {
            opacity: 1,
            visibility: "visible",
            x: targetX,
            rotation: -90,
            transformOrigin: "center center",
          });
          gsap.set(cardsWrapperRef.current, {
            opacity: 1,
            visibility: "visible",
          });
          // Ensure all cards are in final state
          cardRefs.current.forEach((card) => {
            if (card) {
              gsap.set(card, {
                opacity: 1,
                visibility: "visible",
                scale: 1,
              });
            }
          });
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

  return (
    <section className={styles.section}>
      <div ref={containerRef} className={styles.container}>
        <div className={styles.titleSpacer}></div>
        <h2 ref={titleRef} className={styles.title}>
          How It Works
        </h2>
        <div ref={cardsWrapperRef} className={styles.cardsWrapper}>
          <div ref={cardsContainerRef} className={styles.cardsContainer}>
            {technologySteps.map((step, i) => (
              <div
                key={step.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={styles.card}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.shortTitle}>{step.shortTitle}</span>
                    <span className={styles.hoverTitle}>{step.hoverTitle}</span>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
