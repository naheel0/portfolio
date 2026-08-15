"use client";
import React, { useRef, useEffect } from "react";

interface GrainOverlayProps {
  patternAlpha?: number;
  patternRefreshInterval?: number;
}

export default function GrainOverlay({
  patternAlpha = 12,
  patternRefreshInterval = 2,
}: GrainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const size = 512;
    canvas.width = size;
    canvas.height = size;

    let frame = 0;
    let animId: number;

    const draw = () => {
      const img = ctx.createImageData(size, size);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = patternAlpha;
      }
      ctx.putImageData(img, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) draw();
      frame++;
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animId);
  }, [patternAlpha, patternRefreshInterval]);

  return (
    <canvas
      ref={canvasRef}
      className="grain-overlay"
      aria-hidden="true"
    />
  );
}
