"use client";

import { useState } from "react";
import Loader from "../core/components/Loader";
import GradientBlinds from "@/components/GradientBlinds";
import GradualBlur from "@/components/GradualBlur";
import styles from "./page.module.css";

export default function Landing() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaderComplete = () => {
    setIsLoaded(true);
  };

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />
      {isLoaded && (
        <div className={styles.landing}>
          {/* Hero Section */}
          <section className={styles.hero}>
            <GradientBlinds
              gradientColors={["#FF9FFC", "#5227FF"]}
              angle={45}
              noise={0.3}
              blindCount={12}
              blindMinWidth={50}
              spotlightRadius={0.5}
              spotlightSoftness={1}
              spotlightOpacity={1}
              mouseDampening={0.15}
              distortAmount={0}
              shineDirection="left"
              mixBlendMode="lighten"
            />
            <div className={styles.heroContent}>
              {/* Hero section content will go here */}
            </div>
          </section>

          {/* Fixed Gradual Blur Transition - stays in place while content scrolls underneath */}
          <div className={styles.heroBlurWrapper}>
            <GradualBlur
              position="bottom"
              strength={8}
              height="300px"
              opacity={1}
              className={styles.sectionTransition}
            />
          </div>

          {/* Products Section */}
          <section className={styles.products}>
            <div className={styles.productsContent}>
              <h2 className={styles.sectionTitle}>Our Products</h2>
              <div className={styles.productsGrid}>
                <div className={styles.productCard}>
                  <h3>NeroCore</h3>
                  <p>Advanced AI processing engine for spatial intelligence</p>
                </div>
                <div className={styles.productCard}>
                  <h3>NeroSpatial SDK</h3>
                  <p>Developer toolkit for AR/AI spatial applications</p>
                </div>
                <div className={styles.productCard}>
                  <h3>NeroVision</h3>
                  <p>Computer vision platform for real-time spatial analysis</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
