'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * useRevealBatch — a single IntersectionObserver shared across multiple
 * elements. Instead of N observers (one per element), ONE observer watches
 * all registered elements and adds `visible` class when they enter viewport.
 *
 * Usage: call `register` with a ref callback for each element you want to reveal.
 */
const observerMap = new Map<Element, IntersectionObserver>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(threshold: number): IntersectionObserver {
  const key = `t${threshold}`;
  if (!sharedObserver || (sharedObserver as any)._key !== key) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            sharedObserver!.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );
    (sharedObserver as any)._key = key;
  }
  return sharedObserver;
}

export function useRevealBatch<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.3
) {
  const ref = useRef<T | null>(null);

  const setRef = useCallback((el: T | null) => {
    if (ref.current && sharedObserver) {
      sharedObserver.unobserve(ref.current);
    }
    ref.current = el;
    if (el) {
      const obs = getSharedObserver(threshold);
      obs.observe(el);
    }
  }, [threshold]);

  useEffect(() => {
    return () => {
      if (ref.current && sharedObserver) {
        sharedObserver.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return setRef;
}
