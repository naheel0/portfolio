'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import type { Project } from './ProjectsContent';
import { useTilt3D } from '@/lib/useTilt3D';

interface ProjectCarouselProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const cardVariants = {
  hidden:  { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 90, damping: 18, delay: i * 0.08 },
  }),
};

const ProjectCarousel = ({ projects, onProjectClick }: ProjectCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);
  const CARD_W = 320;
  const GAP    = 28;

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync, projects]);

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({
      left: dir === 'left' ? -(CARD_W + GAP) : CARD_W + GAP,
      behavior: 'smooth',
    });
    setTimeout(sync, 350);
  };

  return (
    <div className="prj-row-wrap">
      {/* Left arrow */}
      {canLeft && (
        <motion.button
          className="prj-arrow prj-arrow-left"
          onClick={() => scroll('left')}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </motion.button>
      )}

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="prj-track"
        onScroll={sync}
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onProjectClick={onProjectClick}
          />
        ))}
      </div>

      {/* Right arrow */}
      {canRight && (
        <motion.button
          className="prj-arrow prj-arrow-right"
          onClick={() => scroll('right')}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </motion.button>
      )}
    </div>
  );
};

export default ProjectCarousel;

/* --- 3D tilt card sub-component --- *
 * Each card gets its own `useTilt3D` instance (one rAF-throttled pointermove
 * listener per card). The ref is attached via a callback so we can hand the
 * DOM node to both framer-motion's `motion.button` and our tilt hook.
 *
 * Layering for parallax depth:
 *   - `.tilt-3d` outer = the tilting surface
 *   - `.tilt-layer` inner wrappers = lift toward viewer via translateZ
 *   - `::after` sheen follows the cursor (driven by --mx/--my CSS vars)
 */
interface ProjectCardProps {
  project: Project;
  index: number;
  onProjectClick: (project: Project) => void;
}

function ProjectCard({ project, index, onProjectClick }: ProjectCardProps) {
  const tiltRef = useTilt3D<HTMLButtonElement>();

  return (
    <motion.button
      ref={tiltRef as React.RefObject<HTMLButtonElement>}
      className="prj-card tilt-3d"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      onClick={() => onProjectClick(project)}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} details`}
      onKeyDown={(e) => e.key === 'Enter' && onProjectClick(project)}
    >
      {/* Image — lifts slightly toward viewer */}
      <div className="prj-card-img-wrap tilt-layer">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          className="prj-card-img"
          fill
          sizes="320px"
          priority={index < 3}
          quality={60}
        />
        <div className="prj-card-img-overlay">
          <span className="prj-card-cta">View Details</span>
        </div>
      </div>

      {/* Body — lifts further for parallax depth */}
      <div className="prj-card-body tilt-layer-deep">
        <span className="prj-card-badge">{project.category}</span>
        <h3 className="prj-card-title">{project.title}</h3>
        <div className="prj-card-chips">
          {project.technologies.slice(0, 3).map((t) => (
            <span key={t} className="prj-chip">{t}</span>
          ))}
          {project.technologies.length > 3 && (
            <span className="prj-chip prj-chip-more">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}