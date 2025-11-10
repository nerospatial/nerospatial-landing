"use client";

import styles from "./TechnologySection.module.css";

export default function TechnologySection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Technology — How It Works (High-Level)</h2>
        <p className={styles.description}>
          Show intellectual depth, but remain approachable.
        </p>

        <div className={styles.flow}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Perceive</h3>
            <p className={styles.stepText}>Cameras, mics, spatial inputs sense surroundings.</p>
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Understand</h3>
            <p className={styles.stepText}>AI contextualizes your world.</p>
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Respond</h3>
            <p className={styles.stepText}>Personalized audio/visual mentorship.</p>
          </div>
        </div>

        <div className={styles.visualNote}>
          [Visual: animated schematic (simple geometric shapes, minimal text)]
        </div>
      </div>
    </section>
  );
}