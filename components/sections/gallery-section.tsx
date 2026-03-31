"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState("100vh");
  const [translateX, setTranslateX] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  const images = [
    { src: "/images/algorithmus.png", title: "ALGORITHMUS", alt: "Algorithmus Team" },
    { src: "/images/arc-robotics.png", title: "ARC ROBOTICS", alt: "Arc Robotics Team" },
    { src: "/images/gdsc.png", title: "GDSC", alt: "GDSC Team" },
    { src: "/images/iiit-kernel.png", title: "IIIT KERNEL", alt: "IIIT Kernel Team" },
    { src: "/images/cyper.png", title: "CYPER", alt: "Cyper Team" },
    { src: "/images/codebase.png", title: "CODEBASE", alt: "Codebase Team" },
  ];

  // Calculate section height based on content width
  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      // Height = viewport height + the extra scroll needed to reveal all content
      const totalHeight = viewportHeight + (containerWidth - viewportWidth);
      setSectionHeight(`${totalHeight}px`);
    };

    // Small delay to ensure container is rendered
    const timer = setTimeout(calculateHeight, 100);
    window.addEventListener("resize", calculateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  const updateTransform = useCallback(() => {
    if (!galleryRef.current || !containerRef.current) return;

    const rect = galleryRef.current.getBoundingClientRect();
    const containerWidth = containerRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;

    // Total scroll distance needed to reveal all images
    const totalScrollDistance = containerWidth - viewportWidth;

    // Current scroll position within this section
    const scrolled = Math.max(0, -rect.top);

    // Progress from 0 to 1
    const progress = Math.min(1, scrolled / totalScrollDistance);

    // Calculate new translateX
    const newTranslateX = progress * -totalScrollDistance;

    setTranslateX(newTranslateX);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(updateTransform);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransform();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransform]);

  return (
    <section
      id="gallery"
      ref={galleryRef}
      className="relative bg-background"
      style={{ height: sectionHeight }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full items-center">
          {/* Horizontal scrolling container */}
          <div
            ref={containerRef}
            className="flex gap-12 px-12"
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              WebkitTransform: `translate3d(${translateX}px, 0, 0)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitPerspective: 1000,
              touchAction: 'pan-y',
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative h-[60vh] w-[75vw] flex-shrink-0 overflow-hidden rounded-2xl md:w-[45vw] lg:w-[32vw]"
                style={{
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                }}
              >
                {/* Image Component */}
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  priority={index < 3}
                />

                {/* Dark Overlay for Text Legibility */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 opacity-60 group-hover:opacity-100" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                  <div className="transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white drop-shadow-2xl">
                      {image.title}
                    </h3>
                    <div className="mt-4 h-1 w-0 bg-white transition-all duration-500 group-hover:w-24" />
                  </div>
                </div>

                {/* Subtle Border/Glow on hover */}
                <div className="absolute inset-0 rounded-2xl border border-white/0 transition-colors duration-300 group-hover:border-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
