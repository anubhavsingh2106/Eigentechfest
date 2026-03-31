"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function EigenText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const originalPositionsRef = useRef<Map<number, { x: number; y: number }>>(
    new Map()
  );

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    originalX: number;
    originalY: number;
    life: number;
    char: string;
    charIndex: number;
  }

  // Character animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const word = "EIGEN";

  const handleMouseEnter = () => {
    setIsHovering(true);
    createParticles();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Create particle system for hover effect
  const createParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Create particles that scatter outward
    const particles: Particle[] = [];

    for (let i = 0; i < 60; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 2 + Math.random() * 4;
      const charIndex = Math.floor(Math.random() * word.length);

      particles.push({
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        originalX: centerX,
        originalY: centerY,
        life: 1,
        char: word[charIndex],
        charIndex,
      });
    }

    particlesRef.current = particles;
  };

  // Animate particles
  useEffect(() => {
    if (!isHovering) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      particlesRef.current = [];
      return;
    }

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply deceleration
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Move towards original position (attraction)
        const dx = p.originalX - p.x;
        const dy = p.originalY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
          p.vx += (dx / distance) * 0.1;
          p.vy += (dy / distance) * 0.1;
        } else {
          p.life = 0;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        // Draw particle
        if (p.life > 0) {
          ctx.save();
          ctx.globalAlpha = p.life * 0.8;
          ctx.font = "bold 48px system-ui";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
        }
      }

      // Remove dead particles
      particlesRef.current = particles.filter((p) => p.life > 0);

      // Continue animation if there are particles left
      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isHovering]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* SVG Filters for glow effect */}
      <svg width="0" height="0">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#80c0ff", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#ff80ff", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Canvas for particle effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />

      {/* Main Text */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex items-center justify-center"
      >
        {word.split("").map((char, index) => (
          <motion.div
            key={index}
            variants={charVariants}
            className="relative"
          >
            <div
              className="text-8xl md:text-9xl font-black tracking-tighter"
              style={{
                color: "#ffffff",
                textShadow: `
                  0 0 20px rgba(128, 192, 255, 0.6),
                  0 0 40px rgba(255, 128, 255, 0.3),
                  0 0 60px rgba(128, 192, 255, 0.2)
                `,
                fontFamily: '"Courier New", monospace',
                fontWeight: 900,
                letterSpacing: "-0.05em",
                filter: "url(#glow)",
              }}
            >
              {char}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
