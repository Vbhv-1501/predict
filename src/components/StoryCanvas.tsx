"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 680;
const SCROLL_PX_PER_FRAME = 5; // 5px per frame = 3400px total travel

interface StoryCanvasProps {
  preloadedImages: HTMLImageElement[];
}

interface StoryText {
  id: number;
  className: string;
  align: "center" | "left" | "right";
  content: React.ReactNode;
}

const STORY_TEXTS: StoryText[] = [
  {
    id: 1,
    className: "text-step-1",
    align: "center",
    content: (
      <h1 className="font-neue font-medium text-3xl md:text-5xl lg:text-6xl text-white max-w-3xl leading-tight select-none">
        There is an <span className="font-garamond font-bold italic text-[#7C3AED]">organ</span> that predicts <span className="font-garamond font-bold italic text-[#7C3AED]">everything</span>.
      </h1>
    ),
  },
  {
    id: 2,
    className: "text-step-2",
    align: "left",
    content: (
      <div className="flex flex-col gap-2">
        <span className="font-neue text-[10px] md:text-xs tracking-widest text-neutral-300 uppercase font-bold">
          The Organ
        </span>
        <h2 className="font-garamond font-bold italic text-6xl md:text-7xl lg:text-8xl text-[#7C3AED] leading-none">
          Muscle
        </h2>
      </div>
    ),
  },
  {
    id: 3,
    className: "text-step-3",
    align: "right",
    content: (
      <h2 className="font-neue font-medium text-3xl md:text-4xl lg:text-5xl text-white leading-snug">
        When <span className="font-garamond font-bold italic text-[#7C3AED]">muscle</span> declines — <br />
        <span className="font-garamond font-bold italic text-[#7C3AED]">everything</span> follows.
      </h2>
    ),
  },
  {
    id: 4,
    className: "text-step-4",
    align: "left",
    content: (
      <div className="flex flex-col gap-4">
        <h2 className="font-neue font-bold text-2xl md:text-3.5xl lg:text-4xl text-white leading-tight">
          Most <span className="font-garamond font-bold italic text-[#7C3AED]">chronic disease</span> doesn&apos;t start <br />
          in the <span className="font-garamond font-bold italic text-[#7C3AED]">organ</span> that fails.
        </h2>
        <p className="font-neue text-sm md:text-base text-neutral-200 font-normal leading-relaxed">
          It starts in the muscle that stopped protecting it.
        </p>
        <span className="font-neue text-[10px] md:text-xs text-neutral-300 uppercase tracking-widest font-bold mt-2">
          Years earlier.
        </span>
      </div>
    ),
  },
  {
    id: 5,
    className: "text-step-5",
    align: "right",
    content: (
      <div className="flex flex-col gap-2">
        <span className="font-neue text-[10px] md:text-xs tracking-widest text-neutral-300 uppercase font-bold">
          The Signal
        </span>
        <h2 className="font-garamond font-bold italic text-6xl md:text-7xl lg:text-8xl text-[#7C3AED] leading-none">
          Blood.
        </h2>
      </div>
    ),
  },
  {
    id: 6,
    className: "text-step-6",
    align: "left",
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <h2 className="font-garamond font-bold italic text-5xl md:text-6xl text-[#7C3AED] leading-none">
            Blood
          </h2>
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#7C3AED]"></span>
          </span>
        </div>
        <p className="font-neue text-sm md:text-base text-neutral-200 font-normal leading-relaxed">
          A live data stream. Flowing through you. Right now.
        </p>
      </div>
    ),
  },
  {
    id: 7,
    className: "text-step-7",
    align: "right",
    content: (
      <div className="flex flex-col gap-4 max-w-sm md:max-w-md">
        <h2 className="font-neue font-bold text-3xl md:text-4xl text-white leading-tight">
          Your blood carries <br />
          <span className="font-garamond font-bold italic text-[#7C3AED]">your true age.</span>
        </h2>
        <p className="font-neue text-sm md:text-base text-neutral-200 font-normal leading-relaxed">
          Every second, it circulates signals:
        </p>
        <div className="flex flex-col gap-3 text-xs md:text-sm font-neue font-medium text-neutral-300 border-l border-[#7C3AED]/50 pl-4 text-left md:text-right md:border-l-0 md:border-r md:pr-4">
          <span className="text-step-7-bullet-1 flex items-center gap-2 justify-start md:justify-end">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] shadow-[0_0_8px_#7C3AED]" />
            The rate of breakdown
          </span>
          <span className="text-step-7-bullet-2 flex items-center gap-2 justify-start md:justify-end">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] shadow-[0_0_8px_#7C3AED]" />
            The capacity to regenerate
          </span>
          <span className="text-step-7-bullet-3 flex items-center gap-2 justify-start md:justify-end">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] shadow-[0_0_8px_#7C3AED]" />
            The metabolic efficiency
          </span>
          <span className="text-step-7-bullet-4 flex items-center gap-2 justify-start md:justify-end">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] shadow-[0_0_8px_#7C3AED]" />
            The inflammatory burden
          </span>
          <span className="text-step-7-bullet-5 flex items-center gap-2 justify-start md:justify-end">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] shadow-[0_0_8px_#7C3AED]" />
            The vascular integrity
          </span>
        </div>
      </div>
    ),
  },
];

export default function StoryCanvas({ preloadedImages }: StoryCanvasProps) {
  // containerRef  → the outer div that ScrollTrigger uses as the trigger element
  // stageRef      → the 100vw × 100vh canvas wrapper that GSAP will PIN
  // canvasRef     → the actual <canvas>
  const containerRef  = useRef<HTMLDivElement>(null);
  const stageRef      = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const hintRef       = useRef<HTMLDivElement>(null);
  const readoutRef    = useRef<HTMLDivElement>(null);

  const currentIndexRef = useRef(0);

  // Keep Lenis and ScrollTrigger in sync on every smooth-scroll tick
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    // Reset scroll position to top on page mount/reload to ensure we start at FRAME 000
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !stageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    if (!ctx) return;

    // ── Draw a single frame ──────────────────────────────────────────────────
    const drawFrame = (index: number) => {
      const img = preloadedImages[index];
      if (!img || !img.complete) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    // ── Resize: fit height of the canvas to fill the viewport and prevent vertical cropping ──
    const resize = () => {
      const vw    = window.innerWidth;
      const vh    = window.innerHeight;
      const scale = vh / 405; // fit height
      const w     = Math.round(720 * scale);
      const h     = Math.round(405 * scale);

      canvas.width  = w;
      canvas.height = h;
      canvas.style.position = "absolute";
      canvas.style.left     = Math.round((vw - w) / 2) + "px";
      canvas.style.top      = Math.round((vh - h) / 2) + "px";
      canvas.style.width    = w + "px";
      canvas.style.height   = h + "px";

      drawFrame(currentIndexRef.current);
    };

    window.addEventListener("resize", resize);
    resize();
    drawFrame(0);

    // Initial positioning setup
    gsap.set(canvas, { opacity: 1 });
    gsap.set(".text-step", { opacity: 0, y: 30 });
    gsap.set(".text-step-1", { opacity: 1, y: 0 }); // First text starts fully visible at Frame 000
    gsap.set(".text-step-7-bullet-1, .text-step-7-bullet-2, .text-step-7-bullet-3, .text-step-7-bullet-4, .text-step-7-bullet-5", { opacity: 0, x: 20 });

    const scrollState = { frameIndex: 0 };

    // Create a master GSAP timeline driven by ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:           containerRef.current,
        start:             "top top",
        end:               `+=${TOTAL_FRAMES * SCROLL_PX_PER_FRAME}`,
        scrub:             1,
        pin:               stageRef.current,
        pinSpacing:        true,
        anticipatePin:     1,
        refreshPriority:   60,
        invalidateOnRefresh: true,
      },
    });

    // 1. Frame progression animation spanning the entire timeline duration
    tl.to(scrollState, {
      frameIndex: TOTAL_FRAMES - 1,
      ease: "none",
      duration: TOTAL_FRAMES,
      onUpdate: () => {
        const idx = Math.round(scrollState.frameIndex);
        if (idx === currentIndexRef.current) return;
        currentIndexRef.current = idx;
        drawFrame(idx);

        // Update frame readout directly in DOM for 60fps performance
        if (readoutRef.current) {
          readoutRef.current.textContent = `FRAME: ${String(idx + 1).padStart(4, "0")} / ${TOTAL_FRAMES}`;
        }

        // Toggle hint opacity directly in DOM for 60fps performance
        if (hintRef.current) {
          if (idx <= 10) {
            hintRef.current.classList.add("opacity-100");
            hintRef.current.classList.remove("opacity-0");
          } else {
            hintRef.current.classList.add("opacity-0");
            hintRef.current.classList.remove("opacity-100");
          }
        }
      },
    }, 0);

    // 3. Text step scroll transitions:
    // Text 1: Center, starts fully visible at frame 000, fades out from frame 60 to 75
    tl.to(".text-step-1", { opacity: 0, y: -30, duration: 15, ease: "power2.in" }, 60);

    // Text 2: Center, frame 90 to 170
    tl.to(".text-step-2", { opacity: 1, y: 0, duration: 20, ease: "power2.out" }, 90);
    tl.to(".text-step-2", { opacity: 0, y: -30, duration: 20, ease: "power2.in" }, 150);

    // Text 3: Right, frame 180 to 260
    tl.to(".text-step-3", { opacity: 1, y: 0, duration: 20, ease: "power2.out" }, 180);
    tl.to(".text-step-3", { opacity: 0, y: -30, duration: 20, ease: "power2.in" }, 240);

    // Text 4: Left, frame 270 to 370
    tl.to(".text-step-4", { opacity: 1, y: 0, duration: 20, ease: "power2.out" }, 270);
    tl.to(".text-step-4", { opacity: 0, y: -30, duration: 20, ease: "power2.in" }, 350);

    // Text 5: Right, frame 380 to 460
    tl.to(".text-step-5", { opacity: 1, y: 0, duration: 20, ease: "power2.out" }, 380);
    tl.to(".text-step-5", { opacity: 0, y: -30, duration: 20, ease: "power2.in" }, 440);

    // Text 6: Left, frame 470 to 550
    tl.to(".text-step-6", { opacity: 1, y: 0, duration: 20, ease: "power2.out" }, 470);
    tl.to(".text-step-6", { opacity: 0, y: -30, duration: 20, ease: "power2.in" }, 530);

    // Text 7: Right, frame 560 to 670
    tl.to(".text-step-7", { opacity: 1, y: 0, duration: 20, ease: "power2.out" }, 560);
    tl.to(".text-step-7-bullet-1", { opacity: 1, x: 0, duration: 10, ease: "power2.out" }, 575);
    tl.to(".text-step-7-bullet-2", { opacity: 1, x: 0, duration: 10, ease: "power2.out" }, 590);
    tl.to(".text-step-7-bullet-3", { opacity: 1, x: 0, duration: 10, ease: "power2.out" }, 605);
    tl.to(".text-step-7-bullet-4", { opacity: 1, x: 0, duration: 10, ease: "power2.out" }, 620);
    tl.to(".text-step-7-bullet-5", { opacity: 1, x: 0, duration: 10, ease: "power2.out" }, 635);
    tl.to(".text-step-7", { opacity: 0, y: -30, duration: 15, ease: "power2.in" }, 655);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", resize);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [preloadedImages]);

  return (
    <div ref={containerRef} className="w-full select-none">
      <div
        ref={stageRef}
        id="stage"
        style={{
          width:    "100vw",
          height:   "100vh",
          overflow: "hidden",
          background: "#000000",
          backgroundImage: preloadedImages.length === 0 ? "url('/assets/hero-fallback.jpg')" : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: "none",
            display: preloadedImages.length === 0 ? "none" : "block"
          }}
        />

        {/* Text Steps Overlay Container */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {STORY_TEXTS.map((item) => {
            let alignmentClasses = "";
            if (item.align === "center") {
              alignmentClasses = "inset-0 flex items-center justify-center p-6 text-center";
            } else if (item.align === "left") {
              // Diagonal layout: Top-center on mobile, Top-Left quadrant on desktop (to avoid horizontal centered muscle spindle)
              alignmentClasses = "left-6 right-6 top-[12%] md:top-[25%] md:left-[5%] lg:left-[8%] md:right-auto md:w-full md:max-w-[280px] lg:max-w-[340px] text-center md:text-left";
            } else if (item.align === "right") {
              // Diagonal layout: Bottom-center on mobile, Bottom-Right quadrant on desktop (to avoid horizontal centered muscle spindle)
              alignmentClasses = "left-6 right-6 bottom-[12%] md:bottom-[25%] md:right-[5%] lg:right-[8%] md:left-auto md:w-full md:max-w-[280px] lg:max-w-[340px] text-center md:text-right";
            }

            return (
              <div
                key={item.id}
                className={`absolute pointer-events-none text-step ${item.className} ${alignmentClasses}`}
                style={{
                  opacity: 0,
                  transform: "translateY(30px)",
                  textShadow: "0 4px 16px rgba(0, 0, 0, 0.95), 0 2px 4px rgba(0, 0, 0, 0.95)"
                }}
              >
                {item.content}
              </div>
            );
          })}
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[10px] pointer-events-none z-30 transition-opacity duration-600 opacity-100"
        >
          <span className="font-sans text-[10px] font-medium tracking-[0.2em] uppercase text-white/40">
            Scroll
          </span>
          <div className="w-[1px] h-[28px] bg-gradient-to-b from-white/40 to-transparent origin-top animate-[drip_1.8s_ease-in-out_infinite]" />
        </div>

        {/* Frame readout */}
        <div
          ref={readoutRef}
          className="absolute bottom-[20px] right-[24px] font-mono text-[10px] tracking-[0.06em] text-white/15 pointer-events-none tabular-nums z-30"
        >
          FRAME: 0001 / {TOTAL_FRAMES}
        </div>
      </div>
    </div>
  );
}
