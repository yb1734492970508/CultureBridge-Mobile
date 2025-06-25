import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Smartphone, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings,
  Download,
  Upload,
  Mic,
  MicOff,
  Languages,
  Headphones,
  Speaker,
  Radio,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Switch } from '@/components/ui/switch.jsx';

const PhoneAudioTranslator = ({ 
  className = '',
  onTranslationUpdate = () => {},
  defaultSourceLanguage = 'auto',
  defaultTargetLanguage = 'en-US'
}) => {
  // 状态管理
  const [isCapturing, setIsCapturing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [captureMode, setCaptureMode] = useState('realtime'); // 'realtime', 'manual'
  const [audioSource, setAudioSource] = useState('system'); // 'system', 'microphone', 'file'
  const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);
  const [volume, setVolume] = useState(0.8);
  const [sensitivity, setSensitivity] = useState(0.5);
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentText, setCurrentText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [translationHistory, setTranslationHistory] = useState([]);
  const [audioQuality, setAudioQuality] = useState('good');
  const [processingTime, setProcessingTime] = useState(0);

  // Refs
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const sessionRef = useRef(null);

  // 支持的语言列表
  const supportedLanguages = [
    { code: 'auto', name: '自动检测', flag: '🌐' },
    { code: 'zh-CN', name: '中文(简体)', flag: '🇨🇳' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' }
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
      }
    };

    initAudioContext();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 生成会话ID
  const generateSessionId = () => {
    return 'phone_audio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // 获取系统音频流
  const getSystemAudioStream = async () => {
    try {
      // 使用 getDisplayMedia 捕获系统音频
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100
        }
      });

      return stream;
    } catch (error) {
      console.error('获取系统音频失败:', error);
      throw new Error('无法获取系统音频，请检查浏览器权限');
    }
  };

  // 获取麦克风音频流
  const getMicrophoneStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      return stream;
    } catch (error) {
      console.error('获取麦克风失败:', error);
      throw new Error('无法获取麦克风，请检查权限设置');
    }
  };

  // 设置音频分析器
  const setupAudioAnalyser = (stream) => {
    if (!audioContextRef.current || !analyserRef.current) return;

    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);

    // 开始音频级别监控
    const updateAudioLevel = () => {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(average / 255);
    };

    intervalRef.current = setInterval(updateAudioLevel, 100);
  };

  // 启动音频捕获
  const startCapture = async () => {
    try {
      setConnectionStatus('connecting');
      
      let stream;
      if (audioSource === 'system') {
        stream = await getSystemAudioStream();
      } else {
        stream = await getMicrophoneStream();
      }

      mediaStreamRef.current = stream;
      setupAudioAnalyser(stream);

      // 设置媒体录制器
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await processAudioBlob(audioBlob);
          audioChunksRef.current = [];
        }
      };

      // 生成新的会话ID
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      sessionRef.current = newSessionId;

      if (captureMode === 'realtime') {
        // 启动实时翻译
        await startRealtimeTranslation(newSessionId);
        
        // 开始录制，每3秒处理一次
        mediaRecorderRef.current.start(3000);
      }

      setIsCapturing(true);
      setIsConnected(true);
      setConnectionStatus('connected');

    } catch (error) {
      console.error('启动音频捕获失败:', error);
      setConnectionStatus('error');
      alert(error.message);
    }
  };

  // 停止音频捕获
  const stopCapture = async () => {
    try {
      setConnectionStatus('disconnecting');

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (sessionRef.current) {
        await stopRealtimeTranslation(sessionRef.current);
      }

      setIsCapturing(false);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setAudioLevel(0);
      setSessionId(null);
      sessionRef.current = null;

    } catch (error) {
      console.error('停止音频捕获失败:', error);
      setConnectionStatus('error');
    }
  };

  // 启动实时翻译
  const startRealtimeTranslation = async (sessionId) => {
    try {
      const response = await fetch('/api/phone-audio/start-realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          sourceLanguage,
          targetLanguage,
          bufferDuration: 3000
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

    } catch (error) {
      console.error('启动实时翻译失败:', error);
      throw error;
    }
  };

  // 停止实时翻译
  const stopRealtimeTranslation = async (sessionId) => {
    try {
      const response = await fetch('/api/phone-audio/stop-realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      if (!data.success) {
        console.error('停止实时翻译失败:', data.error);
      }

    } catch (error) {
      console.error('停止实时翻译失败:', error);
    }
  };

  // 处理音频数据
  const processAudioBlob = async (audioBlob) => {
    try {
      setIsTranslating(true);
      const startTime = Date.now();

      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('sourceLanguage', sourceLanguage);
      formData.append('targetLanguage', targetLanguage);
      formData.append('sessionId', sessionRef.current);

      const response = await fetch('/api/phone-audio/translate', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        const result = data.data;
        setCurrentText(result.transcription.text);
        setTranslatedText(result.translation.text);
        setAudioQuality(result.metadata.audioQuality.quality);
        
        const endTime = Date.now();
        setProcessingTime(endTime - startTime);

        // 添加到历史记录
        const historyItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          original: result.transcription.text,
          translated: result.translation.text,
          sourceLanguage: result.transcription.language,
          targetLanguage: result.translation.language,
          confidence: result.translation.confidence,
          processingTime: endTime - startTime,
          audioQuality: result.metadata.audioQuality.quality
        };

        setTranslationHistory(prev => [historyItem, ...prev.slice(0, 9)]); // 保留最近10条

        // 回调通知
        onTranslationUpdate(historyItem);

        // 自动播放翻译语音
        if (autoPlay && result.audio.translatedPath) {
          // 这里可以播放翻译后的语音
          console.log('播放翻译语音:', result.audio.translatedPath);
        }

      } else {
        console.error('音频处理失败:', data.error);
      }

    } catch (error) {
      console.error('处理音频失败:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // 手动录制
  const startManualRecording = async () => {
    if (!mediaStreamRef.current) {
      await startCapture();
    }

    if (mediaRecorderRef.current) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
    }
  };

  const stopManualRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // 切换捕获模式
  const toggleCapture = async () => {
    if (isCapturing) {
      await stopCapture();
    } else {
      await startCapture();
    }
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'disconnecting': return 'text-orange-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <Wifi className="w-4 h-4" />;
      case 'connecting': return <Activity className="w-4 h-4 animate-spin" />;
      case 'disconnecting': return <Activity className="w-4 h-4 animate-spin" />;
      case 'error': return <WifiOff className="w-4 h-4" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700 ${className}`}>
      {/* 标题栏 */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">手机播放内容翻译</h3>
              <p className="text-gray-400 text-sm">
                实时捕获并翻译手机播放的音频内容
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${getStatusColor(connectionStatus)}`}>
              {getStatusIcon(connectionStatus)}
              <span className="text-xs capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 音频源选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">音频源</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAudioSource('system')}
              className={`p-3 rounded-lg border transition-all ${
                audioSource === 'system'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                  : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
              }`}
              disabled={isCapturing}
            >
              <Speaker className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">系统音频</span>
            </button>
            
            <button
              onClick={() => setAudioSource('microphone')}
              className={`p-3 rounded-lg border transition-all ${
                audioSource === 'microphone'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                  : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
              }`}
              disabled={isCapturing}
            >
              <Mic className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">麦克风</span>
            </button>
          </div>
        </div>

        {/* 语言设置 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">源语言</label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              disabled={isCapturing}
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">目标语言</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              disabled={isCapturing}
            >
              {supportedLanguages.filter(lang => lang.code !== 'auto').map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 音频级别指示器 */}
        {isCapturing && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">音频级别</span>
              <Badge variant={audioLevel > 0.1 ? 'default' : 'secondary'}>
                {audioQuality}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${audioLevel * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8">
                {Math.round(audioLevel * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* 主控制按钮 */}
        <div className="flex justify-center">
          <Button
            onClick={toggleCapture}
            size="lg"
            className={`w-20 h-20 rounded-full ${
              isCapturing
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }`}
            disabled={connectionStatus === 'connecting' || connectionStatus === 'disconnecting'}
          >
            {connectionStatus === 'connecting' || connectionStatus === 'disconnecting' ? (
              <Activity className="w-8 h-8 animate-spin" />
            ) : isCapturing ? (
              <Square className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </Button>
        </div>

        {/* 翻译结果 */}
        {(currentText || translatedText) && (
          <div className="space-y-4">
            {currentText && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase">原文</span>
                  <span className="text-xs text-gray-500">{sourceLanguage}</span>
                </div>
                <p className="text-white">{currentText}</p>
              </div>
            )}

            {translatedText && (
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase">译文</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{targetLanguage}</span>
                    {processingTime > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {processingTime}ms
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-white">{translatedText}</p>
              </div>
            )}
          </div>
        )}

        {/* 设置选项 */}
        <div className="space-y-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">自动播放翻译</span>
            <Switch
              checked={autoPlay}
              onCheckedChange={setAutoPlay}
            />
          </div>
          
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

        {/* 翻译历史 */}
        {translationHistory.length > 0 && (
          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">最近翻译</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {translationHistory.slice(0, 3).map(item => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-white mb-1">{item.original}</div>
                  <div className="text-sm text-blue-300">{item.translated}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneAudioTranslator;

