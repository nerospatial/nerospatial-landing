"use client";

import { useState } from "react";
import Loader from "../core/components/Loader";
import HeroSection from "@/app/landing/landing/HeroSection";
import BlurTransition from "@/app/landing/landing/BlurTransition";
import ProductsSection from "@/app/landing/landing/ProductsSection";
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
          <HeroSection />
          <BlurTransition />
          <ProductsSection />
        </div>
      )}
    </>
  );
}
