"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor(): React.ReactElement | null {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const mouseX = useMotionValue<number>(-100);
  const mouseY = useMotionValue<number>(-100);

  // Smooth, snappy physics config that feels responsive yet fluid
  const springConfig = useMemo(() => ({ damping: 30, stiffness: 250, mass: 0.5 }), []);
  const trailingX = useSpring(mouseX, springConfig);
  const trailingY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    // Completely disable on touch devices to save resources and prevent visual bugs
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Matches anchors, buttons, your skillset badges, project cards, or custom pointer elements
      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest(".tech-badge") ||
        target.closest(".interactive-card") ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted) return null;

  return (
    <>
      {/* 1. Center Pinpoint Dot */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          backgroundColor: "#22d3ee", // Bright cyan core
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999999,
          boxShadow: "0 0 10px #22d3ee, 0 0 20px #6366f1",
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0.3 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
      />

      {/* 2. Outer Trailing Circle */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "36px",
          height: "36px",
          border: "1.5px solid rgba(34, 211, 238, 0.4)", // Translucent cyan border
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999998,
          x: trailingX,
          y: trailingY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.4 : 1,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0)",
          borderColor: isHovering ? "rgba(34, 211, 238, 1)" : "rgba(34, 211, 238, 0.4)",
          boxShadow: isHovering 
            ? "0 0 15px rgba(99, 102, 241, 0.6), inset 0 0 10px rgba(99, 102, 241, 0.3)" 
            : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
      />
    </>
  );
}