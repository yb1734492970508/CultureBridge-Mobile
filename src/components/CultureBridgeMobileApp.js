import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const { width, height } = Dimensions.get('window');

// 设计系统颜色
const colors = {
  primary: '#4A90E2',
  secondary: '#7BB3F0',
  green: '#6BCF7F',
  lightGreen: '#A8E6CF',
  cream: '#F8F6F0',
  gray: '#E8E6E0',
  coral: '#FF6B6B',
  gold: '#FFD93D',
  white: '#FFFFFF',
  black: '#1F2937',
  textGray: '#6B7280'
};

// 多语言支持
const translations = {
  zh: {
    appName: 'CultureBridge',
    welcome: '欢迎来到文化桥梁',
    subtitle: '连接世界，分享文化',
    startChatting: '开始聊天',
    joinCommunity: '加入社区',
    realTimeTranslation: '实时翻译',
    culturalExchange: '文化交流',
    globalCommunity: '全球社区',
    home: '首页',
    chat: '聊天',
    translate: '翻译',
    community: '社区',
    profile: '个人',
    hello: '你好！',
    howAreYou: '你好吗？',
    translated: '翻译：',
    voiceMessage: '语音消息',
    culturalTip: '文化交流提示：',
    askAboutTraditions: '询问其他国家的传统节日！',
    activeUsers: '活跃用户',
    countries: '国家覆盖',
    languages: '支持语言',
    satisfaction: '用户满意度',
    login: '登录',
    register: '注册',
    email: '邮箱',
    password: '密码',
    username: '用户名',
    settings: '设置',
    notifications: '通知',
    language: '语言',
    privacy: '隐私',
    about: '关于',
    logout: '退出登录'
  },
  en: {
    appName: 'CultureBridge',
    welcome: 'Welcome to CultureBridge',
    subtitle: 'Connect Cultures, Share Stories',
    startChatting: 'Start Chatting',
    joinCommunity: 'Join Community',
    realTimeTranslation: 'Real-time Translation',
    culturalExchange: 'Cultural Exchange',
    globalCommunity: 'Global Community',
    home: 'Home',
    chat: 'Chat',
    translate: 'Translate',
    community: 'Community',
    profile: 'Profile',
    hello: 'Hello!',
    howAreYou: 'How are you?',
    translated: 'Translated:',
    voiceMessage: 'Voice Message',
    culturalTip: 'Cultural exchange tip:',
    askAboutTraditions: 'Ask about traditional festivals in other countries!',
    activeUsers: 'Active Users',
    countries: 'Countries',
    languages: 'Languages',
    satisfaction: 'User Satisfaction',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    settings: 'Settings',
    notifications: 'Notifications',
    language: 'Language',
    privacy: 'Privacy',
    about: 'About',
    logout: 'Logout'
  }
};

// 主应用组件
const CultureBridgeMobileApp = () => {
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [currentTab, setCurrentTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[currentLanguage];

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 检测设备语言
      const deviceLanguage = Localization.locale.startsWith('zh') ? 'zh' : 'en';
      setCurrentLanguage(deviceLanguage);

      // 检查用户登录状态
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('初始化应用失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    setCurrentLanguage(newLanguage);
    AsyncStorage.setItem('language', newLanguage);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>CultureBridge</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} currentLanguage={currentLanguage} toggleLanguage={toggleLanguage} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />
      
      {/* 主内容区域 */}
      <View style={styles.content}>
        {currentTab === 'home' && <HomeScreen currentLanguage={currentLanguage} user={user} />}
        {currentTab === 'chat' && <ChatScreen currentLanguage={currentLanguage} user={user} />}
        {currentTab === 'translate' && <TranslateScreen currentLanguage={currentLanguage} />}
        {currentTab === 'community' && <CommunityScreen currentLanguage={currentLanguage} />}
        {currentTab === 'profile' && <ProfileScreen currentLanguage={currentLanguage} user={user} onLogout={() => setUser(null)} toggleLanguage={toggleLanguage} />}
      </View>

      {/* 底部导航 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, currentTab === 'home' && styles.activeNavItem]}
          onPress={() => setCurrentTab('home')}
        >
          <Ionicons 
            name={currentTab === 'home' ? 'home' : 'home-outline'} 
            size={24} 
            color={currentTab === 'home' ? colors.primary : colors.textGray} 
          />
          <Text style={[styles.navText, currentTab === 'home' && styles.activeNavText]}>
            {t.home}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, currentTab === 'chat' && styles.activeNavItem]}
          onPress={() => setCurrentTab('chat')}
        >
          <Ionicons 
            name={currentTab === 'chat' ? 'chatbubbles' : 'chatbubbles-outline'} 
            size={24} 
            color={currentTab === 'chat' ? colors.primary : colors.textGray} 
          />
          <Text style={[styles.navText, currentTab === 'chat' && styles.activeNavText]}>
            {t.chat}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, currentTab === 'translate' && styles.activeNavItem]}
          onPress={() => setCurrentTab('translate')}
        >
          <Ionicons 
            name={currentTab === 'translate' ? 'language' : 'language-outline'} 
            size={24} 
            color={currentTab === 'translate' ? colors.primary : colors.textGray} 
          />
          <Text style={[styles.navText, currentTab === 'translate' && styles.activeNavText]}>
            {t.translate}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, currentTab === 'community' && styles.activeNavItem]}
          onPress={() => setCurrentTab('community')}
        >
          <Ionicons 
            name={currentTab === 'community' ? 'people' : 'people-outline'} 
            size={24} 
            color={currentTab === 'community' ? colors.primary : colors.textGray} 
          />
          <Text style={[styles.navText, currentTab === 'community' && styles.activeNavText]}>
            {t.community}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, currentTab === 'profile' && styles.activeNavItem]}
          onPress={() => setCurrentTab('profile')}
        >
          <Ionicons 
            name={currentTab === 'profile' ? 'person' : 'person-outline'} 
            size={24} 
            color={currentTab === 'profile' ? colors.primary : colors.textGray} 
          />
          <Text style={[styles.navText, currentTab === 'profile' && styles.activeNavText]}>
            {t.profile}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 登录屏幕组件
const LoginScreen = ({ onLogin, currentLanguage, toggleLanguage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');

  const t = translations[currentLanguage];

  const handleAuth = async () => {
    try {
      if (isRegister) {
        // 注册逻辑
        const userData = {
          id: Date.now().toString(),
          username,
          email,
          profile: {
            avatar: 'https://via.placeholder.com/100',
            location: '中国'
          }
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
      } else {
        // 登录逻辑
        const userData = {
          id: '1',
          username: 'demo_user',
          email,
          profile: {
            avatar: 'https://via.placeholder.com/100',
            location: '中国'
          }
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
      }
    } catch (error) {
      Alert.alert('错误', '登录失败，请重试');
    }
  };

  return (
    <LinearGradient colors={[colors.cream, colors.gray]} style={styles.container}>
      <View style={styles.loginContainer}>
        {/* 语言切换按钮 */}
        <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
          <Text style={styles.languageButtonText}>
            {currentLanguage === 'zh' ? 'EN' : '中文'}
          </Text>
        </TouchableOpacity>

        {/* Logo和标题 */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[colors.primary, colors.green]}
            style={styles.logo}
          >
            <Ionicons name="globe" size={40} color={colors.white} />
          </LinearGradient>
          <Text style={styles.appTitle}>{t.appName}</Text>
          <Text style={styles.appSubtitle}>{t.subtitle}</Text>
        </View>

        {/* 登录表单 */}
        <View style={styles.formContainer}>
          {isRegister && (
            <TextInput
              style={styles.input}
              placeholder={t.username}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder={t.email}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder={t.password}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <LinearGradient
              colors={[colors.primary, colors.green]}
              style={styles.authButtonGradient}
            >
              <Text style={styles.authButtonText}>
                {isRegister ? t.register : t.login}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchAuthMode}
            onPress={() => setIsRegister(!isRegister)}
          >
            <Text style={styles.switchAuthModeText}>
              {isRegister ? '已有账号？登录' : '没有账号？注册'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// 首页屏幕组件
const HomeScreen = ({ currentLanguage, user }) => {
  const t = translations[currentLanguage];

  const stats = [
    { icon: 'people', number: '2M+', label: t.activeUsers },
    { icon: 'globe', number: '150+', label: t.countries },
    { icon: 'language', number: '50+', label: t.languages },
    { icon: 'star', number: '98%', label: t.satisfaction }
  ];

  const features = [
    {
      icon: 'language',
      title: t.realTimeTranslation,
      description: '支持50+语言的即时翻译',
      color: colors.primary
    },
    {
      icon: 'people',
      title: t.culturalExchange,
      description: '与来自150+国家的用户交流',
      color: colors.green
    },
    {
      icon: 'globe',
      title: t.globalCommunity,
      description: '加入活跃的全球社区',
      color: colors.coral
    }
  ];

  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      {/* 欢迎区域 */}
      <LinearGradient colors={[colors.primary, colors.green]} style={styles.welcomeSection}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>{t.welcome}</Text>
          <Text style={styles.welcomeSubtitle}>{t.subtitle}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{t.startChatting}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{t.joinCommunity}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* 统计数据 */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Ionicons name={stat.icon} size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* 功能特色 */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>核心功能</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
              <Ionicons name={feature.icon} size={24} color={colors.white} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// 聊天屏幕组件
const ChatScreen = ({ currentLanguage, user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: translations[currentLanguage].hello,
      sender: 'other',
      timestamp: new Date(),
      translated: currentLanguage === 'zh' ? 'Hi!' : '你好！'
    },
    {
      id: 2,
      text: translations[currentLanguage].howAreYou,
      sender: 'me',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const t = translations[currentLanguage];

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputText,
        sender: 'me',
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  return (
    <View style={styles.chatContainer}>
      {/* 聊天头部 */}
      <View style={styles.chatHeader}>
        <View style={styles.chatUserInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.chatAvatar}
          />
          <View>
            <Text style={styles.chatUserName}>Maria Santos</Text>
            <Text style={styles.chatUserStatus}>在线</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.chatMenuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textGray} />
        </TouchableOpacity>
      </View>

      {/* 消息列表 */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageItem,
              message.sender === 'me' ? styles.myMessage : styles.otherMessage
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === 'me' ? styles.myMessageText : styles.otherMessageText
                ]}
              >
                {message.text}
              </Text>
              {message.translated && (
                <Text style={styles.translatedText}>
                  {t.translated} {message.translated}
                </Text>
              )}
            </View>
          </View>
        ))}

        {/* 文化交流提示 */}
        <View style={styles.culturalTip}>
          <Ionicons name="bulb" size={16} color={colors.gold} />
          <Text style={styles.culturalTipText}>
            {t.culturalTip} {t.askAboutTraditions}
          </Text>
        </View>
      </ScrollView>

      {/* 输入区域 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="输入消息..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.voiceButton}>
          <Ionicons name="mic" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <LinearGradient colors={[colors.primary, colors.green]} style={styles.sendButtonGradient}>
            <Ionicons name="send" size={20} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 翻译屏幕组件
const TranslateScreen = ({ currentLanguage }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('zh');
  const [targetLang, setTargetLang] = useState('en');

  const t = translations[currentLanguage];

  const handleTranslate = () => {
    // 模拟翻译
    const mockTranslations = {
      'zh-en': {
        '你好': 'Hello',
        '谢谢': 'Thank you',
        '再见': 'Goodbye'
      },
      'en-zh': {
        'Hello': '你好',
        'Thank you': '谢谢',
        'Goodbye': '再见'
      }
    };

    const key = `${sourceLang}-${targetLang}`;
    const translation = mockTranslations[key]?.[sourceText] || `[翻译] ${sourceText}`;
    setTranslatedText(translation);
  };

  return (
    <View style={styles.translateContainer}>
      <Text style={styles.screenTitle}>{t.realTimeTranslation}</Text>

      {/* 语言选择 */}
      <View style={styles.languageSelector}>
        <TouchableOpacity style={styles.languageOption}>
          <Text style={styles.languageText}>中文</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.swapButton}>
          <Ionicons name="swap-horizontal" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.languageOption}>
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
      </View>

      {/* 输入区域 */}
      <View style={styles.translateInputContainer}>
        <TextInput
          style={styles.translateInput}
          placeholder="输入要翻译的文本..."
          value={sourceText}
          onChangeText={setSourceText}
          multiline
        />
        <TouchableOpacity style={styles.translateButton} onPress={handleTranslate}>
          <LinearGradient colors={[colors.primary, colors.green]} style={styles.translateButtonGradient}>
            <Text style={styles.translateButtonText}>翻译</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 翻译结果 */}
      <View style={styles.translateResult}>
        <Text style={styles.translateResultText}>{translatedText}</Text>
      </View>

      {/* 语音翻译按钮 */}
      <TouchableOpacity style={styles.voiceTranslateButton}>
        <Ionicons name="mic" size={32} color={colors.white} />
        <Text style={styles.voiceTranslateText}>语音翻译</Text>
      </TouchableOpacity>
    </View>
  );
};

// 社区屏幕组件
const CommunityScreen = ({ currentLanguage }) => {
  const t = translations[currentLanguage];

  const posts = [
    {
      id: 1,
      author: 'Zhang Wei',
      avatar: 'https://via.placeholder.com/40',
      location: '北京, 中国',
      content: '今天是中国的春节，我想和大家分享一些传统习俗...',
      image: 'https://via.placeholder.com/300x200',
      likes: 24,
      comments: 8,
      time: '2小时前'
    },
    {
      id: 2,
      author: 'Maria Santos',
      avatar: 'https://via.placeholder.com/40',
      location: '马德里, 西班牙',
      content: 'Learning Mandarin has been an amazing journey! Here are some tips...',
      likes: 18,
      comments: 5,
      time: '4小时前'
    }
  ];

  return (
    <ScrollView style={styles.communityContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>{t.globalCommunity}</Text>

      {/* 发布按钮 */}
      <TouchableOpacity style={styles.createPostButton}>
        <LinearGradient colors={[colors.primary, colors.green]} style={styles.createPostGradient}>
          <Ionicons name="add" size={24} color={colors.white} />
          <Text style={styles.createPostText}>分享你的文化故事</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 帖子列表 */}
      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
            <View style={styles.postUserInfo}>
              <Text style={styles.postAuthor}>{post.author}</Text>
              <Text style={styles.postLocation}>{post.location}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
          </View>

          <Text style={styles.postContent}>{post.content}</Text>

          {post.image && (
            <Image source={{ uri: post.image }} style={styles.postImage} />
          )}

          <View style={styles.postActions}>
            <TouchableOpacity style={styles.postAction}>
              <Ionicons name="heart-outline" size={20} color={colors.textGray} />
              <Text style={styles.postActionText}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.textGray} />
              <Text style={styles.postActionText}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Ionicons name="share-outline" size={20} color={colors.textGray} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

// 个人资料屏幕组件
const ProfileScreen = ({ currentLanguage, user, onLogout, toggleLanguage }) => {
  const t = translations[currentLanguage];

  const menuItems = [
    { icon: 'notifications-outline', title: t.notifications, onPress: () => {} },
    { icon: 'language-outline', title: t.language, onPress: toggleLanguage },
    { icon: 'shield-outline', title: t.privacy, onPress: () => {} },
    { icon: 'information-circle-outline', title: t.about, onPress: () => {} },
    { icon: 'log-out-outline', title: t.logout, onPress: onLogout, isDestructive: true }
  ];

  return (
    <ScrollView style={styles.profileContainer} showsVerticalScrollIndicator={false}>
      {/* 用户信息 */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user.profile.avatar }}
          style={styles.profileAvatar}
        />
        <Text style={styles.profileName}>{user.username}</Text>
        <Text style={styles.profileLocation}>{user.profile.location}</Text>
        
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>编辑资料</Text>
        </TouchableOpacity>
      </View>

      {/* 统计信息 */}
      <View style={styles.profileStats}>
        <View style={styles.profileStatItem}>
          <Text style={styles.profileStatNumber}>156</Text>
          <Text style={styles.profileStatLabel}>好友</Text>
        </View>
        <View style={styles.profileStatItem}>
          <Text style={styles.profileStatNumber}>89</Text>
          <Text style={styles.profileStatLabel}>帖子</Text>
        </View>
        <View style={styles.profileStatItem}>
          <Text style={styles.profileStatNumber}>1.2K</Text>
          <Text style={styles.profileStatLabel}>积分</Text>
        </View>
      </View>

      {/* 菜单项 */}
      <View style={styles.profileMenu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.profileMenuItem}
            onPress={item.onPress}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={item.isDestructive ? colors.coral : colors.textGray}
            />
            <Text
              style={[
                styles.profileMenuText,
                item.isDestructive && { color: colors.coral }
              ]}
            >
              {item.title}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textGray} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  navText: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: 4,
  },
  activeNavText: {
    color: colors.primary,
    fontWeight: '600',
  },
  
  // 登录屏幕样式
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  languageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.textGray,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  authButton: {
    marginBottom: 16,
  },
  authButtonGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  authButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  switchAuthMode: {
    alignItems: 'center',
  },
  switchAuthModeText: {
    color: colors.primary,
    fontSize: 14,
  },

  // 首页样式
  screenContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  welcomeSection: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 32,
  },
  welcomeContent: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  primaryButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  secondaryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: 4,
    textAlign: 'center',
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textGray,
  },

  // 聊天样式
  chatContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  chatUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  chatUserStatus: {
    fontSize: 12,
    color: colors.green,
  },
  chatMenuButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageItem: {
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
  },
  otherMessageBubble: {
    backgroundColor: colors.white,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.black,
  },
  translatedText: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: 4,
    fontStyle: 'italic',
  },
  culturalTip: {
    flexDirection: 'row',
    backgroundColor: colors.gold + '20',
    borderRadius: 12,
    padding: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  culturalTipText: {
    fontSize: 14,
    color: colors.black,
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 翻译样式
  translateContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.cream,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 24,
    textAlign: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  languageOption: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  swapButton: {
    marginHorizontal: 16,
    padding: 8,
  },
  translateInputContainer: {
    marginBottom: 24,
  },
  translateInput: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 16,
  },
  translateButton: {
    alignSelf: 'center',
  },
  translateButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  translateButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  translateResult: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    marginBottom: 32,
  },
  translateResultText: {
    fontSize: 16,
    color: colors.black,
  },
  voiceTranslateButton: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  voiceTranslateText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // 社区样式
  communityContainer: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: 16,
  },
  createPostButton: {
    marginBottom: 20,
  },
  createPostGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  createPostText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  postCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  postLocation: {
    fontSize: 12,
    color: colors.textGray,
  },
  postTime: {
    fontSize: 12,
    color: colors.textGray,
  },
  postContent: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionText: {
    fontSize: 14,
    color: colors.textGray,
    marginLeft: 4,
  },

  // 个人资料样式
  profileContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.white,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    color: colors.white,
    fontWeight: '600',
  },
  profileStats: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginTop: 1,
    paddingVertical: 20,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  profileStatLabel: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: 4,
  },
  profileMenu: {
    backgroundColor: colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  profileMenuText: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    marginLeft: 16,
  },
});

export default CultureBridgeMobileApp;

