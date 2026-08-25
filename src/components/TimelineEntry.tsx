'use client';

import ScrollReveal from "./ScrollReveal";

interface TimelineEntryProps {
  period: string;
  role: string;
  company: string;
  points: string[];
}

function TimelineEntry({ period, role, company, points }: TimelineEntryProps) {
  return (
    <ScrollReveal className="timeline-entry" distance={60} delay={0.1} duration={0.7}>
      <div className="timeline-dot" aria-hidden="true" />
      <div className="timeline-content">
        <span className="timeline-period">{period}</span>
        <h3 className="timeline-role">{role}</h3>
        <p className="timeline-company">{company}</p>
        <ul className="timeline-bullets">
          {points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
    </ScrollReveal>
  );
}

export default TimelineEntry;
