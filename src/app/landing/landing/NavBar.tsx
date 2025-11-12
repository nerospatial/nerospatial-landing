"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      // On mobile, show hamburger from the start
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight; // Full viewport height
      setIsScrolled(scrollY > heroHeight * 0.8); // Switch to hamburger after 80% of hero
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Custom smooth scroll function with easing
  const smoothScrollTo = useCallback(
    (targetPosition: number, duration: number = 1000) => {
      console.log(
        `smoothScrollTo called - target: ${targetPosition}, duration: ${duration}`
      );
      const startPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      const distance = targetPosition - startPosition;
      let startTime: number | null = null;

      console.log(`Start position: ${startPosition}, Distance: ${distance}`);

      const easeInOutQuad = (t: number): number => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      };

      const animation = (currentTime: number) => {
        if (startTime === null) {
          startTime = currentTime;
          console.log("Animation started");
        }
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutQuad(progress);

        const newPosition = startPosition + distance * ease;

        // Try multiple methods to ensure scroll happens
        window.scrollTo(0, newPosition);
        document.documentElement.scrollTop = newPosition;
        document.body.scrollTop = newPosition;

        console.log(
          `Progress: ${(progress * 100).toFixed(
            1
          )}%, Position: ${newPosition.toFixed(0)}, Actual: ${
            window.pageYOffset
          }`
        );

        if (progress < 1) {
          requestAnimationFrame(animation);
        } else {
          console.log(
            `Animation complete - final position: ${window.pageYOffset}`
          );
        }
      };

      requestAnimationFrame(animation);
    },
    []
  );

  const handleWaitlistClick = useCallback(() => {
    console.log("=== WAITLIST BUTTON CLICKED ===");
    console.log("Current page scroll:", window.pageYOffset);
    console.log("Document height:", document.documentElement.scrollHeight);
    console.log("Viewport height:", window.innerHeight);

    const productsSection = document.querySelector('[data-section="products"]');
    console.log("Products section element:", productsSection);

    if (productsSection) {
      // Get accurate position relative to document
      const rect = productsSection.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop;

      console.log("Section rect.top:", rect.top);
      console.log("Current scroll position:", scrollTop);
      console.log("Target scroll position:", targetPosition);
      console.log("Distance to scroll:", targetPosition - scrollTop);

      // Force scroll with custom animation (more reliable)
      console.log("Starting custom smooth scroll...");
      smoothScrollTo(targetPosition, 1200);
    } else {
      console.warn("Products section not found!");
      // Fallback: try to find by any means
      const allSections = document.querySelectorAll("section");
      console.log("All sections found:", allSections.length);
      allSections.forEach((section, index) => {
        console.log(
          `Section ${index}:`,
          section.className,
          section.getAttribute("data-section")
        );
      });
    }
  }, [smoothScrollTo]);

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>
          {/* Full navbar - visible in hero */}
          <div
            className={`${styles.fullNav} ${isScrolled ? styles.hidden : ""}`}
          >
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
              <button
                type="button"
                className={styles.ctaButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleWaitlistClick();
                }}
                aria-label="Join Waitlist"
              >
                <span>Waitlist</span>
                <svg
                  className={styles.rocketIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.14 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Hamburger menu - visible after scroll */}
          <button
            className={`${styles.hamburger} ${
              isScrolled ? styles.visible : ""
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span
              className={`${styles.hamburgerLine} ${
                isMenuOpen ? styles.open : ""
              }`}
            ></span>
            <span
              className={`${styles.hamburgerLine} ${
                isMenuOpen ? styles.open : ""
              }`}
            ></span>
            <span
              className={`${styles.hamburgerLine} ${
                isMenuOpen ? styles.open : ""
              }`}
            ></span>
          </button>
        </div>
      </nav>

      {/* Side panel */}
      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.visible : ""}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div className={`${styles.sidePanel} ${isMenuOpen ? styles.open : ""}`}>
        <div className={styles.sidePanelContent}>
          <button
            className={styles.closeButton}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <nav className={styles.sidePanelNav}>
            <a
              href="#hero"
              className={styles.sidePanelLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#products"
              className={styles.sidePanelLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </a>
            <a
              href="#about"
              className={styles.sidePanelLink}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className={styles.sidePanelLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>

            <button
              type="button"
              className={styles.sidePanelCta}
              onClick={(e) => {
                e.preventDefault();
                handleWaitlistClick();
                setIsMenuOpen(false);
              }}
            >
              <span>Join Waitlist</span>
              <svg
                className={styles.rocketIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.14 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
