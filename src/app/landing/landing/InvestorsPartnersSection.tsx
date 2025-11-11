"use client";

import styles from "./InvestorsPartnersSection.module.css";

export default function InvestorsPartnersSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Investors/Partners</h2>
        <p className={styles.description}>
          Convert interest into collaboration.
        </p>

        <div className={styles.content}>
          We&apos;re working with educators, innovators, and believers who want
          to reshape how humans learn.
        </div>

        <div className={styles.buttons}>
          <button className={styles.primaryButton}>Explore Partnership</button>
          <button className={styles.secondaryButton}>View Investor Deck</button>
        </div>

        <div className={styles.visualNote}>
          [Purpose: Convert interest into collaboration]
        </div>
      </div>
    </section>
  );
}
