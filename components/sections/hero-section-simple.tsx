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
      
      if (videoRef.current) {
        if (progress > 0.05) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(err => console.log("Play error:", err));
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return <section ref={sectionRef} className="min-h-[300vh]" />;

  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  const sideWidth = 25 + (imageProgress * 10);
  const sideOpacity = 0.8 + (imageProgress * 0.2);

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="sticky top-0 h-screen overflow-hidden bg-black/90">
        <div className="absolute inset-0 flex items-center justify-center gap-4 p-4">
          
          {/* Left - Video */}
          <div className="w-1/4 h-full flex flex-col gap-4">
            <div className="relative w-full flex-1 bg-black rounded-lg overflow-hidden border-2 border-green-500">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                autoPlay
                playsInline
                loop
                preload="metadata"
                onLoadedMetadata={() => console.log("Video loaded")}
                onError={(e) => console.error("Video error:", e)}
              >
                <source 
                  src="https://pixabay.com/videos/download/x-145577_medium.mp4" 
                  type="video/mp4" 
                />
              </video>
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                VIDEO
              </div>
            </div>
            
            <div className="relative w-full flex-1 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1000"
                alt="Camping"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Center - Main */}
          <div className="flex-1 h-4/5 relative rounded-lg overflow-hidden">
            <Image
              src="/images/hero-main.png"
              alt="Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/60">
              <h1 className="text-6xl md:text-8xl font-medium text-white leading-tight">
                {word}
              </h1>
            </div>
          </div>

          {/* Right - Images */}
          <div className="w-1/4 h-full flex flex-col gap-4">
            <div className="relative w-full flex-1 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1533873984035-25970ab07461?q=80&w=1000"
                alt="Forest"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="relative w-full flex-1 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=1000"
                alt="Lake"
                fill
                className="object-cover"
              />
            </div>
          </div>
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
