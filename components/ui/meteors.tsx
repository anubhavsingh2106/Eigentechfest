"use client";

import { useEffect, useRef } from "react";

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

export function Meteors({
  number = 20,
  minDelay = 0,
  maxDelay = 0.5,
  minDuration = 3,
  maxDuration = 8,
  angle = 25,
  className = "",
}: MeteorsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing meteors
    container.innerHTML = "";

    // Create meteors
    for (let i = 0; i < number; i++) {
      const meteor = document.createElement("div");
      meteor.className = "meteor";

      // Random horizontal position across viewport
      const randomX = Math.random() * 100;

      // Random delays and durations
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      const duration = Math.random() * (maxDuration - minDuration) + minDuration;

      meteor.style.cssText = `
        position: absolute;
        width: 2px;
        height: 100px;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
        left: ${randomX}%;
        top: -100px;
        filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));
        animation: meteor-fall ${duration}s linear ${delay}s infinite;
        transform: rotate(${angle}deg);
      `;

      container.appendChild(meteor);
    }
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle]);

  return (
    <>
      <style>{`
        @keyframes meteor-fall {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px));
            opacity: 0;
          }
        }

        .meteor {
          will-change: transform, opacity;
          pointer-events: none;
        }
      `}</style>
      <div
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden ${className}`}
      />
    </>
  );
}
