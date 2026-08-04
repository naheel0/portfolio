"use client";

import { useRef, useCallback, useEffect } from "react";

/**
 * useSpringTo — a tiny rAF spring (mass/stiffness/damping) that reproduces
 * framer-motion's spring easing. Used for the project modal so its entrance
 * keeps the exact same springy feel without the framer-motion dependency.
 *
 * Tracks its own current value across target changes, so it can spring
 * 0 -> 1 (open) and 1 -> 0 (close) from wherever it currently is.
 */
export function useSpringTo(
  target: number,
  cb: (value: number) => void,
  opts?: { stiffness?: number; damping?: number; mass?: number; onComplete?: () => void }
) {
  const stiffness = opts?.stiffness ?? 260;
  const damping = opts?.damping ?? 26;
  const mass = opts?.mass ?? 0.8;

  const cbRef = useRef(cb);
  cbRef.current = cb;
  const doneRef = useRef(opts?.onComplete);
  doneRef.current = opts?.onComplete;

  const valueRef = useRef(0);
  const velocityRef = useRef(0);

  const reset = useCallback(() => {
    valueRef.current = 0;
    velocityRef.current = 0;
  }, []);

  const animate = useCallback(() => {
    let raf = 0;
    const start = performance.now();
    let value = valueRef.current;
    let velocity = velocityRef.current;
    let last = start;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const acc = (-stiffness * (value - target) - damping * velocity) / mass;
      velocity += acc * dt;
      value += velocity * dt;
      cbRef.current(value);
      const settled = Math.abs(target - value) < 0.0005 && Math.abs(velocity) < 0.0005;
      if (settled) {
        valueRef.current = target;
        velocityRef.current = 0;
        doneRef.current?.();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      valueRef.current = value;
      velocityRef.current = velocity;
    };
  }, [target, stiffness, damping, mass]);

  useEffect(() => {
    return animate();
  }, [animate]);

  return reset;
}