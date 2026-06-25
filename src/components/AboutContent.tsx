'use client';

import { motion } from 'framer-motion';
import StarsBackground from './StarsBackground';
import { containerVariants, itemVariants, textVariants } from '@/lib/variants';

const AboutContent = () => {
  return (
    <div className="about-section" id="about">
      <StarsBackground />
      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="about-text" variants={textVariants}>
          <motion.h1 className="about-title" variants={itemVariants}>
            KNOW WHO <span>I'M</span>
          </motion.h1>
          <motion.div className="about-paragraphs" variants={itemVariants}>
            <p>
              Hi Everyone! I&apos;m <span className="highlight">Naheel Muhammed PK</span> from <span className="highlight">Kerala, India</span>.
            </p>
            <p>
              I am a passionate <span className="highlight">Full Stack Developer</span> with expertise in building scalable web applications using modern technologies.
            </p>
            <p>
              I&apos;m proficient in <span className="highlight">JavaScript, React, .NET, C#, and SQL Server</span>, and I enjoy working across both frontend and backend stacks.
            </p>
            <p>
              Apart from coding, here are some other activities I love:
            </p>
            <ul className="activities-list">
              <li>🎮 Playing Games</li>
              <li>✍️ Writing Tech Blogs</li>
              <li>🚀 Exploring New Technologies</li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div className="about-image" variants={itemVariants} whileHover={{ scale: 1.05 }}>
          <img src="/images/about.png" alt="About Me Illustration" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutContent;
