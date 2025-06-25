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
  Speaker
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';

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

  // 用户偏好设置
  const [preferences, setPreferences] = useState({
    nativeLanguage: userProfile.nativeLanguage || 'zh-CN',
    targetLanguage: userProfile.targetLanguage || 'en-US',
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

  // 支持的语言列表
  const supportedLanguages = [
    { code: 'zh-CN', name: '中文(简体)', flag: '🇨🇳', country: 'China' },
    { code: 'en-US', name: 'English', flag: '🇺🇸', country: 'United States' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵', country: 'Japan' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷', country: 'South Korea' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷', country: 'France' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', country: 'Germany' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸', country: 'Spain' },
    { code: 'it-IT', name: 'Italiano', flag: '🇮🇹', country: 'Italy' }
  ];

  // 兴趣选项
  const interestOptions = [
    '文化交流', '语言学习', '旅行', '美食', '音乐', '电影', 
    '运动', '科技', '艺术', '历史', '商务', '教育'
  ];

  // 初始化WebRTC
  useEffect(() => {
    initializeWebRTC();
    initializeSocket();

    return () => {
      cleanup();
    };
  }, []);

  // 初始化WebRTC
  const initializeWebRTC = async () => {
    try {
      // 创建RTCPeerConnection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // 设置事件监听器
      peerConnectionRef.current.onicecandidate = handleIceCandidate;
      peerConnectionRef.current.ontrack = handleRemoteStream;
      peerConnectionRef.current.onconnectionstatechange = handleConnectionStateChange;
      peerConnectionRef.current.oniceconnectionstatechange = handleIceConnectionStateChange;

      // 初始化音频上下文
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

    } catch (error) {
      console.error('WebRTC初始化失败:', error);
    }
  };

  // 初始化Socket连接
  const initializeSocket = () => {
    // 这里应该初始化Socket.IO连接
    // socketRef.current = io('/voice-call');
    
    // 模拟Socket事件监听
    const mockSocket = {
      on: (event, callback) => {
        console.log(`监听事件: ${event}`);
      },
      emit: (event, data) => {
        console.log(`发送事件: ${event}`, data);
      },
      disconnect: () => {
        console.log('Socket断开连接');
      }
    };

    socketRef.current = mockSocket;

    // 监听匹配事件
    socketRef.current.on('match_found', handleMatchFound);
    socketRef.current.on('matching_timeout', handleMatchingTimeout);
    socketRef.current.on('call_initiated', handleCallInitiated);
    socketRef.current.on('webrtc_signal', handleWebRTCSignal);
    socketRef.current.on('translation_ready', handleTranslationReady);
    socketRef.current.on('call_ended', handleCallEnded);
  };

  // 加入匹配队列
  const joinMatchingQueue = async () => {
    try {
      setCallState('searching');
      setIsInQueue(true);

      const response = await fetch('/api/voice-call/join-queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          nativeLanguage: preferences.nativeLanguage,
          targetLanguage: preferences.targetLanguage,
          country: preferences.country,
          interests: preferences.interests,
          ageGroup: preferences.ageGroup,
          callPreferences: {
            enableTranslation: preferences.enableTranslation,
            callDuration: preferences.callDuration,
            topicPreference: preferences.topicPreference
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.data.status === 'matched') {
          handleMatchFound({
            matchId: data.data.matchId,
            partner: data.data.partner
          });
        } else {
          setQueuePosition(data.data.queuePosition || 0);
          setEstimatedWaitTime(data.data.estimatedWaitTime || 30000);
        }
      } else {
        throw new Error(data.error);
      }

    } catch (error) {
      console.error('加入匹配队列失败:', error);
      setCallState('idle');
      setIsInQueue(false);
      alert(error.message);
    }
  };

  // 离开匹配队列
  const leaveMatchingQueue = async () => {
    try {
      const response = await fetch('/api/voice-call/leave-queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      
      if (data.success) {
        setCallState('idle');
        setIsInQueue(false);
        setQueuePosition(0);
        setEstimatedWaitTime(0);
      }

    } catch (error) {
      console.error('离开匹配队列失败:', error);
    }
  };

  // 开始通话
  const startCall = async (matchId) => {
    try {
      setCallState('connecting');

      // 获取用户媒体
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: isVideoEnabled
      });

      localStreamRef.current = stream;
      
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
      
      if (isVideoEnabled && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // 添加流到PeerConnection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // 设置音频分析器
      setupAudioAnalyser(stream);

      // 发起通话
      const response = await fetch('/api/voice-call/start-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          initiatorId: userId,
          callOptions: {
            videoEnabled: isVideoEnabled,
            recordingEnabled: false,
            translationMode: 'realtime'
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentCall(data.data);
        
        // 创建offer
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        
        // 发送offer
        await sendWebRTCSignal(data.data.callId, 'offer', offer);
        
        // 开始通话计时
        startCallTimer();
      } else {
        throw new Error(data.error);
      }

    } catch (error) {
      console.error('开始通话失败:', error);
      setCallState('matched');
      alert(error.message);
    }
  };

  // 结束通话
  const endCall = async (reason = 'user_ended') => {
    try {
      if (currentCall) {
        const response = await fetch('/api/voice-call/end-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            callId: currentCall.callId,
            userId,
            reason
          })
        });

        const data = await response.json();
        console.log('通话结束响应:', data);
      }

      // 清理本地资源
      cleanup();
      
      setCallState('ended');
      setTimeout(() => {
        setCallState('idle');
        setCurrentCall(null);
        setMatchedPartner(null);
        setCallDuration(0);
        setTranslationHistory([]);
      }, 3000);

    } catch (error) {
      console.error('结束通话失败:', error);
    }
  };

  // 发送WebRTC信令
  const sendWebRTCSignal = async (callId, signalType, signalData) => {
    try {
      const response = await fetch('/api/voice-call/webrtc-signal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callId,
          userId,
          signalType,
          signalData
        })
      });

      const data = await response.json();
      if (!data.success) {
        console.error('发送信令失败:', data.error);
      }

    } catch (error) {
      console.error('发送WebRTC信令失败:', error);
    }
  };

  // 设置音频分析器
  const setupAudioAnalyser = (stream) => {
    if (!audioContextRef.current || !analyserRef.current) return;

    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);

    const updateAudioLevel = () => {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(average / 255);
    };

    const intervalId = setInterval(updateAudioLevel, 100);
    
    return () => clearInterval(intervalId);
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

  // 清理资源
  const cleanup = () => {
    // 停止本地流
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // 关闭PeerConnection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // 停止计时器
    stopCallTimer();

    // 清理音频上下文
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  // 事件处理器
  const handleMatchFound = (data) => {
    setMatchedPartner(data.partner);
    setCallState('matched');
    setIsInQueue(false);
  };

  const handleMatchingTimeout = (data) => {
    setCallState('idle');
    setIsInQueue(false);
    alert('匹配超时，请重新尝试');
  };

  const handleCallInitiated = (data) => {
    setCurrentCall(data);
    if (!data.isInitiator) {
      // 被叫方，等待接听
      setCallState('connecting');
    }
  };

  const handleWebRTCSignal = async (data) => {
    try {
      const { signalType, signalData } = data;

      switch (signalType) {
        case 'offer':
          await peerConnectionRef.current.setRemoteDescription(signalData);
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          await sendWebRTCSignal(currentCall.callId, 'answer', answer);
          break;

        case 'answer':
          await peerConnectionRef.current.setRemoteDescription(signalData);
          break;

        case 'ice-candidate':
          await peerConnectionRef.current.addIceCandidate(signalData);
          break;
      }

    } catch (error) {
      console.error('处理WebRTC信令失败:', error);
    }
  };

  const handleTranslationReady = (data) => {
    setCurrentTranslation(data.translation);
    setTranslationHistory(prev => [data.translation, ...prev.slice(0, 9)]);
    onTranslationUpdate(data.translation);
  };

  const handleCallEnded = (data) => {
    setCallState('ended');
    stopCallTimer();
    
    setTimeout(() => {
      setCallState('idle');
      setCurrentCall(null);
      setMatchedPartner(null);
      setCallDuration(0);
    }, 3000);
  };

  const handleIceCandidate = async (event) => {
    if (event.candidate && currentCall) {
      await sendWebRTCSignal(currentCall.callId, 'ice-candidate', event.candidate);
    }
  };

  const handleRemoteStream = (event) => {
    remoteStreamRef.current = event.streams[0];
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = event.streams[0];
    }
    if (isVideoEnabled && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
    setCallState('connected');
  };

  const handleConnectionStateChange = () => {
    const state = peerConnectionRef.current?.connectionState;
    console.log('连接状态变化:', state);
    
    if (state === 'connected') {
      setConnectionQuality('good');
    } else if (state === 'disconnected' || state === 'failed') {
      setConnectionQuality('poor');
    }
  };

  const handleIceConnectionStateChange = () => {
    const state = peerConnectionRef.current?.iceConnectionState;
    console.log('ICE连接状态变化:', state);
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

  // 切换视频
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // 切换扬声器
  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    if (remoteAudioRef.current) {
      remoteAudioRef.current.volume = isSpeakerOn ? 0.5 : 1.0;
    }
  };

  // 格式化时间
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取连接质量颜色
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // 获取状态图标
  const getStateIcon = () => {
    switch (callState) {
      case 'searching': return <Search className="w-6 h-6 animate-spin" />;
      case 'matched': return <UserCheck className="w-6 h-6 text-green-400" />;
      case 'connecting': return <Loader className="w-6 h-6 animate-spin" />;
      case 'connected': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'ended': return <XCircle className="w-6 h-6 text-red-400" />;
      default: return <Phone className="w-6 h-6" />;
    }
  };

  return (
    <div className={`bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700 ${className}`}>
      {/* 标题栏 */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">跨国语音通话</h3>
              <p className="text-gray-400 text-sm">
                与全球用户进行实时语音交流
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStateIcon()}
            <Badge variant={callState === 'connected' ? 'default' : 'secondary'}>
              {callState === 'idle' && '待机'}
              {callState === 'searching' && '匹配中'}
              {callState === 'matched' && '已匹配'}
              {callState === 'connecting' && '连接中'}
              {callState === 'connected' && '通话中'}
              {callState === 'ended' && '已结束'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="call" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="call">通话</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
            <TabsTrigger value="history">历史</TabsTrigger>
          </TabsList>

          <TabsContent value="call" className="space-y-6">
            {/* 匹配状态 */}
            {callState === 'idle' && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                  <Globe className="w-16 h-16 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    开始跨国语音通话
                  </h3>
                  <p className="text-gray-400 mb-4">
                    与来自 {supportedLanguages.find(l => l.code === preferences.targetLanguage)?.country} 的用户进行语音交流
                  </p>
                  <Button
                    onClick={joinMatchingQueue}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    开始匹配
                  </Button>
                </div>
              </div>
            )}

            {/* 匹配中状态 */}
            {callState === 'searching' && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <Search className="w-16 h-16 text-blue-400 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    正在寻找通话伙伴...
                  </h3>
                  <p className="text-gray-400 mb-4">
                    队列位置: {queuePosition} | 预计等待: {Math.round(estimatedWaitTime / 1000)}秒
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((30 - estimatedWaitTime / 1000) / 30 * 100, 100)}%` }}
                    />
                  </div>
                  <Button
                    onClick={leaveMatchingQueue}
                    variant="outline"
                  >
                    取消匹配
                  </Button>
                </div>
              </div>
            )}

            {/* 已匹配状态 */}
            {callState === 'matched' && matchedPartner && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <UserCheck className="w-16 h-16 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    找到通话伙伴！
                  </h3>
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {matchedPartner.country?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="text-white font-medium">
                          来自 {matchedPartner.country}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {supportedLanguages.find(l => l.code === matchedPartner.nativeLanguage)?.flag} 
                          {supportedLanguages.find(l => l.code === matchedPartner.nativeLanguage)?.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      学习目标: {supportedLanguages.find(l => l.code === matchedPartner.targetLanguage)?.name}
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => startCall(matchedPartner.matchId)}
                      size="lg"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <PhoneCall className="w-5 h-5 mr-2" />
                      开始通话
                    </Button>
                    <Button
                      onClick={leaveMatchingQueue}
                      variant="outline"
                    >
                      重新匹配
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 通话中状态 */}
            {(callState === 'connecting' || callState === 'connected') && (
              <div className="space-y-6">
                {/* 通话信息 */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                        {matchedPartner?.country?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {matchedPartner?.country || '通话伙伴'}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge variant="outline" className={getQualityColor(connectionQuality)}>
                      <Signal className="w-3 h-3 mr-1" />
                      {connectionQuality}
                    </Badge>
                    {callState === 'connected' && (
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(callDuration)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {callState === 'connecting' ? '正在连接...' : '通话进行中'}
                  </p>
                </div>

                {/* 音频级别指示器 */}
                {callState === 'connected' && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">音频级别</span>
                      <span className="text-xs text-gray-500">
                        {Math.round(audioLevel * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-100"
                          style={{ width: `${audioLevel * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 通话控制 */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={toggleMute}
                    variant={isMuted ? 'destructive' : 'outline'}
                    size="lg"
                    className="w-14 h-14 rounded-full"
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </Button>
                  
                  <Button
                    onClick={toggleSpeaker}
                    variant={isSpeakerOn ? 'default' : 'outline'}
                    size="lg"
                    className="w-14 h-14 rounded-full"
                  >
                    {isSpeakerOn ? <Speaker className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
                  </Button>
                  
                  <Button
                    onClick={() => endCall()}
                    variant="destructive"
                    size="lg"
                    className="w-14 h-14 rounded-full"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </Button>
                </div>

                {/* 实时翻译 */}
                {translationEnabled && currentTranslation && (
                  <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Languages className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">实时翻译</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-white">{currentTranslation.originalText}</div>
                      <div className="text-blue-300 border-l-2 border-blue-500 pl-3">
                        {currentTranslation.translatedText}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 通话结束状态 */}
            {callState === 'ended' && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center">
                  <XCircle className="w-16 h-16 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    通话已结束
                  </h3>
                  <p className="text-gray-400 mb-4">
                    通话时长: {formatDuration(callDuration)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    感谢您的使用，3秒后返回主界面
                  </p>
                </div>
              </div>
            )}

            {/* 隐藏的音频元素 */}
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* 语言设置 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">语言设置</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">母语</label>
                  <select
                    value={preferences.nativeLanguage}
                    onChange={(e) => setPreferences(prev => ({ ...prev, nativeLanguage: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    disabled={callState !== 'idle'}
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">学习语言</label>
                  <select
                    value={preferences.targetLanguage}
                    onChange={(e) => setPreferences(prev => ({ ...prev, targetLanguage: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    disabled={callState !== 'idle'}
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 通话偏好 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">通话偏好</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">启用实时翻译</span>
                </div>
                <Switch
                  checked={preferences.enableTranslation}
                  onCheckedChange={(checked) => {
                    setPreferences(prev => ({ ...prev, enableTranslation: checked }));
                    setTranslationEnabled(checked);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">通话时长偏好</label>
                <select
                  value={preferences.callDuration}
                  onChange={(e) => setPreferences(prev => ({ ...prev, callDuration: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="short">短时间 (5-10分钟)</option>
                  <option value="medium">中等时间 (10-20分钟)</option>
                  <option value="long">长时间 (20分钟以上)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">话题偏好</label>
                <select
                  value={preferences.topicPreference}
                  onChange={(e) => setPreferences(prev => ({ ...prev, topicPreference: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="any">任何话题</option>
                  <option value="culture">文化交流</option>
                  <option value="language">语言学习</option>
                  <option value="travel">旅行</option>
                  <option value="business">商务</option>
                  <option value="casual">日常聊天</option>
                </select>
              </div>
            </div>

            {/* 音频设置 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">音频设置</h4>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">音量</span>
                  <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* 翻译历史 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">翻译历史</h4>
              
              {translationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400">暂无翻译记录</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {translationHistory.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-2">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="text-sm text-white mb-1">{item.originalText}</div>
                      <div className="text-sm text-blue-300 border-l-2 border-blue-500 pl-3">
                        {item.translatedText}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CrossBorderVoiceCall;

