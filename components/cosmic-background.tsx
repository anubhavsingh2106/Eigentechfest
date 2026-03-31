"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 20000));
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          life: 0,
          maxLife: Math.random() * 200 + 100,
        });
      }
    };
    initParticles();

    // Animation loop
    const animate = () => {
      // Clear with gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, "rgba(10, 5, 30, 1)");
      gradient.addColorStop(0.5, "rgba(15, 10, 40, 0.95)");
      gradient.addColorStop(1, "rgba(5, 5, 20, 1)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw glow ring (cosmic center)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 200;

      // Outer glow rings
      for (let i = 3; i >= 1; i--) {
        const ringGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius);
        ringGradient.addColorStop(0, `rgba(100, 200, 255, ${0.2 / i})`);
        ringGradient.addColorStop(0.4, `rgba(150, 100, 255, ${0.1 / i})`);
        ringGradient.addColorStop(1, "rgba(100, 200, 255, 0)");

        ctx.fillStyle = ringGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Subtle gravity towards center
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 50) {
          particle.vx += (dx / distance) * 0.0001;
          particle.vy += (dy / distance) * 0.0001;
        }

        // Wrap around edges
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Fade in/out effect
        const lifeRatio = particle.life / particle.maxLife;
        let alpha = particle.opacity;

        if (lifeRatio < 0.2) {
          alpha *= lifeRatio / 0.2;
        } else if (lifeRatio > 0.8) {
          alpha *= (1 - lifeRatio) / 0.2;
        }

        // Draw particle with glow
        ctx.shadowColor = `rgba(100, 200, 255, ${alpha})`;
        ctx.shadowBlur = particle.size * 2;

        ctx.fillStyle = `rgba(100, 200, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        // Respawn particle
        if (particle.life >= particle.maxLife) {
          particlesRef.current[index] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            life: 0,
            maxLife: Math.random() * 200 + 100,
          };
        }
      });

      // Draw center cosmic ring
      const time = Date.now() * 0.0005;
      const ringRadius = baseRadius + Math.sin(time) * 20;

      ctx.strokeStyle = "rgba(100, 200, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner pulsing ring
      const innerRadius = baseRadius * 0.6 + Math.sin(time * 1.5) * 15;
      ctx.strokeStyle = "rgba(150, 100, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Center glow
      const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 0.3);
      centerGradient.addColorStop(0, "rgba(100, 200, 255, 0.5)");
      centerGradient.addColorStop(1, "rgba(100, 200, 255, 0)");

      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
