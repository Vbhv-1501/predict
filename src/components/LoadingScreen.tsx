"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  onLoaded: (images: HTMLImageElement[]) => void;
}

export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let active = true;

    // Detect mobile or small screen devices
    const isMobile = typeof window !== "undefined" && 
      (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));

    if (isMobile) {
      // Simulate rapid progress on mobile to bypass downloading 50MB JSON
      let count = 0;
      const interval = setInterval(() => {
        count += 5;
        if (count > 100) count = 100;
        setProgress(count);

        if (count === 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (!active) return;
            setFadeOut(true);
            setTimeout(() => {
              if (!active) return;
              setVisible(false);
              onLoaded([]);
            }, 850);
          }, 400);
        }
      }, 20);

      return () => {
        active = false;
        clearInterval(interval);
      };
    }

    // Preload logo first
    const logoImg = new globalThis.Image();
    logoImg.src = "/assets/Predict-Logo.png";

    // Fetch the 30fps frames JSON
    fetch("/frames_30fps.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch frames JSON");
        }
        return res.json();
      })
      .then((data: string[]) => {
        if (!active) return;
        const total = data.length;
        const imagesArray: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 0; i < total; i++) {
          const img = new globalThis.Image();
          img.onload = () => {
            if (!active) return;
            loadedCount++;
            const pct = Math.floor((loadedCount / total) * 100);
            setProgress(pct);

            if (loadedCount === total) {
              setTimeout(() => {
                if (!active) return;
                setFadeOut(true);
                setTimeout(() => {
                  if (!active) return;
                  setVisible(false);
                  onLoaded(imagesArray);
                }, 850);
              }, 600);
            }
          };

          img.onerror = () => {
            if (!active) return;
            console.warn(`[LoadingScreen] failed to decode frame at index: ${i}`);
            loadedCount++;
            const pct = Math.floor((loadedCount / total) * 100);
            setProgress(pct);

            if (loadedCount === total) {
              setTimeout(() => {
                if (!active) return;
                setFadeOut(true);
                setTimeout(() => {
                  if (!active) return;
                  setVisible(false);
                  onLoaded(imagesArray);
                }, 850);
              }, 600);
            }
          };

          img.src = "data:image/jpeg;base64," + data[i];
          imagesArray.push(img);
        }
      })
      .catch((err) => {
        console.error("[LoadingScreen] Error loading frames:", err);
        // Safety fallback: allow the site to load even if the JSON fetch fails
        if (active) {
          setProgress(100);
          setTimeout(() => {
            if (!active) return;
            setFadeOut(true);
            setTimeout(() => {
              if (!active) return;
              setVisible(false);
              onLoaded([]);
            }, 850);
          }, 400);
        }
      });

    return () => {
      active = false;
    };
  }, [onLoaded]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center max-w-sm w-full px-8 gap-8">
        {/* PREDICT Centered Logo */}
        <div className="relative w-48 h-12 animate-pulse transition-all duration-1000">
          <Image
            src="/assets/Predict-Logo.png"
            alt="PREDICT Logo"
            fill
            className="object-contain glow-purple-soft"
            priority
          />
        </div>

        {/* Loading text with micro-animation */}
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-sm font-medium tracking-widest text-primary-500 uppercase animate-pulse">
            Loading Movement Intelligence...
          </p>

          {/* Progress Bar Container */}
          <div className="w-full h-[3px] bg-white/[0.07] rounded-full overflow-hidden relative">
            {/* Glowing purple progress line */}
            <div
              className="h-full bg-gradient-to-r from-accent via-primary-500 to-primary-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(80,79,237,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage display */}
          <span className="text-xs font-mono text-white/40 mt-1">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

