"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";
import { useLenis } from "@/components/core/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export default function NavBar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const nav = navRef.current;
    const logo = logoRef.current;
    const links = linksRef.current;
    const cta = ctaRef.current;

    if (!nav || !logo || !links || !cta) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Initial Animation
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
      .fromTo(
        logo,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        links.children,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        cta,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

    return () => {
      window.removeEventListener("scroll", handleScroll);
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "power3.inOut",
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.5,
        ease: "power3.inOut",
      });
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (isMenuOpen) toggleMenu();
    
    if (lenis) {
      lenis.scrollTo(id, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      const element = document.querySelector(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div
          className={`mx-auto max-w-7xl px-6 transition-all duration-500 ${
            isScrolled
              ? "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
              : "bg-transparent border-transparent"
          }`}
        >
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div ref={logoRef} className="flex items-center pl-2">
              <Link href="/" className="group relative flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tighter text-white">
                  Nero<span className="font-light text-white/70">Spatial</span>
                </span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div ref={linksRef} className="hidden md:flex items-center gap-10">
              {[
                { name: "Vision", href: "#vision" },
                { name: "Products", href: "#products" },
                { name: "Technology", href: "#technology" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="flex items-center gap-4 pr-1">
              <div className="hidden md:block">
                <MagneticButton
                  className={`px-4 py-1 text-sm font-medium transition-all duration-300 rounded-full ${
                    isScrolled
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-white/10 text-white hover:bg-white hover:text-black border border-white/10"
                  }`}
                  strength={0.2}
                  onClick={(e) => scrollToSection(e, "#contact")}
                >
                  Join Waitlist
                </MagneticButton>
              </div>
              
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden text-white p-2 z-50 relative mix-blend-difference"
                onClick={toggleMenu}
              >
                <span className="material-symbols-outlined text-2xl">
                  {isMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-black/95 opacity-0 pointer-events-none flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-8">
          {[
            { name: "Vision", href: "#vision" },
            { name: "Products", href: "#products" },
            { name: "Technology", href: "#technology" },
            { name: "Contact", href: "#contact" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-4xl font-bold text-white hover:text-[var(--accent-primary)] transition-colors"
              onClick={(e) => scrollToSection(e, link.href)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
