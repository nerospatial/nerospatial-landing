"use client";

import { useState } from "react";
import Loader from "../core/components/Loader";
import Aurora from "@/components/Aurora";
import HeroSection from "./landing/HeroSection";
import NavBar from "./landing/NavBar";
import PurposeSection from "./landing/PurposeSection";
import VisionSection from "./landing/VisionSection";
import ProductsSection from "./landing/ProductsSection";
import TechnologySection from "./landing/TechnologySection";
import ContactSection from "./landing/ContactSection";
import Footer from "./landing/Footer";
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
            <ContactSection />
            <Footer />
          </div>
        </>
      )}
    </>
  );
}
