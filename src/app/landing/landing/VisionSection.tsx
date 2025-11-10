"use client";

import styles from "./VisionSection.module.css";

export default function VisionSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Vision — What We&apos;re Building</h2>
        <p className={styles.description}>
          Explain what NeroSpatial is, but philosophically — not feature-wise.
        </p>

        <div className={styles.subsections}>
          <div className={styles.subsection}>
            <h3 className={styles.subtitle}>Spatial Companions</h3>
            <p className={styles.subtext}>AI that perceives the real world.</p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subtitle}>Contextual Intelligence</h3>
            <p className={styles.subtext}>Learns from your environment and behavior.</p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subtitle}>Personal Growth Ecosystem</h3>
            <p className={styles.subtext}>Evolves with you over time.</p>
          </div>
        </div>

        <div className={styles.visualNote}>
          [Tone: aspirational; show humans interacting seamlessly with devices, not screens]
        </div>
      </div>
    </section>
  );
}