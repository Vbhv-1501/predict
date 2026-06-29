"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const brand = {
  mid:    "#47307D",
  base:   "#5E3D94",
  light:  "#8151B6",
  accent: "#8504FE",
  black:  "#000000",
  off:    "#EFEFEF",
} as const;

interface OurTestsSectionProps {
  image1Src?: string;
  image1Alt?: string;
  image2Src?: string;
  image2Alt?: string;
}

export default function OurTestsSection({
  image1Src,
  image1Alt = "Health test visual 1",
  image2Src,
  image2Alt = "Health test visual 2",
}: OurTestsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const card1 = section.querySelector(".ot-img-1") as HTMLElement;
    const card2 = section.querySelector(".ot-img-2") as HTMLElement;
    const zone = section.querySelector(".ot-image-zone") as HTMLElement;
    if (!card1 || !card2 || !zone) return;

    let ctx: gsap.Context | null = null;
    let resizeTimer: ReturnType<typeof setTimeout>;

    const setupAnimation = () => {
      if (ctx) {
        ctx.revert();
      }

      // Temporarily clear inline styles so we measure the natural CSS positions
      gsap.set([card1, card2], { clearProps: "all" });

      const rectZone = zone.getBoundingClientRect();
      const rectCard1 = card1.getBoundingClientRect();
      const rectCard2 = card2.getBoundingClientRect();

      // The horizontal center of the zone relative to card positions
      const zoneCenterX = rectZone.left + rectZone.width / 2;
      const card1CenterX = rectCard1.left + rectCard1.width / 2;
      const card2CenterX = rectCard2.left + rectCard2.width / 2;

      const offset1 = zoneCenterX - card1CenterX;
      const offset2 = zoneCenterX - card2CenterX;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            end: "center 45%",
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        });

        tl.fromTo(
          card1,
          {
            x: offset1,
            y: 80, // start lower for the "thrown up" effect
            yPercent: -50,
            rotation: 3,
            scale: 0.85,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            yPercent: -50,
            rotation: -7,
            scale: 1,
            opacity: 1,
            ease: "none",
          },
          0
        ).fromTo(
          card2,
          {
            x: offset2,
            y: 100, // start lower for the "thrown up" effect
            yPercent: -50,
            rotation: -3,
            scale: 0.85,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            yPercent: -50,
            rotation: 7,
            scale: 1,
            opacity: 1,
            ease: "none",
          },
          0
        );
      }, section);
    };

    // Run setup after a small delay to ensure DOM styling is fully resolved
    const initialTimer = setTimeout(() => {
      setupAnimation();
    }, 150);

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupAnimation();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      if (ctx) {
        ctx.revert();
      }
    };
  }, []);

  return (
    <section id="assessment" style={s.section} ref={sectionRef}>
      <style>{`
        .ot-image-zone {
          position: relative;
          width: 100%;
          height: 66.666vh;
          min-height: 360px;
          max-height: 580px;
        }
        .ot-img-1 {
          position: absolute;
          top: 50%;
          border-radius: 18px;
          overflow: hidden;
          aspect-ratio: 1402 / 1122;
          background: ${brand.off};
          width: clamp(240px, 28vw, 340px);
          left: clamp(40px, 5%, 90px);
          transform: translateY(-50%) rotate(-7deg);
        }
        .ot-img-2 {
          position: absolute;
          top: 50%;
          border-radius: 18px;
          overflow: hidden;
          aspect-ratio: 1402 / 1122;
          background: ${brand.off};
          width: clamp(220px, 26vw, 320px);
          right: clamp(40px, 5%, 90px);
          transform: translateY(-50%) rotate(7deg);
        }
        .ot-copy-zone {
          width: 100%;
          height: 33.333vh;
          min-height: 160px;
          max-height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 40px 36px;
          text-align: center;
        }
        .ot-body {
          font-size: clamp(15px, 1.55vw, 22px);
          font-weight: 300;
          line-height: 1.45;
          color: ${brand.black};
          max-width: 860px;
          width: 100%;
        }
        @media (max-width: 600px) {
          .ot-image-zone { height: 60vw !important; min-height: 260px !important; max-height: 380px !important; }
          .ot-img-1 { width: 46vw !important; left: 3vw !important; transform: translateY(-50%) rotate(-7deg) !important; aspect-ratio: 1402 / 1122 !important; }
          .ot-img-2 { width: 44vw !important; right: 3vw !important; transform: translateY(-50%) rotate(7deg) !important; aspect-ratio: 1402 / 1122 !important; }
          .ot-copy-zone { height: auto !important; min-height: unset !important; max-height: unset !important; padding: 18px 20px 44px !important; }
          .ot-body { font-size: 15px !important; max-width: 100% !important; }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .ot-image-zone { height: 56vw !important; min-height: 320px !important; max-height: 420px !important; }
          .ot-img-1 { width: 32vw !important; left: 4vw !important; }
          .ot-img-2 { width: 30vw !important; right: 4vw !important; }
          .ot-body  { font-size: clamp(15px, 2vw, 19px) !important; max-width: 680px !important; }
        }
      `}</style>

      {/* TOP 2/3 — images */}
      <div className="ot-image-zone">
        <div style={s.halo} aria-hidden="true" />

        <div className="ot-img-1">
          {image1Src
            ? <img src={image1Src} alt={image1Alt} style={s.img} />
            : <Placeholder from={brand.mid} to={brand.accent} label="Image 01" />
          }
        </div>

        <div className="ot-img-2">
          {image2Src
            ? <img src={image2Src} alt={image2Alt} style={s.img} />
            : <Placeholder from={brand.base} to={brand.light} label="Image 02" />
          }
        </div>
      </div>

      {/* BOTTOM 1/3 — 3 lines total */}
      <div className="ot-copy-zone">
        <p style={s.eyebrow}>Our Tests</p>
        <p className="ot-body">
          Both tests read the same underlying system&nbsp;&mdash; muscle&nbsp;&mdash; through the only medium that sees everything: blood.
        </p>
      </div>
    </section>
  );
}

function Placeholder({ from, to, label }: { from: string; to: string; label: string }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "rgba(255,255,255,0.45)",
      fontSize: 10, fontWeight: 500,
      letterSpacing: "0.1em", textTransform: "uppercase",
    }}>
      {label}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: {
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "#ffffff",
    fontFamily: "'Neue Montreal', 'Inter', sans-serif",
  },
  halo: {
    position: "absolute",
    width: "50%",
    aspectRatio: "1" as unknown as number,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(133,4,254,0.06) 0%, transparent 68%)",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  img: {
    width: "100%", height: "100%",
    objectFit: "cover", display: "block",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#8504FE",
    marginBottom: 12,
  },
};
