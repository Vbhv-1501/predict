"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CarouselCard {
  id: number;
  heading: string;
  visual: React.ReactNode;
}

export default function StoryCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [yOffset, setYOffset] = useState(540);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setYOffset(360);
      } else {
        setYOffset(540);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !panelRef.current) return;

    const cards = cardRefs.current.filter((card): card is HTMLDivElement => card !== null);
    const totalSteps = CARDS.length; // 5 cards

    const state = { progress: 0 };

    // GSAP ScrollTrigger pin animation
    // Pinning ends when Card 5 becomes active (totalSteps - 1 = 4 transitions)
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${(totalSteps - 1) * 110}%`,
        pin: panelRef.current,
        pinSpacing: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    // Animate custom progress variable from 0 to 4
    timeline.to(state, {
      progress: totalSteps - 1,
      ease: "none",
      duration: totalSteps - 1,
      onUpdate: () => {
        const p = state.progress;

        cards.forEach((card, i) => {
          const diff = i - p;
          let opacity = 0;
          let scale = 0.68;
          let y = 0;

          const absDiff = Math.abs(diff);

          if (absDiff < 1.35) {
            // Smoothly interpolate active states
            opacity = Math.max(0, 1 - absDiff * 0.75);
            // Center is scale 1.0, non-active/top/bottom is scale 0.68
            scale = 1 - Math.min(1.0, absDiff) * 0.32;
            
            // Clamp translation offset to prevent bottom/top card drifting
            const clampedDiff = Math.max(-1.2, Math.min(1.2, diff));
            y = clampedDiff * yOffset;
          } else {
            // Hidden cards
            opacity = 0;
            scale = 0.68;
            y = diff > 0 ? yOffset * 1.5 : -yOffset * 1.5;
          }

          // Apply state transformations directly for 60fps performance
          card.style.opacity = `${opacity}`;
          card.style.transform = `translate3d(-50%, calc(-50% + ${y}px), 0) scale(${scale})`;
          
          // Toggle pointer events so only active center card is clickable/focusable
          if (absDiff < 0.3) {
            card.style.pointerEvents = "auto";
            card.style.zIndex = "10";
          } else {
            card.style.pointerEvents = "none";
            card.style.zIndex = "5";
          }
        });
      },
    });

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, [yOffset]);

  return (
    <section ref={sectionRef} className="relative z-10 w-full bg-[#F8F8F6]">
      <div
        ref={panelRef}
        className="h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#F8F8F6]"
      >
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 w-full max-w-lg md:max-w-2xl lg:max-w-4xl pointer-events-none will-change-transform opacity-0 px-6"
            style={{
              transform: "translate3d(-50%, -50%, 0) scale(0.68)",
            }}
          >
            <div className="flex flex-col items-center gap-8 w-full text-center">
              {/* Card copy heading at the top */}
              <h3 className="font-neue font-bold text-2xl md:text-3xl lg:text-4.5xl text-neutral-900 leading-tight">
                {card.heading}
              </h3>
              {/* Visualizer Showcase Panel (no padding around it, no background box) */}
              <div className="w-full aspect-video flex items-center justify-center bg-[#0B0B0C] border border-black/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.22)] relative">
                {card.visual}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================ custom visualizers ============================ */

function PurpleBiomarkerVisual() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-[#0b0b0c] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0%,transparent_75%)] overflow-hidden select-none">
      {/* Wave grids background */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 0 50 Q 25 35 50 50 T 100 50" fill="none" stroke="#7C3AED" strokeWidth="0.5" />
        <path d="M 0 60 Q 25 45 50 60 T 100 60" fill="none" stroke="#7C3AED" strokeWidth="0.3" />
      </svg>
      {/* Glowing network nodes - Centered Grid */}
      <div className="relative z-10 grid grid-cols-3 gap-x-8 gap-y-6 text-center justify-center items-center w-full max-w-sm font-mono text-[9px] text-white/50">
        {[
          { label: "GLUCOSE", val: "94 mg/dL", color: "text-[#7FB2FF]" },
          { label: "HRV", val: "72 ms", color: "text-neutral-300" },
          { label: "SLEEP", val: "8h 12m", color: "text-[#8FA6FF]" },
          { label: "ApoB", val: "68 mg/dL", color: "text-[#7C3AED]" },
          { label: "FERRITIN", val: "42 ng/mL", color: "text-[#F3A6B0]" },
          { label: "AMINO", val: "OPTIMAL", color: "text-[#E9D7A6]" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col gap-1 items-center justify-center text-center">
            <span className="text-[8px] opacity-40 uppercase tracking-widest">{item.label}</span>
            <span className={`text-[11px] font-bold ${item.color}`}>{item.val}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-4 right-4 text-[8px] font-mono text-white/30 tracking-widest uppercase">
        Telemetry Live
      </div>
    </div>
  );
}

function DiseasePredictionVisual() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-[#0b0b0c] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0%,transparent_75%)] overflow-hidden select-none">
      {/* Futuristic Concentric Radar Ring scanning */}
      <div className="relative w-36 h-36 border border-white/[0.04] rounded-full flex items-center justify-center">
        <div className="absolute inset-2 border border-white/[0.07] border-dashed rounded-full" />
        <div className="absolute inset-8 border border-white/[0.05] rounded-full" />
        {/* Pulsing indicator node */}
        <div className="absolute top-[20%] left-[25%] h-3 w-3 bg-[#7C3AED] rounded-full animate-ping shadow-[0_0_10px_#7C3AED]" />
        <div className="absolute top-[20%] left-[25%] h-2.5 w-2.5 bg-[#7C3AED] rounded-full border border-white/40" />

        {/* Scan line indicator */}
        <div className="absolute inset-0 rounded-full border border-t-[#7C3AED] border-r-transparent border-b-transparent border-l-transparent animate-spin duration-3000 ease-linear" />
      </div>
      {/* Centered Pathology Radar Info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center font-mono text-[9px] text-white/40 leading-relaxed uppercase w-full">
        <div>{"// PATHOLOGY RADAR ENGINE"}</div>
        <div className="text-[#7C3AED] font-bold">WARNING: ApoB TREND ELEVATION DETECTED</div>
      </div>
    </div>
  );
}

function MedicalSignalVisual() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-[#0b0b0c] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0%,transparent_75%)] overflow-hidden select-none">
      {/* Heartbeat Easing waveform path */}
      <svg className="w-full h-32 text-[#7C3AED]" viewBox="0 0 400 120">
        <path
          d="M 10 60 L 100 60 L 120 40 L 130 90 L 140 20 L 155 70 L 170 60 L 250 60 L 270 10 L 285 110 L 300 45 L 315 70 L 330 60 L 390 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shadow-lg filter drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]"
        />
      </svg>
      {/* Centered Header label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center font-mono text-[9px] text-white/30 uppercase tracking-widest w-full">
        Waveform Diagnostic V3.2
      </div>
    </div>
  );
}

function AITrainingVisual() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-[#0b0b0c] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0%,transparent_75%)] overflow-hidden select-none">
      {/* Shifting cluster grid card effect representing datasets */}
      <div className="relative w-48 h-32 border border-white/[0.06] rounded-xl bg-white/[0.02] flex flex-col justify-between p-4 font-mono text-[9px] text-white/50 shadow-2xl">
        <div className="flex justify-between items-start">
          <span className="text-[#7C3AED] font-bold">MODEL.TRAIN(DATASET)</span>
          <span className="opacity-40">30K RUNS</span>
        </div>
        <div className="flex flex-col gap-1.5 opacity-60">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#7C3AED] w-[82%] animate-pulse" />
          </div>
          <div className="flex justify-between text-[8px] opacity-40">
            <span>EPOCH 420/500</span>
            <span>ERROR RATIO: 0.04%</span>
          </div>
        </div>
        <div className="text-[8px] opacity-30 uppercase text-center">
          Neural Architecture Calibrated
        </div>
      </div>
    </div>
  );
}

function MuscleAgeVisual() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-[#0b0b0c] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0%,transparent_75%)] overflow-hidden select-none">
      {/* Torque circle gauge representing biomechanics */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Semi-circular torque ring */}
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="6"
            strokeDasharray="251.2"
            strokeDashoffset="75.3"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex flex-col items-center justify-center text-center font-mono">
          <span className="text-3xl font-extrabold text-white leading-none">24</span>
          <span className="text-[9px] text-white/40 tracking-wider uppercase mt-1">Muscle Age</span>
        </div>
      </div>
      {/* Centered Bio-Age Index Info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center font-mono text-[9px] text-[#7C3AED] font-bold uppercase tracking-widest w-full">
        {"BIO-AGE INDEX // OPTIMAL"}
      </div>
    </div>
  );
}

/* CARDS DATA IN SCROLL ORDER */
const CARDS: CarouselCard[] = [
  {
    id: 1,
    heading: "Your blood carried it every single day.",
    visual: <PurpleBiomarkerVisual />,
  },
  {
    id: 2,
    heading: "Every disease was signalled years in advance.",
    visual: <DiseasePredictionVisual />,
  },
  {
    id: 3,
    heading: "Nobody built a test to read it.",
    visual: <MedicalSignalVisual />,
  },
  {
    id: 4,
    heading: "Nobody trained a model on 30,000 patients.",
    visual: <AITrainingVisual />,
  },
  {
    id: 5,
    heading: "Nobody connected the signals to muscle age.",
    visual: <MuscleAgeVisual />,
  },
];
