"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 192;

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Store preloaded images
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);

  useEffect(() => {
    
    // Preload images efficiently
    const preloadImages = () => {
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        // Format index as 00001, 00002, etc. based on the actual files
        const indexStr = i.toString().padStart(5, '0');
        img.src = `/animation/sequence/${indexStr}.png`;
        imagesRef.current.push(img);
      }
    };
    preloadImages();

    const drawFrame = (index: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const img = imagesRef.current[index];
      
      if (canvas && ctx && img && img.complete) {
        // Calculate dimensions to emulate object-fit: cover
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let drawX = 0;
        let drawY = 0;

        if (imgRatio > canvasRatio) {
           drawWidth = canvas.height * imgRatio;
           drawX = (canvas.width - drawWidth) / 2;
        } else {
           drawHeight = canvas.width / imgRatio;
           drawY = (canvas.height - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current || !canvasRef.current || imagesRef.current.length === 0) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress relative to this pinned container
      const scrollableDistance = containerHeight - viewportHeight;
      const scrolled = -containerTop;

      let progress = 0;
      if (scrollableDistance > 0) {
        progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      }
      
      setScrollProgress(progress);

      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * FRAME_COUNT)
      );

      // Render via requestAnimationFrame for smooth performance
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    // Draw first frame as soon as it loads
    if (imagesRef.current[0]) {
      imagesRef.current[0].onload = () => drawFrame(0);
    }

    const resizeHandler = () => {
       if (canvasRef.current) {
          const dpr = window.devicePixelRatio || 1;
          canvasRef.current.width = window.innerWidth * dpr;
          canvasRef.current.height = window.innerHeight * dpr;
          drawFrame(Math.max(0, currentFrameRef.current));
       }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeHandler);
    
    // Initial Setup
    resizeHandler();
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[300vh] bg-black">
      {/* Sticky Player Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        
        {/* Canvas Element for 192 frames sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.8 }}
        />

        {/* Scroll Call to Action Indicator */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center z-10 transition-opacity duration-500 pointer-events-none"
          style={{ opacity: scrollProgress < 0.05 ? 0.7 : 0 }}
        >
          <span className="text-white/60 text-xs md:text-sm tracking-[0.3em] font-light uppercase">
            Scroll to explore
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent mt-4" />
        </div>
      </div>
    </section>
  );
}
