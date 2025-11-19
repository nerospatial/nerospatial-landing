"use client";

import { useEffect, useState } from "react";
import CountUp from "@/components/CountUp";
import styles from "./Loader.module.css";

interface LoaderProps {
  onComplete?: () => void;
  duration?: number;
  images?: string[];
}

export default function Loader({ onComplete, duration = 3000, images = [] }: LoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showCountUp, setShowCountUp] = useState(true);

  useEffect(() => {
    const startTime = Date.now();

    const preloadImages = async () => {
      if (!images || images.length === 0) return;

      const imagePromises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to avoid blocking
        });
      });

      await Promise.all(imagePromises);
    };

    const runLoader = async () => {
      // Start preloading images
      const imageLoadPromise = preloadImages();
      
      // Wait for minimum duration
      const timerPromise = new Promise((resolve) => setTimeout(resolve, duration));

      // Wait for both
      await Promise.all([imageLoadPromise, timerPromise]);

      // Finish up
      setShowCountUp(false);
      setTimeout(() => {
        setIsLoading(false);
        onComplete?.();
      }, 100);
    };

    runLoader();
  }, [duration, onComplete, images]);

  if (!isLoading) return null;

  return (
    <div className={styles.loader}>
      {showCountUp && (
        <div className={styles.countup}>
          <CountUp
            from={0}
            to={101}
            separator=","
            direction="up"
            duration={1}
            className="count-up-text"
            />
        </div>
      )}
    </div>
  );
}
