'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHouse, FaUser, FaCode, FaBriefcase, FaEnvelope } from "react-icons/fa6";

const navItems = [
  { href: "#home",     icon: FaHouse,    section: "home"     },
  { href: "#about",    icon: FaUser,     section: "about"    },
  { href: "#skills",   icon: FaCode,     section: "skills"   },
  { href: "#projects", icon: FaBriefcase,section: "projects" },
  { href: "#contact",  icon: FaEnvelope, section: "contact"  },
] as const;

const navVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.section))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));

    const hash = window.location.hash;
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }

    return () => observer.disconnect();
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
      {navItems.map((item) => {
        const isActive = activeSection === item.section;
        const Icon = item.icon;
        return (
          <a
            key={item.section}
            className={`pill-nav-btn ${isActive ? "active" : ""}`}
            href={item.href}
            aria-label={item.section}
            aria-current={isActive ? "page" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
          >
            <Icon aria-hidden="true" />
            {isActive && (
              <motion.span
                className="pill-nav-indicator"
                layoutId="nav-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </a>
        );
      })}
    </motion.nav>
  );
};

export default Navbar;
