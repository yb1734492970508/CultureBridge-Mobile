import React, { useState, useEffect } from 'react';

const ExternalAudioTranslator = () => {
  const [isListening, setIsListening] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('zh-CN');
  const [audioLevel, setAudioLevel] = useState(0);
  const [sensitivity, setSensitivity] = useState(50);
  const [lastTranslation, setLastTranslation] = useState('');

  // 模拟音频级别和语言检测
  useEffect(() => {
    let interval;
    if (isListening) {
      interval = setInterval(() => {
        const level = Math.random() * 100;
        setAudioLevel(level);
        
        // 模拟语言检测
        if (level > sensitivity && !detectedLanguage) {
          const languages = ['en-US', 'ja-JP', 'ko-KR', 'es-ES', 'fr-FR'];
          const randomLang = languages[Math.floor(Math.random() * languages.length)];
          setDetectedLanguage(randomLang);
          
          // 模拟翻译结果
          const translations = [
            '你好，很高兴见到你！',
            '今天天气真不错。',
            '请问洗手间在哪里？',
            '谢谢你的帮助。',
            '我想要一杯咖啡。'
          ];
          setLastTranslation(translations[Math.floor(Math.random() * translations.length)]);
        }
      }, 200);
    } else {
      setAudioLevel(0);
      setDetectedLanguage('');
      setLastTranslation('');
    }
    return () => clearInterval(interval);
  }, [isListening, sensitivity, detectedLanguage]);

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

  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  const handleToggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div>
      {/* 目标语言设置 */}
      <div className="control-group">
        <label className="control-label">翻译到</label>
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

      {/* 敏感度设置 */}
      <div className="control-group">
        <label className="control-label">检测敏感度: {sensitivity}%</label>
        <input
          type="range"
          min="10"
          max="90"
          value={sensitivity}
          onChange={(e) => setSensitivity(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(0, 0, 0, 0.1)',
            outline: 'none',
            appearance: 'none'
          }}
        />
      </div>

      {/* 监听状态 */}
      <div className="control-group">
        <div className={`status-indicator ${isListening ? 'status-connected' : 'status-disconnected'}`}>
          <div className="status-dot"></div>
          <span>{isListening ? '正在监听' : '未监听'}</span>
        </div>
      </div>

      {/* 检测到的语言 */}
      {detectedLanguage && (
        <div className="control-group">
          <div className="status-indicator status-connected">
            <div className="status-dot"></div>
            <span>检测到: {getLanguageName(detectedLanguage)}</span>
          </div>
        </div>
      )}

      {/* 音频级别显示 */}
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

      {/* 敏感度阈值线 */}
      <div style={{ position: 'relative', marginTop: '-0.5rem', marginBottom: '1rem' }}>
        <div 
          style={{
            position: 'absolute',
            left: `${sensitivity}%`,
            top: '-3px',
            width: '2px',
            height: '12px',
            backgroundColor: 'var(--color-accent-orange)',
            borderRadius: '1px'
          }}
        ></div>
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--color-gray-500)', 
          textAlign: 'center',
          marginTop: '0.5rem'
        }}>
          阈值线
        </div>
      </div>

      {/* 翻译结果 */}
      {lastTranslation && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          marginBottom: '1rem'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-secondary-teal-dark)',
            marginBottom: '0.5rem'
          }}>
            翻译结果
          </h4>
          <p style={{
            fontSize: '1rem',
            color: 'var(--color-gray-800)',
            margin: 0
          }}>
            {lastTranslation}
          </p>
        </div>
      )}

      {/* 控制按钮 */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          className={`btn ${isListening ? 'btn-secondary' : 'btn-success'}`}
          onClick={handleToggleListening}
          style={{ minWidth: '200px' }}
        >
          {isListening ? '停止监听' : '开始监听'}
        </button>
      </div>

      {/* 使用说明 */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: 'rgba(16, 185, 129, 0.05)', 
        borderRadius: '0.75rem',
        border: '1px solid rgba(16, 185, 129, 0.1)'
      }}>
        <h4 style={{ 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: 'var(--color-secondary-teal-dark)',
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
          <li>点击"开始监听"按钮开始捕获环境音频</li>
          <li>调整敏感度以适应不同的环境噪音</li>
          <li>系统将自动检测语言并进行翻译</li>
          <li>翻译结果将实时显示在上方</li>
        </ul>
      </div>
    </div>
  );
};

export default ExternalAudioTranslator;

