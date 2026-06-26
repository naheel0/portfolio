'use client';

import React, { useState, useEffect, useCallback, useMemo, cloneElement } from "react";
import StarsBackground from "./StarsBackground";
import { FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt } from "react-icons/fa";
import { SiRedux, SiTailwindcss, SiBootstrap } from "react-icons/si";
import { DiMsqlServer, DiDotnet } from "react-icons/di";
import { TbDatabase, TbServer, TbBrandVscode, TbBrandVisualStudio } from "react-icons/tb";
import { motion } from "framer-motion";
import { containerVariants, titleVariants } from "@/lib/variants";

const DotnetIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" style={{ display: 'block' }} {...props}>
    <path fill="#6a1b9a" d="M44,24c0,5.694-2.381,10.831-6.2,14.481l-0.006,0.006C34.2,41.9,29.344,44,24,44 C12.956,44,4,35.044,4,24c0-5.338,2.087-10.188,5.5-13.775c0.006-0.013,0.013-0.019,0.019-0.025C13.169,6.381,18.306,4,24,4 C35.044,4,44,12.956,44,24z"/>
    <path fill="#7b1fa2" d="M38.375,37.862c-0.187,0.213-0.381,0.419-0.575,0.619l-0.006,0.006C34.2,41.9,29.344,44,24,44 C12.956,44,4,35.044,4,24c0-5.338,2.087-10.188,5.5-13.775c0.006-0.013,0.013-0.019,0.019-0.025c0.2-0.194,0.406-0.387,0.619-0.575 L38.375,37.862z"/>
    <path fill="#fff" d="M8.626,27.281c-0.236,0.004-0.463-0.091-0.625-0.262c-0.167-0.165-0.259-0.39-0.256-0.625 c-0.002-0.234,0.091-0.459,0.256-0.625c0.161-0.174,0.388-0.272,0.625-0.269c0.237-0.001,0.463,0.097,0.625,0.269 c0.169,0.164,0.263,0.39,0.262,0.625c0.002,0.236-0.093,0.462-0.262,0.625C9.087,27.188,8.861,27.283,8.626,27.281z"/>
    <path fill="#fff" d="M21.044,27.125h-1.638l-5.856-9.087c-0.146-0.224-0.267-0.463-0.363-0.712h-0.05 c0.056,0.519,0.077,1.041,0.062,1.562v8.237h-1.331V15.731h1.731l5.7,8.925c0.237,0.371,0.392,0.625,0.462,0.763h0.031 c-0.066-0.556-0.093-1.115-0.081-1.675v-8.012h1.331V27.125z"/>
    <path fill="#fff" d="M30.057,27.125h-6.056V15.731h5.775v1.206h-4.412v3.788h4.113v1.2h-4.113v3.95h4.7L30.057,27.125z"/>
    <path fill="#fff" d="M39.001,16.938h-3.312v10.188h-1.331V16.938h-3.275v-1.206h7.919V16.938z"/>
  </svg>
);

const CSharpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" style={{ display: 'block' }} {...props}>
    <path fill="#00c853" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0c3.355,1.883,13.451,7.551,16.807,9.434 C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867c0,0.762-0.418,1.466-1.097,1.847 c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0c-3.355-1.883-13.451-7.551-16.807-9.434 C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867c0-0.762,0.418-1.466,1.097-1.847 C9.451,10.837,19.549,5.169,22.903,3.286z"/>
    <path fill="#69f0ae" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255c0-3.744,0-15.014,0-18.759 c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38c0.677-0.379,1.594-0.371,2.271,0.008 c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z"/>
    <path fill="#fff" d="M24,10c-7.73,0-14,6.27-14,14s6.27,14,14,14s14-6.27,14-14S31.73,10,24,10z M24,31 c-3.86,0-7-3.14-7-7s3.14-7,7-7s7,3.14,7,7S27.86,31,24,31z"/>
    <path fill="#00e676" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784c0,3.795-0.032,14.589,0.009,18.384 c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z"/>
    <path fill="#fff" d="M34 20H35V28H34zM37 20H38V28H37z"/>
    <path fill="#fff" d="M32 25H40V26H32zM32 22H40V23H32z"/>
  </svg>
);

interface Contribution {
  date: string;
  count: number;
}

// GitHub's exact contribution level thresholds → our purple theme
const LEVEL_COLORS = [
  "#161025", // 0  — no contributions (background)
  "#3b1a6e", // 1  — 1–9  (low)
  "#6b2fbb", // 2  — 10–19 (medium)
  "#9333ea", // 3  — 20–29 (high)
  "#d8b4fe", // 4  — 30+  (max)
] as const;

// Exact GitHub thresholds: 0, 1–9, 10–19, 20–29, 30+
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

const skills = [
  { name: "Javascript", icon: <FaJs />, color: "#F7DF1E", level: 90 },
  { name: "HTML", icon: <FaHtml5 />, color: "#E34F26", level: 95 },
  { name: "CSS", icon: <FaCss3Alt />, color: "#1572B6", level: 88 },
  { name: "React", icon: <FaReact />, color: "#61DAFB", level: 85 },
  { name: "Git", icon: <FaGitAlt />, color: "#F05032", level: 80 },
  { name: "Redux", icon: <SiRedux />, color: "#764ABC", level: 75 },
  { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "#38B2AC", level: 82 },
  { name: "Bootstrap", icon: <SiBootstrap />, color: "#7952B3", level: 78 },
  { name: ".NET", icon: <DotnetIcon />, color: "#6a1b9a", level: 80 },
  { name: "C#", icon: <CSharpIcon />, color: "#00c853", level: 78 },
  { name: "SQL Server", icon: <DiMsqlServer />, color: "#CC2927", level: 75 },
  { name: "ADO.NET", icon: <TbDatabase />, color: "#0078D4", level: 70 },
  { name: "Entity Framework", icon: <TbServer />, color: "#7B4F9E", level: 72 },
  { name: "ASP.NET", icon: <DiDotnet />, color: "#0E6EC2", level: 76 },
];

const tools = [
  { name: "VS Code", icon: <TbBrandVscode />, color: "#007ACC" },
  { name: "Visual Studio", icon: <TbBrandVisualStudio />, color: "#5C2D91" },
  { name: "SQL Server Management Studio", icon: <DiMsqlServer />, color: "#CC2927" },
];

const skillItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 10 },
  },
  hover: {
    y: -4,
    scale: 1.08,
    transition: { type: "spring" as const, stiffness: 400, damping: 17 },
  },
};

function SkillContent() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState(0);

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

  // Build a 53-column grid aligned by day-of-week, with month label data
  const { gridWeeks, monthLabels } = useMemo(() => {
    if (contributions.length === 0) return { gridWeeks: [], monthLabels: [] };

    // Pad to align first day to its day-of-week (0=Sun)
    const firstDate = new Date(contributions[0].date + "T00:00:00");
    const startOffset = firstDate.getDay(); // 0-6

    // Build flat array: offset nulls + contributions, chunked into weeks of 7
    const flat: (Contribution | null)[] = [
      ...Array(startOffset).fill(null),
      ...contributions,
    ];
    const weeks: (Contribution | null)[][] = [];
    for (let i = 0; i < flat.length; i += 7) {
      weeks.push(flat.slice(i, i + 7));
    }

    // Month labels: find first week where a new month starts
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

  if (loading) {
    return (
      <div className="main-bg" id="skills">
        <StarsBackground />
        <div className="contributions-section">
          <motion.h2
            className="contributions-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Days I Code
          </motion.h2>
          <div className="loading">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              Loading GitHub contributions...
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-bg" id="skills">
      <StarsBackground />

      <div className="skills-section">
          <motion.h2
            className="skills-title"
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Professional <span>Skillset</span>
          </motion.h2>
          <motion.div
            className="skills-pills"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                className="skill-pill"
                variants={skillItemVariants}
                whileHover="hover"
                style={{ "--skill-color": skill.color } as React.CSSProperties}
              >
                 <span className="skill-pill-icon" style={{ color: skill.color }}>
                  {cloneElement(skill.icon, {
                    'aria-hidden': 'true',
                  })}
                </span>
                <span className="skill-pill-name">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.h2
            className="skills-title"
            style={{ marginTop: "60px" }}
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Tools <span>I Use</span>
          </motion.h2>
          <motion.div
            className="skills-pills"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {tools.map((tool) => (
              <motion.div
                key={tool.name}
                className="skill-pill"
                variants={skillItemVariants}
                whileHover="hover"
                style={{ "--skill-color": tool.color } as React.CSSProperties}
              >
                <span className="skill-pill-icon" style={{ color: tool.color }}>
                  {cloneElement(tool.icon, {
                    'aria-hidden': 'true',
                  })}
                </span>
                <span className="skill-pill-name">{tool.name}</span>
              </motion.div>
            ))}
          </motion.div>
      </div>

      <div className="contributions-section">
        <motion.h2
          className="contributions-title"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          Days I Spent <span>Coding</span>
        </motion.h2>

        {error && <div className="error-message">{error}</div>}

        <motion.div
          className="calendar-container"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="calendar-body">
            {/* Day-of-week labels (GitHub style: Mon, Wed, Fri) */}
            <div className="calendar-day-labels">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
                <div key={i} className="day-label">{label}</div>
              ))}
            </div>

            <div className="calendar-right">
              {/* Month labels */}
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

              {/* Grid */}
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

          <motion.div
            className="calendar-footer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
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

            <motion.div
              className="contributions-count"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.3 }}
            >
              <motion.strong
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 1.4 }}
              >
                {displayTotal.toLocaleString()}
              </motion.strong>{" "}
              contributions in the last year
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default SkillContent;
