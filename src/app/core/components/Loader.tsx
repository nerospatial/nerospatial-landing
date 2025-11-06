"use client";

import { useEffect, useState } from "react";
import CountUp from "@/components/CountUp";
import styles from "./Loader.module.css";

interface LoaderProps {
  onComplete?: () => void;
  duration?: number;
}

export default function Loader({ onComplete, duration = 3000 }: LoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showCountUp, setShowCountUp] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCountUp(false);
      // Wait 100ms after CountUp completes before hiding loader
      setTimeout(() => {
        setIsLoading(false);
        onComplete?.();
      }, 100);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

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
