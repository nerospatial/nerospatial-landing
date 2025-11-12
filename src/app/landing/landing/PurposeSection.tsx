"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./PurposeSection.module.css";

export default function PurposeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageTitleRef = useRef<HTMLHeadingElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const stampTextRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isHidden, setIsHidden] = useState(false);
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

  const isDesktop = () =>
    typeof window !== "undefined" && window.innerWidth >= 768;

  const getPurposeBounds = () => {
    const section = sectionRef.current;
    if (!section) return { top: 0, height: 0, end: 0 };
    const rect = section.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const height = section.offsetHeight;
    return { top, height, end: top + height };
  };

  const getProgress = useCallback(() => {
    const { top, height } = getPurposeBounds();
    if (height <= 0) return 0;
    const y = window.scrollY;
    return Math.min(1, Math.max(0, (y - top) / height));
  }, []);

  const toScrollY = useCallback((progress: number) => {
    const { top, height } = getPurposeBounds();
    return Math.round(top + progress * height);
  }, []);

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

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;

      // Purpose section starts at ~196vh
      const purposeStart = (200 * viewportHeight * 0.98) / 100;
      const purposeEnd = purposeStart + (800 * viewportHeight) / 100;

      if (scrollY >= purposeStart && scrollY <= purposeEnd) {
        const progress = (scrollY - purposeStart) / (purposeEnd - purposeStart);

        // Mobile: simplified condensed sequence (fade in/out)
        if (isMobile) {
          // container fade in/out
          gsap.to(container, {
            opacity: 1,
            visibility: "visible",
            duration: 0.1,
          });
          // simple staged fades
          const p1 = Math.min(progress / 0.25, 1); // 0-25%
          const p2 =
            progress > 0.25 ? Math.min((progress - 0.25) / 0.25, 1) : 0; // 25-50%
          const p3 = progress > 0.5 ? Math.min((progress - 0.5) / 0.2, 1) : 0; // 50-70%
          const fadeOut =
            progress > 0.8 ? Math.min((progress - 0.8) / 0.2, 1) : 0; // 80-100%

          gsap.to(pageTitle, {
            opacity: 1 - fadeOut,
            clipPath: `inset(0 0 ${100 - p1 * 100}% 0)`,
            duration: 0.1,
          });
          gsap.to(leftColumn, {
            opacity: 1 - fadeOut,
            width: "100%",
            clipPath: `inset(0 0 ${100 - p1 * 100}% 0)`,
            duration: 0.1,
          });
          gsap.to(rightColumn, {
            opacity: p2 * (1 - fadeOut),
            width: "100%",
            clipPath: `inset(0 0 ${100 - p2 * 100}% 0)`,
            duration: 0.1,
          });
          gsap.to(stampText, {
            opacity: p3 * (1 - fadeOut),
            scale: 1,
            clipPath: `inset(0 0 ${100 - p3 * 100}% 0)`,
            duration: 0.1,
          });
          return;
        }

        // Phase 1: Fade in only text in center, taking full width (0-20% of 800vh)
        const phase1End = 0.2;
        if (progress <= phase1End) {
          const fadeInProgress = progress / phase1End;
          gsap.to(container, {
            opacity: 1,
            visibility: "visible",
            duration: 0.1,
          });
          // Unfold page title from top to bottom
          gsap.to(pageTitle, {
            opacity: fadeInProgress,
            clipPath: `inset(0 0 ${100 - fadeInProgress * 100}% 0)`,
            duration: 0.1,
          });
          // Unfold left column from top to bottom
          gsap.to(leftColumn, {
            opacity: fadeInProgress,
            width: "800px",
            clipPath: `inset(0 0 ${100 - fadeInProgress * 100}% 0)`,
            duration: 0.1,
          });
          // Right column exists but takes no space and is invisible
          gsap.to(rightColumn, {
            opacity: 0,
            width: "0%",
            clipPath: "inset(0 0 100% 0)",
            duration: 0.1,
          });
          gsap.to(stampText, {
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.1,
          });
          if (isHidden) setIsHidden(false);
        }
        // Phase 2: Shrink left container, expand right container space (20-40% of 800vh)
        else if (progress <= 0.4) {
          const phase2Progress = (progress - phase1End) / (0.4 - phase1End);
          gsap.to(container, {
            opacity: 1,
            visibility: "visible",
            duration: 0.1,
          });

          // Keep page title visible
          gsap.to(pageTitle, {
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.1,
          });

          // Enable two-column layout mode for left alignment
          if (!isTwoColumnLayout) setIsTwoColumnLayout(true);

          // Gradually shrink left column from 800px to 50%
          gsap.to(leftColumn, {
            opacity: 1,
            width: "50%",
            clipPath: "inset(0 0 0% 0)",
            duration: 0.1,
          });

          // Gradually expand right column from 0% to 50% but keep invisible
          const rightWidth = phase2Progress * 50;
          gsap.to(rightColumn, {
            opacity: 0,
            width: `${rightWidth}%`,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.1,
          });
          gsap.to(stampText, {
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.1,
          });
        }
        // Phase 3: Fade in video in the right column (40-60% of 800vh)
        else if (progress <= 0.6) {
          const phase3Progress = (progress - 0.4) / (0.6 - 0.4);
          gsap.to(container, {
            opacity: 1,
            visibility: "visible",
            duration: 0.1,
          });

          // Keep page title visible
          gsap.to(pageTitle, {
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.1,
          });

          // Keep 50-50 layout
          gsap.to(leftColumn, {
            opacity: 1,
            width: "50%",
            clipPath: "inset(0 0 0% 0)",
            duration: 0.1,
          });

          // Unfold video from top to bottom as it fades in
          gsap.to(rightColumn, {
            opacity: phase3Progress,
            width: "50%",
            clipPath: `inset(0 0 ${100 - phase3Progress * 100}% 0)`,
            duration: 0.1,
          });
          gsap.to(stampText, {
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.1,
          });
        }
        // Phase 4: Hold both columns visible (60-70% of 800vh)
        else if (progress <= 0.7) {
          gsap.to(container, {
            opacity: 1,
            visibility: "visible",
            duration: 0.1,
          });
          // Keep page title visible
          gsap.to(pageTitle, {
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.1,
          });
          gsap.to(leftColumn, {
            opacity: 1,
            width: "50%",
            clipPath: "inset(0 0 0% 0)",
            duration: 0.1,
          });
          gsap.to(rightColumn, {
            opacity: 1,
            width: "50%",
            clipPath: "inset(0 0 0% 0)",
            duration: 0.1,
          });
          gsap.to(stampText, {
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.1,
          });
        }
        // Phase 5: Fold up both columns AND page title (70-85% of 800vh)
        else if (progress <= 0.85) {
          const fadeOutProgress = (progress - 0.7) / 0.15;
          gsap.to(container, {
            opacity: 1,
            visibility: "visible",
            duration: 0.1,
          });
          // Fold up page title from bottom to top
          gsap.to(pageTitle, {
            opacity: 1 - fadeOutProgress,
            clipPath: `inset(0 0 0% ${fadeOutProgress * 100}%)`,
            duration: 0.1,
          });
          // Fold up left column from bottom to top
          gsap.to(leftColumn, {
            opacity: 1 - fadeOutProgress,
            width: "50%",
            clipPath: `inset(0 0 0% ${fadeOutProgress * 100}%)`,
            duration: 0.1,
          });
          // Fold up right column from bottom to top
          gsap.to(rightColumn, {
            opacity: 1 - fadeOutProgress,
            width: "50%",
            clipPath: `inset(0 0 0% ${fadeOutProgress * 100}%)`,
            duration: 0.1,
          });
          gsap.to(stampText, {
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.1,
          });
        }
        // Phase 6: Unfold "Our Purpose" text (85-87.5% of 800vh)
        else if (progress <= 0.875) {
          const stampProgress = (progress - 0.85) / 0.025;
          gsap.to(container, {
            opacity: 1,
            visibility: "visible",
            duration: 0.1,
          });
          // Keep page title hidden
          gsap.to(pageTitle, {
            opacity: 0,
            clipPath: "inset(0 0 0% 100%)",
            duration: 0.1,
          });
          gsap.to(leftColumn, {
            opacity: 0,
            width: "50%",
            clipPath: "inset(0 0 0% 100%)",
            duration: 0.1,
          });
          gsap.to(rightColumn, {
            opacity: 0,
            width: "50%",
            clipPath: "inset(0 0 0% 100%)",
            duration: 0.1,
          });
          // Unfold stamp text from top to bottom
          gsap.to(stampText, {
            opacity: stampProgress,
            scale: 1,
            clipPath: `inset(0 0 ${100 - stampProgress * 100}% 0)`,
            duration: 0.1,
          });
        }
        // Phase 7: Hold stamp (87.5-90% of 800vh)
        else if (progress <= 0.9) {
          gsap.to(container, {
            opacity: 1,
            visibility: "visible",
            duration: 0.1,
          });
          // Keep page title hidden
          gsap.to(pageTitle, {
            opacity: 0,
            clipPath: "inset(0 0 0% 100%)",
            duration: 0.1,
          });
          gsap.to(leftColumn, {
            opacity: 0,
            width: "50%",
            clipPath: "inset(0 0 0% 100%)",
            duration: 0.1,
          });
          gsap.to(rightColumn, {
            opacity: 0,
            width: "50%",
            clipPath: "inset(0 0 0% 100%)",
            duration: 0.1,
          });
          gsap.to(stampText, {
            opacity: 1,
            scale: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.1,
          });
        }
        // Phase 8: Zoom out and fade to transition to Vision (90-100% of 800vh - 100vh dedicated to this phase)
        else {
          const zoomProgress = (progress - 0.9) / 0.1;
          const scale = 1 + zoomProgress * 5;
          const opacity = 1 - zoomProgress;

          gsap.to(container, {
            opacity: opacity,
            visibility: opacity > 0 ? "visible" : "hidden",
            duration: 0.1,
          });
          gsap.to(stampText, {
            opacity: 1 - zoomProgress,
            scale: scale,
            duration: 0.1,
          });

          if (progress >= 0.98 && !isHidden) {
            setIsHidden(true);
          } else if (progress < 0.98 && isHidden) {
            setIsHidden(false);
          }
        }
      } else if (scrollY > purposeEnd) {
        if (!isHidden) setIsHidden(true);
        gsap.to(container, { opacity: 0, visibility: "hidden", duration: 0.1 });
      } else if (scrollY < purposeStart) {
        if (isHidden) setIsHidden(false);
        gsap.to(container, {
          opacity: 0,
          visibility: "hidden",
          duration: 0.1,
        });
        gsap.to(leftColumn, { opacity: 0, duration: 0.1 });
        gsap.to(rightColumn, { opacity: 0, duration: 0.1 });
        gsap.to(stampText, { opacity: 0, duration: 0.1 });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHidden, isTwoColumnLayout]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isHidden) {
      container.style.cssText = `
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        display: none !important;
      `;
    } else {
      container.style.cssText = `
        opacity: "";
        visibility: "";
        pointer-events: "";
        display: "";
      `;
    }
  }, [isHidden]);

  // No custom video controls; let YouTube UI handle playback

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
  }, []);

  // Keyboard snapping within Purpose bounds
  useEffect(() => {
    if (!isDesktop() || reduceMotionRef.current) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (recentTouchRef.current) return;
      const { top, end } = getPurposeBounds();
      const y = window.scrollY;
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
      const targetProgress = findNextSnap(dir as 1 | -1, current);
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
  }, [getProgress, toScrollY]);

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
      const targetProgress = findNextSnap(dir, current);
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
  }, [getProgress, toScrollY]);

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
