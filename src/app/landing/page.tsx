"use client";

import { useState } from "react";
import Loader from "../core/components/Loader";
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
        <div className={styles.page}>
          {/* Landing page content will go here */}
          <h1>Welcome to NeroSpatial</h1>
          <p>AR/AI Spatial Intelligence Platform</p>
        </div>
      )}
    </>
  );
}
