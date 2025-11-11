"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isTwoColumnLayout, setIsTwoColumnLayout] = useState(false);

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

      // Purpose section starts at ~196vh
      const purposeStart = (200 * viewportHeight * 0.98) / 100;
      const purposeEnd = purposeStart + (500 * viewportHeight) / 100;

      if (scrollY >= purposeStart && scrollY <= purposeEnd) {
        const progress = (scrollY - purposeStart) / (purposeEnd - purposeStart);

        // Phase 1: Fade in only text in center, taking full width (0-20% of 500vh)
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
            width: "100%",
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
        // Phase 2: Shrink left container, expand right container space (20-40% of 500vh)
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

          // Gradually shrink left column from 100% to 50%
          const leftWidth = 100 - phase2Progress * 50;
          gsap.to(leftColumn, {
            opacity: 1,
            width: `${leftWidth}%`,
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
        // Phase 3: Fade in video in the right column (40-60% of 500vh)
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
        // Phase 4: Hold both columns visible (60-70% of 500vh)
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
        // Phase 5: Fold up both columns AND page title (70-75% of 500vh)
        else if (progress <= 0.75) {
          const fadeOutProgress = (progress - 0.7) / 0.05;
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
        // Phase 6: Unfold "Our Purpose" text (75-78% of 500vh)
        else if (progress <= 0.78) {
          const stampProgress = (progress - 0.75) / 0.03;
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
        // Phase 7: Hold stamp (78-85% of 500vh)
        else if (progress <= 0.85) {
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
        // Phase 8: Zoom out and fade to transition to Vision (85-100% of 500vh)
        else {
          const zoomProgress = (progress - 0.85) / 0.15;
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

  const handleVideoClick = () => {
    const iframe = iframeRef.current;
    if (!iframe || isVideoPlaying) return;

    // Add autoplay to iframe src
    const currentSrc = iframe.src;
    if (!currentSrc.includes("autoplay=1")) {
      iframe.src = currentSrc + "&autoplay=1";
      setIsVideoPlaying(true);
    }
  };

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
              Humanity learned to scale content, not understanding.
              <br />
              We&apos;re here to scale mentorship — so every mind can reach its
              potential.
            </p>
          </div>

          {/* Right Column - Video */}
          <div ref={rightColumnRef} className={styles.rightColumn}>
            <div className={styles.videoWrapper} onClick={handleVideoClick}>
              {!isVideoPlaying && (
                <div className={styles.playOverlay}>
                  <div className={styles.playButton}>▶</div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                width="560"
                height="315"
                src="https://www.youtube.com/embed/lXUZvyajciY?si=5XqJBJOZJH9FTJvE&amp;clip=Ugkxf4syWiYWekyEMRQMZk9T9xthR4ybT4Ch&amp;clipt=ELi46QMY0JTqAw"
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
            Enabling Personal Tutoring to everyone
          </p>
        </div>
      </div>
    </section>
  );
}
