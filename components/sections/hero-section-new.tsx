"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const word = "EIGEN";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      
      setScrollProgress(progress);
      
      // Pause video when scrolling starts
      if (videoRef.current) {
        if (progress > 0.05) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => {
            // Autoplay may be blocked
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!mounted) {
    return <section ref={sectionRef} className="relative bg-background min-h-[300vh]" />;
  }

  const textOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  
  const centerWidth = Math.max(100 - (imageProgress * 58), 42);
  const centerHeight = Math.max(100 - (imageProgress * 30), 70);
  const sideWidth = imageProgress * 22;
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100); 
  const sideTranslateRight = 100 - (imageProgress * 100);
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * 16;

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="sticky top-0 h-screen overflow-hidden bg-black/90">
        <div className="absolute inset-0 flex h-full w-full items-center justify-center" style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px` }}>
          
          {/* Left Column with Video */}
          {sideWidth > 0 && (
            <div 
              className="flex flex-col h-full"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%)`,
                opacity: sideOpacity,
              }}
            >
              <div 
                className="relative w-full flex-1 overflow-hidden"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                <video
                  ref={videoRef}
                  src="https://pixabay.com/videos/download/x-145577_medium.mp4"
                  className="h-full w-full object-cover"
                  muted
                  autoPlay
                  playsInline
                />
              </div>
              
              <div 
                className="relative w-full flex-1 overflow-hidden bg-gray-700"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1000"
                  alt="Camping under stars"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Center Main Image */}
          <div 
            className="relative overflow-hidden flex-shrink-0"
            style={{
              width: `${centerWidth}%`,
              height: `${centerHeight}%`,
              borderRadius: `${borderRadius}px`,
              minWidth: '200px',
              minHeight: '200px',
            }}
          >
            <Image
              src="/images/hero-main.png"
              alt="Hero main"
              fill
              className="object-cover"
              priority
            />
            
            {textOpacity > 0 && (
              <div 
                className="absolute inset-0 flex items-end p-4 overflow-hidden"
                style={{ opacity: textOpacity }}
              >
                <h1 className="text-6xl md:text-8xl lg:text-[22vw] font-medium leading-[0.8] tracking-tighter text-white">
                  {word.split("").map((letter, index) => (
                    <span
                      key={index}
                      className="inline-block"
                      style={{
                        animation: `slideUp 0.8s ease-out ${index * 0.08}s backwards`,
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>
            )}
          </div>

          {/* Right Column */}
          {sideWidth > 0 && (
            <div 
              className="flex flex-col h-full"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%)`,
                opacity: sideOpacity,
              }}
            >
              <div 
                className="relative w-full flex-1 overflow-hidden bg-gray-700"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1533873984035-25970ab07461?q=80&w=1000"
                  alt="Forest"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div 
                className="relative w-full flex-1 overflow-hidden bg-gray-700"
                style={{ borderRadius: `${borderRadius}px` }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=1000"
                  alt="Lake"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[200vh]" />

      <div className="px-6 pt-32 pb-28 md:pt-48 md:px-12 md:pb-36 lg:px-20 lg:pt-56 lg:pb-44">
        <p className="mx-auto max-w-2xl text-center text-2xl leading-relaxed text-muted-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          Innovate, Code
          <br />
          and Celebrate.
        </p>
      </div>
    </section>
  );
}
