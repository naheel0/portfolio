import React, { Component } from 'react';
import StarsBackground from './StarsBackground';
import './Skill.css';
import { FaJs, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiRedux } from 'react-icons/si';

export class Skill extends Component {
  state = {
    contributions: [],
    loading: true,
    error: null,
    totalContributions: 0
  };

  componentDidMount() {
    this.fetchGitHubData();
  }

  fetchGitHubData = async () => {
    // This will use the REACT_APP_GITHUB_TOKEN from Netlify environment variables
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    
    console.log('GitHub Token available:', !!token);
    
    if (!token) {
      console.log('No GitHub token found in build environment');
      this.useDemoData('GitHub token not configured in Netlify - using demo data');
      return;
    }

    try {
      console.log('Fetching real GitHub data with token...');
      
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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
          `
        })
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (!result.data || !result.data.user) {
        throw new Error('Invalid response format from GitHub API');
      }

      const calendarData = result.data.user.contributionsCollection.contributionCalendar;
      const contributions = [];
      
      calendarData.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
          contributions.push({
            date: day.date,
            count: day.contributionCount
          });
        });
      });

      this.setState({
        contributions,
        totalContributions: calendarData.totalContributions,
        loading: false,
        error: null
      });

      console.log('Real GitHub data loaded successfully!', {
        totalContributions: calendarData.totalContributions,
        days: contributions.length
      });

    } catch (error) {
      console.error('Error fetching real GitHub data:', error);
      this.useDemoData(`Failed to load real data: ${error.message}`);
    }
  }

  useDemoData = (errorMessage) => {
    const demoContributions = this.getRealisticMockData();
    const demoTotal = demoContributions.reduce((sum, day) => sum + day.count, 0);
    
    this.setState({
      error: errorMessage,
      loading: false,
      contributions: demoContributions,
      totalContributions: demoTotal
    });
  }

  getRealisticMockData = () => {
    const data = [];
    const today = new Date();

    // Create realistic coding patterns
    let currentStreak = 0;
    let lastCount = 1;

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const month = date.getMonth();
      const isHolidaySeason = month === 11 || month === 0; // Dec-Jan
      
      let count;

      if (isWeekend) {
        // Light coding on weekends
        if (Math.random() < 0.6) count = 0;
        else if (Math.random() < 0.8) count = 1;
        else count = 2;
      } else if (isHolidaySeason) {
        // Less coding during holidays
        if (Math.random() < 0.4) count = 0;
        else if (Math.random() < 0.7) count = 1;
        else if (Math.random() < 0.9) count = 2;
        else count = 3;
      } else {
        // Normal weekdays
        const rand = Math.random();
        if (rand < 0.2) count = 0;
        else if (rand < 0.5) count = 1;
        else if (rand < 0.75) count = 2;
        else if (rand < 0.9) count = 3;
        else count = 4;
      }

      // Create coding streaks (more realistic)
      if (currentStreak > 0 && currentStreak < 7) {
        if (Math.random() < 0.6) {
          count = Math.min(4, lastCount);
          currentStreak++;
        } else {
          currentStreak = 0;
        }
      } else if (!isWeekend && count > 0 && Math.random() < 0.3) {
        currentStreak = 1;
      }

      lastCount = count;

      data.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    console.log('Generated realistic demo data');
    return data;
  }

  getColor = (count) => {
    if (count === 0) return 'rgba(255, 255, 255, 0.1)';
    if (count === 1) return '#b19cd9';
    if (count === 2) return '#8a2be2';
    if (count === 3) return '#6a0dad';
    return '#4b0082';
  }

  render() {
    const { contributions, loading, totalContributions, error } = this.state;
    
    const displayTotal = totalContributions > 0 ? totalContributions : contributions.reduce((sum, day) => sum + day.count, 0);
    

    const skills = [
      { name: "Javascript", icon: <FaJs />, color: "#F7DF1E" },
      { name: "HTML", icon: <FaHtml5 />, color: "#E34F26" },
      { name: "CSS", icon: <FaCss3Alt />, color: "#1572B6" },
      { name: "React", icon: <FaReact />, color: "#61DAFB" },
      { name: "Git", icon: <FaGitAlt />, color: "#F05032" },
      { name: "Redux", icon: <SiRedux />, color: "#764ABC" }
    ];

    if (loading) {
      return (
        <div className='main-bg'>
          <StarsBackground />
          <div className="contributions-section">
            <h2 className="contributions-title">Days I Code</h2>
            <div className="loading">
              <div>Loading GitHub contributions...</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '10px' }}>
                Checking for real GitHub data...
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='main-bg'>
        <StarsBackground />

        {/* Skills Section */}
        <div className="skills-section">
          <div className="container">
            <h2 className="skills-title">Professional <span>Skillset</span></h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-icon" style={{ color: skill.color }}>{skill.icon}</div>
                  <div className="skill-name">{skill.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Contributions Section */}
        <div className="contributions-section">
          <h2 className="contributions-title">Days I Spent <span>Coding</span></h2>
          
          {error && error.includes('demo data') && (
            <div className="demo-message">
              ⚠️ {error}
              <div style={{ fontSize: '0.8rem', marginTop: '5px', opacity: 0.8 }}>
                To see real data: Add REACT_APP_GITHUB_TOKEN in Netlify environment variables
              </div>
            </div>
          )}

          {!error && (
            console.log("shown real data")
          )}

          {error && !error.includes('demo data') && (
            console.error(error)
          )}

          <div className="calendar-container">
            <div className="calendar-grid">
              {Array.from({ length: 53 }).map((_, weekIndex) => (
                <div key={weekIndex} className="week-column">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const index = weekIndex * 7 + dayIndex;
                    const day = index < contributions.length ? contributions[index] : { count: 0, date: '' };
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="contribution-day"
                        style={{ backgroundColor: this.getColor(day.count) }}
                        title={day.date ? `${day.count} contributions on ${new Date(day.date).toLocaleDateString()}` : 'No contributions'}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="calendar-footer">
              <div className="calendar-legend">
                <span>Less</span>
                <div className="legend-colors">
                  {[0, 1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className="legend-color"
                      style={{ backgroundColor: this.getColor(level) }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>

              <div className="contributions-count">
                <strong>{displayTotal.toLocaleString()}</strong> contributions in the last year
              </div>
            </div>
          </div>
        </div>

        <footer className="footer-simple">
          <div className="footer-simple-content">
            <p>&copy; {new Date().getFullYear()} Naheel. Built with React.</p>
            <div className="footer-simple-links">
              <a href="https://github.com/naheel0" target="_blank" rel="noopener noreferrer" title="GitHub">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/naheel-muhammad-6b7077378" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="mailto:naheelmuhammedpk@gmail.com" target="_blank" rel="noopener noreferrer" title="Email">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Skill;