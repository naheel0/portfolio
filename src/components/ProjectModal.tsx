'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FaXmark, FaGithub, FaArrowUpRightFromSquare, FaCode, FaLayerGroup } from 'react-icons/fa6';
import { useSpringTo } from '@/lib/useSpringTo';
import type { PortfolioProject } from '@/lib/data';

interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

/** Normalize a URL — ensures it has an https:// scheme so links don't break */
const normalizeUrl = (url: string): string => {
  if (!url) return '#';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [backdropIn, setBackdropIn] = useState(false);
  const closingRef = useRef(false);
  closingRef.current = closing;

  const modalRef = useRef<HTMLDivElement>(null);

  // Only render the portal after mount (client-side) to avoid SSR `document` errors
  useEffect(() => { setMounted(true); }, []);

  // Backdrop fade-in after the portal mounts
  useEffect(() => {
    if (!project) return;
    setBackdropIn(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setBackdropIn(true)));
    return () => cancelAnimationFrame(raf);
  }, [project]);

  // Body scroll lock while open
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  // Escape closes
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    setClosing(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [requestClose]);

  const closingNow = closing && !!project;
  const closingStiffness = closingNow ? 420 : 260;
  const closingDamping = closingNow ? 46 : 26;

  // Spring drives the modal container entrance (0 -> 1) and exit (1 -> 0).
  useSpringTo(project && !closing ? 1 : 0, (v) => {
    const el = modalRef.current;
    if (!el) return;
    if (closingRef.current) {
      // Exit — framer used easeIn toward scale 0.95 / y 16
      const scale = 0.95 + 0.05 * v;
      const y = 16 * (1 - v);
      el.style.transform = `translateY(${y}px) scale(${scale})`;
    } else {
      // Entrance — spring toward scale 1 / y 0 from scale 0.92 / y 30 / rotateX -8
      const scale = 0.92 + 0.08 * v;
      const y = 30 * (1 - v);
      const rotateX = -8 * (1 - v);
      el.style.transform = `translateY(${y}px) scale(${scale}) rotateX(${rotateX}deg)`;
    }
    el.style.opacity = String(v);
  }, {
    stiffness: closingStiffness,
    damping: closingDamping,
    mass: 0.8,
    onComplete: () => {
      if (closingRef.current) onCloseRef.current();
    },
  });

  if (!mounted || !project) return null;

  return createPortal(
    <div
      className={`pmd-backdrop ${backdropIn && !closingNow ? 'pmd-open' : ''} ${closingNow ? 'pmd-closing' : ''}`}
      onClick={requestClose}
    >
      <div
        ref={modalRef}
        className={`pmd ${!closingNow ? 'pmd-open' : ''}`}
        style={{ transformStyle: 'preserve-3d', transformOrigin: 'center top', opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero image with gradient fade ── */}
        <div className="pmd-hero">
          <Image
            src={project.image}
            alt={project.title}
            className="pmd-hero-img"
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            priority
          />
          <div className="pmd-hero-fade" />

          {/* Close btn */}
          <button className="pmd-close" onClick={requestClose} aria-label="Close">
            <FaXmark />
          </button>

          {/* Project number indicator (top-left) */}
          <div className="pmd-hero-num" aria-hidden="true">
            {String(project.id).padStart(2, '0')}
          </div>

          {/* Title + badge at bottom of hero */}
          <div className="pmd-hero-meta">
            <span className="pmd-badge">{project.category}</span>
            <h2 className="pmd-title">{project.title}</h2>
          </div>
        </div>

        {/* ── Content body (staggered reveal) ── */}
        <div className="pmd-body">
          {/* Overview section */}
          <div className="pmd-section">
            <div className="pmd-section-head">
              <FaCode className="pmd-section-icon" aria-hidden="true" />
              <span className="pmd-section-label">Overview</span>
            </div>
            <p className="pmd-desc">{project.description}</p>
          </div>

          {/* Tech stack section */}
          <div className="pmd-section">
            <div className="pmd-section-head">
              <FaLayerGroup className="pmd-section-icon" aria-hidden="true" />
              <span className="pmd-section-label">Tech Stack</span>
              <span className="pmd-section-count">{project.technologies.length}</span>
            </div>
            <div className="pmd-chips">
              {project.technologies.map((tech) => (
                <span key={tech} className="pmd-chip">{tech}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pmd-actions">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="pmd-btn pmd-btn-gh">
              <FaGithub />
              <span>Source Code</span>
            </a>
            <a href={normalizeUrl(project.demoUrl)} target="_blank" rel="noopener noreferrer" className="pmd-btn pmd-btn-live">
              <FaArrowUpRightFromSquare />
              <span>Live Demo</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;