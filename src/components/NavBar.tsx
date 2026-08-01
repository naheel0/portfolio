'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHouse, FaUser, FaCode, FaBriefcase, FaEnvelope, FaFileLines } from "react-icons/fa6";

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
  const router = useRouter();
  const pathname = usePathname();
  const isResumePage = pathname === "/resume";

  useEffect(() => {
    if (isResumePage) return;

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
  }, [isResumePage]);

  const handleNavClick = (href: string) => {
    if (pathname !== "/") {
      // Coming from another route (e.g. /resume) — navigate home with hash
      router.push(`/${href}`);
      return;
    }
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
          const isActive = !isResumePage && activeSection === item.section;
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

      {/* Resume: online page link (PDF download lives on the resume page) */}
      <Link
        className={`nav-item nav-resume-btn ${isResumePage ? "resume-active" : ""}`}
        href="/resume"
        aria-label="View Resume"
        aria-current={isResumePage ? "page" : undefined}
      >
        <FaFileLines aria-hidden="true" className="nav-item-icon" />
        <span className="nav-item-label">Resume</span>
      </Link>
    </motion.nav>
  );
};

export default Navbar;
