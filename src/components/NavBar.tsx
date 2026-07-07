'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHouse, FaUser, FaCode, FaBriefcase, FaEnvelope, FaFileArrowDown } from "react-icons/fa6";

const navItems = [
  { href: "#home",     icon: FaHouse,     section: "home",     label: "Home"     },
  { href: "#about",    icon: FaUser,      section: "about",    label: "About"    },
  { href: "#skills",   icon: FaCode,      section: "skills",   label: "Skills"   },
  { href: "#projects", icon: FaBriefcase, section: "projects", label: "Work"     },
  { href: "#contact",  icon: FaEnvelope,  section: "contact",  label: "Contact"  },
] as const;

const navVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      const sections = navItems
        .map((item) => document.getElementById(item.section))
        .filter(Boolean) as HTMLElement[];

      for (const section of sections) {
        if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const el = document.getElementById(href.replace("#", ""));
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", href);
    }
  };

  return (
    <motion.nav
      className="pill-navbar"
      variants={navVariants}
      initial="hidden"
      animate="visible"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Section nav group — icon + label buttons with sliding active pill */}
      <div className="nav-section-group">
        {navItems.map((item) => {
          const isActive = activeSection === item.section;
          const Icon = item.icon;
          return (
            <a
              key={item.section}
              className={`nav-item ${isActive ? "active" : ""}`}
              href={item.href}
              aria-label={item.section}
              aria-current={isActive ? "page" : undefined}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
            >
              {isActive && (
                <motion.span
                  className="nav-item-bg"
                  layoutId="nav-active-bg"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon aria-hidden="true" className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
            </a>
          );
        })}
      </div>

      {/* Vertical divider */}
      <span className="nav-divider" aria-hidden="true" />

      {/* Resume download button */}
      <a
        className="nav-item nav-resume-btn"
        href="/Naheel.pdf"
        download="Naheel-Muhammed-PK-Resume.pdf"
        aria-label="Download Resume"
      >
        <FaFileArrowDown aria-hidden="true" className="nav-item-icon" />
        <span className="nav-item-label">Resume</span>
      </a>
    </motion.nav>
  );
};

export default Navbar;
