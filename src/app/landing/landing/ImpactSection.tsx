"use client";

import styles from "./ImpactSection.module.css";

export default function ImpactSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Impact — The New Age of Learning</h2>
        <p className={styles.description}>
          Frame the mission as world-changing.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>90%</div>
            <div className={styles.statText}>
              of learners lack contextual mentorship
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statNumber}>100M+</div>
            <div className={styles.statText}>students learning online</div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statNumber}>EdTech Fatigue</div>
            <div className={styles.statText}>→ contextual learning demand</div>
          </div>
        </div>

        <div className={styles.cta}>
          <button className={styles.ctaButton}>Partner with Us</button>
          <button className={styles.secondaryButton}>See Our Research</button>
        </div>

        <div className={styles.visualNote}>[Stats & social proof elements]</div>
      </div>
    </section>
  );
}
