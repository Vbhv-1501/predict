import { useEffect, useRef } from "react";
import "./EcosystemSection.css";

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
  // ── NEAR orbit  ·  inner images closer to center, subtle negative z for depth ──
  { id:"training",
    label:"Training",       w:960,  h:640,  size:"sm", tier:"near",
    angleDeg: 340, rScaleX: 0.86, rScaleY: 0.86,
    z: -70, rotX:  8, rotY:  15, rotZ: -6,
    ampX:4, ampY:4, ampZ:6, sp:0.44, ph:0.0, rdrift:1.6,
    src: "/assets/Training.webp" },

  { id:"prescription",
    label:"Prescription",   w:800,  h:800,  size:"sm", tier:"near",
    angleDeg:  85, rScaleX: 0.86, rScaleY: 0.86,
    z: -82, rotX: -8, rotY: -12, rotZ:  5,
    ampX:4, ampY:4, ampZ:6, sp:0.50, ph:2.1, rdrift:-1.6,
    src: "/assets/Prescription.webp" },

  { id:"dexa",
    label:"DEXA Scan",      w:640,  h:960,  size:"sm", tier:"near",
    angleDeg: 205, rScaleX: 0.86, rScaleY: 0.86,
    z: -68, rotX:  6, rotY:  14, rotZ:  5,
    ampX:4, ampY:4, ampZ:6, sp:0.56, ph:3.9, rdrift:1.4,
    src: "/assets/DEXA Scan.webp" },

  // ── FAR orbit  ·  outer images placed closer but still lifted forward ──
  { id:"hyrox",
    label:"Hyrox",          w:1200, h:800,  size:"lg", tier:"far",
    angleDeg:  25, rScaleX: 1.08, rScaleY: 1.08,
    z:  105, rotX:  4, rotY: -18, rotZ:  8,
    ampX:5, ampY:5, ampZ:8, sp:0.38, ph:1.0, rdrift:-2.2,
    src: "/assets/Hyrox.webp" },

  { id:"supplements",
    label:"Supplements",    w:800,  h:1200, size:"md", tier:"far",
    angleDeg: 150, rScaleX: 1.08, rScaleY: 1.08,
    z:  100, rotX: -5, rotY:  20, rotZ:  6,
    ampX:5, ampY:5, ampZ:8, sp:0.43, ph:2.8, rdrift:2.0,
    src: "/assets/Supplements.webp" },

  { id:"retreat",
    label:"Retreat",        w:1200, h:800,  size:"md", tier:"far",
    angleDeg: 265, rScaleX: 1.08, rScaleY: 1.08,
    z:  100, rotX:  4, rotY: -16, rotZ: -5,
    ampX:5, ampY:5, ampZ:8, sp:0.41, ph:4.9, rdrift:1.8,
    src: "/assets/Retreat.webp" },
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
    const start = performance.now();

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
        if (c.size === "sm") width = Math.min(Math.max(75, baseVal * 0.18), 90);
        else if (c.size === "md") width = Math.min(Math.max(90, baseVal * 0.22), 105);
        else width = Math.min(Math.max(105, baseVal * 0.26), 120);
      } else {
        if (c.size === "sm") width = Math.min(Math.max(120, baseVal * 0.14), 180);
        else if (c.size === "md") width = Math.min(Math.max(140, baseVal * 0.16), 220);
        else width = Math.min(Math.max(160, baseVal * 0.18), 260);
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
      L.orbitRX = base * (mobile ? 0.20 : tablet ? 0.24 : 0.28);
      L.orbitRY = base * (mobile ? 0.14 : tablet ? 0.18 : 0.22);
      L.zNear   = mobile ? 0.26 : tablet ? 0.45 : 0.65;
      L.zFar    = mobile ? 0.16 : tablet ? 0.30 : 0.50;
      L.ampMul  = mobile ? 0.16 : 0.35;
      cardRefs.current.forEach((el, i) => {
        const dims = getCardDimensions(i, sw, sh);
        L.cardHW[i] = dims.w / 2;
        L.cardHH[i] = dims.h / 2;
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
      if (c.tier === "near" && dist < minDist) {
        const s = minDist / dist;
        bx *= s; by *= s;
      }

      // clamp to stage to make sure it NEVER goes out of screen window!
      bx = clamp(bx, -(L.stageW / 2 - L.cardHW[i] - 14), L.stageW / 2 - L.cardHW[i] - 14);
      by = clamp(by, -(L.stageH / 2 - L.cardHH[i] - 14), L.stageH / 2 - L.cardHH[i] - 14);
      return { x: bx, y: by };
    };

    const computeProgress = () => {
      const rect   = wrap.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      scrollProgress = travel <= 0 ? 0 : clamp(-rect.top / travel, 0, 1);
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
      const t          = (now - start) / 1000;
      const dispersion = 0.15 + 0.85 * easeOutCubic(clamp(scrollProgress / 0.85, 0, 1));
      const theta      = DRIFT_RATE * t * dispersion;
      const cosT = Math.cos(theta), sinT = Math.sin(theta);

      for (let i = 0; i < CARDS.length; i++) {
        const c  = CARDS[i];
        const el = cardRefs.current[i];
        if (!el) continue;
        const p  = targetPos(i);

        const px = p.x * cosT - p.y * sinT;
        const py = p.x * sinT + p.y * cosT;

        const fx  = Math.cos(t * c.sp * 0.8 + c.ph) * c.ampX * L.ampMul;
        const fy  = Math.sin(t * c.sp        + c.ph) * c.ampY * L.ampMul;
        const fz  = Math.sin(t * c.sp * 0.6  + c.ph) * c.ampZ * L.ampMul;
        const rdZ = Math.sin(t * 0.28 + c.ph) * c.rdrift;
        const rdX = Math.cos(t * 0.22 + c.ph) * (c.rdrift * 0.5);

        const zMul = c.tier === "near" ? L.zNear : L.zFar;
        let x    = (px + fx) * dispersion;
        let y    = (py + fy) * dispersion;
        const z    = (c.z * zMul + fz) * dispersion;

        // Clamp final computed x/y relative to center to ensure card is fully inside the stage
        const padX = 16;
        const padY = 16;
        const limitX = Math.max(0, L.stageW / 2 - L.cardHW[i] - padX);
        const limitY = Math.max(0, L.stageH / 2 - L.cardHH[i] - padY);
        x = clamp(x, -limitX, limitX);
        y = clamp(y, -limitY, limitY);

        const baseSc = c.tier === "near" ? 0.55 : 0.45;
        const sc     = baseSc + (1 - baseSc) * dispersion;

        applyTransform(c, el, x, y, z, rdX, rdZ, sc);
        el.style.opacity = (0.20 + 0.80 * clamp(dispersion * 1.5, 0, 1)).toFixed(3);
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

    const onScroll = () => computeProgress();
    const onResize = () => {
      measure();
      computeProgress();
      if (prefersReduced) renderStatic();
    };

    measure();
    computeProgress();

    let io: IntersectionObserver | null = null;
    const mobileView = window.innerWidth < 768;
    if (prefersReduced || mobileView) {
      renderStatic();
    } else {
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
