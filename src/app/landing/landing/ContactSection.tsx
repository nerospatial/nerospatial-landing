"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";


export default function ContactSection() {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

  return (
    <section className="relative w-full h-screen flex flex-col md:flex-row bg-black overflow-hidden">
      {/* Individual Side (Left) */}
      <div 
        className={`relative h-1/2 md:h-full flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-white/10 transition-all duration-700 ease-[0.16,1,0.3,1] ${
          hoveredSide === "left" ? "md:flex-[2]" : hoveredSide === "right" ? "md:flex-[0.5]" : "md:flex-1"
        }`}
        onMouseEnter={() => setHoveredSide("left")}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-black to-black opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">
            For Individuals
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">
            Join the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Waitlist</span>
          </h2>
          
          <AnimatePresence>
            {(hoveredSide === "left" || hoveredSide === null) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full flex flex-col gap-4 overflow-hidden"
              >
                <p className="text-neutral-400 font-light mb-6">
                  Be the first to experience the next generation of spatial computing.
                </p>
                <form className="w-full flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL" 
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors font-mono text-sm"
                  />
                  <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors mt-4">
                    Request Access
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enterprise Side (Right) */}
      <div 
        className={`relative h-1/2 md:h-full flex flex-col justify-center items-center transition-all duration-700 ease-[0.16,1,0.3,1] ${
          hoveredSide === "right" ? "md:flex-[2]" : hoveredSide === "left" ? "md:flex-[0.5]" : "md:flex-1"
        }`}
        onMouseEnter={() => setHoveredSide("right")}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">
            For Enterprise
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">
            Partner <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">With Us</span>
          </h2>

          <AnimatePresence>
            {(hoveredSide === "right" || hoveredSide === null) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full flex flex-col gap-4 overflow-hidden"
              >
                <p className="text-neutral-400 font-light mb-8">
                  Co-create the future of spatial interaction for your industry.
                </p>
                <button className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all">
                  Inquire Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
