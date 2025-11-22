import React from 'react';

function WellnessDashboard({ moodHistory, journalEntries, chats }) {
  const getMoodStats = () => {
    if (moodHistory.length === 0) return null;
    
    const last7Days = moodHistory.slice(-7);
    const avgMood = last7Days.reduce((sum, entry) => sum + entry.mood.value, 0) / last7Days.length;
    const moodTrend = last7Days.length > 1 
      ? last7Days[last7Days.length - 1].mood.value > last7Days[0].mood.value ? 'improving' : 'declining'
      : 'stable';
    
    return {
      avgMood: avgMood.toFixed(1),
      totalCheckins: moodHistory.length,
      trend: moodTrend,
      last7Days
    };
  };

  const stats = getMoodStats();

  return (
    <div className="wellness-dashboard">
      <div className="dashboard-header">
        <h1>Wellness Dashboard</h1>
        <p>Track your mental health journey</p>
      </div>

      {stats ? (
        <div className="dashboard-simple">
          <div className="stat-card">
            <div className="stat-icon">😊</div>
            <div className="stat-info">
              <h2>{stats.avgMood}</h2>
              <p>7-Day Average</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">{stats.trend === 'improving' ? '📈' : stats.trend === 'declining' ? '📉' : '➡️'}</div>
            <div className="stat-info">
              <h2>{stats.trend === 'improving' ? 'Improving' : stats.trend === 'declining' ? 'Check-in' : 'Stable'}</h2>
              <p>Mood Trend</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h2>{stats.totalCheckins}</h2>
              <p>Total Check-ins</p>
            </div>
          </div>

          <div className="mood-week">
            <h3>This Week</h3>
            <div className="mood-week-grid">
              {stats.last7Days.map((entry, index) => (
                <div key={index} className="mood-day-simple">
                  <span className="mood-emoji-big">{entry.mood.emoji}</span>
                  <span className="mood-date">{new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state-simple">
          <i className="fas fa-smile" style={{fontSize: '64px', color: '#667eea', marginBottom: '20px'}}></i>
          <h2>Start Tracking Your Mood</h2>
          <p>Click "How are you feeling?" to begin</p>
        </div>
      )}

      <div className="wellness-tips-simple">
        <h3>💡 Daily Wellness Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <i className="fas fa-heart"></i>
            <p>Practice gratitude daily</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-walking"></i>
            <p>Move your body</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-users"></i>
            <p>Connect with others</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-wind"></i>
            <p>Breathe deeply</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WellnessDashboard;
