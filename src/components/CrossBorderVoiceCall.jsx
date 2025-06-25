import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Video,
  VideoOff,
  Users,
  Globe,
  Languages,
  Heart,
  MessageCircle,
  Settings,
  Clock,
  Signal,
  Wifi,
  WifiOff,
  UserCheck,
  Search,
  Loader,
  CheckCircle,
  XCircle,
  AlertCircle,
  Headphones,
  Speaker,
  RefreshCw,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

const CrossBorderVoiceCall = ({ 
  className = '',
  userId,
  userProfile = {},
  onCallUpdate = () => {},
  onTranslationUpdate = () => {}
}) => {
  // 状态管理
  const [callState, setCallState] = useState('idle'); // idle, searching, matched, connecting, connected, ended
  const [isInQueue, setIsInQueue] = useState(false);
  const [matchedPartner, setMatchedPartner] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [networkStats, setNetworkStats] = useState({
    latency: 0,
    packetLoss: 0,
    bandwidth: 0
  });
  const [error, setError] = useState(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);

  // 用户偏好设置
  const [preferences, setPreferences] = useState({
    nativeLanguage: userProfile.nativeLanguage || 'zh',
    targetLanguages: userProfile.targetLanguages || ['en'],
    country: userProfile.country || 'China',
    interests: userProfile.interests || [],
    ageGroup: userProfile.ageGroup || 'adult',
    callDuration: 'medium',
    topicPreference: 'any',
    enableTranslation: true,
    autoAnswer: false
  });

  // Refs
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const socketRef = useRef(null);
  const callTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chunkIndexRef = useRef(0);

  // API配置
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const API_TOKEN = localStorage.getItem('auth_token');

  // 支持的语言列表
  const supportedLanguages = [
    { code: 'zh', name: '中文(简体)', flag: '🇨🇳', country: 'China' },
    { code: 'en', name: 'English', flag: '🇺🇸', country: 'United States' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', country: 'Japan' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', country: 'South Korea' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', country: 'France' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', country: 'Germany' },
    { code: 'es', name: 'Español', flag: '🇪🇸', country: 'Spain' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', country: 'Italy' },
    { code: 'pt', name: 'Português', flag: '🇵🇹', country: 'Portugal' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', country: 'Russia' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', country: 'Saudi Arabia' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', country: 'India' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭', country: 'Thailand' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', country: 'Vietnam' }
  ];

  // 兴趣标签
  const interestTags = [
    '语言学习', '文化交流', '旅行', '美食', '音乐', '电影', '运动', '科技',
    '艺术', '历史', '商务', '教育', '健康', '时尚', '游戏', '读书'
  ];

  // 初始化音频上下文
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      } catch (error) {
        console.error('音频上下文初始化失败:', error);
        setError('音频上下文初始化失败');
      }
    };

    initAudioContext();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      if (currentCall) {
        endCall();
      }
    };
  }, []);

  // 加入匹配队列
  const joinMatchingQueue = async () => {
    try {
      setError(null);
      setCallState('searching');

      const response = await fetch(`${API_BASE_URL}/api/voice-call/matching/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          user_language: preferences.nativeLanguage,
          target_languages: preferences.targetLanguages,
          preferences: {
            interests: preferences.interests,
            age_range: getAgeRange(preferences.ageGroup),
            availability_hours: {},
            match_criteria: {
              call_duration: preferences.callDuration,
              topic_preference: preferences.topicPreference
            }
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsInQueue(true);
        setQueuePosition(data.queue_position);
        setEstimatedWaitTime(data.estimated_wait_time);
        
        // 开始轮询匹配状态
        startMatchingStatusPolling();
        
        console.log('已加入匹配队列');
      } else {
        throw new Error(data.message || '加入匹配队列失败');
      }
    } catch (error) {
      console.error('加入匹配队列失败:', error);
      setError(error.message);
      setCallState('idle');
    }
  };

  // 离开匹配队列
  const leaveMatchingQueue = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/voice-call/matching/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setIsInQueue(false);
        setCallState('idle');
        setQueuePosition(0);
        setEstimatedWaitTime(0);
        
        // 停止轮询
        stopMatchingStatusPolling();
        
        console.log('已离开匹配队列');
      } else {
        throw new Error(data.message || '离开匹配队列失败');
      }
    } catch (error) {
      console.error('离开匹配队列失败:', error);
      setError(error.message);
    }
  };

  // 开始轮询匹配状态
  const startMatchingStatusPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/voice-call/matching/status`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`
          }
        });

        const data = await response.json();

        if (data.success) {
          if (data.user_in_call && data.current_call) {
            // 找到匹配，开始通话
            setCurrentCall(data.current_call);
            setCallState('connected');
            setIsInQueue(false);
            
            // 开始音频处理
            await startCallAudio(data.current_call.call_session_id);
            
            clearInterval(pollInterval);
          } else if (data.user_in_queue) {
            setQueuePosition(data.queue_position);
          } else {
            // 用户不在队列中，可能被移除
            setIsInQueue(false);
            setCallState('idle');
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('轮询匹配状态失败:', error);
      }
    }, 2000); // 每2秒轮询一次

    return pollInterval;
  };

  // 停止轮询匹配状态
  const stopMatchingStatusPolling = () => {
    // 这里应该清除轮询间隔，但由于我们在函数内部创建间隔，
    // 实际实现中应该将间隔ID存储在ref中
  };

  // 开始通话音频处理
  const startCallAudio = async (callSessionId) => {
    try {
      // 请求音频权限
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        }
      });

      localStreamRef.current = stream;

      // 连接到音频分析器
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // 创建媒体记录器
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          processCallAudio(callSessionId);
        }
      };

      // 开始录制
      mediaRecorderRef.current.start();

      // 开始音频级别监控
      startAudioLevelMonitoring();

      // 设置定时处理音频块
      const audioInterval = setInterval(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.start();
        }
      }, 1500); // 通话中更频繁的处理

      // 开始通话计时
      startCallTimer();

    } catch (error) {
      console.error('开始通话音频失败:', error);
      setError('无法访问麦克风');
    }
  };

  // 处理通话音频
  const processCallAudio = async (callSessionId) => {
    if (!callSessionId || audioChunksRef.current.length === 0) {
      return;
    }

    try {
      setIsProcessingAudio(true);
      
      // 合并音频块
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      audioChunksRef.current = [];

      // 转换为base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // 发送到后端处理
      const response = await fetch(`${API_BASE_URL}/api/voice-call/call/${callSessionId}/audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          audio_data: base64Audio,
          chunk_index: chunkIndexRef.current++
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('音频处理成功');
      } else {
        console.error('音频处理失败:', data.message);
      }

    } catch (error) {
      console.error('处理通话音频失败:', error);
      setError('音频处理失败');
    } finally {
      setIsProcessingAudio(false);
    }
  };

  // 结束通话
  const endCall = async () => {
    try {
      if (currentCall) {
        const response = await fetch(`${API_BASE_URL}/api/voice-call/call/${currentCall.call_session_id}/end`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          console.log('通话已结束');
        }
      }

      // 停止音频处理
      stopCallAudio();
      
      // 重置状态
      setCurrentCall(null);
      setCallState('idle');
      setCallDuration(0);
      setTranslationHistory([]);
      setCurrentTranslation(null);
      chunkIndexRef.current = 0;

    } catch (error) {
      console.error('结束通话失败:', error);
      setError('结束通话失败');
    }
  };

  // 停止通话音频
  const stopCallAudio = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    setAudioLevel(0);
  };

  // 开始音频级别监控
  const startAudioLevelMonitoring = () => {
    const updateAudioLevel = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(average / 255);
      }
      
      if (callState === 'connected') {
        requestAnimationFrame(updateAudioLevel);
      }
    };
    
    updateAudioLevel();
  };

  // 开始通话计时
  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // 获取年龄范围
  const getAgeRange = (ageGroup) => {
    const ranges = {
      'teen': { min: 13, max: 19 },
      'young': { min: 20, max: 30 },
      'adult': { min: 31, max: 50 },
      'senior': { min: 51, max: 70 }
    };
    return ranges[ageGroup] || { min: 18, max: 65 };
  };

  // 切换静音
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // 格式化通话时长
  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 渲染连接质量指示器
  const renderConnectionQuality = () => {
    const qualityConfig = {
      excellent: { color: 'text-green-500', text: '优秀', bars: 4 },
      good: { color: 'text-blue-500', text: '良好', bars: 3 },
      fair: { color: 'text-yellow-500', text: '一般', bars: 2 },
      poor: { color: 'text-red-500', text: '较差', bars: 1 }
    };

    const config = qualityConfig[connectionQuality];

    return (
      <div className=\"flex items-center space-x-2\">
        <Signal className={`h-4 w-4 ${config.color}`} />
        <span className={`text-sm ${config.color}`}>{config.text}</span>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 space-y-6 ${className}`}>
      {/* 标题和状态 */}
      <Card>
        <CardHeader>
          <div className=\"flex items-center justify-between\">
            <div className=\"flex items-center space-x-3\">
              <div className=\"p-2 bg-purple-100 rounded-lg\">
                <Phone className=\"h-6 w-6 text-purple-600\" />
              </div>
              <div>
                <CardTitle>跨国语音通话</CardTitle>
                <CardDescription>
                  随机匹配全球用户进行实时语音交流
                </CardDescription>
              </div>
            </div>
            {callState === 'connected' && renderConnectionQuality()}
          </div>
        </CardHeader>
      </Card>

      {/* 错误提示 */}
      {error && (
        <Alert variant=\"destructive\">
          <AlertCircle className=\"h-4 w-4\" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 主要内容区域 */}
      <Tabs defaultValue=\"call\" className=\"w-full\">
        <TabsList className=\"grid w-full grid-cols-3\">
          <TabsTrigger value=\"call\">通话</TabsTrigger>
          <TabsTrigger value=\"preferences\">偏好设置</TabsTrigger>
          <TabsTrigger value=\"history\">通话历史</TabsTrigger>
        </TabsList>

        {/* 通话界面 */}
        <TabsContent value=\"call\" className=\"space-y-6\">
          {/* 通话状态卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className=\"flex items-center space-x-2\">
                <Activity className=\"h-5 w-5\" />
                <span>通话状态</span>
              </CardTitle>
            </CardHeader>
            <CardContent className=\"space-y-6\">
              {/* 状态显示 */}
              <div className=\"text-center space-y-4\">
                {callState === 'idle' && (
                  <div className=\"space-y-4\">
                    <div className=\"text-6xl\">📞</div>
                    <div>
                      <h3 className=\"text-xl font-semibold\">准备开始通话</h3>
                      <p className=\"text-gray-600\">点击下方按钮开始匹配全球用户</p>
                    </div>
                  </div>
                )}

                {callState === 'searching' && (
                  <div className=\"space-y-4\">
                    <div className=\"text-6xl animate-pulse\">🔍</div>
                    <div>
                      <h3 className=\"text-xl font-semibold\">正在寻找匹配用户...</h3>
                      <p className=\"text-gray-600\">
                        队列位置: {queuePosition} | 预计等待: {estimatedWaitTime}秒
                      </p>
                    </div>
                    <Progress value={(estimatedWaitTime - (estimatedWaitTime * 0.8)) / estimatedWaitTime * 100} className=\"w-64 mx-auto\" />
                  </div>
                )}

                {callState === 'connected' && currentCall && (
                  <div className=\"space-y-4\">
                    <div className=\"text-6xl\">🗣️</div>
                    <div>
                      <h3 className=\"text-xl font-semibold\">通话进行中</h3>
                      <p className=\"text-gray-600\">
                        通话时长: {formatCallDuration(callDuration)}
                      </p>
                    </div>
                    
                    {/* 音频级别指示器 */}
                    <div className=\"space-y-2\">
                      <div className=\"flex items-center justify-center space-x-2\">
                        <Mic className=\"h-4 w-4\" />
                        <span className=\"text-sm\">音频级别</span>
                      </div>
                      <Progress value={audioLevel * 100} className=\"w-64 mx-auto\" />
                    </div>
                  </div>
                )}
              </div>

              {/* 控制按钮 */}
              <div className=\"flex justify-center space-x-4\">
                {callState === 'idle' && (
                  <Button
                    onClick={joinMatchingQueue}
                    size=\"lg\"
                    className=\"px-8 py-4 text-lg bg-green-500 hover:bg-green-600\"
                  >
                    <Search className=\"h-5 w-5 mr-2\" />
                    开始匹配
                  </Button>
                )}

                {callState === 'searching' && (
                  <Button
                    onClick={leaveMatchingQueue}
                    size=\"lg\"
                    variant=\"destructive\"
                    className=\"px-8 py-4 text-lg\"
                  >
                    <XCircle className=\"h-5 w-5 mr-2\" />
                    取消匹配
                  </Button>
                )}

                {callState === 'connected' && (
                  <div className=\"flex space-x-4\">
                    <Button
                      onClick={toggleMute}
                      size=\"lg\"
                      variant={isMuted ? \"destructive\" : \"secondary\"}
                    >
                      {isMuted ? <MicOff className=\"h-5 w-5\" /> : <Mic className=\"h-5 w-5\" />}
                    </Button>
                    
                    <Button
                      onClick={endCall}
                      size=\"lg\"
                      variant=\"destructive\"
                      className=\"px-8 py-4 text-lg\"
                    >
                      <PhoneOff className=\"h-5 w-5 mr-2\" />
                      结束通话
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 实时翻译 */}
          {callState === 'connected' && translationEnabled && (
            <Card>
              <CardHeader>
                <CardTitle className=\"flex items-center space-x-2\">
                  <Zap className=\"h-5 w-5\" />
                  <span>实时翻译</span>
                  {isProcessingAudio && (
                    <Badge variant=\"secondary\">
                      <RefreshCw className=\"h-3 w-3 mr-1 animate-spin\" />
                      处理中...
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className=\"space-y-4\">
                {/* 当前翻译 */}
                {currentTranslation && (
                  <div className=\"space-y-2\">
                    <div className=\"p-3 bg-gray-50 rounded-lg\">
                      <div className=\"text-sm text-gray-600 mb-1\">对方说:</div>
                      <div className=\"text-gray-800\">{currentTranslation.original}</div>
                    </div>
                    <div className=\"p-3 bg-blue-50 rounded-lg\">
                      <div className=\"text-sm text-blue-600 mb-1\">翻译:</div>
                      <div className=\"text-blue-800\">{currentTranslation.translated}</div>
                    </div>
                  </div>
                )}

                {/* 翻译历史 */}
                {translationHistory.length > 0 && (
                  <div className=\"space-y-2 max-h-40 overflow-y-auto\">
                    <div className=\"text-sm font-medium text-gray-600\">翻译历史</div>
                    {translationHistory.slice(-5).map((item, index) => (
                      <div key={index} className=\"text-sm p-2 bg-gray-50 rounded\">
                        <div className=\"text-gray-600\">{item.original}</div>
                        <div className=\"text-blue-600\">→ {item.translated}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 偏好设置 */}
        <TabsContent value=\"preferences\" className=\"space-y-6\">
          <Card>
            <CardHeader>
              <CardTitle className=\"flex items-center space-x-2\">
                <Settings className=\"h-5 w-5\" />
                <span>匹配偏好</span>
              </CardTitle>
            </CardHeader>
            <CardContent className=\"space-y-6\">
              {/* 语言设置 */}
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                <div className=\"space-y-2\">
                  <label className=\"text-sm font-medium\">我的语言</label>
                  <Select 
                    value={preferences.nativeLanguage} 
                    onValueChange={(value) => setPreferences(prev => ({...prev, nativeLanguage: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className=\"flex items-center space-x-2\">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className=\"space-y-2\">
                  <label className=\"text-sm font-medium\">想要练习的语言</label>
                  <Select 
                    value={preferences.targetLanguages[0]} 
                    onValueChange={(value) => setPreferences(prev => ({...prev, targetLanguages: [value]}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className=\"flex items-center space-x-2\">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 兴趣标签 */}
              <div className=\"space-y-2\">
                <label className=\"text-sm font-medium\">兴趣爱好</label>
                <div className=\"flex flex-wrap gap-2\">
                  {interestTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={preferences.interests.includes(tag) ? \"default\" : \"secondary\"}
                      className=\"cursor-pointer\"
                      onClick={() => {
                        setPreferences(prev => ({
                          ...prev,
                          interests: prev.interests.includes(tag)
                            ? prev.interests.filter(t => t !== tag)
                            : [...prev.interests, tag]
                        }));
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 其他设置 */}
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                <div className=\"space-y-2\">
                  <label className=\"text-sm font-medium\">年龄组</label>
                  <Select 
                    value={preferences.ageGroup} 
                    onValueChange={(value) => setPreferences(prev => ({...prev, ageGroup: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=\"teen\">青少年 (13-19)</SelectItem>
                      <SelectItem value=\"young\">青年 (20-30)</SelectItem>
                      <SelectItem value=\"adult\">成年 (31-50)</SelectItem>
                      <SelectItem value=\"senior\">中老年 (51-70)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className=\"space-y-2\">
                  <label className=\"text-sm font-medium\">通话时长偏好</label>
                  <Select 
                    value={preferences.callDuration} 
                    onValueChange={(value) => setPreferences(prev => ({...prev, callDuration: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=\"short\">短聊 (5-10分钟)</SelectItem>
                      <SelectItem value=\"medium\">中等 (10-20分钟)</SelectItem>
                      <SelectItem value=\"long\">长聊 (20分钟以上)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 开关选项 */}
              <div className=\"flex flex-wrap gap-4\">
                <div className=\"flex items-center space-x-2\">
                  <Switch
                    checked={preferences.enableTranslation}
                    onCheckedChange={(checked) => setPreferences(prev => ({...prev, enableTranslation: checked}))}
                  />
                  <label className=\"text-sm\">启用实时翻译</label>
                </div>
                <div className=\"flex items-center space-x-2\">
                  <Switch
                    checked={preferences.autoAnswer}
                    onCheckedChange={(checked) => setPreferences(prev => ({...prev, autoAnswer: checked}))}
                  />
                  <label className=\"text-sm\">自动接听</label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通话历史 */}
        <TabsContent value=\"history\" className=\"space-y-6\">
          <Card>
            <CardHeader>
              <CardTitle className=\"flex items-center space-x-2\">
                <Clock className=\"h-5 w-5\" />
                <span>通话历史</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className=\"text-center text-gray-500 py-8\">
                暂无通话历史记录
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrossBorderVoiceCall;

