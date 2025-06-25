import React, { useState, useEffect, useRef } from 'react';
import '../styles/ultra-premium.css';

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
      
      const newSessionId = await startSession();
      if (!newSessionId) return;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      monitorAudioLevel();

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];
      chunkIndexRef.current = 0;

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          const audioBlob = new Blob([event.data], { type: 'audio/webm' });
          await processAudioChunk(audioBlob, newSessionId);
        }
      };

      mediaRecorderRef.current.start(2000);
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
    <div className="slide-up">
      {/* Hero Section */}
      <div className="card mb-8">
        <div className="card-content text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
          <h2 className="heading-2 mb-2">手机音频翻译</h2>
          <p className="text-caption mb-4">
            实时捕获并翻译手机播放的音频内容
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`status-dot ${
              connectionStatus === 'connected' ? 'online' : 
              connectionStatus === 'error' ? 'error' : 'offline'
            }`}></div>
            <span className="text-small">
              {connectionStatus === 'connected' ? '已连接' : 
               connectionStatus === 'connecting' ? '连接中...' :
               connectionStatus === 'error' ? '连接错误' : '未连接'}
            </span>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="heading-3">语言设置</h3>
        </div>
        <div className="card-content">
          <div className="flex gap-4">
            <div className="form-group flex-1">
              <label className="form-label">源语言</label>
              <select 
                value={sourceLanguage} 
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="form-select"
                disabled={isRecording}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group flex-1">
              <label className="form-label">目标语言</label>
              <select 
                value={targetLanguage} 
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="form-select"
                disabled={isRecording}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Level Display */}
      {isRecording && (
        <div className="card mb-6">
          <div className="card-content">
            <div className="flex justify-between items-center mb-3">
              <span className="text-caption">音频级别</span>
              <span className="text-small">{Math.round(audioLevel)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${audioLevel}%` }}
              ></div>
            </div>
            
            {/* Audio Visualizer */}
            <div className="audio-visualizer mt-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="audio-bar"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center mb-6">
        {!isRecording ? (
          <button 
            className="btn btn-primary btn-lg"
            onClick={startRecording}
            style={{ minWidth: '160px' }}
          >
            <span style={{ fontSize: '1.2rem' }}>🎤</span>
            开始录音
          </button>
        ) : (
          <button 
            className="btn btn-secondary btn-lg"
            onClick={stopRecording}
            style={{ minWidth: '160px' }}
          >
            <span style={{ fontSize: '1.2rem' }}>⏹️</span>
            停止录音
          </button>
        )}
        
        {translations.length > 0 && (
          <button 
            className="btn btn-ghost"
            onClick={clearTranslations}
          >
            清除记录
          </button>
        )}
      </div>

      {/* Translation Status */}
      {isTranslating && (
        <div className="card mb-6">
          <div className="card-content text-center">
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p className="text-caption">正在翻译音频内容...</p>
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

      {/* Translation Results */}
      {translations.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h3 className="heading-3">翻译结果</h3>
              <span className="text-small">共 {translations.length} 条</span>
            </div>
          </div>
          <div className="card-content">
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {translations.map((translation, index) => (
                <div 
                  key={translation.id}
                  className="card mb-4 scale-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <div className="card-content">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-small">{translation.timestamp}</span>
                      <span 
                        className="text-small rounded-full"
                        style={{ 
                          padding: '0.25rem 0.5rem',
                          background: translation.confidence > 0.7 ? '#dcfce7' : '#fef3c7',
                          color: translation.confidence > 0.7 ? '#166534' : '#92400e'
                        }}
                      >
                        {Math.round(translation.confidence * 100)}%
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-small mb-1" style={{ color: 'var(--text-tertiary)' }}>
                        原文 ({translation.sourceLanguage}):
                      </div>
                      <div className="text-body">{translation.original}</div>
                    </div>
                    
                    <div>
                      <div className="text-small mb-1" style={{ color: 'var(--text-tertiary)' }}>
                        译文 ({translation.targetLanguage}):
                      </div>
                      <div className="text-body" style={{ 
                        color: 'var(--primary-600)',
                        fontWeight: 'var(--font-medium)'
                      }}>
                        {translation.translated}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      {!isRecording && translations.length === 0 && (
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
                <span className="text-body">选择源语言和目标语言</span>
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
                <span className="text-body">点击"开始录音"按钮开始捕获音频</span>
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
                <span className="text-body">播放手机中的音频内容</span>
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
                <span className="text-body">系统将自动识别并翻译音频中的语音</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneAudioTranslator;

