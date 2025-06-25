import React, { useState, useEffect, useRef } from 'react';
import '../styles/ultra-premium.css';

const CrossBorderVoiceCall = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [userLanguage, setUserLanguage] = useState('zh');
  const [targetLanguages, setTargetLanguages] = useState(['en']);
  const [interests, setInterests] = useState([]);
  const [ageRange, setAgeRange] = useState([18, 65]);
  const [callHistory, setCallHistory] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState([]);
  
  const callTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);

  const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const interestOptions = [
    { id: 'music', name: '音乐', icon: '🎵' },
    { id: 'movies', name: '电影', icon: '🎬' },
    { id: 'reading', name: '阅读', icon: '📚' },
    { id: 'sports', name: '运动', icon: '🏃' },
    { id: 'cooking', name: '烹饪', icon: '🍳' },
    { id: 'travel', name: '旅行', icon: '✈️' },
    { id: 'art', name: '艺术', icon: '🎨' },
    { id: 'technology', name: '科技', icon: '💻' },
    { id: 'gardening', name: '园艺', icon: '🌱' },
    { id: 'photography', name: '摄影', icon: '📸' },
    { id: 'gaming', name: '游戏', icon: '🎮' },
    { id: 'yoga', name: '瑜伽', icon: '🧘' },
    { id: 'theater', name: '戏剧', icon: '🎭' },
    { id: 'science', name: '科学', icon: '🔬' },
    { id: 'outdoor', name: '户外', icon: '🏔️' }
  ];

  // 获取认证token
  const getAuthToken = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/test/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('获取认证token失败:', error);
      return null;
    }
  };

  // 开始匹配
  const startMatching = async () => {
    try {
      setError(null);
      setIsMatching(true);
      setConnectionStatus('connecting');
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('无法获取认证token');
      }

      const response = await fetch('http://localhost:5001/api/voice-call/matching/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_language: userLanguage,
          target_languages: targetLanguages,
          interests: interests,
          age_range: ageRange,
          preferences: {
            call_duration_preference: 'medium',
            topic_preferences: interests
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setConnectionStatus('matching');
        // 模拟匹配过程
        setTimeout(() => {
          simulateMatch();
        }, Math.random() * 5000 + 3000);
      } else {
        throw new Error(data.message || '加入匹配队列失败');
      }
    } catch (error) {
      console.error('开始匹配失败:', error);
      setError(error.message);
      setIsMatching(false);
      setConnectionStatus('error');
    }
  };

  // 模拟匹配成功
  const simulateMatch = () => {
    const mockUser = {
      id: 'user_' + Date.now(),
      name: generateRandomName(),
      language: targetLanguages[Math.floor(Math.random() * targetLanguages.length)],
      country: getCountryByLanguage(targetLanguages[0]),
      interests: interests.slice(0, Math.floor(Math.random() * 3) + 2),
      age: Math.floor(Math.random() * (ageRange[1] - ageRange[0])) + ageRange[0]
    };
    
    setMatchedUser(mockUser);
    setIsMatching(false);
    setConnectionStatus('matched');
  };

  // 开始通话
  const startCall = async () => {
    try {
      setIsInCall(true);
      setConnectionStatus('in-call');
      setCallDuration(0);
      
      // 开始计时
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // 初始化音频
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      
      // 这里可以添加实际的WebRTC连接逻辑
      
    } catch (error) {
      console.error('开始通话失败:', error);
      setError('无法访问麦克风，请检查权限设置');
    }
  };

  // 结束通话
  const endCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    // 保存通话记录
    const callRecord = {
      id: Date.now(),
      user: matchedUser,
      duration: callDuration,
      timestamp: new Date().toISOString(),
      translations: translations.length
    };
    
    setCallHistory(prev => [callRecord, ...prev].slice(0, 10));
    
    setIsInCall(false);
    setMatchedUser(null);
    setConnectionStatus('disconnected');
    setCallDuration(0);
    setTranslations([]);
  };

  // 取消匹配
  const cancelMatching = () => {
    setIsMatching(false);
    setConnectionStatus('disconnected');
  };

  // 生成随机用户名
  const generateRandomName = () => {
    const names = ['Alex', 'Maria', 'John', 'Sophie', 'David', 'Emma', 'Lucas', 'Anna', 'Michael', 'Lisa'];
    return names[Math.floor(Math.random() * names.length)];
  };

  // 根据语言获取国家
  const getCountryByLanguage = (langCode) => {
    const countryMap = {
      'en': '美国', 'es': '西班牙', 'fr': '法国', 'de': '德国',
      'ja': '日本', 'ko': '韩国', 'ar': '沙特阿拉伯', 'ru': '俄罗斯'
    };
    return countryMap[langCode] || '未知';
  };

  // 切换兴趣选择
  const toggleInterest = (interestId) => {
    setInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  // 切换目标语言
  const toggleTargetLanguage = (langCode) => {
    setTargetLanguages(prev => 
      prev.includes(langCode) 
        ? prev.filter(code => code !== langCode)
        : [...prev, langCode]
    );
  };

  // 格式化通话时长
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="slide-up">
      {/* Hero Section */}
      <div className="card mb-8">
        <div className="card-content text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
          <h2 className="heading-2 mb-2">跨国语音通话</h2>
          <p className="text-caption mb-4">
            随机匹配全球用户，实时翻译语音通话
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`status-dot ${
              connectionStatus === 'in-call' || connectionStatus === 'matched' ? 'online' : 
              connectionStatus === 'error' ? 'error' : 'offline'
            }`}></div>
            <span className="text-small">
              {connectionStatus === 'in-call' ? '通话中' :
               connectionStatus === 'matched' ? '已匹配' :
               connectionStatus === 'matching' ? '匹配中...' :
               connectionStatus === 'connecting' ? '连接中...' :
               connectionStatus === 'error' ? '连接错误' : '未连接'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Call Interface */}
      {isInCall && matchedUser && (
        <div className="card mb-6 scale-in">
          <div className="card-content text-center">
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '2rem',
              color: 'white'
            }}>
              👤
            </div>
            
            <h3 className="heading-3 mb-2">{matchedUser.name}</h3>
            <p className="text-caption mb-4">
              来自 {matchedUser.country} • {languages.find(l => l.code === matchedUser.language)?.name}
            </p>
            
            <div className="text-2xl mb-4" style={{ 
              fontFamily: 'monospace',
              color: 'var(--primary-600)',
              fontWeight: 'var(--font-bold)'
            }}>
              {formatDuration(callDuration)}
            </div>
            
            <div className="flex gap-3 justify-center">
              <button 
                className="btn btn-secondary"
                style={{ borderRadius: 'var(--radius-full)', padding: 'var(--space-3)' }}
              >
                🔇
              </button>
              
              <button 
                className="btn"
                onClick={endCall}
                style={{ 
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  padding: 'var(--space-4) var(--space-6)'
                }}
              >
                结束通话
              </button>
              
              <button 
                className="btn btn-secondary"
                style={{ borderRadius: 'var(--radius-full)', padding: 'var(--space-3)' }}
              >
                📞
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Matched User Interface */}
      {matchedUser && !isInCall && (
        <div className="card mb-6 scale-in">
          <div className="card-content text-center">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉</div>
            <h3 className="heading-3 mb-2">找到匹配用户！</h3>
            
            <div className="card mb-4" style={{ background: 'var(--bg-secondary)' }}>
              <div className="card-content">
                <div className="flex items-center gap-4">
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'white'
                  }}>
                    👤
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h4 className="text-lg font-semibold mb-1">{matchedUser.name}</h4>
                    <p className="text-caption mb-2">
                      {matchedUser.age}岁 • {matchedUser.country}
                    </p>
                    <div className="flex gap-1">
                      {matchedUser.interests.map(interest => {
                        const interestData = interestOptions.find(opt => opt.id === interest);
                        return interestData ? (
                          <span 
                            key={interest}
                            className="text-small"
                            style={{ 
                              background: 'var(--primary-100)',
                              color: 'var(--primary-600)',
                              padding: '0.2rem 0.4rem',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.7rem'
                            }}
                          >
                            {interestData.icon} {interestData.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button 
                className="btn btn-secondary"
                onClick={() => setMatchedUser(null)}
              >
                重新匹配
              </button>
              
              <button 
                className="btn btn-primary btn-lg"
                onClick={startCall}
              >
                <span style={{ fontSize: '1.2rem' }}>📞</span>
                开始通话
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Matching Interface */}
      {isMatching && (
        <div className="card mb-6">
          <div className="card-content text-center">
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <h3 className="heading-3 mb-2">正在为您匹配用户...</h3>
            <p className="text-caption mb-4">
              根据您的语言偏好和兴趣爱好寻找合适的通话伙伴
            </p>
            
            <button 
              className="btn btn-secondary"
              onClick={cancelMatching}
            >
              取消匹配
            </button>
          </div>
        </div>
      )}

      {/* Language & Preferences Setup */}
      {!isMatching && !matchedUser && (
        <>
          <div className="card mb-6">
            <div className="card-header">
              <h3 className="heading-3">语言设置</h3>
            </div>
            <div className="card-content">
              <div className="form-group mb-4">
                <label className="form-label">我的语言</label>
                <select 
                  value={userLanguage} 
                  onChange={(e) => setUserLanguage(e.target.value)}
                  className="form-select"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label mb-3">希望匹配的语言</label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: 'var(--space-2)'
                }}>
                  {languages.filter(lang => lang.code !== userLanguage).map(lang => (
                    <label 
                      key={lang.code}
                      className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all"
                      style={{ 
                        borderColor: targetLanguages.includes(lang.code) ? 'var(--primary-500)' : 'var(--border-medium)',
                        background: targetLanguages.includes(lang.code) ? 'var(--primary-50)' : 'var(--bg-card)'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={targetLanguages.includes(lang.code)}
                        onChange={() => toggleTargetLanguage(lang.code)}
                        style={{ display: 'none' }}
                      />
                      <span>{lang.flag}</span>
                      <span className="text-small">{lang.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 justify-center mb-6">
            <button 
              className="btn btn-primary btn-lg"
              onClick={startMatching}
              disabled={targetLanguages.length === 0}
              style={{ minWidth: '160px' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🎯</span>
              开始匹配
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={() => setShowPreferences(!showPreferences)}
            >
              ⚙️ 偏好设置
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={() => setShowHistory(!showHistory)}
            >
              📋 通话历史
            </button>
          </div>
        </>
      )}

      {/* Preferences Panel */}
      {showPreferences && !isMatching && !matchedUser && (
        <div className="card mb-6 scale-in">
          <div className="card-header">
            <h3 className="heading-3">匹配偏好</h3>
          </div>
          <div className="card-content">
            <div className="form-group mb-6">
              <label className="form-label mb-3">兴趣爱好</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: 'var(--space-2)'
              }}>
                {interestOptions.map(interest => (
                  <label 
                    key={interest.id}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-all text-center"
                    style={{ 
                      borderColor: interests.includes(interest.id) ? 'var(--primary-500)' : 'var(--border-medium)',
                      background: interests.includes(interest.id) ? 'var(--primary-50)' : 'var(--bg-card)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={interests.includes(interest.id)}
                      onChange={() => toggleInterest(interest.id)}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '1.2rem' }}>{interest.icon}</span>
                    <span className="text-small">{interest.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                年龄范围: {ageRange[0]} - {ageRange[1]}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={ageRange[0]}
                  onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-between text-small mt-1" style={{ color: 'var(--text-tertiary)' }}>
                <span>18</span>
                <span>80</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call History */}
      {showHistory && callHistory.length > 0 && (
        <div className="card mb-6 scale-in">
          <div className="card-header">
            <h3 className="heading-3">通话历史</h3>
          </div>
          <div className="card-content">
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {callHistory.map(call => (
                <div 
                  key={call.id}
                  className="card mb-3"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <div className="card-content">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold mb-1">{call.user.name}</h4>
                        <p className="text-caption mb-2">
                          {call.user.country} • {formatDuration(call.duration)}
                        </p>
                        <p className="text-small" style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(call.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-small" style={{ 
                          background: 'var(--primary-100)',
                          color: 'var(--primary-600)',
                          padding: '0.2rem 0.4rem',
                          borderRadius: 'var(--radius-md)'
                        }}>
                          {call.translations} 条翻译
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card mb-6" style={{ 
          borderColor: '#ef4444',
          background: '#fef2f2'
        }}>
          <div className="card-content">
            <div className="flex items-center gap-2">
              <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>⚠️</span>
              <span style={{ color: '#dc2626' }}>{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      {!isMatching && !matchedUser && !showPreferences && !showHistory && (
        <div className="card">
          <div className="card-header">
            <h3 className="heading-3">使用说明</h3>
          </div>
          <div className="card-content">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span style={{ 
                  background: 'var(--primary-100)',
                  color: 'var(--primary-600)',
                  borderRadius: 'var(--radius-full)',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'var(--font-semibold)',
                  flexShrink: 0
                }}>
                  1
                </span>
                <span className="text-body">设置您的语言和希望匹配的语言</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span style={{ 
                  background: 'var(--primary-100)',
                  color: 'var(--primary-600)',
                  borderRadius: 'var(--radius-full)',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'var(--font-semibold)',
                  flexShrink: 0
                }}>
                  2
                </span>
                <span className="text-body">配置兴趣爱好和年龄偏好（可选）</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span style={{ 
                  background: 'var(--primary-100)',
                  color: 'var(--primary-600)',
                  borderRadius: 'var(--radius-full)',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'var(--font-semibold)',
                  flexShrink: 0
                }}>
                  3
                </span>
                <span className="text-body">点击"开始匹配"寻找通话伙伴</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span style={{ 
                  background: 'var(--primary-100)',
                  color: 'var(--primary-600)',
                  borderRadius: 'var(--radius-full)',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'var(--font-semibold)',
                  flexShrink: 0
                }}>
                  4
                </span>
                <span className="text-body">开始语音通话，系统将实时翻译对话内容</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrossBorderVoiceCall;

