import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer-simple">
      <div className="footer-simple-content">
        <div className="footer-brand">
          <span className="footer-name">Naheel Muhammed PK</span>
          <span className="footer-tagline">Full Stack Developer · Kerala, India</span>
        </div>
        <div className="footer-simple-links">
          <a href="https://github.com/naheel0" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub aria-hidden="true" />
          </a>
          <a href="https://linkedin.com/in/naheel-muhammad-6b7077378" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin aria-hidden="true" />
          </a>
          <a href="mailto:naheelmuhammedpk@gmail.com" aria-label="Email">
            <FaEnvelope aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {currentYear} Naheel &nbsp;·&nbsp; Made with <FaHeart className="footer-heart" aria-hidden="true" /> using Next.js</span>
      </div>
    </footer>
  );
}
