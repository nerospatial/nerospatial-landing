"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface MonochromeTimelineProps {
  steps: TimelineStep[];
}

const MonochromeTimeline: React.FC<MonochromeTimelineProps> = ({ steps }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto py-24">
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2">
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-gradient-to-b from-white via-white to-transparent opacity-50"
        />
      </div>

      <div className="flex flex-col gap-24 md:gap-32">
        {steps.map((step, index) => (
          <TimelineNode key={index} step={step} index={index} />
        ))}
      </div>
    </div>
  );
};

const TimelineNode: React.FC<{ step: TimelineStep; index: number }> = ({ step, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative flex flex-col md:flex-row items-center ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Content Side */}
      <div className="flex-1 w-full md:w-1/2 pl-12 md:pl-0 md:px-12 text-left md:text-right">
        <div className={`flex flex-col gap-4 ${isEven ? "md:items-start md:text-left" : "md:items-end"}`}>
          <span className="text-6xl font-black text-white/10 tracking-tighter select-none">
            {step.number}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
            {step.title}
          </h3>
          <p className="text-neutral-400 leading-relaxed max-w-sm">
            {step.description}
          </p>
        </div>
      </div>

      {/* Center Node */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-black border border-white rounded-full z-10">
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
      </div>

      {/* Empty Side for Balance */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

export default MonochromeTimeline;
