"use client";

import { useEffect } from "react";

/**
 * useStoryScroll — a dependency-free replacement for framer-motion's
 * `useScroll`/`useTransform` scroll-storytelling.
 *
 * It measures the tall container on scroll/resize (rAF-throttled, one layout
 * read per frame) and writes per-card opacity/transform + progress-bar/dot
 * styles DIRECTLY to the DOM via refs — zero React re-renders per frame.
 *
 * The math below is a 1:1 port of the previous framer-motion transforms so the
 * visual is identical (segments, direction offsets, snap-opacity, dot states).
 */

const DIRECTIONS = ["zoom", "left", "right", "up", "left"] as const;
type Dir = (typeof DIRECTIONS)[number];

/** Step-wise linear interpolation with clamp (mirrors framer's useTransform). */
function lerp(input: number, inputRange: number[], outputRange: number[]): number {
  const len = inputRange.length;
  if (input <= inputRange[0]) return outputRange[0];
  if (input >= inputRange[len - 1]) return outputRange[len - 1];
  for (let i = 0; i < len - 1; i++) {
    const a = inputRange[i];
    const b = inputRange[i + 1];
    if (input >= a && input <= b) {
      const t = (input - a) / (b - a);
      return outputRange[i] + (outputRange[i + 1] - outputRange[i]) * t;
    }
  }
  return outputRange[len - 1];
}

export interface StoryScrollOptions {
  count: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  cardRefs: React.RefObject<(HTMLElement | null)[]>;
  progressRef?: React.RefObject<HTMLDivElement | null>;
  dotRefs?: React.RefObject<(HTMLElement | null)[]>;
}

export function useStoryScroll({
  count,
  containerRef,
  cardRefs,
  progressRef,
  dotRefs,
}: StoryScrollOptions) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || count === 0) return;

    let raf: number | null = null;

    const apply = () => {
      raf = null;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = rect.height - vh;
      let p = scrollable > 0 ? -rect.top / scrollable : 1;
      p = Math.max(0, Math.min(1, p));

      const seg = 1 / count;

      // Top progress bar — transform-origin is 0% via CSS.
      if (progressRef?.current) {
        progressRef.current.style.transform = `scaleX(${p})`;
      }

      // Right-side chapter dots.
      if (dotRefs?.current) {
        dotRefs.current.forEach((el, i) => {
          if (!el) return;
          const segStart = i / count;
          const segEnd = (i + 1) / count;
          const pad = seg * 0.15;
          const range = [Math.max(0, segStart - pad), segStart, segEnd, Math.min(1, segEnd + pad)];
          const op = lerp(p, range, [0.25, 1, 1, 0.25]);
          const sc = lerp(p, range, [0.8, 1.4, 1.4, 0.8]);
          el.style.opacity = String(op);
          el.style.transform = `scale(${sc})`;
        });
      }

      // Story cards — active window only (±1 of current segment).
      const cards = cardRefs.current;
      const active = Math.min(count - 1, Math.floor(p * count));

      for (let index = 0; index < count; index++) {
        const el = cards[index];
        if (!el) continue;

        const inWindow = index >= active - 1 && index <= active + 1;

        if (!inWindow) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.opacity = "0";
            el.style.transform = "";
          }
          el.classList.remove("is-active");
          el.classList.add("is-hidden");
          el.style.pointerEvents = "none";
          continue;
        }

        if (el.style.visibility === "hidden") {
          el.style.visibility = "";
        }
        el.classList.remove("is-hidden");
        el.classList.add("is-active");
        el.style.pointerEvents = index === active ? "auto" : "none";

        const dir: Dir = DIRECTIONS[index % DIRECTIONS.length];
        const start = index * seg;
        const end = start + seg;

        const vis = lerp(p, [start - 0.001, start, end - 0.001, end], [0, 1, 1, 0]);
        const opacity = vis >= 0.5 ? 1 : 0;

        let xFrom = 0;
        let yFrom = 0;
        let scaleFrom = 1;
        if (dir === "left") xFrom = -80;
        else if (dir === "right") xFrom = 80;
        else if (dir === "up") yFrom = 60;
        else if (dir === "zoom") scaleFrom = 0.85;

        const transformEnd = Math.min(1, end + seg * 0.4);
        const tr = [start, start + seg * 0.25, end, transformEnd];
        const x = lerp(p, tr, [xFrom, 0, 0, -xFrom]);
        const y = lerp(p, tr, [yFrom, 0, 0, -yFrom]);
        const scale = lerp(p, tr, [scaleFrom, 1, 1, scaleFrom]);

        el.style.opacity = String(opacity);
        el.style.transform = `translateX(${x.toFixed(2)}px) translateY(${y.toFixed(2)}px) scale(${scale.toFixed(4)})`;
      }
    };

    const schedule = () => {
      if (raf == null) raf = requestAnimationFrame(apply);
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(schedule);
    } else {
      setTimeout(schedule, 0);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [count, containerRef, cardRefs, progressRef, dotRefs]);
}