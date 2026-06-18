"use client";

import React, { useState, useEffect, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import StoryCanvas from "@/components/StoryCanvas";
import VideoShowcase from "@/components/VideoShowcase";
import WhyMuscleSection from "@/components/WhyMuscleSection";
import OurTestsSection from "@/components/OurTestsSection";
import BiomechanicalSection from "@/components/BiomechanicalSection";
import EcosystemSection from "@/components/EcosystemSection";
import ProtocolSection from "@/components/ProtocolSection";
import DepthScrollSection from "@/components/DepthScrollSection";
import Sections from "@/components/Sections";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[]>([]);

  const handleLoaded = useCallback((images: HTMLImageElement[]) => {
    setPreloadedImages(images);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", refresh);

    const timer1 = setTimeout(refresh, 200);
    const timer2 = setTimeout(refresh, 800);
    const timer3 = setTimeout(refresh, 2000);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onLoaded={handleLoaded} />
      ) : (
        <SmoothScroll>
          {/* Global Lenis→ScrollTrigger sync (must be inside SmoothScroll) */}
          <LenisScrollTriggerSync />
          
          <Navbar />

          {/*
            IMPORTANT: main has no z-index, no overflow:hidden, no position:absolute.
            Each pinned section (StoryCanvas, DepthScrollSection)
            creates its own GSAP spacer via pinSpacing:true and stacks in normal flow.
          */}
          <main className="relative w-full bg-[#ffffff]">
            {/* Section 1: Cinematic frame-by-frame canvas (Hero) */}
            <div style={{ position: "relative", zIndex: 5 }}>
              <StoryCanvas preloadedImages={preloadedImages} />
            </div>

            {/* Section 2: Video Showcase / Flow elements */}
            <div className="post-hero-flow" style={{ position: "relative", zIndex: 10 }}>
              {/* Section 1.5: Why muscle - and why blood (horizontal scroll section) */}
              <div style={{ position: "relative", zIndex: 11 }}>
                <WhyMuscleSection />
              </div>

              {/* Section 2: Our Tests (Second screenshot) */}
              <div style={{ position: "relative", zIndex: 12 }}>
                <OurTestsSection
                  image1Src="/assets/test-01.webp"
                  image1Alt="Blood biomarker analysis test"
                  image2Src="/assets/test-02.webp"
                  image2Alt="Muscle imaging scan test"
                />
              </div>

              {/* Section 3: Video Showcase (Third screenshot: Your blood carries your true age) */}
              <div style={{ position: "relative", zIndex: 13 }}>
                <VideoShowcase />
              </div>

              {/* Section 4: Protocol (How it works timeline) */}
              <div style={{ position: "relative", zIndex: 14 }}>
                <ProtocolSection />
              </div>

              {/* Section 5: Biomechanical Live Stream (Benchmark Today. Breakthrough Tomorrow.) */}
              <div style={{ position: "relative", zIndex: 15 }}>
                <BiomechanicalSection />
              </div>

              {/* Section 6: Ecosystem Section */}
              <div style={{ position: "relative", zIndex: 16 }}>
                <EcosystemSection />
              </div>

              {/* Section 7: Chat storytelling */}
              <div style={{ position: "relative", zIndex: 17 }}>
                <DepthScrollSection />
              </div>

              {/* Sections 8–12 */}
              <div style={{ position: "relative", zIndex: 18 }}>
                <Sections />
              </div>
            </div>
          </main>
        </SmoothScroll>
      )}
    </>
  );
}
