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
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, targetScale: 1.0, isHovered: false });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const titleText = "Your results, your protocol, your doctors/health coaches — one dashboard.";
  const titleWords = titleText.split(" ");

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
      // Single timeline maps scroll progress from entry to exit cleanly
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 15%",
          scrub: 1,
          refreshPriority: 50,
          invalidateOnRefresh: true,
        },
      });

      // 1. Entry Phase (0% to 25% scroll progress)
      tl.to(wrapper, {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "power2.out",
        duration: 1,
      });

      // 2. Hold Phase (25% to 100% scroll progress)
      tl.to(wrapper, {
        y: 0,
        duration: 3, // Holds the element fully active
      });

      // Apple-style text reveal animation
      gsap.to(".video-showcase-title .reveal-word", {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".video-showcase-title",
          start: "top 75%",
          end: "bottom 35%",
          scrub: true,
        }
      });
    }, containerRef);

    // 2. Interactive 3D Tilt and Specular Highlight Reflection (lerped inside RAF)
    const card = cardRef.current;
    let animationFrameId: number;
    let curRotX = 0;
    let curRotY = 0;
    let curScale = 1.0;
    let curReflectX = 50;
    let curReflectY = 50;

    const updateTilt = () => {
      const mouse = mouseRef.current;
      
      if (mouse.isHovered && !isTouchDevice) {
        // Interpolate (lerp) towards target mouse coordinates (max 12 degrees tilt)
        curRotX += (mouse.targetX - curRotX) * 0.1;
        curRotY += (mouse.targetY - curRotY) * 0.1;
        curScale += (mouse.targetScale - curScale) * 0.1;

        // Glare specular position interpolation
        curReflectX += (mouse.x - curReflectX) * 0.1;
        curReflectY += (mouse.y - curReflectY) * 0.1;
      } else {
        // Return smoothly to center/resting float state
        curRotX += (0 - curRotX) * 0.1;
        curRotY += (0 - curRotY) * 0.1;
        curScale += (1.0 - curScale) * 0.1;
        curReflectX += (50 - curReflectX) * 0.1;
        curReflectY += (50 - curReflectY) * 0.1;
      }

      // Apply the transformations to the elements
      if (card) {
        card.style.transform = `perspective(1000px) rotateX(${curRotX}deg) rotateY(${curRotY}deg) scale(${curScale}) translateZ(0)`;
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

      // Mouse position relative to the center of the card (-0.5 to 0.5)
      const mouseX = (e.clientX - rect.left) / cardW - 0.5;
      const mouseY = (e.clientY - rect.top) / cardH - 0.5;

      // Calculate target rotation degrees (pressed in towards mouse)
      const maxRot = 12;
      mouseRef.current.targetX = mouseY * maxRot;
      mouseRef.current.targetY = -mouseX * maxRot;

      // Calculate distance factor from center (0 to 1)
      const dist = Math.hypot(mouseX, mouseY);
      const maxDist = Math.hypot(0.5, 0.5);
      const factor = Math.max(0, 1 - dist / maxDist); // 1 at center, 0 at corners
      mouseRef.current.targetScale = 1.02 + 0.08 * factor; // 1.02 to 1.10 scale

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
      className="py-20 md:py-32 w-full bg-[#F8F8F6] relative overflow-hidden flex flex-col items-center border-t border-black/[0.04] font-neue select-none"
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center relative">
        
        {/* Top heading / Story copy */}
        <div className="text-center mb-10 md:mb-16 max-w-4xl">
          <span className="text-xs uppercase tracking-widest text-[#7C3AED] font-bold mb-4 block">
            Inside the platform
          </span>
          <h2 className="video-showcase-title text-3xl md:text-4.5xl lg:text-5.5xl font-bold text-neutral-900 leading-[1.12] tracking-tight mb-6 font-neue">
            {titleWords.map((word, i) => (
              <span key={i} className="reveal-word inline-block mr-[0.25em] opacity-15 transition-opacity duration-300">
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* GSAP scroll trigger wrapper */}
        <div
          ref={gsapWrapperRef}
          className="w-full max-w-7xl will-change-transform"
        >
          {/* Continuous floating animation wrapper */}
          <div className="dashboard-float-wrapper">
            {/* Floating iPad visual with interactive specular glare and tilt */}
            <div
              ref={cardRef}
              className="relative w-full rounded-2xl md:rounded-[32px] overflow-hidden bg-black shadow-[0_45px_100px_rgba(0,0,0,0.12)] border border-black/10 flex items-center justify-center will-change-transform"
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

              {/* Actual Dashboard Image asset with scale to crop out the white outer bezel */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/dashboard.png"
                alt="Predict Clinical Dashboard"
                className="w-full h-auto object-cover relative z-10 block pointer-events-none scale-[1.13]"
              />
            </div>
          </div>
        </div>

        {/* Supporting statement below */}
        <div className="text-center mt-10 md:mt-16 max-w-4xl">
          <p className="font-neue text-base md:text-lg lg:text-xl xl:text-2.5xl tracking-wider text-[#7C3AED] uppercase font-bold leading-relaxed">
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
