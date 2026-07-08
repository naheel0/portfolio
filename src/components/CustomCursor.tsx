"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/*
 * Aurora Comet Cursor
 * ───────────────────
 * Three-layer depth system that mirrors the Midnight Aurora palette:
 *
 *   Layer 1 — Core dot (4px, instant tracking)
 *            Bright white-cyan center with pulsing soft glow.
 *
 *   Layer 2 — Inner ring (28px, snappy spring)
 *            Rotating conic-gradient aurora border (cyan → indigo).
 *            Expands + fills on interactive hover.
 *
 *   Layer 3 — Outer aura (56px, heavy spring lag)
 *            Soft blurred indigo glow ring, creates parallax depth
 *            against the faster inner ring.
 *
 *   Click — CSS-only expanding ripple (self-removing DOM node).
 *
 *   Section colors — smooth lerp between cyan/indigo/violet per section.
 *
 * Performance:
 *   • All visual animations are CSS-only (GPU composited).
 *   • Springs only drive position (3 springs, no per-frame JS).
 *   • Color lerp runs only on section change, then stops.
 *   • Click ripples auto-remove after CSS animation ends.
 *   • Touch devices: zero DOM rendered, zero listeners.
 */

// Aurora color per section (dot + gradient endpoints)
const SECTION_PALETTE: Record<string, { dot: string; mid: string; end: string }> = {
  home:     { dot: "#22d3ee", mid: "#818cf8", end: "#6366f1" },
  about:    { dot: "#67e8f9", mid: "#a5b4fc", end: "#818cf8" },
  skills:   { dot: "#818cf8", mid: "#6366f1", end: "#4f46e5" },
  projects: { dot: "#6366f1", mid: "#4f46e5", end: "#22d3ee" },
  contact:  { dot: "#a78bfa", mid: "#8b5cf6", end: "#22d3ee" },
};

const DEFAULT = SECTION_PALETTE.home;

function hexToRgb(hex: string): [number, number, number] {
  const h = parseInt(hex.replace("#", ""), 16);
  return [(h >> 16) & 0xff, (h >> 8) & 0xff, h & 0xff];
}

function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

export default function CustomCursor(): React.ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [visible, setVisible] = useState(false);

  const sectionRef = useRef("home");
  const colorRef = useRef({ dot: DEFAULT.dot, mid: DEFAULT.mid, end: DEFAULT.end });
  const targetRef = useRef({ ...DEFAULT });
  const rafRef = useRef<number | null>(null);

  // ── Motion values ──
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  // Layer 2: snappy follow
  const innerX = useSpring(mx, useMemo(() => ({ damping: 25, stiffness: 320, mass: 0.4 }), []));
  const innerY = useSpring(my, useMemo(() => ({ damping: 25, stiffness: 320, mass: 0.4 }), []));

  // Layer 3: heavy lag for parallax depth
  const outerX = useSpring(mx, useMemo(() => ({ damping: 35, stiffness: 120, mass: 0.8 }), []));
  const outerY = useSpring(my, useMemo(() => ({ damping: 35, stiffness: 120, mass: 0.8 }), []));

  // ── Color lerp (runs only when section changes, then self-stops) ──
  const lerpColors = useCallback(() => {
    if (rafRef.current != null) return;
    const step = () => {
      const c = colorRef.current;
      const t = targetRef.current;
      const spd = 0.08;
      c.dot = lerpHex(c.dot, t.dot, spd);
      c.mid = lerpHex(c.mid, t.mid, spd);
      c.end = lerpHex(c.end, t.end, spd);

      // Update DOM directly — no re-render
      const dotEl = document.getElementById("cursor-dot");
      if (dotEl) {
        dotEl.style.backgroundColor = c.dot;
        dotEl.style.boxShadow = `0 0 6px ${c.dot}, 0 0 18px ${c.mid}`;
      }
      const gradEl = document.getElementById("cursor-ring-gradient");
      if (gradEl) {
        gradEl.style.background = `conic-gradient(from 0deg, ${c.dot}, ${c.mid}, ${c.end}, ${c.dot})`;
      }
      const auraEl = document.getElementById("cursor-aura");
      if (auraEl) {
        auraEl.style.borderColor = c.mid;
        auraEl.style.boxShadow = `0 0 20px ${c.mid}, inset 0 0 12px ${c.dot}`;
      }

      // Check convergence — stop when close enough
      const [cr, cg, cb] = hexToRgb(c.dot);
      const [tr, tg, tb] = hexToRgb(t.dot);
      const diff = Math.abs(cr - tr) + Math.abs(cg - tg) + Math.abs(cb - tb);
      if (diff > 3) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        colorRef.current = { ...t };
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  // ── Click ripple (spawns a CSS-animated ring, auto-removes) ──
  const spawnRipple = useCallback((x: number, y: number) => {
    const el = document.createElement("div");
    el.className = "cursor-ripple";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    // Use current section color for the ripple
    const c = colorRef.current;
    el.style.borderColor = c.dot;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }, []);

  useEffect(() => {
    setMounted(true);

    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const sections = ["home", "about", "skills", "projects", "contact"];
    const detectSection = () => {
      const y = window.scrollY + window.innerHeight / 3;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y && el.offsetTop + el.offsetHeight > y) {
          if (sectionRef.current !== id) {
            sectionRef.current = id;
            const pal = SECTION_PALETTE[id] ?? DEFAULT;
            targetRef.current = { ...pal };
            lerpColors();
          }
          break;
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      setHovering(!!(
        t.closest("a") ||
        t.closest("button") ||
        t.closest("[role='button']") ||
        t.closest(".tech-badge") ||
        t.closest(".interactive-card") ||
        t.closest(".skill-pill") ||
        t.closest(".prj-card") ||
        t.closest(".pmd-btn") ||
        t.closest(".nav-item") ||
        window.getComputedStyle(t).cursor === "pointer"
      ));
    };

    const onDown = (e: MouseEvent) => {
      setPressing(true);
      spawnRipple(e.clientX, e.clientY);
    };
    const onUp = () => setPressing(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("scroll", detectSection, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    detectSection();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", detectSection);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [mx, my, visible, lerpColors, spawnRipple]);

  if (!mounted) return null;

  // Derived scales
  const dotS = pressing ? 0.4 : hovering ? 0 : 1;
  const innerS = pressing ? 0.9 : hovering ? 1.6 : 1;
  const outerS = pressing ? 0.95 : hovering ? 1.3 : 1;

  return (
    <>
      {/* ── Layer 1: Core dot ── */}
      <motion.div
        id="cursor-dot"
        className="cursor-dot"
        style={{
          x: mx, y: my,
          translateX: "-50%", translateY: "-50%",
          willChange: "transform",
        }}
        animate={{
          scale: dotS,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 520, damping: 25 }}
      />

      {/* ── Layer 2: Inner ring (rotating aurora gradient border) ── */}
      <motion.div
        className="cursor-ring"
        style={{
          x: innerX, y: innerY,
          translateX: "-50%", translateY: "-50%",
          willChange: "transform",
        }}
        animate={{
          scale: innerS,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
      >
        {/* Rotating gradient border */}
        <div
          id="cursor-ring-gradient"
          className="cursor-ring-border"
          style={{
            background: `conic-gradient(from 0deg, ${DEFAULT.dot}, ${DEFAULT.mid}, ${DEFAULT.end}, ${DEFAULT.dot})`,
          }}
        />
        {/* Inner mask (bg-colored circle creates the ring) */}
        <div className="cursor-ring-mask" />
        {/* Hover fill */}
        <motion.div
          className="cursor-ring-fill"
          animate={{
            opacity: hovering ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>

      {/* ── Layer 3: Outer aura (soft blurred glow, parallax lag) ── */}
      <motion.div
        id="cursor-aura"
        className="cursor-aura"
        style={{
          x: outerX, y: outerY,
          translateX: "-50%", translateY: "-50%",
          borderColor: DEFAULT.mid,
          boxShadow: `0 0 20px ${DEFAULT.mid}, inset 0 0 12px ${DEFAULT.dot}`,
          willChange: "transform",
        }}
        animate={{
          scale: outerS,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 140, damping: 30 }}
      />
    </>
  );
}