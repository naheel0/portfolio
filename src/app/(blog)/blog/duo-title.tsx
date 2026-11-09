"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface DuoTitleProps {
  children: string;
  className?: string;
  accentClass?: string;
}

/**
 * Renders a heading word-by-word and paints the trailing portion in the
 * accent colour:
 * - multi-line title -> the last LINE is accented
 * - single-line title -> the last HALF of words is accented
 *
 * Rendered server-side as plain inline spans (no hydration mismatch). On the
 * client, each word's line box is measured twice: once unaccented and once
 * with accents applied (colour can shift line breaks), then the accent set
 * is locked from the final measurement.
 */
export function DuoTitle({
  children,
  className,
  accentClass = "title-accent",
}: DuoTitleProps) {
  const words = String(children ?? "").trim().split(/\s+/).filter(Boolean);
  const [tops, setTops] = useState<Map<number, number>>(new Map());
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLSpanElement>(null);

  const measure = useCallback(() => {
    const map = new Map<number, number>();
    spansRef.current.forEach((el, i) => {
      if (el) map.set(i, Math.round(el.getBoundingClientRect().top));
    });
    setTops(map);
  }, []);

  useEffect(() => {
    const run = () => measure();
    document.fonts.ready.then(run).catch(run);
    run();
    if (containerRef.current) {
      const ro = new ResizeObserver(run);
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    }
    return undefined;
  }, [measure]);

  const accentIndices = useMemo(() => computeAccents(tops), [tops]);

  function computeAccents(m: Map<number, number>): Set<number> {
    if (m.size === 0 || words.length === 0) return new Set();
    const maxTop = Math.max(...[...m.values()]);
    const lastLine = [...m.entries()]
      .filter(([, t]) => t === maxTop)
      .map(([i]) => i);
    if (lastLine.length === words.length) {
      // single line: accent the last half
      const start = Math.ceil(words.length / 2);
      return new Set(words.map((_, i) => i).filter((i) => i >= start));
    }
    return new Set(lastLine);
  }

  return (
    <span className={className} ref={containerRef} style={{ display: "inline" }}>
      {words.map((word, i) => (
        <span
          key={i}
          ref={(el) => {
            spansRef.current[i] = el;
          }}
          style={{ display: "inline" }}
        >
          {accentIndices.has(i) ? (
            <span className={accentClass}>{word}</span>
          ) : (
            word
          )}
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
