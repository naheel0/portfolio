'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FaHouse, FaUser, FaCode, FaBriefcase, FaEnvelope, FaFileLines, FaFilePdf, FaChevronDown, FaNewspaper } from "react-icons/fa6";

const navItems = [
  { href: "#home",     icon: FaHouse,     section: "home",     label: "Home"     },
  { href: "#about",    icon: FaUser,      section: "about",    label: "About"    },
  { href: "#skills",   icon: FaCode,      section: "skills",   label: "Skills"   },
  { href: "/blog",     icon: FaNewspaper, section: "blog",    label: "Blog",     page: true },
  { href: "#projects", icon: FaBriefcase, section: "projects", label: "Work"     },
  { href: "#contact",  icon: FaEnvelope,  section: "contact",  label: "Contact"  },
] as const;

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const [pdfUrl, setPdfUrl] = useState("/Naheel.pdf");
  const [pdfName, setPdfName] = useState("Naheel-Muhammed-PK-Resume.pdf");
  const resumeRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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

  // Measure active pill position (CSS replaces framer-motion layoutId)
  useEffect(() => {
    if (isResumePage) return;

    const computePill = () => {
      const idx = navItems.findIndex(item => item.section === activeSection);
      const el = itemRefs.current[idx];
      const group = groupRef.current;
      if (el && group) {
        const groupRect = group.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setPillStyle({
          left: elRect.left - groupRect.left,
          width: elRect.width,
        });
      }
    };

    computePill();
    window.addEventListener("resize", computePill, { passive: true });
    return () => window.removeEventListener("resize", computePill);
  }, [activeSection, isResumePage]);

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

  useEffect(() => {
    fetch("/api/portfolio/resume")
      .then((r) => r.json())
      .then((data) => {
        if (data.pdfUrl) setPdfUrl(data.pdfUrl);
        if (data.pdfName) setPdfName(data.pdfName);
      })
      .catch(() => {});
  }, []);

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if ("page" in item && item.page) {
      router.push(item.href);
      return;
    }
    const href = item.href;
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    const el = document.getElementById(href.replace("#", ""));
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState("", "", href);
    }
  };

  return (
    <nav
      className="pill-navbar"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-section-group" ref={groupRef}>
        {!isResumePage && (
          <span
            className="nav-item-bg"
            style={{ left: pillStyle.left, width: pillStyle.width }}
          />
        )}
        {navItems.map((item, i) => {
          const isActive = !isResumePage && activeSection === item.section;
          const Icon = item.icon;
          return (
            <a
              key={item.section}
              ref={el => { itemRefs.current[i] = el; }}
              className={`nav-item ${isActive ? "active" : ""}`}
              href={item.href}
              aria-label={item.section}
              aria-current={isActive ? "page" : undefined}
              onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
            >
              <Icon aria-hidden="true" className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
            </a>
          );
        })}
      </div>

      <span className="nav-divider" aria-hidden="true" />

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

        <div className={`nav-resume-dropdown${resumeOpen ? " open" : ""}`}>
          <a href={pdfUrl} className="nav-resume-option">
            <FaFileLines aria-hidden="true" />
            <span>View Resume</span>
          </a>
          <a
            href={pdfUrl}
            download={pdfName}
            className="nav-resume-option"
          >
            <FaFilePdf aria-hidden="true" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
