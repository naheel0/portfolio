import { getSkills, getContributions } from "@/lib/data";
import SkillsBody from "./SkillsBody";

export default async function SkillsSection() {
  const [{ skills, tools }, contributions] = await Promise.all([
    getSkills(),
    getContributions(),
  ]);

  return <SkillsBody skills={skills} tools={tools} contributions={contributions} />;
}