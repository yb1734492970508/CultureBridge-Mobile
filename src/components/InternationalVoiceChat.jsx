import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, 
  Globe, Users, MessageCircle, Heart, SkipForward, Settings,
  User, MapPin, Clock, Languages, Wifi, AlertCircle, Star,
  Camera, CameraOff, Monitor, MonitorOff
} from 'lucide-react';

const InternationalVoiceChat = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [myLanguage, setMyLanguage] = useState('zh-CN');
  const [partnerLanguage, setPartnerLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [connectionQuality, setConnectionQuality] = useState(0);
  const [error, setError] = useState('');
  const [userPreferences, setUserPreferences] = useState({
    ageRange: '18-30',
    interests: ['language', 'culture', 'travel'],
    preferredCountries: ['US', 'UK', 'JP', 'KR', 'FR', 'DE'],
    callType: 'audio' // 'audio' or 'video'
  });

  const callTimerRef = useRef(null);
  const matchingTimerRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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
      isOnline: true,
      rating: 4.8,
      totalCalls: 156
    },
    {
      id: 2,
      name: 'Hiroshi Tanaka',
      age: 28,
      country: 'Japan',
      language: 'ja',
      interests: ['anime', 'technology', 'language'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      rating: 4.9,
      totalCalls: 203
    },
    {
      id: 3,
      name: 'Sophie Martin',
      age: 26,
      country: 'France',
      language: 'fr',
      interests: ['art', 'cuisine', 'culture'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      rating: 4.7,
      totalCalls: 89
    },
    {
      id: 4,
      name: 'Carlos Rodriguez',
      age: 30,
      country: 'Spain',
      language: 'es',
      interests: ['sports', 'travel', 'language'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      rating: 4.6,
      totalCalls: 134
    },
    {
      id: 5,
      name: 'Anna Mueller',
      age: 25,
      country: 'Germany',
      language: 'de',
      interests: ['music', 'culture', 'technology'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      rating: 4.8,
      totalCalls: 178
    }
  ];

  // 初始化WebRTC
  const initializeWebRTC = async () => {
    try {
      // 创建RTCPeerConnection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      peerConnectionRef.current = new RTCPeerConnection(configuration);
      
      // 监听连接状态变化
      peerConnectionRef.current.onconnectionstatechange = () => {
        const state = peerConnectionRef.current.connectionState;
        console.log('Connection state:', state);
        
        if (state === 'connected') {
          setConnectionQuality(85 + Math.random() * 15);
        } else if (state === 'disconnected' || state === 'failed') {
          setConnectionQuality(0);
          setError('连接断开');
        }
      };
      
      // 监听远程流
      peerConnectionRef.current.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0];
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      return true;
    } catch (error) {
      console.error('WebRTC初始化失败:', error);
      setError('WebRTC初始化失败');
      return false;
    }
  };

  // 获取用户媒体
  const getUserMedia = async () => {
    try {
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: userPreferences.callType === 'video' ? {
          width: { ideal: 640 },
          height: { ideal: 480 }
        } : false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      if (localVideoRef.current && userPreferences.callType === 'video') {
        localVideoRef.current.srcObject = stream;
      }
      
      // 添加流到peer connection
      if (peerConnectionRef.current) {
        stream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, stream);
        });
      }
      
      return true;
    } catch (error) {
      console.error('获取用户媒体失败:', error);
      setError('无法访问摄像头或麦克风');
      return false;
    }
  };

  // 开始匹配
  const startMatching = async () => {
    setIsMatching(true);
    setMatchingProgress(0);
    setError('');
    
    // 初始化WebRTC
    const webrtcReady = await initializeWebRTC();
    if (!webrtcReady) {
      setIsMatching(false);
      return;
    }
    
    // 模拟匹配过程
    matchingTimerRef.current = setInterval(() => {
      setMatchingProgress(prev => {
        if (prev >= 100) {
          clearInterval(matchingTimerRef.current);
          
          // 根据用户偏好筛选用户
          const availableUsers = mockUsers.filter(user => 
            user.language !== myLanguage && 
            user.isOnline &&
            userPreferences.preferredCountries.includes(user.country.split(' ')[0].toUpperCase())
          );
          
          if (availableUsers.length === 0) {
            setError('未找到匹配的用户，请调整偏好设置');
            setIsMatching(false);
            return 0;
          }
          
          // 按评分排序，选择评分较高的用户
          availableUsers.sort((a, b) => b.rating - a.rating);
          const randomUser = availableUsers[Math.floor(Math.random() * Math.min(3, availableUsers.length))];
          
          setCurrentPartner(randomUser);
          setPartnerLanguage(randomUser.language);
          setIsMatching(false);
          setIsConnected(true);
          return 100;
        }
        return prev + 8;
      });
    }, 200);
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
      setError('');
      
      // 获取用户媒体
      const mediaReady = await getUserMedia();
      if (!mediaReady) {
        return;
      }
      
      setIsCallActive(true);
      setCallDuration(0);
      
      // 开始计时
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
        // 模拟连接质量变化
        setConnectionQuality(prev => {
          const variation = (Math.random() - 0.5) * 10;
          return Math.max(60, Math.min(100, prev + variation));
        });
      }, 1000);
      
      // 初始化语音识别
      if (translationEnabled) {
        initializeVoiceRecognition();
      }
      
      // 模拟语音翻译
      simulateVoiceTranslation();
      
    } catch (error) {
      console.error('通话启动失败:', error);
      setError('通话启动失败');
    }
  };

  // 初始化语音识别
  const initializeVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = myLanguage;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          translateAndSendMessage(finalTranscript, 'me');
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('语音识别错误:', event.error);
      };
      
      recognitionRef.current.start();
    }
  };

  // 翻译并发送消息
  const translateAndSendMessage = async (text, sender) => {
    try {
      const translatedText = await translateText(text, myLanguage, partnerLanguage);
      
      const message = {
        id: Date.now(),
        sender,
        original: text,
        translated: translatedText,
        timestamp: new Date(),
        fromLang: sender === 'me' ? myLanguage : partnerLanguage,
        toLang: sender === 'me' ? partnerLanguage : myLanguage
      };
      
      setChatHistory(prev => [...prev, message]);
      
      if (sender === 'me') {
        setOriginalText(text);
        setTranslatedText(translatedText);
      }
    } catch (error) {
      console.error('翻译失败:', error);
    }
  };

  // 翻译文本
  const translateText = async (text, fromLang, toLang) => {
    // 模拟翻译API调用
    const translations = {
      "Hello! Nice to meet you. Where are you from?": "你好！很高兴认识你。你来自哪里？",
      "I'm from Tokyo. How about you?": "我来自东京。你呢？",
      "That's amazing! I've always wanted to visit Japan.": "太棒了！我一直想去日本旅游。",
      "You should definitely come! The cherry blossoms are beautiful.": "你一定要来！樱花非常美丽。",
      "What do you like to do in your free time?": "你空闲时间喜欢做什么？",
      "I love reading books and watching movies.": "我喜欢读书和看电影。",
      "Do you have any hobbies?": "你有什么爱好吗？",
      "I enjoy cooking and traveling.": "我喜欢烹饪和旅行。"
    };
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return translations[text] || `翻译: ${text}`;
  };

  // 结束通话
  const endCall = () => {
    setIsCallActive(false);
    setIsConnected(false);
    setCurrentPartner(null);
    setCallDuration(0);
    setTranslatedText('');
    setOriginalText('');
    setConnectionQuality(0);
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
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
      },
      {
        original: "I love reading books and watching movies.",
        translated: "我喜欢读书和看电影。"
      }
    ];

    let conversationIndex = 0;
    const conversationTimer = setInterval(() => {
      if (conversationIndex < conversations.length && isCallActive) {
        const current = conversations[conversationIndex];
        const sender = conversationIndex % 2 === 0 ? 'partner' : 'me';
        
        translateAndSendMessage(current.original, sender);
        
        if (sender === 'partner') {
          setOriginalText(current.original);
          setTranslatedText(current.translated);
        }
        
        conversationIndex++;
      } else {
        clearInterval(conversationTimer);
      }
    }, 6000);
  };

  // 切换静音
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
      }
    }
  };

  // 切换扬声器
  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  // 切换视频
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
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

  // 获取连接质量颜色
  const getQualityColor = (quality) => {
    if (quality >= 80) return '#10B981';
    if (quality >= 60) return '#F59E0B';
    return '#EF4444';
  };

  // 评价用户
  const rateUser = (rating) => {
    console.log('用户评价:', rating);
    // 这里应该发送评价到后端
  };

  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (matchingTimerRef.current) clearInterval(matchingTimerRef.current);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
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
        <div className="header-info">
          <div className="online-status">
            <div className="online-dot"></div>
            <span>{mockUsers.filter(u => u.isOnline).length} 人在线</span>
          </div>
          {connectionQuality > 0 && (
            <div className="connection-quality">
              <Wifi size={16} style={{ color: getQualityColor(connectionQuality) }} />
              <span>{Math.round(connectionQuality)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* 语言设置 */}
      <div className="language-setup">
        <div className="my-language">
          <label>我的语言</label>
          <select 
            value={myLanguage} 
            onChange={(e) => setMyLanguage(e.target.value)}
            className="language-select"
            disabled={isMatching || isCallActive}
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
              disabled={isCallActive}
            />
            启用实时翻译
          </label>
        </div>
      </div>

      {/* 通话类型选择 */}
      <div className="call-type-selector">
        <label>通话类型</label>
        <div className="call-type-options">
          <button
            className={`call-type-btn ${userPreferences.callType === 'audio' ? 'active' : ''}`}
            onClick={() => setUserPreferences(prev => ({ ...prev, callType: 'audio' }))}
            disabled={isMatching || isCallActive}
          >
            <Phone size={16} />
            语音通话
          </button>
          <button
            className={`call-type-btn ${userPreferences.callType === 'video' ? 'active' : ''}`}
            onClick={() => setUserPreferences(prev => ({ ...prev, callType: 'video' }))}
            disabled={isMatching || isCallActive}
          >
            <Camera size={16} />
            视频通话
          </button>
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
            <span>{Math.round(matchingProgress)}%</span>
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
              <div className="partner-stats">
                <span className="partner-rating">
                  <Star size={14} />
                  {currentPartner.rating}
                </span>
                <span className="partner-calls">
                  {currentPartner.totalCalls} 通话
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
          
          {/* 视频区域 */}
          {userPreferences.callType === 'video' && isCallActive && (
            <div className="video-container">
              <div className="remote-video">
                <video ref={remoteVideoRef} autoPlay playsInline />
                <div className="video-overlay">
                  <span>{currentPartner.name}</span>
                </div>
              </div>
              <div className="local-video">
                <video ref={localVideoRef} autoPlay playsInline muted />
                <div className="video-overlay">
                  <span>我</span>
                </div>
              </div>
            </div>
          )}
          
          {/* 通话控制 */}
          <div className="call-controls">
            {!isCallActive ? (
              <button className="start-call-btn" onClick={startCall}>
                {userPreferences.callType === 'video' ? <Camera size={24} /> : <PhoneCall size={24} />}
                开始{userPreferences.callType === 'video' ? '视频' : '语音'}通话
              </button>
            ) : (
              <div className="active-call-controls">
                <div className="call-info">
                  <Clock size={16} />
                  <span>{formatCallDuration(callDuration)}</span>
                  {connectionQuality > 0 && (
                    <span className="quality-indicator" style={{ color: getQualityColor(connectionQuality) }}>
                      {Math.round(connectionQuality)}%
                    </span>
                  )}
                </div>
                
                <div className="control-buttons">
                  <button 
                    className={`control-btn ${isMuted ? 'active' : ''}`}
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  
                  <button 
                    className={`control-btn ${!isSpeakerOn ? 'active' : ''}`}
                    onClick={toggleSpeaker}
                  >
                    {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>
                  
                  {userPreferences.callType === 'video' && (
                    <button 
                      className={`control-btn ${!isVideoEnabled ? 'active' : ''}`}
                      onClick={toggleVideo}
                    >
                      {isVideoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
                    </button>
                  )}
                  
                  <button className="end-call-btn" onClick={endCall}>
                    <PhoneOff size={20} />
                  </button>
                </div>
              </div>
            )}
            
            <div className="secondary-controls">
              <button className="skip-btn" onClick={skipUser}>
                <SkipForward size={20} />
                跳过
              </button>
              
              {isCallActive && (
                <div className="rating-controls">
                  <span>评价用户:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => rateUser(star)}>
                      <Star size={16} />
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            onChange={(e) => setUserPreferences(prev => ({ ...prev, ageRange: e.target.value }))}
            disabled={isMatching || isCallActive}
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
            {['language', 'culture', 'travel', 'music', 'sports', 'technology', 'art', 'food'].map(interest => (
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
                disabled={isMatching || isCallActive}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 使用提示 */}
      <div className="usage-tips">
        <h3>使用提示</h3>
        <ul>
          <li><strong>匹配算法</strong>：基于语言、兴趣和评分进行智能匹配</li>
          <li><strong>实时翻译</strong>：支持语音识别和实时翻译功能</li>
          <li><strong>视频通话</strong>：支持高质量的视频通话体验</li>
          <li><strong>连接质量</strong>：实时监控通话质量和网络状态</li>
          <li><strong>用户评价</strong>：通话结束后可以为对方评分</li>
          <li><strong>隐私保护</strong>：所有通话内容端到端加密</li>
        </ul>
      </div>
    </div>
  );
};

export default InternationalVoiceChat;

