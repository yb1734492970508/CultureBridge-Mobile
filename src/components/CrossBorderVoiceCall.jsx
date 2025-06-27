import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, 
  Settings, Wifi, AlertCircle, Activity, Users,
  Globe, Languages, Star, Clock, Signal
} from 'lucide-react';

const CrossBorderVoiceCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [myLanguage, setMyLanguage] = useState('zh-CN');
  const [partnerLanguage, setPartnerLanguage] = useState('en-US');
  const [callQuality, setCallQuality] = useState(0);
  const [translationDelay, setTranslationDelay] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [networkLatency, setNetworkLatency] = useState(0);
  const [audioQuality, setAudioQuality] = useState('high');
  const [translationMode, setTranslationMode] = useState('realtime');
  const [currentTranslation, setCurrentTranslation] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [translationHistory, setTranslationHistory] = useState([]);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const callTimerRef = useRef(null);
  const qualityTimerRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const recognitionRef = useRef(null);

  const languages = [
    { code: 'zh-CN', name: '中文（简体）', flag: '🇨🇳' },
    { code: 'zh-TW', name: '中文（繁体）', flag: '🇹🇼' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt-PT', name: 'Português', flag: '🇵🇹' },
    { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'th-TH', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  // 初始化WebRTC连接
  const initializeWebRTC = async () => {
    try {
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      };

      peerConnectionRef.current = new RTCPeerConnection(configuration);

      // 监听连接状态
      peerConnectionRef.current.onconnectionstatechange = () => {
        const state = peerConnectionRef.current.connectionState;
        setConnectionStatus(state);
        
        if (state === 'connected') {
          setError('');
        } else if (state === 'failed' || state === 'disconnected') {
          setError('连接失败或断开');
        }
      };

      // 监听ICE连接状态
      peerConnectionRef.current.oniceconnectionstatechange = () => {
        const state = peerConnectionRef.current.iceConnectionState;
        console.log('ICE连接状态:', state);
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
          autoGainControl: true,
          sampleRate: audioQuality === 'high' ? 48000 : 16000
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      // 添加音频轨道到peer connection
      if (peerConnectionRef.current) {
        stream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, stream);
        });
      }

      return true;
    } catch (error) {
      console.error('获取用户媒体失败:', error);
      setError('无法访问麦克风');
      return false;
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
          setOriginalText(finalTranscript);
          translateText(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        setError(`语音识别错误: ${event.error}`);
      };
      
      recognitionRef.current.onend = () => {
        if (isCallActive && translationMode === 'realtime') {
          // 自动重启识别
          setTimeout(() => {
            if (recognitionRef.current && isCallActive) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('重启语音识别失败:', error);
              }
            }
          }, 100);
        }
      };
      
      if (translationMode === 'realtime') {
        recognitionRef.current.start();
      }
    }
  };

  // 翻译文本
  const translateText = async (text) => {
    try {
      const startTime = Date.now();
      
      // 模拟翻译API调用
      const translatedText = await callTranslationAPI(text, myLanguage, partnerLanguage);
      
      const endTime = Date.now();
      const delay = endTime - startTime;
      setTranslationDelay(delay);
      
      setCurrentTranslation(translatedText);
      
      // 添加到历史记录
      const historyItem = {
        id: Date.now(),
        original: text,
        translated: translatedText,
        timestamp: new Date(),
        delay
      };
      
      setTranslationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('翻译失败:', error);
      setError('翻译服务不可用');
    }
  };

  // 调用翻译API
  const callTranslationAPI = async (text, fromLang, toLang) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // 模拟翻译结果
    const translations = {
      "你好，很高兴认识你": "Hello, nice to meet you",
      "今天天气怎么样？": "How's the weather today?",
      "我来自中国": "I'm from China",
      "你的爱好是什么？": "What are your hobbies?",
      "我喜欢旅行和摄影": "I like traveling and photography",
      "Hello, nice to meet you": "你好，很高兴认识你",
      "How are you doing today?": "你今天过得怎么样？",
      "I'm from the United States": "我来自美国",
      "What do you like to do for fun?": "你喜欢做什么娱乐活动？",
      "I enjoy reading and cooking": "我喜欢阅读和烹饪"
    };
    
    return translations[text] || `[翻译] ${text}`;
  };

  // 开始通话
  const handleCall = async () => {
    if (isCallActive) {
      // 结束通话
      endCall();
    } else {
      // 开始通话
      setIsConnecting(true);
      setError('');
      
      try {
        // 初始化WebRTC
        const webrtcReady = await initializeWebRTC();
        if (!webrtcReady) {
          setIsConnecting(false);
          return;
        }
        
        // 获取用户媒体
        const mediaReady = await getUserMedia();
        if (!mediaReady) {
          setIsConnecting(false);
          return;
        }
        
        // 模拟连接过程
        setTimeout(() => {
          setIsConnecting(false);
          setIsCallActive(true);
          setCallDuration(0);
          
          // 开始计时和质量监控
          startCallTimers();
          
          // 初始化语音识别
          if (translationMode === 'realtime') {
            initializeVoiceRecognition();
          }
          
          // 模拟对话
          simulateConversation();
          
        }, 2000);
        
      } catch (error) {
        console.error('通话启动失败:', error);
        setError('通话启动失败');
        setIsConnecting(false);
      }
    }
  };

  // 结束通话
  const endCall = () => {
    setIsCallActive(false);
    setIsConnecting(false);
    setCallDuration(0);
    setCallQuality(0);
    setTranslationDelay(0);
    setNetworkLatency(0);
    setCurrentTranslation('');
    setOriginalText('');
    setConnectionStatus('disconnected');
    
    // 清理定时器
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    if (qualityTimerRef.current) {
      clearInterval(qualityTimerRef.current);
    }
    
    // 停止语音识别
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // 停止媒体流
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // 关闭peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  // 开始计时和质量监控
  const startCallTimers = () => {
    // 通话时长计时
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // 质量监控
    qualityTimerRef.current = setInterval(() => {
      // 模拟通话质量和延迟变化
      const baseQuality = 85;
      const qualityVariation = (Math.random() - 0.5) * 20;
      const newQuality = Math.max(60, Math.min(100, baseQuality + qualityVariation));
      setCallQuality(newQuality);
      
      const baseLatency = 120;
      const latencyVariation = (Math.random() - 0.5) * 80;
      const newLatency = Math.max(50, Math.min(300, baseLatency + latencyVariation));
      setNetworkLatency(newLatency);
    }, 1000);
  };

  // 模拟对话
  const simulateConversation = () => {
    const conversations = [
      { text: "Hello, nice to meet you", delay: 3000 },
      { text: "How are you doing today?", delay: 8000 },
      { text: "I'm from the United States", delay: 15000 },
      { text: "What do you like to do for fun?", delay: 22000 },
      { text: "I enjoy reading and cooking", delay: 30000 }
    ];
    
    conversations.forEach(({ text, delay }) => {
      setTimeout(() => {
        if (isCallActive) {
          setOriginalText(text);
          translateText(text);
        }
      }, delay);
    });
  };

  // 交换语言
  const swapLanguages = () => {
    const temp = myLanguage;
    setMyLanguage(partnerLanguage);
    setPartnerLanguage(temp);
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

  // 格式化时长
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取质量颜色
  const getQualityColor = (quality) => {
    if (quality >= 90) return '#10B981';
    if (quality >= 70) return '#F59E0B';
    return '#EF4444';
  };

  // 获取延迟颜色
  const getDelayColor = (delay) => {
    if (delay <= 150) return '#10B981';
    if (delay <= 250) return '#F59E0B';
    return '#EF4444';
  };

  // 获取连接状态文本
  const getConnectionStatusText = (status) => {
    const statusMap = {
      'new': '初始化',
      'connecting': '连接中',
      'connected': '已连接',
      'disconnected': '已断开',
      'failed': '连接失败',
      'closed': '已关闭'
    };
    return statusMap[status] || status;
  };

  // 清理资源
  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (qualityTimerRef.current) clearInterval(qualityTimerRef.current);
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
    <div className="cross-border-voice-call">
      {/* 头部 */}
      <div className="call-header">
        <h2 className="call-title">
          <Globe size={24} />
          跨国语音通话
        </h2>
        <div className="connection-info">
          <div className={`connection-status ${connectionStatus}`}>
            <Activity size={16} />
            <span>{getConnectionStatusText(connectionStatus)}</span>
          </div>
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
      <div className="language-settings">
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
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="language-swap">
          <button 
            className="btn btn-secondary"
            onClick={swapLanguages}
            disabled={isCallActive || isConnecting}
          >
            <Languages size={16} />
            交换语言
          </button>
        </div>

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
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 通话设置 */}
      <div className="call-settings">
        <div className="setting-group">
          <label>音频质量</label>
          <select 
            value={audioQuality}
            onChange={(e) => setAudioQuality(e.target.value)}
            disabled={isCallActive || isConnecting}
          >
            <option value="low">标准质量 (16kHz)</option>
            <option value="high">高质量 (48kHz)</option>
          </select>
        </div>
        
        <div className="setting-group">
          <label>翻译模式</label>
          <select 
            value={translationMode}
            onChange={(e) => setTranslationMode(e.target.value)}
            disabled={isCallActive || isConnecting}
          >
            <option value="realtime">实时翻译</option>
            <option value="manual">手动翻译</option>
          </select>
        </div>
      </div>

      {/* 通话状态 */}
      <div className="call-status">
        <div className={`status-indicator ${
          isCallActive ? 'status-connected' : 
          isConnecting ? 'status-connecting' : 
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
        <div className="call-duration">
          <Clock size={20} />
          <span className="duration-text">{formatDuration(callDuration)}</span>
        </div>
      )}

      {/* 通话质量指标 */}
      {isCallActive && (
        <div className="quality-metrics">
          <div className="metric-card">
            <div className="metric-header">
              <Signal size={16} />
              <span>通话质量</span>
            </div>
            <div 
              className="metric-value"
              style={{ color: getQualityColor(callQuality) }}
            >
              {Math.round(callQuality)}%
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <Wifi size={16} />
              <span>网络延迟</span>
            </div>
            <div 
              className="metric-value"
              style={{ color: getDelayColor(networkLatency) }}
            >
              {Math.round(networkLatency)}ms
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <Languages size={16} />
              <span>翻译延迟</span>
            </div>
            <div 
              className="metric-value"
              style={{ color: getDelayColor(translationDelay) }}
            >
              {Math.round(translationDelay)}ms
            </div>
          </div>
        </div>
      )}

      {/* 通话控制按钮 */}
      <div className="call-controls">
        <div className="primary-controls">
          <button 
            className={`call-btn ${
              isCallActive ? 'end-call' : 
              isConnecting ? 'connecting' : 
              'start-call'
            }`}
            onClick={handleCall}
            disabled={isConnecting}
          >
            {isCallActive ? <PhoneOff size={24} /> : <Phone size={24} />}
            {isCallActive ? '结束通话' : 
             isConnecting ? '连接中...' : 
             '开始通话'}
          </button>
        </div>

        {isCallActive && (
          <div className="secondary-controls">
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
          </div>
        )}
      </div>

      {/* 实时翻译显示 */}
      {isCallActive && (originalText || currentTranslation) && (
        <div className="translation-display">
          <h4>实时翻译</h4>
          
          {originalText && (
            <div className="translation-card original">
              <div className="card-header">
                <span className="language-label">对方说</span>
                <span className="language-flag">
                  {languages.find(l => l.code === partnerLanguage)?.flag}
                </span>
              </div>
              <p className="translation-text">{originalText}</p>
            </div>
          )}
          
          {currentTranslation && (
            <div className="translation-card translated">
              <div className="card-header">
                <span className="language-label">翻译结果</span>
                <span className="language-flag">
                  {languages.find(l => l.code === myLanguage)?.flag}
                </span>
              </div>
              <p className="translation-text">{currentTranslation}</p>
            </div>
          )}
        </div>
      )}

      {/* 翻译历史 */}
      {translationHistory.length > 0 && (
        <div className="translation-history">
          <h4>对话历史</h4>
          <div className="history-list">
            {translationHistory.slice(0, 5).map(item => (
              <div key={item.id} className="history-item">
                <div className="history-meta">
                  <span className="history-time">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="history-delay">
                    {item.delay}ms
                  </span>
                </div>
                <div className="history-content">
                  <p className="history-original">{item.original}</p>
                  <p className="history-translated">{item.translated}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="usage-instructions">
        <h4>使用说明</h4>
        <ul>
          <li><strong>语言设置</strong>：设置您和对方的语言以获得最佳翻译效果</li>
          <li><strong>音频质量</strong>：高质量模式提供更好的语音识别准确度</li>
          <li><strong>翻译模式</strong>：实时模式自动翻译，手动模式需要手动触发</li>
          <li><strong>质量监控</strong>：实时监控通话质量、网络延迟和翻译延迟</li>
          <li><strong>对话历史</strong>：自动保存翻译历史，方便回顾对话内容</li>
          <li><strong>网络要求</strong>：建议使用稳定的Wi-Fi或4G网络以获得最佳体验</li>
        </ul>
      </div>
    </div>
  );
};

export default CrossBorderVoiceCall;

