"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./PurposeSection.module.css";

// Constants
const MOBILE_BREAKPOINT = 768;
const PURPOSE_START_OFFSET = 200; // vh
const PURPOSE_START_MULTIPLIER = 0.98;
const PURPOSE_HEIGHT = 800; // vh
const PHASE_1_END = 0.2;
const PHASE_2_END = 0.4;
const PHASE_3_END = 0.6;
const PHASE_4_END = 0.7;
const PHASE_5_END = 0.85;
const PHASE_6_END = 0.875;
const PHASE_7_END = 0.9;
const PHASE_8_START = 0.9;
const HIDE_THRESHOLD = 0.98;

// Mobile phase constants
const MOBILE_P1_END = 0.25;
const MOBILE_P2_END = 0.5;
const MOBILE_P3_END = 0.7;
const MOBILE_FADEOUT_START = 0.8;

export default function PurposeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageTitleRef = useRef<HTMLHeadingElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const stampTextRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isHiddenRef = useRef(false);
  const [isTwoColumnLayout, setIsTwoColumnLayout] = useState(false);

  // --- Phase snap helpers (desktop only) ---
  const SNAP_POINTS = useRef<number[]>([
    0, 0.2, 0.4, 0.6, 0.7, 0.85, 0.875, 0.9, 1,
  ]);
  const isSnappingRef = useRef(false);
  const lastSnapTimeRef = useRef(0);
  const pendingTargetRef = useRef<number | null>(null);
  const recentTouchRef = useRef(false);
  const reduceMotionRef = useRef<boolean>(false);

  // Cached values
  const isMobileRef = useRef(false);
  const viewportHeightRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const gsapAnimationsRef = useRef<gsap.core.Tween[]>([]);

  const updateViewportCache = useCallback(() => {
    if (typeof window === "undefined") return;
    isMobileRef.current = window.innerWidth < MOBILE_BREAKPOINT;
    viewportHeightRef.current = window.innerHeight;
  }, []);

  const isDesktop = useCallback(() => {
    return typeof window !== "undefined" && window.innerWidth >= MOBILE_BREAKPOINT;
  }, []);

  const getPurposeBounds = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return { top: 0, height: 0, end: 0 };
    const rect = section.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const height = section.offsetHeight;
    return { top, height, end: top + height };
  }, []);

  const getProgress = useCallback(() => {
    const { top, height } = getPurposeBounds();
    if (height <= 0) return 0;
    const y = window.scrollY;
    return Math.min(1, Math.max(0, (y - top) / height));
  }, [getPurposeBounds]);

  const toScrollY = useCallback((progress: number) => {
    const { top, height } = getPurposeBounds();
    return Math.round(top + progress * height);
  }, [getPurposeBounds]);

  const findNextSnap = (dir: 1 | -1, current: number) => {
    const points = SNAP_POINTS.current;
    if (dir > 0) {
      for (let i = 0; i < points.length; i++) {
        if (points[i] > current + 0.001) return points[i];
      }
      return 1;
    } else {
      for (let i = points.length - 1; i >= 0; i--) {
        if (points[i] < current - 0.001) return points[i];
      }
      return 0;
    }
  };

  // Kill all GSAP animations
  const killAllAnimations = useCallback(() => {
    gsapAnimationsRef.current.forEach((anim) => {
      if (anim && anim.kill) anim.kill();
    });
    gsapAnimationsRef.current = [];
  }, []);

  // Batch GSAP animations
  const batchAnimations = useCallback(
    (animations: Array<() => gsap.core.Tween>) => {
      if (reduceMotionRef.current) {
        // For reduced motion, set final states immediately
        animations.forEach((anim) => {
          const tween = anim();
          if (tween) {
            tween.progress(1); // Jump to end
            tween.kill();
          }
        });
        return;
      }
      const tweens = animations.map((anim) => anim()).filter(Boolean);
      gsapAnimationsRef.current.push(...tweens);
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    const pageTitle = pageTitleRef.current;
    const leftColumn = leftColumnRef.current;
    const rightColumn = rightColumnRef.current;
    const stampText = stampTextRef.current;

    if (!container || !pageTitle || !leftColumn || !rightColumn || !stampText)
      return;

    // Set initial states
    gsap.set(container, { opacity: 0, visibility: "hidden" });
    gsap.set(pageTitle, { opacity: 0, clipPath: "inset(0 0 100% 0)" });
    gsap.set(leftColumn, { opacity: 0, x: 0, clipPath: "inset(0 0 100% 0)" });
    gsap.set(rightColumn, { opacity: 0, x: 0, clipPath: "inset(0 0 100% 0)" });
    gsap.set(stampText, {
      opacity: 0,
      scale: 1,
      clipPath: "inset(0 0 100% 0)",
    });

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
        const isMobile = isMobileRef.current;

        // Purpose section starts at ~196vh
        const purposeStart =
          (PURPOSE_START_OFFSET * viewportHeight * PURPOSE_START_MULTIPLIER) /
          100;
        const purposeEnd = purposeStart + (PURPOSE_HEIGHT * viewportHeight) / 100;

        if (scrollY >= purposeStart && scrollY <= purposeEnd) {
          // Ensure container is not hidden when within bounds
          if (isHiddenRef.current) {
            isHiddenRef.current = false;
          }
          const progress = (scrollY - purposeStart) / (purposeEnd - purposeStart);

          // Mobile: simplified condensed sequence (fade in/out)
          if (isMobile) {
            const p1 = Math.min(progress / MOBILE_P1_END, 1); // 0-25%
            const p2 =
              progress > MOBILE_P1_END
                ? Math.min((progress - MOBILE_P1_END) / (MOBILE_P2_END - MOBILE_P1_END), 1)
                : 0; // 25-50%
            const p3 =
              progress > MOBILE_P2_END
                ? Math.min((progress - MOBILE_P2_END) / (MOBILE_P3_END - MOBILE_P2_END), 1)
                : 0; // 50-70%
            const fadeOut =
              progress > MOBILE_FADEOUT_START
                ? Math.min((progress - MOBILE_FADEOUT_START) / (1 - MOBILE_FADEOUT_START), 1)
                : 0; // 80-100%

            batchAnimations([
              () =>
                gsap.to(container, {
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.1,
                }),
              () =>
                gsap.to(pageTitle, {
                  opacity: 1 - fadeOut,
                  clipPath: `inset(0 0 ${100 - p1 * 100}% 0)`,
                  duration: 0.1,
                }),
              () =>
                gsap.to(leftColumn, {
                  opacity: 1 - fadeOut,
                  width: "100%",
                  clipPath: `inset(0 0 ${100 - p1 * 100}% 0)`,
                  duration: 0.1,
                }),
              () =>
                gsap.to(rightColumn, {
                  opacity: p2 * (1 - fadeOut),
                  width: "100%",
                  clipPath: `inset(0 0 ${100 - p2 * 100}% 0)`,
                  duration: 0.1,
                }),
              () =>
                gsap.to(stampText, {
                  opacity: p3 * (1 - fadeOut),
                  scale: 1,
                  clipPath: `inset(0 0 ${100 - p3 * 100}% 0)`,
                  duration: 0.1,
                }),
            ]);
            return;
          }

          // Desktop phases
          // Phase 1: Fade in only text in center, taking full width (0-20% of 800vh)
          if (progress <= PHASE_1_END) {
            const fadeInProgress = progress / PHASE_1_END;
            batchAnimations([
              () =>
                gsap.to(container, {
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.1,
                }),
              () =>
                gsap.to(pageTitle, {
                  opacity: fadeInProgress,
                  clipPath: `inset(0 0 ${100 - fadeInProgress * 100}% 0)`,
                  duration: 0.1,
                }),
              () =>
                gsap.to(leftColumn, {
                  opacity: fadeInProgress,
                  width: "800px",
                  clipPath: `inset(0 0 ${100 - fadeInProgress * 100}% 0)`,
                  duration: 0.1,
                }),
              () =>
                gsap.to(rightColumn, {
                  opacity: 0,
                  width: "0%",
                  clipPath: "inset(0 0 100% 0)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(stampText, {
                  opacity: 0,
                  clipPath: "inset(0 0 100% 0)",
                  duration: 0.1,
                }),
            ]);
            if (isHiddenRef.current) isHiddenRef.current = false;
          }
          // Phase 2: Shrink left container, expand right container space (20-40% of 800vh)
          else if (progress <= PHASE_2_END) {
            const phase2Progress = (progress - PHASE_1_END) / (PHASE_2_END - PHASE_1_END);
            if (!isTwoColumnLayout) setIsTwoColumnLayout(true);

            const rightWidth = phase2Progress * 50;
            batchAnimations([
              () =>
                gsap.to(container, {
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.1,
                }),
              () =>
                gsap.to(pageTitle, {
                  opacity: 1,
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(leftColumn, {
                  opacity: 1,
                  width: "50%",
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(rightColumn, {
                  opacity: 0,
                  width: `${rightWidth}%`,
                  clipPath: "inset(0 0 100% 0)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(stampText, {
                  opacity: 0,
                  clipPath: "inset(0 0 100% 0)",
                  duration: 0.1,
                }),
            ]);
          }
          // Phase 3: Fade in video in the right column (40-60% of 800vh)
          else if (progress <= PHASE_3_END) {
            const phase3Progress = (progress - PHASE_2_END) / (PHASE_3_END - PHASE_2_END);
            batchAnimations([
              () =>
                gsap.to(container, {
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.1,
                }),
              () =>
                gsap.to(pageTitle, {
                  opacity: 1,
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(leftColumn, {
                  opacity: 1,
                  width: "50%",
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(rightColumn, {
                  opacity: phase3Progress,
                  width: "50%",
                  clipPath: `inset(0 0 ${100 - phase3Progress * 100}% 0)`,
                  duration: 0.1,
                }),
              () =>
                gsap.to(stampText, {
                  opacity: 0,
                  clipPath: "inset(0 0 100% 0)",
                  duration: 0.1,
                }),
            ]);
          }
          // Phase 4: Hold both columns visible (60-70% of 800vh)
          else if (progress <= PHASE_4_END) {
            batchAnimations([
              () =>
                gsap.to(container, {
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.1,
                }),
              () =>
                gsap.to(pageTitle, {
                  opacity: 1,
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(leftColumn, {
                  opacity: 1,
                  width: "50%",
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(rightColumn, {
                  opacity: 1,
                  width: "50%",
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(stampText, {
                  opacity: 0,
                  clipPath: "inset(0 0 100% 0)",
                  duration: 0.1,
                }),
            ]);
          }
          // Phase 5: Fold up both columns AND page title (70-85% of 800vh)
          // FIXED: Now correctly folds from top (inset top value increases)
          else if (progress <= PHASE_5_END) {
            const fadeOutProgress = (progress - PHASE_4_END) / (PHASE_5_END - PHASE_4_END);
            batchAnimations([
              () =>
                gsap.to(container, {
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.1,
                }),
              () =>
                gsap.to(pageTitle, {
                  opacity: 1 - fadeOutProgress,
                  clipPath: `inset(${fadeOutProgress * 100}% 0 0 0)`,
                  duration: 0.1,
                }),
              () =>
                gsap.to(leftColumn, {
                  opacity: 1 - fadeOutProgress,
                  width: "50%",
                  clipPath: `inset(${fadeOutProgress * 100}% 0 0 0)`,
                  duration: 0.1,
                }),
              () =>
                gsap.to(rightColumn, {
                  opacity: 1 - fadeOutProgress,
                  width: "50%",
                  clipPath: `inset(${fadeOutProgress * 100}% 0 0 0)`,
                  duration: 0.1,
                }),
              () =>
                gsap.to(stampText, {
                  opacity: 0,
                  clipPath: "inset(0 0 100% 0)",
                  duration: 0.1,
                }),
            ]);
          }
          // Phase 6: Unfold "Our Purpose" text (85-87.5% of 800vh)
          else if (progress <= PHASE_6_END) {
            const stampProgress = (progress - PHASE_5_END) / (PHASE_6_END - PHASE_5_END);
            batchAnimations([
              () =>
                gsap.to(container, {
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.1,
                }),
              () =>
                gsap.to(pageTitle, {
                  opacity: 0,
                  clipPath: "inset(0 0 0% 100%)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(leftColumn, {
                  opacity: 0,
                  width: "50%",
                  clipPath: "inset(0 0 0% 100%)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(rightColumn, {
                  opacity: 0,
                  width: "50%",
                  clipPath: "inset(0 0 0% 100%)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(stampText, {
                  opacity: stampProgress,
                  scale: 1,
                  clipPath: `inset(0 0 ${100 - stampProgress * 100}% 0)`,
                  duration: 0.1,
                }),
            ]);
          }
          // Phase 7: Hold stamp (87.5-90% of 800vh)
          else if (progress <= PHASE_7_END) {
            batchAnimations([
              () =>
                gsap.to(container, {
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.1,
                }),
              () =>
                gsap.to(pageTitle, {
                  opacity: 0,
                  clipPath: "inset(0 0 0% 100%)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(leftColumn, {
                  opacity: 0,
                  width: "50%",
                  clipPath: "inset(0 0 0% 100%)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(rightColumn, {
                  opacity: 0,
                  width: "50%",
                  clipPath: "inset(0 0 0% 100%)",
                  duration: 0.1,
                }),
              () =>
                gsap.to(stampText, {
                  opacity: 1,
                  scale: 1,
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.1,
                }),
            ]);
          }
          // Phase 8: Zoom out and fade to transition to Vision (90-100% of 800vh)
          else {
            const zoomProgress = (progress - PHASE_8_START) / (1 - PHASE_8_START);
            const scale = 1 + zoomProgress * 5;
            const opacity = 1 - zoomProgress;

            batchAnimations([
              () =>
                gsap.to(container, {
                  opacity: opacity,
                  visibility: opacity > 0 ? "visible" : "hidden",
                  duration: 0.1,
                }),
              () =>
                gsap.to(stampText, {
                  opacity: 1 - zoomProgress,
                  scale: scale,
                  duration: 0.1,
                }),
            ]);

            if (progress >= HIDE_THRESHOLD && !isHiddenRef.current) {
              isHiddenRef.current = true;
            } else if (progress < HIDE_THRESHOLD && isHiddenRef.current) {
              isHiddenRef.current = false;
            }
          }
        } else if (scrollY > purposeEnd) {
          if (!isHiddenRef.current) isHiddenRef.current = true;
          batchAnimations([
            () =>
              gsap.to(container, {
                opacity: 0,
                visibility: "hidden",
                duration: 0.1,
              }),
          ]);
        } else if (scrollY < purposeStart) {
          if (isHiddenRef.current) isHiddenRef.current = false;
          batchAnimations([
            () =>
              gsap.to(container, {
                opacity: 0,
                visibility: "hidden",
                duration: 0.1,
              }),
            () => gsap.to(leftColumn, { opacity: 0, duration: 0.1 }),
            () => gsap.to(rightColumn, { opacity: 0, duration: 0.1 }),
            () => gsap.to(stampText, { opacity: 0, duration: 0.1 }),
          ]);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      killAllAnimations();
    };
  }, [updateViewportCache, batchAnimations, killAllAnimations]);

  // Handle isHidden state for CSS - only apply when hidden, don't interfere with GSAP
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastHiddenState = false;

    const checkHidden = () => {
      const currentHidden = isHiddenRef.current;
      
      // Only update if state changed
      if (currentHidden !== lastHiddenState) {
        lastHiddenState = currentHidden;
        
        if (currentHidden) {
          // Force hide when needed
          container.style.cssText = `
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            display: none !important;
          `;
        } else {
          // Remove forced styles to let GSAP control visibility
          container.style.removeProperty('opacity');
          container.style.removeProperty('visibility');
          container.style.removeProperty('pointer-events');
          container.style.removeProperty('display');
        }
      }
    };

    // Check periodically (since we're using refs now)
    const interval = setInterval(checkHidden, 100);
    checkHidden();

    return () => clearInterval(interval);
  }, []);

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

  // Strengthen guards and cleanup when leaving bounds
  useEffect(() => {
    if (!isDesktop() || reduceMotionRef.current) return;
    const onScrollBounds = () => {
      if (!isSnappingRef.current) return;
      const { top, end } = getPurposeBounds();
      const y = window.scrollY;
      if (y < top - 2 || y > end + 2) {
        isSnappingRef.current = false;
        pendingTargetRef.current = null;
      }
    };
    window.addEventListener("scroll", onScrollBounds, { passive: true });
    return () => window.removeEventListener("scroll", onScrollBounds);
  }, [isDesktop, getPurposeBounds]);

  // Keyboard snapping within Purpose bounds
  useEffect(() => {
    if (!isDesktop() || reduceMotionRef.current) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (recentTouchRef.current) return;
      const { top, end } = getPurposeBounds();
      const y = window.scrollY;
      
      // Allow free scrolling outside Purpose section bounds
      if (y < top || y > end) return;

      let dir: 1 | -1 | 0 = 0;
      switch (e.code) {
        case "ArrowDown":
        case "PageDown":
          dir = 1;
          break;
        case "ArrowUp":
        case "PageUp":
          dir = -1;
          break;
        case "Space":
          dir = e.shiftKey ? -1 : 1;
          break;
        default:
          break;
      }
      if (dir === 0) return;
      if (isSnappingRef.current) {
        e.preventDefault();
        return;
      }

      const current = getProgress();
      
      // Allow scrolling back to Hero if at start and scrolling up
      if (dir === -1 && current <= 0.01) {
        // Don't prevent default - allow normal scroll to Hero
        return;
      }
      
      // Allow scrolling forward to next section if at end and scrolling down
      if (dir === 1 && current >= 0.99) {
        // Don't prevent default - allow normal scroll to next section
        return;
      }
      
      const targetProgress = findNextSnap(dir as 1 | -1, current);
      
      // If target is the same as current (already at snap point), allow normal scroll
      if (Math.abs(targetProgress - current) < 0.01) {
        return;
      }
      
      const targetY = toScrollY(targetProgress);
      isSnappingRef.current = true;
      pendingTargetRef.current = targetY;
      lastSnapTimeRef.current = Date.now();
      e.preventDefault();
      window.scrollTo({ top: targetY, behavior: "smooth" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDesktop, getProgress, toScrollY, getPurposeBounds]);

  // Wheel snapping within Purpose bounds
  useEffect(() => {
    if (!isDesktop() || reduceMotionRef.current) return;

    const onTouchStart = () => {
      recentTouchRef.current = true;
      setTimeout(() => {
        recentTouchRef.current = false;
      }, 800);
    };

    const onWheel = (e: WheelEvent) => {
      if (recentTouchRef.current) return;
      const now = Date.now();
      const { top, end } = getPurposeBounds();
      const y = window.scrollY;
      
      // Allow free scrolling outside Purpose section bounds
      if (y < top || y > end) return;
      
      if (Math.abs(e.deltaY) < 2) return;
      if (isSnappingRef.current && pendingTargetRef.current !== null) {
        e.preventDefault();
        return;
      }
      if (now - lastSnapTimeRef.current < 350) {
        e.preventDefault();
        return;
      }

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const current = getProgress();
      
      // Allow scrolling back to Hero if at start and scrolling up
      if (dir === -1 && current <= 0.01) {
        // Don't prevent default - allow normal scroll to Hero
        return;
      }
      
      // Allow scrolling forward to next section if at end and scrolling down
      if (dir === 1 && current >= 0.99) {
        // Don't prevent default - allow normal scroll to next section
        return;
      }
      
      const targetProgress = findNextSnap(dir, current);
      
      // If target is the same as current (already at snap point), allow normal scroll
      if (Math.abs(targetProgress - current) < 0.01) {
        return;
      }
      
      const targetY = toScrollY(targetProgress);
      isSnappingRef.current = true;
      pendingTargetRef.current = targetY;
      lastSnapTimeRef.current = now;
      e.preventDefault();
      window.scrollTo({ top: targetY, behavior: "smooth" });
    };

    const settleCheck = () => {
      if (!isSnappingRef.current || pendingTargetRef.current === null) return;
      const diff = Math.abs(window.scrollY - pendingTargetRef.current);
      if (diff <= 1) {
        isSnappingRef.current = false;
        pendingTargetRef.current = null;
      } else {
        requestAnimationFrame(settleCheck);
      }
    };

    const onScroll = () => {
      if (isSnappingRef.current) {
        requestAnimationFrame(settleCheck);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isDesktop, getProgress, toScrollY, getPurposeBounds]);

  return (
    <section ref={sectionRef} className={styles.section} data-section="purpose">
      <div ref={containerRef} className={styles.container}>
        {/* Page Title */}
        <h2 ref={pageTitleRef} className={styles.pageTitle}>
          Why We Exist
        </h2>

        {/* Content Wrapper for Columns */}
        <div className={styles.columnsWrapper}>
          {/* Left Column - Text */}
          <div
            ref={leftColumnRef}
            className={`${styles.leftColumn} ${
              isTwoColumnLayout ? styles.leftAligned : ""
            }`}
          >
            <p className={styles.description}>
              In a world that mastered scaling information,
              <br />
              we&apos;re pioneering the scaling of true mentorship.
              <br />
              <br />
              Every mind deserves the guidance to unlock its full potential.
            </p>
          </div>

          {/* Right Column - Video */}
          <div ref={rightColumnRef} className={styles.rightColumn}>
            <div className={styles.videoWrapper}>
              <iframe
                ref={iframeRef}
                src="https://www.youtube.com/embed/lXUZvyajciY?si=5XqJBJOZJH9FTJvE&amp;clip=Ugkxf4syWiYWekyEMRQMZk9T9xthR4ybT4Ch&amp;clipt=ELi46QMY0JTqAw&controls=1&modestbranding=1&rel=0&playsinline=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className={styles.iframe}
              ></iframe>
            </div>
          </div>
        </div>

        {/* Stamp Text - "Our Purpose" */}
        <div ref={stampTextRef} className={styles.stampText}>
          <h2 className={styles.stampTitle}>Our Purpose</h2>
          <p className={styles.stampDescription}>
            Democratizing Personal Tutoring for Every Learner
          </p>
        </div>
      </div>
    </section>
  );
}
