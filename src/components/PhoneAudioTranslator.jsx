import React, { useState, useEffect } from 'react';

const PhoneAudioTranslator = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('zh');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [audioLevel, setAudioLevel] = useState(0);

  const languages = [
    { code: 'zh', name: '🇨🇳 中文', flag: '🇨🇳' },
    { code: 'en', name: '🇺🇸 English', flag: '🇺🇸' },
    { code: 'es', name: '🇪🇸 Español', flag: '🇪🇸' },
    { code: 'fr', name: '🇫🇷 Français', flag: '🇫🇷' },
    { code: 'de', name: '🇩🇪 Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '🇯🇵 日本語', flag: '🇯🇵' },
    { code: 'ko', name: '🇰🇷 한국어', flag: '🇰🇷' },
    { code: 'ar', name: '🇸🇦 العربية', flag: '🇸🇦' },
    { code: 'ru', name: '🇷🇺 Русский', flag: '🇷🇺' }
  ];

  // 模拟音频级别
  useEffect(() => {
    if (isTranslating) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isTranslating]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      // 模拟连接过程
      setTimeout(() => {
        setIsConnected(true);
      }, 1000);
    }
  };

  const handleStartTranslation = () => {
    if (isConnected) {
      setIsTranslating(!isTranslating);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  const getStatusText = () => {
    if (!isConnected) return '未连接';
    if (isTranslating) return '正在翻译';
    return '已连接';
  };

  const getStatusClass = () => {
    if (!isConnected) return 'disconnected';
    if (isTranslating) return 'connecting';
    return 'connected';
  };

  return (
    <div className="phone-audio-translator">
      {/* 连接状态 */}
      <div className={`status-indicator ${getStatusClass()}`}>
        <span className="status-dot"></span>
        {getStatusText()}
      </div>

      {/* 语言设置 */}
      <div className="language-settings">
        <h3>语言设置</h3>
        <div className="language-row">
          <div className="language-group">
            <label className="language-label">源语言</label>
            <select 
              className="language-select"
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
          
          <button 
            className="swap-button"
            onClick={swapLanguages}
            title="交换语言"
          >
            ⇄
          </button>
          
          <div className="language-group">
            <label className="language-label">目标语言</label>
            <select 
              className="language-select"
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
        </div>
      </div>

      {/* 音频级别显示 */}
      {isTranslating && (
        <div className="audio-level-display">
          <div className="audio-level-label">音频级别</div>
          <div className="audio-level-bar">
            <div 
              className="audio-level-fill"
              style={{ 
                width: `${audioLevel}%`,
                background: `linear-gradient(90deg, var(--color-secondary-green) 0%, var(--color-accent-orange) 50%, var(--color-accent-red) 100%)`
              }}
            ></div>
          </div>
          <div className="audio-level-value">{Math.round(audioLevel)}%</div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="control-buttons">
        {!isConnected ? (
          <button 
            className="primary-button"
            onClick={handleConnect}
          >
            连接手机音频
          </button>
        ) : (
          <button 
            className={`primary-button ${isTranslating ? 'stop' : 'start'}`}
            onClick={handleStartTranslation}
            style={{
              background: isTranslating 
                ? 'linear-gradient(135deg, var(--color-accent-red) 0%, #dc2626 100%)'
                : 'var(--gradient-button-primary)'
            }}
          >
            {isTranslating ? '停止翻译' : '开始翻译'}
          </button>
        )}
      </div>

      {/* 翻译结果区域 */}
      {isTranslating && (
        <div className="translation-results">
          <div className="translation-item">
            <div className="translation-label">原文</div>
            <div className="translation-text">正在监听音频...</div>
          </div>
          <div className="translation-item">
            <div className="translation-label">译文</div>
            <div className="translation-text">等待翻译结果...</div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="usage-instructions">
        <h3>使用说明</h3>
        <ol>
          <li>选择源语言和目标语言</li>
          <li>点击"连接手机音频"按钮</li>
          <li>允许浏览器访问麦克风权限</li>
          <li>开始说话，系统将实时翻译</li>
          <li>翻译结果会实时显示在下方</li>
          <li>点击"停止翻译"结束会话</li>
        </ol>
      </div>

      <style jsx>{`
        .audio-level-display {
          margin: var(--spacing-lg) 0;
          padding: var(--spacing-lg);
          background: var(--gradient-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }

        .audio-level-label {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-sm);
          text-align: center;
        }

        .audio-level-bar {
          width: 100%;
          height: 8px;
          background: var(--color-border-light);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--spacing-sm);
        }

        .audio-level-fill {
          height: 100%;
          transition: width 0.1s ease-out;
          border-radius: var(--radius-full);
        }

        .audio-level-value {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-accent);
          text-align: center;
        }

        .translation-results {
          margin-top: var(--spacing-xl);
          padding: var(--spacing-lg);
          background: var(--gradient-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }

        .translation-item {
          margin-bottom: var(--spacing-lg);
        }

        .translation-item:last-child {
          margin-bottom: 0;
        }

        .translation-label {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-accent);
          margin-bottom: var(--spacing-xs);
        }

        .translation-text {
          font-size: var(--font-size-base);
          color: var(--color-text-primary);
          padding: var(--spacing-md);
          background: var(--color-background);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-light);
          min-height: 50px;
          display: flex;
          align-items: center;
        }

        .control-buttons {
          margin: var(--spacing-xl) 0;
        }
      `}</style>
    </div>
  );
};

export default PhoneAudioTranslator;

