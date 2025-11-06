"use client";

import { useState, useEffect } from "react";
import BlurText from "@/components/BlurText";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const [contentOpacity, setContentOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.6; // 60vh - hero section height
      const fadeStart = heroHeight * 0.3; // Start fading at 30% of hero height
      const fadeEnd = heroHeight * 0.6; // Complete fade at 80% of hero height

      if (scrollY < fadeStart) {
        setContentOpacity(1);
      } else if (scrollY > fadeEnd) {
        setContentOpacity(0);
      } else {
        // Linear fade between fadeStart and fadeEnd
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setContentOpacity(1 - progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent} style={{ opacity: contentOpacity }}>
        <div className={styles.titleWrapper}>
          <BlurText
            text="NeroSpatial"
            delay={100}
            animateBy="letters"
            direction="top"
            className={styles.heroTitle}
          />
        </div>
        <p className={styles.subtitle}>Education of New Era</p>
        <div className={styles.ctaButtons}>
          <button className={styles.ctaButton}>Get Started</button>
          <button className={styles.ctaButtonSecondary}>Learn More</button>
        </div>
      </div>
    </section>
  );
}
