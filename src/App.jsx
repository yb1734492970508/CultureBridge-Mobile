import React, { useState } from 'react';
import PhoneAudioTranslator from './components/PhoneAudioTranslator';
import ExternalAudioTranslator from './components/ExternalAudioTranslator';
import CrossBorderVoiceCall from './components/CrossBorderVoiceCall';
import './styles/ultra-premium.css';

// 导入高级图标
import phoneAudioIcon from './assets/icons/phone_audio_icon_refined.png';
import externalAudioIcon from './assets/icons/external_audio_icon_refined.png';
import voiceCallIcon from './assets/icons/voice_call_icon_refined.png';

function App() {
  const [activeTab, setActiveTab] = useState('phone');

  const tabs = [
    {
      id: 'phone',
      name: '手机音频',
      icon: phoneAudioIcon,
      component: PhoneAudioTranslator
    },
    {
      id: 'external',
      name: '环境音频',
      icon: externalAudioIcon,
      component: ExternalAudioTranslator
    },
    {
      id: 'voice',
      name: '语音通话',
      icon: voiceCallIcon,
      component: CrossBorderVoiceCall
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="app">
      <div className="app-container">
        {/* 头部 */}
        <header className="app-header">
          <h1 className="app-title">CultureBridge</h1>
          <p className="app-subtitle">连接世界，消除语言障碍</p>
        </header>

        {/* 导航标签 */}
        <nav className="tab-navigation">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                '--tab-index': index + 1
              }}
            >
              <img 
                src={tab.icon} 
                alt={tab.name}
                className="tab-icon"
              />
              <span className="tab-text">{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* 主要内容区域 */}
        <main className="main-content">
          {ActiveComponent && <ActiveComponent />}
        </main>
      </div>
    </div>
  );
}

export default App;

