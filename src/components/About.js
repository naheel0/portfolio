import React from 'react';
import './About.css';
import aboutImg from "../image/about.png";
import StarsBackground from './StarsBackground';
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
const About = () => {
  return (
    <div className="about-section">
      <StarsBackground />
      <div className="about" id="about">
        <div className="about-me">
          <h2>ABOUT ME</h2>
          <p>I am a web developer with a passion for creating beautiful and functional websites. My journey in web development started a few years ago, and since then, I have honed my skills in various technologies.</p>
          <p>I enjoy working with both front-end and back-end technologies, and I am always eager to learn more and improve my skills.</p>
          <p>In my free time, I love exploring new frameworks, contributing to open-source projects, and staying updated with the latest trends in web development.</p>
        </div>
        <div className="about-image">
          <img src={aboutImg} alt="About Me" />
        </div>
      </div>
      <footer className="footer-simple">
                <div className="footer-simple-content">
                  <p>&copy; {new Date().getFullYear()} Naheel. Built with React.</p>
                  <div className="footer-simple-links">
                    <a
                      href="https://github.com/naheel0"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                    >
                      <FaGithub />
                    </a>
                    <a
                      href="https://linkedin.com/in/naheel-muhammad-6b7077378"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href="mailto:naheelmuhammedpk@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Email"
                    >
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </footer>
    </div>
  );
};

export default About;