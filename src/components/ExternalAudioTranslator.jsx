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
  EyeOff,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

const ExternalAudioTranslator = ({ 
  className = '',
  onTranslationUpdate = () => {},
  defaultSourceLanguage = 'auto',
  defaultTargetLanguage = 'en'
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
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Refs
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const durationTimerRef = useRef(null);
  const sessionRef = useRef(null);
  const chunkIndexRef = useRef(0);
  const sessionStartTimeRef = useRef(null);

  // API配置
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const API_TOKEN = localStorage.getItem('auth_token');

  // 支持的语言列表
  const supportedLanguages = [
    { code: 'auto', name: '自动检测', flag: '🌐' },
    { code: 'zh', name: '中文(简体)', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
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
        setError('音频上下文初始化失败');
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
      if (sessionId) {
        stopSession();
      }
    };
  }, []);

  // 开始翻译会话
  const startSession = async () => {
    try {
      setError(null);
      setConnectionStatus('connecting');

      const response = await fetch(`${API_BASE_URL}/api/realtime/external-audio/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          source_language: sourceLanguage,
          target_language: targetLanguage,
          config: {
            audio_format: 'wav',
            sample_rate: 16000,
            channels: 1,
            real_time_threshold: 2.0,
            noise_reduction: noiseReduction
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setSessionId(data.session_id);
        sessionRef.current = data.session_id;
        setConnectionStatus('connected');
        setIsConnected(true);
        sessionStartTimeRef.current = Date.now();
        
        // 开始音频监听
        await startAudioListening();
        
        // 开始计时器
        startDurationTimer();
        
        console.log('外部音频翻译会话已开始:', data.session_id);
      } else {
        throw new Error(data.message || '启动会话失败');
      }
    } catch (error) {
      console.error('启动会话失败:', error);
      setError(error.message);
      setConnectionStatus('error');
    }
  };

  // 停止翻译会话
  const stopSession = async () => {
    try {
      if (sessionId) {
        await fetch(`${API_BASE_URL}/api/realtime/session/${sessionId}/stop`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`
          }
        });
      }

      // 停止音频监听
      stopAudioListening();
      
      // 停止计时器
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
      
      setSessionId(null);
      sessionRef.current = null;
      setIsConnected(false);
      setIsListening(false);
      setConnectionStatus('disconnected');
      chunkIndexRef.current = 0;
      
      console.log('外部音频翻译会话已停止');
    } catch (error) {
      console.error('停止会话失败:', error);
      setError(error.message);
    }
  };

  // 开始音频监听
  const startAudioListening = async () => {
    try {
      // 请求音频权限
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: noiseReduction,
          noiseSuppression: noiseReduction,
          autoGainControl: true,
          sampleRate: 16000
        }
      });

      mediaStreamRef.current = stream;

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
          processAudioChunks();
        }
      };

      // 开始录制
      mediaRecorderRef.current.start();
      setIsListening(true);

      // 开始音频级别监控
      startAudioLevelMonitoring();

      // 设置定时处理音频块
      intervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.start();
        }
      }, 2000); // 每2秒处理一次（外部音频更频繁）

    } catch (error) {
      console.error('音频监听失败:', error);
      setError('无法访问麦克风');
    }
  };

  // 停止音频监听
  const stopAudioListening = () => {
    if (mediaRecorderRef.current) {
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

    setIsListening(false);
    setAudioLevel(0);
    setVoiceActivity(false);
  };

  // 处理音频块
  const processAudioChunks = async () => {
    if (!sessionId || audioChunksRef.current.length === 0) {
      return;
    }

    try {
      const startTime = Date.now();
      setIsProcessing(true);
      
      // 合并音频块
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      audioChunksRef.current = [];

      // 转换为base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // 发送到后端处理
      const response = await fetch(`${API_BASE_URL}/api/realtime/audio/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          audio_data: base64Audio,
          chunk_index: chunkIndexRef.current++
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const processingTime = Date.now() - startTime;
        setProcessingTime(processingTime);
        setTranslationCount(prev => prev + 1);
      } else {
        console.error('音频处理失败:', data.message);
      }

    } catch (error) {
      console.error('处理音频块失败:', error);
      setError('音频处理失败');
    } finally {
      setIsProcessing(false);
    }
  };

  // 开始音频级别监控
  const startAudioLevelMonitoring = () => {
    const updateAudioLevel = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const level = average / 255;
        
        setAudioLevel(level);
        
        // 检测语音活动
        const voiceThreshold = sensitivity;
        setVoiceActivity(level > voiceThreshold);
        
        // 估算背景噪音
        if (level < 0.1) {
          setBackgroundNoise(level);
        }
        
        // 评估音频质量
        if (level > 0.7) {
          setAudioQuality('excellent');
        } else if (level > 0.4) {
          setAudioQuality('good');
        } else if (level > 0.2) {
          setAudioQuality('fair');
        } else {
          setAudioQuality('poor');
        }
      }
      
      if (isListening) {
        requestAnimationFrame(updateAudioLevel);
      }
    };
    
    updateAudioLevel();
  };

  // 开始计时器
  const startDurationTimer = () => {
    durationTimerRef.current = setInterval(() => {
      setListeningDuration(prev => prev + 1);
    }, 1000);
  };

  // 切换监听状态
  const toggleListening = async () => {
    if (isListening) {
      await stopSession();
    } else {
      await startSession();
    }
  };

  // 渲染连接状态指示器
  const renderConnectionStatus = () => {
    const statusConfig = {
      disconnected: { icon: WifiOff, color: 'text-gray-500', text: '未连接' },
      connecting: { icon: RefreshCw, color: 'text-yellow-500', text: '连接中...' },
      connected: { icon: Wifi, color: 'text-green-500', text: '已连接' },
      error: { icon: AlertCircle, color: 'text-red-500', text: '连接错误' }
    };

    const config = statusConfig[connectionStatus];
    const Icon = config.icon;

    return (
      <div className=\"flex items-center space-x-2\">
        <Icon className={`h-4 w-4 ${config.color} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
        <span className={`text-sm ${config.color}`}>{config.text}</span>
      </div>
    );
  };

  // 渲染音频质量指示器
  const renderAudioQuality = () => {
    const qualityConfig = {
      excellent: { color: 'text-green-500', text: '优秀' },
      good: { color: 'text-blue-500', text: '良好' },
      fair: { color: 'text-yellow-500', text: '一般' },
      poor: { color: 'text-red-500', text: '较差' }
    };

    const config = qualityConfig[audioQuality];

    return (
      <Badge variant={audioQuality === 'excellent' || audioQuality === 'good' ? 'default' : 'secondary'}>
        <span className={config.color}>{config.text}</span>
      </Badge>
    );
  };

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 space-y-6 ${className}`}>
      {/* 标题和状态 */}
      <Card>
        <CardHeader>
          <div className=\"flex items-center justify-between\">
            <div className=\"flex items-center space-x-3\">
              <div className=\"p-2 bg-green-100 rounded-lg\">
                <Ear className=\"h-6 w-6 text-green-600\" />
              </div>
              <div>
                <CardTitle>外部音频实时翻译</CardTitle>
                <CardDescription>
                  监听周围环境音频并实时翻译
                </CardDescription>
              </div>
            </div>
            {renderConnectionStatus()}
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

      {/* 语言选择 */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center space-x-2\">
            <Languages className=\"h-5 w-5\" />
            <span>语言设置</span>
          </CardTitle>
        </CardHeader>
        <CardContent className=\"space-y-4\">
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <div className=\"space-y-2\">
              <label className=\"text-sm font-medium\">源语言</label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
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
              <label className=\"text-sm font-medium\">目标语言</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.filter(lang => lang.code !== 'auto').map((lang) => (
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
        </CardContent>
      </Card>

      {/* 控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center space-x-2\">
            <Activity className=\"h-5 w-5\" />
            <span>监听控制</span>
          </CardTitle>
        </CardHeader>
        <CardContent className=\"space-y-6\">
          {/* 主控制按钮 */}
          <div className=\"flex justify-center\">
            <Button
              onClick={toggleListening}
              size=\"lg\"
              className={`px-8 py-4 text-lg ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={connectionStatus === 'connecting'}
            >
              {isListening ? (
                <>
                  <Square className=\"h-5 w-5 mr-2\" />
                  停止监听
                </>
              ) : (
                <>
                  <Play className=\"h-5 w-5 mr-2\" />
                  开始监听
                </>
              )}
            </Button>
          </div>

          {/* 音频状态指示器 */}
          {isListening && (
            <div className=\"space-y-4\">
              {/* 音频级别 */}
              <div className=\"space-y-2\">
                <div className=\"flex items-center justify-between\">
                  <span className=\"text-sm font-medium\">音频级别</span>
                  <div className=\"flex items-center space-x-2\">
                    {voiceActivity && (
                      <Badge variant=\"default\">
                        <Waves className=\"h-3 w-3 mr-1\" />
                        检测到语音
                      </Badge>
                    )}
                    {renderAudioQuality()}
                  </div>
                </div>
                <Progress value={audioLevel * 100} className=\"h-2\" />
              </div>

              {/* 背景噪音 */}
              <div className=\"space-y-2\">
                <div className=\"flex items-center justify-between\">
                  <span className=\"text-sm font-medium\">背景噪音</span>
                  <span className=\"text-sm text-gray-500\">
                    {(backgroundNoise * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={backgroundNoise * 100} className=\"h-1\" />
              </div>
            </div>
          )}

          {/* 设置选项 */}
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <div className=\"space-y-2\">
              <label className=\"text-sm font-medium\">语音检测灵敏度</label>
              <Slider
                value={[sensitivity]}
                onValueChange={(value) => setSensitivity(value[0])}
                max={1}
                min={0}
                step={0.1}
                className=\"w-full\"
              />
            </div>
            <div className=\"space-y-2\">
              <label className=\"text-sm font-medium\">音量</label>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={1}
                min={0}
                step={0.1}
                className=\"w-full\"
              />
            </div>
          </div>

          {/* 开关选项 */}
          <div className=\"flex flex-wrap gap-4\">
            <div className=\"flex items-center space-x-2\">
              <Switch
                checked={noiseReduction}
                onCheckedChange={setNoiseReduction}
              />
              <label className=\"text-sm\">噪音抑制</label>
            </div>
            <div className=\"flex items-center space-x-2\">
              <Switch
                checked={autoTranslate}
                onCheckedChange={setAutoTranslate}
              />
              <label className=\"text-sm\">自动翻译</label>
            </div>
            <div className=\"flex items-center space-x-2\">
              <Switch
                checked={continuousMode}
                onCheckedChange={setContinuousMode}
              />
              <label className=\"text-sm\">连续模式</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 翻译结果 */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center space-x-2\">
            <Zap className=\"h-5 w-5\" />
            <span>实时翻译</span>
          </CardTitle>
        </CardHeader>
        <CardContent className=\"space-y-4\">
          {/* 原文 */}
          <div className=\"p-4 bg-gray-50 rounded-lg\">
            <div className=\"flex items-center justify-between mb-2\">
              <span className=\"text-sm font-medium text-gray-600\">检测到的语音</span>
              {isProcessing && (
                <Badge variant=\"secondary\">
                  <RefreshCw className=\"h-3 w-3 mr-1 animate-spin\" />
                  处理中...
                </Badge>
              )}
            </div>
            <p className=\"text-gray-800\">
              {currentText || '等待语音输入...'}
            </p>
          </div>

          {/* 译文 */}
          <div className=\"p-4 bg-green-50 rounded-lg\">
            <div className=\"flex items-center justify-between mb-2\">
              <span className=\"text-sm font-medium text-green-600\">翻译结果</span>
              {translatedText && (
                <Button variant=\"ghost\" size=\"sm\">
                  <Volume2 className=\"h-4 w-4\" />
                </Button>
              )}
            </div>
            <p className=\"text-green-800\">
              {translatedText || '翻译结果将在这里显示...'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      {sessionId && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center space-x-2\">
              <BarChart3 className=\"h-5 w-5\" />
              <span>监听统计</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 text-center\">
              <div>
                <div className=\"text-2xl font-bold text-green-600\">{translationCount}</div>
                <div className=\"text-sm text-gray-600\">翻译次数</div>
              </div>
              <div>
                <div className=\"text-2xl font-bold text-blue-600\">
                  {Math.floor(listeningDuration / 60)}:{(listeningDuration % 60).toString().padStart(2, '0')}
                </div>
                <div className=\"text-sm text-gray-600\">监听时长</div>
              </div>
              <div>
                <div className=\"text-2xl font-bold text-purple-600\">
                  {Math.round(processingTime)}ms
                </div>
                <div className=\"text-sm text-gray-600\">处理时间</div>
              </div>
              <div>
                <div className=\"text-2xl font-bold text-orange-600\">{audioQuality}</div>
                <div className=\"text-sm text-gray-600\">音频质量</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 高级设置 */}
      <Card>
        <CardHeader>
          <div className=\"flex items-center justify-between\">
            <CardTitle className=\"flex items-center space-x-2\">
              <Settings className=\"h-5 w-5\" />
              <span>高级设置</span>
            </CardTitle>
            <Button
              variant=\"ghost\"
              size=\"sm\"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <EyeOff className=\"h-4 w-4\" /> : <Eye className=\"h-4 w-4\" />}
            </Button>
          </div>
        </CardHeader>
        {showAdvanced && (
          <CardContent className=\"space-y-4\">
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div className=\"space-y-2\">
                <label className=\"text-sm font-medium\">音频采样率</label>
                <Select defaultValue=\"16000\">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"8000\">8 kHz</SelectItem>
                    <SelectItem value=\"16000\">16 kHz</SelectItem>
                    <SelectItem value=\"44100\">44.1 kHz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className=\"space-y-2\">
                <label className=\"text-sm font-medium\">处理间隔</label>
                <Select defaultValue=\"2000\">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"1000\">1 秒</SelectItem>
                    <SelectItem value=\"2000\">2 秒</SelectItem>
                    <SelectItem value=\"3000\">3 秒</SelectItem>
                    <SelectItem value=\"5000\">5 秒</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ExternalAudioTranslator;

