import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

const DiscoverScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const recommendedUsers = [
    {
      id: 1,
      name: 'dajata',
      subtitle: 'Jnalk.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: 2,
      name: 'data',
      subtitle: 'Titan of Setuo Omiraova',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: 3,
      name: 'alex_chen',
      subtitle: 'Cultural Explorer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      isOnline: false
    }
  ];

  const popularTopics = [
    { id: 1, name: 'TRAD', color: '#F97316' },
    { id: 2, name: 'LODGE', color: '#F97316' },
    { id: 3, name: 'TAS2', color: '#F97316' },
    { id: 4, name: 'WWII RIDGE', color: '#F97316' }
  ];

  const translingEvents = [
    {
      id: 1,
      title: 'Captatral Penzas',
      subtitle: 'Genrloniagme',
      image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=150&h=100&fit=crop'
    },
    {
      id: 2,
      title: 'Lot trrle Festfook',
      subtitle: 'Aotadsell org.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=100&fit=crop'
    }
  ];

  return (
    <div className="discover-screen">
      {/* Header */}
      <div className="discover-header">
        <div className="header-content">
          <div className="app-logo">
            <div className="logo-icon-small">
              <div className="logo-bridge-small"></div>
            </div>
            <span className="app-name">CultureBridge</span>
          </div>
          <button className="search-icon-btn">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* World Map Section */}
      <div className="world-map-section">
        <div className="world-map-container">
          <div className="world-map">
            {/* Simplified world map background */}
            <div className="map-background">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&overlay=blue" 
                alt="World map" 
                className="map-image"
              />
              <div className="map-overlay"></div>
            </div>
            
            {/* Map Points */}
            <div className="map-points">
              <div className="map-point usa-point">
                <div className="point-flag">🇺🇸</div>
              </div>
              <div className="map-point asia-point">
                <div className="point-flag">🌏</div>
              </div>
              <div className="map-point europe-point">
                <div className="point-flag">🌍</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transling Events */}
      <div className="section">
        <h2 className="section-title">Transling Events</h2>
        <div className="events-grid">
          {translingEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-info">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-subtitle">{event.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Users */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Recommended Users</h2>
          <button className="see-all-btn">See Kinar</button>
        </div>
        <div className="users-list">
          {recommendedUsers.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-avatar-container">
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                {user.isOnline && <div className="online-indicator"></div>}
              </div>
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-subtitle">{user.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Topics */}
      <div className="section">
        <h2 className="section-title">Popular Topics</h2>
        <div className="topics-container">
          <div className="topics-list">
            {popularTopics.map(topic => (
              <button 
                key={topic.id} 
                className="topic-tag"
                style={{ backgroundColor: topic.color }}
              >
                {topic.name}
              </button>
            ))}
          </div>
          <button className="add-topic-btn">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Live Activities */}
      <div className="section">
        <h2 className="section-title">Live Activities</h2>
        <div className="live-activities">
          <p className="live-subtitle">Villagers Maaroua - Fest 12:09</p>
        </div>
      </div>
    </div>
  );
};

export default DiscoverScreen;

