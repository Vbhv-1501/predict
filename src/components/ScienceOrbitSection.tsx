import React from "react";

export default function ScienceOrbitSection() {
  return (
    <section className="science-section">
      <div className="container">
        <div className="orbit-wrapper">
          <div className="orbit-system">
            <div className="orbit-item orbit-1">
              <div className="circle">
                <img src="/assets/nature-logo.svg" alt="Nature" />
              </div>
            </div>

            <div className="orbit-item orbit-2">
              <div className="circle">
                <img src="/assets/wiley-logo.svg" alt="Wiley" />
              </div>
            </div>

            <div className="orbit-item orbit-3">
              <div className="circle">
                <img src="/assets/aging-logo.svg" alt="Aging" />
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <h6>WHY TRUST THE SCIENCE</h6>

          <h2>20 years of R&amp;D.</h2>

          <p>
            Nobody built this faster. The Muscle, Orthos &amp; Leg Age Clock is
            not a wellness product. It is the clinical output of two decades of
            peer-reviewed research, biomarker discovery, and ageing science.
          </p>
        </div>
      </div>

      <style jsx>{`
        .science-section {
          height: 650px;
          background: #efefef;
          display: flex;
          align-items: center;
          padding: 0 7%;
          overflow: hidden;
        }

        .container {
          max-width: 1400px;
          width: 100%;
          margin: auto;
          display: grid;
          grid-template-columns: 42% 58%;
          align-items: center;
        }

        .orbit-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 500px;
        }

        .orbit-system {
          position: relative;
          width: 340px;
          height: 340px;
          animation: orbitRotate 24s linear infinite;
        }

        .orbit-item {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120px;
          height: 120px;
          margin: -60px;
        }

        .orbit-1 {
          transform: rotate(0deg) translateX(140px);
        }

        .orbit-2 {
          transform: rotate(120deg) translateX(140px);
        }

        .orbit-3 {
          transform: rotate(240deg) translateX(140px);
        }

        .circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: counterRotate 24s linear infinite;
        }

        .circle img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .circle span {
          font-size: 38px;
          font-weight: 700;
          color: #6e3bff;
        }

        .content h6 {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 4px;
          color: #6e3bff;
          margin-bottom: 20px;
        }

        .content h2 {
          font-size: clamp(3.2rem, 5vw, 5.8rem);
          line-height: 1;
          font-weight: 700;
          color: #111;
          margin-bottom: 28px;
        }

        .content p {
          font-size: 1.18rem;
          line-height: 1.9;
          color: #666;
          max-width: 720px;
        }

        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes counterRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @media (max-width: 991px) {
          .science-section {
            height: auto;
            padding: 90px 24px;
          }

          .container {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .orbit-wrapper {
            height: 380px;
          }

          .orbit-system {
            width: 280px;
            height: 280px;
          }

          .orbit-item {
            width: 95px;
            height: 95px;
            margin: -47.5px;
          }

          .orbit-1 {
            transform: rotate(0deg) translateX(120px);
          }

          .orbit-2 {
            transform: rotate(120deg) translateX(120px);
          }

          .orbit-3 {
            transform: rotate(240deg) translateX(120px);
          }

          .circle {
            width: 95px;
            height: 95px;
          }

          .content {
            text-align: center;
          }

          .content p {
            margin: auto;
          }
        }
      `}</style>
    </section>
  );
}
