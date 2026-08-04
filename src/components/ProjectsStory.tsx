'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { FaGithub, FaArrowUpRightFromSquare, FaStar } from 'react-icons/fa6';
import ProjectModal from './ProjectModal';
import { useStoryScroll } from '@/lib/useStoryScroll';
import { useReveal } from '@/lib/useReveal';
import { normalizeUrl } from '@/lib/url';
import type { PortfolioProject } from '@/lib/data';

function StoryCard({
  project,
  index,
  total,
  initialVisible,
  cardRef,
  onOpen,
}: {
  project: PortfolioProject;
  index: number;
  total: number;
  initialVisible: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
  onOpen: (p: PortfolioProject) => void;
}) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <article
      ref={cardRef}
      className="story-card"
      style={{ opacity: initialVisible ? 1 : 0 }}
      aria-label={`Project ${num}: ${project.title}`}
    >
      {/* Image — left side */}
      <div className="story-card-img" onClick={() => onOpen(project)}>
        <Image
          src={project.image}
          alt={`${project.title} project screenshot`}
          fill
          sizes="(max-width: 768px) 90vw, 400px"
          quality={index === 0 ? 80 : 65}
          priority={index === 0}
          loading={index === 0 ? undefined : "lazy"}
          className="story-card-img-file"
        />
        <span className="story-card-num" aria-hidden="true">{num}</span>
      </div>

      {/* Content — right side */}
      <div className="story-card-body">
        <div className="story-card-meta">
          {project.featured && (
            <span className="story-card-star">
              <FaStar aria-hidden="true" /> Featured
            </span>
          )}
          <span className="prj-card-badge">{project.category}</span>
        </div>

        <h3 className="story-card-title" onClick={() => onOpen(project)}>
          {project.title}
        </h3>
        <p className="story-card-desc">{project.description}</p>

        <div className="prj-card-chips" role="list" aria-label="Technologies used">
          {project.technologies.map((t) => (
            <span key={t} className="prj-chip" role="listitem">{t}</span>
          ))}
        </div>

        <div className="story-card-actions">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="story-action-btn story-action-gh"
            aria-label={`${project.title} source code on GitHub`}
            onClick={(e) => e.stopPropagation()}
          >
            <FaGithub aria-hidden="true" />
            <span>Code</span>
          </a>
          {project.demoUrl && (
            <a
              href={normalizeUrl(project.demoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="story-action-btn story-action-live"
              aria-label={`${project.title} live demo`}
              onClick={(e) => e.stopPropagation()}
            >
              <FaArrowUpRightFromSquare aria-hidden="true" />
              <span>Live</span>
            </a>
          )}
        </div>

        <span className="story-card-index" aria-hidden="true">
          {num} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </article>
  );
}

function ProjectsStory({ projects }: { projects: PortfolioProject[] }) {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const handleClose = useCallback(() => setSelectedProject(null), []);
  const handleOpen = useCallback((p: PortfolioProject) => setSelectedProject(p), []);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const dotRefs = useRef<(HTMLElement | null)[]>([]);
  const headingRef = useReveal<HTMLDivElement>(0.3);

  useStoryScroll({
    count: projects.length,
    containerRef,
    cardRefs,
    progressRef,
    dotRefs,
  });

  return (
    <section className="main-bg-prj" id="projects" aria-label="Projects">

      {/* Noscript fallback for SEO / no-JS */}
      <noscript>
        <div className="prj-heading">
          <h2>My Recent <span className="prj-accent">Works</span></h2>
        </div>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
          {projects.map((p) => (
            <article key={p.id} style={{ marginBottom: 40, color: '#ccc' }}>
              <h3 style={{ color: '#fff' }}>{p.title}</h3>
              <p>{p.description}</p>
              <div>{p.technologies.join(', ')}</div>
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">Code</a>
              {' · '}
              <a href={normalizeUrl(p.demoUrl)} target="_blank" rel="noopener noreferrer">Live</a>
            </article>
          ))}
        </div>
      </noscript>

      {/* Scrollable storytelling container */}
      <div
        ref={containerRef}
        className="story-container"
        style={{ height: `${projects.length * 100}vh` }}
        role="region"
        aria-label="Projects scroll area"
      >
        <div className="story-sticky">
          {/* Heading — stays pinned at top */}
          <div className="prj-heading skill-scroll-reveal" ref={headingRef}>
            <h2>
              My Recent <span className="prj-accent">Works</span>
            </h2>
            <p>Scroll to explore each project</p>
          </div>

          {/* Progress bar */}
          <div
            ref={progressRef}
            className="story-progress"
            style={{ transform: 'scaleX(0)' }}
            aria-hidden="true"
          />

          {/* Chapter dots */}
          <nav className="story-dots" aria-label="Project navigation">
            {projects.map((_, i) => (
              <span
                key={i}
                className="story-dot"
                ref={(el) => { dotRefs.current[i] = el; }}
                style={{
                  opacity: i === 0 ? 1 : 0.25,
                  transform: i === 0 ? 'scale(1.4)' : 'scale(0.8)',
                }}
                aria-hidden="true"
              />
            ))}
          </nav>

          {/* Card area — centered below heading */}
          <div className="story-card-area">
            {projects.map((project, i) => (
              <StoryCard
                key={project.id}
                project={project}
                index={i}
                total={projects.length}
                initialVisible={i === 0}
                cardRef={(el) => { cardRefs.current[i] = el; }}
                onOpen={handleOpen}
              />
            ))}
          </div>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={handleClose}
      />
    </section>
  );
}

export default ProjectsStory;