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
}

interface ProductDeckProps {
  products: Product[];
}

const ProductDeck: React.FC<ProductDeckProps> = ({ products }) => {
  const [activeId, setActiveId] = useState(products[0].id);
  const activeProduct = products.find((p) => p.id === activeId) || products[0];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 h-auto lg:h-[600px]">
      {/* Navigation / Tabs */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setActiveId(product.id)}
            className={`group relative w-full text-left p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
              activeId === product.id
                ? "bg-[#1a1f2e] border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
            }`}
          >
            {activeId === product.id && (
              <motion.div
                layoutId="active-glow"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                transition={{ duration: 0.3 }}
              />
            )}
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className={`text-xs font-mono uppercase tracking-wider mb-1 block ${
                  activeId === product.id ? "text-blue-400" : "text-white/40"
                }`}>
                  {product.subtitle}
                </span>
                <h3 className={`text-xl font-bold ${
                  activeId === product.id ? "text-white" : "text-white/70"
                }`}>
                  {product.title}
                </h3>
              </div>
              
              {/* Arrow Icon */}
              <div className={`transform transition-transform duration-300 ${
                activeId === product.id ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Display Area */}
      <div className="flex-1 relative rounded-[2rem] overflow-hidden bg-[#0f1219] border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-full flex flex-col md:flex-row items-center p-8 md:p-12 gap-8"
          >
            {/* Text Content */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 z-10 order-2 md:order-1">
              <div>
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-wider mb-4"
                >
                  System: {activeProduct.subtitle}
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                  {activeProduct.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-lg leading-relaxed"
                >
                  {activeProduct.description}
                </motion.p>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-fit px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 group"
              >
                Explore Module
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>

            {/* Image */}
            <div className="w-full md:w-1/2 h-[300px] md:h-full relative flex items-center justify-center order-1 md:order-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
              
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1219] via-transparent to-transparent md:hidden" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductDeck;
