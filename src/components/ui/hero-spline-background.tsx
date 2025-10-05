"use client";

import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function HeroSplineBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <Suspense fallback={
        <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black" />
      }>
        <div className="relative w-full h-full">
          <Spline
            className="w-full h-full"
            scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
          />
          {/* Hide Spline watermark */}
          <style jsx global>{`
            #spline-watermark,
            .spline-watermark,
            canvas + div,
            a[href*="spline.design"] {
              display: none !important;
              opacity: 0 !important;
              visibility: hidden !important;
            }
          `}</style>
        </div>
      </Suspense>
      
      {/* Gradient overlay for better text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.7)),
            linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.8))
          `,
        }}
      />
    </div>
  );
}
