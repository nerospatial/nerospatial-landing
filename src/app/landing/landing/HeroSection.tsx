"use client";

import { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const [contentOpacity, setContentOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight; // 100vh - full viewport height
      const fadeStart = heroHeight * 0.7; // Start fading at 70% of hero height
      const fadeEnd = heroHeight * 0.9; // Complete fade at 90% of hero height

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
        <h1 className={styles.mainTitle}>NeroSpatial</h1>
        <h2 className={styles.subtitle}>Building Spatially Aware AI Tutors</h2>
      </div>
    </section>
  );
}
