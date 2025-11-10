"use client";

import { useState, useEffect } from "react";
import Loader from "../core/components/Loader";
import Aurora from "@/components/Aurora";
import HeroSection from "@/app/landing/landing/HeroSection";
import NavBar from "@/app/landing/landing/NavBar";
import PurposeSection from "@/app/landing/landing/PurposeSection";
import VisionSection from "@/app/landing/landing/VisionSection";
import TechnologySection from "@/app/landing/landing/TechnologySection";
import ProductsSection from "@/app/landing/landing/ProductsSection";
import ExperienceSection from "@/app/landing/landing/ExperienceSection";
import ImpactSection from "@/app/landing/landing/ImpactSection";
import AboutUsSection from "@/app/landing/landing/AboutUsSection";
import InvestorsPartnersSection from "@/app/landing/landing/InvestorsPartnersSection";
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
      const heroHeight = window.innerHeight; // 100vh - full viewport height

      setIsAuroraFaded(scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
              colorStops={["#1e293b", "#334155", "#475569"]}
              blend={0.6}
              amplitude={1.0}
              speed={0.5}
            />
          </div>
          <NavBar />

          <div className={styles.landing}>
            <HeroSection />
            <PurposeSection />
            <VisionSection />
            <TechnologySection />
            <ProductsSection />
            <ExperienceSection />
            <ImpactSection />
            <AboutUsSection />
            <InvestorsPartnersSection />
          </div>
        </>
      )}
    </>
  );
}
