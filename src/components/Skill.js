import React, { Component } from 'react'
import StarsBackground from './StarsBackground';
import './Skill.css';

export class Skill extends Component {
  state = {
    contributions: [],
    loading: true,
    error: null,
    totalContributions: 0
  }

  componentDidMount() {
    this.fetchRealGitHubData();
  }

  fetchRealGitHubData = async () => {
    const username = 'naheel0';
    const token = process.env.REACT_APP_GITHUB_TOKEN;

    try {
      // Use GraphQL API with token for real data
      const query = `
        query {
          user(login: "${username}") {
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
      `;

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const calendarData = result.data.user.contributionsCollection.contributionCalendar;
        const contributions = [];

        // Process real GitHub data
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
        
      } else {
        throw new Error(`API error: ${response.status}`);
      }

    } catch (error) {
      console.log('Using fallback data:', error.message);
      this.setState({
        error: "Using demo data (GitHub API limited)",
        loading: false,
        contributions: this.getRealisticMockData()
      });
    }
  }

  getRealisticMockData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      let count;
      if (isWeekend) {
        count = Math.random() < 0.8 ? 0 : 1;
      } else {
        const rand = Math.random();
        if (rand < 0.3) count = 0;
        else if (rand < 0.6) count = 1;
        else if (rand < 0.8) count = 2;
        else if (rand < 0.95) count = 3;
        else count = 4;
      }

      // Create realistic streaks
      if (i > 0 && data[data.length - 1]?.count > 1 && Math.random() < 0.6) {
        count = Math.min(4, data[data.length - 1].count);
      }

      data.push({
        date: date.toISOString().split('T')[0],
        count: count
      });
    }
    
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
    const { contributions, loading, totalContributions } = this.state; // Removed 'error' from destructuring
    
    const displayTotal = totalContributions || contributions.reduce((sum, day) => sum + day.count, 0);

    if (loading) {
      return (
        <div className='main-bg'>
          <StarsBackground />
          <div className="contributions-section">
            <h2 className="contributions-title">Days I Code</h2>
            <div className="loading">
              {process.env.REACT_APP_GITHUB_TOKEN ? 
                'Loading your GitHub contributions...' : 
                'Loading (public data)...'
              }
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='main-bg'>
        <StarsBackground />
        <div className="contributions-section">
          <h2 className="contributions-title">Days I Code</h2>
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
                <strong>{displayTotal}</strong> contributions in the last year
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default Skill