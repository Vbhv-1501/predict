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
      quote: "MuscleAGE™ is a pathbreaking approach that may redefine how we identify risks associated with aging and chronic disease. We are excited to explore collaborations with PREDICT.",
      author: "Prof. Prasun Chatterjee, MD",
      role: "Head, Geriatric Medicine, Apollo Hospitals",
      image: "/assets/prof-prasun.png"
    },
    {
      quote: "I experienced the MuscleAGE TM ️ assessment first hand and was impressed by both the science and the user journey. They told me a lot of about my macros and aging that I had no ideas about. Wishing Veeky and the PREDICT team success as they go out to build this category.",
      author: "Arjun Vaidya",
      role: "Partner, V3 Ventures",
      image: "/assets/arjun-vaidya.png"
    },
    {
      quote: "Longevity is about to get very interesting",
      author: "Brian Mac Mahon",
      role: "Co-Founder and Investor in Matchbook AI",
      image: "/assets/brian-macmahon.png"
    },
    {
      quote: "I underwent the LegAGE™ assessment and was genuinely surprised by how seamlessly complex biomarker science was translated into a consumer experience.",
      author: "Megha Gupta",
      role: "Longevity Influencer",
      image: "/assets/megha-gupta.png"
    },
    {
      quote: "For years we've measured disease after it appears. Technologies such as MuscleAGE™ may help us think differently—by quantifying biological burden before functional decline becomes apparent.",
      author: "Dr. Albery Hamiltion",
      role: "Orthopaedic Surgeon & Research Collaborator, USA",
      image: "/assets/dr-albery.png"
    }
  ];

  // Infinite Marquee duplicate sets
  const row1 = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative w-full bg-[#ffffff] text-foreground">
      
      {/* SECTION 4: 30,000+ BIOMARKER OBSERVATIONS */}
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
              <Counter from={0} to={30000} suffix="+" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-2">
              One Assessment. Thousands Of Possibilities. Earlier Answers.
            </h3>
            <p className="text-sm text-white/50">
              Built on 30,000+ biomarker observations.
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
            <h2 className="section-title text-white">MuscleAGE & LegAGE Changed Everything.</h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm mt-4">
              Read how elite athletes, clinical researchers, and preventive health pioneers leverage Predict.
            </p>
          </div>
        </div>

        {/* Single looping horizontal marquee moving left-to-right */}
        <div className="w-full py-4 overflow-hidden hover-pause">
          <div className="marquee-container">
            <div className="marquee-track animate-marquee-reverse-normal gap-6 flex">
              {row1.map((t, idx) => (
                <div
                  key={idx}
                  className="testimonial-card w-[420px] shrink-0 p-8 rounded-2xl flex flex-col justify-between hover:border-accent/30 transition-all duration-300"
                >
                  <p className="text-white/90 text-[13px] leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    {t.image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={t.image} 
                          alt={t.author} 
                          className="w-[34px] h-[34px] rounded-full object-cover mb-3.5 border border-accent/28 shadow-[0_10px_24px_rgba(124,58,237,0.12)] inline-block"
                          onError={(e) => {
                            (e.currentTarget).style.display = 'none';
                            const sibling = (e.currentTarget).nextElementSibling;
                            if (sibling) sibling.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden">
                          <ProfileMark />
                        </div>
                      </>
                    ) : (
                      <ProfileMark />
                    )}
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
              { isCounter: false, text: "Algorithm", label: "Trained on 30K Data. One age." },
              { isCounter: false, text: "Patented Filed", label: "Nothing like this exists." },
              { isCounter: true, from: 0, to: 34, suffix: " Years", label: "Peer reviewed" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-bold font-mono text-gradient-purple drop-shadow-[0_0_10px_rgba(124,58,237,0.15)]">
                  {stat.isCounter ? (
                    <Counter from={stat.from!} to={stat.to!} suffix={stat.suffix} />
                  ) : (
                    stat.text
                  )}
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
            <div className="flex flex-col gap-2 font-mono text-[10px] tracking-wider text-[#EFEFEF]/50 font-bold leading-relaxed">
              <div className="text-white text-sm font-sans tracking-widest font-extrabold uppercase">PREDICT</div>
              <div>© 2025 A brand owned by Control Age Health Pvt. Ltd.</div>
              <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 mt-1 text-[#EFEFEF]/60 font-sans">
                <a href="mailto:veeky@predict.fit" className="hover:text-accent transition-colors duration-300">
                  veeky@predict.fit
                </a>
                <span className="hidden sm:inline text-white/20">|</span>
                <a href="tel:+917506009933" className="hover:text-accent transition-colors duration-300">
                  +91 7506 009933
                </a>
              </div>
              
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
              <a
                href="https://www.instagram.com/predict.fit/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-accent transition-colors duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/predict.fit/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-accent transition-colors duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
