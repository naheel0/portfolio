'use client';

import dynamic from "next/dynamic";

const HomeContent = dynamic(() => import('./HomeContent'), { ssr: true });
const AboutContent = dynamic(() => import('./AboutContent'), { ssr: false });
const ProjectsContent = dynamic(() => import('./ProjectsContent'), { ssr: false });
const SkillContent = dynamic(() => import('./SkillContent'), { ssr: false });
const ContactContent = dynamic(() => import('./ContactContent'), { ssr: false });

const Portfolio = () => {
  return (
    <>
      <HomeContent />
      <AboutContent />
      <SkillContent />
      <ProjectsContent />
      <ContactContent />
    </>
  );
};

export default Portfolio;
