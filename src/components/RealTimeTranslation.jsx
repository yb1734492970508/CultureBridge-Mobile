import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Volume2, VolumeX, Settings, Languages } from 'lucide-react';

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

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

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

  // 初始化音频上下文和分析器
  const initializeAudioAnalyser = (stream) => {
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
  };

  // 开始录音
  const startRecording = async () => {
    try {
      let stream;
      
      if (captureMode === 'system') {
        // 尝试捕获系统音频（需要用户授权）
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false
            },
            video: false
          });
        } catch (error) {
          console.warn('系统音频捕获失败，切换到麦克风模式:', error);
          setCaptureMode('microphone');
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
        }
      } else {
        // 麦克风录音
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      }

      streamRef.current = stream;
      initializeAudioAnalyser(stream);

      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudioForTranslation(audioBlob);
      };

      mediaRecorderRef.current.start(1000); // 每秒收集一次数据
      setIsRecording(true);
    } catch (error) {
      console.error('录音启动失败:', error);
      alert('无法访问音频设备，请检查权限设置');
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  // 处理音频进行翻译
  const processAudioForTranslation = async (audioBlob) => {
    setIsTranslating(true);
    
    try {
      // 这里应该调用语音识别API
      // 模拟语音识别结果
      const mockRecognizedText = await simulateVoiceRecognition(audioBlob);
      setOriginalText(mockRecognizedText);
      
      // 调用翻译API
      const translatedText = await translateText(mockRecognizedText, sourceLanguage, targetLanguage);
      setTranslationText(translatedText);
      
      // 如果需要，可以播放翻译后的语音
      if (!isMuted) {
        await speakText(translatedText, targetLanguage);
      }
    } catch (error) {
      console.error('翻译处理失败:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // 模拟语音识别（实际应用中应该调用真实的API）
  const simulateVoiceRecognition = async (audioBlob) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 返回模拟的识别结果
    const mockTexts = [
      "Hello, how are you today?",
      "What time is it now?",
      "I would like to order some food",
      "Can you help me find the nearest station?",
      "Thank you very much for your help"
    ];
    
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  };

  // 翻译文本
  const translateText = async (text, fromLang, toLang) => {
    // 这里应该调用真实的翻译API
    // 模拟翻译结果
    const translations = {
      "Hello, how are you today?": "你好，你今天怎么样？",
      "What time is it now?": "现在几点了？",
      "I would like to order some food": "我想点一些食物",
      "Can you help me find the nearest station?": "你能帮我找到最近的车站吗？",
      "Thank you very much for your help": "非常感谢你的帮助"
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return translations[text] || "翻译结果";
  };

  // 语音播放
  const speakText = async (text, language) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'zh-CN' ? 'zh-CN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
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
  };

  return (
    <div className="real-time-translation">
      {/* 头部 */}
      <div className="translation-header">
        <h2 className="translation-title">实时翻译</h2>
        <div className="header-controls">
          <button 
            className={`mode-btn ${captureMode === 'microphone' ? 'active' : ''}`}
            onClick={() => setCaptureMode('microphone')}
          >
            <Mic size={16} />
            麦克风
          </button>
          <button 
            className={`mode-btn ${captureMode === 'system' ? 'active' : ''}`}
            onClick={() => setCaptureMode('system')}
          >
            <Volume2 size={16} />
            系统音频
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
          const temp = sourceLanguage;
          setSourceLanguage(targetLanguage);
          setTargetLanguage(temp);
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

      {/* 使用提示 */}
      <div className="usage-tips">
        <h3>使用提示</h3>
        <ul>
          <li>麦克风模式：捕获环境中的语音进行翻译</li>
          <li>系统音频模式：捕获手机播放的音频内容进行翻译</li>
          <li>支持多种语言的实时翻译和语音播放</li>
          <li>可以调整语言设置以获得最佳翻译效果</li>
        </ul>
      </div>
    </div>
  );
};

export default RealTimeTranslation;

