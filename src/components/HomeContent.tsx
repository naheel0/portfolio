'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaDownload, FaLinkedin, FaGithub } from 'react-icons/fa';
import StarsBackground from './StarsBackground';
import { containerVariants, itemVariants, textVariants, imageVariants } from '@/lib/variants';

const roles = ["Full Stack Developer", ".NET Developer", "React Developer", "Web Developer"];

const HomeContent = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  return (
    <div className="home-section" id="home">
      <StarsBackground />

      {/* Hero */}
      <motion.div
        className="home-hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="home-text" variants={textVariants}>
          <motion.h1 variants={itemVariants}>
            Hi There! <span className="wave">👋</span>
            <br />
            I&apos;M <span className="name-highlight">NAHEEL MUHAMMED PK</span>
          </motion.h1>
          <motion.h2 className="typewriter" variants={itemVariants}>
            {displayed}<span className="cursor">|</span>
          </motion.h2>

          <div className="home-buttons">
            <motion.a
              href="/Naheel.pdf"
              download="Naheel-Muhammed-PK-Resume.pdf"
              className="social-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download Resume"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="20" height="20"><path d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM200 248v92.7l34.3-34.3c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-64 64c-6.2 6.2-16.4 6.2-22.6 0l-64-64c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l34.3 34.3V248c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/naheel-muhammed"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="20" height="20"><path d="M100.3 448H7.4V148.9h92.9V448zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>
            </motion.a>
            <motion.a
              href="https://github.com/naheel0"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor" width="20" height="20"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
            </motion.a>
          </div>
        </motion.div>

        <motion.div className="home-illustration" variants={imageVariants} whileHover="hover">
          <Image src="/images/home-main.svg" alt="Developer Illustration" width={420} height={420} priority sizes="(max-width: 992px) 280px, 420px" />
        </motion.div>
      </motion.div>

      {/* Intro */}
      <motion.div
        className="home-intro"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="intro-text" variants={textVariants}>
          <motion.h2 variants={itemVariants} className="intro-heading">
            LET ME <span>INTRODUCE</span> MYSELF
          </motion.h2>
          <motion.p variants={itemVariants}>
            Hi! I&apos;m Naheel, a passionate <span className="text-accent">Full Stack Developer (.NET + React)</span> with a Bachelor of Computer Applications
            and hands-on internship experience building RESTful APIs, JWT-authenticated backends, and responsive frontends.
          </motion.p>
          <motion.p variants={itemVariants}>
            I&apos;m skilled in <span className="text-accent">Clean Architecture, ASP.NET Core, Entity Framework, and SQL Server</span>, and enjoy
            working across both frontend and backend stacks.
          </motion.p>
          <motion.p variants={itemVariants}>
            My key areas of interest include <span className="text-accent">Web Applications, SaaS, and E-commerce solutions</span>.
            Passionate about building scalable, secure web applications. Open to both remote and onsite opportunities across India.
          </motion.p>
          <motion.p variants={itemVariants}>
            Feel free to explore and reach out if you&apos;d like to collaborate!
          </motion.p>
        </motion.div>

        <motion.div className="intro-avatar" variants={imageVariants} whileHover="hover">
          <Image src="/avatar.svg" alt="Naheel Muhammed PK Avatar" width={320} height={320} sizes="(max-width: 992px) 280px, 320px" quality={60} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomeContent;