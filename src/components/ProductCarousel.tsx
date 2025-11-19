"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "motion/react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const x = useMotionValue(0);
  
  // Calculate rotation based on drag
  const rotateY = useTransform(x, [-200, 200], [15, -15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      paginate(-1);
    } else if (info.offset.x < -threshold) {
      paginate(1);
    }
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    let nextIndex = activeIndex + newDirection;
    if (nextIndex < 0) nextIndex = products.length - 1;
    if (nextIndex >= products.length) nextIndex = 0;
    setActiveIndex(nextIndex);
  };

  const getProductIndex = (offset: number) => {
    let index = activeIndex + offset;
    if (index < 0) index = products.length + index;
    if (index >= products.length) index = index % products.length;
    return index;
  };

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-1000">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
      
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center overflow-hidden md:overflow-visible">
        <AnimatePresence initial={false} custom={direction}>
          {/* Left Card (Previous) */}
          <motion.div
            key={`prev-${getProductIndex(-1)}`}
            className="absolute left-4 md:left-20 w-[280px] md:w-[350px] h-[400px] md:h-[500px] rounded-3xl bg-[#151925]/80 border border-white/5 backdrop-blur-sm z-10 hidden md:flex flex-col items-center justify-center p-6 opacity-40 scale-90 cursor-pointer"
            onClick={() => paginate(-1)}
            initial={{ x: -100, opacity: 0, scale: 0.8, z: -100 }}
            animate={{ x: 0, opacity: 0.4, scale: 0.9, z: -50 }}
            exit={{ x: -100, opacity: 0, scale: 0.8, z: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
             <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={products[getProductIndex(-1)].image}
                  alt={products[getProductIndex(-1)].title}
                  fill
                  className="object-contain opacity-50 grayscale"
                />
             </div>
          </motion.div>

          {/* Right Card (Next) */}
          <motion.div
            key={`next-${getProductIndex(1)}`}
            className="absolute right-4 md:right-20 w-[280px] md:w-[350px] h-[400px] md:h-[500px] rounded-3xl bg-[#151925]/80 border border-white/5 backdrop-blur-sm z-10 hidden md:flex flex-col items-center justify-center p-6 opacity-40 scale-90 cursor-pointer"
            onClick={() => paginate(1)}
            initial={{ x: 100, opacity: 0, scale: 0.8, z: -100 }}
            animate={{ x: 0, opacity: 0.4, scale: 0.9, z: -50 }}
            exit={{ x: 100, opacity: 0, scale: 0.8, z: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
             <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={products[getProductIndex(1)].image}
                  alt={products[getProductIndex(1)].title}
                  fill
                  className="object-contain opacity-50 grayscale"
                />
             </div>
          </motion.div>

          {/* Center Card (Active) */}
          <motion.div
            key={products[activeIndex].id}
            className="absolute z-30 w-[320px] md:w-[450px] h-[500px] md:h-[600px] rounded-[2rem] bg-gradient-to-b from-[#1a1f2e] to-[#0f1219] border border-white/10 shadow-2xl shadow-purple-900/20 flex flex-col overflow-hidden"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x, rotateY, opacity, cursor: "grab" }}
            whileTap={{ cursor: "grabbing" }}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            {/* Product Image Area */}
            <div className="relative flex-1 w-full flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent">
              <motion.div 
                className="relative w-full h-full"
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Image
                  src={products[activeIndex].image}
                  alt={products[activeIndex].title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="relative p-8 bg-black/20 backdrop-blur-md border-t border-white/5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-xs font-mono text-purple-400 uppercase tracking-[0.2em] mb-2 block">
                  {products[activeIndex].subtitle}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                  {products[activeIndex].title}
                </h3>
                <p className="text-white/60 text-sm md:text-base leading-relaxed line-clamp-3">
                  {products[activeIndex].description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 z-40">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
                setDirection(idx > activeIndex ? 1 : -1);
                setActiveIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex 
                ? "w-8 bg-purple-500" 
                : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
