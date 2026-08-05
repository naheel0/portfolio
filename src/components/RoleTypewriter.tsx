'use client';

import { useState, useEffect } from 'react';

interface RoleTypewriterProps {
  roles: string[];
}

export default function RoleTypewriter({ roles }: RoleTypewriterProps) {
  const list = roles.length > 0 ? roles : ["Full Stack Developer", ".NET Developer", "React Developer", "Web Developer"];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const current = list[roleIndex];
    const typeDuration = current.length * 80;
    const pauseDuration = 1800;
    const deleteDuration = current.length * 40;
    const totalCycle = typeDuration + pauseDuration + deleteDuration + 400;

    const timeout = setTimeout(() => {
      setRoleIndex((i) => (i + 1) % list.length);
    }, totalCycle);

    return () => clearTimeout(timeout);
  }, [roleIndex, list]);

  const current = list[roleIndex];
  const typeDuration = current.length * 80;
  const pauseDuration = 1800;
  const deleteDuration = current.length * 40;

  return (
    <h2 className="typewriter hero-fade-up" style={{ animationDelay: '0s' }}>
      <span
        className="typewriter-text"
        style={{
          '--type-chars': current.length,
          '--type-duration': `${typeDuration}ms`,
          '--pause-duration': `${pauseDuration}ms`,
          '--delete-duration': `${deleteDuration}ms`,
        } as React.CSSProperties}
        key={roleIndex}
      >
        {current}
      </span>
      <span className="cursor">|</span>
    </h2>
  );
}
