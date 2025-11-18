"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number; // How strong the magnetic pull is (default: 0.5)
  className?: string;
}

export default function MagneticButton({
  children,
  strength = 0.5,
  className = "",
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Move button
      gsap.to(button, {
        x: x * strength,
        y: y * strength,
        duration: 1,
        ease: "power4.out",
      });

      // Move text slightly more for parallax
      gsap.to(text, {
        x: x * strength * 0.5,
        y: y * strength * 0.5,
        duration: 1,
        ease: "power4.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to([button, text], {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <button
      ref={buttonRef}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-4 transition-colors ${className}`}
      {...props}
    >
      <span ref={textRef} className="relative z-10 block">
        {children}
      </span>
    </button>
  );
}
