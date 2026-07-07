'use client';

import dynamic from "next/dynamic";

// All sections are server-side rendered (ssr: true) so search engines can
// crawl the full content. framer-motion animations still run client-side
// via 'use client' on each component; the initial HTML is complete.
const HomeContent = dynamic(() => import('./HomeContent'), { ssr: true });
const AboutContent = dynamic(() => import('./AboutContent'), { ssr: true });
const ProjectsContent = dynamic(() => import('./ProjectsContent'), { ssr: true });
const SkillContent = dynamic(() => import('./SkillContent'), { ssr: true });
const ContactContent = dynamic(() => import('./ContactContent'), { ssr: true });

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
