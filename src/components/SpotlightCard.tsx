"use client";
import React, { useRef, useState, useCallback } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  glareColor?: string;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(120, 180, 255, 0.12)",
  glareColor = "#ffffff",
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [spotPos, setSpotPos] = useState({ x: 0, y: 0 });
  const [spotOpacity, setSpotOpacity] = useState(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      setSpotPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    setSpotOpacity(1);
    const el = glareRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.backgroundPosition = "-100% -100%, 0 0";
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = "100% 100%, 0 0";
  }, [transitionDuration]);

  const handleMouseLeave = useCallback(() => {
    setSpotOpacity(0);
    const el = glareRef.current;
    if (!el) return;
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = "-100% -100%, 0 0";
  }, [transitionDuration]);

  const hex = glareColor.replace("#", "");
  let rgba = glareColor;
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, 0.5)`;
  }

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={glareRef}
        className="spotlight-card-glare"
        style={{
          background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgba} 70%, hsla(0,0%,0%,0) 100%)`,
          backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
        }}
      />
      <div
        className="spotlight-card-spot"
        style={{
          opacity: spotOpacity,
          background: `radial-gradient(circle at ${spotPos.x}px ${spotPos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="spotlight-card-content">{children}</div>
    </div>
  );
}
