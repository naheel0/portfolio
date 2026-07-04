'use client';

import { useEffect, useState, useMemo } from 'react';

interface Star {
  top: string;
  left: string;
  animationDuration: string;
  size: string;
  opacity: string;
}

const StarsBackground = () => {
  const [mounted, setMounted] = useState(false);

  const stars = useMemo(() => {
    return Array.from({ length: 80 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
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
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            animationDuration: star.animationDuration,
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
