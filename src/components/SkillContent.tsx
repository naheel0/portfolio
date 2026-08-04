'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTilt3D } from "@/lib/useTilt3D";

interface Contribution {
  date: string;
  count: number;
}

interface SkillItem {
  name: string;
  color: string;
  icon: React.ComponentType<any>;
}

interface SkillContentProps {
  skills: SkillItem[];
  tools: SkillItem[];
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

const mockData: Contribution[] = (() => {
  const data: Contribution[] = [];
  const today = new Date();
  let currentStreak = 0;
  let lastCount = 1;

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const month = date.getMonth();
    const isHolidaySeason = month === 11 || month === 0;

    let count: number;
    if (isWeekend) {
      if (Math.random() < 0.6) count = 0;
      else if (Math.random() < 0.8) count = 1;
      else count = 2;
    } else if (isHolidaySeason) {
      if (Math.random() < 0.4) count = 0;
      else if (Math.random() < 0.7) count = 1;
      else if (Math.random() < 0.9) count = 2;
      else count = 3;
    } else {
      const rand = Math.random();
      if (rand < 0.2) count = 0;
      else if (rand < 0.5) count = 1;
      else if (rand < 0.75) count = 2;
      else if (rand < 0.9) count = 3;
      else count = 4;
    }

    if (currentStreak > 0 && currentStreak < 5) {
      if (Math.random() < 0.7) {
        count = Math.min(4, lastCount);
        currentStreak++;
      } else {
        currentStreak = 0;
      }
    } else if (!isWeekend && count > 0 && Math.random() < 0.4) {
      currentStreak = 1;
    }

    lastCount = count;
    data.push({ date: date.toISOString().split("T")[0], count });
  }
  return data;
})();

interface SkillPillProps {
  name: string;
  color: string;
  icon: React.ComponentType<any>;
}

function SkillPill({ name, color, icon: Icon }: SkillPillProps) {
  const tiltRef = useTilt3D<HTMLDivElement>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={(el) => { (ref as React.MutableRefObject<HTMLDivElement | null>).current = el; (tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = el; }}
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

function useScrollReveal(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

function SkillContent({ skills, tools }: SkillContentProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState(0);

  const skillsTitleRef = useScrollReveal();
  const skillsPillsRef = useScrollReveal(0.1);
  const toolsTitleRef = useScrollReveal();
  const toolsPillsRef = useScrollReveal(0.1);
  const contribTitleRef = useScrollReveal();
  const calendarRef = useScrollReveal(0.1);
  const footerRef = useScrollReveal();

  const useDemoData = useCallback((errorMessage: string) => {
    const demoTotal = mockData.reduce((sum, day) => sum + day.count, 0);
    setContributions(mockData);
    setTotalContributions(demoTotal);
    setError(errorMessage);
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    if (!token) {
      useDemoData(
        "Add NEXT_PUBLIC_GITHUB_TOKEN to Vercel environment variables for real GitHub data"
      );
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "Naheel-Portfolio",
          },
          body: JSON.stringify({
            query: `
              query {
                user(login: "naheel0") {
                  contributionsCollection {
                    contributionCalendar {
                      totalContributions
                      weeks {
                        contributionDays {
                          contributionCount
                          date
                        }
                      }
                    }
                  }
                }
              }
            `,
          }),
        });

        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

        const result = await response.json();
        if (result.errors) throw new Error(`GitHub API Error: ${result.errors[0].message}`);
        if (!result.data?.user) throw new Error("Invalid response format from GitHub API");

        const calendarData = result.data.user.contributionsCollection.contributionCalendar;
        const contribs: Contribution[] = [];

        calendarData.weeks.forEach(
          (week: { contributionDays: { date: string; contributionCount: number }[] }) => {
            week.contributionDays.forEach((day) => {
              contribs.push({ date: day.date, count: day.contributionCount });
            });
          }
        );

        if (!cancelled) {
          setContributions(contribs);
          setTotalContributions(calendarData.totalContributions || 0);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          useDemoData(`Real data unavailable: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [useDemoData]);

  const displayTotal = useMemo(
    () => totalContributions > 0 ? totalContributions : contributions.reduce((sum, day) => sum + day.count, 0),
    [totalContributions, contributions]
  );

  const { gridWeeks, monthLabels } = useMemo(() => {
    if (contributions.length === 0) return { gridWeeks: [], monthLabels: [] };

    const firstDate = new Date(contributions[0].date + "T00:00:00");
    const startOffset = firstDate.getDay();

    const flat: (Contribution | null)[] = [
      ...Array(startOffset).fill(null),
      ...contributions,
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

    return { gridWeeks: weeks, monthLabels: labels };
  }, [contributions]);

  return (
    <div className="main-bg" id="skills">
      <div className="skills-section">
          <h2 className="skills-title skill-scroll-reveal" ref={skillsTitleRef}>
            Professional <span>Skillset</span>
          </h2>
          <div className="skills-pills skill-scroll-reveal" ref={skillsPillsRef}>
            {skills.map((skill) => (
              <SkillPill
                key={skill.name}
                name={skill.name}
                color={skill.color}
                icon={skill.icon}
              />
            ))}
          </div>

          <h2 className="skills-title skill-scroll-reveal" ref={toolsTitleRef} style={{ marginTop: "60px" }}>
            Tools <span>I Use</span>
          </h2>
          <div className="skills-pills skill-scroll-reveal" ref={toolsPillsRef}>
            {tools.map((tool) => (
              <SkillPill
                key={tool.name}
                name={tool.name}
                color={tool.color}
                icon={tool.icon}
              />
            ))}
          </div>
      </div>

      <div className="contributions-section">
        <h2 className="contributions-title skill-scroll-reveal" ref={contribTitleRef}>
          Days I Spent <span>Coding</span>
        </h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">
            <div className="skill-scroll-reveal visible">
              Loading GitHub contributions...
            </div>
          </div>
        ) : (
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
                      const level = day ? getLevel(day.count) : -1;
                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className="contribution-day"
                          style={{
                            backgroundColor: level >= 0 ? LEVEL_COLORS[level] : "transparent",
                            visibility: day ? "visible" : "hidden",
                          }}
                          title={
                            day?.date
                              ? `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${new Date(day.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                              : undefined
                          }
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
        )}
      </div>
    </div>
  );
}

export default SkillContent;
