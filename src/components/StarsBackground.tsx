'use client';

import { useEffect, useState } from 'react';

interface Star {
  top: string;
  left: string;
  animationDuration: string;
}

const StarsBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 40 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);
  }, []);

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
          }}
        />
      ))}
    </div>
  );
};

export default StarsBackground;
