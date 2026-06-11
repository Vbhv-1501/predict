"use client";

import React, { useState, useEffect, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import StoryCanvas from "@/components/StoryCanvas";
import VideoShowcase from "@/components/VideoShowcase";
import StoryCarousel from "@/components/StoryCarousel";
import DepthConverge from "@/components/DepthConverge";
import HappyClients from "@/components/HappyClients";
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

    // Give DOM time to settle, then sort + refresh all ScrollTriggers
    const timer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 200);

    return () => clearTimeout(timer);
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
            Each pinned section (StoryCanvas, DepthConverge, DepthScrollSection)
            creates its own GSAP spacer via pinSpacing:true and stacks in normal flow.
          */}
          <main className="relative w-full bg-[#F8F8F6]">
            {/* Section 1: Cinematic frame-by-frame canvas (Hero) */}
            <StoryCanvas preloadedImages={preloadedImages} />

            {/* Section 2: Video Showcase (Interactive Dashboard) — flows after StoryCanvas spacer */}
            <div className="post-hero-flow">
              <VideoShowcase />

            {/* Section 2.5: Storytelling Carousel (Interactive Cards) */}
              <StoryCarousel />

            {/* Section 3: DepthConverge — signal convergence animation */}
              <DepthConverge />

            {/* Section 4: Happy Clients */}
              <HappyClients />

            {/* Section 5: Chat storytelling */}
              <DepthScrollSection />

            {/* Sections 6–12 */}
              <Sections />
            </div>
          </main>
        </SmoothScroll>
      )}
    </>
  );
}
