import dynamic from "next/dynamic";
import { getSettings } from "@/lib/api";
import HomeContent from "./HomeContent";

const AboutContent = dynamic(() => import("./AboutContent"), { loading: () => null });
const SkillsSection = dynamic(() => import("./SkillsSection"), { loading: () => null });
const ProjectsContent = dynamic(() => import("./ProjectsContent"), { loading: () => null });
const ContactContent = dynamic(() => import("./ContactContent"), { loading: () => null });

const Portfolio = async () => {
  const settings = await getSettings();
  return (
    <>
      <HomeContent />
      <AboutContent />
      <SkillsSection />
      <ProjectsContent />
      <ContactContent settings={settings} />
    </>
  );
};

export default Portfolio;