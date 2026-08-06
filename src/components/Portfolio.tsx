import { lazy, Suspense } from 'react';
import { getSettings } from "@/lib/api";
import HomeContent from "./HomeContent";
import LazySection from "./LazySection";

const AboutContent = lazy(() => import("./AboutContent"));
const SkillsSection = lazy(() => import("./SkillsSection"));
const ProjectsContent = lazy(() => import("./ProjectsContent"));
const ContactContent = lazy(() => import("./ContactContent"));

const SectionLoader = () => <div style={{ minHeight: '50vh' }} />;

const Portfolio = async () => {
  const settings = await getSettings();
  return (
    <>
      <HomeContent />
      <Suspense fallback={<SectionLoader />}>
        <AboutContent />
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