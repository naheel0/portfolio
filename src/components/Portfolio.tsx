import { lazy, Suspense } from 'react';
import { getSettings } from "@/lib/api";
import { getResume } from "@/lib/data";
import HomeContent from "./HomeContent";
import LazySection from "./LazySection";

const AboutContent = lazy(() => import("./AboutContent"));
const ExperienceSection = lazy(() => import("./ExperienceSection"));
const SkillsSection = lazy(() => import("./SkillsSection"));
const ProjectsContent = lazy(() => import("./ProjectsContent"));
const ContactContent = lazy(() => import("./ContactContent"));

const SectionLoader = () => <div style={{ minHeight: '50vh' }} />;

const Portfolio = async () => {
  const [settings, resume] = await Promise.all([getSettings(), getResume()]);
  return (
    <>
      <HomeContent />
      <Suspense fallback={<SectionLoader />}>
        <AboutContent />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ExperienceSection data={resume} />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <SkillsSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ProjectsContent />
      </Suspense>
      <LazySection>
        <Suspense fallback={<SectionLoader />}>
          <ContactContent settings={settings} />
        </Suspense>
      </LazySection>
    </>
  );
};

export default Portfolio;