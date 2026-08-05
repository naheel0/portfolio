import { getSettings } from "@/lib/api";
import HomeContent from "./HomeContent";
import AboutContent from "./AboutContent";
import SkillsSection from "./SkillsSection";
import ProjectsContent from "./ProjectsContent";
import ContactContent from "./ContactContent";
import LazySection from "./LazySection";

const Portfolio = async () => {
  const settings = await getSettings();
  return (
    <>
      <HomeContent />
      <AboutContent />
      <SkillsSection />
      <ProjectsContent />
      <LazySection>
        <ContactContent settings={settings} />
      </LazySection>
    </>
  );
};

export default Portfolio;