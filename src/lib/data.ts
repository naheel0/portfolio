if (typeof window !== "undefined") {
  throw new Error("lib/data.ts is server-only — do not import from client components");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me"

export interface ResolvedSkill {
  name: string
  color: string
  icon: string
}

export interface Contribution {
  date: string
  count: number
}

interface SkillGroup { label: string; skills: string[] }
interface ResumeExp { role: string; company: string; period: string; points: string[] }
interface ResumeProj { name: string; githubUrl: string | null; points: string[] }
interface ResumeEdu { degree: string; school: string; period: string; coursework: string | null }

export interface ResumeData {
  pdfUrl: string
  summary: string
  skillGroups: SkillGroup[]
  experience: ResumeExp[]
  projects: ResumeProj[]
  education: ResumeEdu[]
}

export interface ContributionsData {
  contributions: Contribution[]
  totalContributions: number
  error: string | null
}

// ── Fallbacks ────────────────────────────────────────────────────

const fallbackSkills: ResolvedSkill[] = [
  { name: "Javascript", color: "#F7DF1E", icon: "FaJs" },
  { name: "HTML", color: "#E34F26", icon: "FaHtml5" },
  { name: "CSS", color: "#1572B6", icon: "FaCss3Alt" },
  { name: "React", color: "#61DAFB", icon: "FaReact" },
  { name: "Git", color: "#F05032", icon: "FaGitAlt" },
  { name: "GitHub", color: "#22d3ee", icon: "FaGithub" },
  { name: "Redux", color: "#764ABC", icon: "SiRedux" },
  { name: "Tailwind CSS", color: "#38B2AC", icon: "SiTailwindcss" },
  { name: "Bootstrap", color: "#7952B3", icon: "FaBootstrap" },
  { name: ".NET", color: "#6a1b9a", icon: "DiDotnet" },
  { name: "C#", color: "#00c853", icon: "DiDotnet" },
  { name: "SQL Server", color: "#CC2927", icon: "DiMsqlServer" },
  { name: "ADO.NET", color: "#0078D4", icon: "TbDatabase" },
  { name: "Entity Framework", color: "#7B4F9E", icon: "TbServer" },
  { name: "ASP.NET", color: "#0E6EC2", icon: "DiDotnet" },
]

const fallbackTools: ResolvedSkill[] = [
  { name: "VS Code", color: "#007ACC", icon: "TbBrandVscode" },
  { name: "Visual Studio", color: "#5C2D91", icon: "TbBrandVisualStudio" },
  { name: "SQL Server Management Studio", color: "#CC2927", icon: "DiMsqlServer" },
]

const FALLBACK_SUMMARY =
  "Full Stack Developer (.NET + React) with a BCA and hands-on internship experience building RESTful APIs, JWT-authenticated backends, and responsive frontends. Skilled in Clean Architecture, ASP.NET Core, Entity Framework, and SQL Server. Passionate about building scalable, secure web applications for SaaS, startup, and e-commerce environments. Open to remote and onsite opportunities across India (based in Kerala)."

const FALLBACK_SKILL_GROUPS: SkillGroup[] = [
  { label: "Frontend", skills: ["React", "JavaScript (ES6)", "HTML5", "CSS3"] },
  { label: "Backend", skills: ["C#", "ASP.NET Core", "RESTful API", "JWT Authentication"] },
  { label: "Database & ORM", skills: ["SQL Server", "Entity Framework Core", "ADO.NET"] },
  { label: "Architecture & Patterns", skills: ["Clean Architecture", "Dependency Injection"] },
  { label: "Tools & DevOps", skills: ["Git", "GitHub", "Swagger / OpenAPI"] },
  { label: "Languages", skills: ["English", "Malayalam"] },
]

const FALLBACK_EXPERIENCE: ResumeExp[] = [
  {
    role: "Software Developer Intern",
    company: "Bridgeon Solutions",
    period: "Jul 2025 – Present",
    points: [
      "Developed production-ready RESTful APIs using ASP.NET Core and Clean Architecture, ensuring scalable and maintainable backend services.",
      "Implemented JWT-based authentication with refresh tokens and role-based access control to secure multiple backend services.",
      "Built responsive React frontend components with lazy loading and state management, improving user experience and interface performance.",
      "Designed normalized SQL Server schemas using Entity Framework Core and ADO.NET, ensuring efficient data access and referential integrity.",
      "Validated all API endpoints with Swagger and automated token authentication flows to guarantee reliability and security.",
      "Collaborated in an Agile team using Git/GitHub, actively participating in code reviews, sprint planning, and retrospectives.",
    ],
  },
]

const FALLBACK_PROJECTS: ResumeProj[] = [
  {
    name: "Gamehub – Full-Stack E-Commerce Website",
    githubUrl: "https://github.com/naheel0/GameHub-fullstack",
    points: [
      "Implemented secure JWT authentication (access & refresh tokens), middleware-based session validation, and role-based access control.",
      "Developed scalable backend services with ASP.NET Core following Clean Architecture and RESTful API design principles.",
      "Designed optimized relational database schemas in SQL Server using Entity Framework and ADO.NET for game listings, user profiles, carts, and orders.",
      "Integrated Razorpay payment gateway, handling payment callbacks, order confirmation, and transaction status updates.",
      "Built dynamic cart functionality (add, update, remove, clear) and order processing workflows with real-time total recalculations.",
      "Created a responsive frontend using React, HTML, CSS, and JavaScript with lazy loading and state management.",
      "Documented and tested all API endpoints using Swagger, ensuring reliability, security standards, and ease of integration.",
    ],
  },
]

const FALLBACK_EDUCATION: ResumeEdu[] = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    school: "MES KVM College, Valanchery – Calicut University, Kerala",
    period: "2022 – 2025",
    coursework: "Data Structures & Algorithms, Web Development, DBMS, OOP, Software Engineering, Computer Networks",
  },
]

const fallbackResume: ResumeData = {
  pdfUrl: "/Naheel.pdf",
  summary: FALLBACK_SUMMARY,
  skillGroups: FALLBACK_SKILL_GROUPS,
  experience: FALLBACK_EXPERIENCE,
  projects: FALLBACK_PROJECTS,
  education: FALLBACK_EDUCATION,
}

function buildDemoContributions(): Contribution[] {
  const data: Contribution[] = []
  const today = new Date()
  let currentStreak = 0
  let lastCount = 1

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const month = date.getMonth()
    const isHolidaySeason = month === 11 || month === 0

    let count: number
    if (isWeekend) {
      if (Math.random() < 0.6) count = 0
      else if (Math.random() < 0.8) count = 1
      else count = 2
    } else if (isHolidaySeason) {
      if (Math.random() < 0.4) count = 0
      else if (Math.random() < 0.7) count = 1
      else if (Math.random() < 0.9) count = 2
      else count = 3
    } else {
      const rand = Math.random()
      if (rand < 0.2) count = 0
      else if (rand < 0.5) count = 1
      else if (rand < 0.75) count = 2
      else if (rand < 0.9) count = 3
      else count = 4
    }

    if (currentStreak > 0 && currentStreak < 5) {
      if (Math.random() < 0.7) {
        count = Math.min(4, lastCount)
        currentStreak++
      } else {
        currentStreak = 0
      }
    } else if (!isWeekend && count > 0 && Math.random() < 0.4) {
      currentStreak = 1
    }

    lastCount = count
    data.push({ date: date.toISOString().split("T")[0], count })
  }
  return data
}

const demoContributions: ContributionsData = (() => {
  const contributions = buildDemoContributions()
  return {
    contributions,
    totalContributions: contributions.reduce((sum, day) => sum + day.count, 0),
    error: null,
  }
})()

// ── Public data loaders ──────────────────────────────────────────

export async function getSkills(): Promise<{ skills: ResolvedSkill[]; tools: ResolvedSkill[] }> {
  try {
    const res = await fetch(`${API_URL}/api/portfolio/skills`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    const data = await res.json()
    const skills: ResolvedSkill[] = []
    const tools: ResolvedSkill[] = []
    for (const item of data) {
      if (!item || !item.icon || typeof item.icon !== "string") continue
      const resolved: ResolvedSkill = { name: item.name, color: item.color, icon: item.icon }
      if (item.type === "tool") tools.push(resolved)
      else skills.push(resolved)
    }
    return {
      skills: skills.length > 0 ? skills : fallbackSkills,
      tools: tools.length > 0 ? tools : fallbackTools,
    }
  } catch {
    return { skills: fallbackSkills, tools: fallbackTools }
  }
}

export async function getResume(): Promise<ResumeData> {
  try {
    const res = await fetch(`${API_URL}/api/portfolio/resume`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    const data = await res.json()
    return {
      pdfUrl: data.pdfUrl || fallbackResume.pdfUrl,
      summary: data.summary || fallbackResume.summary,
      skillGroups: data.skillGroups?.length ? data.skillGroups : fallbackResume.skillGroups,
      experience: data.experience?.length ? data.experience : fallbackResume.experience,
      projects: data.projects?.length ? data.projects : fallbackResume.projects,
      education: data.education?.length ? data.education : fallbackResume.education,
    }
  } catch {
    return fallbackResume
  }
}

export async function getContributions(): Promise<ContributionsData> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return {
      ...demoContributions,
      error: "Add GITHUB_TOKEN to Vercel environment variables for real GitHub data",
    }
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Naheel-Portfolio",
      },
      body: JSON.stringify({
        query: `
          query {
            user(login: "naheel0") {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
      }),
      next: { revalidate: 21600 },
    })

    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`)

    const result = await response.json()
    if (result.errors) throw new Error(`GitHub API Error: ${result.errors[0].message}`)
    if (!result.data?.user) throw new Error("Invalid response format from GitHub API")

    const calendarData = result.data.user.contributionsCollection.contributionCalendar
    const contributions: Contribution[] = []
    calendarData.weeks.forEach(
      (week: { contributionDays: { date: string; contributionCount: number }[] }) => {
        week.contributionDays.forEach((day) => {
          contributions.push({ date: day.date, count: day.contributionCount })
        })
      }
    )

    return {
      contributions,
      totalContributions: calendarData.totalContributions || 0,
      error: null,
    }
  } catch (err) {
    return {
      ...demoContributions,
      error: `Real data unavailable: ${err instanceof Error ? err.message : "Unknown error"}`,
    }
  }
}

// Re-export the portfolio project type + loader so sections share one source of truth
export { getSettings, getProjects } from "./api"
export type { SiteSettings, PortfolioProject } from "./api"
