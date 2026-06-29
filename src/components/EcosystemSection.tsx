import { useEffect, useRef } from "react";
import "./EcosystemSection.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/*
 * PLACEMENT STRATEGY
 * ──────────────────
 * Two concentric elliptical orbits, 3 cards each:
 *   near-orbit  (positive Z) : angles 310°, 75°, 200°
 *   far-orbit   (negative Z) : angles 40°, 160°, 265°
 *
 * Each orbit's cards are 120° apart → no angular collision within a tier.
 * The two orbits are offset by 60° → no two cards share a radial spoke.
 *
 * Float amplitude is small (≤6 px) so cards never drift into neighbours.
 * Rotational drift kept < ±2° for the same reason.
 */

const RAD = (a: number) => (a * Math.PI) / 180;

interface EcosystemCard {
  id: string; label: string;
  w: number; h: number;
  size: "lg" | "md" | "sm";
  tier: "near" | "far";
  angleDeg: number;          // fixed angular slot on the orbit
  rScaleX: number;           // orbit radius multipliers (far > near)
  rScaleY: number;
  z: number;
  rotX: number; rotY: number; rotZ: number;
  ampX: number; ampY: number; ampZ: number;
  sp: number; ph: number; rdrift: number;
  src?: string;
}

const CARDS: EcosystemCard[] = [
  // ── NEAR orbit  ·  inner images closer to center, subtle Z depth ──
  { id:"vo2max",
    label:"VO2 Max",       w:1448, h:1086, size:"sm", tier:"near",
    angleDeg: 315, rScaleX: 0.9, rScaleY: 0.9,
    z: -70, rotX:  10, rotY: -15, rotZ: -3,
    ampX:0, ampY:0, ampZ:0, sp:0, ph:0, rdrift:0,
    src: "/assets/VO2 Max.webp" },

  { id:"bloodtest",
    label:"Advanced Blood Test",   w:447, h:558, size:"sm", tier:"near",
    angleDeg:  75, rScaleX: 0.9, rScaleY: 0.9,
    z: -80, rotX: -15, rotY: -10, rotZ:  2,
    ampX:0, ampY:0, ampZ:0, sp:0, ph:0, rdrift:0,
    src: "/assets/Advanced Blood Test.webp" },

  { id:"insights",
    label:"Actionable Insights",      w:1122, h:1402, size:"sm", tier:"near",
    angleDeg: 195, rScaleX: 0.9, rScaleY: 0.9,
    z: -70, rotX:  10, rotY:  15, rotZ: -4,
    ampX:0, ampY:0, ampZ:0, sp:0, ph:0, rdrift:0,
    src: "/assets/Actionable Insights.webp" },

  // ── FAR orbit  ·  outer images placed further out ──
  { id:"hyrox",
    label:"HYROX Training",          w:1651, h:953, size:"lg", tier:"far",
    angleDeg:  15, rScaleX: 1.15, rScaleY: 1.15,
    z:  80, rotX: -5, rotY: -20, rotZ:  4,
    ampX:0, ampY:0, ampZ:0, sp:0, ph:0, rdrift:0,
    src: "/assets/HYROX Training.webp" },

  { id:"supplements",
    label:"Customised Supplements",    w:1086, h:1448, size:"md", tier:"far",
    angleDeg: 135, rScaleX: 1.15, rScaleY: 1.15,
    z:  80, rotX: -15, rotY:  10, rotZ: -2,
    ampX:0, ampY:0, ampZ:0, sp:0, ph:0, rdrift:0,
    src: "/assets/Customised Supplements.webp" },

  { id:"retreat",
    label:"Longevity Retreat",        w:1254, h:1254, size:"md", tier:"far",
    angleDeg: 255, rScaleX: 1.15, rScaleY: 1.15,
    z:  80, rotX:  15, rotY:   0, rotZ:  0,
    ampX:0, ampY:0, ampZ:0, sp:0, ph:0, rdrift:0,
    src: "/assets/Longevity Retreat.webp" },
];

const DRIFT_RATE = 0.010;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function makePlaceholder(w: number, h: number, label: string): string {
  const minD = Math.min(w, h);
  const dimFs = Math.round(minD * 0.13);
  const labFs = Math.round(minD * 0.068);
  const rx = Math.round(minD * 0.05);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs>` +
      `<linearGradient id="g${label}" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">` +
        `<stop offset="0" stop-color="#F4EFFF"/><stop offset="0.5" stop-color="#E4D6FF"/><stop offset="1" stop-color="#C6AEFF"/>` +
      `</linearGradient>` +
      `<radialGradient id="gl${label}" cx="0.3" cy="0.25" r="0.85">` +
        `<stop offset="0" stop-color="#ffffff" stop-opacity="0.82"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>` +
      `</radialGradient>` +
    `</defs>` +
    `<rect width="${w}" height="${h}" rx="${rx}" fill="url(#g${label})"/>` +
    `<rect width="${w}" height="${h}" rx="${rx}" fill="url(#gl${label})"/>` +
    `<rect x="${rx * 0.4}" y="${rx * 0.4}" width="${w - rx * 0.8}" height="${h - rx * 0.8}" rx="${rx * 0.8}" ` +
      `fill="none" stroke="#7C5CFF" stroke-opacity="0.30" stroke-width="${Math.max(2, minD * 0.005)}" ` +
      `stroke-dasharray="${minD * 0.048} ${minD * 0.032}"/>` +
    `<text x="50%" y="46%" text-anchor="middle" dominant-baseline="middle" ` +
      `font-family="Inter,system-ui,sans-serif" font-weight="700" font-size="${dimFs}" fill="#3A2A7A">${w} \u00D7 ${h}</text>` +
    `<text x="50%" y="46%" dy="${dimFs}" text-anchor="middle" dominant-baseline="middle" ` +
      `font-family="Inter,system-ui,sans-serif" font-weight="500" letter-spacing="2" font-size="${labFs}" ` +
      `fill="#6E4DF0" opacity="0.80">${label.toUpperCase()}</text>` +
    `</svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export default function EcosystemSection() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);
  const cardRefs  = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const stage  = stageRef.current;
    if (!wrap || !stage) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0, running = false, scrollProgress = 0;
    let io: IntersectionObserver | null = null;

    const L = {
      orbitRX: 0, orbitRY: 0,
      zNear: 1, zFar: 1,
      ampMul: 1,
      mobile: false,
      stageW: 0, stageH: 0,
      cardHW: [] as number[],
      cardHH: [] as number[],
    };

    const getCardDimensions = (i: number, sw: number, sh: number): { w: number; h: number } => {
      const c = CARDS[i];
      const mobile = sw < 768;
      const baseVal = Math.min(sw, sh);
      let width = 0;
      if (mobile) {
        if (c.size === "sm") width = Math.min(Math.max(120, baseVal * 0.28), 140);
        else if (c.size === "md") width = Math.min(Math.max(140, baseVal * 0.32), 160);
        else width = Math.min(Math.max(160, baseVal * 0.36), 180);
      } else {
        if (c.size === "sm") width = Math.min(Math.max(170, baseVal * 0.20), 220);
        else if (c.size === "md") width = Math.min(Math.max(200, baseVal * 0.23), 260);
        else width = Math.min(Math.max(240, baseVal * 0.26), 300);
      }
      const height = (width / (c.w / c.h)) + 28;
      return { w: width, h: height };
    };

    const measure = () => {
      const sw = stage.clientWidth, sh = stage.clientHeight;
      const mobile = sw < 768, tablet = sw >= 768 && sw < 1100;
      L.stageW = sw; L.stageH = sh;
      L.mobile = mobile;
      // Calculate responsive orbit radii relative to the smaller viewport dimension, slightly reduced to keep cards in frame.
      const base = Math.min(sw, sh);
      L.orbitRX = base * (mobile ? 0.38 : tablet ? 0.44 : 0.50);
      L.orbitRY = base * (mobile ? 0.18 : tablet ? 0.32 : 0.36);
      L.zNear   = mobile ? 0.26 : tablet ? 0.45 : 0.65;
      L.zFar    = mobile ? 0.16 : tablet ? 0.30 : 0.50;
      L.ampMul  = mobile ? 0.16 : 0.35;
      cardRefs.current.forEach((el, i) => {
        const dims = getCardDimensions(i, sw, sh);
        L.cardHW[i] = dims.w / 2;
        L.cardHH[i] = dims.h / 2;
        if (el) {
          el.style.width = `${dims.w}px`;
          el.style.height = `${dims.h}px`;
        }
      });
    };

    const targetPos = (i: number): { x: number; y: number } => {
      const c   = CARDS[i];
      const ang = RAD(c.angleDeg);
      const rx  = L.orbitRX * c.rScaleX;
      const ry  = L.orbitRY * c.rScaleY;
      let bx = Math.cos(ang) * rx;
      let by = Math.sin(ang) * ry;

      // push out if too close to headline
      const hbx = L.mobile ? Math.min(130, L.stageW * 0.33) : Math.min(230, L.stageW * 0.22);
      const hby = L.mobile ? 90 : 150;
      const minDist = Math.hypot(hbx + L.cardHW[i] + 22, hby + L.cardHH[i] + 22);
      const dist    = Math.hypot(bx, by);
      if (dist < minDist) {
        const s = minDist / dist;
        bx *= s; by *= s;
      }

      // clamp to stage to make sure it NEVER goes out of screen window!
      bx = clamp(bx, -(L.stageW / 2 - L.cardHW[i] - 14), L.stageW / 2 - L.cardHW[i] - 14);
      by = clamp(by, -(L.stageH / 2 - L.cardHH[i] - 14), L.stageH / 2 - L.cardHH[i] - 14);
      return { x: bx, y: by };
    };

    const applyTransform = (
      c: EcosystemCard, el: HTMLElement,
      x: number, y: number, z: number,
      exRotX: number, exRotZ: number, sc: number
    ) => {
      el.style.transform =
        `translate3d(-50%,-50%,0) ` +
        `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) ` +
        `rotateX(${(c.rotX + exRotX).toFixed(2)}deg) ` +
        `rotateY(${c.rotY.toFixed(2)}deg) ` +
        `rotateZ(${(c.rotZ + exRotZ).toFixed(2)}deg) ` +
        `scale(${sc.toFixed(3)})`;
    };

    const render = (now: number) => {
      const dispersion = 0.15 + 0.85 * easeOutCubic(clamp(scrollProgress / 0.85, 0, 1));

      for (let i = 0; i < CARDS.length; i++) {
        const c  = CARDS[i];
        const el = cardRefs.current[i];
        if (!el) continue;
        const p  = targetPos(i);

        const px = p.x;
        const py = p.y;

        const zMul = c.tier === "near" ? L.zNear : L.zFar;
        let x    = px * dispersion;
        let y    = py * dispersion;
        const z    = (c.z * zMul) * dispersion;

        // Clamp final computed x/y relative to center to ensure card is fully inside the stage
        const padX = 16;
        const padY = 16;
        const limitX = Math.max(0, L.stageW / 2 - L.cardHW[i] - padX);
        const limitY = Math.max(0, L.stageH / 2 - L.cardHH[i] - padY);
        x = clamp(x, -limitX, limitX);
        y = clamp(y, -limitY, limitY);

        const baseSc = c.tier === "near" ? 0.55 : 0.45;
        const sc     = baseSc + (1 - baseSc) * dispersion;

        applyTransform(c, el, x, y, z, 0, 0, sc);
        // Start opacity at 0 when scrollProgress is 0, fading in as dispersion starts
        const opacityVal = clamp(scrollProgress / 0.35, 0, 1);
        el.style.opacity = opacityVal.toFixed(3);
      }

      if (running) raf = requestAnimationFrame(render);
    };

    const renderStatic = () => {
      for (let i = 0; i < CARDS.length; i++) {
        const c   = CARDS[i];
        const el  = cardRefs.current[i];
        if (!el) continue;
        const p    = targetPos(i);
        const zMul = c.tier === "near" ? L.zNear : L.zFar;

        let x = p.x;
        let y = p.y;
        const padX = 16;
        const padY = 16;
        const limitX = Math.max(0, L.stageW / 2 - L.cardHW[i] - padX);
        const limitY = Math.max(0, L.stageH / 2 - L.cardHH[i] - padY);
        x = clamp(x, -limitX, limitX);
        y = clamp(y, -limitY, limitY);

        applyTransform(c, el, x, y, c.z * zMul, 0, 0, 1);
        el.style.opacity = "1";
      }
    };

    measure();

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        renderStatic();
      } else {
        ScrollTrigger.create({
          trigger: wrap,
          start: "top top",
          end: "+=100%",
          pin: stage,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          refreshPriority: 15,
          onUpdate: (self) => {
            scrollProgress = self.progress;
          },
        });

        io = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
              if (!running) {
                running = true;
                raf = requestAnimationFrame(render);
              }
            } else {
              // When leaving viewport, immediately cancel RAF and call renderStatic() so the field stays visible
              running = false;
              cancelAnimationFrame(raf);
              renderStatic();
            }
          },
          { threshold: 0.05 }
        );
        io.observe(stage);
      }
    }, wrap);

    const onResize = () => {
      measure();
      if (prefersReduced) renderStatic();
    };

    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section className="eco" aria-labelledby="eco-heading" ref={wrapRef}>
      <div className="eco__stage" ref={stageRef}>

        <div className="eco__field" aria-hidden="true">
          {CARDS.map((c, i) => (
            <figure
              key={c.id}
              className={`eco__card eco__card--${c.size} eco__card--${c.tier}`}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{ zIndex: 200 + Math.round(c.z) }}
            >
              <img
                className="eco__img"
                src={c.src ?? makePlaceholder(c.w, c.h, c.label)}
                alt=""
                loading="lazy"
                style={{ aspectRatio: `${c.w} / ${c.h}` }}
              />
              <figcaption className="eco__caption">{c.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="eco__center">
          <span className="eco__eyebrow">The PREDICT Ecosystem</span>
          <h2 className="eco__heading" id="eco-heading">
            Get exclusive access<br />to our ecosystem
          </h2>
          <p className="eco__sub">
            Everything your biology needs.<br />
            One platform. Personalised to you.
          </p>
        </div>

      </div>

      <ul className="eco__sr">
        {CARDS.map((c) => <li key={c.id}>{c.label}</li>)}
      </ul>
    </section>
  );
}
