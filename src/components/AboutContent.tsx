'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { containerVariants, itemVariants, textVariants } from '@/lib/variants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me";

const AboutContent = () => {
  const [name, setName] = useState("Naheel Muhammed PK");
  const [bio, setBio] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/portfolio/settings`)
      .then(r => r.json())
      .then(s => {
        if (s.name) setName(s.name);
        if (s.bio) setBio(s.bio);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="about-section" id="about">
      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="about-text" variants={textVariants}>
          <motion.h2 className="about-title" variants={itemVariants}>
            KNOW WHO <span>I'M</span>
          </motion.h2>
          <motion.div className="about-paragraphs" variants={itemVariants}>
            {bio ? (
              bio.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))
            ) : (
              <>
                <p>
                  Hi Everyone! I&apos;m <span className="highlight">{name}</span> from <span className="highlight">Kerala, India</span>.
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
              </>
            )}
          </motion.div>
        </motion.div>

        <motion.div className="about-image" variants={itemVariants} whileHover={{ scale: 1.05 }}>
          <Image
            src="/images/about.png"
            alt="About Me Illustration"
            width={380}
            height={380}
            loading="lazy"
            sizes="(max-width: 992px) 280px, 380px"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutContent;
