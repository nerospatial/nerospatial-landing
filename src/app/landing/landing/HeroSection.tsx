"use client";

import Aurora from "@/components/Aurora";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <Aurora
        colorStops={["#3b82f6", "#60a5fa", "#1e40af", "#fafafa"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div className={styles.heroContent}>
        {/* Hero section content will go here */}
      </div>
    </section>
  );
}
