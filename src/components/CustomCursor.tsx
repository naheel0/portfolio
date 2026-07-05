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
          backgroundColor: "#b57aff", // Bright violet core
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999999,
          boxShadow: "0 0 10px #b57aff, 0 0 20px #8a2be2",
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
          border: "1.5px solid rgba(181, 122, 255, 0.4)", // Translucent purple border
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
          backgroundColor: isHovering ? "rgba(138, 43, 226, 0.15)" : "rgba(138, 43, 226, 0)",
          borderColor: isHovering ? "rgba(181, 122, 255, 1)" : "rgba(181, 122, 255, 0.4)",
          boxShadow: isHovering 
            ? "0 0 15px rgba(138, 43, 226, 0.6), inset 0 0 10px rgba(138, 43, 226, 0.3)" 
            : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
      />
    </>
  );
}