"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 50) {
        // Always show at the very top
        setVisible(true);
        clearTimeout(timeoutId);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down -> hide immediately
        setVisible(false);
        clearTimeout(timeoutId);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up -> show
        setVisible(true);
        clearTimeout(timeoutId);
        // Hide after 1.5s of no scroll activity (stopped)
        timeoutId = setTimeout(() => {
          if (window.scrollY > 50) {
            setVisible(false);
          }
        }, 1500);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-out border-b border-black/[0.04] ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="absolute inset-0 bg-white -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Left: Predict Inverted/Dark Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Image
            src="/assets/Predict-Logo.png"
            alt="PREDICT"
            width={120}
            height={32}
            className="h-6 sm:h-8 w-auto object-contain invert hue-rotate-180 brightness-90 transition-all duration-300"
            priority
          />
        </div>

        {/* Right: Navigation links */}
        <nav className="hidden md:flex items-center gap-8">
          {["About", "Science", "How It Works", "Assessment", "Contact"].map((item) => {
            const sectionId = item.toLowerCase().replace(/\s+/g, "-");
            return (
              <button
                key={item}
                onClick={() => scrollToSection(sectionId)}
                className="text-sm text-black hover:text-[#8504FE] transition-all duration-200 cursor-pointer font-bold tracking-wide"
              >
                {item}
              </button>
            );
          })}
        </nav>

        {/* Mobile Call to Action Button */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-manifesto"))}
          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-accent hover:bg-accent/90 text-white font-medium rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-300 shadow-md shadow-accent/10 hover:shadow-accent/25 cursor-pointer"
        >
          Our Manifesto
        </button>
      </div>
    </header>
  );
}
