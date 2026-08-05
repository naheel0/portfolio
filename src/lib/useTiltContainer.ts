'use client';

import { useRef, useCallback, useEffect } from 'react';

const MAX_TILT = 10;
const PERSPECTIVE = 900;

/**
 * useTiltContainer — event-delegation-based 3D tilt for a container.
 * Instead of N separate hooks (one per pill), ONE listener on the parent
 * handles all child tilt effects via event delegation.
 */
export function useTiltContainer<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const rafId = useRef<number | null>(null);
  const currentEl = useRef<HTMLElement | null>(null);
  const nextPos = useRef<{ x: number; y: number } | null>(null);

  const apply = useCallback(() => {
    rafId.current = null;
    const el = currentEl.current;
    const pos = nextPos.current;
    if (!el || !pos) return;

    const rect = el.getBoundingClientRect();
    const px = (pos.x - rect.left) / rect.width - 0.5;
    const py = (pos.y - rect.top) / rect.height - 0.5;
    const rotateY = px * MAX_TILT * 2;
    const rotateX = -py * MAX_TILT * 2;

    el.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    el.style.setProperty('--mx', `${((pos.x - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((pos.y - rect.top) / rect.height) * 100}%`);
  }, []);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const findPill = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof HTMLElement)) return null;
      return target.closest('.tilt-3d') as HTMLElement | null;
    };

    const onEnter = (e: PointerEvent) => {
      const pill = findPill(e.target);
      if (pill) {
        currentEl.current = pill;
        pill.classList.add('is-tilting');
      }
    };

    const onMove = (e: PointerEvent) => {
      nextPos.current = { x: e.clientX, y: e.clientY };
      if (rafId.current == null) {
        rafId.current = requestAnimationFrame(apply);
      }
    };

    const onLeave = (e: PointerEvent) => {
      const pill = findPill(e.target);
      if (pill) {
        pill.classList.remove('is-tilting');
        pill.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
      }
      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      currentEl.current = null;
      nextPos.current = null;
    };

    container.addEventListener('pointerenter', onEnter, true);
    container.addEventListener('pointermove', onMove, true);
    container.addEventListener('pointerleave', onLeave, true);

    return () => {
      container.removeEventListener('pointerenter', onEnter, true);
      container.removeEventListener('pointermove', onMove, true);
      container.removeEventListener('pointerleave', onLeave, true);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [apply]);

  return ref;
}
