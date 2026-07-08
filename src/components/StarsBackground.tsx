'use client';

import { useEffect, useState, useMemo } from 'react';

/**
 * StarsBackground — single shared instance mounted in RootLayout.
 * Covers the entire viewport with a fixed position so it appears
 * behind all sections without duplicating DOM nodes.
 */

const StarsBackground = () => {
  const [mounted, setMounted] = useState(false);

  const stars = useMemo(() => {
    // Reduced from 80 to 50 per instance — still visually dense enough
    // but with a single instance instead of 5, we go from 400→50 DOM nodes
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 3}s`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: `${Math.random() * 0.5 + 0.5}`,
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div id="stars-background" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
            position: 'absolute',
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
};

export default StarsBackground;