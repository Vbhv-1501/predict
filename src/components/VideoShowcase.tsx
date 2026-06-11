"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Activity, Sparkles, Cpu } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!elementRef.current || !containerRef.current) return;

    // 1. GSAP ScrollTrigger for Scale-Up and Fade-In Animation
    const animation = gsap.fromTo(
      elementRef.current,
      {
        scale: 0.92,
        opacity: 0,
        y: 40,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 1.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        },
      }
    );

    // 2. Interactive Kinetic Canvas Simulator (glowing skeletal movement paths)
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = canvas.clientWidth * 2);
    let height = (canvas.height = canvas.clientHeight * 2);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth * 2;
      height = canvas.height = canvas.clientHeight * 2;
    };

    window.addEventListener("resize", handleResize);

    // Simulated joint nodes
    const nodes = Array.from({ length: 12 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 4 + 2,
    }));

    let time = 0;

    const draw = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw vector grid lines
      ctx.strokeStyle = "rgba(124, 58, 237, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw kinetic biomechanical waves (simulating load velocity)
      ctx.strokeStyle = "rgba(146, 89, 199, 0.15)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const sin1 = Math.sin(x * 0.003 + time * 1.5) * 60;
        const sin2 = Math.cos(x * 0.006 - time * 0.8) * 30;
        const y = height / 2 + sin1 + sin2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(124, 58, 237, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const sin1 = Math.cos(x * 0.004 + time * 1.2) * 50;
        const sin2 = Math.sin(x * 0.008 - time * 1.6) * 20;
        const y = height / 2.3 + sin1 + sin2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Connect nodes (skeletal vectors)
      ctx.strokeStyle = "rgba(124, 58, 237, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < width * 0.3) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Render glowing joint nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(146, 89, 199, 0.5)";
        ctx.fill();

        // Core joint indicator
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#7C3AED";
        ctx.fill();
      });

      // Draw custom interactive scanner bar
      const scanY = (Math.sin(time * 0.8) + 1) * 0.5 * height;
      ctx.strokeStyle = "rgba(124, 58, 237, 0.35)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(124, 58, 237, 0.5)";
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId);
      animation.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 w-full bg-[#F8F8F6] relative overflow-hidden flex flex-col items-center border-t border-black/[0.04]"
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
        {/* Title / Description */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-primary-600 font-semibold mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Demonstration
          </span>
          <h2 className="section-title text-neutral-900">
            Biomechanical Video Showcase
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto font-light mt-4">
            Witness how Predict maps joint angles, load velocity, and posture vectors in real time during movement.
          </p>
        </div>

        {/* Centered Large Showcase Video/Canvas container */}
        <div
          ref={elementRef}
          className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden glass-panel border border-black/[0.06] shadow-[0_20px_50px_rgba(80,79,237,0.06)] flex items-center justify-center"
        >
          {/* Kinetic Wave Canvas (simulating motion tracking) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full bg-[#ffffff]/60 object-cover"
          />

          {/* Biometric Scan Telemetry HUD Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-10 select-none">
            {/* Top Row: Scanner Status & Signal strength */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-neutral-900/5 backdrop-blur-md rounded-lg border border-black/[0.05]">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-neutral-800 uppercase font-semibold">
                  SCANNER STATE: ACTIVE
                </span>
              </div>
              
              <div className="flex flex-col items-end gap-1 font-mono text-[9px] text-neutral-500">
                <span>FPS: 60.00 // CALIBRATED</span>
                <span>MODEL: BIOMETH_V2.1</span>
              </div>
            </div>

            {/* Centered Premium Overlay (Play Button & Scanning HUD) */}
            <div className="flex flex-col items-center justify-center gap-4">
              <button className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-neutral-900 border border-black/[0.08] shadow-lg flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-300 hover:scale-105 group">
                <Play className="w-6 h-6 fill-current text-accent group-hover:text-accent/90 translate-x-0.5" />
              </button>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-800 px-3 py-1 bg-white/40 backdrop-blur-sm rounded-full border border-black/[0.04]">
                Biomechanical Render Active
              </span>
            </div>

            {/* Bottom Row: Telemetry Indicators */}
            <div className="flex justify-between items-end">
              <div className="flex gap-4 font-mono text-[10px] text-neutral-700">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-accent" />
                  <span>KINETIC RATIO: 1.04</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-primary-500" />
                  <span>SKELETAL NODES: 12/12</span>
                </div>
              </div>

              <span className="text-[9px] font-mono text-neutral-400">
                RESOLUTION: 3840 X 2160 (MAPPED)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
