'use client';

import Image from 'next/image';
import { useReveal } from '@/lib/useReveal';

function IntroSection() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="home-intro visible">
      <div className="intro-text">
        <h2 className="intro-heading hero-fade-up">
          LET ME <span>INTRODUCE</span> MYSELF
        </h2>
        <p className="hero-fade-up" style={{ animationDelay: '0.15s' }}>
          Hi! I&apos;m Naheel, a passionate <span className="text-accent">Full Stack Developer (.NET + React)</span> with a Bachelor of Computer Applications
          and hands-on internship experience building RESTful APIs, JWT-authenticated backends, and responsive frontends.
        </p>
        <p className="hero-fade-up" style={{ animationDelay: '0.25s' }}>
          I&apos;m skilled in <span className="text-accent">Clean Architecture, ASP.NET Core, Entity Framework, and SQL Server</span>, and enjoy
          working across both frontend and backend stacks.
        </p>
        <p className="hero-fade-up" style={{ animationDelay: '0.35s' }}>
          My key areas of interest include <span className="text-accent">Web Applications, SaaS, and E-commerce solutions</span>.
          Passionate about building scalable, secure web applications. Open to both remote and onsite opportunities across India.
        </p>
        <p className="hero-fade-up" style={{ animationDelay: '0.45s' }}>
          Feel free to explore and reach out if you&apos;d like to collaborate!
        </p>
      </div>

      <div className="intro-avatar hero-fade-up" style={{ animationDelay: '0.2s' }}>
        <Image src="/avatar.svg" alt="Naheel Muhammed PK Avatar" width={320} height={320} loading="lazy" decoding="async" />
      </div>
    </div>
  );
}

export default IntroSection;
