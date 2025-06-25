import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Users,
  Globe,
  MessageCircle,
  Settings,
  Loader
} from 'lucide-react';
import RealTimeTranslator from './RealTimeTranslator';
import { useLanguage } from '../hooks/useLanguage';

const VoiceCallComponent = ({ className = '' }) => {
  const { t, currentLanguage } = useLanguage();
  const [callState, setCallState] = useState('idle'); // 'idle', 'searching', 'connecting', 'connected', 'ended'
  const [userInfo, setUserInfo] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [callId, setCallId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showTranslator, setShowTranslator] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('good'); // 'poor', 'fair', 'good', 'excellent'
  
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const callTimerRef = useRef(null);
  const searchTimerRef = useRef(null);

  // WebRTC配置
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // 初始化用户信息
  useEffect(() => {
    initializeUser();
  }, []);

  // 通话计时器
  useEffect(() => {
    if (callState === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      setCallDuration(0);
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callState]);

  const initializeUser = async () => {
    try {
      const response = await fetch('/api/voice-call/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: `用户_${Math.random().toString(36).substr(2, 6)}`,
          language: currentLanguage
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setUserInfo(data.user_info);
      }
    } catch (error) {
      console.error('初始化用户失败:', error);
    }
  };

  const startSearching = async () => {
    if (!userInfo) {
      await initializeUser();
      return;
    }

    setCallState('searching');
    
    // 开始寻找匹配
    const searchForMatch = async () => {
      try {
        const response = await fetch('/api/voice-call/find-match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userInfo.user_id
          })
        });
        
        const data = await response.json();
        if (data.success && data.matched) {
          setPartnerInfo(data.partner_info);
          setCallId(data.call_info.call_id);
          setCallState('connecting');
          await initializeCall(data.call_info);
        } else if (callState === 'searching') {
          // 继续搜索
          searchTimerRef.current = setTimeout(searchForMatch, 2000);
        }
      } catch (error) {
        console.error('搜索匹配失败:', error);
        setCallState('idle');
      }
    };

    searchForMatch();
  };

  const initializeCall = async (callInfo) => {
    try {
      // 获取用户媒体流
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      localStreamRef.current = stream;
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      // 创建RTCPeerConnection
      peerConnectionRef.current = new RTCPeerConnection(rtcConfiguration);
      
      // 添加本地流
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // 处理远程流
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
        setCallState('connected');
      };

      // 处理ICE候选
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          // 发送ICE候选到信令服务器
          // 这里需要WebSocket连接
        }
      };

      // 监控连接状态
      peerConnectionRef.current.onconnectionstatechange = () => {
        const state = peerConnectionRef.current.connectionState;
        if (state === 'connected') {
          setConnectionQuality('good');
        } else if (state === 'disconnected' || state === 'failed') {
          endCall();
        }
      };

      // 创建offer（如果是发起方）
      if (callInfo.user1 === userInfo.user_id) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        // 发送offer到信令服务器
      }

    } catch (error) {
      console.error('初始化通话失败:', error);
      setCallState('idle');
    }
  };

  const endCall = async () => {
    // 清理资源
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }

    // 通知服务器结束通话
    if (callId) {
      try {
        await fetch('/api/voice-call/end-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            call_id: callId,
            user_id: userInfo?.user_id
          })
        });
      } catch (error) {
        console.error('结束通话失败:', error);
      }
    }

    setCallState('idle');
    setPartnerInfo(null);
    setCallId(null);
    setCallDuration(0);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    if (remoteAudioRef.current) {
      remoteAudioRef.current.volume = isSpeakerOn ? 0 : 1;
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 ${className}`}>
      {/* 隐藏的音频元素 */}
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">全球语音通话</h3>
            <p className="text-gray-400 text-sm">与世界各地的朋友交流</p>
          </div>
        </div>
        
        {callState === 'connected' && (
          <div className="text-right">
            <div className="text-white font-mono">{formatDuration(callDuration)}</div>
            <div className={`text-xs ${getConnectionQualityColor()}`}>
              连接质量: {connectionQuality}
            </div>
          </div>
        )}
      </div>

      {/* 用户信息显示 */}
      {userInfo && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {userInfo.user_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{userInfo.user_name}</p>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {userInfo.country} ({userInfo.country_code})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 通话状态显示 */}
      <div className="text-center mb-6">
        {callState === 'idle' && (
          <div>
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <p className="text-white text-lg font-medium mb-2">准备开始通话</p>
            <p className="text-gray-400 text-sm">点击下方按钮开始寻找通话伙伴</p>
          </div>
        )}

        {callState === 'searching' && (
          <div>
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Loader className="w-10 h-10 text-white animate-spin" />
            </div>
            <p className="text-white text-lg font-medium mb-2">正在寻找通话伙伴...</p>
            <p className="text-gray-400 text-sm">正在为您匹配来自其他国家的用户</p>
          </div>
        )}

        {callState === 'connecting' && partnerInfo && (
          <div>
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">
                {partnerInfo.user_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-white text-lg font-medium mb-2">正在连接...</p>
            <p className="text-gray-400 text-sm">
              与来自 {partnerInfo.country} 的 {partnerInfo.user_name} 连接中
            </p>
          </div>
        )}

        {callState === 'connected' && partnerInfo && (
          <div>
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">
                {partnerInfo.user_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-white text-lg font-medium mb-2">通话中</p>
            <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
              <Globe className="w-3 h-3" />
              {partnerInfo.user_name} 来自 {partnerInfo.country}
            </p>
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center gap-4 mb-6">
        {callState === 'idle' && (
          <button
            onClick={startSearching}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center hover:from-green-600 hover:to-blue-600 transition-all duration-300"
          >
            <Phone className="w-8 h-8 text-white" />
          </button>
        )}

        {(callState === 'searching' || callState === 'connecting' || callState === 'connected') && (
          <>
            <button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={endCall}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>

            <button
              onClick={toggleSpeaker}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isSpeakerOn 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isSpeakerOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
            </button>
          </>
        )}
      </div>

      {/* 实时翻译器切换 */}
      {callState === 'connected' && (
        <div className="mb-4">
          <button
            onClick={() => setShowTranslator(!showTranslator)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-gray-300" />
            <span className="text-gray-300">
              {showTranslator ? '隐藏实时翻译' : '显示实时翻译'}
            </span>
          </button>
        </div>
      )}

      {/* 实时翻译器 */}
      {callState === 'connected' && showTranslator && partnerInfo && (
        <RealTimeTranslator
          isInCall={true}
          sourceLanguage="auto"
          targetLanguage={partnerInfo.language || 'en'}
          onTranslationUpdate={(translation) => {
            console.log('翻译更新:', translation);
          }}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default VoiceCallComponent;

