"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

/*
 * Aurora Trail Cursor
 * ───────────────────
 * A theme-native cursor for the Midnight Aurora portfolio.
 * Instead of generic rings, it renders a soft streak of light that
 * stretches behind the pointer like a ribbon of aurora.
 *
 *   • Head   — 6px hot cyan pinpoint with a tight glow.
 *   • Trail  — a tapering, fading gradient ribbon (cyan → indigo →
 *              transparent) that rotates toward the direction of travel.
 *              Faster movement = longer, brighter streak.
 *   • Flare  — on interactive hover the head blooms into a soft halo.
 *   • Click  — a quick starburst flash (4 tiny rays) instead of a ring.
 *
 * Performance:
 *   • Zero framer-motion springs; pure rAF + transform/opacity.
 *   • Trail length is a single scaleX on one element (compositor-only).
 *   • No per-frame React state; everything via rAF + refs.
 *   • Touch devices: zero DOM rendered.
 */

const TRAIL_COUNT = 14;      // number of motion-blurred trail segments
const TRAIL_BASE_LEN = 46;   // resting length of the streak (px)
const TRAIL_MAX_LEN = 130;   // hard cap on stretch at high speed

export default function CustomCursor(): React.ReactElement | null {
  const [enabled, setEnabled] = useState(false);

  // Raw pointer position (ref, not state — no re-renders)
  const pos = useRef({ x: -100, y: -100 });
  // Interpolated head position (slight smoothing)
  const head = useRef({ x: -100, y: -100 });
  // Ring buffer of recent head positions for the trail
  const trailPts = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const raf = useRef<number | null>(null);
  const visible = useRef(false);
  const hovering = useRef(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const trailEls = useRef<(HTMLDivElement | null)[]>([]);
  const flareRef = useRef<HTMLDivElement | null>(null);

  const onMove = useCallback((e: MouseEvent) => {
    pos.current.x = e.clientX;
    pos.current.y = e.clientY;
    if (!visible.current) {
      visible.current = true;
      if (rootRef.current) rootRef.current.style.opacity = "1";
    }
  }, []);

  const onOver = useCallback((e: MouseEvent) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    const hit = !!(
      t.closest("a") ||
      t.closest("button") ||
      t.closest("[role='button']") ||
      t.closest(".skill-pill") ||
      t.closest(".prj-card") ||
      t.closest(".nav-item") ||
      t.closest(".resume-chip") ||
      window.getComputedStyle(t).cursor === "pointer"
    );
    if (hit !== hovering.current) {
      hovering.current = hit;
      if (flareRef.current) {
        flareRef.current.style.opacity = hit ? "1" : "0";
        flareRef.current.style.transform = `translate(-50%,-50%) scale(${hit ? 1 : 0.3})`;
      }
      if (headRef.current) {
        headRef.current.style.transform = `translate(-50%,-50%) scale(${hit ? 1.6 : 1})`;
      }
    }
  }, []);

  const onDown = useCallback(() => {
    if (!rootRef.current) return;
    const burst = document.createElement("div");
    burst.className = "aurora-burst";
    burst.style.left = `${pos.current.x}px`;
    burst.style.top = `${pos.current.y}px`;
    rootRef.current.appendChild(burst);
    burst.addEventListener("animationend", () => burst.remove());
  }, []);

  const onLeave = useCallback(() => {
    visible.current = false;
    if (rootRef.current) rootRef.current.style.opacity = "0";
  }, []);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    const tick = () => {
      // Smooth head toward pointer
      head.current.x += (pos.current.x - head.current.x) * 0.35;
      head.current.y += (pos.current.y - head.current.y) * 0.35;

      // Shift trail buffer (oldest at end, newest at front)
      const pts = trailPts.current;
      for (let i = pts.length - 1; i > 0; i--) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.4;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.4;
      }
      pts[0].x = head.current.x;
      pts[0].y = head.current.y;

      const hx = head.current.x;
      const hy = head.current.y;

      if (headRef.current) {
        headRef.current.style.left = `${hx}px`;
        headRef.current.style.top = `${hy}px`;
      }
      if (flareRef.current) {
        flareRef.current.style.left = `${hx}px`;
        flareRef.current.style.top = `${hy}px`;
      }

      // Lay out the trail segments — each is a small blurred dot,
      // positioned along the motion path, shrinking & fading with age.
      for (let i = 0; i < pts.length; i++) {
        const el = trailEls.current[i];
        if (!el) continue;
        const age = i / pts.length;              // 0 (head) → 1 (tail)
        const size = 7 * (1 - age) + 1.5;         // taper 7px → 1.5px
        const opacity = (1 - age) * 0.55;         // fade out
        el.style.transform = `translate(${pts[i].x}px, ${pts[i].y}px) translate(-50%,-50%)`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.opacity = String(opacity);
      }

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseleave", onLeave);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [enabled, onMove, onOver, onDown, onLeave]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="aurora-cursor-root" aria-hidden="true">
      {/* Trail segments (rendered first so they sit under the head) */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailEls.current[i] = el; }}
          className="aurora-trail-seg"
        />
      ))}

      {/* Hover halo */}
      <div ref={flareRef} className="aurora-flare" />

      {/* Head pinpoint */}
      <div ref={headRef} className="aurora-head" />
    </div>
  );
}
