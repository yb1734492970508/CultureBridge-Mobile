import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Ear, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings,
  Mic,
  MicOff,
  Languages,
  Users,
  Activity,
  Zap,
  ZapOff,
  Filter,
  FilterX,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Radio,
  Waves,
  Target,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';

const ExternalAudioTranslator = ({ 
  className = '',
  onTranslationUpdate = () => {},
  defaultSourceLanguage = 'auto',
  defaultTargetLanguage = 'en-US'
}) => {
  // 状态管理
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);
  const [sensitivity, setSensitivity] = useState(0.5);
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [continuousMode, setContinuousMode] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [sessionId, setSessionId] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [backgroundNoise, setBackgroundNoise] = useState(0);
  const [detectedSpeakers, setDetectedSpeakers] = useState([]);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [audioQuality, setAudioQuality] = useState('good');
  const [processingTime, setProcessingTime] = useState(0);
  const [translationCount, setTranslationCount] = useState(0);
  const [listeningDuration, setListeningDuration] = useState(0);
  const [voiceActivity, setVoiceActivity] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Refs
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const durationTimerRef = useRef(null);
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
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt-PT', name: 'Português', flag: '🇵🇹' },
    { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  // 初始化音频上下文
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;
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
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    };
  }, []);

  // 生成会话ID
  const generateSessionId = () => {
    return 'external_audio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // 获取麦克风权限
  const getMicrophoneStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: noiseReduction,
          noiseSuppression: noiseReduction,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });

      return stream;
    } catch (error) {
      console.error('获取麦克风失败:', error);
      throw new Error('无法获取麦克风权限，请检查设置');
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
      const normalizedLevel = average / 255;
      
      setAudioLevel(normalizedLevel);
      
      // 检测语音活动
      const voiceThreshold = sensitivity * 0.1;
      const hasVoice = normalizedLevel > voiceThreshold;
      setVoiceActivity(hasVoice);
      
      // 更新背景噪音级别
      if (!hasVoice) {
        setBackgroundNoise(prev => prev * 0.9 + normalizedLevel * 0.1);
      }
    };

    intervalRef.current = setInterval(updateAudioLevel, 100);
  };

  // 启动外部音频监听
  const startListening = async () => {
    try {
      setIsProcessing(true);
      
      // 获取麦克风流
      const stream = await getMicrophoneStream();
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

      // 启动后端监听
      await startBackendListening(newSessionId);

      // 开始录制
      if (continuousMode) {
        mediaRecorderRef.current.start(3000); // 每3秒处理一次
      }

      // 开始计时
      durationTimerRef.current = setInterval(() => {
        setListeningDuration(prev => prev + 1);
      }, 1000);

      setIsListening(true);
      setIsProcessing(false);

    } catch (error) {
      console.error('启动外部音频监听失败:', error);
      setIsProcessing(false);
      alert(error.message);
    }
  };

  // 停止外部音频监听
  const stopListening = async () => {
    try {
      setIsProcessing(true);

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

      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      if (sessionRef.current) {
        await stopBackendListening(sessionRef.current);
      }

      setIsListening(false);
      setIsProcessing(false);
      setAudioLevel(0);
      setVoiceActivity(false);
      setSessionId(null);
      sessionRef.current = null;
      setListeningDuration(0);

    } catch (error) {
      console.error('停止外部音频监听失败:', error);
      setIsProcessing(false);
    }
  };

  // 启动后端监听
  const startBackendListening = async (sessionId) => {
    try {
      const response = await fetch('/api/external-audio/start-listening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          sourceLanguage,
          targetLanguage,
          sensitivity,
          noiseReduction,
          autoTranslate,
          continuousMode,
          maxDuration: 1800000 // 30分钟
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

    } catch (error) {
      console.error('启动后端监听失败:', error);
      throw error;
    }
  };

  // 停止后端监听
  const stopBackendListening = async (sessionId) => {
    try {
      const response = await fetch('/api/external-audio/stop-listening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      if (data.success && data.data.stats) {
        setTranslationCount(data.data.stats.translationCount);
      }

    } catch (error) {
      console.error('停止后端监听失败:', error);
    }
  };

  // 处理音频数据
  const processAudioBlob = async (audioBlob) => {
    if (!autoTranslate || !sessionRef.current) return;

    try {
      const startTime = Date.now();

      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('sessionId', sessionRef.current);
      formData.append('sourceLanguage', sourceLanguage);
      formData.append('targetLanguage', targetLanguage);
      formData.append('enhanceAudio', noiseReduction.toString());
      formData.append('detectSpeakers', 'true');

      const response = await fetch('/api/external-audio/process', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success && data.data.status === 'success') {
        const result = data.data;
        setCurrentText(result.transcription.text);
        setTranslatedText(result.translation.text);
        setAudioQuality(result.audio.quality);
        
        const endTime = Date.now();
        setProcessingTime(endTime - startTime);

        // 更新说话人信息
        if (result.transcription.speakers) {
          setDetectedSpeakers(result.transcription.speakers);
        }

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
          audioQuality: result.audio.quality,
          speakers: result.transcription.speakers || [],
          context: result.translation.context || 'general'
        };

        setTranslationHistory(prev => [historyItem, ...prev.slice(0, 19)]); // 保留最近20条
        setTranslationCount(prev => prev + 1);

        // 回调通知
        onTranslationUpdate(historyItem);

      } else if (data.data && data.data.status === 'no_voice_detected') {
        // 没有检测到语音，这是正常情况
        console.log('未检测到语音内容');
      }

    } catch (error) {
      console.error('处理外部音频失败:', error);
    }
  };

  // 手动录制
  const startManualRecording = async () => {
    if (!mediaStreamRef.current) {
      await startListening();
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

  // 切换监听模式
  const toggleListening = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  // 更新设置
  const updateSettings = async (newSettings) => {
    if (!sessionRef.current) return;

    try {
      const response = await fetch(`/api/external-audio/listener/${sessionRef.current}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      });

      const data = await response.json();
      if (!data.success) {
        console.error('更新设置失败:', data.error);
      }

    } catch (error) {
      console.error('更新设置失败:', error);
    }
  };

  // 格式化时间
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取音频质量颜色
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700 ${className}`}>
      {/* 标题栏 */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
              <Ear className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">外部音频实时翻译</h3>
              <p className="text-gray-400 text-sm">
                监听周围环境音频并实时翻译
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isListening && (
              <Badge variant="default" className="bg-green-500">
                <Activity className="w-3 h-3 mr-1" />
                监听中
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main">主控制</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
            <TabsTrigger value="stats">统计</TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-6">
            {/* 语言设置 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">源语言</label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => {
                    setSourceLanguage(e.target.value);
                    if (isListening) {
                      updateSettings({ sourceLanguage: e.target.value });
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  disabled={isListening}
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
                  onChange={(e) => {
                    setTargetLanguage(e.target.value);
                    if (isListening) {
                      updateSettings({ targetLanguage: e.target.value });
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {supportedLanguages.filter(lang => lang.code !== 'auto').map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 音频级别和语音活动指示器 */}
            {isListening && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">音频级别</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={voiceActivity ? 'default' : 'secondary'}>
                        {voiceActivity ? '检测到语音' : '静音'}
                      </Badge>
                      <Badge variant="outline" className={getQualityColor(audioQuality)}>
                        {audioQuality}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-100 ${
                          voiceActivity 
                            ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}
                        style={{ width: `${audioLevel * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8">
                      {Math.round(audioLevel * 100)}%
                    </span>
                  </div>
                </div>

                {/* 背景噪音级别 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">背景噪音</span>
                    <span className="text-xs text-gray-500">
                      {Math.round(backgroundNoise * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${backgroundNoise * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 主控制按钮 */}
            <div className="flex justify-center">
              <Button
                onClick={toggleListening}
                size="lg"
                className={`w-20 h-20 rounded-full ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
                }`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Activity className="w-8 h-8 animate-spin" />
                ) : isListening ? (
                  <Square className="w-8 h-8" />
                ) : (
                  <Ear className="w-8 h-8" />
                )}
              </Button>
            </div>

            {/* 状态信息 */}
            {isListening && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-800 rounded-lg p-3">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                  <div className="text-sm text-gray-300">监听时长</div>
                  <div className="text-lg font-semibold text-white">
                    {formatDuration(listeningDuration)}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3">
                  <Target className="w-5 h-5 mx-auto mb-1 text-green-400" />
                  <div className="text-sm text-gray-300">翻译次数</div>
                  <div className="text-lg font-semibold text-white">
                    {translationCount}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3">
                  <Users className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                  <div className="text-sm text-gray-300">检测说话人</div>
                  <div className="text-lg font-semibold text-white">
                    {detectedSpeakers.length}
                  </div>
                </div>
              </div>
            )}

            {/* 翻译结果 */}
            {(currentText || translatedText) && (
              <div className="space-y-4">
                {currentText && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 uppercase">原文</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{sourceLanguage}</span>
                        {detectedSpeakers.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {detectedSpeakers.length}人
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-white">{currentText}</p>
                  </div>
                )}

                {translatedText && (
                  <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-lg p-4">
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
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* 基础设置 */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">灵敏度</span>
                  <span className="text-xs text-gray-500">{Math.round(sensitivity * 100)}%</span>
                </div>
                <Slider
                  value={[sensitivity]}
                  onValueChange={(value) => {
                    setSensitivity(value[0]);
                    if (isListening) {
                      updateSettings({ sensitivity: value[0] });
                    }
                  }}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">噪音降噪</span>
                </div>
                <Switch
                  checked={noiseReduction}
                  onCheckedChange={(checked) => {
                    setNoiseReduction(checked);
                    if (isListening) {
                      updateSettings({ noiseReduction: checked });
                    }
                  }}
                  disabled={isListening}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">自动翻译</span>
                </div>
                <Switch
                  checked={autoTranslate}
                  onCheckedChange={(checked) => {
                    setAutoTranslate(checked);
                    if (isListening) {
                      updateSettings({ autoTranslate: checked });
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">连续模式</span>
                </div>
                <Switch
                  checked={continuousMode}
                  onCheckedChange={setContinuousMode}
                  disabled={isListening}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">播放音量</span>
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

          <TabsContent value="stats" className="space-y-6">
            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">总翻译次数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{translationCount}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">平均处理时间</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {translationHistory.length > 0 
                      ? Math.round(translationHistory.reduce((sum, item) => sum + item.processingTime, 0) / translationHistory.length)
                      : 0}ms
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">音频质量分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {['excellent', 'good', 'fair', 'poor'].map(quality => {
                      const count = translationHistory.filter(item => item.audioQuality === quality).length;
                      const percentage = translationHistory.length > 0 ? (count / translationHistory.length) * 100 : 0;
                      return (
                        <div key={quality} className="flex items-center justify-between text-xs">
                          <span className={`capitalize ${getQualityColor(quality)}`}>{quality}</span>
                          <span className="text-gray-400">{Math.round(percentage)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">检测到的说话人</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{detectedSpeakers.length}</div>
                  {detectedSpeakers.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {detectedSpeakers.slice(0, 3).map((speaker, index) => (
                        <div key={speaker.id || index} className="text-xs text-gray-400">
                          说话人 {index + 1}: {speaker.gender || '未知'} ({Math.round(speaker.confidence * 100)}%)
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 翻译历史 */}
            {translationHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">最近翻译历史</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {translationHistory.slice(0, 5).map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getQualityColor(item.audioQuality)}`}>
                            {item.audioQuality}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.processingTime}ms
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-white mb-1">{item.original}</div>
                      <div className="text-sm text-green-300">{item.translated}</div>
                      {item.speakers && item.speakers.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          说话人: {item.speakers.length}人
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExternalAudioTranslator;

