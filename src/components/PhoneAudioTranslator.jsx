import React, { useState, useEffect, useRef } from 'react';
import '../styles/premium.css';

const PhoneAudioTranslator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [translations, setTranslations] = useState([]);
  const [sourceLanguage, setSourceLanguage] = useState('zh');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chunksRef = useRef([]);
  const chunkIndexRef = useRef(0);

  const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
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

  // 开始翻译会话
  const startSession = async () => {
    try {
      setError(null);
      setConnectionStatus('connecting');
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('无法获取认证token');
      }

      const response = await fetch('http://localhost:5001/api/realtime/phone-audio/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          source_language: sourceLanguage,
          target_language: targetLanguage
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.session_id);
        setConnectionStatus('connected');
        return data.session_id;
      } else {
        throw new Error(data.message || '启动会话失败');
      }
    } catch (error) {
      console.error('启动会话失败:', error);
      setError(error.message);
      setConnectionStatus('error');
      return null;
    }
  };

  // 停止翻译会话
  const stopSession = async () => {
    if (sessionId) {
      try {
        const token = await getAuthToken();
        await fetch(`http://localhost:5001/api/realtime/session/${sessionId}/stop`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('停止会话失败:', error);
      }
      
      setSessionId(null);
      setConnectionStatus('disconnected');
    }
  };

  // 音频级别监控
  const monitorAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(Math.min(100, (average / 255) * 100));
      
      animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
    }
  };

  // 开始录音
  const startRecording = async () => {
    try {
      setError(null);
      
      // 启动会话
      const newSessionId = await startSession();
      if (!newSessionId) return;

      // 获取音频流
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });

      // 设置音频上下文用于监控音频级别
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // 开始监控音频级别
      monitorAudioLevel();

      // 设置媒体录制器
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];
      chunkIndexRef.current = 0;

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          
          // 每收集到音频块就发送处理
          const audioBlob = new Blob([event.data], { type: 'audio/webm' });
          await processAudioChunk(audioBlob, newSessionId);
        }
      };

      mediaRecorderRef.current.start(2000); // 每2秒收集一次音频
      setIsRecording(true);

    } catch (error) {
      console.error('开始录音失败:', error);
      setError('无法访问麦克风，请检查权限设置');
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setIsRecording(false);
    setAudioLevel(0);
    stopSession();
  };

  // 处理音频块
  const processAudioChunk = async (audioBlob, currentSessionId) => {
    try {
      setIsTranslating(true);
      
      const token = await getAuthToken();
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        const response = await fetch(`http://localhost:5001/api/realtime/session/${currentSessionId}/audio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            audio_data: base64Audio,
            chunk_index: chunkIndexRef.current++
          })
        });

        const data = await response.json();
        
        if (data.success && data.translation && data.translation.success) {
          const newTranslation = {
            id: Date.now(),
            original: data.translation.original_text,
            translated: data.translation.translated_text,
            sourceLanguage: data.translation.source_language,
            targetLanguage: data.translation.target_language,
            confidence: data.translation.confidence || 0.8,
            timestamp: new Date().toLocaleTimeString()
          };
          
          setTranslations(prev => [newTranslation, ...prev].slice(0, 10));
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('处理音频失败:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // 清除翻译历史
  const clearTranslations = () => {
    setTranslations([]);
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  return (
    <div className="premium-container">
      <div className="glass-card fade-in" style={{ margin: '1rem', padding: '2rem' }}>
        {/* 标题区域 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            📱 手机音频翻译
          </h1>
          <p style={{ color: 'var(--dark-text-secondary)', fontSize: '1rem' }}>
            实时捕获并翻译手机播放的音频内容
          </p>
        </div>

        {/* 连接状态 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className={`status-indicator ${connectionStatus === 'connected' ? 'online' : connectionStatus === 'error' ? 'busy' : 'offline'}`}></div>
          <span style={{ fontSize: '0.9rem', color: 'var(--dark-text-secondary)' }}>
            {connectionStatus === 'connected' ? '已连接' : 
             connectionStatus === 'connecting' ? '连接中...' :
             connectionStatus === 'error' ? '连接错误' : '未连接'}
          </span>
        </div>

        {/* 语言选择 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dark-text-secondary)' }}>
              源语言
            </label>
            <select 
              value={sourceLanguage} 
              onChange={(e) => setSourceLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--dark-text)',
                fontSize: '1rem'
              }}
              disabled={isRecording}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} style={{ background: 'var(--dark-surface)' }}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dark-text-secondary)' }}>
              目标语言
            </label>
            <select 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--dark-text)',
                fontSize: '1rem'
              }}
              disabled={isRecording}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} style={{ background: 'var(--dark-surface)' }}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 音频级别显示 */}
        {isRecording && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--dark-text-secondary)', fontSize: '0.9rem' }}>音频级别</span>
              <span style={{ color: 'var(--dark-text)', fontSize: '0.9rem' }}>{Math.round(audioLevel)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${audioLevel}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 音频可视化 */}
        {isRecording && (
          <div className="audio-visualizer">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="audio-bar"></div>
            ))}
          </div>
        )}

        {/* 控制按钮 */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {!isRecording ? (
            <button 
              className="premium-button ripple"
              onClick={startRecording}
              style={{ 
                color: 'white',
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🎤 开始录音
            </button>
          ) : (
            <button 
              className="premium-button secondary ripple"
              onClick={stopRecording}
              style={{ 
                color: 'white',
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ⏹️ 停止录音
            </button>
          )}
          
          {translations.length > 0 && (
            <button 
              className="premium-button accent ripple"
              onClick={clearTranslations}
              style={{ 
                color: 'white',
                fontSize: '1rem',
                padding: '1rem 1.5rem'
              }}
            >
              🗑️ 清除
            </button>
          )}
        </div>

        {/* 翻译状态 */}
        {isTranslating && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="loading-spinner"></div>
            <p style={{ color: 'var(--dark-text-secondary)', marginTop: '0.5rem' }}>
              正在翻译...
            </p>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#fca5a5'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* 翻译结果 */}
        {translations.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--dark-text)' }}>
              翻译结果
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {translations.map((translation, index) => (
                <div 
                  key={translation.id}
                  className="glass-card slide-in"
                  style={{ 
                    margin: '0.5rem 0',
                    padding: '1rem',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dark-text-secondary)' }}>
                      {translation.timestamp}
                    </span>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: translation.confidence > 0.7 ? '#10b981' : '#f59e0b',
                      background: translation.confidence > 0.7 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px'
                    }}>
                      {Math.round(translation.confidence * 100)}%
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-secondary)', marginBottom: '0.25rem' }}>
                      原文 ({translation.sourceLanguage}):
                    </div>
                    <div style={{ color: 'var(--dark-text)', lineHeight: '1.4' }}>
                      {translation.original}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-secondary)', marginBottom: '0.25rem' }}>
                      译文 ({translation.targetLanguage}):
                    </div>
                    <div style={{ color: '#4facfe', lineHeight: '1.4', fontWeight: '500' }}>
                      {translation.translated}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        {!isRecording && translations.length === 0 && (
          <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--dark-text)' }}>
              💡 使用说明
            </h4>
            <ul style={{ color: 'var(--dark-text-secondary)', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
              <li>选择源语言和目标语言</li>
              <li>点击"开始录音"按钮开始捕获音频</li>
              <li>播放手机中的音频内容</li>
              <li>系统将自动识别并翻译音频中的语音</li>
              <li>翻译结果会实时显示在下方</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneAudioTranslator;

