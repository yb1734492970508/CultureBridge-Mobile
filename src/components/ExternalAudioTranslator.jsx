import React, { useState, useEffect, useRef } from 'react';
import '../styles/ultra-premium.css';

const ExternalAudioTranslator = () => {
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [translations, setTranslations] = useState([]);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('zh');
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [sensitivity, setSensitivity] = useState(50);
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chunksRef = useRef([]);
  const chunkIndexRef = useRef(0);
  const silenceTimeoutRef = useRef(null);

  const languages = [
    { code: 'auto', name: '自动检测', flag: '🌐' },
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

      const response = await fetch('http://localhost:5001/api/realtime/external-audio/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          source_language: sourceLanguage === 'auto' ? 'zh' : sourceLanguage,
          target_language: targetLanguage,
          session_config: {
            real_time_threshold: 1.5,
            noise_reduction: noiseReduction,
            sensitivity: sensitivity / 100
          }
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

  // 音频级别监控和静音检测
  const monitorAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const level = Math.min(100, (average / 255) * 100);
      setAudioLevel(level);
      
      // 静音检测
      if (level < sensitivity / 2) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            // 静音超过3秒，可以考虑暂停处理
          }, 3000);
        }
      } else {
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
    }
  };

  // 开始监听
  const startListening = async () => {
    try {
      setError(null);
      
      const newSessionId = await startSession();
      if (!newSessionId) return;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: noiseReduction,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.8;

      monitorAudioLevel();

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];
      chunkIndexRef.current = 0;

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && audioLevel > sensitivity / 2) {
          chunksRef.current.push(event.data);
          const audioBlob = new Blob([event.data], { type: 'audio/webm' });
          await processAudioChunk(audioBlob, newSessionId);
        }
      };

      mediaRecorderRef.current.start(1500);
      setIsListening(true);

    } catch (error) {
      console.error('开始监听失败:', error);
      setError('无法访问麦克风，请检查权限设置');
    }
  };

  // 停止监听
  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    setIsListening(false);
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
            timestamp: new Date().toLocaleTimeString(),
            audioLevel: audioLevel
          };
          
          setTranslations(prev => [newTranslation, ...prev].slice(0, 15));
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('处理音频失败:', error);
    } finally {
      setTimeout(() => setIsTranslating(false), 500);
    }
  };

  // 清除翻译历史
  const clearTranslations = () => {
    setTranslations([]);
  };

  // 导出翻译历史
  const exportTranslations = () => {
    const data = translations.map(t => ({
      时间: t.timestamp,
      原文: t.original,
      译文: t.translated,
      源语言: t.sourceLanguage,
      目标语言: t.targetLanguage,
      置信度: `${Math.round(t.confidence * 100)}%`
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `环境音频翻译_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, []);

  return (
    <div className="slide-up">
      {/* Hero Section */}
      <div className="card mb-8">
        <div className="card-content text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎤</div>
          <h2 className="heading-2 mb-2">环境音频翻译</h2>
          <p className="text-caption mb-4">
            实时监听并翻译周围环境的音频内容
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

      {/* Quick Settings */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="heading-3">语言设置</h3>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? '收起' : '高级设置'}
            </button>
          </div>
        </div>
        <div className="card-content">
          <div className="flex gap-4 mb-4">
            <div className="form-group flex-1">
              <label className="form-label">源语言</label>
              <select 
                value={sourceLanguage} 
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="form-select"
                disabled={isListening}
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
                disabled={isListening}
              >
                {languages.filter(lang => lang.code !== 'auto').map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Settings */}
          {showSettings && (
            <div className="scale-in" style={{ 
              borderTop: '1px solid var(--border-light)',
              paddingTop: 'var(--space-4)',
              marginTop: 'var(--space-4)'
            }}>
              <div className="form-group">
                <label className="form-label">
                  音频灵敏度: {sensitivity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseInt(e.target.value))}
                  disabled={isListening}
                  className="w-full"
                  style={{
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    outline: 'none',
                    appearance: 'none'
                  }}
                />
                <div className="flex justify-between text-small mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  <span>低</span>
                  <span>高</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="noiseReduction"
                  checked={noiseReduction}
                  onChange={(e) => setNoiseReduction(e.target.checked)}
                  disabled={isListening}
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    accentColor: 'var(--primary-500)'
                  }}
                />
                <label htmlFor="noiseReduction" className="text-body">
                  启用噪音降低
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audio Level Display */}
      {isListening && (
        <div className="card mb-6">
          <div className="card-content">
            <div className="flex justify-between items-center mb-3">
              <span className="text-caption">环境音频级别</span>
              <div className="flex items-center gap-2">
                <span className="text-small">{Math.round(audioLevel)}%</span>
                <span className="text-small" style={{ 
                  color: audioLevel > sensitivity ? 'var(--accent-green)' : 'var(--text-tertiary)'
                }}>
                  {audioLevel > sensitivity ? '🎵' : '🔇'}
                </span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${audioLevel}%`,
                  background: audioLevel > sensitivity ? 
                    'linear-gradient(90deg, var(--accent-green), var(--primary-500))' : 
                    'var(--neutral-300)'
                }}
              ></div>
            </div>
            <div className="text-small mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {audioLevel > sensitivity ? '检测到音频信号' : '等待音频输入...'}
            </div>
            
            {/* Audio Visualizer */}
            {audioLevel > sensitivity && (
              <div className="audio-visualizer mt-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="audio-bar"></div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center mb-6">
        {!isListening ? (
          <button 
            className="btn btn-primary btn-lg"
            onClick={startListening}
            style={{ minWidth: '160px' }}
          >
            <span style={{ fontSize: '1.2rem' }}>👂</span>
            开始监听
          </button>
        ) : (
          <button 
            className="btn btn-secondary btn-lg"
            onClick={stopListening}
            style={{ minWidth: '160px' }}
          >
            <span style={{ fontSize: '1.2rem' }}>⏹️</span>
            停止监听
          </button>
        )}
        
        {translations.length > 0 && (
          <>
            <button 
              className="btn btn-ghost"
              onClick={clearTranslations}
            >
              清除记录
            </button>
            
            <button 
              className="btn btn-ghost"
              onClick={exportTranslations}
            >
              导出数据
            </button>
          </>
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
                    animationDelay: `${index * 0.05}s`,
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <div className="card-content">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-small">{translation.timestamp}</span>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-small rounded-full"
                          style={{ 
                            padding: '0.2rem 0.4rem',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-tertiary)',
                            fontSize: '0.7rem'
                          }}
                        >
                          🔊 {Math.round(translation.audioLevel)}%
                        </span>
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
      {!isListening && translations.length === 0 && (
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
                <span className="text-body">配置源语言和目标语言（支持自动检测）</span>
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
                <span className="text-body">调整音频灵敏度以适应环境噪音</span>
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
                <span className="text-body">点击"开始监听"开始捕获环境音频</span>
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
                <span className="text-body">系统将自动识别并翻译检测到的语音</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalAudioTranslator;

