"use client";

import { useState, useEffect } from "react";
import Loader from "../core/components/Loader";
import Aurora from "@/components/Aurora";
import HeroSection from "@/app/landing/landing/HeroSection";
import BlurTransition from "@/app/landing/landing/BlurTransition";
import ProductsSection from "@/app/landing/landing/ProductsSection";
import styles from "./page.module.css";

export default function Landing() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuroraFaded, setIsAuroraFaded] = useState(false);

  const handleLoaderComplete = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.6; // 60vh - hero section height
      const fadeEnd = heroHeight * 0.8; // Complete fade at 80% of hero height

      setIsAuroraFaded(scrollY > fadeEnd);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />
      {isLoaded && (
        <>
          <div
            className={`${styles.auroraBackground} ${
              isAuroraFaded ? styles.faded : ""
            }`}
          >
            <Aurora
              colorStops={["#3A29FF", "#FF94B4", "#fa632f"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
            />
          </div>
          <div className={styles.landing}>
            <HeroSection />
            <BlurTransition />
            <ProductsSection />
          </div>
        </>
      )}
    </>
  );
}
