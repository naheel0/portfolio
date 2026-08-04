"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

/*
 * Aurora Trail Cursor — Optimized
 * ───────────────────────────────
 * Same visual result, fewer per-frame style writes:
 *
 *   • Idle pause: rAF loop stops after 150ms of no mouse movement
 *     and restarts on next mousemove. During PageSpeed (no input),
 *     the loop runs ~0 frames after initial mount → big TBT win.
 *
 *   • Trail segments: width/height/opacity are constant per index
 *     (only depend on age = i/count) → set once at mount, not per
 *     frame. Per-frame: only `transform` is written.
 *
 *   • Head + flare: CSS centering via negative margins, freeing
 *     `transform` for compositor-only positioning (was left/top
 *     which triggers layout).
 *
 *   • Click starburst: unchanged (CSS animation).
 */

const TRAIL_COUNT = 14;
const IDLE_TIMEOUT_MS = 150;

export default function CustomCursor(): React.ReactElement | null {
  const [enabled, setEnabled] = useState(false);

  const pos = useRef({ x: -100, y: -100 });
  const head = useRef({ x: -100, y: -100 });
  const trailPts = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const raf = useRef<number | null>(null);
  const visible = useRef(false);
  const hovering = useRef(false);
  const lastMoveTime = useRef(0);
  const isRunning = useRef(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const trailEls = useRef<(HTMLDivElement | null)[]>([]);
  const flareRef = useRef<HTMLDivElement | null>(null);

  const startLoop = useCallback(() => {
    if (isRunning.current) return;
    isRunning.current = true;

    const tick = () => {
      if (Date.now() - lastMoveTime.current > IDLE_TIMEOUT_MS) {
        isRunning.current = false;
        return;
      }

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

      // Head — transform = GPU-compositable (no layout)
      if (headRef.current) {
        headRef.current.style.transform = `translate(${hx}px, ${hy}px)`;
      }
      if (flareRef.current) {
        flareRef.current.style.transform = `translate(${hx}px, ${hy}px)`;
      }

      // Trail segments — only transform each frame, width/height/opacity set at mount
      for (let i = 0; i < pts.length; i++) {
        const el = trailEls.current[i];
        if (!el) continue;
        el.style.transform = `translate(${pts[i].x}px, ${pts[i].y}px)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
  }, []);

  const onMove = useCallback((e: MouseEvent) => {
    pos.current.x = e.clientX;
    pos.current.y = e.clientY;
    lastMoveTime.current = Date.now();
    if (!visible.current) {
      visible.current = true;
      if (rootRef.current) rootRef.current.style.opacity = "1";
    }
    if (!isRunning.current) startLoop();
  }, [startLoop]);

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
      t.closest(".resume-chip")
    );
    if (hit !== hovering.current) {
      hovering.current = hit;
      if (flareRef.current) {
        flareRef.current.classList.toggle("on-hover", hit);
      }
      if (headRef.current) {
        headRef.current.classList.toggle("on-hover", hit);
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

  // Set trail segment static styles once after mount
  useEffect(() => {
    if (!enabled) return;
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const el = trailEls.current[i];
      if (!el) continue;
      const age = i / TRAIL_COUNT;
      const size = 7 * (1 - age) + 1.5;      // taper 7px → 1.5px
      const opacity = (1 - age) * 0.55;       // fade out
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.opacity = String(opacity);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseleave", onLeave);
      if (raf.current != null) cancelAnimationFrame(raf.current);
      isRunning.current = false;
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
