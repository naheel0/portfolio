"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: "vertical" | "horizontal";
  blur?: boolean;
  scale?: number;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 1,
  distance = 60,
  direction = "vertical",
  blur = true,
  scale = 1,
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === "horizontal" ? "x" : "y";
    const startPct = (1 - threshold) * 100;

    gsap.set(el, {
      [axis]: distance,
      scale,
      opacity: 0,
      filter: blur ? "blur(8px)" : "blur(0px)",
      willChange: "opacity, filter, transform",
    });

    const tl = gsap.timeline({ paused: true, delay });
    tl.to(el, {
      [axis]: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration,
      ease: "power3.out",
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: `top ${startPct}%`,
      once,
      onEnter: () => tl.play(),
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}
