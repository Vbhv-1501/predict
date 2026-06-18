"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepItem {
  label: string;
  headline: string;
  body: string;
}

interface ChatLine {
  html?: string;
  action?: boolean;
}

interface ChatItem {
  type: "user" | "typing" | "ai";
  at: number;
  hideAt?: number;
  text?: string;
  accent?: boolean;
  lines?: ChatLine[];
}

/* ---- Left-panel steps (matches the recording exactly) ------------------- */
const STEPS: StepItem[] = [
  {
    label: "A question",
    headline: "Ask anything.",
    body: "Depth answers from your own data. No dashboards. No charts. A reply.",
  },
  {
    label: "An insight",
    headline: "Patterns you'd\nnever spot.",
    body: "Depth watches the whole record, and tells you what changed before you'd ever notice.",
  },
  {
    label: "An action",
    headline: "Tell Depth to act.",
    body: "Schedules. Reminders. Bookings. One sentence is the whole flow.",
  },
];

/* ---- Chat thread, in scroll order. Each item carries an `at` value:
 *      the timeline progress (0..1) at which it appears. -------------------- */
const CHAT: ChatItem[] = [
  { type: "user", at: 0.08, text: "Why has my energy been off this month?" },
  { type: "typing", at: 0.14, hideAt: 0.22 },
  {
    type: "ai",
    at: 0.22,
    lines: [
      { html: "Your ferritin dropped from <b>78 → 41</b> since February." },
      {
        html: "Your last three weeks of sleep have been <b>32 minutes</b> shorter than your baseline.",
      },
      {
        html: "Both are contributing, ferritin more than sleep. Worth a recheck in six weeks.",
      },
    ],
  },
  {
    type: "ai",
    at: 0.3,
    accent: true,
    lines: [
      { html: "Your <b>ApoB</b> has crept up <b>14 points</b> across the last three panels." },
      {
        html: "It lines up with saturated fat going up after you started bulking in December.",
      },
      { action: true },
      {
        html: 'Swap <span class="dx-hl">two weekly red-meat meals for fish</span> and the trajectory reverses by your next draw.',
      },
    ],
  },
  { type: "user", at: 0.62, text: "Book my next draw." },
  {
    type: "ai",
    at: 0.72,
    lines: [
      { html: "Booked. Phlebo arrives <b>Saturday · 7 AM</b> at your Indiranagar address." },
      { html: "Same panel as last time, plus the <b>Lp(a)</b> you've been meaning to test." },
      { html: "I'll remind you to fast Friday night." },
    ],
  },
];

/* ---- Tiny inline avatar (the Depth mark) -------------------------------- */
function Avatar() {
  return (
    <span className="dx-avatar" aria-hidden="true" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src="/fav.ico"
        alt="Predict Logo"
        className="w-full h-full object-cover rounded-full"
      />
    </span>
  );
}

export default function DepthScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const chatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setPrefersReducedMotion(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!sectionRef.current || !panelRef.current) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const steps = stepRefs.current.filter(Boolean);
    const chat = chatRefs.current.filter(Boolean);
    const seg = 1 / steps.length;

    /* initial: step 0 visible, rest hidden */
    steps.forEach((el, i) => {
      gsap.set(el, {
        autoAlpha: i === 0 ? 1 : 0,
        y: i === 0 ? 0 : 44,
        scale: i === 0 ? 1 : 0.95,
        filter: i === 0 ? "blur(0px)" : "blur(10px)",
      });
    });
    gsap.set(chat, { autoAlpha: 0, y: 26, scale: 0.96, filter: "blur(0px)" });

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 821px)",
      isMobile: "(max-width: 820px)"
    }, (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean };
      const thread = threadRef.current;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + steps.length * 120 + "%",
          pin: panelRef.current,
          pinSpacing: true,
          scrub: 1,
          refreshPriority: 20,
          invalidateOnRefresh: true,
        },
      });

      // Translate the chat thread container upwards as the conversation progresses to keep the active bubbles in view
      if (thread) {
        if (isDesktop) {
          tl.to(thread, { y: 0, duration: 0.05 }, 0.08);
          tl.to(thread, { y: -20, duration: 0.05, ease: "power2.out" }, 0.22);
          tl.to(thread, { y: -76, duration: 0.05, ease: "power2.out" }, 0.30);
          tl.to(thread, { y: -126, duration: 0.05, ease: "power2.out" }, 0.62);
          tl.to(thread, { y: -158, duration: 0.05, ease: "power2.out" }, 0.72);
        } else {
          tl.to(thread, {
            y: () => {
              const viewportHeight = rightRef.current?.clientHeight ?? 0;
              return -Math.max(0, thread.scrollHeight - viewportHeight + 20);
            },
            duration: 1,
            ease: "none",
          }, 0);
        }
      }

      /* left panel cross-fade */
      steps.forEach((el, i) => {
        const at = i * seg;
        if (i > 0) {
          tl.to(
            steps[i - 1],
            { autoAlpha: 0, y: -42, scale: 0.97, filter: "blur(10px)", duration: seg * 0.45, ease: "power2.in" },
            at - seg * 0.22
          );
          tl.to(
            el,
            { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: seg * 0.5, ease: "power2.out" },
            at
          );
        } else {
          tl.to({}, { duration: seg }, at);
        }
      });

      /* right chat thread builds in */
      CHAT.forEach((item, i) => {
        const el = chat[i];
        if (!el) return;
        
        // Show active chat item
        tl.to(el, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.05, ease: "power2.out" }, item.at);
        
        // Blur and fade previous messages when a new user question enters
        if (item.type === "user" && i > 0) {
          for (let j = 0; j < i; j++) {
            const prevEl = chat[j];
            if (prevEl && CHAT[j].type !== "typing") {
              tl.to(prevEl, {
                opacity: 0.15,
                filter: "blur(4px)",
                duration: 0.05,
                ease: "power2.out"
              }, item.at);
            }
          }
        }

        if (item.hideAt != null) {
          tl.to(el, { autoAlpha: 0, duration: 0.04, ease: "power1.in" }, item.hideAt);
        }
      });

      ScrollTrigger.sort();
    }, sectionRef);

    return () => {
      mm.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={`dx-section${prefersReducedMotion ? " is-mobile" : ""}`}
      aria-label="What Predict does"
    >
      <div ref={panelRef} className="dx-panel">
        <div className="dx-inner">
          {/* LEFT: sticky text steps */}
          <div className="dx-left">
            <div className="dx-stage">
              {STEPS.map((s, i) => (
                <article key={i} ref={(el) => { stepRefs.current[i] = el; }} className="dx-step">
                  <span className="dx-label">{s.label}</span>
                  <h2 className="dx-headline">
                    {s.headline.split("\n").map((line, li) => (
                      <span className="dx-hline" key={li}>{line}</span>
                    ))}
                  </h2>
                  <p className="dx-body">{s.body}</p>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT: chat thread */}
          <div ref={rightRef} className="dx-right">
            <div ref={threadRef} className="dx-thread">
              {CHAT.map((item, i) => {
                if (item.type === "user")
                  return (
                    <div key={i} ref={(el) => { chatRefs.current[i] = el; }} className="dx-row dx-row-user" style={{ opacity: 0 }}>
                      <div className="dx-bubble dx-user">{item.text}</div>
                    </div>
                  );
                if (item.type === "typing")
                  return (
                    <div key={i} ref={(el) => { chatRefs.current[i] = el; }} className="dx-row dx-row-ai" style={{ opacity: 0 }}>
                      <Avatar />
                      <div className="dx-bubble dx-typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  );
                /* ai */
                return (
                  <div key={i} ref={(el) => { chatRefs.current[i] = el; }} className="dx-row dx-row-ai" style={{ opacity: 0 }}>
                    <Avatar />
                    <div className={`dx-bubble dx-ai${item.accent ? " dx-ai-accent" : ""}`}>
                      {item.lines?.map((ln, li) =>
                        ln.action ? (
                          <span key={li} className="dx-action">Action</span>
                        ) : (
                          <p key={li} dangerouslySetInnerHTML={{ __html: ln.html || "" }} />
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dx-section {
          --bg:#F8F8F6; --ink:#111115; --muted:#4A475A;
          --blue:#7C3AED; --bubble:rgba(255, 255, 255, 0.6); --accent:#9259C7;
          --font: inherit;
          position: relative;
          background:var(--bg); color:var(--ink);
          font-family:var(--font);
          -webkit-font-smoothing:antialiased;
        }
        .dx-panel{
          position:relative; height:100vh; height:100svh; width:100%;
          overflow:hidden; display:flex; align-items:center;
        }
        .dx-inner{
          width:100%; max-width:1320px; margin:0 auto;
          padding:0 clamp(24px,5vw,72px);
          display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center;
        }

        /* ---------- LEFT ---------- */
        .dx-left{ position:relative; }
        .dx-stage{ position:relative; min-height:340px; }
        .dx-step{
          position:absolute; inset:0;
          will-change:transform,opacity,filter; transform:translateZ(0);
        }
        .dx-step:first-child{ position:relative; }
        .dx-label{
          display:inline-block; font-size:15px; color:var(--muted);
          margin-bottom:22px; letter-spacing:0;
        }
        .dx-headline{
          margin:0 0 26px; font-weight:800;
          font-size:clamp(48px,6.4vw,92px); line-height:0.98;
          letter-spacing:-0.035em;
        }
        .dx-hline{ display:block; }
        .dx-body{
          margin:0; max-width:30ch; color:var(--muted);
          font-size:clamp(18px,1.5vw,23px); line-height:1.45; font-weight:400;
        }

        /* ---------- RIGHT (chat) ---------- */
        .dx-right{
          position:relative;
          height:clamp(500px,62vh,620px);
          align-self:center;
          overflow:hidden;
        }
        .dx-thread{
          position:absolute;
          top:0; left:0; right:0;
          display:flex; flex-direction:column; gap:16px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .dx-thread::-webkit-scrollbar {
          display: none;
        }
        .dx-row{ display:flex; align-items:flex-end; gap:10px; will-change:transform,opacity; }
        .dx-row-user{ justify-content:flex-end; }
        .dx-row-ai{ justify-content:flex-start; }

        .dx-bubble{
          max-width: min(420px, calc(100% - 48px)); padding:12px 16px; border-radius:18px;
          font-size:15px; line-height:1.45;
        }
        .dx-bubble p{ margin:0 0 10px; }
        .dx-bubble p:last-child{ margin-bottom:0; }
        .dx-bubble b{ font-weight:700; }

        .dx-user{
          background:var(--blue); color:#fff; font-weight:600;
          border-bottom-right-radius:8px;
        }
        .dx-ai{
          background:var(--bubble); color:var(--ink);
          border-bottom-left-radius:8px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(124, 58, 237, 0.06);
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.03);
        }
        .dx-ai-accent{ border-left:3px solid var(--accent); border-radius:22px 22px 22px 6px; }
        .dx-action{
          display:block; font-size:12px; font-weight:700; letter-spacing:.12em;
          text-transform:uppercase; color:var(--accent); margin:4px 0 2px;
        }
        .dx-hl{ color:var(--accent); font-weight:700; }

        .dx-avatar{
          flex:0 0 auto; width:30px; height:30px; border-radius:50%;
          background:#fff; border:1px solid #ececec;
          display:grid; place-items:center; box-shadow:0 1px 2px rgba(0,0,0,.04);
        }

        .dx-typing{ display:flex; gap:5px; padding:14px 18px; }
        .dx-typing span{
          width:7px; height:7px; border-radius:50%; background:#b3b3b3;
          animation:dxBlink 1.2s infinite ease-in-out;
        }
        .dx-typing span:nth-child(2){ animation-delay:.2s; }
        .dx-typing span:nth-child(3){ animation-delay:.4s; }
        @keyframes dxBlink{ 0%,80%,100%{opacity:.3} 40%{opacity:1} }

        /* ---------- MOBILE FALLBACK & RESPONSIVE LAYOUT ---------- */
        .dx-section.is-mobile .dx-panel{ height:auto; display:block; padding:64px 0; }
        .dx-section.is-mobile .dx-inner{
          grid-template-columns:1fr; gap:40px; padding:0 24px;
        }
        .dx-section.is-mobile .dx-stage{ min-height:0; }
        .dx-section.is-mobile .dx-step{
          position:relative; inset:auto; padding:36px 0;
          opacity:0; transform:translateY(22px); animation:dxFade .7s ease forwards;
        }
        .dx-section.is-mobile .dx-step:nth-child(n){ animation-delay:.04s; }
        .dx-section.is-mobile .dx-headline{ font-size:clamp(38px,11vw,56px); }
        .dx-section.is-mobile .dx-progress{ display:none; }
        .dx-section.is-mobile .dx-bubble{ max-width:80%; font-size:17px; }
        /* Make left panel sticky at top on mobile while right thread scrolls */
        .dx-section.is-mobile .dx-left{ position:sticky; top:0; z-index:3; background:var(--bg); }
        .dx-section.is-mobile .dx-right{ height:auto; max-height:calc(100svh - 120px); overflow:auto; }
        .dx-section.is-mobile .dx-thread{ position:relative; }
        @keyframes dxFade{ to{opacity:1; transform:translateY(0);} }
        @media (prefers-reduced-motion:reduce){
          .dx-step{ animation:none!important; opacity:1!important; transform:none!important; }
        }

        @media (max-width: 820px) {
          .dx-panel {
            height: 100vh !important;
            height: 100svh !important;
            display: flex !important;
            align-items: stretch !important;
          }
          .dx-inner {
            grid-template-columns: 1fr !important;
            grid-template-rows: minmax(120px, 24svh) 1fr !important;
            gap: 8px !important;
            padding: max(68px, 8svh) 16px 16px !important;
            align-content: stretch !important;
            height: 100% !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
          }
          .dx-left {
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            position: relative !important;
            z-index: 2 !important;
            flex-shrink: 0 !important;
          }
          .dx-stage {
            min-height: 110px !important;
          }
          .dx-label { margin-bottom: 10px !important; font-size: 12px !important; }
          .dx-headline {
            font-size: clamp(34px, 10vw, 48px) !important;
            margin: 0 0 12px !important;
          }
          .dx-body {
            font-size: clamp(14px, 3.8vw, 17px) !important;
            max-width: 100% !important;
          }
          .dx-right {
            height: auto !important;
            min-height: 0 !important;
            align-self: stretch !important;
            overflow: hidden !important;
            flex: 1 !important;
            width: 100% !important;
          }
          .dx-bubble {
            font-size: 13px !important;
            max-width: 88% !important;
            padding: 10px 14px !important;
          }
        }
      `}</style>
    </section>
  );
}
