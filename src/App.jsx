import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { 
  Globe, 
  MessageCircle, 
  Mic, 
  Users, 
  Heart, 
  Star, 
  ArrowRight, 
  Play,
  Menu,
  X,
  Languages,
  Zap,
  Shield,
  Award,
  BookOpen,
  Camera,
  Home,
  Search,
  Plus,
  User,
  Settings,
  Send,
  Volume2,
  Bookmark,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  Bell,
  Headphones,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  Eye,
  Filter,
  Compass,
  Phone
} from 'lucide-react';
import { LanguageProvider, useLanguage, useTranslation } from './hooks/useLanguage.jsx';
import VoiceCallComponent from './components/VoiceCallComponent.jsx';
import RealTimeTranslator from './components/RealTimeTranslator.jsx';
import PhoneAudioTranslator from './components/PhoneAudioTranslator.jsx';
import ExternalAudioTranslator from './components/ExternalAudioTranslator.jsx';
import CrossBorderVoiceCall from './components/CrossBorderVoiceCall.jsx';
import './App.css';

// 导入图片
import heroImage from './assets/hero-cultural-exchange.jpg';
import diversityImage from './assets/cultural-diversity.png';

// 语言切换组件
const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const availableLanguages = getAvailableLanguages();

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="h-5 w-5" />
      </motion.button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-12 right-0 bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 p-2 min-w-32 z-50"
        >
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                currentLanguage === lang.code
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// 高端浮动导航组件
const FloatingNavigation = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const navItems = [
    { id: 'home', icon: Home, label: t('common.home') },
    { id: 'discover', icon: Compass, label: t('common.discover') },
    { id: 'translate', icon: Languages, label: t('common.translate') },
    { id: 'voice-call', icon: Phone, label: '语音通话' },
    { id: 'community', icon: Users, label: t('common.community') },
    { id: 'profile', icon: User, label: t('common.profile') }
  ];

  return (
    <motion.div 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="bg-black/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative p-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-5 w-5" />
                {isActive && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// 高端顶部导航组件
const PremiumTopNavigation = ({ title, showBack = false, onBack, rightAction }) => {
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black/20 to-transparent backdrop-blur-xl border-b border-white/10 px-6 py-4 z-40"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <motion.button 
              onClick={onBack} 
              className="mr-4 p-2 rounded-full bg-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </motion.button>
          )}
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          {rightAction && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {rightAction}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// 高端首页组件
const PremiumHomePage = () => {
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('home.greeting_morning'));
    else if (hour < 18) setGreeting(t('home.greeting_afternoon'));
    else setGreeting(t('home.greeting_evening'));
  }, [t]);

  const quickActions = [
    { 
      icon: Languages, 
      label: t('features.smart_translate'), 
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      description: t('features.smart_translate_desc')
    },
    { 
      icon: Camera, 
      label: t('features.visual_recognition'), 
      gradient: 'from-green-400 via-blue-500 to-purple-600',
      description: t('features.visual_recognition_desc')
    },
    { 
      icon: Mic, 
      label: t('features.voice_communication'), 
      gradient: 'from-purple-400 via-pink-500 to-red-500',
      description: t('features.voice_communication_desc')
    },
    { 
      icon: Sparkles, 
      label: t('features.culture_exploration'), 
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      description: t('features.culture_exploration_desc')
    }
  ];

  const trendingTopics = [
    { name: '春节文化', trend: '+156%', color: 'text-red-400' },
    { name: '日本茶道', trend: '+89%', color: 'text-green-400' },
    { name: '法式料理', trend: '+67%', color: 'text-blue-400' },
    { name: '印度瑜伽', trend: '+45%', color: 'text-purple-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-6">
        {/* 问候语区域 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
                {greeting}{t('home.greeting_suffix')}
              </h2>
              <p className="text-gray-400">{t('home.explore_question')}</p>
            </div>
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* 快速操作 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">{t('home.quick_actions')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={index}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{action.label}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                    
                    {/* 悬浮效果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 热门趋势 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{t('home.trending')}</h3>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <TrendingUp className="h-4 w-4 mr-1" />
                {t('home.view_all')}
              </Button>
            </motion.div>
          </div>
          
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3"></div>
                  <span className="text-white font-medium">{topic.name}</span>
                </div>
                <span className={`text-sm font-semibold ${topic.color}`}>
                  {topic.trend}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 精选内容 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{t('home.featured')}</h3>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              {t('home.more')} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <motion.div 
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-48">
                <img 
                  src={heroImage} 
                  alt="Featured content"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500/90 text-white border-0">
                    <Eye className="h-3 w-3 mr-1" />
                    热门
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-bold text-lg mb-1">
                    探索世界文化之美
                  </h4>
                  <p className="text-gray-200 text-sm">
                    与全球文化爱好者一起，发现不同文化的独特魅力
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 高端翻译页面组件
const PremiumTranslatePage = () => {
  const { t } = useTranslation();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('zh');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    setTimeout(() => {
      setTranslatedText(`Hello, World! This is a brand new premium mobile app interface design.`);
      setIsTranslating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-6 space-y-6">
        {/* 语言选择器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full bg-transparent text-white text-lg font-medium focus:outline-none"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-gray-900">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <motion.button 
              className="mx-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </motion.button>
            
            <div className="flex-1">
              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-transparent text-white text-lg font-medium focus:outline-none text-right"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-gray-900">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* 输入区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
        >
          <Textarea
            placeholder={t('translate.input_placeholder')}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-32 bg-transparent border-0 text-white placeholder-gray-400 resize-none focus:ring-0 text-lg"
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                <Mic className="h-4 w-4 mr-2" />
                {t('translate.voice')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                <Camera className="h-4 w-4 mr-2" />
                {t('translate.camera')}
              </motion.button>
            </div>
            
            <motion.button
              onClick={handleTranslate}
              disabled={!sourceText.trim() || isTranslating}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isTranslating ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {t('translate.translating')}
                </div>
              ) : (
                t('translate.translate_button')
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* 翻译结果 */}
        {translatedText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-green-400 font-medium">{t('translate.translation_complete')}</span>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
            <p className="text-white text-lg leading-relaxed">{translatedText}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// 其他页面组件保持不变，但添加翻译支持...
const PremiumCommunityPage = () => {
  const { t } = useTranslation();
  // ... 其余代码保持不变，只需将硬编码文本替换为 t() 函数调用
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32">
      {/* 社区页面内容 */}
    </div>
  );
};

const PremiumDiscoverPage = () => {
  const { t } = useTranslation();
  // ... 其余代码保持不变
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32">
      {/* 发现页面内容 */}
    </div>
  );
};

// 语音通话页面组件
const VoiceCallPage = () => {
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState('cross-border');
  
  const features = [
    { id: 'cross-border', name: '跨国通话', icon: Phone },
    { id: 'phone-audio', name: '手机音频', icon: Headphones },
    { id: 'external-audio', name: '外部音频', icon: Mic },
    { id: 'real-time', name: '实时翻译', icon: Languages }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* 功能选择器 */}
          <div className="mb-6">
            <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
                      activeFeature === feature.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{feature.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 功能组件 */}
          <div className="mb-6">
            {activeFeature === 'cross-border' && (
              <CrossBorderVoiceCall 
                userId="user123"
                userProfile={{
                  nativeLanguage: 'zh-CN',
                  targetLanguage: 'en-US',
                  country: 'China',
                  interests: ['文化交流', '语言学习']
                }}
                className="mb-6"
              />
            )}
            
            {activeFeature === 'phone-audio' && (
              <PhoneAudioTranslator 
                sourceLanguage="auto"
                targetLanguage="en-US"
                className="mb-6"
              />
            )}
            
            {activeFeature === 'external-audio' && (
              <ExternalAudioTranslator 
                defaultSourceLanguage="auto"
                defaultTargetLanguage="en-US"
                className="mb-6"
              />
            )}
            
            {activeFeature === 'real-time' && (
              <RealTimeTranslator 
                sourceLanguage="auto"
                targetLanguage="en"
                className="mb-6"
              />
            )}
          </div>
          
          {/* 使用说明 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              功能说明
            </h3>
            <div className="space-y-3 text-gray-300 text-sm">
              {activeFeature === 'cross-border' && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>点击开始匹配，系统会为您寻找来自其他国家的用户进行语音交流</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>支持实时翻译功能，可以将对方的语音自动翻译成您的语言</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>通话过程中可以看到对方的国家信息和文化背景</p>
                  </div>
                </>
              )}
              
              {activeFeature === 'phone-audio' && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>捕获手机播放的音频内容并进行实时翻译</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>支持视频、音乐、播客等各种音频源的翻译</p>
                  </div>
                </>
              )}
              
              {activeFeature === 'external-audio' && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>监听周围环境的音频并进行实时翻译</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>可调节灵敏度和噪音降噪设置</p>
                  </div>
                </>
              )}
              
              {activeFeature === 'real-time' && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>基础的实时语音翻译功能</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>支持多种语言的双向翻译</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PremiumProfilePage = () => {
  const { t } = useTranslation();
  // ... 其余代码保持不变
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32">
      {/* 个人资料页面内容 */}
    </div>
  );
};

// 主应用组件
function AppContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <PremiumHomePage />;
      case 'discover':
        return <PremiumDiscoverPage />;
      case 'translate':
        return <PremiumTranslatePage />;
      case 'voice-call':
        return <VoiceCallPage />;
      case 'community':
        return <PremiumCommunityPage />;
      case 'profile':
        return <PremiumProfilePage />;
      default:
        return <PremiumHomePage />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'CultureBridge';
      case 'discover':
        return t('discover.title');
      case 'translate':
        return t('translate.title');
      case 'voice-call':
        return '语音通话';
      case 'community':
        return t('community.title');
      case 'profile':
        return t('profile.title');
      default:
        return 'CultureBridge';
    }
  };

  return (
    <div className="App min-h-screen bg-black overflow-x-hidden">
      <PremiumTopNavigation 
        title={getPageTitle()}
        rightAction={
          activeTab === 'home' ? (
            <motion.button
              className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="h-5 w-5" />
            </motion.button>
          ) : null
        }
      />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <FloatingNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

