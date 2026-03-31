"use client";

import { useEffect, useRef, useState } from "react";

const word = "EIGEN";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const heroHeight = window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / heroHeight));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!mounted) {
    return <section ref={sectionRef} className="relative w-full h-screen bg-black" />;
  }

  // Text fades and moves up on scroll
  const textOpacity = Math.max(0, 1 - scrollProgress * 2);
  const textTranslateY = scrollProgress * 100;

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Clean Dark Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Video Background Layer - Brighter */}
      <div className="absolute inset-0 opacity-80">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/145577-787059325_large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay Text - Simple Stroke Only */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        <div className="relative h-[300px] md:h-[400px] w-full max-w-4xl flex items-center justify-center">
          {/* EIGEN text with stroke outline only */}
          <div
            className="text-8xl md:text-9xl font-black text-transparent"
            style={{
              WebkitTextStroke: "2px rgba(255, 255, 255, 0.9)",
              letterSpacing: "-0.05em",
              fontFamily: '"Arial", sans-serif',
            }}
          >
            {word}
          </div>
        </div>
      </div>

      {/* Scroll spacing */}
      <div className="absolute top-full left-0 w-full h-[150vh]" />
    </section>
  );
}
