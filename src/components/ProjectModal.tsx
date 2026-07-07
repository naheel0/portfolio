'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { FaXmark, FaGithub, FaArrowUpRightFromSquare, FaCode, FaLayerGroup } from 'react-icons/fa6';
import type { Project } from './ProjectsContent';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

/** Normalize a URL — ensures it has an https:// scheme so links don't break */
const normalizeUrl = (url: string): string => {
  if (!url) return '#';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

// --- Framer-motion variants ---

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:   { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 30, rotateX: -8 },
  visible: {
    opacity: 1, scale: 1, y: 0, rotateX: 0,
    transition: { type: 'spring', stiffness: 260, damping: 26, mass: 0.8 },
  },
  exit: {
    opacity: 0, scale: 0.95, y: 16,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

// Staggered children for the body content
const bodyContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const bodyItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

const heroMetaVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.25, type: 'spring', stiffness: 180, damping: 18 } },
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  // Only render the portal after mount (client-side) to avoid SSR `document` errors
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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

  // Don't render anything on the server or when no project is selected
  if (!mounted || !project) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="pmd-backdrop"
        onClick={onClose}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="pmd"
          onClick={(e) => e.stopPropagation()}
          variants={modalVariants}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'center top' }}
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
            <button className="pmd-close" onClick={onClose} aria-label="Close">
              <FaXmark />
            </button>

            {/* Project number indicator (top-left) */}
            <div className="pmd-hero-num" aria-hidden="true">
              {String(project.id).padStart(2, '0')}
            </div>

            {/* Title + badge at bottom of hero */}
            <motion.div className="pmd-hero-meta" variants={heroMetaVariants} initial="hidden" animate="visible">
              <span className="pmd-badge">{project.category}</span>
              <h2 className="pmd-title">{project.title}</h2>
            </motion.div>
          </div>

          {/* ── Content body (staggered reveal) ── */}
          <motion.div
            className="pmd-body"
            variants={bodyContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Overview section */}
            <motion.div className="pmd-section" variants={bodyItem}>
              <div className="pmd-section-head">
                <FaCode className="pmd-section-icon" aria-hidden="true" />
                <span className="pmd-section-label">Overview</span>
              </div>
              <p className="pmd-desc">{project.description}</p>
            </motion.div>

            {/* Tech stack section */}
            <motion.div className="pmd-section" variants={bodyItem}>
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
            </motion.div>

            {/* Actions */}
            <motion.div className="pmd-actions" variants={bodyItem}>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="pmd-btn pmd-btn-gh">
                <FaGithub />
                <span>Source Code</span>
              </a>
              <a href={normalizeUrl(project.demoUrl)} target="_blank" rel="noopener noreferrer" className="pmd-btn pmd-btn-live">
                <FaArrowUpRightFromSquare />
                <span>Live Demo</span>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
