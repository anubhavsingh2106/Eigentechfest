import { useEffect, useRef } from "react";

interface VideoTextProps {
  src: string;
  children: string;
  className?: string;
}

export function VideoText({ src, children, className = "" }: VideoTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth;
        canvas.height = containerRef.current.offsetHeight;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Draw text with video fill - clean single layer approach
    const draw = () => {
      // Clear canvas to transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fontSize = Math.min(canvas.width / 3, canvas.height / 2);
      ctx.font = `900 ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const x = canvas.width / 2;
      const y = canvas.height / 2;

      // Draw video as base layer
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Use the text as a mask - only keep video where text is
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "black";
      ctx.fillText(children, x, y);

      // Switch back to normal mode for stroke
      ctx.globalCompositeOperation = "source-over";

      // Draw white stroke around text for definition
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeText(children, x, y);

      requestAnimationFrame(draw);
    };

    // Play video
    video.play().catch(() => console.log("Video autoplay blocked"));

    draw();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [children]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        src={src}
        className="hidden"
        autoPlay
        muted
        loop
        playsInline
      />
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${className}`}
        style={{ display: "block" }}
      />
    </div>
  );
}
