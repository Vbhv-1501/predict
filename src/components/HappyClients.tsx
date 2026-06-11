"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PartnerBadge {
  name: string;
  logo: string;
  x: number; // final horizontal displacement (pixels)
  y: number; // final vertical displacement (pixels)
  floatX: number;
  floatY: number;
  floatDuration: number;
  floatDelay: number;
}

// Spaced out coordinates in an ellipse to avoid any overlaps, fully symmetrical
const partners: PartnerBadge[] = [
  { name: "Apple Health", logo: "/assets/Apple Health.svg", x: 0, y: -270, floatX: 4, floatY: -6, floatDuration: 8, floatDelay: 0 },
  { name: "Equinox", logo: "/assets/Equinox.svg", x: 180, y: -230, floatX: -5, floatY: 5, floatDuration: 9, floatDelay: 1.5 },
  { name: "Theragun", logo: "/assets/Theragun.svg", x: 320, y: -80, floatX: 6, floatY: -4, floatDuration: 7, floatDelay: 0.5 },
  { name: "AG1", logo: "/assets/AG1.svg", x: 300, y: 120, floatX: -4, floatY: 6, floatDuration: 10, floatDelay: 2 },
  { name: "Nike Running", logo: "/assets/Nike Running.svg", x: 130, y: 240, floatX: 5, floatY: -5, floatDuration: 8.5, floatDelay: 1 },
  { name: "Hyperice", logo: "/assets/Hyperice.svg", x: -130, y: 240, floatX: -6, floatY: 4, floatDuration: 7.5, floatDelay: 2.5 },
  { name: "Garmin", logo: "/assets/Garmin.svg", x: -300, y: 120, floatX: 4, floatY: 6, floatDuration: 9.5, floatDelay: 0.2 },
  { name: "WHOOP", logo: "/assets/WHOOP.svg", x: -320, y: -80, floatX: -5, floatY: -4, floatDuration: 6.5, floatDelay: 1.8 },
  { name: "Oura Ring", logo: "/assets/Oura Ring.svg", x: -180, y: -230, floatX: 6, floatY: 5, floatDuration: 8, floatDelay: 0.8 },
];

export default function HappyClients() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !panelRef.current || !containerRef.current) return;

    const trigger = sectionRef.current;
    const panel = panelRef.current;
    let timeline: gsap.core.Timeline | null = null;

    const initGsap = () => {
      // Clear existing ScrollTriggers for this trigger
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === trigger) {
          t.kill();
        }
      });
      if (timeline) {
        timeline.kill();
      }

      const width = typeof window !== "undefined" ? window.innerWidth : 1200;
      let scaleFactor = 1.0;
      if (width > 1200) {
        scaleFactor = 1.0;
      } else if (width >= 768) {
        scaleFactor = 0.75;
      } else {
        scaleFactor = 0.55;
      }

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: "+=1500", // Scroll depth of the animation
          scrub: 0.5,
          pin: panel,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: -20,
          invalidateOnRefresh: true,
        },
      });

      partners.forEach((partner, index) => {
        const badge = badgeRefs.current[index];
        if (!badge) return;

        // Reset initial positions (centered at 50%, 50% and offset by -50% of its size)
        gsap.set(badge, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: 0.1,
          opacity: 0,
        });

        // Animate badge dispersal
        timeline!.to(
          badge,
          {
            x: partner.x * scaleFactor,
            y: partner.y * scaleFactor,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            duration: 1.5,
          },
          index * 0.08 // staggered start
        );
      });
      ScrollTrigger.sort();
    };

    initGsap();

    // Debounced resize handler to rebuild GSAP values responsively
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initGsap();
        ScrollTrigger.sort();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === trigger) {
          t.kill();
        }
      });
      if (timeline) {
        timeline.kill();
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#F8F8F6] border-t border-black/[0.04]">
      <div ref={panelRef} className="h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative w-full max-w-7xl h-full flex items-center justify-center px-6"
        >
          {/* Central Focal Point Emblem - Black Circle with white text "OUR PARTNERS" */}
          <div 
            className="absolute z-20 flex flex-col items-center justify-center rounded-full bg-black text-center border border-white/[0.08] shadow-[0_20px_45px_rgba(0,0,0,0.18)] partner-center"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="text-sm sm:text-base md:text-lg font-bold tracking-[0.15em] text-white uppercase font-sans">
              OUR PARTNERS
            </span>
          </div>

          {/* Dispersing Logo Cards */}
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              ref={(el) => {
                badgeRefs.current[index] = el;
              }}
              className="absolute z-10 flex flex-col items-center justify-center cursor-pointer"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Inner child wrapper that handles the floating animation using CSS custom variables */}
              <div 
                className="animate-float-logo flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  "--float-x": `${partner.floatX}px`,
                  "--float-y": `${partner.floatY}px`,
                  "--float-duration": `${partner.floatDuration}s`,
                  "--float-delay": `${partner.floatDelay}s`,
                } as React.CSSProperties}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="partner-logo object-contain opacity-90 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
