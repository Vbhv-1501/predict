"use client";

import React from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        lerp: 0.08,
        syncTouch: false,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
