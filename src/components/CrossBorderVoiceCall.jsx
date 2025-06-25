import React, { useState, useEffect } from 'react';

const CrossBorderVoiceCall = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [myLanguage, setMyLanguage] = useState('zh');
  const [partnerLanguage, setPartnerLanguage] = useState('en');
  const [callDuration, setCallDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('excellent');

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

  // 模拟通话计时
  useEffect(() => {
    if (isInCall) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCallDuration(0);
    }
  }, [isInCall]);

  // 模拟音频级别和连接质量
  useEffect(() => {
    if (isInCall) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
        const qualities = ['excellent', 'good', 'fair', 'poor'];
        setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
      setConnectionQuality('excellent');
    }
  }, [isInCall]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleStartCall = () => {
    if (isConnected) {
      setIsInCall(!isInCall);
    }
  };

  const swapLanguages = () => {
    const temp = myLanguage;
    setMyLanguage(partnerLanguage);
    setPartnerLanguage(temp);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    if (!isConnected) return '未连接';
    if (isInCall) return '通话中';
    return '已连接';
  };

  const getStatusClass = () => {
    if (!isConnected) return 'disconnected';
    if (isInCall) return 'connecting';
    return 'connected';
  };

  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'var(--color-secondary-green)';
      case 'good': return 'var(--color-accent-orange)';
      case 'fair': return '#F59E0B';
      case 'poor': return 'var(--color-accent-red)';
      default: return 'var(--color-secondary-green)';
    }
  };

  const getQualityText = () => {
    switch (connectionQuality) {
      case 'excellent': return '优秀';
      case 'good': return '良好';
      case 'fair': return '一般';
      case 'poor': return '较差';
      default: return '优秀';
    }
  };

  return (
    <div className="voice-call-translator">
      {/* 连接状态 */}
      <div className={`status-indicator ${getStatusClass()}`}>
        <span className="status-dot"></span>
        {getStatusText()}
      </div>

      {/* 通话信息 */}
      {isInCall && (
        <div className="call-info">
          <div className="call-duration">
            <div className="duration-label">通话时长</div>
            <div className="duration-value">{formatDuration(callDuration)}</div>
          </div>
          <div className="connection-quality">
            <div className="quality-label">连接质量</div>
            <div 
              className="quality-value"
              style={{ color: getQualityColor() }}
            >
              {getQualityText()}
            </div>
          </div>
        </div>
      )}

      {/* 语言设置 */}
      <div className="language-settings">
        <h3>语言设置</h3>
        <div className="language-row">
          <div className="language-group">
            <label className="language-label">我的语言</label>
            <select 
              className="language-select"
              value={myLanguage}
              onChange={(e) => setMyLanguage(e.target.value)}
              disabled={isInCall}
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
            disabled={isInCall}
            title="交换语言"
          >
            ⇄
          </button>
          
          <div className="language-group">
            <label className="language-label">对方语言</label>
            <select 
              className="language-select"
              value={partnerLanguage}
              onChange={(e) => setPartnerLanguage(e.target.value)}
              disabled={isInCall}
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
      {isInCall && (
        <div className="audio-level-display">
          <div className="audio-level-label">语音活动</div>
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
            连接语音服务
          </button>
        ) : !isInCall ? (
          <button 
            className="primary-button"
            onClick={handleStartCall}
            style={{
              background: 'var(--gradient-button-secondary)'
            }}
          >
            开始通话
          </button>
        ) : (
          <div className="call-controls">
            <button 
              className="call-control-button mute"
              title="静音"
            >
              🔇
            </button>
            <button 
              className="call-control-button end-call"
              onClick={handleStartCall}
              title="结束通话"
            >
              📞
            </button>
            <button 
              className="call-control-button speaker"
              title="扬声器"
            >
              🔊
            </button>
          </div>
        )}
      </div>

      {/* 翻译结果区域 */}
      {isInCall && (
        <div className="translation-results">
          <div className="translation-item">
            <div className="translation-label">我说的话</div>
            <div className="translation-text">等待语音输入...</div>
          </div>
          <div className="translation-item">
            <div className="translation-label">翻译给对方</div>
            <div className="translation-text">等待翻译结果...</div>
          </div>
          <div className="translation-item">
            <div className="translation-label">对方说的话</div>
            <div className="translation-text">等待对方语音...</div>
          </div>
          <div className="translation-item">
            <div className="translation-label">翻译给我</div>
            <div className="translation-text">等待翻译结果...</div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="usage-instructions">
        <h3>使用说明</h3>
        <ol>
          <li>设置我的语言和对方语言</li>
          <li>点击"连接语音服务"按钮</li>
          <li>允许浏览器访问麦克风权限</li>
          <li>点击"开始通话"建立连接</li>
          <li>开始对话，系统会实时双向翻译</li>
          <li>使用控制按钮管理通话状态</li>
        </ol>
      </div>

      <style jsx>{`
        .call-info {
          display: flex;
          justify-content: space-between;
          margin: var(--spacing-lg) 0;
          padding: var(--spacing-lg);
          background: var(--gradient-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }

        .call-duration, .connection-quality {
          text-align: center;
        }

        .duration-label, .quality-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-xs);
        }

        .duration-value {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-text-accent);
          font-family: 'Courier New', monospace;
        }

        .quality-value {
          font-size: var(--font-size-lg);
          font-weight: 600;
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

        .call-controls {
          display: flex;
          justify-content: center;
          gap: var(--spacing-lg);
          margin: var(--spacing-xl) 0;
        }

        .call-control-button {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          border: none;
          font-size: var(--font-size-xl);
          cursor: pointer;
          transition: all var(--transition-bounce);
          box-shadow: var(--shadow-md);
        }

        .call-control-button.mute {
          background: var(--gradient-button-primary);
        }

        .call-control-button.end-call {
          background: linear-gradient(135deg, var(--color-accent-red) 0%, #dc2626 100%);
        }

        .call-control-button.speaker {
          background: var(--gradient-button-secondary);
        }

        .call-control-button:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-lg);
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

export default CrossBorderVoiceCall;

