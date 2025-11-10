"use client";

import { useState, useEffect } from "react";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50); // Add background after scrolling 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        {/* Logo removed from left */}

        <div className={styles.navCenter}>
          <div className={styles.navLinks}>
            <a href="#hero" className={styles.navLink}>
              Home
            </a>
            <a href="#products" className={styles.navLink}>
              Products
            </a>
            <a href="#about" className={styles.navLink}>
              About
            </a>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
          </div>
        </div>

        <div className={styles.navActions}>
          <button className={styles.ctaButton}>Get Started</button>
        </div>
      </div>
    </nav>
  );
}
