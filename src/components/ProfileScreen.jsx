import React, { useState } from 'react';
import { Star, Users, Award } from 'lucide-react';

const ProfileScreen = ({ onLogout }) => {
  const [userPoints, setUserPoints] = useState(230);
  const [userProfile] = useState({
    name: 'Sarah',
    username: '@sarah_s',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    learningLevel: 'Intermediate',
    culturalAchievements: 12,
    totalPoints: 230
  });

  const achievements = [
    { id: 1, title: 'Cultural Explorer', icon: '🌍', earned: true },
    { id: 2, title: 'Language Master', icon: '🗣️', earned: true },
    { id: 3, title: 'Community Builder', icon: '👥', earned: false },
    { id: 4, title: 'Tradition Keeper', icon: '🏛️', earned: true }
  ];

  return (
    <div className="profile-screen">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-background">
          <div className="profile-overlay"></div>
        </div>
        
        <div className="profile-content">
          <div className="profile-avatar-container">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name}
              className="profile-avatar"
            />
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{userProfile.name}</h1>
            <p className="profile-username">{userProfile.username}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stats-grid">
          {/* Learning Progress Card */}
          <div className="stat-card learning-card">
            <div className="stat-icon">
              <div className="progress-circle">
                <Star className="progress-star" size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Learning Progress</h3>
              <p className="stat-value">{userProfile.learningLevel}</p>
            </div>
          </div>

          {/* Cultural Exchange Card */}
          <div className="stat-card exchange-card">
            <div className="stat-icon">
              <div className="exchange-hands">
                <Users size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">Cultural Exchange</h3>
              <p className="stat-value">{userProfile.culturalAchievements} achievements</p>
            </div>
          </div>
        </div>

        {/* Points Card */}
        <div className="points-card">
          <div className="points-icon">
            <div className="points-coin">
              <span className="coin-text">积分</span>
            </div>
          </div>
          <div className="points-content">
            <h3 className="points-title">积分收益</h3>
            <p className="points-value">{userProfile.totalPoints} tokens</p>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="achievements-section">
        <h2 className="section-title">Recent Achievements</h2>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-item ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-icon">
                <span className="achievement-emoji">{achievement.icon}</span>
              </div>
              <p className="achievement-title">{achievement.title}</p>
              {achievement.earned && (
                <div className="achievement-badge">
                  <Award size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="activity-section">
        <h2 className="section-title">This Week</h2>
        <div className="activity-stats">
          <div className="activity-item">
            <div className="activity-number">15</div>
            <div className="activity-label">Cultural Posts</div>
          </div>
          <div className="activity-item">
            <div className="activity-number">8</div>
            <div className="activity-label">Languages Practiced</div>
          </div>
          <div className="activity-item">
            <div className="activity-number">23</div>
            <div className="activity-label">New Connections</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="settings-section">
        <button className="settings-button">Edit Profile</button>
        <button className="settings-button">Privacy Settings</button>
        <button className="settings-button">Notifications</button>
        <button className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;

