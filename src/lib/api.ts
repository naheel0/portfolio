import { cache } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me"

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
}

export interface PortfolioProject {
  id: number
  title: string
  description: string
  image: string
  githubUrl: string
  demoUrl: string
  technologies: string[]
  category: string
  featured?: boolean
}

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

function mapProject(p: AdminProject, index: number): PortfolioProject {
  return {
    id: index + 1,
    title: p.title,
    description: p.description,
    image: p.imageUrl || "/images/placeholder.svg",
    githubUrl: p.githubUrl || "#",
    demoUrl: p.liveUrl || "#",
    technologies: p.technologies || [],
    category: p.category,
    featured: p.featured,
  }
}

export async function getProjects(mapper: (p: AdminProject, i: number) => PortfolioProject = mapProject): Promise<PortfolioProject[]> {
  try {
    const res = await fetch(`${API_URL}/api/portfolio/projects`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    const data: AdminProject[] = await res.json()
    if (data.length === 0) return []
    return data.map(mapper)
  } catch {
    return []
  }
}
