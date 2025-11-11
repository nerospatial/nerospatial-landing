"use client";

import styles from "./ProductsSection.module.css";

export default function ProductsSection() {
  const products = [
    {
      name: "NeroCore",
      tagline: "Audio-first smart glasses for everyday learners",
    },
    {
      name: "NeroGlance",
      tagline: "AR glasses bringing concepts to life visually",
    },
    {
      name: "NeroDivine",
      tagline: "AI toys teaching values through stories",
    },
    {
      name: "NeroPersonas",
      tagline: "Cloud AI mentors powering all NeroSpatial devices",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Products — The Form Factors</h2>
        <p className={styles.description}>
          Ground the vision into real products. Show the ecosystem, not just
          gadgets.
        </p>

        <div className={styles.productsGrid}>
          {products.map((product, index) => (
            <div key={index} className={styles.productCard}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productTagline}>{product.tagline}</p>
              <button className={styles.productLink}>Learn More →</button>
            </div>
          ))}
        </div>

        <div className={styles.visualNote}>
          [Each card: clean render, short line, link → dedicated product page]
        </div>
      </div>
    </section>
  );
}
