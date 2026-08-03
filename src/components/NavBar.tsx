'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaHouse, FaUser, FaCode, FaBriefcase, FaEnvelope, FaFileLines, FaFilePdf, FaChevronDown } from "react-icons/fa6";

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

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: "easeOut" as const } },
  exit:    { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.12, ease: "easeIn" as const } },
};

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!resumeOpen) return;
    const onClick = (e: MouseEvent) => {
      if (resumeRef.current && !resumeRef.current.contains(e.target as Node)) {
        setResumeOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick, { passive: true });
    return () => document.removeEventListener("mousedown", onClick);
  }, [resumeOpen]);

  const handleNavClick = (href: string) => {
    if (pathname !== "/") {
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

      {/* Resume: hover dropdown — View Page / Download PDF */}
      <div
        ref={resumeRef}
        className="nav-resume-wrapper"
        onMouseEnter={() => setResumeOpen(true)}
        onMouseLeave={() => setResumeOpen(false)}
      >
        <Link
          className={`nav-item nav-resume-btn ${isResumePage ? "resume-active" : ""}`}
          href="/resume"
          aria-label="Resume"
          aria-current={isResumePage ? "page" : undefined}
        >
          <FaFileLines aria-hidden="true" className="nav-item-icon" />
          <span className="nav-item-label">Resume</span>
          <FaChevronDown aria-hidden="true" className="nav-resume-chevron" />
        </Link>

        <AnimatePresence>
          {resumeOpen && (
            <motion.div
              className="nav-resume-dropdown"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <a href="/Naheel.pdf" className="nav-resume-option">
                <FaFileLines aria-hidden="true" />
                <span>View Resume</span>
              </a>
              <a
                href="/Naheel.pdf"
                download="Naheel-Muhammed-PK-Resume.pdf"
                className="nav-resume-option"
              >
                <FaFilePdf aria-hidden="true" />
                <span>Download PDF</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
