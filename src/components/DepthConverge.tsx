"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SignalItem {
  key: string;
  label: string;
  icon: "drop" | "heart" | "moon" | "bolt" | "flask";
  color: string;
}

const SIGNALS: SignalItem[] = [
  { key: "glucose",   label: "GLUCOSE",   icon: "drop",  color: "#7FB2FF" },
  { key: "hrv",       label: "HRV",       icon: "heart", color: "#E8E8EA" },
  { key: "sleep",     label: "SLEEP",     icon: "moon",  color: "#8FA6FF" },
  { key: "training",  label: "TRAINING",  icon: "bolt",  color: "#E9D7A6" },
  { key: "bloodwork", label: "BLOODWORK", icon: "flask", color: "#F3A6B0" },
];

const ICONS = {
  drop:  "M12 3 C12 3 6 10 6 14 a6 6 0 0 0 12 0 C18 10 12 3 12 3 Z",
  heart: "M12 20 C12 20 4 14.5 4 9 A4 4 0 0 1 12 7 A4 4 0 0 1 20 9 C20 14.5 12 20 12 20 Z",
  moon:  "M16 3 A9 9 0 1 0 21 14 A7 7 0 0 1 16 3 Z",
  bolt:  "M13 2 L4 14 H11 L10 22 L19 9 H12 Z",
  flask: "M9 2 H15 M10 2 V9 L5 19 A2 2 0 0 0 7 22 H17 A2 2 0 0 0 19 19 L14 9 V2",
};

/* ---- helpers ------------------------------------------------------------ */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const norm = (x: number, a: number, b: number) => clamp((x - a) / (b - a), 0, 1);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function DepthConverge() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const laneYRef = useRef<number[]>([]);
  const startXRef = useRef<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setPrefersReducedMotion(mq.matches);
    upd(); mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  /* ----------------------- canvas signal field ------------------------- */
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const measure = () => {
      const labelsEl = labelsRef.current;
      const cr = canvas.getBoundingClientRect();
      const rows = labelsEl ? labelsEl.querySelectorAll(".dc-lab") : [];
      const ys: number[] = [];
      if (labelsEl && rows.length === SIGNALS.length && cr.height > 0) {
        rows.forEach((row) => {
          const r = row.getBoundingClientRect();
          ys.push(r.top + r.height / 2 - cr.top);
        });
        const lr = labelsEl.getBoundingClientRect();
        startXRef.current = lr.right - cr.left + 8;
      } else {
        for (let i = 0; i < SIGNALS.length; i++)
          ys.push(lerp(H * 0.16, H * 0.84, i / (SIGNALS.length - 1)));
        startXRef.current = W * 0.16;
      }
      laneYRef.current = ys;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measure();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const rnd = (s: number) => { const x = Math.sin(s * 99.13) * 43758.5; return x - Math.floor(x); };
    const waves = SIGNALS.map((s, i) => ({
      color: s.color,
      amp: 13 + rnd(i + 1) * 13,
      freq: 1.4 + rnd(i + 7) * 2.4,
      jitter: s.key === "hrv" ? 1 : 0,
      speed: 0.6 + rnd(i + 3) * 0.7,
      phase: rnd(i + 5) * Math.PI * 2,
    }));

    const draw = (time: number) => {
      const currentW = canvas.clientWidth;
      const currentH = canvas.clientHeight;
      if (currentW > 0 && currentH > 0 && (currentW !== W || currentH !== H)) {
        W = currentW; H = currentH;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        measure();
      }

      if (!canvas.width || !canvas.height) { rafRef.current = requestAnimationFrame(draw); return; }
      const p = phaseRef.current;
      ctx.clearRect(0, 0, W, H);

      const reveal = 1;
      const conv = easeInOut(norm(p, 0.45, 0.92));
      const t_stretch = easeInOut(norm(p, 0.20, 0.40));

      const ys_labels = laneYRef.current;
      const lanes = SIGNALS.map((_, i) => {
        const y0 = H * 0.5 + (i - 2) * 58;
        const y1 = (ys_labels && ys_labels[i] !== undefined) ? ys_labels[i] : (H * 0.5 + (i - 2) * 80);
        return lerp(y0, y1, t_stretch);
      });

      const x0 = 174;
      const x1 = startXRef.current || W * 0.16;
      const startX = lerp(x0, x1, t_stretch);

      const endX_multi = W;
      const endX_labels = W * 0.72;
      const endX = lerp(endX_multi, endX_labels, t_stretch);

      const splitX = startX + (endX - startX) * 0.18;
      const braidCx = lerp(W * 0.58, W * 0.50, t_stretch);
      const orbX = endX;
      const orbY = H * 0.5;
      const t = time * 0.001;
      const n = waves.length;

      waves.forEach((w, i) => {
        const laneY = lanes[i];
        const braidPhase = (i / n) * Math.PI * 2;

        ctx.beginPath();
        const SEG = 96;
        for (let s = 0; s <= SEG; s++) {
          const fx = s / SEG;
          const x = lerp(startX, orbX, fx);

          let wave = Math.sin(fx * w.freq * 8 + t * w.speed + w.phase) * w.amp;
          if (w.jitter) wave += Math.sin(fx * 70 + t * 6) * 6 * (1 - fx);
          let y = laneY + wave;

          const toBraid = norm(x, splitX, braidCx);
          const inBraid = norm(x, braidCx - W * 0.16, braidCx + W * 0.16);
          const helix = Math.sin(fx * 26 + braidPhase) * lerp(0, 44, inBraid) * (1 - norm(x, braidCx, orbX));
          const pull = easeInOut(toBraid) * conv;
          y = lerp(y, H * 0.5 + helix, pull);

          const toOrb = norm(x, braidCx + W * 0.10, orbX);
          y = lerp(y, orbY, easeInOut(toOrb) * conv);

          if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }

        const grad = ctx.createLinearGradient(startX, 0, orbX, 0);
        grad.addColorStop(0, w.color);
        grad.addColorStop(0.55, w.color);
        grad.addColorStop(1, "#7C3AED");
        ctx.strokeStyle = grad;
        ctx.shadowColor = w.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 1 * reveal;
        ctx.lineWidth = lerp(2.1, 3, conv);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = reveal;
      const beam = ctx.createLinearGradient(braidCx, 0, orbX + 80, 0);
      beam.addColorStop(0, "rgba(124,58,237,0)");
      beam.addColorStop(1, "rgba(124,58,237,0.9)");
      ctx.strokeStyle = beam; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(braidCx, orbY); ctx.lineTo(orbX, orbY); ctx.stroke();

      const pulse = 0.5 + Math.sin(t * 3) * 0.12;
      const og = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 46 * conv + 8);
      og.addColorStop(0, `rgba(124,58,237,${0.95 * conv})`);
      og.addColorStop(0.4, `rgba(146,89,199,${0.5 * conv})`);
      og.addColorStop(1, "rgba(146,89,199,0)");
      ctx.fillStyle = og;
      ctx.beginPath(); ctx.arc(orbX, orbY, (46 * conv + 8) * pulse + 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(194,171,234,${conv})`;
      ctx.beginPath(); ctx.arc(orbX, orbY, 5 * conv + 2, 0, Math.PI * 2); ctx.fill();

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [prefersReducedMotion]);

  /* ----------------------- scroll timeline ------------------------------ */
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!sectionRef.current || !cardRef.current || !stageRef.current) return;

    const card = cardRef.current;
    const text = sectionRef.current.querySelector(".dc-text");
    const multi = card.querySelector(".dc-card-multi");
    const labels = card.querySelector(".dc-labels");
    const readout = card.querySelector(".dc-readout");

    gsap.set([labels, readout], { autoAlpha: 0 });
    gsap.set(card, { yPercent: -50 });

    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          pin: stageRef.current,
          pinSpacing: true,
          scrub: 1,
          refreshPriority: -10,
          onUpdate: (self) => { phaseRef.current = self.progress; },
          invalidateOnRefresh: true,
        },
      });

      tl.to(card, {
        left: 0, top: 0, right: 0, bottom: 0,
        width: "100vw", height: "100vh",
        borderRadius: 0, xPercent: 0, yPercent: 0,
        duration: 0.20, ease: "power2.inOut",
      }, 0.20);

      tl.to(text, { autoAlpha: 0, duration: 0.10, ease: "power1.in" }, 0.22);
      tl.to(multi, { autoAlpha: 0, duration: 0.06 }, 0.34);
      tl.to(labels,  { autoAlpha: 1, duration: 0.08 }, 0.34)
        .to(readout, { autoAlpha: 1, x: 0, duration: 0.10 }, 0.62);

      ScrollTrigger.sort();
    }, sectionRef);

    return () => { ctxGsap.revert(); };
  }, [prefersReducedMotion]);

  /* ----------------------- mobile/reduced-motion fallback ------------------------------ */
  if (prefersReducedMotion) {
    return (
      <section className="dc-section is-mobile" aria-label="Depth reads every signal">
        <div className="dc-m-text">
          <h2>Only <em>we</em> see the whole picture.</h2>
          <p>Every signal. Every input. Read together.</p>
        </div>
        <div className="dc-m-card">
          <div className="dc-live"><span className="dc-dot" /> LIVE</div>
          {SIGNALS.map((s, idx) => (
            <div className="dc-m-row" key={s.key}>
              <span className="dc-m-ic">
                <svg viewBox="0 0 24 24" width="15" height="15"><path d={ICONS[s.icon]} fill="none" stroke="#9a9a9c" strokeWidth="1.5"/></svg>
              </span>
              <span className="dc-m-label">{s.label}</span>
              <svg viewBox="0 0 200 36" className="dc-m-wave" preserveAspectRatio="none" style={{ overflow: "hidden" }}>
                <path
                  className="dc-m-wave-path"
                  d="M -80 18 Q -60 5 -40 18 T 0 18 T 40 18 T 80 18 T 120 18 T 160 18 T 200 18 T 240 18 T 280 18"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="1.5"
                  style={{ animationDelay: `${idx * 0.35}s` }}
                />
              </svg>
            </div>
          ))}
        </div>
        <div className="dc-m-read">
          <span className="dc-kicker red">Predict reads</span>
          <h3>Recovery&apos;s back.</h3>
          <p>Sleep + HRV up three days. Glucose steady. A good day to push.</p>
        </div>
        <style>{mobileCSS}</style>
      </section>
    );
  }

  /* ----------------------- desktop markup ------------------------------- */
  return (
    <section ref={sectionRef} className="dc-section" aria-label="Predict reads every signal">
      <div ref={stageRef} className="dc-stage">
        <div className="dc-text">
          <h2 className="dc-headline">Only <em>we</em> see the whole picture.</h2>
          <div className="dc-sub">
            <p>Every signal.</p><p>Every input.</p><p>Read together.</p>
          </div>
        </div>

        <div ref={cardRef} className="dc-card">
          <canvas ref={canvasRef} className="dc-canvas" />
          <div className="dc-live"><span className="dc-dot" /> LIVE</div>

          <div className="dc-card-multi">
            {SIGNALS.map((s, idx) => (
              <div className="dc-msig" key={s.key}>
                <span className="dc-msig-ic">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d={ICONS[s.icon]} fill="none" stroke="#9a9a9c" strokeWidth="1.6"/>
                  </svg>
                </span>
                <span className="dc-msig-label">{s.label}</span>
                <svg className="dc-msig-wave" viewBox="0 0 280 42" preserveAspectRatio="none" style={{ color: s.color }}>
                  <path
                    className="dc-msig-wave-path"
                    d={idx === 1
                      ? "M -80 22 C -62 8 -48 36 -30 22 S 4 8 22 22 S 56 36 74 22 S 108 8 126 22 S 160 36 178 22 S 212 8 230 22 S 264 36 282 22 S 316 8 334 22"
                      : "M -80 22 C -54 8 -30 8 -4 22 S 48 36 74 22 S 126 8 152 22 S 204 36 230 22 S 282 8 308 22 S 360 36 386 22"}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={idx === 1 ? "1.8" : "2.2"}
                    style={{ animationDelay: `${idx * -0.45}s` }}
                  />
                </svg>
              </div>
            ))}
          </div>

          <div className="dc-labels" ref={labelsRef}>
            {SIGNALS.map((s) => (
              <div className="dc-lab" key={s.key}>
                <span className="dc-lab-ic">
                  <svg viewBox="0 0 24 24" width="15" height="15">
                    <path d={ICONS[s.icon]} fill="none" stroke="#8c8c8e" strokeWidth="1.5"/>
                  </svg>
                </span>
                <span className="dc-lab-txt">{s.label}</span>
                <span className="dc-lab-line" />
              </div>
            ))}
          </div>

          <div className="dc-readout">
            <div className="dc-read-block">
              <span className="dc-kicker red">Predict reads</span>
              <h3>Recovery&apos;s back.</h3>
              <p>Sleep + HRV up three days. Glucose steady. A good day to push.</p>
            </div>
            <div className="dc-read-cta">
              <p className="dim">Bring your devices.</p>
              <p className="strong">We bring the intelligence.</p>
              <p className="red">Continuously.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{desktopCSS}</style>
    </section>
  );
}

/* ============================== styles ==================================== */
const desktopCSS = `
.dc-section{
  --bg:#F8F8F6; --ink:#111115; --muted:#4A475A; --red:#9259C7;
  --font: inherit;
  position:relative; background:var(--bg); color:var(--ink); font-family:var(--font);
  -webkit-font-smoothing:antialiased;
}
.dc-stage{ position:relative; height:100vh; width:100%; overflow:hidden; }

.dc-text{
  position:absolute; left:clamp(24px,6vw,110px); top:50%; transform:translateY(-50%);
  width:min(46%,640px); z-index:1; will-change:opacity;
}
.dc-headline{ margin:0; font-weight:800; font-size:clamp(44px,5.4vw,80px);
  line-height:0.98; letter-spacing:-0.03em; }
.dc-headline em{ color:var(--red); font-style:normal; }
.dc-sub{ margin-top:clamp(28px,4vw,56px); }
.dc-sub p{ margin:0 0 4px; font-size:clamp(20px,1.7vw,26px); font-weight:500; }

.dc-card{
  position:absolute; right:clamp(24px,4vw,80px); top:50%;
  width:min(34vw,520px); height:min(64vh,520px);
  background:#0d0d0f; border-radius:24px; overflow:hidden;
  box-shadow:0 30px 80px rgba(0,0,0,.18);
  z-index:5; will-change:width,height,border-radius,inset;
}
.dc-canvas{ position:absolute; inset:0; width:100%; height:100%; display:block; }

.dc-live{
  position:absolute; top:22px; right:26px; z-index:6;
  display:flex; align-items:center; gap:7px;
  font-size:12px; letter-spacing:.14em; color:#d8d8da; font-weight:600;
  background:rgba(255,255,255,.06); padding:6px 12px; border-radius:99px;
}
.dc-dot{ width:7px; height:7px; border-radius:50%; background:#7C3AED; box-shadow:0 0 8px #7C3AED; }

.dc-card-multi{ position:absolute; inset:0; padding:64px 32px 32px;
  display:flex; flex-direction:column; justify-content:center; gap:26px; z-index:2; }
.dc-msig{ display:grid; grid-template-columns:18px 96px 1fr; align-items:center; gap:14px; }
.dc-msig-label{ font-size:12px; letter-spacing:.12em; color:#bdbdbf; }
.dc-msig-wave{ width:100%; height:34px; overflow:hidden; filter:drop-shadow(0 0 7px currentColor); }
.dc-msig-wave-path{ animation:dcSignalFlow 3.6s linear infinite; will-change:transform; }
@keyframes dcSignalFlow{
  from{ transform:translate3d(0,0,0); }
  to{ transform:translate3d(-106px,0,0); }
}
.dc-kicker{ font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:#8c8c8e; }
.dc-kicker.red{ color:#7C3AED; }

.dc-labels{ position:absolute; left:clamp(24px,5vw,90px); top:50%; transform:translateY(-50%);
  display:flex; flex-direction:column; gap:clamp(28px,7vh,70px); z-index:4; }
.dc-lab{ display:grid; grid-template-columns:20px auto 56px; align-items:center; gap:14px; }
.dc-lab-txt{ font-size:13px; letter-spacing:.14em; color:#9a9a9c; }
.dc-lab-line{ height:1px; background:linear-gradient(90deg,#555,transparent); }

.dc-readout{ position:absolute; right:clamp(24px,5vw,90px); top:50%; transform:translateY(-50%);
  width:min(28vw,360px); z-index:4; }
.dc-read-block{ border-left:2px solid #7C3AED; padding-left:18px; }
.dc-read-block h3{ margin:6px 0 10px; font-size:34px; font-weight:800; color:#fff; letter-spacing:-0.02em; }
.dc-read-block p{ margin:0; color:#9a9a9c; font-size:16px; line-height:1.45; }
.dc-read-cta{ margin-top:56px; }
.dc-read-cta p{ margin:0; font-size:clamp(20px,1.8vw,28px); font-weight:700; letter-spacing:-0.01em; }
.dc-read-cta .dim{ color:#9a9a9c; }
.dc-read-cta .strong{ color:#fff; }
.dc-read-cta .red{ color:#7C3AED; }

@media (max-width: 820px) {
  .dc-text {
    left: 5% !important;
    right: 5% !important;
    top: 15% !important;
    transform: translateY(-50%) !important;
    width: 90% !important;
    text-align: center;
  }
  .dc-headline {
    font-size: clamp(32px, 7vw, 46px) !important;
  }
  .dc-sub {
    margin-top: 16px !important;
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  .dc-sub p {
    margin: 0 !important;
    font-size: clamp(14px, 3.5vw, 18px) !important;
  }
  .dc-card {
    right: 5% !important;
    left: 5% !important;
    top: 45% !important;
    transform: translateY(-50%) !important;
    width: 90% !important;
    height: 40vh !important;
    max-height: 380px !important;
  }
  .dc-card-multi {
    padding: 40px 16px 16px !important;
    gap: 16px !important;
  }
  .dc-msig {
    grid-template-columns: 18px 74px 1fr !important;
    gap: 8px !important;
  }
  .dc-msig-label {
    font-size: 10px !important;
  }
  .dc-msig-wave {
    height: 24px !important;
  }
  .dc-labels {
    left: 8% !important;
    right: 8% !important;
    top: 25% !important;
    transform: translateY(-50%) !important;
    gap: 16px !important;
  }
  .dc-lab {
    grid-template-columns: 16px auto 1fr !important;
    gap: 8px !important;
  }
  .dc-lab-txt {
    font-size: 11px !important;
  }
  .dc-readout {
    right: 8% !important;
    left: 8% !important;
    top: 65% !important;
    transform: translateY(-50%) !important;
    width: 84% !important;
  }
  .dc-read-block h3 {
    font-size: clamp(24px, 6vw, 30px) !important;
  }
  .dc-read-block p {
    font-size: 13px !important;
  }
  .dc-read-cta {
    margin-top: 24px !important;
  }
  .dc-read-cta p {
    font-size: clamp(16px, 4vw, 20px) !important;
  }
}
`;

const mobileCSS = `
.dc-section.is-mobile{
  --red:#9259C7; background:#F8F8F6; color:#111115;
  font-family: inherit;
  padding:64px 22px;
}
.dc-section.is-mobile h2{ font-size:clamp(34px,9vw,46px); font-weight:800; letter-spacing:-0.03em; margin:0 0 14px; }
.dc-section.is-mobile h2 em{ color:var(--red); font-style:normal; }
.dc-section.is-mobile .dc-m-text p{ color:#4A475A; font-size:20px; margin:0; }
.dc-m-card{ margin:32px 0; background:#0d0d0f; border-radius:20px; padding:48px 20px 24px;
  position:relative; display:flex; flex-direction:column; gap:20px; }
.dc-m-card .dc-live{ position:absolute; top:16px; right:18px; }
.dc-m-row{ display:grid; grid-template-columns:20px 84px 1fr; align-items:center; gap:12px; }
.dc-m-label{ font-size:11px; letter-spacing:.12em; color:#bdbdbf; }
.dc-m-wave{ width:100%; height:30px; }
.dc-m-read .dc-kicker.red{ color:#9259C7; }
.dc-m-read h3{ font-size:30px; font-weight:800; margin:6px 0 8px; }
.dc-m-read p{ color:#4A475A; font-size:16px; margin:0; }
@keyframes dcWaveFlow {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-80px, 0, 0); }
}
.dc-m-wave-path {
  animation: dcWaveFlow 3s linear infinite;
  will-change: transform;
}
`;
