"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

interface ManifestoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManifestoPopup({ isOpen, onClose }: ManifestoPopupProps) {
  const [count, setCount] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Animate count-up when open
  useEffect(() => {
    if (!isOpen) {
      setCount(0);
      return;
    }

    let start = 0;
    const end = 172;
    const duration = 1500; // 1.5 seconds
    const increment = end / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleJoinWaitlist = () => {
    onClose();
    // Allow animation to finish, then scroll
    setTimeout(() => {
      const element = document.getElementById("contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 m-4 border border-neutral-100"
          >
            {/* Header / Close button (sticky) */}
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-neutral-100 bg-white">
              <span className="text-xs uppercase tracking-widest text-[#7C3AED] font-bold">
                PREDICT | The Manifesto
              </span>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-50 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Close manifesto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-6 md:px-16 py-10 md:py-16 text-left text-[#111115] font-sans selection:bg-[#7C3AED]/10 selection:text-[#7C3AED]"
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#7C3AED] relative pb-2 inline-block">
                  The Manifesto
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#7C3AED]" />
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-3 tracking-tight text-black leading-tight">
                  Know Your Muscle Age
                </h1>
                <p className="text-lg md:text-xl text-[#4A475A] font-medium tracking-wide">
                  The most important health number you don't know.
                </p>
              </div>

              {/* Lead Paragraph */}
              <p className="text-lg md:text-xl font-medium leading-relaxed border-l-4 border-[#7C3AED] pl-6 mb-8 text-black">
                You know your age. You probably know your cholesterol, your blood pressure, maybe even your blood sugar.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-6">
                But you almost certainly don't know the age of the organ that drives all of them.
              </p>

              <p className="text-2xl md:text-3xl font-extrabold text-[#7C3AED] text-center my-8 tracking-tight">
                Your muscle.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-6">
                Not because you ignored it. Because nobody told you to measure it. Because the system was never designed to catch what comes before the crisis.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-6">
                The system is designed to wait. It waits for diabetes. It waits for heart disease. It waits for frailty, cognitive decline, joint failure, and the moment your body finally forces the conversation.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-6">
                By the time your doctor has a diagnosis, the biology behind it has been changing for years. Quietly. Measurably. Reversibly — if caught in time.
              </p>

              <p className="text-base md:text-lg font-bold leading-relaxed text-black mb-10">
                That is the gap medicine left open.
              </p>

              <p className="text-lg md:text-xl font-bold text-center text-black bg-neutral-50 border border-neutral-100 rounded-2xl py-6 px-4 mb-10">
                We built PREDICT to close it.
              </p>

              <hr className="border-neutral-100 my-10" />

              {/* Why Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 tracking-tight">
                  Why Muscle Is The Number Nobody Is Watching
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  Muscle is not just what moves you.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  It is the <strong className="font-semibold text-black">metabolic engine</strong> that regulates your blood sugar. The <strong className="font-semibold text-black">cardiovascular protector</strong> that reduces your heart disease risk. The <strong className="font-semibold text-black">cognitive anchor</strong> that slows neurological decline. The <strong className="font-semibold text-black">structural foundation</strong> that determines whether you stay independent at 70 or start losing that independence at 55.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  When muscle declines, the consequences appear everywhere else first — energy, recovery, labs, joints, cognition.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-6">
                  Every chronic disease your doctor is monitoring has muscle decline somewhere in its origin story.
                </p>
                <p className="text-base md:text-lg leading-relaxed italic text-[#4A475A] border-l-2 border-neutral-200 pl-4 mb-6">
                  Yet in 2026, there is no standard test for it.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  No protocol. No number your doctor orders at your annual checkup.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A]">
                  That is not an oversight. That is a flaw in the architecture of modern healthcare. And it is the reason PREDICT exists.
                </p>
              </div>

              <hr className="border-neutral-100 my-10" />

              {/* Persona Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 tracking-tight">
                  This Is For You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Founder */}
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-purple-200 hover:shadow-md transition-all duration-300">
                    <span className="text-[10px] font-bold tracking-widest text-[#7C3AED] uppercase bg-[#7C3AED]/10 px-2.5 py-1 rounded-md inline-block mb-4">
                      The Founder
                    </span>
                    <h3 className="text-lg font-bold text-black mb-2">The 42-Year-Old</h3>
                    <p className="text-sm leading-relaxed text-[#4A475A]">
                      You feel fine. Business is growing. Life is full. But recovery takes longer than it used to. Energy isn't quite what it was. What if your muscle is aging nine years faster than you are — and you simply don't know it yet?
                    </p>
                  </div>

                  {/* Executive */}
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-purple-200 hover:shadow-md transition-all duration-300">
                    <span className="text-[10px] font-bold tracking-widest text-[#7C3AED] uppercase bg-[#7C3AED]/10 px-2.5 py-1 rounded-md inline-block mb-4">
                      The Executive
                    </span>
                    <h3 className="text-lg font-bold text-black mb-2">The 55-Year-Old</h3>
                    <p className="text-sm leading-relaxed text-[#4A475A]">
                      Your last health report moved in the wrong direction. You don't want another prescription managing a number. You want to understand the biology driving the number. That biology starts with muscle.
                    </p>
                  </div>

                  {/* GLP-1 User */}
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-purple-200 hover:shadow-md transition-all duration-300">
                    <span className="text-[10px] font-bold tracking-widest text-[#7C3AED] uppercase bg-[#7C3AED]/10 px-2.5 py-1 rounded-md inline-block mb-4">
                      The Preserver
                    </span>
                    <h3 className="text-lg font-bold text-black mb-2">The GLP-1 User</h3>
                    <p className="text-sm leading-relaxed text-[#4A475A]">
                      The weight came off. The scale moved. You did what you were supposed to do. But weight loss and muscle preservation are not the same thing. For every ten pounds lost on a GLP-1, four come from muscle and connective tissue. Nobody told you that. Nobody measured it. Nobody built a protocol around it. We did.
                    </p>
                  </div>

                  {/* Optimizer */}
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-purple-200 hover:shadow-md transition-all duration-300">
                    <span className="text-[10px] font-bold tracking-widest text-[#7C3AED] uppercase bg-[#7C3AED]/10 px-2.5 py-1 rounded-md inline-block mb-4">
                      The Tracker
                    </span>
                    <h3 className="text-lg font-bold text-black mb-2">The Optimizer</h3>
                    <p className="text-sm leading-relaxed text-[#4A475A]">
                      You track sleep, HRV, glucose, steps, training loads, and supplements. You have optimized almost everything. But you have never measured the biological age of the organ driving every single one of those signals. Until now.
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-neutral-100 my-10" />

              {/* What We Do */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 tracking-tight">
                  What PREDICT Does
                </h2>
                <div className="flex flex-col gap-4">
                  {[
                    { title: "A blood draw at home", desc: "Ten minutes. No clinic visit." },
                    { title: "Your Muscle Age", desc: "The age your muscle behaves, not the age on your passport." },
                    {
                      title: "Your downstream risk profile",
                      desc: "Across metabolic, cardiovascular, neurological, and musculoskeletal health — before symptoms appear."
                    },
                    {
                      title: "A personalized intervention protocol",
                      desc: "Built on your biomarkers. Not a generic supplement stack. Not a lifestyle PDF. A protocol."
                    },
                    { title: "Continuous AI-led monitoring", desc: "So the test becomes daily action. Because measurement without action changes nothing." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all duration-200">
                      <div className="w-6 h-6 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-black mb-1">{item.title}</h3>
                        <p className="text-sm text-[#4A475A]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-neutral-100 my-10" />

              {/* How We Built It */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 tracking-tight">
                  How We Built It
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  For 25 years, Dr. Apurba Ganguly treated chronic disease while researching the biology underneath it.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  Muscle loss. Joint degeneration. Metabolic failure. Cognitive decline. The same root cause presenting in different organs, treated separately by different specialists.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  He built a proprietary biomarker dataset from the ground up. Published peer-reviewed research. Filed patents. Mapped molecular signatures of muscle aging across thousands of patients.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A]">
                  Then a father and son turned that science into a platform. Because prevention only works when decline is measurable before disease begins.
                </p>
              </div>

              <hr className="border-neutral-100 my-10" />

              {/* What We Believe */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 tracking-tight">
                  What We Believe
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  Medicine has cholesterol for heart disease, HbA1c for diabetes, blood pressure for cardiovascular risk.
                </p>
                <p className="text-base md:text-lg leading-relaxed italic text-black font-semibold border-l-4 border-[#7C3AED] pl-6 my-6">
                  Muscle health has no standard of care. No number. No test. No protocol.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  We believe that is about to change.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A] mb-4">
                  We believe Muscle Age will become as routine as a cholesterol panel. We believe millions of people are living with muscle-driven chronic conditions that have never been connected to their root cause.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#4A475A]">
                  And we believe people deserve to know their number before disease decides for them.
                </p>
              </div>

              {/* CTA Section */}
              <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#7C3AED]/5 to-[#8504FE]/10 border border-[#7C3AED]/10 text-center relative overflow-hidden">
                <div className="text-5xl md:text-7xl font-extrabold text-[#7C3AED] tracking-tight mb-2">
                  {count}
                </div>
                <div className="text-xs uppercase tracking-widest text-[#7C3AED] font-bold mb-6">
                  People already know their Muscle Age
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-black mb-4">
                  They know a number their doctor never told them.
                </h3>
                <p className="text-sm md:text-base text-[#4A475A] max-w-xl mx-auto mb-8">
                  They have a protocol their annual checkup never produced. They are watching a number move in the right direction for the first time. You are next.
                </p>
                <h3 className="text-lg md:text-xl font-bold text-[#7C3AED] mb-8">
                  Know your Muscle Age. Change what comes next.
                </h3>
                <button
                  onClick={handleJoinWaitlist}
                  className="px-8 py-4 bg-[#7C3AED] hover:bg-[#8504FE] text-white font-bold rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 cursor-pointer"
                >
                  Join the Waitlist
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
