'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaFileArrowDown,
  FaArrowLeft,
  FaBriefcase,
  FaGraduationCap,
  FaFolderOpen,
  FaLayerGroup,
} from "react-icons/fa6";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 14 },
  },
};

const contactLinks = [
  { icon: FaEnvelope, label: "hello@naheel.me", href: "mailto:hello@naheel.me" },
  { icon: FaPhone, label: "+91 7306912910", href: "tel:+917306912910" },
  { icon: FaGithub, label: "github.com/naheel0", href: "https://github.com/naheel0" },
  { icon: FaLinkedin, label: "linkedin.com/in/naheel-muhammed", href: "https://www.linkedin.com/in/naheel-muhammed" },
  { icon: FaGlobe, label: "www.naheel.me", href: "https://www.naheel.me" },
];

const skillGroups = [
  { label: "Frontend", skills: ["React", "JavaScript (ES6)", "HTML5", "CSS3"] },
  { label: "Backend", skills: ["C#", "ASP.NET Core", "RESTful API", "JWT Authentication"] },
  { label: "Database & ORM", skills: ["SQL Server", "Entity Framework Core", "ADO.NET"] },
  { label: "Architecture & Patterns", skills: ["Clean Architecture", "Dependency Injection"] },
  { label: "Tools & DevOps", skills: ["Git", "GitHub", "Swagger / OpenAPI"] },
  { label: "Languages", skills: ["English", "Malayalam"] },
];

const experience = [
  {
    role: "Software Developer Intern",
    company: "Bridgeon Solutions",
    period: "Jul 2025 – Present",
    points: [
      "Developed production-ready RESTful APIs using ASP.NET Core and Clean Architecture, ensuring scalable and maintainable backend services.",
      "Implemented JWT-based authentication with refresh tokens and role-based access control to secure multiple backend services.",
      "Built responsive React frontend components with lazy loading and state management, improving user experience and interface performance.",
      "Designed normalized SQL Server schemas using Entity Framework Core and ADO.NET, ensuring efficient data access and referential integrity.",
      "Validated all API endpoints with Swagger and automated token authentication flows to guarantee reliability and security.",
      "Collaborated in an Agile team using Git/GitHub, actively participating in code reviews, sprint planning, and retrospectives.",
    ],
  },
];

const projects = [
  {
    name: "Gamehub – Full-Stack E-Commerce Website",
    githubUrl: "https://github.com/naheel0/GameHub-fullstack",
    points: [
      "Implemented secure JWT authentication (access & refresh tokens), middleware-based session validation, and role-based access control.",
      "Developed scalable backend services with ASP.NET Core following Clean Architecture and RESTful API design principles.",
      "Designed optimized relational database schemas in SQL Server using Entity Framework and ADO.NET for game listings, user profiles, carts, and orders.",
      "Integrated Razorpay payment gateway, handling payment callbacks, order confirmation, and transaction status updates.",
      "Built dynamic cart functionality (add, update, remove, clear) and order processing workflows with real-time total recalculations.",
      "Created a responsive frontend using React, HTML, CSS, and JavaScript with lazy loading and state management.",
      "Documented and tested all API endpoints using Swagger, ensuring reliability, security standards, and ease of integration.",
    ],
  },
];

const education = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    school: "MES KVM College, Valanchery – Calicut University, Kerala",
    period: "2022 – 2025",
    coursework:
      "Data Structures & Algorithms, Web Development, DBMS, OOP, Software Engineering, Computer Networks",
  },
];

function ResumeContent() {
  return (
    <div className="resume-page" id="resume">
      {/* Sticky action bar */}
      <div className="resume-actions no-print">
        <Link href="/" className="resume-action-btn resume-back-btn" aria-label="Back to portfolio">
          <FaArrowLeft aria-hidden="true" />
          <span>Back</span>
        </Link>
        <a
          href="/Naheel.pdf"
          download="Naheel-Muhammed-PK-Resume.pdf"
          className="resume-action-btn resume-download-btn"
          aria-label="Download Resume PDF"
        >
          <FaFileArrowDown aria-hidden="true" />
          <span>Download PDF</span>
        </a>
      </div>

      <motion.div
        className="resume-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ===== Header ===== */}
        <motion.header className="resume-header" variants={itemVariants}>
          <h1 className="resume-name">Naheel Muhammed PK</h1>
          <p className="resume-role">Full Stack Developer (.NET + React)</p>
          <div className="resume-contact-row">
            {contactLinks.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="resume-contact-item"
                >
                  <Icon aria-hidden="true" />
                  <span>{c.label}</span>
                </a>
              );
            })}
            <span className="resume-contact-item resume-contact-static">
              <FaLocationDot aria-hidden="true" />
              <span>Kerala, India</span>
            </span>
          </div>
        </motion.header>

        {/* ===== Summary ===== */}
        <motion.section className="resume-section-block" variants={itemVariants}>
          <h2 className="resume-heading">
            <FaLayerGroup aria-hidden="true" className="resume-heading-icon" />
            Professional Summary
          </h2>
          <p className="resume-text">
            Full Stack Developer (.NET + React) with a BCA and hands-on internship experience
            building RESTful APIs, JWT-authenticated backends, and responsive frontends. Skilled in
            Clean Architecture, ASP.NET Core, Entity Framework, and SQL Server. Passionate about
            building scalable, secure web applications for SaaS, startup, and e-commerce
            environments. Open to remote and onsite opportunities across India (based in Kerala).
          </p>
        </motion.section>

        {/* ===== Skills ===== */}
        <motion.section className="resume-section-block" variants={itemVariants}>
          <h2 className="resume-heading">
            <FaLayerGroup aria-hidden="true" className="resume-heading-icon" />
            Technical Skills
          </h2>
          <div className="resume-skill-groups">
            {skillGroups.map((group) => (
              <div key={group.label} className="resume-skill-group">
                <h3 className="resume-skill-group-label">{group.label}</h3>
                <div className="resume-skill-chips">
                  {group.skills.map((s) => (
                    <span key={s} className="resume-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ===== Experience ===== */}
        <motion.section className="resume-section-block" variants={itemVariants}>
          <h2 className="resume-heading">
            <FaBriefcase aria-hidden="true" className="resume-heading-icon" />
            Work Experience
          </h2>
          {experience.map((job) => (
            <article key={job.role} className="resume-entry">
              <div className="resume-entry-head">
                <div>
                  <h3 className="resume-entry-title">{job.role}</h3>
                  <p className="resume-entry-sub">{job.company}</p>
                </div>
                <span className="resume-entry-period">{job.period}</span>
              </div>
              <ul className="resume-list">
                {job.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </motion.section>

        {/* ===== Projects ===== */}
        <motion.section className="resume-section-block" variants={itemVariants}>
          <h2 className="resume-heading">
            <FaFolderOpen aria-hidden="true" className="resume-heading-icon" />
            Projects
          </h2>
          {projects.map((proj) => (
            <article key={proj.name} className="resume-entry">
              <div className="resume-entry-head">
                <h3 className="resume-entry-title">{proj.name}</h3>
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-entry-link no-print"
                  aria-label={`${proj.name} on GitHub`}
                >
                  <FaGithub aria-hidden="true" />
                </a>
              </div>
              <ul className="resume-list">
                {proj.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </motion.section>

        {/* ===== Education ===== */}
        <motion.section className="resume-section-block" variants={itemVariants}>
          <h2 className="resume-heading">
            <FaGraduationCap aria-hidden="true" className="resume-heading-icon" />
            Education
          </h2>
          {education.map((edu) => (
            <article key={edu.degree} className="resume-entry">
              <div className="resume-entry-head">
                <div>
                  <h3 className="resume-entry-title">{edu.degree}</h3>
                  <p className="resume-entry-sub">{edu.school}</p>
                </div>
                <span className="resume-entry-period">{edu.period}</span>
              </div>
              <p className="resume-text resume-coursework">
                <strong>Relevant Coursework:</strong> {edu.coursework}
              </p>
            </article>
          ))}
        </motion.section>

        {/* ===== Bottom download CTA ===== */}
        <motion.div className="resume-footer-cta no-print" variants={itemVariants}>
          <a
            href="/Naheel.pdf"
            download="Naheel-Muhammed-PK-Resume.pdf"
            className="resume-action-btn resume-download-btn resume-download-lg"
            aria-label="Download Resume PDF"
          >
            <FaFileArrowDown aria-hidden="true" />
            <span>Download PDF Version</span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ResumeContent;
