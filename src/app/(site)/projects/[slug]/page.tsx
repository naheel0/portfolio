import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowUpRightFromSquare,
  FaCode,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa6";
import { getProject } from "@/lib/data";
import { normalizeUrl } from "@/lib/url";
import { iconMap, DefaultIcon } from "@/lib/icon-map";
import { techBrandColor } from "@/lib/brand-colors";
import ProjectToc from "@/components/ProjectToc";
import DepthCarousel from "@/components/DepthCarousel/DepthCarousel";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import MermaidDiagram from "@/components/MermaidDiagram";
import ScrollReveal from "@/components/ScrollReveal";
import "./page.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

interface Props {
  params: Promise<{ slug: string }>;
}

const TECH_ICON_RULES: [string, string][] = [
  ["react", "FaReact"],
  ["next", "SiNextdotjs"],
  ["tailwind", "SiTailwindcss"],
  ["typescript", "SiTypescript"],
  ["asp.net", "SiDotnet"],
  [".net", "SiDotnet"],
  ["dotnet", "SiDotnet"],
  ["c#", "TbBrandCSharp"],
  ["csharp", "TbBrandCSharp"],
  ["entity framework", "DiDotnet"],
  ["ef core", "DiDotnet"],
  ["sql server", "DiMsqlServer"],
  ["sql", "DiMsqlServer"],
  ["postgres", "SiPostgresql"],
  ["mongodb", "SiMongodb"],
  ["redis", "SiRedis"],
  ["prisma", "SiPrisma"],
  ["javascript", "FaJs"],
  ["html", "FaHtml5"],
  ["css", "FaCss3Alt"],
  ["bootstrap", "FaBootstrap"],
  ["node", "FaNodeJs"],
  ["npm", "FaNpm"],
  ["yarn", "FaYarn"],
  ["git", "FaGitAlt"],
  ["github", "FaGithub"],
  ["docker", "FaDocker"],
  ["python", "FaPython"],
  ["java", "FaJava"],
  ["figma", "FaFigma"],
  ["aws", "FaAws"],
  ["google", "FaGoogle"],
  ["firebase", "SiFirebase"],
  ["vercel", "SiVercel"],
  ["netlify", "SiNetlify"],
  ["vite", "SiVite"],
  ["razorpay", "SiRazorpay"],
  ["jwt", "TbLock"],
  ["cloudinary", "FaCloud"],
  ["swagger", "TbServer"],
  ["rest", "TbServer"],
];

function TechIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  let key: string | null = null;
  for (const [term, icon] of TECH_ICON_RULES) {
    if (lower.includes(term)) {
      key = icon;
      break;
    }
  }
  const Icon = (key && iconMap[key]) || DefaultIcon;
  return <Icon aria-hidden="true" />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | Naheel Me",
      description: "The requested project could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const url = `${BASE_URL}/projects/${project.slug}`;

  return {
    title: `${project.title} - ${project.category} Project Case Study by Naheel`,
    description: project.description,
    alternates: { canonical: url },
    keywords: [
      project.title,
      project.category,
      ...(project.technologies || []),
      "portfolio",
      "web development",
      "full stack",
      "project case study",
    ],
    authors: [{ name: "Naheel" }],
    openGraph: {
      title: `${project.title} - ${project.category} Project Case Study`,
      description: project.description,
      url,
      type: "article",
      publishedTime: project.year ? new Date(Number(project.year), 0, 1).toISOString() : undefined,
      modifiedTime: new Date().toISOString(),
      section: project.category,
      tags: project.technologies || [],
      images: [{ url: project.image, width: 1200, height: 675, alt: `${project.title} project screenshot` }],
      siteName: "Naheel Me - Portfolio",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - ${project.category} Project Case Study`,
      description: project.description,
      images: [{ url: project.image, alt: `${project.title} project screenshot` }],
      creator: "@naheel0",
      site: "@naheel0",
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const url = `${BASE_URL}/projects/${project.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    url,
    applicationCategory: project.category,
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Person", name: "Naheel", url: BASE_URL },
    datePublished: project.year ? `${project.year}-01-01` : undefined,
    ...(project.technologies?.length && { keywords: project.technologies.join(", ") }),
    ...(project.screenshots?.length && { screenshot: project.screenshots.map((s) => ({ "@type": "ImageObject", url: s })) }),
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
    ...(project.demoUrl && { potentialAction: { "@type": "Action", name: "ViewDemo", target: normalizeUrl(project.demoUrl) } }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${BASE_URL}/#projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: url },
    ],
  };

  const carouselItems = project.screenshots?.map((src, i) => ({
    image: src,
    alt: `${project.title} screenshot ${i + 1} - ${project.category.toLowerCase()} application`,
  })) || [];

  const toc = [
    { id: "overview", label: "Overview", show: !!project.overview },
    { id: "problem", label: "Problem & Solution", show: !!project.problem || !!project.solution },
    { id: "features", label: "Features", show: (project.features?.length ?? 0) > 0 },
    { id: "architecture", label: "Architecture", show: !!project.architectureMermaid || (project.architectureStack?.length ?? 0) > 0 },
    { id: "screenshots", label: "Screenshots", show: carouselItems.length > 0 },
    { id: "contribution", label: "Contribution", show: (project.contribution?.length ?? 0) > 0 },
    { id: "challenges", label: "Challenges", show: (project.challenges?.length ?? 0) > 0 },
    { id: "results", label: "Results", show: (project.results?.length ?? 0) > 0 },
    { id: "learnings", label: "Learnings", show: (project.learnings?.length ?? 0) > 0 },
    { id: "future", label: "Future", show: (project.futureImprovements?.length ?? 0) > 0 },
  ].filter((s) => s.show);

  const hasArch = !!project.architectureMermaid || !!(project.architectureStack && project.architectureStack.length > 0);

  return (
    <main className="project-detail">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="project-detail-inner">
        {/* Hero */}
        <ScrollReveal delay={0.08} distance={30} blur={false}>
          <section className="pd-hero" aria-label={`${project.title} project hero`}>
            <div className="pd-hero-text">
              <div className="pd-hero-eyebrow">
                {project.category}{project.year ? ` · ${project.year}` : ""}
              </div>
              <h1 className="pd-hero-title">{project.title}</h1>
              <p className="pd-hero-desc">{project.description}</p>
              <div className="pd-hero-actions">
                {project.githubUrl && project.githubUrl !== "#" && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer nofollow" className="pd-btn pd-btn-primary">
                    <FaCode aria-hidden="true" /> Code
                  </a>
                )}
                {project.demoUrl && project.demoUrl !== "#" && (
                  <a href={normalizeUrl(project.demoUrl)} target="_blank" rel="noopener noreferrer nofollow" className="pd-btn pd-btn-outline">
                    <FaArrowUpRightFromSquare aria-hidden="true" /> Live Demo
                  </a>
                )}
              </div>
            </div>
            <div className="pd-hero-image-wrap">
              <Image src={project.image} alt={`${project.title} cover`} width={1280} height={800} priority className="pd-hero-image" />
            </div>
          </section>
        </ScrollReveal>

        {/* Tech Strip */}
        {(project.technologies?.length ?? 0) > 0 && (
          <ScrollReveal delay={0.12} distance={16}>
            <div className="pd-tech-strip" role="list" aria-label="Technologies">
              {project.technologies.map((tech) => (
                <span className="pd-tech-tag" role="listitem" key={tech}>
                  <span style={{ color: techBrandColor(tech) ?? undefined }} aria-hidden="true"><TechIcon name={tech} /></span>
                  {tech}
                </span>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Grid */}
        <div className="pd-grid">
          <div className="pd-content">
            {/* Overview */}
            {project.overview && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="overview" />
                <div className="pd-overview">
                  <div className="pd-overview-accent" aria-hidden="true" />
                  <p className="pd-overview-text">{project.overview}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Problem & Solution */}
            {(project.problem || project.solution) && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="problem" />
                <div id="solution" />
                <h2 className="pd-section-title">Problem &amp; Solution</h2>
                <div className="pd-split">
                  {project.problem && (
                    <div className="pd-split-col pd-split-problem">
                      <div className="pd-split-label">
                        <span className="pd-split-dot pd-split-dot-warn" aria-hidden="true" />
                        The Problem
                      </div>
                      <p>{project.problem}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="pd-split-col pd-split-solution">
                      <div className="pd-split-label">
                        <span className="pd-split-dot pd-split-dot-ok" aria-hidden="true" />
                        The Solution
                      </div>
                      <p>{project.solution}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="features" />
                <h2 className="pd-section-title">Features</h2>
                <div className="pd-bento">
                  {project.features.map((feature, i) => (
                    <div className={`pd-bento-cell ${i === 0 ? "pd-bento-cell--hero" : ""}`} key={i}>
                      <span className="pd-bento-idx" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Architecture */}
            {hasArch && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="architecture" />
                <h2 className="pd-section-title">Architecture</h2>
                {project.architectureMermaid ? (
                  <MermaidDiagram code={project.architectureMermaid} />
                ) : project.architectureStack ? (
                  <ArchitectureDiagram stack={project.architectureStack} layout={project.architectureLayout} />
                ) : null}
              </ScrollReveal>
            )}

            {/* Screenshots */}
            {carouselItems.length > 0 && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="screenshots" />
                <h2 className="pd-section-title">Screenshots</h2>
                <div className="pd-carousel-wrap">
                  <DepthCarousel
                    items={carouselItems}
                    cardWidth={560}
                    cardHeight={380}
                    radius={8}
                    tint="#060818"
                    depth={260}
                    spread={110}
                    tilt={28}
                    tiltDirection="right"
                    perspective={1500}
                    visibleCards={3}
                    falloff={0.18}
                    blur={7}
                    duration={750}
                    ease="power3.out"
                    autoplay={false}
                    loop={true}
                    showControls={true}
                    showIndicators={true}
                    className="pd-carousel"
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Contribution */}
            {project.contribution && project.contribution.length > 0 && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="contribution" />
                <h2 className="pd-section-title">Contribution</h2>
                <div className="pd-contribution">
                  {project.contribution.map((point, i) => (
                    <div className="pd-contribution-row" key={i}>
                      <span className="pd-contribution-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Challenges */}
            {project.challenges && project.challenges.length > 0 && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="challenges" />
                <h2 className="pd-section-title">Challenges</h2>
                <div className="pd-challenges">
                  {project.challenges.map((item, i) => (
                    <div className="pd-challenge" key={i}>
                      <div className="pd-challenge-q">
                        <span>{item.challenge}</span>
                      </div>
                      {item.solution && (
                        <div className="pd-challenge-a">
                          <span>{item.solution}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Results */}
            {project.results && project.results.length > 0 && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="results" />
                <h2 className="pd-section-title">Results</h2>
                <div className="pd-results">
                  {project.results.map((result, i) => (
                    <div className="pd-result-card" key={i}>
                      <p>{result}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Learnings */}
            {project.learnings && project.learnings.length > 0 && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="learnings" />
                <h2 className="pd-section-title">Learnings</h2>
                <div className="pd-learnings">
                  {project.learnings.map((point, i) => (
                    <div className="pd-learning" key={i}>
                      <span className="pd-learning-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Future Work */}
            {project.futureImprovements && project.futureImprovements.length > 0 && (
              <ScrollReveal className="pd-section" delay={0.05}>
                <div id="future" />
                <h2 className="pd-section-title">Future Work</h2>
                <div className="pd-future">
                  {project.futureImprovements.map((point, i) => (
                    <div className="pd-future-item" key={i}>
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* CTA */}
            <ScrollReveal className="pd-section" delay={0.05}>
              <div id="links" />
              <div className="pd-cta-row">
                {project.demoUrl && project.demoUrl !== "#" && (
                  <a href={normalizeUrl(project.demoUrl)} target="_blank" rel="noopener noreferrer nofollow" className="pd-btn pd-btn-primary">
                    <FaArrowUpRightFromSquare aria-hidden="true" /> Live Demo
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== "#" && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer nofollow" className="pd-btn pd-btn-outline">
                    <FaCode aria-hidden="true" /> Source Code
                  </a>
                )}
                <a href="/contact" className="pd-btn pd-btn-ghost">
                  <FaEnvelope aria-hidden="true" /> Get in Touch
                </a>
              </div>
            </ScrollReveal>
          </div>

          <aside className="pd-toc" aria-label="On this page">
            <ProjectToc items={toc.map(({ id, label }) => ({ id, label }))} />
          </aside>
        </div>

        {/* Footer */}
        <footer className="pd-footer">
          <div className="pd-footer-row">
            <Link href="/#projects" className="pd-footer-brand">
              <FaGithub aria-hidden="true" /> naheel0
            </Link>
            <span className="pd-footer-meta">&copy; {new Date().getFullYear()} Naheel Muhammed PK</span>
            <Link href="/contact" className="pd-footer-contact">Contact</Link>
          </div>
        </footer>
      </div>

      <a href="#" className="pd-back-top" aria-label="Back to top">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M3.47 7.78 7.5 3.75a.75.75 0 0 1 1.06 0l4.03 4.03a.75.75 0 1 1-1.06 1.06L8.5 5.81v7.44a.75.75 0 0 1-1.5 0V5.81L4.53 8.84a.75.75 0 1 1-1.06-1.06Z" />
        </svg>
      </a>
    </main>
  );
}
