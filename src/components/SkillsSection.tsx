import { getSkills, getContributions } from "@/lib/data";
import SkillsBody from "./SkillsBody";
import LazySection from "./LazySection";

export default async function SkillsSection() {
  const [{ skills, tools }, contributions] = await Promise.all([
    getSkills(),
    getContributions(),
  ]);

  return (
    <LazySection>
      <SkillsBody skills={skills} tools={tools} contributions={contributions} />
    </LazySection>
  );
}