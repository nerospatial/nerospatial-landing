"use client";

import { useEffect, useState } from "react";
import styles from "./ErrorSnackbar.module.css";

interface ErrorSnackbarProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function ErrorSnackbar({
  message,
  onClose,
  duration = 5000,
}: ErrorSnackbarProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.snackbar} ${
        isVisible ? styles.visible : styles.hidden
      }`}
    >
      <div className={styles.content}>
        <span className={styles.icon}>⚠️</span>
        <span className={styles.message}>{message}</span>
        <button
          className={styles.closeButton}
          onClick={() => setIsVisible(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
