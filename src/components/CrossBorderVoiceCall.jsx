import React, { useState, useEffect, useRef } from 'react';

const CrossBorderVoiceCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [myLanguage, setMyLanguage] = useState('zh');
  const [partnerLanguage, setPartnerLanguage] = useState('en');
  const [roomId, setRoomId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const callStartTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);

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

  // 生成随机房间ID
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // 开始通话
  const startCall = async () => {
    try {
      setError(null);
      setIsConnecting(true);
      setConnectionStatus('connecting');
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('无法获取认证token');
      }

      const finalRoomId = roomId || generateRoomId();
      setRoomId(finalRoomId);

      const response = await fetch('http://localhost:5001/api/voice-call/start-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          room_id: finalRoomId,
          my_language: myLanguage,
          partner_language: partnerLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setConnectionStatus('connected');
      setIsCallActive(true);
      setIsConnecting(false);
      
      // 开始录音
      await startRecording();
      
      // 开始计时
      callStartTimeRef.current = Date.now();
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
      }, 1000);
      
    } catch (error) {
      console.error('开始通话失败:', error);
      setError(error.message);
      setConnectionStatus('disconnected');
      setIsConnecting(false);
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

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && sessionId) {
          await sendAudioToPartner(event.data);
        }
      };

      mediaRecorderRef.current.start(1500); // 每1.5秒发送一次音频
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
      setIsTransmitting(level > 20); // 当音频级别超过20%时显示传输状态
      
      if (isCallActive) {
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      }
    };

    updateLevel();
  };

  // 发送音频给对方
  const sendAudioToPartner = async (audioBlob) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const formData = new FormData();
      formData.append('audio', audioBlob, `voice_${Date.now()}.webm`);
      formData.append('session_id', sessionId);
      formData.append('room_id', roomId);

      const response = await fetch('http://localhost:5001/api/voice-call/send-audio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.translated_audio_url) {
          // 播放翻译后的音频
          playTranslatedAudio(result.translated_audio_url);
        }
        
        if (result.translation_text) {
          // 添加到通话历史
          setCallHistory(prev => [...prev, {
            id: Date.now(),
            type: 'sent',
            original: result.original_text || '',
            translated: result.translation_text,
            timestamp: new Date().toLocaleTimeString()
          }]);
        }
      }
    } catch (error) {
      console.error('发送音频失败:', error);
    }
  };

  // 播放翻译后的音频
  const playTranslatedAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('播放音频失败:', error);
    });
  };

  // 结束通话
  const endCall = async () => {
    try {
      if (mediaRecorderRef.current && isCallActive) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (sessionId) {
        const token = await getAuthToken();
        if (token) {
          await fetch('http://localhost:5001/api/voice-call/end-call', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
              session_id: sessionId,
              room_id: roomId 
            })
          });
        }
      }

      setIsCallActive(false);
      setSessionId(null);
      setConnectionStatus('disconnected');
      setAudioLevel(0);
      setIsTransmitting(false);
      setCallDuration(0);
    } catch (error) {
      console.error('结束通话失败:', error);
    }
  };

  // 清除通话历史
  const clearHistory = () => {
    setCallHistory([]);
  };

  // 交换语言
  const swapLanguages = () => {
    const temp = myLanguage;
    setMyLanguage(partnerLanguage);
    setPartnerLanguage(temp);
  };

  // 格式化通话时长
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (isCallActive) {
        endCall();
      }
    };
  }, []);

  const getStatusText = () => {
    if (isConnecting) return '连接中';
    if (isCallActive) return `通话中 ${formatDuration(callDuration)}`;
    return '未连接';
  };

  const getStatusClass = () => {
    if (isConnecting) return 'connecting';
    if (isCallActive) return 'connected';
    return 'disconnected';
  };

  return (
    <div className="voice-call-translator">
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
            <label className="language-label">我的语言</label>
            <select 
              className="language-select"
              value={myLanguage}
              onChange={(e) => setMyLanguage(e.target.value)}
              disabled={isCallActive}
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
            disabled={isCallActive}
            style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}
          >
            ⇄
          </button>
          
          <div className="language-group">
            <label className="language-label">对方语言</label>
            <select 
              className="language-select"
              value={partnerLanguage}
              onChange={(e) => setPartnerLanguage(e.target.value)}
              disabled={isCallActive}
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

      {/* 房间设置 */}
      <div className="room-settings" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label className="language-label">房间ID（可选）</label>
        <input
          type="text"
          className="language-select"
          placeholder="留空自动生成"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          disabled={isCallActive}
          style={{
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: 'var(--font-size-lg)',
            fontWeight: '600',
            letterSpacing: '2px'
          }}
        />
        {roomId && (
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            marginTop: 'var(--spacing-xs)'
          }}>
            分享此房间ID给对方加入通话
          </div>
        )}
      </div>

      {/* 音频级别和传输状态 */}
      {isCallActive && (
        <div className="call-status" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="audio-level-container">
            <div className="audio-level-label" style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xs)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>语音级别</span>
              {isTransmitting && (
                <span className="pulse" style={{ color: 'var(--color-text-accent)' }}>
                  正在传输
                </span>
              )}
            </div>
            <div className="audio-level-bar" style={{
              width: '100%',
              height: '12px',
              background: 'var(--glass-bg)',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid var(--glass-border)'
            }}>
              <div 
                className="audio-level-fill"
                style={{ 
                  width: `${audioLevel}%`,
                  background: isTransmitting 
                    ? 'linear-gradient(90deg, #00d4ff, #8b5cf6)' 
                    : 'linear-gradient(90deg, #6b7280, #9ca3af)',
                  height: '100%',
                  borderRadius: '6px',
                  transition: 'all 0.1s ease',
                  boxShadow: isTransmitting ? '0 0 10px rgba(0, 212, 255, 0.5)' : 'none'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="control-buttons" style={{ marginBottom: 'var(--spacing-lg)' }}>
        {!isCallActive ? (
          <button 
            className="primary-button"
            onClick={startCall}
            disabled={isConnecting}
          >
            {isConnecting ? '连接中...' : '开始通话'}
          </button>
        ) : (
          <button 
            className="primary-button"
            onClick={endCall}
            style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 6px 24px rgba(239, 68, 68, 0.3)'
            }}
          >
            结束通话
          </button>
        )}
        
        {callHistory.length > 0 && (
          <button 
            className="secondary-button"
            onClick={clearHistory}
            style={{ marginTop: 'var(--spacing-sm)' }}
          >
            清除历史
          </button>
        )}
      </div>

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

      {/* 通话历史 */}
      {callHistory.length > 0 && (
        <div className="call-history">
          <h3 style={{ 
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--spacing-md)',
            color: 'var(--color-text-primary)',
            textAlign: 'center'
          }}>
            通话记录
          </h3>
          <div className="history-list" style={{
            maxHeight: '300px',
            overflowY: 'auto',
            padding: 'var(--spacing-sm)'
          }}>
            {callHistory.map((item) => (
              <div 
                key={item.id} 
                className="history-item fade-in"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'var(--glass-backdrop)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-sm)',
                  boxShadow: 'var(--shadow-sm)',
                  borderLeft: `4px solid ${item.type === 'sent' ? 'var(--color-cyan)' : 'var(--color-purple)'}`
                }}
              >
                <div className="history-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)'
                }}>
                  <span>{item.type === 'sent' ? '我说' : '对方说'}</span>
                  <span>{item.timestamp}</span>
                </div>
                {item.original && (
                  <div className="original-text" style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-xs)',
                    fontStyle: 'italic'
                  }}>
                    原文: {item.original}
                  </div>
                )}
                <div className="translated-text" style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-primary)',
                  fontWeight: '500'
                }}>
                  翻译: {item.translated}
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
          <li>设置你的语言和对方的语言</li>
          <li>输入房间ID或留空自动生成</li>
          <li>点击"开始通话"建立连接</li>
          <li>分享房间ID给对方加入通话</li>
          <li>开始说话，系统会实时翻译并传输</li>
          <li>对方的语音会被翻译成你的语言播放</li>
          <li>通话记录会显示在下方</li>
        </ol>
      </div>
    </div>
  );
};

export default CrossBorderVoiceCall;

