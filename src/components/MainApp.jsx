import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import CulturalFeed from './CulturalFeed';
import DiscoverScreen from './DiscoverScreen';
import ProfileScreen from './ProfileScreen';
import PointsWallet from './PointsWallet';
import CultureTabs from './CultureTabs';

const MainApp = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <CulturalFeed />;
      case 'discover':
        return <DiscoverScreen />;
      case 'culture':
        return <CultureTabs />;
      case 'info':
        return <PointsWallet />;
      case 'profile':
        return <ProfileScreen onLogout={onLogout} />;
      default:
        return <CulturalFeed />;
    }
  };

  return (
    <div className="main-app">
      <div className="app-content">
        {renderContent()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MainApp;

