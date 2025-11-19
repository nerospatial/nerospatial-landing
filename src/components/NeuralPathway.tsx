"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface NeuralPathwayProps {
  steps: TimelineStep[];
}

const NeuralPathway: React.FC<NeuralPathwayProps> = ({ steps }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate path points
  // We want a path that weaves left and right
  // Start top center
  // Step 0: Left
  // Step 1: Right
  // ...
  
  const generatePath = () => {
    if (dimensions.width === 0) return "";

    const centerX = dimensions.width / 2;
    const stepHeight = dimensions.height / (steps.length + 1);
    const amplitude = Math.min(dimensions.width * 0.35, 300); // Max width of weave

    let path = `M ${centerX} 0`;

    // Initial line down
    path += ` L ${centerX} ${stepHeight * 0.5}`;

    steps.forEach((_, index) => {
      const y = stepHeight * (index + 1);
      const isLeft = index % 2 === 0;
      const x = centerX + (isLeft ? -amplitude : amplitude);
      
      // Previous point (approximate for curve control)
      const prevY = stepHeight * index + (stepHeight * 0.5);
      const prevX = index === 0 ? centerX : (centerX + (isLeft ? amplitude : -amplitude)); // Actually previous was opposite side

      // We need a smooth curve from prev point to current point
      // Simple cubic bezier
      // Control point 1: vertical down from prev
      // Control point 2: vertical up from current
      
      // If it's the first point, we are coming from center
      if (index === 0) {
        path += ` C ${centerX} ${y - stepHeight * 0.2}, ${x} ${y - stepHeight * 0.3}, ${x} ${y}`;
      } else {
        // From previous side to this side
        const prevSideX = centerX + (isLeft ? amplitude : -amplitude);
        path += ` C ${prevSideX} ${y - stepHeight * 0.5}, ${x} ${y - stepHeight * 0.5}, ${x} ${y}`;
      }
    });

    // Final line to bottom center
    const lastY = stepHeight * steps.length;
    const lastX = centerX + (steps.length % 2 === 0 ? amplitude : -amplitude); // Logic check: if even steps (0-5), last is index 5 (Right)
    // Wait, index 0 is Left. Index 1 is Right. Index 5 is Right.
    // Let's re-verify: 0(L), 1(R), 2(L), 3(R), 4(L), 5(R). Correct.
    
    path += ` C ${lastX} ${dimensions.height - stepHeight * 0.5}, ${centerX} ${dimensions.height - stepHeight * 0.5}, ${centerX} ${dimensions.height}`;

    return path;
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-[2000px] py-24">
      {/* SVG Path Layer */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="10%" stopColor="white" stopOpacity="0.5" />
            <stop offset="90%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background Trace (Dim) */}
        <path
          d={generatePath()}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
        />

        {/* Active Trace (Animated) */}
        <motion.path
          d={generatePath()}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="4"
          filter="url(#glow)"
          style={{ pathLength }}
        />
      </svg>

      {/* Nodes */}
      <div className="relative z-10 w-full h-full">
        {steps.map((step, index) => (
          <PathwayNode 
            key={index} 
            step={step} 
            index={index} 
            totalSteps={steps.length}
            parentHeight={dimensions.height}
          />
        ))}
      </div>
    </div>
  );
};

const PathwayNode: React.FC<{ 
  step: TimelineStep; 
  index: number; 
  totalSteps: number;
  parentHeight: number;
}> = ({ step, index, totalSteps, parentHeight }) => {
  const isLeft = index % 2 === 0;
  const stepHeight = parentHeight / (totalSteps + 1);
  const topPosition = stepHeight * (index + 1);

  return (
    <div 
      className={`absolute w-full flex ${isLeft ? "justify-start md:justify-center" : "justify-end md:justify-center"}`}
      style={{ top: topPosition }}
    >
      {/* Container that shifts based on side */}
      <div className={`relative w-full md:w-[70%] flex ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        
        {/* The Node Point (positioned absolutely relative to this row to match the curve) */}
        <div className={`absolute top-0 ${isLeft ? "left-0 md:left-0" : "right-0 md:right-0"} w-full flex ${isLeft ? "justify-start" : "justify-end"}`}>
           {/* This is tricky. The curve amplitude is calculated in JS. 
               We need to match the CSS layout to the JS curve or vice versa.
               Let's rely on the fact that the curve goes to roughly 35% width from center.
               So from center, it's +/- 35%.
               In a centered container of width X, that's... complicated.
               
               Alternative: Pass the exact position? 
               Let's simplify. The curve is visual decoration. The content should just sit nicely "near" it.
           */}
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`
            w-[90%] md:w-[40%] 
            ${isLeft ? "ml-[5%] md:ml-0 md:mr-auto text-left" : "mr-[5%] md:mr-0 md:ml-auto text-right"}
            ${isLeft ? "md:-translate-x-[20%]" : "md:translate-x-[20%]"} 
          `}
        >
          <div className={`flex flex-col gap-3 ${isLeft ? "items-start" : "items-end"}`}>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-5xl font-black text-white/20">{step.number}</span>
              <div className="p-3 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
                <span className="material-symbols-outlined text-white">{step.icon}</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-tight">
              {step.title}
            </h3>
            <p className="text-neutral-400 leading-relaxed text-sm md:text-lg max-w-md">
              {step.description}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default NeuralPathway;
