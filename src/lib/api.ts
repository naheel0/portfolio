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

export interface ArchitectureNode {
  title: string
  icon?: string | null
  color?: string | null
}

export interface ArchitectureLevel {
  label?: string | null
  nodes: ArchitectureNode[]
}

export type ArchitectureStack = ArchitectureLevel[]

export type ArchitectureLayout = "stack" | "flow" | "clustered"

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
  architectureStack?: ArchitectureStack
  architectureLayout?: ArchitectureLayout
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
  architectureStack?: ArchitectureStack
  architectureLayout?: ArchitectureLayout
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

// ── Architecture normalizers ────────────────────────────────────────

function normalizeNode(n: Record<string, unknown>): ArchitectureNode {
  return {
    title: typeof n.title === "string" ? n.title : "",
    icon: typeof n.icon === "string" ? n.icon : null,
    color: typeof n.color === "string" ? n.color : null,
  }
}

function normalizeStack(value: unknown): ArchitectureStack {
  if (!Array.isArray(value)) return []
  const levels: ArchitectureLevel[] = []
  for (const level of value) {
    if (Array.isArray(level)) {
      const nodes = level
        .filter((n) => !!n && typeof n === "object")
        .map((n) => normalizeNode(n as Record<string, unknown>))
        .filter((node) => node.title)
      if (nodes.length) levels.push({ label: null, nodes })
      continue
    }
    if (level && typeof level === "object") {
      const asLevel = level as Record<string, unknown>
      const nodes = (Array.isArray(asLevel.nodes) ? asLevel.nodes : [])
        .filter((n) => !!n && typeof n === "object")
        .map((n) => normalizeNode(n as Record<string, unknown>))
        .filter((node) => node.title)
      if (!nodes.length) continue
      levels.push({
        label: typeof asLevel.label === "string" && asLevel.label.trim() ? asLevel.label.trim() : null,
        nodes,
      })
    }
  }
  return levels
}

function legacyStack(architecture?: string[]): ArchitectureStack {
  if (!architecture?.length) return []
  return architecture
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ label: null, nodes: [{ title: line }] }))
}

function normalizeLayout(value: unknown): ArchitectureLayout {
  return value === "flow" || value === "clustered" ? value : "stack"
}

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
  const stack = normalizeStack(p.architectureStack)
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
    architectureStack: stack.length ? stack : legacyStack(p.architecture),
    architectureLayout: normalizeLayout(p.architectureLayout),
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
