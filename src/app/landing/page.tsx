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

  const productImages = [
    "/assets/landing/toy_image-nobg.png",
    "/assets/landing/glasses.png",
    "/assets/landing/nero-personas.png"
  ];

  return (
    <>
      <Loader onComplete={handleLoaderComplete} images={productImages} />
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
            <section id="hero">
              <HeroSection />
            </section>
            <section id="purpose">
              <PurposeSection />
            </section>
            <section id="vision">
              <VisionSection />
            </section>
            <section id="products">
              <ProductsSection />
            </section>
            <section id="technology">
              <TechnologySection />
            </section>
            <section id="contact">
              <ContactSection />
            </section>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}
