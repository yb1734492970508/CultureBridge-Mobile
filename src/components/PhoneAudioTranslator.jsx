import React, { useState, useEffect, useRef } from 'react';

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

      const response = await fetch('http://localhost:5001/api/translation/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          source_language: sourceLanguage,
          target_language: targetLanguage,
          session_type: 'phone_audio'
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
      console.error('开始会话失败:', error);
      setError(error.message);
      setConnectionStatus('disconnected');
    }
  };

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });

      // 设置音频分析
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

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
          
          // 每收集到音频数据就发送翻译
          if (sessionId) {
            await sendAudioForTranslation(event.data, chunkIndexRef.current);
            chunkIndexRef.current++;
          }
        }
      };

      mediaRecorderRef.current.start(1000); // 每秒收集一次数据
      setIsRecording(true);
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
      setAudioLevel(Math.min(100, (average / 255) * 100));
      
      if (isRecording) {
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
      formData.append('audio', audioBlob, `chunk_${chunkIndex}.webm`);
      formData.append('session_id', sessionId);
      formData.append('chunk_index', chunkIndex.toString());

      const response = await fetch('http://localhost:5001/api/translation/translate-audio', {
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
            confidence: result.confidence || 0
          }]);
        }
      }
    } catch (error) {
      console.error('翻译失败:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // 停止录音和会话
  const stopSession = async () => {
    try {
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

      setIsRecording(false);
      setSessionId(null);
      setConnectionStatus('disconnected');
      setAudioLevel(0);
    } catch (error) {
      console.error('停止会话失败:', error);
    }
  };

  // 清除翻译历史
  const clearTranslations = () => {
    setTranslations([]);
  };

  // 交换语言
  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopSession();
      }
    };
  }, []);

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '已连接';
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
    <div className="phone-audio-translator">
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
              disabled={isRecording}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="secondary-button"
            onClick={swapLanguages}
            disabled={isRecording}
            style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}
          >
            ⇄
          </button>
          
          <div className="language-group">
            <label className="language-label">目标语言</label>
            <select 
              className="language-select"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
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

      {/* 音频级别指示器 */}
      {isRecording && (
        <div className="audio-level-container" style={{ marginBottom: '1.5rem' }}>
          <div className="audio-level-label">音频级别</div>
          <div className="audio-level-bar">
            <div 
              className="audio-level-fill"
              style={{ 
                width: `${audioLevel}%`,
                background: `linear-gradient(90deg, #00d4ff ${audioLevel}%, transparent ${audioLevel}%)`,
                height: '8px',
                borderRadius: '4px',
                transition: 'width 0.1s ease'
              }}
            ></div>
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="control-buttons" style={{ marginBottom: '1.5rem' }}>
        {!isRecording ? (
          <button 
            className="primary-button"
            onClick={startSession}
            disabled={connectionStatus === 'connecting'}
          >
            {connectionStatus === 'connecting' ? '连接中...' : '开始翻译'}
          </button>
        ) : (
          <button 
            className="primary-button"
            onClick={stopSession}
            style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 6px 24px rgba(239, 68, 68, 0.3)'
            }}
          >
            停止翻译
          </button>
        )}
        
        {translations.length > 0 && (
          <button 
            className="secondary-button"
            onClick={clearTranslations}
            style={{ marginTop: '0.75rem' }}
          >
            清除历史
          </button>
        )}
      </div>

      {/* 翻译状态 */}
      {isTranslating && (
        <div className="translation-status" style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem',
          color: 'var(--color-text-accent)',
          fontSize: 'var(--font-size-sm)'
        }}>
          <div className="pulse">正在翻译...</div>
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
            翻译结果
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
                  {translation.confidence > 0 && (
                    <span>置信度: {Math.round(translation.confidence * 100)}%</span>
                  )}
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
          <li>选择源语言和目标语言</li>
          <li>点击"开始翻译"按钮</li>
          <li>允许浏览器访问麦克风权限</li>
          <li>开始说话，系统将实时翻译</li>
          <li>翻译结果会实时显示在下方</li>
          <li>点击"停止翻译"结束会话</li>
        </ol>
      </div>
    </div>
  );
};

export default PhoneAudioTranslator;

