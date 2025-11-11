"use client";

import styles from "./ExperienceSection.module.css";

export default function ExperienceSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Experience — Learning That Lives With You
        </h2>
        <p className={styles.description}>
          Sell the emotional &quot;aha&quot; — what it feels like.
        </p>

        <div className={styles.tagline}>
          &quot;It&apos;s not EdTech. It&apos;s intelligence that moves with
          you.&quot;
        </div>

        <div className={styles.visualNote}>
          [Visual narrative: Montage of people: student, engineer, child,
          teacher — all guided ambiently]
        </div>
      </div>
    </section>
  );
}
