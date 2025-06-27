import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Settings, Headphones, Radio, Wifi, 
  AlertCircle, Activity, Download, Trash2, Play, Pause 
} from 'lucide-react';

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
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [translationHistory, setTranslationHistory] = useState([]);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [audioQuality, setAudioQuality] = useState('high');
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const translationQueueRef = useRef([]);
  const lastTranslationTimeRef = useRef(0);

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

  // 初始化Web Speech API
  const initializeWebSpeechAPI = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = sourceLanguage === 'auto' ? 'en-US' : sourceLanguage;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript && finalTranscript.trim()) {
          // 防抖处理，避免重复翻译
          const now = Date.now();
          if (now - lastTranslationTimeRef.current > 2000) {
            lastTranslationTimeRef.current = now;
            processRecognizedText(finalTranscript.trim());
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        setError(`语音识别错误: ${event.error}`);
        setConnectionStatus('error');
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          // 自动重启识别
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('重启语音识别失败:', error);
              }
            }
          }, 100);
        }
      };
      
      return true;
    }
    return false;
  };

  // 初始化音频监听
  const initializeAudioListener = async () => {
    try {
      setError('');
      
      const constraints = {
        audio: {
          echoCancellation: noiseReduction,
          noiseSuppression: noiseReduction,
          autoGainControl: true,
          sampleRate: audioQuality === 'high' ? 44100 : 22050,
          channelCount: selectedSource === 'directional' ? 2 : 1
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      setupAudioAnalysis(stream);
      
      // 使用Web Speech API进行实时语音识别
      if (initializeWebSpeechAPI()) {
        recognitionRef.current.start();
        setConnectionStatus('connected');
      } else {
        // 降级到MediaRecorder方案
        setupContinuousRecording(stream);
        setConnectionStatus('connected');
      }
      
      return true;
    } catch (error) {
      console.error('音频监听初始化失败:', error);
      setError(`无法访问音频设备: ${error.message}`);
      setConnectionStatus('error');
      return false;
    }
  };

  // 设置音频分析
  const setupAudioAnalysis = (stream) => {
    try {
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
    } catch (error) {
      console.error('音频分析设置失败:', error);
      setError('音频分析设置失败');
    }
  };

  // 检测音频源
  const detectAudioSources = (frequencyData) => {
    const sources = [];
    
    // 分析频率分布来识别不同类型的音频源
    const lowFreq = frequencyData.slice(0, 85).reduce((a, b) => a + b) / 85;
    const midFreq = frequencyData.slice(85, 255).reduce((a, b) => a + b) / 170;
    const highFreq = frequencyData.slice(255).reduce((a, b) => a + b) / (frequencyData.length - 255);
    
    if (lowFreq > 30) sources.push({ type: 'music', strength: lowFreq, name: '音乐' });
    if (midFreq > 40) sources.push({ type: 'speech', strength: midFreq, name: '语音' });
    if (highFreq > 25) sources.push({ type: 'ambient', strength: highFreq, name: '环境音' });
    
    setDetectedSources(sources);
  };

  // 设置连续录音（降级方案）
  const setupContinuousRecording = (stream) => {
    try {
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
    } catch (error) {
      console.error('MediaRecorder设置失败:', error);
      setError('录音设置失败');
    }
  };

  // 处理识别到的文本
  const processRecognizedText = async (text) => {
    // 检查音频强度，只处理超过敏感度阈值的音频
    if (audioLevel < sensitivity) {
      return;
    }

    setOriginalText(text);
    
    if (autoTranslate) {
      await translateText(text, sourceLanguage, targetLanguage);
    }
  };

  // 处理外部音频（降级方案）
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
        await processRecognizedText(recognizedText.trim());
      }
    } catch (error) {
      console.error('外部音频处理失败:', error);
      setError('音频处理失败');
    } finally {
      setIsTranslating(false);
    }
  };

  // 识别外部音频（降级方案）
  const recognizeExternalAudio = async (audioBlob) => {
    try {
      // 这里应该调用真实的语音识别API
      // 例如：Google Cloud Speech-to-Text, Azure Speech Services等
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const externalAudioTexts = [
        "Welcome to our store, how can I help you?",
        "The train to Tokyo will depart from platform 3",
        "Today's weather will be sunny with a high of 25 degrees",
        "Please have your tickets ready for inspection",
        "The museum is open from 9 AM to 6 PM",
        "Would you like to try our special dish today?",
        "The next bus arrives in 5 minutes",
        "Please keep your belongings with you at all times",
        "Excuse me, where is the nearest restroom?",
        "How much does this item cost?",
        "Can you recommend a good restaurant nearby?",
        "What time does the store close?"
      ];
      
      // 根据检测到的音频源类型返回不同的文本
      const sourceTypes = detectedSources.map(s => s.type);
      if (sourceTypes.includes('speech')) {
        return externalAudioTexts[Math.floor(Math.random() * externalAudioTexts.length)];
      }
      
      return null;
    } catch (error) {
      console.error('语音识别失败:', error);
      throw error;
    }
  };

  // 翻译文本
  const translateText = async (text, fromLang, toLang) => {
    setIsTranslating(true);
    
    try {
      // 调用翻译API
      const translatedText = await callTranslationAPI(text, fromLang, toLang);
      setTranslationText(translatedText);
      
      // 添加到历史记录
      const historyItem = {
        id: Date.now(),
        original: text,
        translated: translatedText,
        timestamp: new Date(),
        source: selectedSource,
        fromLang,
        toLang,
        audioLevel: Math.round(audioLevel)
      };
      
      setTranslationHistory(prev => [historyItem, ...prev.slice(0, 19)]); // 保留最近20条
      
      // 语音播放
      if (!isMuted) {
        await speakText(translatedText, toLang);
      }
    } catch (error) {
      console.error('翻译失败:', error);
      setError('翻译服务暂时不可用');
    } finally {
      setIsTranslating(false);
    }
  };

  // 调用翻译API
  const callTranslationAPI = async (text, fromLang, toLang) => {
    try {
      // 这里应该调用真实的翻译API
      // 示例实现：
      /*
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          from: fromLang,
          to: toLang
        })
      });
      
      const result = await response.json();
      return result.translatedText;
      */
      
      // 模拟翻译结果
      const translations = {
        "Welcome to our store, how can I help you?": "欢迎来到我们的商店，我能为您做些什么？",
        "The train to Tokyo will depart from platform 3": "开往东京的列车将从3号站台发车",
        "Today's weather will be sunny with a high of 25 degrees": "今天天气晴朗，最高温度25度",
        "Please have your tickets ready for inspection": "请准备好您的车票以供检查",
        "The museum is open from 9 AM to 6 PM": "博物馆开放时间为上午9点到下午6点",
        "Would you like to try our special dish today?": "您想尝试我们今天的特色菜吗？",
        "The next bus arrives in 5 minutes": "下一班公交车5分钟后到达",
        "Please keep your belongings with you at all times": "请随时保管好您的物品",
        "Excuse me, where is the nearest restroom?": "请问，最近的洗手间在哪里？",
        "How much does this item cost?": "这个物品多少钱？",
        "Can you recommend a good restaurant nearby?": "您能推荐附近的好餐厅吗？",
        "What time does the store close?": "商店几点关门？"
      };
      
      await new Promise(resolve => setTimeout(resolve, 300));
      return translations[text] || `翻译: ${text}`;
    } catch (error) {
      console.error('翻译API调用失败:', error);
      throw error;
    }
  };

  // 语音播放
  const speakText = async (text, language) => {
    if ('speechSynthesis' in window) {
      // 停止当前播放
      speechSynthesis.cancel();
      
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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
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
      setConnectionStatus('disconnected');
    } else {
      // 开始监听
      const success = await initializeAudioListener();
      if (success) {
        setIsListening(true);
      }
    }
  };

  // 清除翻译结果
  const clearTranslation = () => {
    setOriginalText('');
    setTranslationText('');
    setError('');
  };

  // 清除历史记录
  const clearHistory = () => {
    setTranslationHistory([]);
  };

  // 导出翻译历史
  const exportHistory = () => {
    const data = translationHistory.map(item => ({
      时间: item.timestamp.toLocaleString(),
      原文: item.original,
      译文: item.translated,
      语言: `${item.fromLang} → ${item.toLang}`,
      音频源: item.source,
      音频强度: `${item.audioLevel}%`
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `external_audio_translation_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 播放历史记录中的翻译
  const playHistoryItem = (item) => {
    speakText(item.translated, item.toLang);
  };

  return (
    <div className="external-audio-translation">
      {/* 头部 */}
      <div className="translation-header">
        <h2 className="translation-title">外部音频实时翻译</h2>
        <div className="header-controls">
          <div className={`connection-status ${connectionStatus}`}>
            <Activity size={16} />
            <span>
              {connectionStatus === 'connected' ? '监听中' : 
               connectionStatus === 'error' ? '连接错误' : '未连接'}
            </span>
          </div>
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={16} />
          </button>
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

      {/* 设置面板 */}
      {showSettings && (
        <div className="settings-panel">
          <h3>高级设置</h3>
          <div className="setting-item">
            <label>音频质量</label>
            <select 
              value={audioQuality} 
              onChange={(e) => setAudioQuality(e.target.value)}
            >
              <option value="low">低质量 (22kHz)</option>
              <option value="high">高质量 (44kHz)</option>
            </select>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={noiseReduction}
                onChange={(e) => setNoiseReduction(e.target.checked)}
              />
              启用噪音抑制
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
              />
              自动翻译
            </label>
          </div>
        </div>
      )}

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
                disabled={isListening}
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
            disabled={isListening}
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
            disabled={isListening}
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
          disabled={isListening}
        />
        <div className="sensitivity-labels">
          <span>低敏感度</span>
          <span>高敏感度</span>
        </div>
      </div>

      {/* 音频监控 */}
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
                  <span className="source-type">{source.name}</span>
                  <div className="source-strength">
                    <div 
                      className="strength-bar"
                      style={{ width: `${(source.strength / 255) * 100}%` }}
                    />
                    <span>{Math.round((source.strength / 255) * 100)}%</span>
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
      {translationHistory.length > 0 && (
        <div className="translation-history">
          <div className="history-header">
            <h3>翻译历史 ({translationHistory.length})</h3>
            <div className="history-controls">
              <button onClick={exportHistory}>
                <Download size={16} />
                导出
              </button>
              <button onClick={clearHistory}>
                <Trash2 size={16} />
                清除
              </button>
            </div>
          </div>
          <div className="history-list">
            {translationHistory.slice(0, 10).map(item => (
              <div key={item.id} className="history-item">
                <div className="history-meta">
                  <span className="history-time">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="history-source">{item.source}</span>
                  <span className="history-level">{item.audioLevel}%</span>
                  <button 
                    className="play-btn"
                    onClick={() => playHistoryItem(item)}
                  >
                    <Play size={12} />
                  </button>
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
          <li><strong>音频源选择</strong>：选择合适的音频源类型以获得最佳监听效果</li>
          <li><strong>敏感度调节</strong>：调整敏感度以过滤背景噪音，避免误触发</li>
          <li><strong>实时识别</strong>：使用Web Speech API进行实时语音识别</li>
          <li><strong>音频分析</strong>：自动检测并分类不同类型的音频源</li>
          <li><strong>翻译历史</strong>：自动保存翻译历史，支持回放和导出</li>
          <li><strong>噪音抑制</strong>：在设置中启用噪音抑制以提高识别准确率</li>
        </ul>
      </div>
    </div>
  );
};

export default ExternalAudioTranslation;

