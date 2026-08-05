'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  rootMargin?: string;
  placeholder?: ReactNode;
}

export default function LazySection({ children, rootMargin = '300px', placeholder }: LazySectionProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, visible]);

  return <div ref={ref}>{visible ? children : (placeholder ?? null)}</div>;
}
