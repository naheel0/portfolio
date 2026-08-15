"use client";

import Image from "next/image";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import { FaGithub, FaArrowUpRightFromSquare, FaStar } from "react-icons/fa6";
import { normalizeUrl } from "@/lib/url";
import type { ProjectListItem } from "@/lib/data";

interface ProjectsStackProps {
  projects: ProjectListItem[];
}

/**
 * ProjectsStack — renders the projects list as a ScrollStack card stack.
 * Self-contained cards (no modal): title, category, description, tech chips,
 * and Code/Live links. Renders statically and defers all animation scrollwork
 * to ScrollStack (Lenis) which is lazy + reduced-motion + viewport aware.
 */
const ProjectsStack = ({ projects }: ProjectsStackProps) => {
  return (
    <section className="main-bg-prj projects-stack-section" id="projects" aria-label="Projects">
      <div className="prj-heading">
        <h2>
          My Recent <span className="prj-accent">Works</span>
        </h2>
        <p>Scroll to explore each project</p>
      </div>

      <ScrollStack>
        {projects.map((project) => (
          <ScrollStackItem key={project.id}>
            <article className="stack-card-body">
              <div className="stack-card-img">
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  quality={80}
                  loading="lazy"
                  decoding="async"
                  className="stack-card-img-file"
                />
                <span className="stack-card-img-fade" aria-hidden="true" />
                <span className="stack-card-num" aria-hidden="true">
                  {String(project.id).padStart(2, "0")}
                </span>
              </div>

              <div className="stack-card-content">
                <div className="stack-card-meta">
                  {project.featured && (
                    <span className="stack-card-star">
                      <FaStar aria-hidden="true" /> Featured
                    </span>
                  )}
                  <span className="prj-card-badge">{project.category}</span>
                </div>

                <h3 className="stack-card-title">{project.title}</h3>

                <p className="stack-card-desc">{project.description}</p>

                <div className="prj-card-chips" role="list" aria-label="Technologies used">
                  {project.technologies.map((t) => (
                    <span key={t} className="prj-chip" role="listitem">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="stack-card-actions">
                  <a
                    href={`/projects/${project.slug}`}
                    className="stack-action-btn stack-action-details"
                    aria-label={`${project.title} details`}
                  >
                    <span>Details</span>
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stack-action-btn stack-action-gh"
                    aria-label={`${project.title} source code on GitHub`}
                  >
                    <FaGithub aria-hidden="true" />
                    <span>Code</span>
                  </a>
                  {project.demoUrl && project.demoUrl !== "#" && (
                    <a
                      href={normalizeUrl(project.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="stack-action-btn stack-action-live"
                      aria-label={`${project.title} live demo`}
                    >
                      <FaArrowUpRightFromSquare aria-hidden="true" />
                      <span>Live</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
};

export default ProjectsStack;