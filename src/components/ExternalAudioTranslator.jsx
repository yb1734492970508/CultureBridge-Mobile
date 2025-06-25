import React, { useState, useEffect, useRef } from 'react';

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
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chunksRef = useRef([]);
  const chunkIndexRef = useRef(0);

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

  // 开始监听会话
  const startListening = async () => {
    try {
      setError(null);
      setConnectionStatus('connecting');
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('无法获取认证token');
      }

      const response = await fetch('http://localhost:5001/api/translation/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          source_language: sourceLanguage,
          target_language: targetLanguage,
          session_type: 'external_audio',
          sensitivity: sensitivity
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setConnectionStatus('connected');
      
      // 开始录音
      await startRecording();
    } catch (error) {
      console.error('开始监听失败:', error);
      setError(error.message);
      setConnectionStatus('disconnected');
    }
  };

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false, // 环境音频不需要回声消除
          noiseSuppression: false, // 保留环境声音
          autoGainControl: true,
          sampleRate: 44100
        } 
      });

      // 设置音频分析
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 512;

      // 开始音频级别监控
      monitorAudioLevel();

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];
      chunkIndexRef.current = 0;

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          
          // 只有当音频级别超过敏感度阈值时才发送翻译
          if (sessionId && audioLevel > sensitivity) {
            await sendAudioForTranslation(event.data, chunkIndexRef.current);
            chunkIndexRef.current++;
          }
        }
      };

      mediaRecorderRef.current.start(2000); // 每2秒收集一次数据
      setIsListening(true);
    } catch (error) {
      console.error('开始录音失败:', error);
      setError('无法访问麦克风，请检查权限设置');
    }
  };

  // 监控音频级别
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateLevel = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const level = Math.min(100, (average / 255) * 100);
      setAudioLevel(level);
      
      if (isListening) {
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      }
    };

    updateLevel();
  };

  // 发送音频进行翻译
  const sendAudioForTranslation = async (audioBlob, chunkIndex) => {
    try {
      setIsTranslating(true);
      
      const token = await getAuthToken();
      if (!token) return;

      const formData = new FormData();
      formData.append('audio', audioBlob, `external_chunk_${chunkIndex}.webm`);
      formData.append('session_id', sessionId);
      formData.append('chunk_index', chunkIndex.toString());
      formData.append('audio_level', audioLevel.toString());

      const response = await fetch('http://localhost:5001/api/translation/translate-external-audio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.translation && result.translation.trim()) {
          setTranslations(prev => [...prev, {
            id: Date.now() + chunkIndex,
            original: result.original_text || '',
            translated: result.translation,
            timestamp: new Date().toLocaleTimeString(),
            confidence: result.confidence || 0,
            detectedLanguage: result.detected_language || '',
            audioLevel: audioLevel
          }]);
        }
      }
    } catch (error) {
      console.error('翻译失败:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // 停止监听
  const stopListening = async () => {
    try {
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

      if (sessionId) {
        const token = await getAuthToken();
        if (token) {
          await fetch('http://localhost:5001/api/translation/end-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ session_id: sessionId })
          });
        }
      }

      setIsListening(false);
      setSessionId(null);
      setConnectionStatus('disconnected');
      setAudioLevel(0);
    } catch (error) {
      console.error('停止监听失败:', error);
    }
  };

  // 清除翻译历史
  const clearTranslations = () => {
    setTranslations([]);
  };

  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, []);

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '正在监听';
      case 'connecting': return '连接中';
      default: return '未连接';
    }
  };

  const getStatusClass = () => {
    switch (connectionStatus) {
      case 'connected': return 'connected';
      case 'connecting': return 'connecting';
      default: return 'disconnected';
    }
  };

  return (
    <div className="external-audio-translator">
      {/* 状态指示器 */}
      <div className={`status-indicator ${getStatusClass()}`}>
        <div className="status-dot"></div>
        <span>{getStatusText()}</span>
      </div>

      {/* 语言设置 */}
      <div className="language-settings">
        <h3>语言设置</h3>
        <div className="language-row">
          <div className="language-group">
            <label className="language-label">源语言</label>
            <select 
              className="language-select"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              disabled={isListening}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="language-group">
            <label className="language-label">目标语言</label>
            <select 
              className="language-select"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
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
      </div>

      {/* 敏感度设置 */}
      <div className="sensitivity-settings" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label className="language-label">音频敏感度: {sensitivity}%</label>
        <input
          type="range"
          min="10"
          max="90"
          value={sensitivity}
          onChange={(e) => setSensitivity(parseInt(e.target.value))}
          disabled={isListening}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: 'var(--glass-bg)',
            outline: 'none',
            marginTop: 'var(--spacing-xs)'
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          marginTop: 'var(--spacing-xs)'
        }}>
          <span>低敏感度</span>
          <span>高敏感度</span>
        </div>
      </div>

      {/* 音频级别指示器 */}
      {isListening && (
        <div className="audio-level-container" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="audio-level-label" style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            环境音频级别 {audioLevel > sensitivity ? '(正在处理)' : '(等待中)'}
          </div>
          <div className="audio-level-bar" style={{
            width: '100%',
            height: '12px',
            background: 'var(--glass-bg)',
            borderRadius: '6px',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid var(--glass-border)'
          }}>
            <div 
              className="audio-level-fill"
              style={{ 
                width: `${audioLevel}%`,
                background: audioLevel > sensitivity 
                  ? 'linear-gradient(90deg, #00d4ff, #8b5cf6)' 
                  : 'linear-gradient(90deg, #6b7280, #9ca3af)',
                height: '100%',
                borderRadius: '6px',
                transition: 'all 0.1s ease',
                boxShadow: audioLevel > sensitivity ? '0 0 10px rgba(0, 212, 255, 0.5)' : 'none'
              }}
            ></div>
            {/* 敏感度阈值线 */}
            <div style={{
              position: 'absolute',
              left: `${sensitivity}%`,
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'var(--color-accent-start)',
              boxShadow: '0 0 5px rgba(255, 215, 0, 0.8)'
            }}></div>
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="control-buttons" style={{ marginBottom: 'var(--spacing-lg)' }}>
        {!isListening ? (
          <button 
            className="primary-button"
            onClick={startListening}
            disabled={connectionStatus === 'connecting'}
          >
            {connectionStatus === 'connecting' ? '连接中...' : '开始监听'}
          </button>
        ) : (
          <button 
            className="primary-button"
            onClick={stopListening}
            style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 6px 24px rgba(239, 68, 68, 0.3)'
            }}
          >
            停止监听
          </button>
        )}
        
        {translations.length > 0 && (
          <button 
            className="secondary-button"
            onClick={clearTranslations}
            style={{ marginTop: 'var(--spacing-sm)' }}
          >
            清除历史
          </button>
        )}
      </div>

      {/* 翻译状态 */}
      {isTranslating && (
        <div className="translation-status" style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-text-accent)',
          fontSize: 'var(--font-size-sm)'
        }}>
          <div className="pulse">正在翻译环境音频...</div>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="error-message" style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
          color: '#fca5a5',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-lg)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          fontSize: 'var(--font-size-sm)'
        }}>
          {error}
        </div>
      )}

      {/* 翻译结果 */}
      {translations.length > 0 && (
        <div className="translations-container">
          <h3 style={{ 
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--spacing-md)',
            color: 'var(--color-text-primary)',
            textAlign: 'center'
          }}>
            环境音频翻译
          </h3>
          <div className="translations-list" style={{
            maxHeight: '300px',
            overflowY: 'auto',
            padding: 'var(--spacing-sm)'
          }}>
            {translations.map((translation) => (
              <div 
                key={translation.id} 
                className="translation-item fade-in"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'var(--glass-backdrop)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-sm)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div className="translation-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)'
                }}>
                  <span>{translation.timestamp}</span>
                  <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    {translation.detectedLanguage && (
                      <span>检测: {translation.detectedLanguage}</span>
                    )}
                    {translation.confidence > 0 && (
                      <span>置信度: {Math.round(translation.confidence * 100)}%</span>
                    )}
                    <span>音量: {Math.round(translation.audioLevel)}%</span>
                  </div>
                </div>
                {translation.original && (
                  <div className="original-text" style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-xs)',
                    fontStyle: 'italic'
                  }}>
                    原文: {translation.original}
                  </div>
                )}
                <div className="translated-text" style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-primary)',
                  fontWeight: '500'
                }}>
                  {translation.translated}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="usage-instructions">
        <h3>使用说明</h3>
        <ol>
          <li>选择源语言（推荐自动检测）和目标语言</li>
          <li>调整音频敏感度以过滤背景噪音</li>
          <li>点击"开始监听"按钮</li>
          <li>允许浏览器访问麦克风权限</li>
          <li>系统将监听环境音频并自动翻译</li>
          <li>只有超过敏感度阈值的音频才会被处理</li>
          <li>翻译结果会实时显示在下方</li>
        </ol>
      </div>
    </div>
  );
};

export default ExternalAudioTranslator;

