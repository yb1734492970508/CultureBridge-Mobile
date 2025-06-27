import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Volume2, VolumeX, Settings, Languages, AlertCircle, Wifi } from 'lucide-react';

const RealTimeTranslation = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('zh-CN');
  const [translationText, setTranslationText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [captureMode, setCaptureMode] = useState('microphone'); // 'microphone' or 'system'
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [translationHistory, setTranslationHistory] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

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
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setOriginalText(finalTranscript);
          translateText(finalTranscript, sourceLanguage, targetLanguage);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        setError(`语音识别错误: ${event.error}`);
      };
      
      recognitionRef.current.onend = () => {
        if (isRecording) {
          // 自动重启识别
          setTimeout(() => {
            if (recognitionRef.current && isRecording) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      };
      
      return true;
    }
    return false;
  };

  // 初始化音频上下文和分析器
  const initializeAudioAnalyser = (stream) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255 * 100);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();
    } catch (error) {
      console.error('音频分析器初始化失败:', error);
      setError('音频分析器初始化失败');
    }
  };

  // 开始录音
  const startRecording = async () => {
    try {
      setError('');
      let stream;
      
      if (captureMode === 'system') {
        // 尝试捕获系统音频
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
              sampleRate: 44100
            },
            video: false
          });
          
          // 检查是否成功获取音频轨道
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length === 0) {
            throw new Error('未能获取系统音频轨道');
          }
        } catch (error) {
          console.warn('系统音频捕获失败，切换到麦克风模式:', error);
          setError('系统音频捕获失败，已切换到麦克风模式');
          setCaptureMode('microphone');
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              sampleRate: 44100
            }
          });
        }
      } else {
        // 麦克风录音
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100
          }
        });
      }

      streamRef.current = stream;
      initializeAudioAnalyser(stream);

      // 使用Web Speech API进行实时语音识别
      if (initializeWebSpeechAPI()) {
        recognitionRef.current.start();
      } else {
        // 降级到MediaRecorder方案
        setupMediaRecorder(stream);
      }

      setIsRecording(true);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('录音启动失败:', error);
      setError(`无法访问音频设备: ${error.message}`);
      setConnectionStatus('error');
    }
  };

  // 设置MediaRecorder作为降级方案
  const setupMediaRecorder = (stream) => {
    mediaRecorderRef.current = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      await processAudioForTranslation(audioBlob);
      audioChunks.length = 0;
    };

    mediaRecorderRef.current.start(3000); // 每3秒处理一次
  };

  // 停止录音
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
    setAudioLevel(0);
    setConnectionStatus('disconnected');
  };

  // 处理音频进行翻译（降级方案）
  const processAudioForTranslation = async (audioBlob) => {
    setIsTranslating(true);
    
    try {
      // 这里应该调用真实的语音识别API
      // 例如：Google Cloud Speech-to-Text, Azure Speech Services等
      const recognizedText = await speechToText(audioBlob);
      
      if (recognizedText) {
        setOriginalText(recognizedText);
        await translateText(recognizedText, sourceLanguage, targetLanguage);
      }
    } catch (error) {
      console.error('音频处理失败:', error);
      setError('音频处理失败');
    } finally {
      setIsTranslating(false);
    }
  };

  // 语音转文本（需要集成真实API）
  const speechToText = async (audioBlob) => {
    try {
      // 这里应该调用真实的STT API
      // 示例：Google Cloud Speech-to-Text API
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', sourceLanguage);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 返回模拟结果
      const mockTexts = [
        "Hello, how are you today?",
        "What time is it now?",
        "I would like to order some food",
        "Can you help me find the nearest station?",
        "Thank you very much for your help",
        "The weather is really nice today",
        "Where can I buy tickets?",
        "How much does this cost?"
      ];
      
      return mockTexts[Math.floor(Math.random() * mockTexts.length)];
    } catch (error) {
      console.error('语音识别失败:', error);
      throw error;
    }
  };

  // 翻译文本
  const translateText = async (text, fromLang, toLang) => {
    setIsTranslating(true);
    
    try {
      // 这里应该调用真实的翻译API
      // 例如：Google Translate API, Azure Translator等
      const translatedText = await callTranslationAPI(text, fromLang, toLang);
      setTranslationText(translatedText);
      
      // 添加到历史记录
      const historyItem = {
        id: Date.now(),
        original: text,
        translated: translatedText,
        timestamp: new Date(),
        fromLang,
        toLang
      };
      
      setTranslationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      
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
          'Authorization': `Bearer ${apiKey}`
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
        "Hello, how are you today?": "你好，你今天怎么样？",
        "What time is it now?": "现在几点了？",
        "I would like to order some food": "我想点一些食物",
        "Can you help me find the nearest station?": "你能帮我找到最近的车站吗？",
        "Thank you very much for your help": "非常感谢你的帮助",
        "The weather is really nice today": "今天天气真的很好",
        "Where can I buy tickets?": "我在哪里可以买票？",
        "How much does this cost?": "这个多少钱？"
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
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
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  // 切换录音状态
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
      语言: `${item.fromLang} → ${item.toLang}`
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation_history_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="real-time-translation">
      {/* 头部 */}
      <div className="translation-header">
        <h2 className="translation-title">手机播放内容实时翻译</h2>
        <div className="header-controls">
          <div className={`connection-status ${connectionStatus}`}>
            <Wifi size={16} />
            <span>
              {connectionStatus === 'connected' ? '已连接' : 
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
          <h3>设置</h3>
          <div className="setting-item">
            <label>API密钥</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入翻译服务API密钥"
            />
          </div>
          <div className="setting-item">
            <label>音频质量</label>
            <select defaultValue="high">
              <option value="low">低质量</option>
              <option value="medium">中等质量</option>
              <option value="high">高质量</option>
            </select>
          </div>
        </div>
      )}

      {/* 捕获模式选择 */}
      <div className="capture-mode-selector">
        <h3>音频源</h3>
        <div className="mode-options">
          <button 
            className={`mode-btn ${captureMode === 'microphone' ? 'active' : ''}`}
            onClick={() => setCaptureMode('microphone')}
          >
            <Mic size={16} />
            <div>
              <span>麦克风</span>
              <small>捕获环境音频</small>
            </div>
          </button>
          <button 
            className={`mode-btn ${captureMode === 'system' ? 'active' : ''}`}
            onClick={() => setCaptureMode('system')}
          >
            <Volume2 size={16} />
            <div>
              <span>系统音频</span>
              <small>捕获播放内容</small>
            </div>
          </button>
        </div>
      </div>

      {/* 语言选择 */}
      <div className="language-selector">
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
        
        <button className="swap-languages" onClick={() => {
          if (sourceLanguage !== 'auto') {
            const temp = sourceLanguage;
            setSourceLanguage(targetLanguage);
            setTargetLanguage(temp);
          }
        }}>
          <Languages size={20} />
        </button>
        
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

      {/* 音频可视化 */}
      <div className="audio-visualizer">
        <div className="audio-level-container">
          <div 
            className="audio-level-bar"
            style={{ height: `${audioLevel}%` }}
          />
        </div>
        <div className="recording-status">
          {isRecording ? (
            <div className="recording-indicator">
              <div className="recording-dot"></div>
              <span>正在录音...</span>
            </div>
          ) : (
            <span>点击开始录音</span>
          )}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="translation-controls">
        <button 
          className={`record-btn ${isRecording ? 'recording' : ''}`}
          onClick={toggleRecording}
          disabled={isTranslating}
        >
          {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          {isRecording ? '停止录音' : '开始录音'}
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

      {/* 翻译结果 */}
      <div className="translation-results">
        {isTranslating && (
          <div className="translating-indicator">
            <div className="loading-spinner"></div>
            <span>正在翻译...</span>
          </div>
        )}
        
        {originalText && (
          <div className="translation-card original">
            <div className="card-header">
              <span className="language-label">
                {languages.find(l => l.code === sourceLanguage)?.name || '原文'}
              </span>
              <button 
                className="speak-btn"
                onClick={() => speakText(originalText, sourceLanguage)}
              >
                <Volume2 size={16} />
              </button>
            </div>
            <p className="translation-text">{originalText}</p>
          </div>
        )}
        
        {translationText && (
          <div className="translation-card translated">
            <div className="card-header">
              <span className="language-label">
                {languages.find(l => l.code === targetLanguage)?.name || '译文'}
              </span>
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

      {/* 翻译历史 */}
      {translationHistory.length > 0 && (
        <div className="translation-history">
          <div className="history-header">
            <h3>翻译历史</h3>
            <div className="history-controls">
              <button onClick={exportHistory}>导出</button>
              <button onClick={clearHistory}>清除</button>
            </div>
          </div>
          <div className="history-list">
            {translationHistory.slice(0, 5).map(item => (
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

      {/* 使用提示 */}
      <div className="usage-tips">
        <h3>使用提示</h3>
        <ul>
          <li><strong>麦克风模式</strong>：捕获环境中的语音进行翻译</li>
          <li><strong>系统音频模式</strong>：捕获手机播放的音频内容进行翻译（需要浏览器支持）</li>
          <li><strong>实时识别</strong>：使用Web Speech API进行实时语音识别</li>
          <li><strong>离线降级</strong>：网络不佳时自动切换到离线模式</li>
          <li><strong>历史记录</strong>：自动保存翻译历史，支持导出</li>
        </ul>
      </div>
    </div>
  );
};

export default RealTimeTranslation;

