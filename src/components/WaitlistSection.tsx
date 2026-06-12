"use client";

import React, { useState } from "react";

export default function HeroSection({ id }: { id?: string }) {
  const [email, setEmail] = useState("");

  const handleJoin = () => {
    if (!email) return;
    // TODO: wire up waitlist submission
    console.log("Waitlist email:", email);
  };

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Playfair+Display:ital,wght@1,500&display=swap');

        .predict-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #000;
          padding: 60px 24px 80px;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          color: #EFEFEF;
        }

        /* Subtle top vignette only — bars carry the purple */
        .predict-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(109,40,217,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Vertical dark pillars */
        .predict-pillars {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          display: flex;
          align-items: flex-end;
          gap: 0;
          pointer-events: none;
          z-index: 1;
        }

        .predict-pillar {
          flex: 1;
          background: linear-gradient(to top,
            #352166 0%,
            #47307D 50%,
            transparent 100%
          );
          border-radius: 2px 2px 0 0;
          opacity: 0.8;
        }
        .predict-pillar:nth-child(1)  { height: 32vh; }
        .predict-pillar:nth-child(2)  { height: 42vh; }
        .predict-pillar:nth-child(3)  { height: 52vh; }
        .predict-pillar:nth-child(4)  { height: 61vh; }
        .predict-pillar:nth-child(5)  { height: 68vh; }
        .predict-pillar:nth-child(6)  { height: 73vh; }
        .predict-pillar:nth-child(7)  { height: 75vh; }
        .predict-pillar:nth-child(8)  { height: 73vh; }
        .predict-pillar:nth-child(9)  { height: 68vh; }
        .predict-pillar:nth-child(10) { height: 61vh; }
        .predict-pillar:nth-child(11) { height: 52vh; }
        .predict-pillar:nth-child(12) { height: 42vh; }
        .predict-pillar:nth-child(13) { height: 32vh; }

        /* Content wrapper */
        .predict-content {
          position: relative;
          z-index: 10;
          max-width: 700px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Badge */
        .predict-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(239,239,239,0.18);
          background: rgba(239,239,239,0.06);
          backdrop-filter: blur(6px);
          border-radius: 9999px;
          padding: 5px 16px;
          font-size: 12.5px;
          letter-spacing: 0.04em;
          color: rgba(239,239,239,0.75);
          margin-bottom: 28px;
        }
        .predict-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a855f7;
          box-shadow: 0 0 6px #a855f7;
          flex-shrink: 0;
        }

        /* Headlines */
        .predict-h1 {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #EFEFEF;
          margin: 0;
        }
        .predict-h1-italic {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(34px, 5.6vw, 60px);
          font-weight: 500;
          line-height: 1.15;
          color: #EFEFEF;
          margin: 4px 0 24px;
        }

        /* Subtext */
        .predict-sub {
          font-size: clamp(13.5px, 1.5vw, 15.5px);
          line-height: 1.7;
          color: rgba(239,239,239,0.52);
          max-width: 480px;
          margin-bottom: 36px;
        }

        /* Input row */
        .predict-input-row {
          display: flex;
          align-items: center;
          background: rgba(239,239,239,0.06);
          border: 1px solid rgba(239,239,239,0.14);
          border-radius: 9999px;
          padding: 5px 5px 5px 22px;
          gap: 8px;
          width: 100%;
          max-width: 440px;
        }

        .predict-email {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(239,239,239,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          min-width: 0;
        }
        .predict-email::placeholder { color: rgba(239,239,239,0.35); }

        .predict-cta {
          background: #EFEFEF;
          color: #000;
          border: none;
          border-radius: 9999px;
          padding: 10px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.15s;
        }
        .predict-cta:hover { background: #e9d5ff; transform: scale(1.02); }

        /* Hint */
        .predict-hint {
          margin-top: 16px;
          font-size: 12px;
          color: rgba(239,239,239,0.3);
          letter-spacing: 0.03em;
        }

        @media (max-width: 480px) {
          .predict-input-row { flex-direction: column; padding: 10px 14px; border-radius: 18px; }
          .predict-email { width: 100%; text-align: center; }
          .predict-cta { width: 100%; padding: 11px 0; }
        }
      `}</style>

      <section id={id} className="predict-hero">

        {/* Vertical dark pillars */}
        <div className="predict-pillars">
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
          <div className="predict-pillar" />
        </div>

        {/* Content */}
        <div className="predict-content">

          <span className="predict-badge">
            <span className="predict-badge-dot" />
            Now accepting early access
          </span>

          <h1 className="predict-h1">Know Your Mobility</h1>
          <p className="predict-h1-italic">Before It Changes</p>

          <p className="predict-sub">
            Predict evaluates how your lower limbs are aging by analyzing mobility,
            joints, muscles, bones and movement patterns—helping you identify future
            risks before they become limitations.
          </p>

          <div className="predict-input-row">
            <input
              className="predict-email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
            <button className="predict-cta" onClick={handleJoin}>
              Join Waitlist
            </button>
          </div>

          <p className="predict-hint">Be among the first to experience Predict.</p>

        </div>
      </section>
    </>
  );
}
