"use client";

import React, { useEffect, useRef, useState } from "react";
import WaitlistSection from "./WaitlistSection";
import ScienceOrbitSection from "./ScienceOrbitSection";
import { motion, useInView } from "framer-motion";
import { 
  Activity, 
  CheckCircle2, 
  Zap,
  TrendingUp,
  Sliders,
  Sparkles,
  Search,
  User
} from "lucide-react";

// Helper Component for Scroll-based Counting Animations
interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

function Counter({ from, to, duration = 1.5, suffix = "", className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(from);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTriggered(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;

    let startTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = progress * (2 - progress); // easeOutQuad
      setVal(Math.round(from + (to - from) * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [triggered, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
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

function ProfileMark() {
  return (
    <span className="profile-mark" aria-hidden="true">
      <User className="h-5 w-5" />
    </span>
  );
}

export default function Sections() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const phoneInView = useInView(phoneRef, { once: false, margin: "-100px" });

  // Testimonials content
  const testimonials = [
    {
      quote: "Predict completely redesigned my approach to recovery. We caught a lateral load imbalance that would have triggered a severe ligament tear inside 6 weeks.",
      author: "Dr. Vikram Sethi",
      role: "Sports Medicine Specialist & Athlete Advisor"
    },
    {
      quote: "I thought my aging joints were locked. Predict identified micro-stiffness vectors in my right ankle that, once corrected, restored my mobility index to what it was a decade ago.",
      author: "Ananya Roy",
      role: "Hobbyist Runner & Health Advocate, Age 48"
    },
    {
      quote: "Movement intelligence is the missing pillar in preventive biohacking. Predict's biomapping datasets are as crucial to structural health as blood panels are to metabolic health.",
      author: "Kabir Mehta",
      role: "Longevity Researcher & Wellness Officer"
    },
    {
      quote: "The predictive gait analysis is unmatched. We adjusted my stride symmetry by just 1.5% and solved a chronic lower back issue that bothered me for years.",
      author: "Rohan Malhotra",
      role: "National Decathlon Coach & Bio-analyst"
    },
    {
      quote: "As a longevity investor, I evaluate clinical tech. Predict is years ahead in converting raw biomechanical mapping into real, actionable preventive protocols.",
      author: "Dr. Aisha Sen",
      role: "Ventures Partner & Biotech MD"
    },
    {
      quote: "Our trainers use Predict to assess client mechanical limitations. It removes the guesswork, speeds up rehab, and prevents recurring training strain.",
      author: "Devendra Singh",
      role: "Director of Elite Performance, Equinox India"
    }
  ];

  // Infinite Marquee duplicate sets
  const row1 = [...testimonials, ...testimonials];
  const row2 = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()];
  const row3 = [...testimonials.slice(2), ...testimonials.slice(0, 2), ...testimonials.slice(2), ...testimonials.slice(0, 2)];

  return (
    <div className="relative w-full bg-[#F8F8F6] text-foreground">
      
      {/* SECTION 4: 9000+ DATA POINTS */}
      <section className="py-24 bg-[#0B0B0C] relative overflow-hidden border-y border-white/[0.05]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.08),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="text-6xl sm:text-8xl md:text-9xl font-bold font-mono text-gradient-purple mb-4 select-none drop-shadow-[0_0_25px_rgba(124,58,237,0.25)]">
              <Counter from={0} to={9000} suffix="+" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-2">
              One Revolutionary Assessment.
            </h3>
            <p className="text-sm text-white/50">
              Thousands Of Insights. Fully Mapped In Real Time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section id="how-it-works" className="py-32 relative bg-[#F8F8F6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-widest text-primary-600 font-semibold mb-3 block">
              Methodology
            </span>
            <h2 className="section-title text-neutral-900">The Analysis Pipeline</h2>
            <p className="text-neutral-500 max-w-lg mx-auto font-light mt-4">
              A frictionless assessment path designed to convert raw biomechanics into structured biological actions.
            </p>
          </div>

          <div className="relative">
            {/* Connecting animated line for process flow (desktop lg screens only) */}
            <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-[3px] -translate-y-1/2 -z-10 bg-neutral-200/50 rounded-full overflow-hidden">
              <div className="h-full w-full animated-flow-line" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Capture",
                  desc: "Record a short 10-minute dynamic movement sequence using our biomarker tracking platform."
                },
                {
                  step: "02",
                  title: "Analyze",
                  desc: "Decode over 9,000 biomechanical parameters, joint force loads, and structural kinetic imbalances."
                },
                {
                  step: "03",
                  title: "Predict",
                  desc: "Identify potential soft-tissue risks, joint decline vectors, and systemic biological aging rate."
                },
                {
                  step: "04",
                  title: "Optimize",
                  desc: "Deploy highly custom protocols consisting of targeted movement correctives and neuromuscular training."
                }
              ].map((step, i) => (
                <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 0.6, delay: i * 0.15 }}
                   className="glass-card pipeline-card p-8 rounded-2xl relative border border-black/[0.05]"
                >
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-accent mb-4 block uppercase">
                    STEP &mdash; {step.step}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: DATA DRIVEN INSIGHTS */}
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

      {/* SECTION 7: FEATURE GRID */}
      <section id="science" className="py-32 relative bg-[#0D0D0F] text-white border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold mb-3 block">
              Core Capabilities
            </span>
            <h2 className="section-title text-white">Movement Intelligence Grid</h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm font-light mt-4">
              Explore the advanced biomechanical layers mapped during our primary diagnostic assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Activity className="w-5 h-5" />,
                title: "Movement Intelligence",
                desc: "Track full-body kinematics, load velocity distributions, and skeletal alignment anomalies."
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Preventive Insights",
                desc: "Identify neuromuscular fatigue zones and potential overuse stresses before strain occurs."
              },
              {
                icon: <Sliders className="w-5 h-5" />,
                title: "Mobility Assessment",
                desc: "Measure dynamic ranges of motion, joint angles, and mechanical stiffness vectors."
              },
              {
                icon: <Search className="w-5 h-5" />,
                title: "Biomarker Tracking",
                desc: "Map biological gait parameters and relate performance to physiological cell decay indicators."
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: "Health Benchmarking",
                desc: "Compare your results against clinical movement cohorts and age-adjusted baselines."
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: "Personalized Optimization",
                desc: "Deploy machine-learning driven routines targeting skeletal weaknesses and kinetic imbalances."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl flex flex-col group relative overflow-hidden border border-white/[0.08]"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                {/* Accent glow hover highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-primary-400 group-hover:text-accent transition-colors duration-300 w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-[13px] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: APP EXPERIENCE */}
      <section className="py-32 relative overflow-hidden bg-[#FAFAFA] border-y border-black/[0.04]">
        {/* Glow behind phone */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-xs uppercase tracking-widest text-primary-600 font-semibold mb-3 block">
                  The Ecosystem
                </span>
                <h2 className="section-title text-neutral-900 mb-8">
                  Your Physical Blueprint, Pinned In Your Pocket.
                </h2>
                
                <div className="space-y-6">
                  {[
                    { title: "Health Score", desc: "A unified metric reflecting neuromuscular efficiency, mobility limits, and load capacity." },
                    { title: "Movement Report", desc: "Detailed breakdown of kinetic symmetry, stride profiles, and posture logs." },
                    { title: "Risk Indicators", desc: "Early warnings mapping structural fatigue and joints under mechanical stress." },
                    { title: "Progress Tracking", desc: "Longitudinal assessments mapping how corrective routines shift kinetic balances." },
                    { title: "Personalized Insights", desc: "Real-time, actionable alerts mapping correctives based on your day's work." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="h-6 w-6 rounded-full bg-primary-900/60 border border-primary-500/20 flex items-center justify-center text-xs font-mono font-semibold text-primary-600 mt-1 shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-neutral-800 font-medium text-base">{item.title}</h4>
                        <p className="text-neutral-600 text-[13px] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Premium Interactive CSS Phone Mockup */}
            <div className="lg:col-span-7 flex justify-center" ref={phoneRef}>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="relative w-full max-w-80 h-[640px] rounded-[40px] sm:rounded-[48px] border-[8px] sm:border-[10px] border-neutral-800 bg-neutral-950 shadow-[0_25px_60px_rgba(124,58,237,0.06)] overflow-hidden"
              >
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-white/10 rounded-b-2xl z-30 flex items-center justify-center">
                  <div className="w-12 h-1 bg-black/60 rounded-full" />
                </div>

                {/* Dashboard UI */}
                <div className="p-6 pt-10 flex flex-col gap-6 h-full bg-gradient-to-b from-[#110a24] to-black">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase tracking-wider">Dashboard</span>
                      <span className="text-lg font-semibold text-white">PREDICT Index</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-xs font-semibold text-primary-500">
                      ID
                    </div>
                  </div>

                  {/* Health Score Card */}
                  <div className="p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden flex justify-between items-center bg-white/[0.03]">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase block tracking-wider mb-1">Health Score</span>
                      <span className="text-3xl font-light font-mono text-white">88.4</span>
                      <span className="text-[10px] text-green-400 block mt-1 font-mono">+2.1% this week</span>
                    </div>
                    {/* Ring progress bar representation */}
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      <svg className="w-full h-full text-white/[0.03] overflow-visible" viewBox="0 0 36 36">
                        <path className="text-white/[0.08]" stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <motion.path 
                          className="text-accent glow-purple-soft" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phoneInView ? 0.88 : 0 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <span className="absolute text-[11px] font-mono text-white/80 font-bold">Optimal</span>
                    </div>
                  </div>

                  {/* Graph */}
                  <div className="p-4 rounded-2xl border border-white/[0.08] flex flex-col gap-3 bg-white/[0.03]">
                    <span className="text-[10px] text-white/50 uppercase block tracking-wider">Neuromuscular load</span>
                    <div className="h-24 relative flex items-end justify-between px-1">
                      {/* Simulating graph bars */}
                      {[40, 65, 50, 75, 90, 60, 85].map((val, idx) => (
                        <div key={idx} className="w-2.5 bg-white/[0.04] rounded-t h-full relative">
                          <motion.div 
                            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary-900 to-accent rounded-t"
                            initial={{ height: "0%" }}
                            animate={{ height: phoneInView ? `${val}%` : "0%" }}
                            transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] text-white/40 font-mono">
                      <span>MON</span>
                      <span>WED</span>
                      <span>FRI</span>
                      <span>SUN</span>
                    </div>
                  </div>

                  {/* Interactive Widgets */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-white/50 uppercase block tracking-wider mb-1">Assessments</span>
                    {[
                      { title: "Joint Mobility Assessment", status: "Completed", time: "10m" },
                      { title: "Muscle Stress Vector Mapping", status: "In Progress", time: "3m" }
                    ].map((w, idx) => (
                      <motion.div 
                        key={idx} 
                        className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl flex justify-between items-center"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: phoneInView ? 1 : 0, y: phoneInView ? 0 : 15 }}
                        transition={{ duration: 0.5, delay: idx * 0.15 + 0.4 }}
                      >
                        <div>
                          <span className="text-[11px] text-white font-medium block">{w.title}</span>
                          <span className="text-[9px] text-white/40 block mt-0.5">{w.status}</span>
                        </div>
                        <span className="text-[10px] font-mono text-primary-500 bg-primary-950/40 border border-primary-500/20 px-2 py-0.5 rounded">
                          {w.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 9: SOCIAL PROOF (TESTIMONIALS LOOPING MARQUEE) */}
      <section className="py-32 relative overflow-hidden bg-[#0B0B0C] text-white border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center">
            <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold mb-3 block">
              Testimonials
            </span>
            <h2 className="section-title text-white">Movement Changed Everything.</h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm mt-4">
              Read how elite athletes, clinical researchers, and preventive health pioneers leverage Predict.
            </p>
          </div>
        </div>

        {/* Triple looping horizontal marquee */}
        <div className="w-full flex flex-col gap-6 py-4 overflow-hidden hover-pause">
          {/* Row 1 */}
          <div className="marquee-container">
            <div className="marquee-track animate-marquee-normal gap-6 flex">
              {row1.map((t, idx) => (
                <div
                  key={idx}
                  className="testimonial-card w-[420px] shrink-0 p-8 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300"
                >
                  <p className="text-white/90 text-[13px] leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <ProfileMark />
                    <h4 className="text-white font-semibold text-sm">{t.author}</h4>
                    <p className="text-primary-400 text-[10px] mt-0.5 font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="marquee-container">
            <div className="marquee-track animate-marquee-reverse-slow gap-6 flex">
              {row2.map((t, idx) => (
                <div
                  key={idx}
                  className="testimonial-card w-[420px] shrink-0 p-8 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300"
                >
                  <p className="text-white/90 text-[13px] leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <ProfileMark />
                    <h4 className="text-white font-semibold text-sm">{t.author}</h4>
                    <p className="text-primary-400 text-[10px] mt-0.5 font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div className="marquee-container">
            <div className="marquee-track animate-marquee-fast gap-6 flex">
              {row3.map((t, idx) => (
                <div
                  key={idx}
                  className="testimonial-card w-[420px] shrink-0 p-8 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300"
                >
                  <p className="text-white/90 text-[13px] leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <ProfileMark />
                    <h4 className="text-white font-semibold text-sm">{t.author}</h4>
                    <p className="text-primary-400 text-[10px] mt-0.5 font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Counter Row */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/[0.08] pt-16 text-center mt-12">
            {[
              { to: 9000, suffix: "+", label: "Biomechanical Data Points" },
              { to: 95, suffix: "%", label: "Assessment Accuracy Rate" },
              { to: 10, suffix: " Min", label: "Frictionless Assessment Time" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-5xl md:text-6xl font-bold font-mono text-gradient-purple drop-shadow-[0_0_10px_rgba(124,58,237,0.15)]">
                  <Counter from={0} to={stat.to} suffix={stat.suffix} />
                </span>
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9.5: SCIENCE ORBIT SECTION */}
      <ScienceOrbitSection />

      {/* SECTION 10: FULLSCREEN STATEMENT */}
      <section className="py-40 relative bg-gradient-to-b from-[#0B0B0C] to-[#120D1A] overflow-hidden flex items-center justify-center border-y border-white/[0.05]">
        <div className="absolute inset-0 bg-[#EFEAF7]/5 pointer-events-none" />
        <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight uppercase select-none">
              You Age From Your Legs Up.<br />
              <span className="text-accent font-semibold">Optimize From The Ground Down.</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* SECTION 11: FINAL CTA */}
      <section className="py-32 relative text-center bg-[#0B0B0C] text-white border-y border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.08),transparent_60%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              The Future Of Health<br />Starts With Movement.
            </h2>
            <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10">
              Measure what matters before it becomes a problem. Claim your dynamic biomechanical diagnostic profile today.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full btn-medium transition-all duration-300 shadow-lg shadow-accent/15 cursor-pointer animate-pulse-glow"
              >
                Book Your Test
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("how-it-works");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/80 font-semibold rounded-full btn-medium transition-all duration-300 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 12: WAITLIST SECTION */}
      <WaitlistSection id="contact" />

      {/* FOOTER */}
      <footer className="pt-24 pb-16 px-6 text-[#EFEFEF] border-t border-[#EFEFEF]/[0.05] relative overflow-hidden font-neue" style={{ background: 'linear-gradient(180deg, #000000 0%, #1a0d2e 50%, #47307D 100%)' }}>
        {/* Enhanced multi-layered premium purple gradient glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(71,48,125,0.32),transparent_75%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(71,48,125,0.18),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(71,48,125,0.18),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Stretched Out Wordmark Logo */}
          <div className="w-full flex justify-center mb-16 select-none pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Predict-Logo.png"
              alt="PREDICT"
              className="w-full h-auto max-h-[120px] md:max-h-[180px] lg:max-h-[240px] object-contain opacity-90 contrast-125"
            />
          </div>

          {/* Bottom Grid: Info on left, Links on right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end pt-8 border-t border-[#EFEFEF]/[0.08]">
            {/* Copyright & Developer block */}
            <div className="flex flex-col gap-1 font-mono text-[10px] tracking-wider text-[#EFEFEF]/30 font-bold leading-normal">
              <div>2026 PREDICT MOVEMENT INTELLIGENCE, INC.</div>
              <div>ALL RIGHTS RESERVED</div>
              
              {/* Trust Logos */}
              <div className="flex gap-3.5 my-4 items-center">
                <div className="w-14 h-14 rounded-full bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src="/assets/nature-logo.svg" alt="Nature" className="w-9 h-9 object-contain" />
                </div>
                <div className="w-14 h-14 rounded-full bg-[#00479b] border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src="/assets/aging-logo.svg" alt="Aging" className="w-9 h-9 object-contain" />
                </div>
                <div className="w-14 h-14 rounded-full bg-white border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src="/assets/wiley-logo.svg" alt="Wiley" className="w-9 h-9 object-contain" />
                </div>
              </div>

              <div className="mt-1 text-[#EFEFEF]/15">DEVELOPED BY URBAN BEAR AGENCY</div>
            </div>

            {/* Social links */}
            <div className="flex gap-5 justify-start md:justify-end text-[#EFEFEF]/60 items-center">
              <a href="#" aria-label="Twitter / X" className="hover:text-accent transition-colors duration-300 transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors duration-300 transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.139.052 1.9.232 2.508.469a4.877 4.877 0 011.682 1.096 4.88 4.88 0 011.096 1.682c.237.608.417 1.368.469 2.508.043.926.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.052 1.14-.232 1.9-.469 2.508a4.88 4.88 0 01-1.095 1.682 4.878 4.878 0 01-1.682 1.096c-.608.237-1.368.417-2.508.469-.926.043-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1.139-.052-1.9-.232-2.508-.469a4.88 4.88 0 01-1.682-1.096 4.88 4.88 0 01-1.096-1.682c-.237-.608-.417-1.368-.469-2.508C2.012 14.85 2 14.496 2 12.07s.012-2.784.054-3.71c.052-1.139.232-1.9.469-2.508a4.882 4.882 0 011.096-1.682A4.886 4.886 0 015.68 3.09c.608-.237 1.368-.417 2.508-.469C9.117 2.011 9.471 2 12.07 2h.245zm0 1.8c-2.404 0-2.686.01-3.633.053-.873.04-1.348.186-1.663.308a3.08 3.08 0 00-1.14.742 3.08 3.08 0 00-.743 1.14c-.122.315-.268.79-.308 1.663C4.81 8.984 4.8 9.266 4.8 11.711s.01 2.686.053 3.632c.04.874.186 1.35.308 1.664a3.08 3.08 0 00.742 1.14 3.08 3.08 0 001.14.743c.315.122.79.268 1.663.308.947.043 1.229.053 3.633.053s2.686-.01 3.633-.053c.873-.04 1.348-.186 1.662-.308a3.082 3.082 0 001.14-.743 3.08 3.08 0 00.743-1.14c.122-.315.268-.79.308-1.664.043-.946.053-1.228.053-3.632s-.01-2.686-.053-3.633c-.04-.873-.186-1.348-.308-1.662a3.083 3.083 0 00-.743-1.14 3.08 3.08 0 00-1.14-.743c-.315-.122-.79-.268-1.662-.308C14.714 3.81 14.432 3.8 11.986 3.8h.329zM12 7.778a4.222 4.222 0 100 8.444 4.222 4.222 0 000-8.444zM12 14.4a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm4.39-7.237a.96.96 0 100-1.92.96.96 0 000 1.92z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-accent transition-colors duration-300 transform hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
