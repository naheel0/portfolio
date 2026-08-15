import { cache } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me"

// ── Shared types ────────────────────────────────────────────────────

export interface SiteSettings {
  name: string | null
  title: string | null
  bio: string | null
  email: string | null
  phone: string | null
  github: string | null
  linkedin: string | null
  website: string | null
  avatar: string | null
  ogImage: string | null
  roles: string[]
}

export interface ProjectChallenge {
  challenge: string
  solution: string
}

// ── Admin API raw shape (single endpoint returns all fields) ────────

export interface AdminProject {
  id: string
  title: string
  slug: string
  description: string
  imageUrl: string | null
  liveUrl: string | null
  githubUrl: string | null
  technologies: string[]
  category: string
  featured: boolean
  order: number
  published?: boolean
  showInList?: boolean
  showDetailPage?: boolean
  screenshots?: string[]
  features?: string[]
  year?: string | number | null
  overview?: string | null
  problem?: string | null
  solution?: string | null
  architecture?: string[]
  architectureMermaid?: string | null
  contribution?: string[]
  challenges?: ProjectChallenge[]
  results?: string[]
  learnings?: string[]
  futureImprovements?: string[]
}

// ── List item (for projects grid / home page) ───────────────────────

export interface ProjectListItem {
  id: number
  slug: string
  title: string
  description: string
  image: string
  githubUrl: string
  demoUrl: string
  technologies: string[]
  category: string
  featured?: boolean
  year: string | number | null
}

// ── Detail (full case-study page) ───────────────────────────────────

export interface ProjectDetail {
  id: number
  slug: string
  title: string
  description: string
  image: string
  githubUrl: string
  demoUrl: string
  technologies: string[]
  category: string
  featured?: boolean
  year: string | number | null
  screenshots: string[]
  features: string[]
  overview?: string
  problem?: string
  solution?: string
  architecture?: string[]
  architectureMermaid?: string | null
  contribution?: string[]
  challenges?: ProjectChallenge[]
  results?: string[]
  learnings?: string[]
  futureImprovements?: string[]
}

// ── Settings ────────────────────────────────────────────────────────

const defaultSettings: SiteSettings = {
  name: "Naheel Muhammed PK",
  title: "Full Stack Developer",
  bio: null,
  email: null,
  phone: null,
  github: "https://github.com/naheel0",
  linkedin: null,
  website: "https://naheel.me",
  avatar: null,
  ogImage: null,
  roles: ["Full Stack Developer", ".NET Developer", "React Developer", "Web Developer"],
}

export const getSettings = cache(async function getSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_URL}/api/portfolio/settings`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    const data = await res.json()
    return { ...defaultSettings, ...data }
  } catch {
    return defaultSettings
  }
})

// ── Helpers ──────────────────────────────────────────────────────────

function normalizeChallenges(raw: unknown): ProjectChallenge[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((c) => c && typeof c === "object" && typeof (c as any).challenge === "string")
    .map((c) => ({
      challenge: (c as any).challenge ?? "",
      solution: (c as any).solution ?? "",
    }))
    .filter((c) => c.challenge || c.solution)
}

// ── Mappers ─────────────────────────────────────────────────────────

function mapListItem(p: AdminProject, index: number): ProjectListItem {
  return {
    id: index + 1,
    slug: p.slug,
    title: p.title,
    description: p.description,
    image: p.imageUrl || "/images/placeholder.svg",
    githubUrl: p.githubUrl || "#",
    demoUrl: p.liveUrl || "#",
    technologies: p.technologies || [],
    category: p.category,
    featured: p.featured,
    year: p.year ?? null,
  }
}

function mapDetail(p: AdminProject): ProjectDetail {
  return {
    id: 0,
    slug: p.slug,
    title: p.title,
    description: p.description,
    image: p.imageUrl || "/images/placeholder.svg",
    githubUrl: p.githubUrl || "#",
    demoUrl: p.liveUrl || "#",
    technologies: p.technologies || [],
    category: p.category,
    featured: p.featured,
    year: p.year ?? null,
    screenshots: p.screenshots || [],
    features: p.features || [],
    overview: p.overview ?? undefined,
    problem: p.problem ?? undefined,
    solution: p.solution ?? undefined,
    architecture: p.architecture || [],
    architectureMermaid: typeof p.architectureMermaid === "string" && p.architectureMermaid.trim() ? p.architectureMermaid : null,
    contribution: p.contribution || [],
    challenges: normalizeChallenges(p.challenges),
    results: p.results || [],
    learnings: p.learnings || [],
    futureImprovements: p.futureImprovements || [],
  }
}

// ── Public data loaders ─────────────────────────────────────────────

export async function getProjects(): Promise<ProjectListItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/portfolio/projects`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    const data: AdminProject[] = await res.json()
    if (data.length === 0) return []
    return data
      .filter((p) => p.published !== false && p.showInList !== false)
      .sort((a, b) => a.order - b.order)
      .map(mapListItem)
  } catch {
    return []
  }
}

export async function getProject(slug: string): Promise<ProjectDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/portfolio/projects/${slug}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const p: AdminProject = await res.json()
    if (p.published === false || p.showDetailPage === false) return null
    return mapDetail(p)
  } catch {
    return null
  }
}
