import React from 'react';
import { Home, Search, Bookmark, Info, User } from 'lucide-react';

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: Search, label: 'Discover' },
    { id: 'culture', icon: Bookmark, label: 'Culture' },
    { id: 'info', icon: Info, label: 'Points' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="bottom-navigation">
      <div className="nav-container">
        {navItems.map(item => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <div className="nav-icon">
                <IconComponent size={24} />
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

