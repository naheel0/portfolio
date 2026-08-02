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

export async function getSettings(): Promise<SiteSettings> {
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
}
