"use client";

import { useEffect, useRef } from "react";

/**
 * useReveal — a single IntersectionObserver that toggles the `visible` class
 * once the element enters the viewport, driving CSS scroll-reveal transitions.
 *
 * Share this instead of re-implementing IntersectionObserver in every section.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.3
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}