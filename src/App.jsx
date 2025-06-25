import React, { useState, useEffect } from 'react';
import PhoneAudioTranslator from './components/PhoneAudioTranslator';
import ExternalAudioTranslator from './components/ExternalAudioTranslator';
import CrossBorderVoiceCall from './components/CrossBorderVoiceCall';
import './styles/user-reference-design.css';

// 导入图标
import phoneIcon from './assets/icons/phone_audio_premium.png';
import externalIcon from './assets/icons/external_audio_premium.png';
import voiceIcon from './assets/icons/voice_call_premium.png';

function App() {
  const [activeTab, setActiveTab] = useState('phone');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 页面加载动画
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  const tabs = [
    {
      id: 'phone',
      name: '手机音频',
      icon: phoneIcon,
      component: PhoneAudioTranslator
    },
    {
      id: 'external',
      name: '环境音频',
      icon: externalIcon,
      component: ExternalAudioTranslator
    },
    {
      id: 'voice',
      name: '语音通话',
      icon: voiceIcon,
      component: CrossBorderVoiceCall
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className={`app ${isLoaded ? 'fade-in' : ''}`}>
      <div className="app-container">
        {/* 头部 - 完全基于用户图片风格 */}
        <header className="app-header">
          <h1 className="app-title">CultureBridge</h1>
          <p className="app-subtitle">连接世界，消除语言障碍</p>
        </header>

        {/* 导航标签 - 基于用户图片的卡片式设计 */}
        <nav className="tab-navigation">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div 
                className="tab-icon"
                style={{
                  backgroundImage: `url(${tab.icon})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <span className="tab-text">{tab.name}</span>
              {/* 角标数字 - 基于用户图片风格 */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '20px',
                height: '20px',
                backgroundColor: index === 0 ? '#22C55E' : index === 1 ? '#3B82F6' : '#F97316',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {index + 1}
              </div>
            </button>
          ))}
        </nav>

        {/* 主要内容区域 */}
        <main className="main-content">
          <div className="feature-card fade-in-up">
            <div className="feature-header">
              <div 
                className="feature-icon"
                style={{
                  backgroundImage: `url(${tabs.find(tab => tab.id === activeTab)?.icon})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <h2 className="feature-title">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
              <p className="feature-description">
                {activeTab === 'phone' && '实时翻译手机通话内容'}
                {activeTab === 'external' && '捕获并翻译周围环境声音'}
                {activeTab === 'voice' && '跨语言实时语音通话'}
              </p>
            </div>
            
            <div className="feature-content">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

