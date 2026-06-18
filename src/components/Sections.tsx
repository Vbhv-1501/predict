"use client";

import React, { useEffect, useRef } from "react";
import WaitlistSection from "./WaitlistSection";
import ScienceOrbitSection from "./ScienceOrbitSection";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: from };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 95%",
      onEnter: () => {
        gsap.to(obj, {
          val: to,
          duration: duration,
          ease: "power2.out",
          onUpdate: () => {
            if (el) {
              el.innerText = Math.round(obj.val).toLocaleString() + suffix;
            }
          }
        });
      },
      once: true,
    });

    return () => {
      st.kill();
    };
  }, [from, to, duration, suffix]);

  return (
    <span ref={ref} className={className}>
      {from.toLocaleString()}
      {suffix}
    </span>
  );
}

// BiomechanicalLiveStreamCanvas extracted to separate file

function ProfileMark() {
  return (
    <span className="profile-mark" aria-hidden="true">
      <User className="h-5 w-5" />
    </span>
  );
}

export default function Sections() {


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
    <div className="relative w-full bg-[#ffffff] text-foreground">
      
      {/* SECTION 4: 9000+ DATA POINTS */}
      <section className="py-24 bg-[#000000] relative overflow-hidden border-y border-white/[0.05]">
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



      {/* SECTION 6: DATA DRIVEN INSIGHTS - MOVED TO BIOMECHANICAL SECTION IN PAGE.TSX */}





      {/* SECTION 9: SOCIAL PROOF (TESTIMONIALS LOOPING MARQUEE) */}
      <section className="py-32 relative overflow-hidden bg-[#000000] text-white border-y border-white/[0.05]">
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
