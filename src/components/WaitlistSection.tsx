"use client";

import React, { useRef } from "react";

export default function PredictMembership({ id }: { id?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rx = ((y / rect.height) - 0.5) * -18;
    const ry = ((x / rect.width) - 0.5) * 18;

    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
  };

  const resetTilt = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <>
      <section id={id} className="membership-section">
        <div className="left-card">
          <div className="corner-lines" />

          <div className="membership-card-wrap">
            <div className="glow" />

            <div
              ref={cardRef}
              className="membership-card"
              onMouseMove={handleMove}
              onMouseLeave={resetTilt}
            >
              <img src="/assets/Predict-member.webp" alt="Predict Membership" />
            </div>
          </div>

          <div className="membership-info">
            <button className="join-btn">Join Predict</button>
          </div>
        </div>

        <div className="right-content">
          <div>
            <h1>
              The Earlier You Know,
              <br />
              The More You Can Change.
            </h1>

            <div className="subtitle">Your invitation includes:</div>

            <ul>
              <li>Muscle Age™ & Leg Age™ Assessment</li>
              <li>Longevity Retreat Invitation (₹10,000 Value)</li>
              <li>Access to a premier gym for 30 days</li>
            </ul>
          </div>

          <div className="bottom-note">
            Available to a limited number of founding members.
          </div>
        </div>
      </section>

      <style jsx>{`
        .membership-section {
          max-width: 1440px;
          margin: auto;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 24px;
          background: #000000;
          padding: 60px 20px;
        }

        .left-card,
        .right-content {
          background: #0b0b0b;
          border-radius: 32px;
        }

        .left-card {
          position: relative;
          min-height: 700px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-direction: column;
          padding: 40px 30px;
        }

        .corner-lines {
          position: absolute;
          width: 650px;
          height: 650px;
          top: -340px;
          right: -340px;
          animation: rotateLines 30s linear infinite reverse;
        }

        .corner-lines::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: repeating-linear-gradient(
            90deg,
            transparent 0 10px,
            rgba(123, 97, 255, 0.45) 10px 11px
          );
          mask: radial-gradient(circle, transparent 0 52%, #000 52.5%);
        }

        .membership-card-wrap {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          perspective: 1200px;
          animation: floatCard 6s ease-in-out infinite;
        }

        .membership-card {
          --x: 50%;
          --y: 50%;
          width: min(90%, 420px);
          overflow: hidden;
          border-radius: 28px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.15s linear;
          box-shadow:
            0 20px 60px rgba(123,97,255,.35),
            0 0 100px rgba(123,97,255,.18);
        }

        .membership-card img {
          width: 100%;
          display: block;
          aspect-ratio: 1.58/1;
          object-fit: cover;
          transition: transform .5s ease;
        }

        .membership-card:hover img {
          transform: scale(1.08);
        }

        .membership-card::before {
          content: "";
          position: absolute;
          inset: -30%;
          background: radial-gradient(circle at var(--x) var(--y),
          rgba(255,255,255,.3), transparent 25%);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .membership-card::after {
          content: "";
          position: absolute;
          top: -150%;
          left: -60%;
          width: 40%;
          height: 400%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.4),
            transparent
          );
          transform: rotate(25deg);
          animation: shine 4.5s linear infinite;
        }

        .glow {
          position: absolute;
          inset: -25px;
          border-radius: 40px;
          background: radial-gradient(circle,
          rgba(123,97,255,.45), transparent 70%);
          filter: blur(25px);
          z-index: -1;
        }

        .membership-info {
          width: 100%;
          text-align: center;
          z-index: 5;
        }

        .join-btn {
          width: 100%;
          max-width: 450px;
          border: none;
          border-radius: 16px;
          padding: 18px;
          cursor: pointer;
          font-size: 17px;
          font-weight: 600;
          background: #8504fe;
          color: #ffffff;
          transition: background 0.3s ease;
        }

        .join-btn:hover {
          background: #6b04cc;
        }

        .right-content {
          padding: 70px 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        h1 {
          font-size: clamp(32px,4vw,58px);
          line-height: 1.08;
          margin-bottom: 45px;
          color: #ffffff;
          font-weight: 700;
        }

        .subtitle {
          font-size: clamp(22px,3vw,30px);
          margin-bottom: 32px;
          color: #e0e0e0;
          font-weight: 600;
        }

        li {
          line-height: 1.9;
          color: #d0d0d0;
          font-size: 16px;
          font-weight: 500;
        }

        .bottom-note {
          margin-top: 60px;
          opacity: 0.8;
          color: #b0b0b0;
          font-size: 14px;
        }

        @keyframes shine {
          to { left: 180%; }
        }

        @keyframes rotateLines {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes floatCard {
          50% { transform: translate(-50%, -54%); }
        }

        @media (max-width: 1024px) {
          .membership-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
