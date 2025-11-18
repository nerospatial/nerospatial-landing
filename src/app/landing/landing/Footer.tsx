"use client";

import React from "react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-[var(--bg-nero)] pt-32 pb-10 border-t border-[var(--glass-border)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter text-white">
              Nero<span className="text-[var(--accent-primary)]">Spatial</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xs">
              Revolutionizing spatial intelligence with AR and AI technologies for immersive experiences.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Platform</h3>
            <ul className="space-y-4">
              {["Products", "Solutions", "Technology", "Pricing"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-4">
              {["About", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
              <MagneticButton className="w-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)]">
                Subscribe
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--glass-border)]">
          <p className="text-[var(--text-tertiary)] text-sm">
            © {new Date().getFullYear()} NeroSpatial. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <a key={item} href="#" className="text-[var(--text-tertiary)] text-sm hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
