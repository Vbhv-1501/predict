"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Activity } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function BiomechanicalLiveStreamCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const drawWave = (
      yBase: number,
      color: string,
      amp: number,
      freq: number,
      speed: number,
      time: number
    ) => {
      ctx.beginPath();
      for (let x = -20; x <= width + 20; x += 3) {
        const y =
          yBase +
          Math.sin(x * freq + time * speed) * amp +
          Math.cos(x * freq * 0.42 - time * speed * 0.7) * amp * 0.42;
        if (x === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const draw = (ms: number) => {
      const t = ms * 0.001;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#070709";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(124,58,237,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 34) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 34) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      drawWave(height * 0.28, "rgba(124,58,237,0.85)", 18, 0.022, 2.2, t);
      drawWave(height * 0.43, "rgba(146,89,199,0.75)", 13, 0.028, -2.9, t);
      drawWave(height * 0.59, "rgba(232,232,234,0.62)", 10, 0.038, 3.7, t);
      drawWave(height * 0.73, "rgba(244,63,94,0.45)", 8, 0.026, -1.8, t);

      const hip = { x: width * 0.28 + Math.sin(t * 1.6) * 8, y: height * 0.38 + Math.cos(t * 1.4) * 6 };
      const knee = { x: width * 0.48 + Math.sin(t * 1.9 + 1) * 18, y: height * 0.57 + Math.cos(t * 1.6) * 18 };
      const ankle = { x: width * 0.39 + Math.sin(t * 1.7 + 2.1) * 15, y: height * 0.78 + Math.cos(t * 1.5) * 10 };
      const foot = { x: width * 0.62 + Math.sin(t * 2.2 + 2.8) * 12, y: height * 0.84 + Math.cos(t * 1.4) * 7 };
      const joints = [hip, knee, ankle, foot];

      ctx.strokeStyle = "rgba(124,58,237,0.42)";
      ctx.lineWidth = 2.4;
      ctx.shadowColor = "rgba(124,58,237,0.55)";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(hip.x, hip.y);
      ctx.lineTo(knee.x, knee.y);
      ctx.lineTo(ankle.x, ankle.y);
      ctx.lineTo(foot.x, foot.y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      joints.forEach((joint, idx) => {
        const pulse = 7 + Math.sin(t * 4 + idx) * 2;
        ctx.fillStyle = "rgba(124,58,237,0.14)";
        ctx.beginPath();
        ctx.arc(joint.x, joint.y, pulse + 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = idx === 1 ? "#7C3AED" : "#9259C7";
        ctx.beginPath();
        ctx.arc(joint.x, joint.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      const scanX = (t * 68) % (width + 80) - 40;
      const scan = ctx.createLinearGradient(scanX - 36, 0, scanX + 36, 0);
      scan.addColorStop(0, "rgba(124,58,237,0)");
      scan.addColorStop(0.5, "rgba(124,58,237,0.5)");
      scan.addColorStop(1, "rgba(124,58,237,0)");
      ctx.strokeStyle = scan;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

function WordReveal({ text, className = "", delay = 0 }: WordRevealProps) {
  const words = text.split(" ");
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };
  
  const wordVariants = {
    hidden: {
      opacity: 0.15,
      y: 6,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1], // easeOutQuart
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={`inline-block ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={wordVariants}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function BiomechanicalSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const startScale = 0.85;
    const endScale = isMobile ? 1.0 : 1.08;

    const ctx = gsap.context(() => {
      gsap.fromTo(card,
        {
          scale: startScale,
          opacity: 0.85,
          transformOrigin: "center center"
        },
        {
          scale: endScale,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 20%",
            scrub: true,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="science" ref={sectionRef} className="py-32 relative bg-[#000000] text-white border-y border-white/[0.05] overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col justify-center">
            <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold mb-3 block">
              <WordReveal text="Quantified Self" />
            </span>
            <h2 className="section-title text-white mb-4">
              <WordReveal text="Why We Built Bio-AgeClocks™" />
            </h2>
            <p className="text-[#7C3AED] text-lg font-semibold mb-6">
              <WordReveal text="Health should be measured before it is felt." delay={0.15} />
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-white/85 leading-relaxed">
                  <WordReveal text="Muscles, nerves, blood vessels, bones, and joints age together." delay={0.3} />
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-white/85 leading-relaxed">
                  <WordReveal text="Bio-AgeClocks™ decode these hidden signals to measure structural aging and uncover future health risks—years before symptoms appear." delay={0.45} />
                </span>
              </div>
            </div>
          </div>

          {/* Premium Biomechanical Visualizer Box */}
          <div
            ref={cardRef}
            className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(124,58,237,0.06)] flex flex-col gap-6 will-change-transform"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-semibold text-white/90">Advanced biomarker panel</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </div>

            {/* Graphical simulation of joints */}
            <div className="h-64 bg-[#09090b] rounded-xl relative overflow-hidden flex items-center justify-center border border-white/[0.08]">
              <BiomechanicalLiveStreamCanvas />
            </div>

            {/* Simulated status cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Proprietary Multidomain Algorithm",
                "Built on 30,000+ Clinical Data Points",
                "Patent Filed",
                "Validated Through Peer-Reviewed Research"
              ].map((text, idx) => (
                <div key={idx} className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl flex items-center justify-center text-center">
                  <span className="text-xs font-semibold text-white/80 leading-normal">{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
