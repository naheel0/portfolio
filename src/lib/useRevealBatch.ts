'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * useRevealBatch — a single IntersectionObserver shared across multiple
 * elements. Instead of N observers (one per element), ONE observer watches
 * all registered elements and adds `visible` class when they enter viewport.
 *
 * Usage: call `register` with a ref callback for each element you want to reveal.
 */
const observerMap = new Map<string, IntersectionObserver>();

function getSharedObserver(threshold: number): IntersectionObserver {
  const key = `t${threshold}`;
  if (!observerMap.has(key)) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );
    observerMap.set(key, obs);
  }
  return observerMap.get(key)!;
}

export function useRevealBatch<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.3
) {
  const ref = useRef<T | null>(null);

  const setRef = useCallback((el: T | null) => {
    if (ref.current) {
      const oldKey = `t${threshold}`;
      const oldObs = observerMap.get(oldKey);
      if (oldObs) oldObs.unobserve(ref.current);
    }
    ref.current = el;
    if (el) {
      const obs = getSharedObserver(threshold);
      obs.observe(el);
    }
  }, [threshold]);

  useEffect(() => {
    return () => {
      if (ref.current) {
        const key = `t${threshold}`;
        const obs = observerMap.get(key);
        if (obs) obs.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return setRef;
}
