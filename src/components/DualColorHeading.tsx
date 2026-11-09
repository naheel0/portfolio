'use client';

import { useLayoutEffect, useRef, useState } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const LEVEL_TAGS: Record<HeadingLevel, HeadingTag> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

interface DualColorHeadingProps {
  children: string;
  className?: string;
  level?: HeadingLevel;
}

/**
 * Dual-color blog heading.
 *
 * Renders the heading text with the tail in red-orange (#e53927):
 * - Single line  -> last half of the text is red
 * - Multi-line   -> last line is red
 *
 * Measures rendered character boxes on the client (useLayoutEffect, before paint)
 * so there is no flash of un-split text. SSR renders plain text; the client
 * hydrates identically then upgrades to the split version. Blog headings only.
 */
export function DualColorHeading({
  children,
  className,
  level = 1,
}: DualColorHeadingProps) {
  const [tailStart, setTailStart] = useState<number | null>(null);
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    const el = ref.current;
    if (!el) return;

    const text = el.textContent ?? '';
    if (!text.trim()) return;

    const firstChild = el.firstChild;
    if (!firstChild || firstChild.nodeType !== Node.TEXT_NODE) return;

    const range = document.createRange();
    const charRects: Array<{ top: number; start: number }> = [];

    for (let i = 0; i < text.length; i++) {
      range.setStart(firstChild, i);
      range.setEnd(firstChild, i + 1);
      const rects = range.getClientRects();
      if (rects.length > 0) {
        charRects.push({ top: rects[0].top, start: i });
      }
    }

    if (charRects.length === 0) return;

    // Group character indices into lines by matching `top` within 1px.
    const lines: number[][] = [];
    let currentLine: number[] = [];
    let currentTop = charRects[0].top;

    for (const cr of charRects) {
      if (Math.abs(cr.top - currentTop) <= 1) {
        currentLine.push(cr.start);
      } else {
        lines.push(currentLine);
        currentLine = [cr.start];
        currentTop = cr.top;
      }
    }
    if (currentLine.length) lines.push(currentLine);

    const totalLen = text.length;
    let redStart: number;

    if (lines.length === 1) {
      // Single line: last half is red.
      redStart = Math.ceil(totalLen / 2);
    } else {
      // Multi-line: last line is red.
      redStart = lines[lines.length - 1][0];
    }

    // Only split when there is a meaningful head and tail.
    if (redStart > 0 && redStart < totalLen) {
      setTailStart(redStart);
    }
  }, [children]);

  const Tag = LEVEL_TAGS[level];

  const head = tailStart == null ? children : children.slice(0, tailStart);
  const tail = tailStart == null ? null : children.slice(tailStart);

  return (
    <Tag ref={ref} className={className}>
      {head}
      {tail != null && <span className="dual-color-tail">{tail}</span>}
    </Tag>
  );
}
