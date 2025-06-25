import React, { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const CultureTabs = () => {
  const [activeTab, setActiveTab] = useState('culture');
  const [isPlaying, setIsPlaying] = useState(false);

  const tabs = [
    { id: 'culture', label: 'Culture' },
    { id: 'language', label: 'Language' },
    { id: 'chat', label: 'Chat' }
  ];

  const renderCultureContent = () => (
    <div className="culture-content">
      {/* Featured Cultural Content */}
      <div className="featured-culture">
        <div className="culture-image">
          <img 
            src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop" 
            alt="Exploring Balinese Dance"
            className="culture-img"
          />
          <div className="culture-overlay">
            <h2 className="culture-title">Exploring Balinese Dance</h2>
          </div>
        </div>
      </div>

      {/* Culture Grid */}
      <div className="culture-grid">
        <div className="culture-card translate-card">
          <div className="card-image">
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop" 
              alt="Translation"
            />
          </div>
          <div className="card-content">
            <h3 className="card-title">Translate the following</h3>
            <div className="translation-quiz">
              <p className="quiz-question">Q. 'a pomme</p>
              <div className="quiz-options">
                <button className="quiz-option">apple</button>
                <button className="quiz-option">pear</button>
                <button className="quiz-option">grapes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="culture-card chat-card">
          <div className="card-image">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=150&fit=crop" 
              alt="Chat"
            />
          </div>
          <div className="card-content">
            <h3 className="card-title">Chat</h3>
            <div className="chat-preview">
              <div className="chat-user">
                <div className="user-info">
                  <span className="user-name">Santiago</span>
                  <span className="user-age">21 age</span>
                </div>
                <p className="chat-message">Hello! Would you like to practice Spanish?</p>
              </div>
              <div className="chat-response">
                <p className="response-message">Sure! Let's get started.</p>
                <span className="response-age">21 age</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanguageContent = () => (
    <div className="language-content">
      <div className="language-lesson">
        <h2>Language Practice</h2>
        <div className="lesson-card">
          <h3>Spanish Basics</h3>
          <p>Learn essential Spanish phrases for daily conversation</p>
          <div className="lesson-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '65%' }}></div>
            </div>
            <span className="progress-text">65% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatContent = () => (
    <div className="chat-content">
      <div className="chat-interface">
        <h2>Cultural Exchange Chat</h2>
        <div className="chat-messages">
          <div className="message received">
            <p>¡Hola! ¿Cómo estás?</p>
            <span className="message-time">2:30 PM</span>
          </div>
          <div className="message sent">
            <p>Hello! I'm doing well, thank you!</p>
            <span className="message-time">2:31 PM</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'culture':
        return renderCultureContent();
      case 'language':
        return renderLanguageContent();
      case 'chat':
        return renderChatContent();
      default:
        return renderCultureContent();
    }
  };

  return (
    <div className="culture-tabs">
      {/* Header */}
      <div className="culture-header">
        <h1 className="app-title">CultureBridge</h1>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderContent()}
      </div>

      {/* Media Controls (for culture tab) */}
      {activeTab === 'culture' && (
        <div className="media-controls">
          <button className="control-btn">
            <RotateCcw size={20} />
          </button>
          <button 
            className="control-btn play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="control-btn">
            <RotateCcw size={20} style={{ transform: 'scaleX(-1)' }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CultureTabs;

