import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, 
  Globe, Users, MessageCircle, Heart, SkipForward, Settings,
  User, MapPin, Clock, Languages
} from 'lucide-react';

const InternationalVoiceChat = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [myLanguage, setMyLanguage] = useState('zh-CN');
  const [partnerLanguage, setPartnerLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    ageRange: '18-30',
    interests: ['language', 'culture', 'travel'],
    preferredCountries: ['US', 'UK', 'JP', 'KR', 'FR', 'DE']
  });

  const callTimerRef = useRef(null);
  const matchingTimerRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const languages = [
    { code: 'zh-CN', name: '中文(简体)', country: 'CN', flag: '🇨🇳' },
    { code: 'zh-TW', name: '中文(繁体)', country: 'TW', flag: '🇹🇼' },
    { code: 'en', name: 'English', country: 'US', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', country: 'JP', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', country: 'KR', flag: '🇰🇷' },
    { code: 'es', name: 'Español', country: 'ES', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', country: 'FR', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', country: 'DE', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', country: 'IT', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', country: 'BR', flag: '🇧🇷' },
    { code: 'ru', name: 'Русский', country: 'RU', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', country: 'SA', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', country: 'IN', flag: '🇮🇳' },
    { code: 'th', name: 'ไทย', country: 'TH', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', country: 'VN', flag: '🇻🇳' }
  ];

  const mockUsers = [
    {
      id: 1,
      name: 'Emma Johnson',
      age: 24,
      country: 'United States',
      language: 'en',
      interests: ['travel', 'culture', 'music'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: 2,
      name: 'Hiroshi Tanaka',
      age: 28,
      country: 'Japan',
      language: 'ja',
      interests: ['anime', 'technology', 'language'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: 3,
      name: 'Sophie Martin',
      age: 26,
      country: 'France',
      language: 'fr',
      interests: ['art', 'cuisine', 'culture'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: 4,
      name: 'Carlos Rodriguez',
      age: 30,
      country: 'Spain',
      language: 'es',
      interests: ['sports', 'travel', 'language'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: 5,
      name: 'Anna Mueller',
      age: 25,
      country: 'Germany',
      language: 'de',
      interests: ['music', 'culture', 'technology'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      isOnline: true
    }
  ];

  // 开始匹配
  const startMatching = async () => {
    setIsMatching(true);
    setMatchingProgress(0);
    
    // 模拟匹配过程
    matchingTimerRef.current = setInterval(() => {
      setMatchingProgress(prev => {
        if (prev >= 100) {
          clearInterval(matchingTimerRef.current);
          // 随机选择一个用户
          const availableUsers = mockUsers.filter(user => 
            user.language !== myLanguage && user.isOnline
          );
          const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
          setCurrentPartner(randomUser);
          setPartnerLanguage(randomUser.language);
          setIsMatching(false);
          setIsConnected(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // 停止匹配
  const stopMatching = () => {
    setIsMatching(false);
    setMatchingProgress(0);
    if (matchingTimerRef.current) {
      clearInterval(matchingTimerRef.current);
    }
  };

  // 开始通话
  const startCall = async () => {
    try {
      // 获取用户媒体
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      localStreamRef.current = stream;
      setIsCallActive(true);
      setCallDuration(0);
      
      // 开始计时
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // 模拟语音识别和翻译
      simulateVoiceTranslation();
      
    } catch (error) {
      console.error('无法访问音频设备:', error);
      alert('无法访问音频设备，请检查权限设置');
    }
  };

  // 结束通话
  const endCall = () => {
    setIsCallActive(false);
    setIsConnected(false);
    setCurrentPartner(null);
    setCallDuration(0);
    setTranslatedText('');
    setOriginalText('');
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  // 跳过当前用户
  const skipUser = () => {
    if (isCallActive) {
      endCall();
    } else {
      setCurrentPartner(null);
      setIsConnected(false);
      startMatching();
    }
  };

  // 模拟语音翻译
  const simulateVoiceTranslation = () => {
    const conversations = [
      {
        original: "Hello! Nice to meet you. Where are you from?",
        translated: "你好！很高兴认识你。你来自哪里？"
      },
      {
        original: "I'm from Tokyo. How about you?",
        translated: "我来自东京。你呢？"
      },
      {
        original: "That's amazing! I've always wanted to visit Japan.",
        translated: "太棒了！我一直想去日本旅游。"
      },
      {
        original: "You should definitely come! The cherry blossoms are beautiful.",
        translated: "你一定要来！樱花非常美丽。"
      },
      {
        original: "What do you like to do in your free time?",
        translated: "你空闲时间喜欢做什么？"
      }
    ];

    let conversationIndex = 0;
    const conversationTimer = setInterval(() => {
      if (conversationIndex < conversations.length && isCallActive) {
        const current = conversations[conversationIndex];
        setOriginalText(current.original);
        setTranslatedText(current.translated);
        
        // 添加到聊天历史
        const newMessage = {
          id: Date.now(),
          sender: conversationIndex % 2 === 0 ? 'partner' : 'me',
          original: current.original,
          translated: current.translated,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, newMessage]);
        
        conversationIndex++;
      } else {
        clearInterval(conversationTimer);
      }
    }, 5000);
  };

  // 格式化通话时间
  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取语言信息
  const getLanguageInfo = (code) => {
    return languages.find(lang => lang.code === code) || languages[0];
  };

  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (matchingTimerRef.current) clearInterval(matchingTimerRef.current);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="international-voice-chat">
      {/* 头部 */}
      <div className="chat-header">
        <h2 className="chat-title">
          <Globe size={24} />
          跨国语音通话
        </h2>
        <div className="online-status">
          <div className="online-dot"></div>
          <span>{mockUsers.filter(u => u.isOnline).length} 人在线</span>
        </div>
      </div>

      {/* 语言设置 */}
      <div className="language-setup">
        <div className="my-language">
          <label>我的语言</label>
          <select 
            value={myLanguage} 
            onChange={(e) => setMyLanguage(e.target.value)}
            className="language-select"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="translation-toggle">
          <label>
            <input
              type="checkbox"
              checked={translationEnabled}
              onChange={(e) => setTranslationEnabled(e.target.checked)}
            />
            启用实时翻译
          </label>
        </div>
      </div>

      {/* 匹配状态 */}
      {isMatching && (
        <div className="matching-status">
          <div className="matching-animation">
            <div className="matching-circle"></div>
            <Users size={32} />
          </div>
          <h3>正在寻找聊天伙伴...</h3>
          <div className="matching-progress">
            <div 
              className="progress-bar"
              style={{ width: `${matchingProgress}%` }}
            />
          </div>
          <p>正在匹配来自不同国家的用户</p>
          <button className="cancel-matching" onClick={stopMatching}>
            取消匹配
          </button>
        </div>
      )}

      {/* 已连接用户 */}
      {isConnected && currentPartner && (
        <div className="partner-info">
          <div className="partner-card">
            <div className="partner-avatar">
              <img src={currentPartner.avatar} alt={currentPartner.name} />
              <div className="partner-status online"></div>
            </div>
            <div className="partner-details">
              <h3>{currentPartner.name}</h3>
              <div className="partner-meta">
                <span className="partner-age">
                  <User size={14} />
                  {currentPartner.age}岁
                </span>
                <span className="partner-location">
                  <MapPin size={14} />
                  {currentPartner.country}
                </span>
                <span className="partner-language">
                  {getLanguageInfo(currentPartner.language).flag}
                  {getLanguageInfo(currentPartner.language).name}
                </span>
              </div>
              <div className="partner-interests">
                {currentPartner.interests.map(interest => (
                  <span key={interest} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 通话控制 */}
          <div className="call-controls">
            {!isCallActive ? (
              <button className="start-call-btn" onClick={startCall}>
                <PhoneCall size={24} />
                开始通话
              </button>
            ) : (
              <div className="active-call-controls">
                <div className="call-info">
                  <Clock size={16} />
                  <span>{formatCallDuration(callDuration)}</span>
                </div>
                
                <div className="control-buttons">
                  <button 
                    className={`control-btn ${isMuted ? 'active' : ''}`}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  
                  <button 
                    className={`control-btn ${!isSpeakerOn ? 'active' : ''}`}
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  >
                    {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>
                  
                  <button className="end-call-btn" onClick={endCall}>
                    <PhoneOff size={20} />
                  </button>
                </div>
              </div>
            )}
            
            <button className="skip-btn" onClick={skipUser}>
              <SkipForward size={20} />
              跳过
            </button>
          </div>
        </div>
      )}

      {/* 实时翻译显示 */}
      {isCallActive && translationEnabled && (originalText || translatedText) && (
        <div className="live-translation">
          <h4>实时翻译</h4>
          {originalText && (
            <div className="translation-item original">
              <div className="translation-header">
                <span className="speaker">对方</span>
                <span className="language">
                  {getLanguageInfo(partnerLanguage).flag}
                </span>
              </div>
              <p>{originalText}</p>
            </div>
          )}
          {translatedText && (
            <div className="translation-item translated">
              <div className="translation-header">
                <span className="speaker">翻译</span>
                <span className="language">
                  {getLanguageInfo(myLanguage).flag}
                </span>
              </div>
              <p>{translatedText}</p>
            </div>
          )}
        </div>
      )}

      {/* 聊天历史 */}
      {chatHistory.length > 0 && (
        <div className="chat-history">
          <h4>对话记录</h4>
          <div className="history-list">
            {chatHistory.slice(-5).map(message => (
              <div key={message.id} className={`history-message ${message.sender}`}>
                <div className="message-content">
                  <p className="original-message">{message.original}</p>
                  {translationEnabled && (
                    <p className="translated-message">{message.translated}</p>
                  )}
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 开始匹配按钮 */}
      {!isMatching && !isConnected && (
        <div className="start-matching">
          <div className="matching-intro">
            <h3>开始跨国语音聊天</h3>
            <p>与来自世界各地的用户进行实时语音对话，体验不同文化的魅力</p>
            <div className="features">
              <div className="feature">
                <Languages size={20} />
                <span>实时翻译</span>
              </div>
              <div className="feature">
                <Globe size={20} />
                <span>全球匹配</span>
              </div>
              <div className="feature">
                <Heart size={20} />
                <span>文化交流</span>
              </div>
            </div>
          </div>
          
          <button className="start-matching-btn" onClick={startMatching}>
            <Users size={24} />
            开始匹配
          </button>
        </div>
      )}

      {/* 用户偏好设置 */}
      <div className="user-preferences">
        <h4>匹配偏好</h4>
        <div className="preference-item">
          <label>年龄范围</label>
          <select 
            value={userPreferences.ageRange}
            onChange={(e) => setUserPreferences(prev => ({
              ...prev,
              ageRange: e.target.value
            }))}
          >
            <option value="18-25">18-25岁</option>
            <option value="26-35">26-35岁</option>
            <option value="36-45">36-45岁</option>
            <option value="46+">46岁以上</option>
          </select>
        </div>
        
        <div className="preference-item">
          <label>兴趣标签</label>
          <div className="interest-tags">
            {['语言学习', '文化交流', '旅游', '音乐', '电影', '美食', '运动', '科技'].map(interest => (
              <button
                key={interest}
                className={`interest-tag ${userPreferences.interests.includes(interest) ? 'active' : ''}`}
                onClick={() => {
                  setUserPreferences(prev => ({
                    ...prev,
                    interests: prev.interests.includes(interest)
                      ? prev.interests.filter(i => i !== interest)
                      : [...prev.interests, interest]
                  }));
                }}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 使用提示 */}
      <div className="usage-tips">
        <h4>使用提示</h4>
        <ul>
          <li>点击"开始匹配"寻找来自其他国家的聊天伙伴</li>
          <li>启用实时翻译功能，无障碍跨语言交流</li>
          <li>可以随时跳过当前用户，寻找新的聊天伙伴</li>
          <li>保持友善和尊重，享受文化交流的乐趣</li>
          <li>通话记录会保存最近的对话内容</li>
        </ul>
      </div>
    </div>
  );
};

export default InternationalVoiceChat;

