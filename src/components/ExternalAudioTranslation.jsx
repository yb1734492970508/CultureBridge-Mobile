import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Headphones, Radio, Wifi } from 'lucide-react';

const ExternalAudioTranslation = () => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('zh-CN');
  const [translationText, setTranslationText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sensitivity, setSensitivity] = useState(50);
  const [detectedSources, setDetectedSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState('ambient');

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const translationHistoryRef = useRef([]);

  const languages = [
    { code: 'auto', name: '自动检测' },
    { code: 'zh-CN', name: '中文(简体)' },
    { code: 'zh-TW', name: '中文(繁体)' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'th', name: 'ไทย' },
    { code: 'vi', name: 'Tiếng Việt' }
  ];

  const audioSources = [
    { id: 'ambient', name: '环境音频', icon: Radio, description: '捕获周围所有音频' },
    { id: 'directional', name: '定向监听', icon: Headphones, description: '专注特定方向的音频' },
    { id: 'broadcast', name: '广播监听', icon: Wifi, description: '监听广播或流媒体' }
  ];

  // 初始化音频监听
  const initializeAudioListener = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
          channelCount: 2
        }
      });

      streamRef.current = stream;
      setupAudioAnalysis(stream);
      setupContinuousRecording(stream);
      
      return true;
    } catch (error) {
      console.error('音频监听初始化失败:', error);
      return false;
    }
  };

  // 设置音频分析
  const setupAudioAnalysis = (stream) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    
    analyserRef.current.fftSize = 2048;
    analyserRef.current.smoothingTimeConstant = 0.8;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioLevel = () => {
      if (analyserRef.current && isListening) {
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // 计算音频强度
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        const normalizedLevel = (average / 255) * 100;
        setAudioLevel(normalizedLevel);
        
        // 检测音频源
        detectAudioSources(dataArray);
        
        requestAnimationFrame(updateAudioLevel);
      }
    };
    updateAudioLevel();
  };

  // 检测音频源
  const detectAudioSources = (frequencyData) => {
    const sources = [];
    
    // 分析频率分布来识别不同类型的音频源
    const lowFreq = frequencyData.slice(0, 85).reduce((a, b) => a + b) / 85;
    const midFreq = frequencyData.slice(85, 255).reduce((a, b) => a + b) / 170;
    const highFreq = frequencyData.slice(255).reduce((a, b) => a + b) / (frequencyData.length - 255);
    
    if (lowFreq > 30) sources.push({ type: 'music', strength: lowFreq });
    if (midFreq > 40) sources.push({ type: 'speech', strength: midFreq });
    if (highFreq > 25) sources.push({ type: 'ambient', strength: highFreq });
    
    setDetectedSources(sources);
  };

  // 设置连续录音
  const setupContinuousRecording = (stream) => {
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    const audioChunks = [];
    let recordingStartTime = Date.now();

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
        
        // 每3秒处理一次音频数据
        if (Date.now() - recordingStartTime > 3000) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          processExternalAudio(audioBlob);
          audioChunks.length = 0;
          recordingStartTime = Date.now();
        }
      }
    };

    mediaRecorderRef.current.start(1000); // 每秒收集数据
  };

  // 处理外部音频
  const processExternalAudio = async (audioBlob) => {
    // 检查音频强度，只处理超过敏感度阈值的音频
    if (audioLevel < sensitivity) {
      return;
    }

    setIsTranslating(true);
    
    try {
      // 语音识别
      const recognizedText = await recognizeExternalAudio(audioBlob);
      
      if (recognizedText && recognizedText.trim()) {
        setOriginalText(recognizedText);
        
        // 翻译
        const translatedText = await translateText(recognizedText, sourceLanguage, targetLanguage);
        setTranslationText(translatedText);
        
        // 添加到历史记录
        const historyItem = {
          id: Date.now(),
          original: recognizedText,
          translated: translatedText,
          timestamp: new Date(),
          source: selectedSource
        };
        translationHistoryRef.current.unshift(historyItem);
        
        // 语音播放
        if (!isMuted) {
          await speakText(translatedText, targetLanguage);
        }
      }
    } catch (error) {
      console.error('外部音频处理失败:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // 识别外部音频
  const recognizeExternalAudio = async (audioBlob) => {
    // 模拟外部音频识别
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const externalAudioTexts = [
      "Welcome to our store, how can I help you?",
      "The train to Tokyo will depart from platform 3",
      "Today's weather will be sunny with a high of 25 degrees",
      "Please have your tickets ready for inspection",
      "The museum is open from 9 AM to 6 PM",
      "Would you like to try our special dish today?",
      "The next bus arrives in 5 minutes",
      "Please keep your belongings with you at all times"
    ];
    
    // 根据检测到的音频源类型返回不同的文本
    const sourceTypes = detectedSources.map(s => s.type);
    if (sourceTypes.includes('speech')) {
      return externalAudioTexts[Math.floor(Math.random() * externalAudioTexts.length)];
    }
    
    return null;
  };

  // 翻译文本
  const translateText = async (text, fromLang, toLang) => {
    const translations = {
      "Welcome to our store, how can I help you?": "欢迎来到我们的商店，我能为您做些什么？",
      "The train to Tokyo will depart from platform 3": "开往东京的列车将从3号站台发车",
      "Today's weather will be sunny with a high of 25 degrees": "今天天气晴朗，最高温度25度",
      "Please have your tickets ready for inspection": "请准备好您的车票以供检查",
      "The museum is open from 9 AM to 6 PM": "博物馆开放时间为上午9点到下午6点",
      "Would you like to try our special dish today?": "您想尝试我们今天的特色菜吗？",
      "The next bus arrives in 5 minutes": "下一班公交车5分钟后到达",
      "Please keep your belongings with you at all times": "请随时保管好您的物品"
    };
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return translations[text] || "翻译结果";
  };

  // 语音播放
  const speakText = async (text, language) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'zh-CN' ? 'zh-CN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // 开始/停止监听
  const toggleListening = async () => {
    if (isListening) {
      // 停止监听
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setIsListening(false);
      setAudioLevel(0);
      setDetectedSources([]);
    } else {
      // 开始监听
      const success = await initializeAudioListener();
      if (success) {
        setIsListening(true);
      } else {
        alert('无法访问音频设备，请检查权限设置');
      }
    }
  };

  // 清除翻译结果
  const clearTranslation = () => {
    setOriginalText('');
    setTranslationText('');
    translationHistoryRef.current = [];
  };

  return (
    <div className="external-audio-translation">
      {/* 头部 */}
      <div className="translation-header">
        <h2 className="translation-title">外部音频翻译</h2>
        <div className="header-status">
          {isListening && (
            <div className="listening-indicator">
              <div className="listening-dot"></div>
              <span>监听中</span>
            </div>
          )}
        </div>
      </div>

      {/* 音频源选择 */}
      <div className="audio-source-selector">
        <h3>音频源</h3>
        <div className="source-options">
          {audioSources.map(source => {
            const IconComponent = source.icon;
            return (
              <button
                key={source.id}
                className={`source-option ${selectedSource === source.id ? 'active' : ''}`}
                onClick={() => setSelectedSource(source.id)}
              >
                <IconComponent size={20} />
                <div className="source-info">
                  <span className="source-name">{source.name}</span>
                  <span className="source-description">{source.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 语言设置 */}
      <div className="language-settings">
        <div className="language-group">
          <label>源语言</label>
          <select 
            value={sourceLanguage} 
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="language-select"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="language-group">
          <label>目标语言</label>
          <select 
            value={targetLanguage} 
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="language-select"
          >
            {languages.filter(lang => lang.code !== 'auto').map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 敏感度设置 */}
      <div className="sensitivity-control">
        <label>监听敏感度: {sensitivity}%</label>
        <input
          type="range"
          min="10"
          max="90"
          value={sensitivity}
          onChange={(e) => setSensitivity(parseInt(e.target.value))}
          className="sensitivity-slider"
        />
        <div className="sensitivity-labels">
          <span>低</span>
          <span>高</span>
        </div>
      </div>

      {/* 音频可视化 */}
      <div className="audio-monitor">
        <div className="monitor-display">
          <div className="audio-level-meter">
            <div 
              className="level-bar"
              style={{ width: `${audioLevel}%` }}
            />
            <div 
              className="sensitivity-line"
              style={{ left: `${sensitivity}%` }}
            />
          </div>
          <div className="level-info">
            <span>音频强度: {Math.round(audioLevel)}%</span>
            <span>阈值: {sensitivity}%</span>
          </div>
        </div>
        
        {/* 检测到的音频源 */}
        {detectedSources.length > 0 && (
          <div className="detected-sources">
            <h4>检测到的音频源</h4>
            <div className="source-list">
              {detectedSources.map((source, index) => (
                <div key={index} className="detected-source">
                  <span className="source-type">{source.type}</span>
                  <div className="source-strength">
                    <div 
                      className="strength-bar"
                      style={{ width: `${(source.strength / 255) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="control-buttons">
        <button 
          className={`listen-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          {isListening ? '停止监听' : '开始监听'}
        </button>
        
        <button 
          className="mute-btn"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        
        <button 
          className="clear-btn"
          onClick={clearTranslation}
        >
          清除
        </button>
      </div>

      {/* 翻译状态 */}
      {isTranslating && (
        <div className="translation-status">
          <div className="loading-spinner"></div>
          <span>正在翻译外部音频...</span>
        </div>
      )}

      {/* 当前翻译结果 */}
      {originalText && (
        <div className="current-translation">
          <div className="translation-card original">
            <div className="card-header">
              <span className="language-label">原文</span>
              <button 
                className="speak-btn"
                onClick={() => speakText(originalText, sourceLanguage)}
              >
                <Volume2 size={16} />
              </button>
            </div>
            <p className="translation-text">{originalText}</p>
          </div>
          
          {translationText && (
            <div className="translation-card translated">
              <div className="card-header">
                <span className="language-label">译文</span>
                <button 
                  className="speak-btn"
                  onClick={() => speakText(translationText, targetLanguage)}
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="translation-text">{translationText}</p>
            </div>
          )}
        </div>
      )}

      {/* 翻译历史 */}
      {translationHistoryRef.current.length > 0 && (
        <div className="translation-history">
          <h3>翻译历史</h3>
          <div className="history-list">
            {translationHistoryRef.current.slice(0, 5).map(item => (
              <div key={item.id} className="history-item">
                <div className="history-time">
                  {item.timestamp.toLocaleTimeString()}
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
      <div className="usage-guide">
        <h3>使用说明</h3>
        <ul>
          <li>选择合适的音频源类型以获得最佳监听效果</li>
          <li>调整敏感度以过滤背景噪音</li>
          <li>系统会自动检测并翻译周围的语音内容</li>
          <li>支持多种语言的实时翻译和语音播放</li>
          <li>翻译历史会保存最近的5条记录</li>
        </ul>
      </div>
    </div>
  );
};

export default ExternalAudioTranslation;

