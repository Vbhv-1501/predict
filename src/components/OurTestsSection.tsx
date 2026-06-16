import React from "react";

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
  return (
    <section style={s.section}>
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
          aspect-ratio: 1122 / 1402;
          background: ${brand.off};
          width: clamp(130px, 15vw, 200px);
          left: clamp(36px, 8%, 120px);
          transform: translateY(-52%) rotate(-9deg);
        }
        .ot-img-2 {
          position: absolute;
          top: 50%;
          border-radius: 18px;
          overflow: hidden;
          aspect-ratio: 1122 / 1402;
          background: ${brand.off};
          width: clamp(120px, 14vw, 185px);
          right: clamp(36px, 8%, 120px);
          transform: translateY(-56%) rotate(8deg);
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
          .ot-image-zone { height: 55vw !important; min-height: 200px !important; max-height: 280px !important; }
          .ot-img-1 { width: 33vw !important; left: 4vw !important; transform: translateY(-50%) rotate(-7deg) !important; }
          .ot-img-2 { width: 29vw !important; right: 4vw !important; transform: translateY(-54%) rotate(6deg) !important; }
          .ot-copy-zone { height: auto !important; min-height: unset !important; max-height: unset !important; padding: 18px 20px 44px !important; }
          .ot-body { font-size: 15px !important; max-width: 100% !important; }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .ot-img-1 { width: 17vw !important; }
          .ot-img-2 { width: 15vw !important; }
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

/*
  USAGE
  ─────
  <OurTestsSection
    image1Src="/images/test-01.jpg"
    image1Alt="Blood biomarker analysis"
    image2Src="/images/test-02.jpg"
    image2Alt="Muscle imaging scan"
  />
*/
