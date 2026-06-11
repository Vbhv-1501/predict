"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapWrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);

  // States to keep track of mouse coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device to disable tilt but keep float
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !gsapWrapperRef.current || !cardRef.current) return;

    // 1. GSAP ScrollTrigger for Scroll Reveal and Exit Animations
    const wrapper = gsapWrapperRef.current;
    
    // Set initial states
    gsap.set(wrapper, { opacity: 0, scale: 0.92, y: 40 });

    const ctx = gsap.context(() => {
      // Entry Reveal Animation
      gsap.to(wrapper, {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "top 35%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Exit Fade-out & Translate Animation
      gsap.to(wrapper, {
        opacity: 0,
        scale: 0.95,
        y: -40,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 55%",
          end: "bottom 15%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    // 2. Interactive 3D Tilt and Specular Highlight Reflection (lerped inside RAF)
    const card = cardRef.current;
    let animationFrameId: number;
    let curRotX = 0;
    let curRotY = 0;
    let curReflectX = 50;
    let curReflectY = 50;

    const updateTilt = () => {
      const mouse = mouseRef.current;
      
      if (mouse.isHovered && !isTouchDevice) {
        // Interpolate (lerp) towards target mouse coordinates (max 8 degrees tilt)
        curRotX += (mouse.targetX - curRotX) * 0.1;
        curRotY += (mouse.targetY - curRotY) * 0.1;

        // Glare specular position interpolation
        curReflectX += (mouse.x - curReflectX) * 0.1;
        curReflectY += (mouse.y - curReflectY) * 0.1;
      } else {
        // Return smoothly to center/resting float state
        curRotX += (0 - curRotX) * 0.1;
        curRotY += (0 - curRotY) * 0.1;
        curReflectX += (50 - curReflectX) * 0.1;
        curReflectY += (50 - curReflectY) * 0.1;
      }

      // Apply the transformations to the elements
      if (card) {
        card.style.transform = `perspective(1000px) rotateX(${curRotX}deg) rotateY(${curRotY}deg) translateZ(0)`;
      }
      if (reflectionRef.current) {
        reflectionRef.current.style.background = `radial-gradient(circle at ${curReflectX}% ${curReflectY}%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 60%)`;
      }

      animationFrameId = requestAnimationFrame(updateTilt);
    };

    updateTilt();

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice) return;
      const rect = card.getBoundingClientRect();
      const cardW = rect.width;
      const cardH = rect.height;

      // Mouse position relative to the center of the card (-1 to 1)
      const mouseX = (e.clientX - rect.left) / cardW - 0.5;
      const mouseY = (e.clientY - rect.top) / cardH - 0.5;

      // Calculate target rotation degrees (X axis responds to mouse Y, Y axis responds to mouse X)
      mouseRef.current.targetX = -mouseY * 8; // Max tilt X (vertical rotate)
      mouseRef.current.targetY = mouseX * 8;  // Max tilt Y (horizontal rotate)

      // Calculate reflection spotlight percentage coordinates (0 to 100)
      mouseRef.current.x = (e.clientX - rect.left) / cardW * 100;
      mouseRef.current.y = (e.clientY - rect.top) / cardH * 100;
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      ctx.revert();
      cancelAnimationFrame(animationFrameId);
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isTouchDevice]);

  return (
    <section
      ref={containerRef}
      className="py-32 w-full bg-[#F8F8F6] relative overflow-hidden flex flex-col items-center border-t border-black/[0.04] font-neue select-none"
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center relative z-10">
        
        {/* Top heading / Story copy */}
        <div className="text-center mb-16 max-w-4xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.08] tracking-tight uppercase mb-6 font-neue">
            Your blood carries <br className="hidden md:inline" />
            your true age.
          </h2>
          <p className="font-neue text-sm md:text-base lg:text-lg text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Every second, it circulates signals. The rate of breakdown. The capacity to regenerate. The metabolic efficiency. The inflammatory burden. The vascular integrity.
          </p>
        </div>

        {/* GSAP scroll trigger wrapper */}
        <div
          ref={gsapWrapperRef}
          className="w-full max-w-5xl will-change-transform"
        >
          {/* Continuous floating animation wrapper */}
          <div className="dashboard-float-wrapper">
            {/* Floating iPad visual with interactive specular glare and tilt */}
            <div
              ref={cardRef}
              className="relative w-full rounded-[32px] overflow-hidden bg-black shadow-[0_45px_100px_rgba(0,0,0,0.12)] border border-black/10 flex items-center justify-center will-change-transform"
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              {/* Glass reflection layer */}
              <div
                ref={reflectionRef}
                className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
                style={{
                  mixBlendMode: "screen",
                  background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)"
                }}
              />

              {/* iPad Metallic Frame Border highlight */}
              <div className="absolute inset-0 border border-white/[0.08] rounded-[32px] pointer-events-none z-30" />

              {/* Actual Dashboard Image asset */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/dashboard.png"
                alt="Predict Clinical Dashboard"
                className="w-full h-auto object-cover relative z-10 block pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Supporting statement below */}
        <div className="text-center mt-16 max-w-2xl">
          <p className="font-neue text-xs md:text-sm tracking-widest text-[#7C3AED] uppercase font-bold">
            Combining muscle-first diagnostics, specialist protocols, and continuous blood intelligence.
          </p>
        </div>

      </div>

      <style>{`
        .dashboard-float-wrapper {
          /* Smooth weightless float animation */
          animation: floatDashboard 8s ease-in-out infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }

        @keyframes floatDashboard {
          0%, 100% {
            transform: translateY(0px) rotate(0.12deg);
          }
          50% {
            transform: translateY(-8px) rotate(-0.12deg);
          }
        }
      `}</style>
    </section>
  );
}
