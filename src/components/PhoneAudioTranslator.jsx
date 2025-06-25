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
  Activity,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

const PhoneAudioTranslator = ({ 
  className = '',
  onTranslationUpdate = () => {},
  defaultSourceLanguage = 'auto',
  defaultTargetLanguage = 'en'
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
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTranslations: 0,
    sessionDuration: 0,
    averageProcessingTime: 0
  });

  // Refs
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
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
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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

      const response = await fetch(`${API_BASE_URL}/api/realtime/phone-audio/start`, {
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
            real_time_threshold: 3.0
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
        
        // 开始音频捕获
        await startAudioCapture();
        
        console.log('翻译会话已开始:', data.session_id);
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

      // 停止音频捕获
      stopAudioCapture();
      
      setSessionId(null);
      sessionRef.current = null;
      setIsConnected(false);
      setIsCapturing(false);
      setConnectionStatus('disconnected');
      chunkIndexRef.current = 0;
      
      // 更新会话统计
      if (sessionStartTimeRef.current) {
        const duration = (Date.now() - sessionStartTimeRef.current) / 1000;
        setStats(prev => ({
          ...prev,
          sessionDuration: duration
        }));
      }
      
      console.log('翻译会话已停止');
    } catch (error) {
      console.error('停止会话失败:', error);
      setError(error.message);
    }
  };

  // 开始音频捕获
  const startAudioCapture = async () => {
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
      setIsCapturing(true);

      // 开始音频级别监控
      startAudioLevelMonitoring();

      // 设置定时处理音频块
      intervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.start();
        }
      }, 3000); // 每3秒处理一次

    } catch (error) {
      console.error('音频捕获失败:', error);
      setError('无法访问麦克风');
    }
  };

  // 停止音频捕获
  const stopAudioCapture = () => {
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

    setIsCapturing(false);
    setAudioLevel(0);
  };

  // 处理音频块
  const processAudioChunks = async () => {
    if (!sessionId || audioChunksRef.current.length === 0) {
      return;
    }

    try {
      const startTime = Date.now();
      
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
        
        // 更新统计
        setStats(prev => ({
          ...prev,
          averageProcessingTime: (prev.averageProcessingTime + processingTime) / 2
        }));
      } else {
        console.error('音频处理失败:', data.message);
      }

    } catch (error) {
      console.error('处理音频块失败:', error);
      setError('音频处理失败');
    }
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
      
      if (isCapturing) {
        requestAnimationFrame(updateAudioLevel);
      }
    };
    
    updateAudioLevel();
  };

  // 切换捕获状态
  const toggleCapture = async () => {
    if (isCapturing) {
      await stopSession();
    } else {
      await startSession();
    }
  };

  // 获取会话状态
  const getSessionStatus = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/realtime/session/${sessionId}/status`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // 更新状态信息
        console.log('会话状态:', data);
      }
    } catch (error) {
      console.error('获取会话状态失败:', error);
    }
  };

  // 定期获取会话状态
  useEffect(() => {
    if (sessionId) {
      const statusInterval = setInterval(getSessionStatus, 10000); // 每10秒检查一次
      return () => clearInterval(statusInterval);
    }
  }, [sessionId]);

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

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 space-y-6 ${className}`}>
      {/* 标题和状态 */}
      <Card>
        <CardHeader>
          <div className=\"flex items-center justify-between\">
            <div className=\"flex items-center space-x-3\">
              <div className=\"p-2 bg-blue-100 rounded-lg\">
                <Smartphone className=\"h-6 w-6 text-blue-600\" />
              </div>
              <div>
                <CardTitle>手机播放内容实时翻译</CardTitle>
                <CardDescription>
                  捕获手机播放的音频内容并实时翻译
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
            <span>翻译控制</span>
          </CardTitle>
        </CardHeader>
        <CardContent className=\"space-y-6\">
          {/* 主控制按钮 */}
          <div className=\"flex justify-center\">
            <Button
              onClick={toggleCapture}
              size=\"lg\"
              className={`px-8 py-4 text-lg ${
                isCapturing 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={connectionStatus === 'connecting'}
            >
              {isCapturing ? (
                <>
                  <Square className=\"h-5 w-5 mr-2\" />
                  停止翻译
                </>
              ) : (
                <>
                  <Play className=\"h-5 w-5 mr-2\" />
                  开始翻译
                </>
              )}
            </Button>
          </div>

          {/* 音频级别指示器 */}
          {isCapturing && (
            <div className=\"space-y-2\">
              <div className=\"flex items-center justify-between\">
                <span className=\"text-sm font-medium\">音频级别</span>
                <Badge variant={audioLevel > 0.1 ? 'default' : 'secondary'}>
                  {audioLevel > 0.1 ? '检测到音频' : '静音'}
                </Badge>
              </div>
              <Progress value={audioLevel * 100} className=\"h-2\" />
            </div>
          )}

          {/* 设置选项 */}
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <div className=\"space-y-2\">
              <label className=\"text-sm font-medium\">音频灵敏度</label>
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
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
              />
              <label className=\"text-sm\">自动播放翻译</label>
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
              <span className=\"text-sm font-medium text-gray-600\">原文</span>
              {isTranslating && (
                <Badge variant=\"secondary\">
                  <RefreshCw className=\"h-3 w-3 mr-1 animate-spin\" />
                  处理中...
                </Badge>
              )}
            </div>
            <p className=\"text-gray-800\">
              {currentText || '等待音频输入...'}
            </p>
          </div>

          {/* 译文 */}
          <div className=\"p-4 bg-blue-50 rounded-lg\">
            <div className=\"flex items-center justify-between mb-2\">
              <span className=\"text-sm font-medium text-blue-600\">译文</span>
              {translatedText && (
                <Button variant=\"ghost\" size=\"sm\">
                  <Volume2 className=\"h-4 w-4\" />
                </Button>
              )}
            </div>
            <p className=\"text-blue-800\">
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
              <Clock className=\"h-5 w-5\" />
              <span>会话统计</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 text-center\">
              <div>
                <div className=\"text-2xl font-bold text-blue-600\">{stats.totalTranslations}</div>
                <div className=\"text-sm text-gray-600\">翻译次数</div>
              </div>
              <div>
                <div className=\"text-2xl font-bold text-green-600\">
                  {Math.round(stats.sessionDuration)}s
                </div>
                <div className=\"text-sm text-gray-600\">会话时长</div>
              </div>
              <div>
                <div className=\"text-2xl font-bold text-purple-600\">
                  {Math.round(stats.averageProcessingTime)}ms
                </div>
                <div className=\"text-sm text-gray-600\">平均处理时间</div>
              </div>
              <div>
                <div className=\"text-2xl font-bold text-orange-600\">{audioQuality}</div>
                <div className=\"text-sm text-gray-600\">音频质量</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhoneAudioTranslator;

