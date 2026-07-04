'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FaXmark, FaGithub, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import type { Project } from './ProjectsContent';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : '';
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!project) return null;

  const modal = (
    <div className="pmd-backdrop" onClick={onClose}>
      <div className="pmd" onClick={(e) => e.stopPropagation()}>

        {/* ── Hero image with gradient fade ── */}
        <div className="pmd-hero">
          <Image
            src={project.image}
            alt={project.title}
            className="pmd-hero-img"
            fill
            sizes="(max-width: 768px) 100vw, 860px"
            priority
          />
          {/* gradient fade into the content below */}
          <div className="pmd-hero-fade" />

          {/* Close btn over image */}
          <button className="pmd-close" onClick={onClose} aria-label="Close">
            <FaXmark />
          </button>

          {/* Title sits at bottom of hero */}
          <div className="pmd-hero-meta">
            <span className="pmd-badge">{project.category}</span>
            <h2 className="pmd-title">{project.title}</h2>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="pmd-body">
          <p className="pmd-desc">{project.description}</p>

          {/* Tech stack */}
          <div className="pmd-tech">
            <span className="pmd-tech-label">Stack</span>
            <div className="pmd-chips">
              {project.technologies.map((tech) => (
                <span key={tech} className="pmd-chip">{tech}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pmd-actions">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pmd-btn pmd-btn-gh"
            >
              <FaGithub />
              <span>Source Code</span>
            </a>
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pmd-btn pmd-btn-live"
            >
              <FaArrowUpRightFromSquare />
              <span>Live Demo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ProjectModal;
