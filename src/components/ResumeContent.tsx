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
import type { ResumeData } from "@/lib/data";
import type { SiteSettings } from "@/lib/api";

// Entrance stagger — matches the previous on-load spring stagger.
const ENTRANCE_DURATION = "0.6s";
const ENTRANCE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const baseDelay = 0.1;
const stagger = 0.08;

function enter(i: number): React.CSSProperties {
  return {
    opacity: 0,
    animation: `resumeFadeUp ${ENTRANCE_DURATION} ${ENTRANCE_EASE} both`,
    animationDelay: `${(baseDelay + i * stagger).toFixed(2)}s`,
  };
}

function ResumeContent({ data, settings }: { data: ResumeData; settings: SiteSettings | null }) {
  const { pdfUrl, summary, skillGroups, experience, projects, education } = data;

  const displayName = settings?.name || "Naheel Muhammed PK";
  const displayRole = settings?.title || "Full Stack Developer (.NET + React)";

  const RESUME_CONTACT = [
    settings?.email && { icon: FaEnvelope, label: settings.email, href: `mailto:${settings.email}` },
    settings?.phone && { icon: FaPhone, label: settings.phone, href: `tel:${settings.phone}` },
    settings?.github && { icon: FaGithub, label: settings.github.replace(/^https?:\/\//, ""), href: settings.github },
    settings?.linkedin && { icon: FaLinkedin, label: settings.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "linkedin.com/in/"), href: settings.linkedin },
    settings?.website && { icon: FaGlobe, label: settings.website.replace(/^https?:\/\//, ""), href: settings.website },
  ].filter(Boolean) as { icon: React.ElementType; label: string; href: string }[];

  if (RESUME_CONTACT.length === 0) {
    RESUME_CONTACT.push(
      { icon: FaEnvelope, label: "hello@naheel.me", href: "mailto:hello@naheel.me" },
      { icon: FaGithub, label: "github.com/naheel0", href: "https://github.com/naheel0" },
      { icon: FaLinkedin, label: "linkedin.com/in/naheel-muhammed", href: "https://www.linkedin.com/in/naheel-muhammed" },
      { icon: FaGlobe, label: "www.naheel.me", href: "https://www.naheel.me" },
    );
  }

  let i = 0;
  const nextDelay = () => i++;

  return (
    <div className="resume-page" id="resume">
      {/* Sticky action bar */}
      <div className="resume-actions no-print">
        <Link href="/" className="resume-action-btn resume-back-btn" aria-label="Back to portfolio">
          <FaArrowLeft aria-hidden="true" />
          <span>Back</span>
        </Link>
        <a
          href={pdfUrl}
          download={pdfUrl === "/Naheel.pdf" ? "Naheel-Muhammed-PK-Resume.pdf" : undefined}
          className="resume-action-btn resume-download-btn"
          aria-label="Download Resume PDF"
        >
          <FaFileArrowDown aria-hidden="true" />
          <span>Download PDF</span>
        </a>
      </div>

      <div className="resume-container">
        {/* ===== Header ===== */}
        <header className="resume-header" style={enter(nextDelay())}>
          <h1 className="resume-name">{displayName}</h1>
          <p className="resume-role">{displayRole}</p>
          <div className="resume-contact-row">
            {RESUME_CONTACT.map((c) => {
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
        </header>

        {/* ===== Summary ===== */}
        <section className="resume-section-block" style={enter(nextDelay())}>
          <h2 className="resume-heading">
            <FaLayerGroup aria-hidden="true" className="resume-heading-icon" />
            Professional Summary
          </h2>
          <p className="resume-text">{summary}</p>
        </section>

        {/* ===== Skills ===== */}
        <section className="resume-section-block" style={enter(nextDelay())}>
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
                    <span key={s} className="resume-chip">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Experience ===== */}
        <section className="resume-section-block" style={enter(nextDelay())}>
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
                {job.points.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* ===== Projects ===== */}
        <section className="resume-section-block" style={enter(nextDelay())}>
          <h2 className="resume-heading">
            <FaFolderOpen aria-hidden="true" className="resume-heading-icon" />
            Projects
          </h2>
          {projects.map((proj) => (
            <article key={proj.name} className="resume-entry">
              <div className="resume-entry-head">
                <h3 className="resume-entry-title">{proj.name}</h3>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-entry-link no-print"
                    aria-label={`${proj.name} on GitHub`}
                  >
                    <FaGithub aria-hidden="true" />
                  </a>
                )}
              </div>
              <ul className="resume-list">
                {proj.points.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* ===== Education ===== */}
        <section className="resume-section-block" style={enter(nextDelay())}>
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
              {edu.coursework && (
                <p className="resume-text resume-coursework">
                  <strong>Relevant Coursework:</strong> {edu.coursework}
                </p>
              )}
            </article>
          ))}
        </section>

        {/* ===== Bottom download CTA ===== */}
        <div className="resume-footer-cta no-print" style={enter(nextDelay())}>
          <a
            href={pdfUrl}
            download={pdfUrl === "/Naheel.pdf" ? "Naheel-Muhammed-PK-Resume.pdf" : undefined}
            className="resume-action-btn resume-download-btn resume-download-lg"
            aria-label="Download Resume PDF"
          >
            <FaFileArrowDown aria-hidden="true" />
            <span>Download PDF Version</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResumeContent;