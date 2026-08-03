'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { m, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { FaGithub, FaArrowUpRightFromSquare, FaStar } from "react-icons/fa6";
import ProjectModal from "./ProjectModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me";

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  demoUrl: string;
  technologies: string[];
  category: string;
  featured?: boolean;
}

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "Gamehub",
    description: "Full-Stack E-Commerce Website for gaming products. Implemented secure JWT authentication (access & refresh tokens), middleware-based session validation, and role-based access control. Developed scalable backend services with ASP.NET Core following Clean Architecture principles and RESTful API design. Integrated Razorpay payment gateway with dynamic cart functionality and order processing workflows.",
    image: "/images/gamehub.png",
    githubUrl: "https://github.com/naheel0/GameHub-fullstack",
    demoUrl: "https://gamehub.naheel.me",
    technologies: ["React.js", "ASP.NET Core", "C#", "Entity Framework", "SQL Server", "JWT", "Razorpay"],
    category: "Full Stack",
    featured: true,
  },
  {
    id: 2,
    title: "justDial",
    description: "A clone of JustDial website built with HTML, CSS, and JavaScript.",
    image: "/images/just.jpg",
    githubUrl: "https://github.com/naheel0/justdial-clone",
    demoUrl: "https://naheel0.github.io/justdial-clone/",
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "Frontend",
  },
  {
    id: 3,
    title: "Weather App",
    description: "A weather application that provides current weather information using a live weather API with dynamic UI updates based on weather conditions.",
    image: "/images/weather-app.png",
    githubUrl: "https://github.com/naheel0/react-weather-app",
    demoUrl: "https://naheel0.github.io/react-weather-app/",
    technologies: ["React.js", "API", "Tailwind CSS", "JavaScript"],
    category: "Frontend",
  },
  {
    id: 4,
    title: "W3 School Navbar",
    description: "A responsive navigation bar built with HTML, CSS, and JavaScript.",
    image: "/images/nav-bar.jpg",
    githubUrl: "https://github.com/naheel0/w3school-nav-bar",
    demoUrl: "https://naheel0.github.io/w3school-nav-bar/",
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "Frontend",
  },
  {
    id: 5,
    title: "Facebook Clone",
    description: "A pixel-perfect clone of the Facebook homepage built with HTML, CSS, and JavaScript focusing on UI fidelity and responsive design.",
    image: "/images/fb.png",
    githubUrl: "https://github.com/naheel0/facebook-login-clone",
    demoUrl: "https://naheel0.github.io/facebook-login-clone/",
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "Frontend",
  },
];

const normalizeUrl = (url: string): string => {
  if (!url) return '#';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

type SlideDir = 'left' | 'right' | 'zoom' | 'up';
const DIRECTIONS: SlideDir[] = ['zoom', 'left', 'right', 'up', 'left'];

function StoryCard({
  project,
  index,
  total,
  progress,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  onOpen: (p: Project) => void;
}) {
  const dir = DIRECTIONS[index % DIRECTIONS.length];
  const seg = 1 / total;
  const start = index * seg;
  const end = start + seg;

  // Step function: snaps between 0 and 1, no interpolation
  // Card is visible during [start, end] and invisible everywhere else
  const isVisible = useTransform(progress, [start - 0.001, start, end - 0.001, end], [0, 1, 1, 0]);
  const opacity = useTransform(isVisible, (v) => (v >= 0.5 ? 1 : 0));

  let xFrom = 0;
  let yFrom = 0;
  let scaleFrom = 1;
  if (dir === 'left') xFrom = -80;
  else if (dir === 'right') xFrom = 80;
  else if (dir === 'up') yFrom = 60;
  else if (dir === 'zoom') scaleFrom = 0.85;

  // Transform: smooth slide in/out, exit persists
  const transformEnd = Math.min(1, end + seg * 0.4);
  const transformRange = [start, start + seg * 0.25, end, transformEnd];
  const x = useTransform(progress, transformRange, [xFrom, 0, 0, -xFrom]);
  const y = useTransform(progress, transformRange, [yFrom, 0, 0, -yFrom]);
  const scale = useTransform(progress, transformRange, [scaleFrom, 1, 1, scaleFrom]);

  const num = String(index + 1).padStart(2, '0');

  return (
    <m.article
      className="story-card"
      style={{ opacity, x, y, scale }}
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
    </m.article>
  );
}

function ChapterDots({
  total,
  progress,
}: {
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const seg = 1 / total;
  const dots = Array.from({ length: total }).map((_, i) => {
    const segStart = i / total;
    const segEnd = (i + 1) / total;
    const pad = seg * 0.15;
    return { segStart, segEnd, pad };
  });

  return (
    <nav className="story-dots" aria-label="Project navigation">
      {dots.map(({ segStart, segEnd, pad }, i) => {
        const dotOpacity = useTransform(
          progress,
          [Math.max(0, segStart - pad), segStart, segEnd, Math.min(1, segEnd + pad)],
          [0.25, 1, 1, 0.25]
        );
        const dotScale = useTransform(
          progress,
          [Math.max(0, segStart - pad), segStart, segEnd, Math.min(1, segEnd + pad)],
          [0.8, 1.4, 1.4, 0.8]
        );
        return (
          <m.span
            key={i}
            className="story-dot"
            style={{ opacity: dotOpacity, scale: dotScale }}
            aria-hidden="true"
          />
        );
      })}
    </nav>
  );
}

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const handleClose = useCallback(() => setSelectedProject(null), []);
  const handleOpen = useCallback((p: Project) => setSelectedProject(p), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/portfolio/projects`)
      .then(r => r.json())
      .then((data: any[]) => {
        if (data.length === 0) return;
        const mapped = data.map((p, i): Project => ({
          id: i + 1,
          title: p.title,
          description: p.description,
          image: p.imageUrl || "/images/placeholder.png",
          githubUrl: p.githubUrl || "#",
          demoUrl: p.liveUrl || "",
          technologies: p.technologies || [],
          category: p.category,
          featured: p.featured,
        }));
        setProjects(mapped);
      })
      .catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section className="main-bg-prj" id="projects" aria-label="Projects">

      {/* Noscript fallback for SEO / no-JS */}
      <noscript>
        <div className="prj-heading">
          <h2>My Recent <span className="prj-accent">Works</span></h2>
        </div>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
          {fallbackProjects.map((p) => (
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
          <div
            className="prj-heading skill-scroll-reveal"
            ref={headingRef}
          >
            <h2>
              My Recent <span className="prj-accent">Works</span>
            </h2>
            <p>Scroll to explore each project</p>
          </div>

          {/* Progress bar */}
          <m.div className="story-progress" style={{ scaleX }} aria-hidden="true" />

          {/* Chapter dots */}
          <ChapterDots total={projects.length} progress={scrollYProgress} />

          {/* Card area — centered below heading */}
          <div className="story-card-area">
            {projects.map((project, i) => (
              <StoryCard
                key={project.id}
                project={project}
                index={i}
                total={projects.length}
                progress={scrollYProgress}
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

export default ProjectsContent;
