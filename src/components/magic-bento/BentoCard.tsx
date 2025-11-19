"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Spotlight from "./Spotlight";

export interface BentoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  href?: string;
  cta?: string;
  background?: React.ReactNode;
}

export default function BentoCard({
  title,
  description,
  icon,
  className = "",
  colSpan = 1,
  rowSpan = 1,
  href,
  cta,
  background,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt Effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2; // Max 2 deg rotation
      const rotateY = ((x - centerX) / centerX) * 2;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-[var(--glass-blur)] ${className}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        perspective: "1000px",
      }}
    >
      <Spotlight className="h-full w-full flex flex-col justify-between p-8">
        <div ref={cardRef} className="h-full w-full flex flex-col justify-between z-10">
          <div className="mb-4">
            {icon && (
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--glass-highlight)] text-white">
                {icon}
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{description}</p>
          </div>
          
          {cta && (
            <div className="mt-4">
              <span className="text-sm font-medium text-[var(--accent-primary)] group-hover:text-white transition-colors">
                {cta} &rarr;
              </span>
            </div>
          )}
        </div>
        
        {background && (
          <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            {background}
          </div>
        )}
      </Spotlight>
    </div>
  );
}
