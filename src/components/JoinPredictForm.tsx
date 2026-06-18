"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * JoinPredictForm
 * Glassmorphism popup form for the Predict launch site.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <button onClick={() => setOpen(true)}>Join Predict</button>
 *   <JoinPredictForm open={open} onClose={() => setOpen(false)} />
 *
 * Font: Neue Montreal (self-hosted .woff2 — see the @font-face note below).
 * Palette: purple #7C3AED · black #0A0A0A · off-white #EFEFEF
 */

type FormState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
};

interface JoinPredictFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: FormState) => void;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  city: "",
  interest: "",
};

export default function JoinPredictForm({
  open,
  onClose,
  onSubmit,
}: JoinPredictFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = useCallback(() => {
    if (!form.name || !form.email || !form.phone) return;
    onSubmit?.(form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm(INITIAL);
      onClose();
    }, 1800);
  }, [form, onSubmit, onClose]);

  if (!open) return null;

  return (
    <div
      className="jp-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Join Predict"
    >
      <div className="jp-card" onClick={(e) => e.stopPropagation()}>
        <button className="jp-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {submitted ? (
          <div className="jp-success">
            <div className="jp-success-dot" />
            <h2 className="jp-title">You&rsquo;re in.</h2>
            <p className="jp-sub">We&rsquo;ll reach out soon.</p>
          </div>
        ) : (
          <>
            <header className="jp-head">
              <span className="jp-eyebrow">Early Access</span>
              <h2 className="jp-title">Join Predict</h2>
              <p className="jp-sub">
                Be first to know when we launch in India.
              </p>
            </header>

            <div className="jp-fields">
              <div className="jp-field">
                <label className="jp-label" htmlFor="jp-name">
                  Full name
                </label>
                <input
                  id="jp-name"
                  className="jp-input"
                  type="text"
                  placeholder="Vaibhav"
                  value={form.name}
                  onChange={update("name")}
                  autoComplete="name"
                />
              </div>

              <div className="jp-field">
                <label className="jp-label" htmlFor="jp-email">
                  Email
                </label>
                <input
                  id="jp-email"
                  className="jp-input"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={update("email")}
                  autoComplete="email"
                />
              </div>

              <div className="jp-field">
                <label className="jp-label" htmlFor="jp-phone">
                  Phone
                </label>
                <div className="jp-phone-wrap">
                  <span className="jp-prefix">+91</span>
                  <input
                    id="jp-phone"
                    className="jp-input jp-input--phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        phone: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="jp-row">
                <div className="jp-field">
                  <label className="jp-label" htmlFor="jp-city">
                    City
                  </label>
                  <input
                    id="jp-city"
                    className="jp-input"
                    type="text"
                    placeholder="Gurugram"
                    value={form.city}
                    onChange={update("city")}
                    autoComplete="address-level2"
                  />
                </div>

                <div className="jp-field">
                  <label className="jp-label" htmlFor="jp-interest">
                    Interest
                  </label>
                  <select
                    id="jp-interest"
                    className="jp-input jp-select"
                    value={form.interest}
                    onChange={update("interest")}
                  >
                    <option value="">Select</option>
                    <option value="athlete">Athlete</option>
                    <option value="coach">Coach / Trainer</option>
                    <option value="clinic">Clinic / Physio</option>
                    <option value="enthusiast">Fitness enthusiast</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="jp-submit" onClick={handleSubmit}>
              Get Early Access
            </button>

            <p className="jp-fineprint">
              By joining, you agree to receive updates from Predict.
            </p>
          </>
        )}
      </div>

      <style jsx global>{`
        @font-face {
          font-family: "Neue Montreal";
          src: url("/fonts/NeueMontreal-Regular.woff2") format("woff2");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        :root {
          --jp-purple: #7c3aed;
          --jp-purple-soft: #a78bfa;
          --jp-black: #0a0a0a;
          --jp-off: #efefef;
        }

        .jp-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(10, 10, 10, 0.55);
          backdrop-filter: blur(8px) saturate(120%);
          -webkit-backdrop-filter: blur(8px) saturate(120%);
          animation: jp-fade 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          font-family: "Neue Montreal", -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .jp-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          padding: 40px 36px 32px;
          border-radius: 28px;
          background: linear-gradient(
            155deg,
            rgba(239, 239, 239, 0.14),
            rgba(124, 58, 237, 0.08)
          );
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(239, 239, 239, 0.18);
          box-shadow: 0 24px 80px rgba(10, 10, 10, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.22);
          color: var(--jp-off);
          animation: jp-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .jp-close {
          position: absolute;
          top: 18px;
          right: 20px;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: rgba(239, 239, 239, 0.08);
          color: var(--jp-off);
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .jp-close:hover {
          background: rgba(124, 58, 237, 0.35);
          transform: rotate(90deg);
        }

        .jp-head {
          margin-bottom: 26px;
        }
        .jp-eyebrow {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--jp-purple-soft);
          margin-bottom: 10px;
        }
        .jp-title {
          font-size: 30px;
          font-weight: 400;
          line-height: 1.1;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }
        .jp-sub {
          font-size: 15px;
          margin: 0;
          color: rgba(239, 239, 239, 0.62);
        }

        .jp-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .jp-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .jp-field {
          display: flex;
          flex-direction: column;
        }
        .jp-label {
          font-size: 13px;
          margin-bottom: 7px;
          color: rgba(239, 239, 239, 0.7);
        }

        .jp-input {
          width: 100%;
          padding: 13px 15px;
          border-radius: 14px;
          background: rgba(10, 10, 10, 0.28);
          border: 1px solid rgba(239, 239, 239, 0.14);
          color: var(--jp-off);
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease,
            box-shadow 0.25s ease;
          box-sizing: border-box;
        }
        .jp-input::placeholder {
          color: rgba(239, 239, 239, 0.32);
        }
        .jp-input:focus {
          border-color: var(--jp-purple);
          background: rgba(10, 10, 10, 0.4);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.25);
        }

        .jp-select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23EFEFEF' fill-opacity='0.5' d='M6 8 0 0h12z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 15px center;
          padding-right: 38px;
        }
        .jp-select option {
          background: #1a1a1a;
          color: var(--jp-off);
        }

        .jp-phone-wrap {
          display: flex;
          align-items: stretch;
        }
        .jp-prefix {
          display: flex;
          align-items: center;
          padding: 0 14px;
          border-radius: 14px 0 0 14px;
          background: rgba(124, 58, 237, 0.18);
          border: 1px solid rgba(239, 239, 239, 0.14);
          border-right: none;
          font-size: 15px;
          color: var(--jp-off);
        }
        .jp-input--phone {
          border-radius: 0 14px 14px 0;
        }

        .jp-submit {
          width: 100%;
          margin-top: 26px;
          padding: 15px;
          border: none;
          border-radius: 999px;
          background: var(--jp-purple);
          color: #fff;
          font-size: 16px;
          font-family: inherit;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.25s ease,
            box-shadow 0.25s ease;
          box-shadow: 0 8px 28px rgba(124, 58, 237, 0.4);
        }
        .jp-submit:hover {
          background: #6d28d9;
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(124, 58, 237, 0.55);
        }
        .jp-submit:active {
          transform: translateY(0);
        }

        .jp-fineprint {
          margin: 16px 0 0;
          text-align: center;
          font-size: 12px;
          color: rgba(239, 239, 239, 0.4);
        }

        .jp-success {
          text-align: center;
          padding: 30px 0;
        }
        .jp-success-dot {
          width: 56px;
          height: 56px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: var(--jp-purple);
          box-shadow: 0 0 0 8px rgba(124, 58, 237, 0.18),
            0 8px 30px rgba(124, 58, 237, 0.45);
          animation: jp-scale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes jp-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes jp-pop {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes jp-scale {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @media (max-width: 480px) {
          .jp-card {
            padding: 34px 24px 26px;
            border-radius: 24px;
          }
          .jp-row {
            grid-template-columns: 1fr;
          }
          .jp-title {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  );
}
