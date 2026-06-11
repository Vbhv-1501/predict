"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  Zap,
  TrendingUp,
  Sliders,
  Sparkles,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MessageSquare
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

  // Contact Form States
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    city: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = "Please enter a valid age between 1 and 120";
      }
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        age: "",
        city: "",
        message: "",
      });
    }, 1800);
  };

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
            <div className="text-8xl md:text-9xl font-bold font-mono text-gradient-purple mb-4 select-none drop-shadow-[0_0_25px_rgba(124,58,237,0.25)]">
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

              <div className="grid grid-cols-2 gap-6">
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
              <div className="grid grid-cols-3 gap-4">
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
                className="relative w-80 h-[640px] rounded-[48px] border-[10px] border-neutral-800 bg-neutral-950 shadow-[0_25px_60px_rgba(124,58,237,0.06)] overflow-hidden"
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

      {/* SECTION 12: CONTACT FORM */}
      <section id="contact" className="py-32 relative overflow-hidden bg-[#F8F8F6] border-t border-black/[0.04]">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-primary-600 font-semibold mb-3 block">
              Reservation
            </span>
            <h2 className="section-title text-neutral-900">Book Your Movement Assessment</h2>
            <p className="text-neutral-500 max-w-md mx-auto text-sm mt-4">
              Leave your details below. A clinical coordinator will reach out to secure your testing session.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-8 md:p-12 rounded-[32px] border border-primary-500/15 shadow-[0_30px_60px_rgba(124,58,237,0.12)] relative overflow-hidden"
            style={{ background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
          >
            {/* Form Success Animation overlay */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-20"
              >
                <div className="p-4 bg-primary-900/10 border border-primary-500/20 rounded-full mb-6 text-primary-600">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Booking Confirmed</h3>
                <p className="text-neutral-500 max-w-sm text-sm leading-relaxed mb-6">
                  Your assessment request has been registered. An agent will contact you within 24 hours to schedule your clinical run.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 bg-neutral-900/5 hover:bg-neutral-900/10 text-neutral-800 border border-neutral-900/10 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer"
                >
                  Book Another Session
                </button>
              </motion.div>
            ) : null}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="text-xs uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-accent" />
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="E.g., Vaibhav Pratap Singh"
                      className={`w-full px-4 py-3.5 pl-11 premium-input rounded-xl text-sm focus:outline-none transition-all duration-300 ${
                        errors.fullName 
                          ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]" 
                          : ""
                      }`}
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                  {errors.fullName && <span className="text-[11px] text-red-500 mt-1">{errors.fullName}</span>}
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="E.g., vaibhav@predict.com"
                      className={`w-full px-4 py-3.5 pl-11 premium-input rounded-xl text-sm focus:outline-none transition-all duration-300 ${
                        errors.email 
                          ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]" 
                          : ""
                      }`}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                  {errors.email && <span className="text-[11px] text-red-500 mt-1">{errors.email}</span>}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-accent" />
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="E.g., 9876543210"
                      className={`w-full px-4 py-3.5 pl-11 premium-input rounded-xl text-sm focus:outline-none transition-all duration-300 ${
                        errors.phone 
                          ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]" 
                          : ""
                      }`}
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                  {errors.phone && <span className="text-[11px] text-red-500 mt-1">{errors.phone}</span>}
                </div>

                {/* Age */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="age" className="text-xs uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    Age
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="E.g., 34"
                      className={`w-full px-4 py-3.5 pl-11 premium-input rounded-xl text-sm focus:outline-none transition-all duration-300 ${
                        errors.age 
                          ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]" 
                          : ""
                      }`}
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                  {errors.age && <span className="text-[11px] text-red-500 mt-1">{errors.age}</span>}
                </div>

              </div>

              {/* City */}
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-xs uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="E.g., New Delhi"
                    className={`w-full px-4 py-3.5 pl-11 premium-input rounded-xl text-sm focus:outline-none transition-all duration-300 ${
                      errors.city 
                        ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]" 
                        : ""
                    }`}
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
                {errors.city && <span className="text-[11px] text-red-500 mt-1">{errors.city}</span>}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-accent" />
                  Message / Special Clinical Requests (Optional)
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="E.g., Focus on my left ankle mobility logs after past ligament strain."
                    className="w-full px-4 py-3.5 pl-11 premium-input rounded-xl text-sm focus:outline-none transition-all duration-300 resize-none"
                  />
                  <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-accent to-[#9259C7] hover:from-[#9259C7] hover:to-accent disabled:from-accent/40 disabled:to-accent/40 text-white font-bold rounded-xl transition-all duration-500 shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm font-sans"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Registering Clinical Request...</span>
                  </>
                ) : (
                  <>
                    <span>Book My Assessment</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-24 pb-16 px-6 bg-[#F8F8F6] text-neutral-900 border-t border-black/[0.06] font-neue">
        <div className="max-w-7xl mx-auto">
          {/* Stretched Out Wordmark Logo */}
          <div className="w-full flex justify-center mb-16 select-none pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Predict-Logo.png"
              alt="PREDICT"
              className="w-full h-auto max-h-[120px] md:max-h-[180px] lg:max-h-[240px] object-contain invert hue-rotate-180 brightness-90 contrast-200"
            />
          </div>

          {/* Bottom Grid: Info on left, Links on right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end pt-8 border-t border-black/[0.06]">
            {/* Copyright block */}
            <div className="flex flex-col gap-1 font-mono text-[10px] tracking-wider text-neutral-400 font-bold leading-normal">
              <div>2026 PREDICT MOVEMENT INTELLIGENCE, INC.</div>
              <div>ALL RIGHTS RESERVED</div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-3 gap-6 font-neue text-xs md:text-sm font-medium text-neutral-600">
              {/* Column 1 */}
              <div className="flex flex-col gap-3">
                <a href="#" className="hover:text-neutral-950 flex items-center gap-1.5 transition-colors group">
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span> Twitter
                </a>
                <a href="#" className="hover:text-neutral-950 flex items-center gap-1.5 transition-colors group">
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span> Join the Team
                </a>
                <a href="#" className="hover:text-neutral-950 flex items-center gap-1.5 transition-colors group">
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span> Clinical Policy
                </a>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-3">
                <a href="#" className="hover:text-neutral-950 flex items-center gap-1.5 transition-colors group">
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span> Instagram
                </a>
                <a href="#" className="hover:text-neutral-950 flex items-center gap-1.5 transition-colors group">
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span> Manifesto
                </a>
                <a href="#" className="hover:text-neutral-950 flex items-center gap-1.5 transition-colors group">
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span> Terms of Service
                </a>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-3">
                <a href="#" className="hover:text-neutral-950 flex items-center gap-1.5 transition-colors group">
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span> LinkedIn
                </a>
                <a href="#" className="hover:text-neutral-950 flex items-center gap-1.5 transition-colors group">
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span> Log in
                </a>
                <a href="#" className="hover:text-neutral-950 flex items-center gap-1.5 transition-colors group">
                  <span className="text-accent font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span> Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
