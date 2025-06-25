import React, { useState, useEffect } from 'react';

const CrossBorderVoiceCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [myLanguage, setMyLanguage] = useState('zh-CN');
  const [partnerLanguage, setPartnerLanguage] = useState('en-US');
  const [callQuality, setCallQuality] = useState(0);
  const [translationDelay, setTranslationDelay] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // 模拟通话质量和延迟
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallQuality(85 + Math.random() * 15); // 85-100%
        setTranslationDelay(100 + Math.random() * 200); // 100-300ms
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallQuality(0);
      setTranslationDelay(0);
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

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

  const handleCall = async () => {
    if (isCallActive) {
      setIsCallActive(false);
      setIsConnecting(false);
    } else {
      setIsConnecting(true);
      // 模拟连接过程
      setTimeout(() => {
        setIsConnecting(false);
        setIsCallActive(true);
      }, 2000);
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

  const getQualityColor = (quality) => {
    if (quality >= 90) return 'var(--color-secondary-teal)';
    if (quality >= 70) return 'var(--color-accent-orange)';
    return '#EF4444';
  };

  const getDelayColor = (delay) => {
    if (delay <= 150) return 'var(--color-secondary-teal)';
    if (delay <= 250) return 'var(--color-accent-orange)';
    return '#EF4444';
  };

  return (
    <div>
      {/* 我的语言设置 */}
      <div className="control-group">
        <label className="control-label">我的语言</label>
        <select 
          className="control-select"
          value={myLanguage}
          onChange={(e) => setMyLanguage(e.target.value)}
          disabled={isCallActive || isConnecting}
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
          disabled={isCallActive || isConnecting}
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          ⇄ 交换语言
        </button>
      </div>

      {/* 对方语言设置 */}
      <div className="control-group">
        <label className="control-label">对方语言</label>
        <select 
          className="control-select"
          value={partnerLanguage}
          onChange={(e) => setPartnerLanguage(e.target.value)}
          disabled={isCallActive || isConnecting}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* 通话状态 */}
      <div className="control-group">
        <div className={`status-indicator ${
          isCallActive ? 'status-connected' : 
          isConnecting ? 'status-connected' : 
          'status-disconnected'
        }`}>
          <div className="status-dot"></div>
          <span>
            {isCallActive ? '通话中' : 
             isConnecting ? '连接中...' : 
             '未连接'}
          </span>
        </div>
      </div>

      {/* 通话时长 */}
      {isCallActive && (
        <div className="control-group">
          <div style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'var(--color-gray-800)',
            padding: '1rem',
            backgroundColor: 'rgba(124, 58, 237, 0.05)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(124, 58, 237, 0.1)'
          }}>
            {formatDuration(callDuration)}
          </div>
        </div>
      )}

      {/* 通话质量指标 */}
      {isCallActive && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: getQualityColor(callQuality),
              marginBottom: '0.25rem'
            }}>
              {Math.round(callQuality)}%
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-gray-500)'
            }}>
              通话质量
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(249, 115, 22, 0.05)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(249, 115, 22, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: getDelayColor(translationDelay),
              marginBottom: '0.25rem'
            }}>
              {Math.round(translationDelay)}ms
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-gray-500)'
            }}>
              翻译延迟
            </div>
          </div>
        </div>
      )}

      {/* 通话控制按钮 */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          className={`btn ${
            isCallActive ? 'btn-secondary' : 
            isConnecting ? 'btn-secondary' : 
            'btn-primary'
          }`}
          onClick={handleCall}
          disabled={isConnecting}
          style={{ 
            minWidth: '200px',
            backgroundColor: isCallActive ? '#EF4444' : undefined,
            color: isCallActive ? 'white' : undefined
          }}
        >
          {isCallActive ? '结束通话' : 
           isConnecting ? '连接中...' : 
           '开始通话'}
        </button>
      </div>

      {/* 实时翻译示例 */}
      {isCallActive && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(124, 58, 237, 0.05)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(124, 58, 237, 0.1)',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--color-secondary-purple)',
              marginBottom: '0.5rem'
            }}>
              实时翻译
            </h4>
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--color-gray-500)',
              marginBottom: '0.5rem'
            }}>
              您说: "Hello, how are you today?"
            </div>
            <div style={{
              fontSize: '1rem',
              color: 'var(--color-gray-800)',
              fontWeight: '500'
            }}>
              翻译: "你好，你今天怎么样？"
            </div>
          </div>

          <div style={{
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
              对方回复
            </h4>
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--color-gray-500)',
              marginBottom: '0.5rem'
            }}>
              对方说: "我很好，谢谢！"
            </div>
            <div style={{
              fontSize: '1rem',
              color: 'var(--color-gray-800)',
              fontWeight: '500'
            }}>
              翻译: "I'm fine, thank you!"
            </div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: 'rgba(124, 58, 237, 0.05)', 
        borderRadius: '0.75rem',
        border: '1px solid rgba(124, 58, 237, 0.1)'
      }}>
        <h4 style={{ 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: 'var(--color-secondary-purple)',
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
          <li>设置您和对方的语言</li>
          <li>点击"开始通话"建立连接</li>
          <li>系统将实时翻译双方的语音</li>
          <li>监控通话质量和翻译延迟</li>
        </ul>
      </div>
    </div>
  );
};

export default CrossBorderVoiceCall;

