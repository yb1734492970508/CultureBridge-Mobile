import React, { useState, useEffect, useRef } from 'react';
import '../styles/premium.css';

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
      
      // 启动会话
      const newSessionId = await startSession();
      if (!newSessionId) return;

      // 获取音频流
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: noiseReduction,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });

      // 设置音频上下文用于监控音频级别
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // 开始监控音频级别
      monitorAudioLevel();

      // 设置媒体录制器
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];
      chunkIndexRef.current = 0;

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && audioLevel > sensitivity / 2) {
          chunksRef.current.push(event.data);
          
          // 只有在检测到足够音频级别时才处理
          const audioBlob = new Blob([event.data], { type: 'audio/webm' });
          await processAudioChunk(audioBlob, newSessionId);
        }
      };

      mediaRecorderRef.current.start(1500); // 每1.5秒收集一次音频
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
    a.download = `外部音频翻译_${new Date().toISOString().split('T')[0]}.json`;
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
    <div className="premium-container">
      <div className="glass-card fade-in" style={{ margin: '1rem', padding: '2rem' }}>
        {/* 标题区域 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            🎤 外部音频翻译
          </h1>
          <p style={{ color: 'var(--dark-text-secondary)', fontSize: '1rem' }}>
            实时监听并翻译周围环境的音频内容
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

        {/* 设置面板 */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--dark-text)' }}>⚙️ 监听设置</h3>
          
          {/* 语言选择 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
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
                disabled={isListening}
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
                disabled={isListening}
              >
                {languages.filter(lang => lang.code !== 'auto').map(lang => (
                  <option key={lang.code} value={lang.code} style={{ background: 'var(--dark-surface)' }}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 灵敏度设置 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dark-text-secondary)' }}>
              音频灵敏度: {sensitivity}%
            </label>
            <input
              type="range"
              min="10"
              max="90"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseInt(e.target.value))}
              disabled={isListening}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.2)',
                outline: 'none'
              }}
            />
          </div>

          {/* 噪音降低 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="noiseReduction"
              checked={noiseReduction}
              onChange={(e) => setNoiseReduction(e.target.checked)}
              disabled={isListening}
              style={{ transform: 'scale(1.2)' }}
            />
            <label htmlFor="noiseReduction" style={{ color: 'var(--dark-text-secondary)' }}>
              启用噪音降低
            </label>
          </div>
        </div>

        {/* 音频级别显示 */}
        {isListening && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--dark-text-secondary)', fontSize: '0.9rem' }}>环境音频级别</span>
              <span style={{ 
                color: audioLevel > sensitivity ? '#10b981' : 'var(--dark-text)',
                fontSize: '0.9rem',
                fontWeight: audioLevel > sensitivity ? '600' : 'normal'
              }}>
                {Math.round(audioLevel)}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${audioLevel}%`,
                  background: audioLevel > sensitivity ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.3)'
                }}
              ></div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-secondary)', marginTop: '0.25rem' }}>
              {audioLevel > sensitivity ? '🎵 检测到音频' : '🔇 等待音频输入...'}
            </div>
          </div>
        )}

        {/* 音频可视化 */}
        {isListening && audioLevel > sensitivity && (
          <div className="audio-visualizer">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="audio-bar"></div>
            ))}
          </div>
        )}

        {/* 控制按钮 */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {!isListening ? (
            <button 
              className="premium-button ripple"
              onClick={startListening}
              style={{ 
                color: 'white',
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              👂 开始监听
            </button>
          ) : (
            <button 
              className="premium-button secondary ripple"
              onClick={stopListening}
              style={{ 
                color: 'white',
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ⏹️ 停止监听
            </button>
          )}
          
          {translations.length > 0 && (
            <>
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
              
              <button 
                className="premium-button gold ripple"
                onClick={exportTranslations}
                style={{ 
                  color: 'white',
                  fontSize: '1rem',
                  padding: '1rem 1.5rem'
                }}
              >
                📥 导出
              </button>
            </>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--dark-text)' }}>
                翻译结果 ({translations.length})
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--dark-text-secondary)' }}>
                最新在上
              </span>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {translations.map((translation, index) => (
                <div 
                  key={translation.id}
                  className="glass-card slide-in"
                  style={{ 
                    margin: '0.5rem 0',
                    padding: '1rem',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dark-text-secondary)' }}>
                      {translation.timestamp}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        color: 'var(--dark-text-secondary)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '8px'
                      }}>
                        🔊 {Math.round(translation.audioLevel)}%
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
        {!isListening && translations.length === 0 && (
          <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--dark-text)' }}>
              💡 使用说明
            </h4>
            <ul style={{ color: 'var(--dark-text-secondary)', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
              <li>配置源语言和目标语言（支持自动检测）</li>
              <li>调整音频灵敏度以适应环境噪音</li>
              <li>启用噪音降低以提高识别准确性</li>
              <li>点击"开始监听"开始捕获环境音频</li>
              <li>系统将自动识别并翻译检测到的语音</li>
              <li>可以导出翻译历史为JSON文件</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalAudioTranslator;

