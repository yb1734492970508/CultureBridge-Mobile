import React, { useState } from 'react';
import PhoneAudioTranslator from './components/PhoneAudioTranslator';
import ExternalAudioTranslator from './components/ExternalAudioTranslator';
import CrossBorderVoiceCall from './components/CrossBorderVoiceCall';
import './styles/ultra-premium.css';

function App() {
  const [activeTab, setActiveTab] = useState('phone');

  const tabs = [
    { 
      id: 'phone', 
      name: '手机音频', 
      icon: '📱',
      description: '实时翻译手机播放内容'
    },
    { 
      id: 'external', 
      name: '环境音频', 
      icon: '🎤',
      description: '监听周围环境声音'
    },
    { 
      id: 'voice-call', 
      name: '语音通话', 
      icon: '🌍',
      description: '跨国语音交流匹配'
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'phone':
        return <PhoneAudioTranslator />;
      case 'external':
        return <ExternalAudioTranslator />;
      case 'voice-call':
        return <CrossBorderVoiceCall />;
      default:
        return <PhoneAudioTranslator />;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="text-center">
          <h1 className="heading-2" style={{ 
            background: 'linear-gradient(135deg, #f17d47, #e25d2b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem'
          }}>
            CultureBridge
          </h1>
          <p className="text-caption">连接世界，消除语言障碍</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="nav-tabs mt-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex flex-col items-center gap-1">
                <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                  {tab.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="app-content">
        <div className="fade-in">
          {renderActiveComponent()}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '2rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-light)',
        background: 'var(--bg-secondary)'
      }}>
        <p className="text-small">
          Powered by AI Translation Technology
        </p>
        <p className="text-small mt-2" style={{ opacity: 0.6 }}>
          © 2024 CultureBridge. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;

