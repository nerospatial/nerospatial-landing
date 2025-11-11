"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const content = contentRef.current;

    if (!hero || !content) return;

    // Create the parallax animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top", // Start when hero top reaches viewport top
        end: "bottom top", // End when hero bottom reaches viewport top (200vh total)
        scrub: 1, // Smooth scrubbing
        pin: content, // Pin the content so it stays fixed in viewport
        pinSpacing: false, // Don't add extra space for pinning
      },
    });

    // Animation sequence:
    // During scroll through 200vh: scale UP massively and fade out (zooming toward you effect)
    tl.fromTo(
      content,
      {
        scale: 1, // Start at normal size
        opacity: 1, // Start fully visible
        z: 0, // Start at normal depth
      },
      {
        scale: 5.5, // Scale UP to 550% (text grows much larger, coming at viewer)
        opacity: 0, // Fade to transparent
        z: 1000, // Move toward viewer in 3D space
        ease: "power2.in", // Accelerating ease for rushing effect
        duration: 1,
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div ref={contentRef} className={styles.heroContent}>
        <h1 className={styles.mainTitle}>NeroSpatial</h1>
        <h2 className={styles.subtitle}>Building Spatially Aware AI Tutors</h2>
      </div>
    </section>
  );
}
