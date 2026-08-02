'use client';

import dynamic from "next/dynamic";

// Code-split all sections (separate chunks) but keep SSR enabled
// so server/client HTML stays identical — no hydration mismatch.
const HomeContent = dynamic(() => import('./HomeContent'), { ssr: true });
const AboutContent = dynamic(() => import('./AboutContent'), { ssr: true });
const SkillsSection = dynamic(() => import('./SkillsSection'), { ssr: true });
const ProjectsContent = dynamic(() => import('./ProjectsContent'), { ssr: true });
const ContactContent = dynamic(() => import('./ContactContent'), { ssr: true });

const Portfolio = () => {
  return (
    <>
      <HomeContent />
      <AboutContent />
      <SkillsSection />
      <ProjectsContent />
      <ContactContent />
    </>
  );
};

export default Portfolio;