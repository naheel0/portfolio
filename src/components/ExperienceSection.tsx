'use client';

import type { ResumeData } from "@/lib/data";
import TimelineEntry from "./TimelineEntry";
import ScrollReveal from "./ScrollReveal";
import "./ExperienceSection.css";

function ExperienceSection({ data }: { data: ResumeData }) {
  const { experience, education } = data;

  return (
    <section className="experience-section" id="experience">
      <div className="experience-container">
        <ScrollReveal className="experience-title-wrap" distance={50} duration={0.6}>
          <h2 className="experience-title">
            MY <span>JOURNEY</span>
          </h2>
        </ScrollReveal>
        <div className="timeline">
          {experience.map((job) => (
            <TimelineEntry
              key={job.role}
              period={job.period}
              role={job.role}
              company={job.company}
              points={job.points}
            />
          ))}
          {education.map((edu) => (
            <TimelineEntry
              key={edu.degree}
              period={edu.period}
              role={edu.degree}
              company={edu.school}
              points={edu.coursework ? [`Relevant Coursework: ${edu.coursework}`] : []}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
