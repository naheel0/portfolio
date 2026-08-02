import { iconMap } from "@/lib/icon-map"
import SkillContent from "./SkillContent"

interface Skill {
  id: string
  name: string
  slug: string
  type: string
  color: string
  icon: string | null
  order: number
}

interface ResolvedSkill {
  name: string
  color: string
  icon: React.ComponentType<any>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me"

const fallbackSkills: ResolvedSkill[] = [
  { name: "Javascript", color: "#F7DF1E", icon: iconMap.FaJs },
  { name: "HTML", color: "#E34F26", icon: iconMap.FaHtml5 },
  { name: "CSS", color: "#1572B6", icon: iconMap.FaCss3Alt },
  { name: "React", color: "#61DAFB", icon: iconMap.FaReact },
  { name: "Git", color: "#F05032", icon: iconMap.FaGitAlt },
  { name: "GitHub", color: "#22d3ee", icon: iconMap.FaGithub },
  { name: "Redux", color: "#764ABC", icon: iconMap.SiRedux },
  { name: "Tailwind CSS", color: "#38B2AC", icon: iconMap.SiTailwindcss },
  { name: "Bootstrap", color: "#7952B3", icon: iconMap.FaBootstrap },
  { name: ".NET", color: "#6a1b9a", icon: iconMap.DiDotnet },
  { name: "C#", color: "#00c853", icon: iconMap.FaCSharp },
  { name: "SQL Server", color: "#CC2927", icon: iconMap.DiMsqlServer },
  { name: "ADO.NET", color: "#0078D4", icon: iconMap.TbDatabase },
  { name: "Entity Framework", color: "#7B4F9E", icon: iconMap.TbServer },
  { name: "ASP.NET", color: "#0E6EC2", icon: iconMap.DiDotnet },
]

const fallbackTools: ResolvedSkill[] = [
  { name: "VS Code", color: "#007ACC", icon: iconMap.TbBrandVscode },
  { name: "Visual Studio", color: "#5C2D91", icon: iconMap.SiVisualstudio },
  { name: "SQL Server Management Studio", color: "#CC2927", icon: iconMap.DiMsqlServer },
]

async function fetchSkills(): Promise<{ skills: ResolvedSkill[]; tools: ResolvedSkill[] }> {
  try {
    const res = await fetch(`${API_URL}/api/portfolio/skills`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    const data: Skill[] = await res.json()

    const skills: ResolvedSkill[] = []
    const tools: ResolvedSkill[] = []

    for (const item of data) {
      const iconComponent = item.icon ? iconMap[item.icon] : null
      if (!iconComponent) continue

      const resolved = {
        name: item.name,
        color: item.color,
        icon: iconComponent,
      }

      if (item.type === "tool") {
        tools.push(resolved)
      } else {
        skills.push(resolved)
      }
    }

    return {
      skills: skills.length > 0 ? skills : fallbackSkills,
      tools: tools.length > 0 ? tools : fallbackTools,
    }
  } catch {
    return { skills: fallbackSkills, tools: fallbackTools }
  }
}

export default async function SkillsSection() {
  const { skills, tools } = await fetchSkills()
  return <SkillContent skills={skills} tools={tools} />
}
