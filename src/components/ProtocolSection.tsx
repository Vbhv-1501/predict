"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────────────────────────────────
   ProtocolSection.tsx
   Scroll-driven timeline: sticky pane pinned while outer section scrolls.
   An SVG trail draws progressively; each waypoint dot + content block
   reveals when the trail reaches it.

   Dependencies: gsap, gsap/ScrollTrigger  (already in your project)

   Lenis compatibility — if you use Lenis globally, wire it up once in your
   root layout BEFORE ScrollTrigger creates any triggers:

     import { ScrollTrigger } from "gsap/ScrollTrigger";
     lenis.on("scroll", ScrollTrigger.update);
     ScrollTrigger.scrollerProxy(document.body, {
       scrollTop(v?: number) {
         if (v !== undefined) lenis.scrollTo(v);
         return lenis.scroll;
       },
       getBoundingClientRect() {
         return { top:0, left:0, width: window.innerWidth, height: window.innerHeight };
       },
     });
     ScrollTrigger.addEventListener("refresh", () => lenis.resize());
──────────────────────────────────────────────────────────────────────────── */

/* ── Content data ────────────────────────────────────────────────────────── */
const STEPS = [
  {
    day:   "Day 1",
    title: "Blood draw at home",
    body:  "<b>A phlebotomist visits your home or office.</b> Full 45-biomarker panel collected. Body composition assessment included. No clinic, no queue.",
  },
  {
    day:   "Day 2–3",
    title: "Your Muscle Age score",
    body:  "<b>The Muscle Age Clock algorithm runs overnight.</b> Your biological age across 6 physiological systems appears on your dashboard within 48 hours.",
  },
  {
    day:   "Day 4–7",
    title: "Specialist review",
    body:  "<b>Six specialists review your results.</b> Expert consultation scheduled. Your personalised protocol — workout supplements, nutrition, interventions — is built from your exact biomarker profile, not a template.",
  },
] as const;

/*
  SVG path — viewBox 0 0 900 580, preserveAspectRatio="none" (fills canvas exactly).
  CSS % positions map cleanly: x/900 → left%, y/580 → top%

  Path traces:
    (450, 10) start (top center)
    (280,200) dot 1 — curves left
    (640,380) dot 2 — sweeps right
    (430,570) dot 3 — curves back
*/
const PATH_D =
  "M 450 10 C 420 80, 280 120, 280 200 C 280 280, 640 290, 640 380 C 640 470, 430 490, 430 570";

/* Waypoint dot positions as % of canvas (x/900, y/580) */
const DOT_POS = [
  { left: "31.1%", top: "34.5%" }, // SVG (280,200)
  { left: "71.1%", top: "65.5%" }, // SVG (640,380)
  { left: "47.8%", top: "96%"   }, // SVG (430,570) — capped so dot stays visible
] as const;

/* Step content positions and alignment */
type StepLayout = {
  style: React.CSSProperties;
  dayStyle?: React.CSSProperties;
};
const STEP_LAYOUT: StepLayout[] = [
  { style: { left: "35%",  top: "17%" } },                                     // right of dot 1
  { style: { right: "34%", top: "51%", textAlign: "right" },
    dayStyle: { justifyContent: "flex-end" } },                                 // left of dot 2
  { style: { left: "3%",   top: "72%" } },                                     // left of dot 3
];

/*
  Reveal thresholds as fractions of scroll progress (0 → 1).
  Outer section = 200vh, scroll budget = 100vh:
    0.20 →  ~20vh  Day 1
    0.50 →  ~50vh  Day 2–3
    0.80 →  ~80vh  Day 4–7
*/
const THRESHOLDS = [0.2, 0.5, 0.8];

/* ── Scoped CSS (injected via <style> tag — scoped under .proto-outer) ───── */
const CSS = `
  .proto-outer,
  .proto-outer *,
  .proto-outer *::before,
  .proto-outer *::after { box-sizing: border-box; }

  .proto-outer {
    position: relative;
    height: 200vh;
    background: #000000;
    font-family: 'Neue Montreal', 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    color: #eef2f7;
  }

  /* Sticky pane */
  .proto-sticky {
    position: relative;
    top: auto;
    height: 100vh;
    height: 100svh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #000000;
  }

  /* Header */
  .proto-header {
    flex-shrink: 0;
    text-align: center;
    padding: clamp(22px,4vh,52px) 24px clamp(6px,1.2vh,16px);
    z-index: 2;
  }
  .proto-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 9.5px;
    letter-spacing: .24em;
    text-transform: uppercase;
    color: #4e5a6a;
    margin-bottom: 10px;
    font-weight: 500;
  }
  .proto-eyebrow::before,
  .proto-eyebrow::after { content: ''; width: 20px; height: 1px; }
  .proto-eyebrow::before { background: linear-gradient(90deg, transparent, #4e5a6a); }
  .proto-eyebrow::after  { background: linear-gradient(90deg, #4e5a6a, transparent); }

  .proto-title {
    font-size: clamp(38px, 6.4vw, 90px);
    font-weight: 700;
    letter-spacing: -.038em;
    line-height: 1;
    margin: 0;
    background: linear-gradient(160deg, #fff 0%, rgba(255,255,255,.48) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  /* Canvas */
  .proto-canvas {
    position: relative;
    flex: 1;
    width: 100%;
    max-width: 940px;
    padding: 0 clamp(14px,2.8vw,40px);
    overflow: hidden;
  }

  /* SVG */
  .proto-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .proto-path-bg {
    fill: none;
    stroke: rgba(255,255,255,.16);
    stroke-width: 1.5;
    stroke-linecap: round;
  }
  /* Hidden until GSAP sets dasharray/offset and flips visibility */
  .proto-path-fill {
    fill: none;
    stroke: url(#ptg);
    stroke-width: 2.4;
    stroke-linecap: round;
    visibility: visible;
    opacity: 1;
    filter: drop-shadow(0 0 18px rgba(146, 89, 199, 0.45));
  }

  /* Waypoint dots */
  .proto-dot {
    position: absolute;
    width: 13px;
    height: 13px;
    transform: translate(-50%,-50%) scale(.3);
    opacity: 0;
    transition:
      transform .55s cubic-bezier(.34,1.56,.64,1),
      opacity   .4s ease;
    pointer-events: none;
  }
  .proto-dot__ring {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(152,112,248,.16);
    border: 1.5px solid rgba(152,112,248,.62);
    position: relative;
  }
  .proto-dot__ring::after {
    content: '';
    position: absolute;
    inset: -7px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(152,112,248,.22) 0%, transparent 70%);
    animation: pdp 2.8s ease-in-out infinite;
  }
  .proto-dot.lit {
    opacity: 1;
    transform: translate(-50%,-50%) scale(1);
  }
  @keyframes pdp {
    0%,100% { transform: scale(.6);  opacity: .35; }
    50%     { transform: scale(1.8); opacity: .6;  }
  }

  /* Step content blocks */
  .proto-step {
    position: absolute;
    max-width: clamp(155px, 23vw, 245px);
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity   .6s ease,
      transform .65s cubic-bezier(.22,1,.36,1);
  }
  .proto-step.vis {
    opacity: 1;
    transform: translateY(0);
  }

  .proto-day {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 9px;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #434f5e;
    margin-bottom: 7px;
    font-weight: 500;
  }
  .proto-bkt { width: 10px; height: 10px; flex-shrink: 0; opacity: .7; }

  .proto-step-title {
    font-size: clamp(13px, 1.45vw, 17px);
    font-weight: 600;
    letter-spacing: -.02em;
    line-height: 1.25;
    color: #dde3ec;
    margin: 0 0 7px;
  }
  .proto-step-body {
    font-size: clamp(10px, .88vw, 11.5px);
    line-height: 1.68;
    color: #4e5c6d;
    margin: 0;
    font-weight: 400;
  }
  .proto-step-body b { color: #838fa0; font-weight: 500; }

  /* ── Mobile ─────────────────────────────────────────────────────────────
     SVG + dots hidden. Steps stack as a flex column with left-border
     acting as the visual timeline line.
     position:relative !important resets the inline absolute positioning
     that desktop layout uses.
  ──────────────────────────────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .proto-outer   { height: auto !important; }
    .proto-sticky  { height: auto !important; overflow: visible !important; padding-bottom: 48px; }
    .proto-svg     { display: none; }
    .proto-dot     { display: none; }

    .proto-canvas {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: clamp(20px, 3.8vh, 34px);
      padding: 0 22px max(20px, env(safe-area-inset-bottom));
    }

    .proto-step {
      position: relative !important;
      left:   auto !important;
      right:  auto !important;
      top:    auto !important;
      bottom: auto !important;
      max-width: 100%;
      text-align: left !important;
      padding-left: 16px;
      border-left: 1.5px solid rgba(152,112,248,.16);
      transform: translateY(8px);
    }
    .proto-step.vis { border-left-color: rgba(152,112,248,.42); }

    .proto-step-title { font-size: clamp(15px,4.2vw,19px); }
    .proto-step-body  { font-size: clamp(11.5px,3vw,14px); }
    .proto-day        { justify-content: flex-start !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .proto-dot__ring::after { animation: none; }
    .proto-step, .proto-dot { transition: opacity .2s ease !important; transform: none !important; }
  }
`;

/* ── Bracket icon ─────────────────────────────────────────────────────────── */
function BracketIcon() {
  return (
    <svg className="proto-bkt" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 1H1V3M9 1H11V3M3 11H1V9M9 11H11V9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Component ────────────────────────────────────────────────────────────── */
export default function ProtocolSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const pathRef  = useRef<SVGPathElement>(null);
  const dotRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const outer = outerRef.current;
    const path  = pathRef.current;
    if (!outer || !path) return;

    /* Get true path length in SVG user-units */
    const pLen = path.getTotalLength();

    /* Initialize path properties to fully hidden before ScrollTrigger runs */
    path.style.strokeDasharray = String(pLen);
    path.style.strokeDashoffset = String(pLen);
    path.style.visibility = "hidden";

    const isMobile = window.innerWidth <= 640;

    const ctx = gsap.context(() => {
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: outer,
          start:   "top top", // Later start so it doesn't steal view or overlap early
          end:     "bottom bottom",
          pin: ".proto-sticky",
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 0.4, // Between 0.3 and 0.6
          refreshPriority: 40,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress;

            /* Draw trail - set visible only when GSAP is actively controlling dashoffset */
            path.style.visibility = "visible";
            path.style.strokeDashoffset = String(pLen * (1 - p));

            /* Reveal / retract steps strictly based on progress and thresholds */
            THRESHOLDS.forEach((t, i) => {
              const dot  = dotRefs.current[i];
              const step = stepRefs.current[i];
              if (p >= t) {
                dot?.classList.add("lit");
                step?.classList.add("vis");
              } else {
                dot?.classList.remove("lit");
                step?.classList.remove("vis");
              }
            });
          },
        });
        ScrollTrigger.refresh();
      } else {
        // On mobile, show steps immediately
        stepRefs.current.forEach((step) => {
          step?.classList.add("vis");
        });
      }
    }, outer);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={outerRef} className="proto-outer">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="proto-sticky">
        <header className="proto-header">
          <p className="proto-eyebrow">How it works</p>
          <h2 className="proto-title">protocol.</h2>
        </header>

        <div className="proto-canvas">
          {/* ── SVG trail ── */}
          <svg
            className="proto-svg"
            viewBox="0 0 900 580"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ptg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#c084fc" stopOpacity={0.9} />
                <stop offset="55%"  stopColor="#9462e8" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            {/* Ghost guide — always visible at low opacity */}
            <path className="proto-path-bg" d={PATH_D} />
            {/* Animated fill — drawn by GSAP via strokeDashoffset */}
            <path ref={pathRef} className="proto-path-fill" d={PATH_D} />
          </svg>

          {/* ── Waypoint dots ── */}
          {DOT_POS.map((pos, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el; }}
              className="proto-dot"
              style={pos}
              aria-hidden="true"
            >
              <div className="proto-dot__ring" />
            </div>
          ))}

          {/* ── Step content blocks ── */}
          {STEPS.map((step, i) => (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="proto-step"
              style={STEP_LAYOUT[i].style}
            >
              <span
                className="proto-day"
                style={STEP_LAYOUT[i].dayStyle}
              >
                <BracketIcon />
                {step.day}
              </span>
              <h3 className="proto-step-title">{step.title}</h3>
              <p
                className="proto-step-body"
                dangerouslySetInnerHTML={{ __html: step.body }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
