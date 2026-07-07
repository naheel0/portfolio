'use client';

/**
 * useTilt3D — performance-safe mouse-tracked 3D tilt hook.
 *
 * Performance strategy:
 *  - A single `pointermove` listener per card, removed on unmount.
 *  - Coalesced via `requestAnimationFrame` so we never run more than once/frame.
 *  - Reads `prefers-reduced-motion` once on mount and bails out entirely if set.
 *  - Only writes `transform` (compositor-only) + two CSS vars for the sheen —
 *    no layout thrash, no style recalc on parent.
 *  - `will-change: transform` is toggled via the `is-tilting` class ONLY while
 *    hovered, and removed on leave so the browser can reclaim the GPU layer.
 *  - max tilt is small (≤10°) so the perspective never feels nauseating.
 */

import { useRef, useCallback, useEffect } from 'react';

const MAX_TILT = 10;      // degrees
const PERSPECTIVE = 900;  // px — matches the CSS default

export function useTilt3D<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const rafId = useRef<number | null>(null);
  const nextPos = useRef<{ x: number; y: number } | null>(null);

  const apply = useCallback(() => {
    rafId.current = null;
    const el = ref.current;
    const pos = nextPos.current;
    if (!el || !pos) return;

    // Normalise pointer position to [-0.5, 0.5] around the card center.
    const rect = el.getBoundingClientRect();
    const px = (pos.x - rect.left) / rect.width - 0.5;
    const py = (pos.y - rect.top) / rect.height - 0.5;

    // Invert Y so the card tilts toward the cursor naturally.
    const rotateY = px * MAX_TILT * 2;
    const rotateX = -py * MAX_TILT * 2;

    el.style.transform =
      `perspective(${PERSPECTIVE}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

    // Drive the radial sheen via CSS vars (no JS layout work).
    el.style.setProperty('--mx', `${((pos.x - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((pos.y - rect.top) / rect.height) * 100}%`);
  }, []);

  const onMove = useCallback((e: PointerEvent) => {
    nextPos.current = { x: e.clientX, y: e.clientY };
    if (rafId.current == null) {
      rafId.current = requestAnimationFrame(apply);
    }
  }, [apply]);

  const onEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('is-tilting');
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove('is-tilting');
    // Cancel any pending frame.
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    nextPos.current = null;
    // Smoothly return to flat — the CSS transition handles the easing.
    el.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Honour reduced-motion: don't attach listeners at all.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [onEnter, onMove, onLeave]);

  return ref;
}
