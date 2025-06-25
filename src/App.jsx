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
  Compass
} from 'lucide-react';
import './App.css';

// 导入图片
import heroImage from './assets/hero-cultural-exchange.jpg';
import diversityImage from './assets/cultural-diversity.png';

// 高端浮动导航组件
const FloatingNavigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'discover', icon: Compass, label: '发现' },
    { id: 'translate', icon: Languages, label: '翻译' },
    { id: 'community', icon: Users, label: '社区' },
    { id: 'profile', icon: User, label: '我的' }
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
        {rightAction && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {rightAction}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// 高端首页组件
const PremiumHomePage = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('早安');
    else if (hour < 18) setGreeting('午安');
    else setGreeting('晚安');
  }, []);

  const quickActions = [
    { 
      icon: Languages, 
      label: '智能翻译', 
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      description: 'AI驱动的实时翻译'
    },
    { 
      icon: Camera, 
      label: '视觉识别', 
      gradient: 'from-green-400 via-blue-500 to-purple-600',
      description: '拍照即时翻译'
    },
    { 
      icon: Mic, 
      label: '语音交流', 
      gradient: 'from-purple-400 via-pink-500 to-red-500',
      description: '跨语言语音对话'
    },
    { 
      icon: Sparkles, 
      label: '文化探索', 
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      description: '发现世界文化之美'
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
                {greeting}，探索者
              </h2>
              <p className="text-gray-400">今天想要探索哪种文化？</p>
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
            <h3 className="text-xl font-bold text-white">热门趋势</h3>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <TrendingUp className="h-4 w-4 mr-1" />
                查看全部
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
            <h3 className="text-xl font-bold text-white">今日精选</h3>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              更多 <ArrowRight className="ml-1 h-4 w-4" />
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
      setTranslatedText(`Hello, World! Welcome to CultureBridge cultural exchange platform.`);
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
            placeholder="输入要翻译的文本..."
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
                语音
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                <Camera className="h-4 w-4 mr-2" />
                拍照
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
                  翻译中...
                </div>
              ) : (
                '翻译'
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
                <span className="text-green-400 font-medium">翻译完成</span>
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

// 高端社区页面组件
const PremiumCommunityPage = () => {
  const posts = [
    {
      id: 1,
      author: '文化探索者',
      avatar: '🌸',
      time: '2小时前',
      location: '东京',
      content: '今天在京都体验了正宗的茶道仪式，每一个细节都体现了日本文化的精髓。从茶具的摆放到动作的优雅，都让人感受到内心的宁静与美好。',
      images: [heroImage],
      likes: 1284,
      comments: 156,
      shares: 89,
      tags: ['日本文化', '茶道', '京都'],
      verified: true
    },
    {
      id: 2,
      author: '环球旅行家',
      avatar: '🌍',
      time: '5小时前',
      location: '巴黎',
      content: '在卢浮宫遇见了来自世界各地的艺术爱好者，我们用不同的语言交流着对美的理解。艺术真的是人类共同的语言。',
      images: [diversityImage],
      likes: 892,
      comments: 67,
      shares: 34,
      tags: ['艺术', '巴黎', '文化交流'],
      verified: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32">
      {/* 浮动发布按钮 */}
      <motion.div 
        className="fixed top-24 right-6 z-30"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.button
          className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-6 w-6 text-white" />
        </motion.button>
      </motion.div>

      <div className="px-6 space-y-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* 用户信息 */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl mr-3">
                    {post.avatar}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="text-white font-semibold mr-2">{post.author}</span>
                      {post.verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="mr-2">{post.location}</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </motion.button>
              </div>

              {/* 内容 */}
              <p className="text-gray-200 leading-relaxed mb-4">{post.content}</p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, tagIndex) => (
                  <motion.span
                    key={tagIndex}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-blue-300 text-sm border border-blue-500/30"
                    whileHover={{ scale: 1.05 }}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* 图片 */}
            {post.images && post.images.length > 0 && (
              <div className="relative">
                <img 
                  src={post.images[0]} 
                  alt="Post content"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}

            {/* 互动区域 */}
            <div className="p-6 pt-4">
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span className="font-medium">{post.likes}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">{post.comments}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full text-gray-300 hover:text-green-400 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="font-medium">{post.shares}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 高端发现页面组件
const PremiumDiscoverPage = () => {
  const categories = [
    { name: '传统艺术', icon: '🎨', gradient: 'from-red-500 to-pink-500', count: 1.2 },
    { name: '美食文化', icon: '🍜', gradient: 'from-orange-500 to-red-500', count: 2.1 },
    { name: '音乐舞蹈', icon: '🎵', gradient: 'from-purple-500 to-pink-500', count: 0.8 },
    { name: '建筑奇观', icon: '🏛️', gradient: 'from-blue-500 to-purple-500', count: 1.5 },
    { name: '节日庆典', icon: '🎉', gradient: 'from-green-500 to-blue-500', count: 0.9 },
    { name: '语言文字', icon: '📚', gradient: 'from-indigo-500 to-purple-500', count: 1.8 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32">
      <div className="px-6">
        {/* 搜索区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              placeholder="探索世界文化..."
              className="pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder-gray-400 rounded-2xl text-lg focus:border-blue-500/50 focus:ring-blue-500/20"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-y-0 right-2 flex items-center px-3"
            >
              <Filter className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
            </motion.button>
          </div>
        </motion.div>

        {/* 文化分类 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">文化探索</h3>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-6 h-32`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="text-3xl">{category.icon}</div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{category.name}</h4>
                      <p className="text-white/80 text-sm">{category.count}k 内容</p>
                    </div>
                  </div>
                  
                  {/* 悬浮效果 */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 热门推荐 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">热门推荐</h3>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              查看全部 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-48">
                <img 
                  src={heroImage} 
                  alt="Trending content"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500/90 text-white border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    热门
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-bold text-xl mb-2">
                    全球文化交流盛典
                  </h4>
                  <p className="text-gray-200 text-sm mb-3">
                    来自50个国家的文化使者齐聚一堂，分享各自独特的文化传统
                  </p>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="mr-4">2.1万观看</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>3小时前</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 高端个人资料页面组件
const PremiumProfilePage = () => {
  const userStats = [
    { label: '发布', value: 156, icon: '📝' },
    { label: '关注', value: 1284, icon: '👥' },
    { label: '粉丝', value: '12.5k', icon: '❤️' }
  ];

  const achievements = [
    { title: '文化探索者', description: '探索了20种不同文化', icon: '🌍', color: 'from-blue-500 to-purple-500' },
    { title: '语言大师', description: '掌握了8种语言', icon: '🗣️', color: 'from-green-500 to-blue-500' },
    { title: '社区贡献者', description: '获得1000+点赞', icon: '⭐', color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32">
      <div className="px-6">
        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            
            <motion.div
              className="relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🌟
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">文化探索大师</h2>
              <p className="text-gray-400 mb-6">连接世界，分享文化之美</p>
              
              {/* 统计数据 */}
              <div className="flex justify-center space-x-8 mb-6">
                {userStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                编辑资料
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* 成就展示 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">我的成就</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${achievement.color} p-4`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex items-center">
                  <div className="text-2xl mr-4">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{achievement.title}</h4>
                    <p className="text-white/80 text-sm">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 设置选项 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            {[
              { icon: Bookmark, label: '我的收藏', badge: '23' },
              { icon: Heart, label: '我的点赞', badge: null },
              { icon: Bell, label: '通知设置', badge: null },
              { icon: Settings, label: '账户设置', badge: null }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className={`flex items-center justify-between p-4 ${
                    index < 3 ? 'border-b border-white/10' : ''
                  } hover:bg-white/5 transition-colors cursor-pointer`}
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 text-gray-400 mr-4" />
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    {item.badge && (
                      <Badge variant="secondary" className="mr-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {item.badge}
                      </Badge>
                    )}
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 主应用组件
function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <PremiumHomePage />;
      case 'discover':
        return <PremiumDiscoverPage />;
      case 'translate':
        return <PremiumTranslatePage />;
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
        return '发现世界';
      case 'translate':
        return 'AI翻译';
      case 'community':
        return '文化社区';
      case 'profile':
        return '个人中心';
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

export default App;

