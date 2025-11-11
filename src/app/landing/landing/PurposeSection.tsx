"use client";

import styles from "./PurposeSection.module.css";

export default function PurposeSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Purpose — Why We Exist</h2>
        <p className={styles.description}>
          Humanity learned to scale content, not understanding.
          <br />
          We&apos;re here to scale mentorship — so every mind can reach its
          potential.
        </p>
        <div className={styles.visualNote}>
          [Visual idea: short looping video — student walking, AI voice
          whispering explanation, symbolizing contextual learning]
        </div>
      </div>
    </section>
  );
}
