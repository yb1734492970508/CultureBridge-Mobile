import React, { useState, useEffect } from 'react';

const ExternalAudioTranslator = () => {
  const [isListening, setIsListening] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('zh');
  const [sensitivity, setSensitivity] = useState(50);
  const [audioLevel, setAudioLevel] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState('');

  const languages = [
    { code: 'auto', name: '🌐 自动检测', flag: '🌐' },
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

  const targetLanguages = languages.filter(lang => lang.code !== 'auto');

  // 模拟音频级别和语言检测
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        const level = Math.random() * 100;
        setAudioLevel(level);
        
        // 模拟语言检测
        if (level > sensitivity && sourceLanguage === 'auto') {
          const detectedLangs = ['英语', '中文', '日语', '法语', '西班牙语'];
          setDetectedLanguage(detectedLangs[Math.floor(Math.random() * detectedLangs.length)]);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
      setDetectedLanguage('');
    }
  }, [isListening, sensitivity, sourceLanguage]);

  const handleStartListening = () => {
    setIsListening(!isListening);
  };

  const getStatusText = () => {
    if (!isListening) return '未连接';
    if (audioLevel > sensitivity) return '正在翻译';
    return '监听中';
  };

  const getStatusClass = () => {
    if (!isListening) return 'disconnected';
    if (audioLevel > sensitivity) return 'connecting';
    return 'connected';
  };

  return (
    <div className="external-audio-translator">
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
          
          <div className="language-group">
            <label className="language-label">目标语言</label>
            <select 
              className="language-select"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {targetLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 语言检测结果 */}
      {detectedLanguage && sourceLanguage === 'auto' && (
        <div className="detected-language">
          <div className="detected-label">检测到语言</div>
          <div className="detected-value">{detectedLanguage}</div>
        </div>
      )}

      {/* 音频敏感度设置 */}
      <div className="sensitivity-settings">
        <label className="sensitivity-label">
          音频敏感度: {sensitivity}%
        </label>
        <div className="sensitivity-slider">
          <input
            type="range"
            min="10"
            max="90"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseInt(e.target.value))}
          />
          <div className="sensitivity-labels">
            <span>低敏感度</span>
            <span>高敏感度</span>
          </div>
        </div>
      </div>

      {/* 音频级别显示 */}
      {isListening && (
        <div className="audio-level-display">
          <div className="audio-level-label">环境音频级别</div>
          <div className="audio-level-bar">
            <div 
              className="audio-level-fill"
              style={{ 
                width: `${audioLevel}%`,
                background: audioLevel > sensitivity 
                  ? `linear-gradient(90deg, var(--color-secondary-green) 0%, var(--color-accent-orange) 100%)`
                  : `linear-gradient(90deg, var(--color-border) 0%, var(--color-text-muted) 100%)`
              }}
            ></div>
            <div 
              className="sensitivity-threshold"
              style={{ left: `${sensitivity}%` }}
            ></div>
          </div>
          <div className="audio-level-info">
            <span>当前: {Math.round(audioLevel)}%</span>
            <span>阈值: {sensitivity}%</span>
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="control-buttons">
        <button 
          className={`primary-button ${isListening ? 'stop' : 'start'}`}
          onClick={handleStartListening}
          style={{
            background: isListening 
              ? 'linear-gradient(135deg, var(--color-accent-red) 0%, #dc2626 100%)'
              : 'var(--gradient-button-secondary)'
          }}
        >
          {isListening ? '停止监听' : '开始监听'}
        </button>
      </div>

      {/* 翻译结果区域 */}
      {isListening && audioLevel > sensitivity && (
        <div className="translation-results">
          <div className="translation-item">
            <div className="translation-label">检测到的语音</div>
            <div className="translation-text">正在识别环境音频...</div>
          </div>
          <div className="translation-item">
            <div className="translation-label">翻译结果</div>
            <div className="translation-text">等待翻译结果...</div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="usage-instructions">
        <h3>使用说明</h3>
        <ol>
          <li>选择源语言和目标语言</li>
          <li>调整音频敏感度阈值</li>
          <li>点击"开始监听"按钮</li>
          <li>允许浏览器访问麦克风权限</li>
          <li>当环境音频超过阈值时自动翻译</li>
          <li>翻译结果会实时显示在下方</li>
        </ol>
      </div>

      <style jsx>{`
        .detected-language {
          margin: var(--spacing-lg) 0;
          padding: var(--spacing-md);
          background: linear-gradient(135deg, var(--color-secondary-green) 0%, #059669 100%);
          color: white;
          border-radius: var(--radius-lg);
          text-align: center;
          animation: fadeIn 0.3s ease-out;
        }

        .detected-label {
          font-size: var(--font-size-sm);
          opacity: 0.9;
          margin-bottom: var(--spacing-xs);
        }

        .detected-value {
          font-size: var(--font-size-lg);
          font-weight: 700;
        }

        .sensitivity-settings {
          margin: var(--spacing-lg) 0;
        }

        .sensitivity-label {
          display: block;
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--color-text-accent);
          margin-bottom: var(--spacing-md);
          text-align: center;
        }

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
          height: 12px;
          background: var(--color-border-light);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--spacing-sm);
          position: relative;
        }

        .audio-level-fill {
          height: 100%;
          transition: width 0.1s ease-out;
          border-radius: var(--radius-full);
        }

        .sensitivity-threshold {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-accent-red);
          transform: translateX(-1px);
        }

        .audio-level-info {
          display: flex;
          justify-content: space-between;
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
        }

        .translation-results {
          margin-top: var(--spacing-xl);
          padding: var(--spacing-lg);
          background: var(--gradient-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          animation: slideIn 0.3s ease-out;
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

export default ExternalAudioTranslator;

