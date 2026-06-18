"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Activity } from "lucide-react";

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

export default function BiomechanicalSection() {
  return (
    <section className="py-32 relative bg-[#0D0D0F] text-white border-y border-white/[0.05] overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold mb-3 block">
              Quantified Self
            </span>
            <h2 className="section-title text-white mb-6">
              Benchmark Today.<br />
              Breakthrough Tomorrow.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Create a permanent biomechanical baseline for your future health. Access premium tracking protocols to map physical velocity, adjust vector loads, and preempt structural deterioration.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                "Create a baseline for health",
                "Track movement improvement",
                "Measure real-time progress",
                "Prevent degenerative decline",
                "Move confidently & safely",
                "Optimize mechanical longevity"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm text-white/85 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Premium Biomechanical Visualizer Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(124,58,237,0.06)] flex flex-col gap-6"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-semibold text-white/90">Biomechanical Live Stream</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </div>

            {/* Graphical simulation of joints */}
            <div className="h-64 bg-[#09090b] rounded-xl relative overflow-hidden flex items-center justify-center border border-white/[0.08]">
              <BiomechanicalLiveStreamCanvas />

              {/* Floating Metric indicators */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded border border-white/[0.1] text-[10px] font-mono text-white/60 z-10">
                KNEE EXT: 142.3&deg;
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded border border-white/[0.1] text-[10px] font-mono text-white/60 z-10">
                LOAD VEC: 84.1 N/kg
              </div>
            </div>

            {/* Simulated status cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: "Gait Symmetry", val: "98.2%", color: "text-accent" },
                { label: "Joint Stress", val: "Optimal", color: "text-green-400" },
                { label: "Stability Index", val: "94.7", color: "text-purple-400" }
              ].map((m, idx) => (
                <div key={idx} className="p-3 bg-white/[0.01] border border-white/[0.08] rounded-xl text-center">
                  <span className="text-[10px] text-white/40 block mb-1 uppercase tracking-wider">{m.label}</span>
                  <span className={`text-sm font-semibold font-mono ${m.color}`}>{m.val}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
