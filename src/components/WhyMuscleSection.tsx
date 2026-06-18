'use client';

/**
 * WhyMuscleSection
 * ------------------------------------------------------------------
 * Desktop (fine pointer + hover + >=900px): GSAP ScrollTrigger pins
 * the stage and scrubs the track horizontally — two cards on screen,
 * scroll to reveal the other two.
 *
 * Everything else (phones, AND tablets in either orientation, AND
 * any touch laptop) gets a plain native horizontally-snapping
 * scroller — finger-swipe does the work, no JS involved. The
 * desktop/touch split is capability-based (hover/pointer), not just
 * a width check, specifically so rotating a tablet from portrait to
 * landscape can't accidentally flip it into pin-scrub mode mid-use.
 *
 * Requires `gsap` to be installed (you already have it elsewhere in
 * the project). Neue Montreal: point the @font-face src below at
 * your real font files, or delete that block entirely if you're
 * already loading it globally via next/font/local — the font-family
 * reference further down will pick it up either way.
 * ------------------------------------------------------------------
 */

import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const DESKTOP_QUERY = '(min-width: 900px)';

type System = {
  id: 'c1' | 'c2' | 'c3' | 'c4';
  num: string;
  title: string;
  desc: string;
  line: string;
};

const SYSTEMS: System[] = [
  {
    id: 'c1',
    num: '01',
    title: 'Cardiovascular',
    desc: 'Low muscle mass doubles cardiovascular mortality risk. The signal is present in blood a decade before a cardiac event.',
    line: 'Blood reveals cardiovascular risk long before symptoms appear.',
  },
  {
    id: 'c2',
    num: '02',
    title: 'Metabolism & Insulin Resistance',
    desc: 'Every 10% increase in muscle mass reduces insulin resistance by 11%. Blood tracks this shift in real time across panels.',
    line: 'Metabolic resilience is continuously measurable through biomarkers.',
  },
  {
    id: 'c3',
    num: '03',
    title: 'Bone & Joint Density',
    desc: 'Muscle weakness is the #1 predictor of fracture risk in adults over 40. Bone decline starts at 45. Screening starts at 65.',
    line: 'Muscle and bone age together and blood sees both.',
  },
  {
    id: 'c4',
    num: '04',
    title: 'Cognitive Health',
    desc: 'Brain function declines with muscle through inflammation, IGF-1, and insulin sensitivity — all readable in a single blood panel.',
    line: 'The brain and muscle are connected through shared pathways.',
  },
];

export default function WhyMuscleSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const headingLines = [
    "Why muscle -",
    "and why blood"
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    const dotsEl = dotsRef.current;
    if (!wrap || !sticky || !track || !dotsEl) return;

    const cards = track.querySelectorAll<HTMLDivElement>('.wmb-card');
    const dots = dotsEl.querySelectorAll<HTMLSpanElement>('.wmb-dot');
    const mq = window.matchMedia(DESKTOP_QUERY);

    let st: ScrollTrigger | null = null;
    let tween: gsap.core.Tween | null = null;

    // Apple-style line-by-line reveal animation
    const titleLines = gsap.utils.toArray<HTMLElement>(".wmb-reveal-title .reveal-line");
    const titleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".wmb-header",
        start: "top 85%",
        end: "bottom 55%",
        scrub: true,
      }
    });
    if (titleLines.length >= 2) {
      titleTimeline.fromTo(titleLines[0], { opacity: 0.15 }, { opacity: 1, duration: 1, ease: "none" })
                   .fromTo(titleLines[1], { opacity: 0 }, { opacity: 1, duration: 1, ease: "none" });
    }

    const subReveal = gsap.to(".wmb-reveal-sub", {
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".wmb-header",
        start: "top 70%",
        end: "bottom 50%",
        scrub: true,
      }
    });

    function maxScroll() {
      if (!trackRef.current) return 0;
      const cards = trackRef.current.querySelectorAll<HTMLDivElement>('.wmb-card');
      if (cards.length === 0) return 0;
      const lastCard = cards[cards.length - 1];
      const lastCardOffsetLeft = lastCard.offsetLeft;
      const lastCardWidth = lastCard.offsetWidth;
      const paddingRight = 0.08 * window.innerWidth;
      const totalWidth = lastCardOffsetLeft + lastCardWidth + paddingRight;
      const measured = totalWidth - window.innerWidth;
      const calculated = 2576 - 0.84 * window.innerWidth;
      return Math.max(0, Math.max(measured, calculated));
    }

    function buildDesktopScroll() {
      gsap.set(track, { x: 0 });
      tween = gsap.to(track, {
        x: () => -maxScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          pin: sticky,
          pinSpacing: true,
          start: 'top top',
          end: () => `+=${maxScroll()}`,
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: 55,
          onEnter: () => dotsEl!.classList.add('is-visible'),
          onEnterBack: () => dotsEl!.classList.add('is-visible'),
          onLeave: () => dotsEl!.classList.remove('is-visible'),
          onLeaveBack: () => dotsEl!.classList.remove('is-visible'),
          onUpdate(self) {
            const idx = Math.min(cards.length - 1, Math.floor(self.progress * cards.length));
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
          },
        },
      });
      st = tween.scrollTrigger ?? null;
    }

    function destroyDesktopScroll() {
      st?.kill();
      st = null;
      tween?.kill();
      tween = null;
      gsap.set(track, { x: 0 });
      dotsEl!.classList.remove('is-visible');
    }

    function init() {
      destroyDesktopScroll();
      if (mq.matches) buildDesktopScroll();
    }

    init();

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    // Crossing the desktop/touch boundary (not just any resize) is what
    // should rebuild the engine — this is what keeps tablet rotation safe.
    mq.addEventListener('change', init);

    // A same-mode resize (e.g. desktop window dragged narrower) still
    // needs ScrollTrigger to recompute distances/widths.
    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    }
    window.addEventListener('resize', onResize);

    return () => {
      mq.removeEventListener('change', init);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      clearTimeout(refreshTimer);
      destroyDesktopScroll();
      titleTimeline.scrollTrigger?.kill();
      titleTimeline.kill();
      subReveal.scrollTrigger?.kill();
      subReveal.kill();
    };
  }, []);

  function handleCardPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    card.style.transform = `translate(${x * 0.02}px,${y * 0.02}px) rotateY(${x * 0.02}deg) rotateX(${-y * 0.02}deg)`;
  }

  function handleCardPointerLeave(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.style.transform = '';
  }

  return (
    <section className="wmb-section" ref={sectionRef}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="wmb-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
      </svg>

      <div className="wmb-header flex flex-col items-center">
        <h2 className="wmb-reveal-title flex flex-col items-center">
          {headingLines.map((line, i) => (
            <span key={i} className={`reveal-line block ${i === 0 ? "opacity-15" : "opacity-0"}`}>
              {line}
            </span>
          ))}
        </h2>
        <p className="wmb-reveal-sub opacity-30">Muscle doesn&apos;t fail in isolation. It takes four systems with it.</p>
      </div>

      <div className="wmb-wrap" ref={wrapRef}>
        <div className="wmb-sticky" ref={stickyRef}>
          <div className="wmb-track" ref={trackRef}>
            {SYSTEMS.map((sys) => (
              <div
                key={sys.id}
                className={`wmb-card wmb-${sys.id}`}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={handleCardPointerLeave}
              >
                <div className="wmb-orb">
                  <div className="wmb-gooey">
                    <div className="wmb-blob wmb-b1" />
                    <div className="wmb-blob wmb-b2" />
                    <div className="wmb-blob wmb-b3" />
                  </div>
                </div>
                <div className="wmb-content">
                  <div className="wmb-num">{sys.num}</div>
                  <h3>{sys.title}</h3>
                  <p>{sys.desc}</p>
                  <div className="wmb-line">{sys.line}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="wmb-dots" ref={dotsRef}>
            {SYSTEMS.map((sys, i) => (
              <span key={sys.id} className={`wmb-dot${i === 0 ? ' active' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @font-face {
          font-family: 'Neue Montreal';
          src: url('/fonts/NeueMontreal-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Neue Montreal';
          src: url('/fonts/NeueMontreal-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }

        .wmb-section {
          background: #000000;
          overflow: hidden;
          color: #fff;
          font-family: 'Neue Montreal', sans-serif;
        }
        .wmb-header { text-align: center; padding: 100px 20px 60px; max-width: 1000px; margin: auto; }
        .wmb-header h2, .wmb-reveal-title { font-size: clamp(36px, 4.5vw, 56px); font-weight: 500; margin: 0; }
        .wmb-reveal-sub { font-size: clamp(16px, 1.8vw, 20px); color: #b9c0ce; margin-top: 16px; transition: opacity 0.3s ease; }
 
        .wmb-wrap { position: relative; }
 
        /* ---- mobile + tablet (default): plain native swipe ---- */
        .wmb-sticky { position: relative; height: auto; }
        .wmb-track {
          display: flex;
          gap: 32px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 20px;
          scrollbar-width: none;
        }
        .wmb-track::-webkit-scrollbar { display: none; }
 
        .wmb-card {
          flex: none;
          width: 88vw;
          min-width: 88vw;
          height: 700px;
          scroll-snap-align: center;
          position: relative;
          overflow: hidden;
          border-radius: 36px;
          background: rgba(18, 22, 30, 0.45);
          -webkit-backdrop-filter: blur(28px);
          backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 30px 100px rgba(0, 0, 0, 0.45);
          transition: transform 0.25s ease;
        }
        .wmb-card::before {
          content: '';
          position: absolute;
          inset: -35%;
          filter: blur(120px);
          opacity: 0.9;
        }
        .wmb-c1::before { background: radial-gradient(circle, #ff2d55 0, transparent 50%); }
        .wmb-c2::before { background: radial-gradient(circle, #6e3bff 0, transparent 50%); }
        .wmb-c3::before { background: radial-gradient(circle, #ff8a00 0, transparent 50%); }
        .wmb-c4::before { background: radial-gradient(circle, #2979ff 0, transparent 50%); }
 
        .wmb-orb { position: absolute; top: 50px; left: 40px; width: 190px; height: 190px; }
        .wmb-gooey { width: 100%; height: 100%; filter: url(#wmb-goo); }
        .wmb-blob { position: absolute; border-radius: 50%; mix-blend-mode: screen; }
        .wmb-c1 .wmb-b1 { background: #ff2d55; } .wmb-c1 .wmb-b2 { background: #ff7d95; } .wmb-c1 .wmb-b3 { background: #ffd0da; }
        .wmb-c2 .wmb-b1 { background: #6e3bff; } .wmb-c2 .wmb-b2 { background: #b88cff; } .wmb-c2 .wmb-b3 { background: #ead8ff; }
        .wmb-c3 .wmb-b1 { background: #ff8a00; } .wmb-c3 .wmb-b2 { background: #ffc266; } .wmb-c3 .wmb-b3 { background: #ffe1b3; }
        .wmb-c4 .wmb-b1 { background: #2979ff; } .wmb-c4 .wmb-b2 { background: #72a7ff; } .wmb-c4 .wmb-b3 { background: #d4e4ff; }
 
        .wmb-b1 { width: 120px; height: 120px; left: 10px; top: 20px; animation: wmb-f1 8s infinite ease-in-out; }
        .wmb-b2 { width: 110px; height: 110px; left: 70px; top: 50px; animation: wmb-f2 7s infinite ease-in-out; }
        .wmb-b3 { width: 95px; height: 95px; left: 40px; top: 90px; animation: wmb-f3 6s infinite ease-in-out; }
 
        .wmb-content { position: absolute; left: 42px; right: 42px; bottom: 42px; }
        .wmb-num { font-size: 14px; color: #aaa; margin-bottom: 16px; }
        .wmb-content h3 { font-size: 34px; line-height: 1.05; margin-bottom: 22px; font-weight: 500; }
        .wmb-content p { font-size: 18px; line-height: 1.55; color: #d7deea; margin: 0; }
        .wmb-line { margin-top: 28px; padding-top: 18px; border-top: 1px dashed rgba(255, 255, 255, 0.15); font-size: 18px; color: #c2c9d5; }
 
        @keyframes wmb-f1 { 50% { transform: translate(25px, -12px); } }
        @keyframes wmb-f2 { 50% { transform: translate(-20px, 20px); } }
        @keyframes wmb-f3 { 50% { transform: translate(18px, 12px); } }
 
        .wmb-dots {
          position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
          display: none; gap: 10px; z-index: 20;
          opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        .wmb-dots.is-visible { opacity: 1; pointer-events: auto; }
        .wmb-dot { width: 10px; height: 10px; border-radius: 50%; background: #444; }
        .wmb-dot.active { background: #6e3bff; }
 
        /* ---- desktop only: >=900px ---- */
        @media (min-width: 900px) {
          .wmb-wrap { position: relative; }
          .wmb-sticky { position: relative; top: auto; height: 100vh; display: flex; align-items: center; overflow: hidden; width: 100%; background: #000000; }
          .wmb-track {
            display: flex !important;
            flex-wrap: nowrap !important;
            width: max-content !important;
            overflow-x: hidden !important;
            scroll-snap-type: none !important;
            padding: 0 8vw !important;
            will-change: transform !important;
            position: relative !important;
            flex-shrink: 0 !important;
          }
          .wmb-card {
            width: 620px !important;
            min-width: 620px !important;
            height: min(640px, 70vh) !important;
            scroll-snap-align: unset !important;
          }
          .wmb-content h3 { font-size: 42px; }
          .wmb-content p { font-size: 24px; }
          .wmb-dots { display: flex; }

          /* Scale down card contents on shorter viewport heights to prevent vertical cropping */
          @media (max-height: 850px) {
            .wmb-card {
              height: min(560px, 72vh);
            }
            .wmb-orb {
              top: 30px;
              left: 30px;
              width: 140px;
              height: 140px;
            }
            .wmb-content {
              left: 32px;
              right: 32px;
              bottom: 32px;
            }
            .wmb-content h3 {
              font-size: 32px;
              margin-bottom: 12px;
            }
            .wmb-content p {
              font-size: 18px;
            }
            .wmb-line {
              margin-top: 16px;
              padding-top: 12px;
              font-size: 16px;
            }
          }

          @media (max-height: 700px) {
            .wmb-card {
              height: min(460px, 72vh);
            }
            .wmb-orb {
              top: 20px;
              left: 24px;
              width: 110px;
              height: 110px;
            }
            .wmb-content {
              left: 24px;
              right: 24px;
              bottom: 24px;
            }
            .wmb-content h3 {
              font-size: 24px;
              margin-bottom: 8px;
            }
            .wmb-content p {
              font-size: 15px;
              line-height: 1.45;
            }
            .wmb-line {
              margin-top: 10px;
              padding-top: 8px;
              font-size: 14px;
            }
          }
        }
      `}</style>
    </section>
  );
}
