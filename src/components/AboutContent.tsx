'use client';

import { useReveal } from "@/lib/useReveal";

const AboutContent = () => {
  const textRef = useReveal<HTMLDivElement>();
  const titleRef = useReveal<HTMLHeadingElement>();
  const contentRef = useReveal<HTMLDivElement>();

  return (
    <div className="about-section" id="about">
      <div className="about-container">
        <div className="about-text about-scroll-reveal" ref={textRef}>
          <h2 className="about-title about-title-reveal" ref={titleRef}>
            KNOW WHO <span>I'M</span>
          </h2>
          <div className="about-paragraphs about-content-reveal" ref={contentRef}>
            <p>
              Hi Everyone! I&apos;m <span className="highlight">Naheel Muhammed PK</span> from <span className="highlight">Kerala, India</span>.
            </p>
            <p>
              I&apos;m a <span className="highlight">Full Stack Developer (.NET + React)</span> with a Bachelor of Computer Applications
              and hands-on internship experience building RESTful APIs, JWT-authenticated backends,
              and responsive frontends.
            </p>
            <p>
              I&apos;m proficient in <span className="highlight">JavaScript, React, .NET, C#</span> and enjoy working across
              both frontend and backend stacks.
            </p>
            <p>
              Skilled in <span className="highlight">Clean Architecture, ASP.NET Core, Entity Framework, and SQL Server</span>.
              Passionate about building scalable, secure web applications for SaaS, startup, and
              e-commerce environments.
            </p>
            <p>
              Apart from coding, here are some other activities I love:
            </p>
            <ul className="activities-list">
              <li>🎮 Playing Games</li>
              <li>✍️ Writing Tech Blogs</li>
              <li>🚀 Exploring New Technologies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;
