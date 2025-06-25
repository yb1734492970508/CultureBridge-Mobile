import React, { useState, useEffect } from 'react';

const PhoneAudioTranslator = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('zh-CN');
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);

  // 模拟音频级别变化
  useEffect(() => {
    let interval;
    if (isConnected && isTranslating) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 200);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isConnected, isTranslating]);

  const languages = [
    { code: 'zh-CN', name: '中文（简体）' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'ja-JP', name: '日本語' },
    { code: 'ko-KR', name: '한국어' },
    { code: 'es-ES', name: 'Español' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'de-DE', name: 'Deutsch' },
    { code: 'it-IT', name: 'Italiano' },
    { code: 'pt-PT', name: 'Português' },
    { code: 'ru-RU', name: 'Русский' }
  ];

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      setIsTranslating(true);
    } else {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  return (
    <div>
      {/* 语言设置 */}
      <div className="control-group">
        <label className="control-label">源语言</label>
        <select 
          className="control-select"
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <button 
          className="btn btn-secondary"
          onClick={swapLanguages}
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          ⇄ 交换语言
        </button>
      </div>

      <div className="control-group">
        <label className="control-label">目标语言</label>
        <select 
          className="control-select"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* 连接状态 */}
      <div className="control-group">
        <div className={`status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
          <div className="status-dot"></div>
          <span>{isConnected ? '已连接' : '未连接'}</span>
        </div>
      </div>

      {/* 音频级别显示 */}
      {isConnected && (
        <div className="audio-level">
          <span className="audio-level-label">音频级别</span>
          <div className="audio-level-bar">
            <div 
              className="audio-level-fill"
              style={{ width: `${audioLevel}%` }}
            ></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
            {Math.round(audioLevel)}%
          </span>
        </div>
      )}

      {/* 连接按钮 */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          className={`btn ${isConnected ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleConnect}
          style={{ minWidth: '200px' }}
        >
          {isConnected ? '断开连接' : '开始连接'}
        </button>
      </div>

      {/* 使用说明 */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: 'rgba(249, 115, 22, 0.05)', 
        borderRadius: '0.75rem',
        border: '1px solid rgba(249, 115, 22, 0.1)'
      }}>
        <h4 style={{ 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: 'var(--color-accent-orange)',
          marginBottom: '0.5rem'
        }}>
          使用说明
        </h4>
        <ul style={{ 
          fontSize: '0.875rem', 
          color: 'var(--color-gray-500)',
          lineHeight: '1.5',
          paddingLeft: '1rem'
        }}>
          <li>点击"开始连接"按钮连接手机音频</li>
          <li>选择合适的源语言和目标语言</li>
          <li>系统将自动检测并翻译通话内容</li>
          <li>翻译结果将实时显示在屏幕上</li>
        </ul>
      </div>
    </div>
  );
};

export default PhoneAudioTranslator;

