'use client';

import { useState, useEffect } from 'react';

interface RoleTypewriterProps {
  roles: string[];
}

export default function RoleTypewriter({ roles }: RoleTypewriterProps) {
  const list = roles.length > 0 ? roles : ["Full Stack Developer", ".NET Developer", "React Developer", "Web Developer"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = list[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % list.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex, list]);

  return (
    <h2 className="typewriter hero-fade-up" style={{ animationDelay: '0s' }}>
      {displayed}<span className="cursor">|</span>
    </h2>
  );
}
