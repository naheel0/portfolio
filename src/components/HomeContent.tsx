'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
        </motion.div>

        <motion.div className="home-illustration" variants={imageVariants} whileHover="hover">
          <Image src="/images/home-main.svg" alt="Developer Illustration" width={420} height={420} priority />
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
            Hi! I&apos;m Naheel, a passionate web developer with a knack for
            creating stunning and functional websites. Welcome to my portfolio!
          </motion.p>
          <motion.p variants={itemVariants}>
            I&apos;m proficient in <span className="text-accent">JavaScript, React, .NET, C#</span> and enjoy
            working across both frontend and backend stacks.
          </motion.p>
          <motion.p variants={itemVariants}>
            My key areas of interest include <span className="text-accent">Web Applications</span> and building
            high-performance, scalable solutions.
          </motion.p>
          <motion.p variants={itemVariants}>
            Feel free to explore and reach out if you&apos;d like to collaborate!
          </motion.p>
        </motion.div>

        <motion.div className="intro-avatar" variants={imageVariants} whileHover="hover">
          <Image src="/avatar.svg" alt="Naheel Muhammed PK Avatar" width={320} height={320} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomeContent;
