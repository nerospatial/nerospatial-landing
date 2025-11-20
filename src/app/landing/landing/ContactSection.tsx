"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { submitWaitlist } from "../../actions";

export default function ContactSection() {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const result = await submitWaitlist(formData);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: "You're on the list! We'll be in touch." });
      }
    });
  };

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
                <form action={handleSubmit} className="w-full flex flex-col gap-4">
                  <div className="flex gap-4 mb-2">
                    <label className="flex-1 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="type" 
                        value="glasses" 
                        className="peer sr-only" 
                        defaultChecked
                      />
                      <div className="w-full py-3 border border-white/20 text-center text-white/50 text-xs font-mono uppercase tracking-widest peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-all group-hover:border-white/50">
                        Glasses
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="type" 
                        value="toys" 
                        className="peer sr-only" 
                      />
                      <div className="w-full py-3 border border-white/20 text-center text-white/50 text-xs font-mono uppercase tracking-widest peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-all group-hover:border-white/50">
                        Toys
                      </div>
                    </label>
                  </div>
                  <input 
                    name="email"
                    type="email" 
                    required
                    placeholder="ENTER YOUR EMAIL" 
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors font-mono text-sm disabled:opacity-50"
                    disabled={isPending}
                  />
                  <button 
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Joining..." : "Request Access"}
                  </button>
                  {message && (
                    <p className={`text-xs font-mono ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {message.text}
                    </p>
                  )}
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
