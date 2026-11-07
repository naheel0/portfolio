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
  metaTitle: string | null
  metaDescription: string | null
  googleVerification: string | null
  bingVerification: string | null
  devtoUsername: string | null
  openToWork: boolean
  openToWorkMessage: string | null
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
  metaTitle: null,
  metaDescription: null,
  googleVerification: null,
  bingVerification: null,
  devtoUsername: null,
  openToWork: false,
  openToWorkMessage: null,
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

// ── Dev.to articles ───────────────────────────────────────────────────

export interface DevtoArticle {
  id: number
  slug: string
  title: string
  description: string
  url: string
  canonical_url: string | null
  cover_image: string | null
  tag_list: string[]
  published_at: string
  readable_publish_date: string
  reading_time_minutes: number
  positive_reactions_count: number
  published_timestamp: number
}

export const getDevtoArticles = cache(async function getDevtoArticles(username?: string | null): Promise<DevtoArticle[]> {
  if (!username) return []
  try {
    const res = await fetch(`https://dev.to/api/articles?username=${encodeURIComponent(username)}&per_page=12`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const raw = await res.json()
    if (!Array.isArray(raw)) return []
    return raw.map((a: any) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      description: a.description,
      url: a.url,
      canonical_url: a.canonical_url ?? null,
      cover_image: a.cover_image ?? a.social_image ?? null,
      tag_list: a.tag_list || [],
      published_at: a.published_at,
      readable_publish_date: a.readable_publish_date,
      reading_time_minutes: a.reading_time_minutes ?? 0,
      positive_reactions_count: a.positive_reactions_count ?? 0,
      published_timestamp: a.published_timestamp ?? 0,
    }))
  } catch {
    return []
  }
})

export interface DevtoArticleFull extends DevtoArticle {
  body_html: string
}

// Single article by username+slug — includes the full body_html
export const getDevtoArticle = cache(async function getDevtoArticle(
  username: string,
  slug: string,
): Promise<DevtoArticleFull | null> {
  try {
    const res = await fetch(
      `https://dev.to/api/articles/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null
    const a = await res.json()
    if (!a || !a.body_html) return null
    const toTags = (v: unknown): string[] =>
      Array.isArray(v) ? v : typeof v === "string" ? v.split(",").map((t) => t.trim()).filter(Boolean) : []
    return {
      id: a.id,
      slug: a.slug,
      title: a.title,
      description: a.description,
      url: a.url,
      canonical_url: a.canonical_url ?? null,
      cover_image: a.cover_image ?? a.social_image ?? null,
      tag_list: toTags(a.tag_list),
      published_at: a.published_at,
      readable_publish_date: a.readable_publish_date,
      reading_time_minutes: a.reading_time_minutes ?? 0,
      positive_reactions_count: a.positive_reactions_count ?? 0,
      published_timestamp: a.published_timestamp ?? 0,
      body_html: a.body_html,
    }
  } catch {
    return null
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
    return data.map(mapListItem)
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
    return mapDetail(p)
  } catch {
    return null
  }
}


