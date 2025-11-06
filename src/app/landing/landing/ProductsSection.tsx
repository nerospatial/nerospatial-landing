"use client";

import styles from "./ProductsSection.module.css";

const products = [
  {
    title: "NeroCore",
    description: "Advanced AI processing engine for spatial intelligence",
  },
  {
    title: "NeroSpatial SDK",
    description: "Developer toolkit for AR/AI spatial applications",
  },
  {
    title: "NeroVision",
    description: "Computer vision platform for real-time spatial analysis",
  },
];

export default function ProductsSection() {
  return (
    <section className={styles.products}>
      <div className={styles.productsContent}>
        <h2 className={styles.sectionTitle}>Our Products</h2>
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.title} className={styles.productCard}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
