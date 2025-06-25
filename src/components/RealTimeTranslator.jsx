import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Languages, 
  Play, 
  Pause,
  Settings,
  Headphones
} from 'lucide-react';

const RealTimeTranslator = ({ 
  isInCall = false, 
  sourceLanguage = 'auto', 
  targetLanguage = 'en',
  onTranslationUpdate = () => {},
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [audioSource, setAudioSource] = useState('microphone'); // 'microphone', 'system', 'file'
  const [volume, setVolume] = useState(0.8);
  const [speechRate, setSpeechRate] = useState(1.0);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const translationTimeoutRef = useRef(null);

  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = sourceLanguage === 'auto' ? 'zh-CN' : sourceLanguage;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const fullText = finalTranscript || interimTranscript;
        setCurrentText(fullText);
        
        // 如果有最终结果，进行翻译
        if (finalTranscript) {
          translateText(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          // 自动重启识别
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      };
    }
    
    // 初始化语音合成
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [sourceLanguage, isListening]);

  // 翻译文本
  const translateText = async (text) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    
    // 清除之前的翻译延时
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }
    
    // 延迟翻译，避免频繁请求
    translationTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch('/api/translation/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            source_language: sourceLanguage,
            target_language: targetLanguage
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setTranslatedText(data.translated_text);
          onTranslationUpdate({
            original: text,
            translated: data.translated_text,
            sourceLanguage,
            targetLanguage
          });
          
          // 自动播放翻译结果
          if (isSpeaking) {
            speakText(data.translated_text, targetLanguage);
          }
        }
      } catch (error) {
        console.error('翻译错误:', error);
      } finally {
        setIsTranslating(false);
      }
    }, 500);
  };

  // 语音合成播放
  const speakText = (text, language) => {
    if (!synthRef.current || !text) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = speechRate;
    utterance.volume = volume;
    
    // 选择合适的语音
    const voices = synthRef.current.getVoices();
    const voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }
    
    synthRef.current.speak(utterance);
  };

  // 开始/停止语音识别
  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音识别功能');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    } else {
      try {
        // 请求麦克风权限
        if (audioSource === 'microphone') {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            } 
          });
          mediaStreamRef.current = stream;
        }
        
        recognitionRef.current.start();
        setIsListening(true);
        setCurrentText('');
        setTranslatedText('');
      } catch (error) {
        console.error('无法访问麦克风:', error);
        alert('无法访问麦克风，请检查权限设置');
      }
    }
  };

  // 切换语音播放
  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      synthRef.current?.cancel();
    }
  };

  // 手动播放翻译结果
  const playTranslation = () => {
    if (translatedText) {
      speakText(translatedText, targetLanguage);
    }
  };

  // 获取系统音频（实验性功能）
  const captureSystemAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      mediaStreamRef.current = stream;
      setAudioSource('system');
      
      // 这里可以添加音频分析和识别逻辑
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      
      // 添加音频处理节点
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      
    } catch (error) {
      console.error('无法捕获系统音频:', error);
      alert('无法捕获系统音频，请检查浏览器权限');
    }
  };

  return (
    <div className={`bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 ${className}`}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">实时语音翻译</h3>
            <p className="text-gray-400 text-sm">
              {sourceLanguage === 'auto' ? '自动检测' : sourceLanguage} → {targetLanguage}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeaking}
            className={`p-2 rounded-lg transition-colors ${
              isSpeaking 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={isSpeaking ? '关闭语音播放' : '开启语音播放'}
          >
            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 音频源选择 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setAudioSource('microphone')}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            audioSource === 'microphone'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Mic className="w-4 h-4 inline mr-1" />
          麦克风
        </button>
        
        <button
          onClick={captureSystemAudio}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            audioSource === 'system'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Headphones className="w-4 h-4 inline mr-1" />
          系统音频
        </button>
      </div>

      {/* 主控制按钮 */}
      <div className="flex items-center justify-center mb-6">
        <button
          onClick={toggleListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
          }`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* 状态指示 */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-400">
          {isListening ? '正在监听...' : '点击开始语音识别'}
          {isTranslating && ' • 翻译中...'}
        </p>
      </div>

      {/* 文本显示区域 */}
      <div className="space-y-4">
        {/* 原文 */}
        {currentText && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase">原文</span>
              <span className="text-xs text-gray-500">
                {sourceLanguage === 'auto' ? '自动检测' : sourceLanguage}
              </span>
            </div>
            <p className="text-white">{currentText}</p>
          </div>
        )}

        {/* 译文 */}
        {translatedText && (
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase">译文</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{targetLanguage}</span>
                <button
                  onClick={playTranslation}
                  className="p-1 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                  title="播放翻译"
                >
                  <Play className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
            <p className="text-white">{translatedText}</p>
          </div>
        )}
      </div>

      {/* 设置控制 */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">音量</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">语速</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTranslator;

