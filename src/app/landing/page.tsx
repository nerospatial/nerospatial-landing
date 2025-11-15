"use client";

import { useState } from "react";
import Loader from "../core/components/Loader";
import Aurora from "@/components/Aurora";
import HeroSection from "@/app/landing/landing/HeroSection";
import NavBar from "@/app/landing/landing/NavBar";
import PurposeSection from "@/app/landing/landing/PurposeSection";
import VisionSection from "@/app/landing/landing/VisionSection";
import ProductsSection from "@/app/landing/landing/ProductsSection";
import TechnologySection from "@/app/landing/landing/TechnologySection";
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
        <>
          <div className={styles.auroraBackground}>
            <Aurora
              colorStops={["#1e293b", "#334155", "#475569"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
            />
          </div>
          <NavBar />

          <div className={styles.landing}>
            <HeroSection />
            <PurposeSection />
            <VisionSection />
            <ProductsSection />
            <TechnologySection />
          </div>
        </>
      )}
    </>
  );
}
