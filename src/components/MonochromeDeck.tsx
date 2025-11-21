"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
  status: "coming_soon" | "preorder" | "available";
  link?: string;
}

interface MonochromeDeckProps {
  products: Product[];
}

const MonochromeDeck: React.FC<MonochromeDeckProps> = ({ products }) => {
  const [activeId, setActiveId] = useState(products[0].id);
  const activeProduct = products.find((p) => p.id === activeId) || products[0];

  const getButtonConfig = (status: Product["status"]) => {
    switch (status) {
      case "coming_soon":
        return { text: "Coming Soon", disabled: true, style: "bg-white/5 text-white/40 cursor-not-allowed border-white/5" };
      case "preorder":
        return { text: "Preorder Now", disabled: false, style: "bg-white text-black hover:bg-neutral-200 border-white" };
      case "available":
        return { text: "Learn More", disabled: false, style: "bg-white text-black hover:bg-neutral-200 border-white" };
      default:
        return { text: "Coming Soon", disabled: true, style: "bg-white/5 text-white/40 cursor-not-allowed border-white/5" };
    }
  };

  const btnConfig = getButtonConfig(activeProduct.status);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-24 h-auto lg:h-[600px]">
      {/* Navigation / List */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center gap-2">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setActiveId(product.id)}
            className="group relative w-full text-left py-6 border-b border-white/10 transition-all duration-500 hover:border-white/40"
          >
            <div className="flex items-baseline justify-between">
              <h3 className={`text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter transition-colors duration-500 ${
                activeId === product.id ? "text-white" : "text-white/20 group-hover:text-white/60"
              }`}>
                {product.title}
              </h3>
              <span className={`text-xs font-mono uppercase tracking-widest transition-colors duration-500 ${
                activeId === product.id ? "text-white" : "text-transparent group-hover:text-white/40"
              }`}>
                0{products.indexOf(product) + 1}
              </span>
            </div>
            
            {/* Active Indicator Line */}
            {activeId === product.id && (
              <motion.div
                layoutId="active-line"
                className="absolute bottom-0 left-0 w-full h-[1px] bg-white"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Display Area */}
      <div className="flex-1 relative flex flex-col justify-between py-8 lg:py-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col"
          >
            {/* Image Area */}
            <div className="relative flex-1 w-full min-h-[250px] md:min-h-[300px] flex items-center justify-center mb-6 md:mb-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  fill
                  className="object-contain grayscale-0 md:grayscale md:hover:grayscale-0 transition-all duration-700"
                  priority
                />
              </motion.div>
            </div>

            {/* Info Area */}
            <div className="w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 border border-white/20 rounded-full text-[10px] uppercase tracking-widest text-white/60">
                    {activeProduct.subtitle}
                  </span>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>
                <p className="text-sm md:text-lg lg:text-xl text-neutral-400 font-light leading-relaxed max-w-xl">
                  {activeProduct.description}
                </p>

                {/* Pricing and Action */}
                <div className="flex flex-row items-center gap-6 mt-4">
                  <button
                    disabled={btnConfig.disabled}
                    className={`w-fit px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-full border transition-all duration-300 ${btnConfig.style}`}
                  >
                    {btnConfig.text}
                  </button>
                  <span className="text-sm font-mono uppercase tracking-widest text-white/80">
                    Starting @ {activeProduct.price}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MonochromeDeck;
