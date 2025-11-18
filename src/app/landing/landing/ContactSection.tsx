"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import styles from "./ContactSection.module.css";

// Constants - matching TechnologySection pattern
const PURPOSE_START_OFFSET = 200; // vh
const PURPOSE_START_MULTIPLIER = 0.98;
const PURPOSE_HEIGHT = 800; // vh
const VISION_HEIGHT = 300; // vh
const PRODUCTS_HEIGHT = 300; // vh
const TECHNOLOGY_HEIGHT = 800; // vh
const CONTACT_FADE_IN_DURATION = 0.4; // 40% of section for smoother fade in

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const gsapAnimationsRef = useRef<gsap.core.Tween[]>([]);
  const reduceMotionRef = useRef<boolean>(false);
  const viewportHeightRef = useRef(0);

  // Form states
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const updateViewportCache = useCallback(() => {
    if (typeof window === "undefined") return;
    viewportHeightRef.current = window.innerHeight;
  }, []);

  // Form handlers
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Waitlist submission:", waitlistEmail);
    // Handle waitlist submission here
    setWaitlistEmail("");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submission:", contactForm);
    // Handle contact form submission here
    setContactForm({ name: "", email: "", message: "" });
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  // Kill all GSAP animations
  const killAllAnimations = useCallback(() => {
    gsapAnimationsRef.current.forEach((anim) => {
      if (anim && anim.kill) anim.kill();
    });
    gsapAnimationsRef.current = [];
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial state
    gsap.set(container, { opacity: 0, visibility: "hidden" });

    updateViewportCache();

    const handleScroll = () => {
      // Kill any pending animations from previous scroll
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        updateViewportCache();
        const viewportHeight = viewportHeightRef.current;

        // Calculate Purpose section bounds
        const purposeStart =
          (PURPOSE_START_OFFSET * viewportHeight * PURPOSE_START_MULTIPLIER) /
          100;
        const purposeFullHeight = (PURPOSE_HEIGHT * viewportHeight) / 100;

        // Vision section starts at Purpose phase 8 (90%)
        const visionStartScroll = purposeStart + 0.9 * purposeFullHeight;
        const visionEnd =
          visionStartScroll + (VISION_HEIGHT * viewportHeight) / 100;

        // Products section starts immediately after Vision ends
        const productsStartScroll = visionEnd;
        const productsEnd =
          productsStartScroll + (PRODUCTS_HEIGHT * viewportHeight) / 100;

        // Technology section starts immediately after Products ends
        const technologyStartScroll = productsEnd;
        const technologyEnd =
          technologyStartScroll + (TECHNOLOGY_HEIGHT * viewportHeight) / 100;

        // Contact section starts immediately after Technology ends
        const contactStartScroll = technologyEnd;

        // Skip animations if reduced motion is preferred
        if (reduceMotionRef.current) {
          if (scrollY >= contactStartScroll) {
            gsap.set(container, { opacity: 1, visibility: "visible" });
          } else {
            gsap.set(container, { opacity: 0, visibility: "hidden" });
          }
          return;
        }

        if (scrollY >= contactStartScroll) {
          // Calculate progress through Contact section (0 to 1)
          const contactProgress = Math.min(
            (scrollY - contactStartScroll) /
              (viewportHeight * CONTACT_FADE_IN_DURATION),
            1
          );

          // Smooth fade in over the first 20% of Contact section scroll
          gsap.set(container, {
            opacity: contactProgress,
            visibility: contactProgress > 0 ? "visible" : "hidden",
          });
        } else {
          // Before Contact section
          gsap.set(container, { opacity: 0, visibility: "hidden" });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      killAllAnimations();
    };
  }, [updateViewportCache, killAllAnimations]);

  // Accessibility and motion preference
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduce = () => {
      reduceMotionRef.current = media.matches;
    };
    if (media.addEventListener) {
      media.addEventListener("change", updateReduce);
    } else {
      media.addListener(updateReduce);
    }
    updateReduce();
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", updateReduce);
      } else {
        media.removeListener(updateReduce);
      }
    };
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      updateViewportCache();
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [updateViewportCache]);

  return (
    <section className={styles.section}>
      <div ref={containerRef} className={styles.container}>
        <div className={styles.content}>
          <div className={styles.commonContainer}>
            <h2 className={styles.title}>
              <span className={styles.icon}>📣</span>
              Join Us !!!
            </h2>
            <div className={styles.columns}>
              <div className={styles.column}>
                <div className={styles.upperContent}>
                  <h3 className={styles.upperTitle}>
                    Be the First to Experience the Future
                  </h3>
                  <p className={styles.upperDescription}>
                    Join our exclusive waitlist and get early access to
                    NeroSpatial&apos;s revolutionary spatial computing platform.
                    Be among the first to explore immersive experiences that
                    will transform how you interact with digital content.
                  </p>
                  <div className={styles.benefits}>
                    <div className={styles.benefit}>
                      <span className={styles.benefitIcon}>🚀</span>
                      <span>Early Access to New Features</span>
                    </div>
                    <div className={styles.benefit}>
                      <span className={styles.benefitIcon}>⭐</span>
                      <span>Exclusive Beta Testing Opportunities</span>
                    </div>
                    <div className={styles.benefit}>
                      <span className={styles.benefitIcon}>🎯</span>
                      <span>Shape the Future of Spatial Computing</span>
                    </div>
                  </div>
                </div>
                <div className={styles.formCard}>
                  <h3 className={styles.columnTitle}>Join Our Waitlist</h3>
                  <p className={styles.columnDescription}>
                    Get exclusive early access to NeroSpatial. Be the first to
                    experience groundbreaking spatial computing features.
                  </p>
                  <form onSubmit={handleWaitlistSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        className={styles.input}
                        required
                      />
                    </div>
                    <button type="submit" className={styles.button}>
                      Join Waitlist
                    </button>
                  </form>
                </div>
              </div>
              <div className={styles.column}>
                <div className={styles.formCard}>
                  <h3 className={styles.columnTitle}>Enterprise Contact</h3>
                  <p className={styles.columnDescription}>
                    For businesses and enterprises interested in NeroSpatial
                    solutions. Let&apos;s discuss custom integrations and
                    priority enterprise support.
                  </p>
                  <form onSubmit={handleContactSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <textarea
                        name="message"
                        placeholder="Your message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        className={styles.textarea}
                        rows={4}
                        required
                      />
                    </div>
                    <button type="submit" className={styles.button}>
                      Contact Enterprise Team
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
