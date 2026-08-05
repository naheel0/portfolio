'use client';

import React, { useMemo } from 'react';
import { useTiltContainer } from "@/lib/useTiltContainer";
import { useReveal } from "@/lib/useReveal";
import { iconMap, DefaultIcon } from "@/lib/icon-map";
import type { ResolvedSkill, Contribution, ContributionsData } from '@/lib/data';

interface SkillsBodyProps {
  skills: ResolvedSkill[];
  tools: ResolvedSkill[];
  contributions: ContributionsData;
}

interface ResolvedWithIcon extends ResolvedSkill {
  iconComponent: React.ComponentType<any> | null;
}

const LEVEL_COLORS = [
  "#0a0e1f",
  "#164e63",
  "#0e7490",
  "#0891b2",
  "#22d3ee",
] as const;

const getLevel = (count: number): number => {
  if (count === 0) return 0;
  if (count < 10) return 1;
  if (count < 20) return 2;
  if (count < 30) return 3;
  return 4;
};

interface SkillPillProps {
  name: string;
  color: string;
  icon: React.ComponentType<any>;
}

function SkillPill({ name, color, icon: Icon }: SkillPillProps) {
  const revealRef = useReveal<HTMLDivElement>(0.3);

  return (
    <div
      ref={revealRef}
      className="skill-pill tilt-3d skill-pill-reveal"
      style={{ "--skill-color": color } as React.CSSProperties}
    >
      <span className="skill-pill-icon" style={{ color }}>
        <Icon aria-hidden="true" />
      </span>
      <span className="skill-pill-name">{name}</span>
    </div>
  );
}

const resolve = (items: ResolvedSkill[]): ResolvedWithIcon[] =>
  items.map((it) => ({
    ...it,
    iconComponent: it.icon ? iconMap[it.icon] || DefaultIcon : DefaultIcon,
  }));

function SkillsBody({ skills, tools, contributions }: SkillsBodyProps) {
  const resolvedSkills = useMemo(() => resolve(skills), [skills]);
  const resolvedTools = useMemo(() => resolve(tools), [tools]);

  const skillsTitleRef = useReveal<HTMLHeadingElement>();
  const skillsPillsRef = useReveal<HTMLDivElement>(0.1);
  const skillsTiltRef = useTiltContainer<HTMLDivElement>();
  const toolsTitleRef = useReveal<HTMLHeadingElement>();
  const toolsPillsRef = useReveal<HTMLDivElement>(0.1);
  const toolsTiltRef = useTiltContainer<HTMLDivElement>();
  const contribTitleRef = useReveal<HTMLHeadingElement>();
  const calendarRef = useReveal<HTMLDivElement>(0.1);
  const footerRef = useReveal<HTMLDivElement>();

  const displayTotal = contributions.totalContributions > 0
    ? contributions.totalContributions
    : contributions.contributions.reduce((sum, day) => sum + day.count, 0);

  const { gridWeeks, monthLabels, flatDays } = useMemo(() => {
    if (contributions.contributions.length === 0) return { gridWeeks: [] as (Contribution | null)[][], monthLabels: [] as { weekIndex: number; label: string }[], flatDays: [] as { date: string; count: number; level: number; tooltip: string }[] };

    const firstDate = new Date(contributions.contributions[0].date + "T00:00:00");
    const startOffset = firstDate.getDay();

    const flat: (Contribution | null)[] = [
      ...Array(startOffset).fill(null),
      ...contributions.contributions,
    ];
    const weeks: (Contribution | null)[][] = [];
    for (let i = 0; i < flat.length; i += 7) {
      weeks.push(flat.slice(i, i + 7));
    }

    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstDay = week.find((d) => d !== null);
      if (firstDay) {
        const m = new Date(firstDay.date + "T00:00:00").getMonth();
        if (m !== lastMonth) {
          labels.push({ weekIndex: wi, label: MONTHS[m] });
          lastMonth = m;
        }
      }
    });

    const precomputed = contributions.contributions.map((c) => {
      const d = new Date(c.date + "T00:00:00");
      const month = MONTHS[d.getMonth()];
      const day = d.getDate();
      const year = d.getFullYear();
      return {
        date: c.date,
        count: c.count,
        level: getLevel(c.count),
        tooltip: `${c.count} contribution${c.count !== 1 ? "s" : ""} on ${month} ${day}, ${year}`,
      };
    });

    return { gridWeeks: weeks, monthLabels: labels, flatDays: precomputed };
  }, [contributions]);

  return (
    <div className="main-bg" id="skills">
      <div className="skills-section">
        <h2 className="skills-title skill-scroll-reveal" ref={skillsTitleRef}>
          Professional <span>Skillset</span>
        </h2>
        <div
          ref={(el) => {
            (skillsPillsRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            (skillsTiltRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          className="skills-pills skill-scroll-reveal"
        >
          {resolvedSkills.map((skill) => (
            <SkillPill
              key={skill.name}
              name={skill.name}
              color={skill.color}
              icon={skill.iconComponent!}
            />
          ))}
        </div>

        <h2 className="skills-title skill-scroll-reveal" ref={toolsTitleRef} style={{ marginTop: "60px" }}>
          Tools <span>I Use</span>
        </h2>
        <div
          ref={(el) => {
            (toolsPillsRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            (toolsTiltRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          className="skills-pills skill-scroll-reveal"
        >
          {resolvedTools.map((tool) => (
            <SkillPill
              key={tool.name}
              name={tool.name}
              color={tool.color}
              icon={tool.iconComponent!}
            />
          ))}
        </div>
      </div>

      <div className="contributions-section">
        <h2 className="contributions-title skill-scroll-reveal" ref={contribTitleRef}>
          Days I Spent <span>Coding</span>
        </h2>

        {contributions.error && <div className="error-message">{contributions.error}</div>}

        <div className="calendar-container skill-scroll-reveal" ref={calendarRef}>
          <div className="calendar-body">
            <div className="calendar-day-labels">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
                <div key={i} className="day-label">{label}</div>
              ))}
            </div>

            <div className="calendar-right">
              <div className="calendar-months">
                {gridWeeks.map((_, wi) => {
                  const label = monthLabels.find((m) => m.weekIndex === wi);
                  return (
                    <div key={wi} className="month-label">
                      {label ? label.label : ""}
                    </div>
                  );
                })}
              </div>

              <div className="calendar-grid">
                {gridWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="week-column">
                    {week.map((day, dayIndex) => {
                      if (!day) {
                        return <div key={`${weekIndex}-${dayIndex}`} className="contribution-day contribution-day-empty" />;
                      }
                      const flatIndex = weekIndex * 7 + dayIndex - (gridWeeks[0]?.length === 7 ? 0 : 0);
                      const precomputed = flatDays.find((f) => f.date === day.date);
                      const level = precomputed?.level ?? 0;
                      const tooltip = precomputed?.tooltip ?? '';
                      const colorClass = `contribution-day-l${level}`;
                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`contribution-day ${colorClass}`}
                          title={tooltip}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="calendar-footer skill-scroll-reveal" ref={footerRef}>
            <div className="calendar-legend">
              <span>Less</span>
              <div className="legend-colors">
                {LEVEL_COLORS.map((color, level) => (
                  <div
                    key={level}
                    className="legend-color"
                    style={{ backgroundColor: color }}
                    title={["No contributions", "1–9", "10–19", "20–29", "30+"][level]}
                  />
                ))}
              </div>
              <span>More</span>
            </div>

            <div className="contributions-count">
              <strong>{displayTotal.toLocaleString()}</strong>{" "}
              contributions in the last year
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsBody;