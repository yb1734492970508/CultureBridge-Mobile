import React, { useState, useEffect, useRef } from 'react';
import '../styles/premium.css';

const CrossBorderVoiceCall = () => {
  const [isInQueue, setIsInQueue] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [currentCall, setCurrentCall] = useState(null);
  const [userLanguage, setUserLanguage] = useState('zh');
  const [targetLanguages, setTargetLanguages] = useState(['en']);
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [translations, setTranslations] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    interests: [],
    ageRange: { min: 18, max: 65 },
    availabilityHours: {}
  });
  const [callHistory, setCallHistory] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const callTimerRef = useRef(null);
  const statusCheckIntervalRef = useRef(null);

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

  const interests = [
    '🎵 音乐', '🎬 电影', '📚 阅读', '🏃 运动', '🍳 烹饪',
    '✈️ 旅行', '🎨 艺术', '💻 科技', '🌱 园艺', '📸 摄影',
    '🎮 游戏', '🧘 瑜伽', '🎭 戏剧', '🔬 科学', '🏔️ 户外'
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

  // 加入匹配队列
  const joinQueue = async () => {
    try {
      setError(null);
      setConnectionStatus('connecting');
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('无法获取认证token');
      }

      const response = await fetch('http://localhost:5001/api/voice-call/matching/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_language: userLanguage,
          target_languages: targetLanguages,
          preferences: preferences
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsInQueue(true);
        setQueuePosition(data.queue_position || 1);
        setEstimatedWaitTime(data.estimated_wait_time || 30);
        setConnectionStatus('connected');
        setCallStatus('waiting');
        
        // 开始检查匹配状态
        startStatusCheck();
      } else {
        throw new Error(data.message || '加入队列失败');
      }
    } catch (error) {
      console.error('加入队列失败:', error);
      setError(error.message);
      setConnectionStatus('error');
    }
  };

  // 离开匹配队列
  const leaveQueue = async () => {
    try {
      const token = await getAuthToken();
      if (token) {
        await fetch('http://localhost:5001/api/voice-call/matching/leave', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('离开队列失败:', error);
    }
    
    setIsInQueue(false);
    setCallStatus('idle');
    setConnectionStatus('disconnected');
    stopStatusCheck();
  };

  // 开始状态检查
  const startStatusCheck = () => {
    statusCheckIntervalRef.current = setInterval(async () => {
      try {
        const token = await getAuthToken();
        if (!token) return;

        const response = await fetch('http://localhost:5001/api/voice-call/matching/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          if (data.user_in_call && data.current_call) {
            // 找到匹配，开始通话
            setCurrentCall(data.current_call);
            setIsInQueue(false);
            setIsInCall(true);
            setCallStatus('connected');
            startCall(data.current_call.call_session_id);
          } else if (data.user_in_queue) {
            setQueuePosition(data.queue_position || 1);
          }
        }
      } catch (error) {
        console.error('检查状态失败:', error);
      }
    }, 2000);
  };

  // 停止状态检查
  const stopStatusCheck = () => {
    if (statusCheckIntervalRef.current) {
      clearInterval(statusCheckIntervalRef.current);
      statusCheckIntervalRef.current = null;
    }
  };

  // 开始通话
  const startCall = async (callSessionId) => {
    try {
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

      let chunkIndex = 0;
      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          await processCallAudio(event.data, callSessionId, chunkIndex++);
        }
      };

      mediaRecorderRef.current.start(2000); // 每2秒收集一次音频
      
      // 开始计时
      startCallTimer();
      
    } catch (error) {
      console.error('开始通话失败:', error);
      setError('无法访问麦克风，请检查权限设置');
    }
  };

  // 结束通话
  const endCall = async () => {
    try {
      if (currentCall) {
        const token = await getAuthToken();
        if (token) {
          await fetch(`http://localhost:5001/api/voice-call/call/${currentCall.call_session_id}/end`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }
    } catch (error) {
      console.error('结束通话失败:', error);
    }
    
    // 清理资源
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    stopCallTimer();
    stopStatusCheck();
    
    setIsInCall(false);
    setCurrentCall(null);
    setCallStatus('idle');
    setConnectionStatus('disconnected');
    setAudioLevel(0);
    setTranslations([]);
    
    // 添加到通话历史
    if (currentCall) {
      const historyItem = {
        id: Date.now(),
        duration: callDuration,
        timestamp: new Date().toLocaleString(),
        participantLanguage: currentCall.callee_language || currentCall.caller_language,
        translationsCount: translations.length
      };
      setCallHistory(prev => [historyItem, ...prev].slice(0, 10));
    }
    
    setCallDuration(0);
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

  // 处理通话音频
  const processCallAudio = async (audioBlob, callSessionId, chunkIndex) => {
    try {
      const token = await getAuthToken();
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        const response = await fetch(`http://localhost:5001/api/voice-call/call/${callSessionId}/audio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            audio_data: base64Audio,
            chunk_index: chunkIndex
          })
        });

        const data = await response.json();
        
        if (data.success && data.translation && data.translation.success) {
          const newTranslation = {
            id: Date.now(),
            original: data.translation.original_text,
            translated: data.translation.translated_text,
            timestamp: new Date().toLocaleTimeString(),
            confidence: data.translation.confidence || 0.8
          };
          
          setTranslations(prev => [newTranslation, ...prev].slice(0, 8));
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('处理通话音频失败:', error);
    }
  };

  // 开始通话计时
  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // 停止通话计时
  const stopCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 更新偏好设置
  const updatePreferences = (newPreferences) => {
    setPreferences(newPreferences);
    // 这里可以调用API保存偏好设置
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (isInQueue) {
        leaveQueue();
      }
      if (isInCall) {
        endCall();
      }
    };
  }, []);

  return (
    <div className="premium-container">
      <div className="glass-card fade-in" style={{ margin: '1rem', padding: '2rem' }}>
        {/* 标题区域 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            🌍 跨国语音通话
          </h1>
          <p style={{ color: 'var(--dark-text-secondary)', fontSize: '1rem' }}>
            随机匹配全球用户，实时翻译语音通话
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

        {/* 空闲状态 - 语言选择和设置 */}
        {callStatus === 'idle' && (
          <div>
            {/* 语言设置 */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--dark-text)' }}>🗣️ 语言设置</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dark-text-secondary)' }}>
                  我的语言
                </label>
                <select 
                  value={userLanguage} 
                  onChange={(e) => setUserLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--dark-text)',
                    fontSize: '1rem'
                  }}
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
                  希望匹配的语言
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
                  {languages.filter(lang => lang.code !== userLanguage).map(lang => (
                    <label key={lang.code} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: targetLanguages.includes(lang.code) ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}>
                      <input
                        type="checkbox"
                        checked={targetLanguages.includes(lang.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTargetLanguages(prev => [...prev, lang.code]);
                          } else {
                            setTargetLanguages(prev => prev.filter(code => code !== lang.code));
                          }
                        }}
                        style={{ transform: 'scale(1.1)' }}
                      />
                      <span style={{ fontSize: '0.9rem', color: 'var(--dark-text)' }}>
                        {lang.flag} {lang.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 快捷操作按钮 */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button 
                className="premium-button ripple"
                onClick={joinQueue}
                disabled={targetLanguages.length === 0}
                style={{ 
                  color: 'white',
                  fontSize: '1.1rem',
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: targetLanguages.length === 0 ? 0.5 : 1
                }}
              >
                🎯 开始匹配
              </button>
              
              <button 
                className="premium-button accent ripple"
                onClick={() => setShowPreferences(!showPreferences)}
                style={{ 
                  color: 'white',
                  fontSize: '1rem',
                  padding: '1rem 1.5rem'
                }}
              >
                ⚙️ 偏好设置
              </button>
              
              <button 
                className="premium-button gold ripple"
                onClick={() => setShowHistory(!showHistory)}
                style={{ 
                  color: 'white',
                  fontSize: '1rem',
                  padding: '1rem 1.5rem'
                }}
              >
                📋 通话历史
              </button>
            </div>

            {/* 偏好设置面板 */}
            {showPreferences && (
              <div className="glass-card slide-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--dark-text)' }}>⚙️ 匹配偏好</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dark-text-secondary)' }}>
                    兴趣爱好
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
                    {interests.map(interest => (
                      <label key={interest} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: preferences.interests.includes(interest) ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}>
                        <input
                          type="checkbox"
                          checked={preferences.interests.includes(interest)}
                          onChange={(e) => {
                            const newInterests = e.target.checked 
                              ? [...preferences.interests, interest]
                              : preferences.interests.filter(i => i !== interest);
                            updatePreferences({ ...preferences, interests: newInterests });
                          }}
                          style={{ transform: 'scale(0.9)' }}
                        />
                        <span style={{ color: 'var(--dark-text)' }}>
                          {interest}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dark-text-secondary)' }}>
                    年龄范围: {preferences.ageRange.min} - {preferences.ageRange.max}
                  </label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="range"
                      min="18"
                      max="65"
                      value={preferences.ageRange.min}
                      onChange={(e) => updatePreferences({
                        ...preferences,
                        ageRange: { ...preferences.ageRange, min: parseInt(e.target.value) }
                      })}
                      style={{ flex: 1 }}
                    />
                    <span style={{ color: 'var(--dark-text-secondary)', fontSize: '0.9rem' }}>至</span>
                    <input
                      type="range"
                      min="18"
                      max="65"
                      value={preferences.ageRange.max}
                      onChange={(e) => updatePreferences({
                        ...preferences,
                        ageRange: { ...preferences.ageRange, max: parseInt(e.target.value) }
                      })}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 通话历史面板 */}
            {showHistory && (
              <div className="glass-card slide-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--dark-text)' }}>📋 通话历史</h3>
                
                {callHistory.length === 0 ? (
                  <p style={{ color: 'var(--dark-text-secondary)', textAlign: 'center', padding: '2rem' }}>
                    暂无通话记录
                  </p>
                ) : (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {callHistory.map(call => (
                      <div key={call.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        marginBottom: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <div>
                          <div style={{ color: 'var(--dark-text)', fontSize: '0.9rem' }}>
                            {call.timestamp}
                          </div>
                          <div style={{ color: 'var(--dark-text-secondary)', fontSize: '0.8rem' }}>
                            语言: {call.participantLanguage} | 翻译: {call.translationsCount}次
                          </div>
                        </div>
                        <div style={{ color: '#4facfe', fontSize: '0.9rem', fontWeight: '600' }}>
                          {formatTime(call.duration)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 等待匹配状态 */}
        {callStatus === 'waiting' && (
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '2rem auto' }}></div>
            <h3 style={{ color: 'var(--dark-text)', marginBottom: '1rem' }}>
              🔍 正在寻找匹配用户...
            </h3>
            <p style={{ color: 'var(--dark-text-secondary)', marginBottom: '1rem' }}>
              队列位置: #{queuePosition} | 预计等待: {estimatedWaitTime}秒
            </p>
            
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--dark-text)', marginBottom: '0.5rem' }}>匹配条件</h4>
              <p style={{ color: 'var(--dark-text-secondary)', fontSize: '0.9rem' }}>
                我的语言: {languages.find(l => l.code === userLanguage)?.flag} {languages.find(l => l.code === userLanguage)?.name}
              </p>
              <p style={{ color: 'var(--dark-text-secondary)', fontSize: '0.9rem' }}>
                目标语言: {targetLanguages.map(code => languages.find(l => l.code === code)?.flag).join(' ')}
              </p>
            </div>
            
            <button 
              className="premium-button secondary ripple"
              onClick={leaveQueue}
              style={{ 
                color: 'white',
                fontSize: '1rem',
                padding: '1rem 2rem'
              }}
            >
              ❌ 取消匹配
            </button>
          </div>
        )}

        {/* 通话中状态 */}
        {callStatus === 'connected' && isInCall && (
          <div>
            {/* 通话信息 */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
              <div className="pulse" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                🌍
              </div>
              <h3 style={{ color: 'var(--dark-text)', marginBottom: '0.5rem' }}>
                通话进行中
              </h3>
              <div style={{ fontSize: '2rem', color: '#4facfe', fontWeight: '700', marginBottom: '0.5rem' }}>
                {formatTime(callDuration)}
              </div>
              <p style={{ color: 'var(--dark-text-secondary)' }}>
                对方语言: {currentCall?.callee_language || currentCall?.caller_language}
              </p>
            </div>

            {/* 音频级别显示 */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--dark-text-secondary)', fontSize: '0.9rem' }}>语音级别</span>
                <span style={{ color: 'var(--dark-text)', fontSize: '0.9rem' }}>{Math.round(audioLevel)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${audioLevel}%` }}
                ></div>
              </div>
            </div>

            {/* 音频可视化 */}
            {audioLevel > 10 && (
              <div className="audio-visualizer">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="audio-bar"></div>
                ))}
              </div>
            )}

            {/* 实时翻译 */}
            {translations.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--dark-text)', marginBottom: '1rem' }}>
                  💬 实时翻译
                </h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {translations.map((translation, index) => (
                    <div 
                      key={translation.id}
                      className="glass-card slide-in"
                      style={{ 
                        margin: '0.5rem 0',
                        padding: '0.75rem',
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--dark-text-secondary)', marginBottom: '0.25rem' }}>
                        {translation.timestamp}
                      </div>
                      <div style={{ color: 'var(--dark-text)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                        {translation.original}
                      </div>
                      <div style={{ color: '#4facfe', fontSize: '0.9rem', fontWeight: '500' }}>
                        {translation.translated}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 通话控制 */}
            <div style={{ textAlign: 'center' }}>
              <button 
                className="premium-button secondary ripple"
                onClick={endCall}
                style={{ 
                  color: 'white',
                  fontSize: '1.1rem',
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
              >
                📞 结束通话
              </button>
            </div>
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

        {/* 使用说明 */}
        {callStatus === 'idle' && !showPreferences && !showHistory && (
          <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--dark-text)' }}>
              💡 使用说明
            </h4>
            <ul style={{ color: 'var(--dark-text-secondary)', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
              <li>选择您的语言和希望匹配的语言</li>
              <li>设置兴趣爱好和年龄偏好以获得更好的匹配</li>
              <li>点击"开始匹配"加入全球用户队列</li>
              <li>系统将自动为您匹配合适的用户</li>
              <li>通话过程中会实时翻译双方的语音</li>
              <li>可以随时结束通话并查看历史记录</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossBorderVoiceCall;

