import React, { useState } from 'react';
import PhoneAudioTranslator from './components/PhoneAudioTranslator';
import ExternalAudioTranslator from './components/ExternalAudioTranslator';
import CrossBorderVoiceCall from './components/CrossBorderVoiceCall';
import './styles/premium.css';

function App() {
  const [activeTab, setActiveTab] = useState('phone');

  const tabs = [
    { id: 'phone', name: '📱 手机音频', icon: '📱' },
    { id: 'external', name: '🎤 外部音频', icon: '🎤' },
    { id: 'voice-call', name: '🌍 语音通话', icon: '🌍' }
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
    <div className="premium-container">
      {/* 顶部导航 */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        background: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h1 className="gradient-text" style={{ 
            fontSize: '1.8rem', 
            textAlign: 'center',
            margin: 0
          }}>
            CultureBridge
          </h1>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`premium-button ${activeTab === tab.id ? '' : 'secondary'} ripple`}
              style={{
                color: 'white',
                fontSize: '0.9rem',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '120px',
                justifyContent: 'center',
                opacity: activeTab === tab.id ? 1 : 0.7,
                transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)',
                transition: 'all var(--transition-normal)'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              <span>{tab.name.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{ 
        minHeight: 'calc(100vh - 120px)',
        position: 'relative'
      }}>
        {renderActiveComponent()}
      </div>

      {/* 底部信息 */}
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem 1rem',
        color: 'var(--dark-text-secondary)',
        fontSize: '0.8rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(10, 10, 10, 0.5)'
      }}>
        <p>CultureBridge - 连接世界，消除语言障碍</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
          Powered by AI Translation Technology
        </p>
      </div>

      {/* 浮动操作按钮 */}
      <button 
        className="fab floating"
        onClick={() => {
          // 切换到下一个标签
          const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
          const nextIndex = (currentIndex + 1) % tabs.length;
          setActiveTab(tabs[nextIndex].id);
        }}
        style={{
          fontSize: '1.5rem',
          color: 'white'
        }}
        title="切换功能"
      >
        🔄
      </button>
    </div>
  );
}

export default App;

