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
import io from 'socket.io-client';

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
    logout: '退出登录',
    call: '通话'
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
    logout: 'Logout',
    call: 'Call'
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
        {currentTab === 'call' && <CallScreen currentLanguage={currentLanguage} user={user} />}
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
          style={[styles.navItem, currentTab === 'call' && styles.activeNavItem]}
          onPress={() => setCurrentTab('call')}
        >
          <Ionicons 
            name={currentTab === 'call' ? 'call' : 'call-outline'} 
            size={24} 
            color={currentTab === 'call' ? colors.primary : colors.textGray} 
          />
          <Text style={[styles.navText, currentTab === 'call' && styles.activeNavText]}>
            {t.call}
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
                  message.sender === 'me' ? styles.myMessageText : null
                ]}
              >
                {message.text}
              </Text>
              {message.translated && (
                <Text
                  style={[
                    styles.messageText,
                    styles.messageTranslatedText,
                    message.sender === 'me' ? styles.myMessageText : null
                  ]}
                >
                  {t.translated} {message.translated}
                </Text>
              )}
              <Text style={styles.messageTimestamp}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 消息输入 */}
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatTextInput}
          placeholder={t.voiceMessage}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 社区屏幕组件
const CommunityScreen = ({ currentLanguage }) => {
  const t = translations[currentLanguage];

  const communities = [
    {
      id: 1,
      name: 'Spanish Learners',
      description: 'Join us to practice Spanish and learn about Hispanic cultures.',
    },
    {
      id: 2,
      name: 'Japanese Culture',
      description: 'Explore the rich traditions and modern trends of Japan.',
    },
    {
      id: 3,
      name: 'French Foodies',
      description: 'Discuss French cuisine, recipes, and culinary traditions.',
    },
  ];

  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.communityContainer}>
        <Text style={styles.sectionTitle}>社区</Text>
        {communities.map((community) => (
          <View key={community.id} style={styles.communityCard}>
            <Text style={styles.communityTitle}>{community.name}</Text>
            <Text style={styles.communityDescription}>{community.description}</Text>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>加入</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.communityCard}>
          <Text style={styles.culturalTip}>{t.culturalTip}</Text>
          <Text style={styles.culturalTipText}>{t.askAboutTraditions}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// 个人资料屏幕组件
const ProfileScreen = ({ currentLanguage, user, onLogout, toggleLanguage }) => {
  const t = translations[currentLanguage];

  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.profileContainer}>
        {/* 个人资料头部 */}
        <LinearGradient colors={[colors.primary, colors.green]} style={styles.profileHeader}>
          <Image
            source={{ uri: user.profile.avatar }}
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>{user.username}</Text>
          <Text style={styles.profileUsername}>{user.email}</Text>
          <View style={styles.profileStats}>
            <View style={styles.profileStatItem}>
              <Text style={styles.profileStatNumber}>1200</Text>
              <Text style={styles.profileStatLabel}>积分</Text>
            </View>
            <View style={styles.profileStatItem}>
              <Text style={styles.profileStatNumber}>15</Text>
              <Text style={styles.profileStatLabel}>连胜</Text>
            </View>
            <View style={styles.profileStatItem}>
              <Text style={styles.profileStatNumber}>8</Text>
              <Text style={styles.profileStatLabel}>成就</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 设置选项 */}
        <View style={styles.profileSection}>
          <Text style={styles.profileSectionTitle}>{t.settings}</Text>
          <TouchableOpacity style={styles.profileOption}>
            <Ionicons name="notifications-outline" size={20} color={colors.textGray} />
            <Text style={styles.profileOptionText}>{t.notifications}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileOption} onPress={toggleLanguage}>
            <Ionicons name="language-outline" size={20} color={colors.textGray} />
            <Text style={styles.profileOptionText}>{t.language}</Text>
            <Text style={styles.profileOptionValue}>{currentLanguage === 'zh' ? '中文' : 'English'}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileOption}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textGray} />
            <Text style={styles.profileOptionText}>{t.privacy}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileOption}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textGray} />
            <Text style={styles.profileOptionText}>{t.about}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textGray} />
          </TouchableOpacity>
        </View>

        {/* 退出登录按钮 */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>{t.logout}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// 翻译屏幕组件
const TranslateScreen = ({ currentLanguage }) => {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("zh");
  const [audioContent, setAudioContent] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const [audioData, setAudioData] = useState("");
  const [translatedExternalAudioText, setTranslatedExternalAudioText] = useState("");

  const t = translations[currentLanguage];

  const handleTranslateMobileContent = async () => {
    if (!audioContent) {
      Alert.alert("错误", "请输入要翻译的音频内容");
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch("http://localhost:5000/api/translate/mobile-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioContent,
          sourceLanguage,
          targetLanguage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTranslatedText(data.translatedText);
      } else {
        Alert.alert("翻译失败", data.error || "未知错误");
      }
    } catch (error) {
      console.error("Error translating mobile content:", error);
      Alert.alert("网络错误", "无法连接到翻译服务");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateExternalAudio = async () => {
    if (!audioData) {
      Alert.alert("错误", "请输入要翻译的外部音频数据");
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch("http://localhost:5000/api/translate/external-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioData,
          sourceLanguage,
          targetLanguage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTranslatedExternalAudioText(data.translatedText);
      } else {
        Alert.alert("翻译失败", data.error || "未知错误");
      }
    } catch (error) {
      console.error("Error translating external audio:", error);
      Alert.alert("网络错误", "无法连接到翻译服务");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>手机播放内容实时翻译</Text>
        <TextInput
          style={styles.input}
          placeholder="输入模拟音频内容 (例如: Hello World)"
          value={audioContent}
          onChangeText={setAudioContent}
        />
        <View style={styles.languageSelectorContainer}>
          <TextInput
            style={styles.languageInput}
            placeholder="源语言 (例如: en)"
            value={sourceLanguage}
            onChangeText={setSourceLanguage}
          />
          <Ionicons name="arrow-forward" size={24} color={colors.textGray} style={styles.languageArrow} />
          <TextInput
            style={styles.languageInput}
            placeholder="目标语言 (例如: zh)"
            value={targetLanguage}
            onChangeText={setTargetLanguage}
          />
        </View>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleTranslateMobileContent}
          disabled={isTranslating}
        >
          <Text style={styles.primaryButtonText}>
            {isTranslating ? "翻译中..." : "开始翻译"}
          </Text>
        </TouchableOpacity>
        {translatedText ? (
          <View style={styles.translationResultContainer}>
            <Text style={styles.translationResultLabel}>翻译结果:</Text>
            <Text style={styles.translationResultText}>{translatedText}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>外部音频实时翻译</Text>
        <TextInput
          style={styles.input}
          placeholder="输入模拟外部音频数据 (例如: Environmental sound)"
          value={audioData}
          onChangeText={setAudioData}
        />
        <View style={styles.languageSelectorContainer}>
          <TextInput
            style={styles.languageInput}
            placeholder="源语言 (例如: en)"
            value={sourceLanguage}
            onChangeText={setSourceLanguage}
          />
          <Ionicons name="arrow-forward" size={24} color={colors.textGray} style={styles.languageArrow} />
          <TextInput
            style={styles.languageInput}
            placeholder="目标语言 (例如: zh)"
            value={targetLanguage}
            onChangeText={setTargetLanguage}
          />
        </View>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleTranslateExternalAudio}
          disabled={isTranslating}
        >
          <Text style={styles.primaryButtonText}>
            {isTranslating ? "翻译中..." : "开始翻译"}
          </Text>
        </TouchableOpacity>
        {translatedExternalAudioText ? (
          <View style={styles.translationResultContainer}>
            <Text style={styles.translationResultLabel}>翻译结果:</Text>
            <Text style={styles.translationResultText}>{translatedExternalAudioText}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

// 语音通话屏幕组件
const CallScreen = ({ currentLanguage, user }) => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [callId, setCallId] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [socket, setSocket] = useState(null);

  const t = translations[currentLanguage];

  useEffect(() => {
    if (inCall && callId) {
      // 连接Socket.IO
      const newSocket = io("http://localhost:5000"); // 连接到后端Socket.IO
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected for call:", newSocket.id);
        newSocket.emit("join_call", callId);
      });

      newSocket.on("user_joined_call", (userId) => {
        console.log(`User ${userId} joined the call`);
        // 这里可以添加UI更新，例如显示通话中的用户列表
      });

      newSocket.on("user_left_call", (userId) => {
        console.log(`User ${userId} left the call`);
        // 这里可以添加UI更新
      });

      newSocket.on("receive_audio", (audioChunk) => {
        console.log("Received audio chunk:", audioChunk);
        // 在这里处理接收到的音频数据，例如播放或翻译
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected from call");
        setInCall(false);
        setMatchedUser(null);
        setCallId(null);
      });

      return () => {
        newSocket.emit("leave_call", callId);
        newSocket.disconnect();
      };
    }
  }, [inCall, callId]);

  const handleMatchCall = async () => {
    setIsMatching(true);
    try {
      const response = await fetch("http://localhost:5000/api/call/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          language: currentLanguage,
          country: user.profile.location, // 假设用户资料中有国家信息
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMatchedUser(data.matchedUser);
        setCallId(data.callId);
        setInCall(true);
        Alert.alert("匹配成功", `已匹配到用户: ${data.matchedUser.name}`);
      } else {
        Alert.alert("匹配失败", data.error || "未知错误");
      }
    } catch (error) {
      console.error("Error matching for call:", error);
      Alert.alert("网络错误", "无法连接到匹配服务");
    } finally {
      setIsMatching(false);
    }
  };

  const handleEndCall = () => {
    if (socket) {
      socket.emit("leave_call", callId);
      socket.disconnect();
    }
    setInCall(false);
    setMatchedUser(null);
    setCallId(null);
  };

  const handleSendAudio = () => {
    if (socket && inCall && callId) {
      // 模拟发送音频数据
      const audioChunk = "模拟音频数据";
      socket.emit("send_audio", { callId, audioChunk });
      console.log("Sending audio chunk...");
    }
  };

  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>跨国语音通话匹配</Text>
        {!inCall ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleMatchCall}
            disabled={isMatching}
          >
            <Text style={styles.primaryButtonText}>
              {isMatching ? "匹配中..." : "开始匹配通话"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.callControls}>
            <Text style={styles.callStatusText}>通话中...</Text>
            {matchedUser && (
              <Text style={styles.matchedUserText}>已连接: {matchedUser.name}</Text>
            )}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSendAudio}
            >
              <Text style={styles.secondaryButtonText}>发送模拟音频</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton} // 复用logoutButton样式作为结束通话按钮
              onPress={handleEndCall}
            >
              <Text style={styles.logoutButtonText}>结束通话</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// CommunityScreen, ProfileScreen, etc. (保持不变)

// 样式 (添加到现有样式中)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 10, // Adjust for iPhone X series bottom safe area
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  activeNavItem: {
    // backgroundColor: colors.gray, // Optional: highlight active tab background
  },
  navText: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: 4,
  },
  activeNavText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  // LoginScreen Styles
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  languageButton: {
    position: "absolute",
    top: StatusBar.currentHeight + 10 || 40,
    right: 20,
    padding: 8,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  languageButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.black,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.textGray,
    marginTop: 5,
  },
  formContainer: {
    width: "100%",
    maxWidth: 300,
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  authButton: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  authButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  authButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  switchAuthMode: {
    marginTop: 20,
    alignSelf: "center",
  },
  switchAuthModeText: {
    color: colors.primary,
    fontSize: 14,
  },
  // HomeScreen Styles
  screenContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  welcomeSection: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },
  welcomeContent: {
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  primaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statItem: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: "45%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.black,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: "center",
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 15,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textGray,
  },
  // ChatScreen Styles
  chatContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    backgroundColor: colors.white,
  },
  chatUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  chatUserStatus: {
    fontSize: 12,
    color: colors.green,
  },
  chatMenuButton: {
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "80%",
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  messageText: {
    fontSize: 16,
    color: colors.black,
  },
  myMessageText: {
    color: colors.white,
  },
  messageTimestamp: {
    fontSize: 10,
    color: colors.textGray,
    marginTop: 5,
    alignSelf: "flex-end",
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    backgroundColor: colors.white,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  // TranslateScreen Styles
  languageSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  languageInput: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  languageArrow: {
    marginHorizontal: 10,
  },
  translationResultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  translationResultLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 5,
  },
  translationResultText: {
    fontSize: 16,
    color: colors.textGray,
  },
  // CommunityScreen Styles
  communityContainer: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: 20,
  },
  communityCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 10,
  },
  communityDescription: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: colors.green,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  joinButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  // ProfileScreen Styles
  profileContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 5,
  },
  profileUsername: {
    fontSize: 16,
    color: colors.textGray,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  profileStatItem: {
    alignItems: "center",
  },
  profileStatNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  profileStatLabel: {
    fontSize: 12,
    color: colors.textGray,
  },
  profileSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 10,
  },
  profileOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  profileOptionText: {
    fontSize: 16,
    color: colors.black,
    marginLeft: 10,
    flex: 1,
  },
  profileOptionValue: {
    fontSize: 16,
    color: colors.textGray,
  },
  logoutButton: {
    backgroundColor: colors.coral,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  // CallScreen Styles
  callControls: {
    marginTop: 20,
    alignItems: "center",
  },
  callStatusText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  matchedUserText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default CultureBridgeMobileApp;


