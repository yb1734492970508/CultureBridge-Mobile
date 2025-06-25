import React, { useState, useEffect } from 'react';
import PhoneAudioTranslator from './components/PhoneAudioTranslator';
import ExternalAudioTranslator from './components/ExternalAudioTranslator';
import CrossBorderVoiceCall from './components/CrossBorderVoiceCall';
import './styles/starbucks-level.css';

// 导入星巴克级别的高级图标
import phoneAudioIcon from './assets/icons/phone_audio_starbucks.png';
import externalAudioIcon from './assets/icons/external_audio_starbucks.png';
import voiceCallIcon from './assets/icons/voice_call_starbucks.png';

function App() {
  const [activeTab, setActiveTab] = useState('phone');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 添加优雅的加载动画
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    {
      id: 'phone',
      name: '手机音频',
      icon: phoneAudioIcon,
      component: PhoneAudioTranslator,
      description: '实时翻译手机通话内容',
      color: 'var(--color-primary-forest)'
    },
    {
      id: 'external',
      name: '环境音频',
      icon: externalAudioIcon,
      component: ExternalAudioTranslator,
      description: '捕获并翻译周围环境声音',
      color: 'var(--color-primary-emerald)'
    },
    {
      id: 'voice',
      name: '语音通话',
      icon: voiceCallIcon,
      component: CrossBorderVoiceCall,
      description: '跨语言实时语音通话',
      color: 'var(--color-accent-gold)'
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;
  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // 添加星巴克级别的切换动画效果
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.opacity = '0';
      mainContent.style.transform = 'translateY(30px)';
      setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
        mainContent.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }, 200);
    }
  };

  return (
    <div className={`app ${isLoaded ? 'fade-in' : ''}`}>
      <div className="app-container">
        {/* 头部 - 星巴克级别深绿渐变背景 */}
        <header className="app-header">
          <h1 className="app-title">CultureBridge</h1>
          <p className="app-subtitle">连接世界，消除语言障碍</p>
        </header>

        {/* 导航标签 - 星巴克级别设计 */}
        <nav className="tab-navigation">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
              style={{
                animationDelay: `${index * 0.15}s`
              }}
              title={tab.description}
            >
              <img 
                src={tab.icon} 
                alt={tab.name}
                className="tab-icon"
                style={{
                  filter: activeTab === tab.id ? 'brightness(1.05) saturate(1.1)' : 'brightness(1)'
                }}
              />
              <span className="tab-text">{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* 主要内容区域 */}
        <main className="main-content">
          {ActiveComponent && (
            <div className="feature-card fade-in">
              <div className="feature-header">
                <img 
                  src={activeTabInfo.icon} 
                  alt={activeTabInfo.name}
                  className="feature-icon"
                />
                <h2 className="feature-title">{activeTabInfo.name}</h2>
                <p className="feature-description">{activeTabInfo.description}</p>
              </div>
              <ActiveComponent />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

