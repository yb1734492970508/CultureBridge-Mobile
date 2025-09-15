
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

import CourseScreen from '../screens/CourseScreen'; // Import the new CourseScreen

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
    call: '通话',
    courses: '课程' // Add translation for Courses
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
    call: 'Call',
    courses: 'Courses' // Add translation for Courses
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
        {currentTab === 'courses' && <CourseScreen currentLanguage={currentLanguage} user={user} />} {/* Add CourseScreen */}
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
          style={[styles.navItem, currentTab === 'courses' && styles.activeNavItem]} // Add Courses tab
          onPress={() => setCurrentTab('courses')}
        >
          <Ionicons 
            name={currentTab === 'courses' ? 'book' : 'book-outline'} // Use a suitable icon
            size={24} 
            color={currentTab === 'courses' ? colors.primary : colors.textGray} 
          />
          <Text style={[styles.navText, currentTab === 'courses' && styles.activeNavText]}>
            {t.courses}
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
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
            {item.translated && <Text style={styles.translatedText}>{t.translated} {item.translated}</Text>}
            <Text style={styles.timestamp}>{item.timestamp.toLocaleTimeString()}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Translate Screen Component (Placeholder)
const TranslateScreen = ({ currentLanguage }) => {
  const t = translations[currentLanguage];
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Translate</Text>
      <Text style={styles.placeholderText}>Translation feature coming soon!</Text>
    </View>
  );
};

// Community Screen Component (Placeholder)
const CommunityScreen = ({ currentLanguage }) => {
  const t = translations[currentLanguage];
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Community</Text>
      <Text style={styles.placeholderText}>Join our global community!</Text>
    </View>
  );
};

// Profile Screen Component (Placeholder)
const ProfileScreen = ({ currentLanguage, user, onLogout, toggleLanguage }) => {
  const t = translations[currentLanguage];
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Profile</Text>
      {user && <Text>Welcome, {user.username}!</Text>}
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>{t.logout}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
        <Text style={styles.languageButtonText}>{currentLanguage === 'zh' ? 'Switch to English' : '切换到中文'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Call Screen Component (Placeholder)
const CallScreen = ({ currentLanguage, user }) => {
  const t = translations[currentLanguage];
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Call</Text>
      <Text style={styles.placeholderText}>Voice and Video Call feature coming soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    height: 60,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0, // Adjust for iPhone X notch
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  activeNavItem: {
    // backgroundColor: colors.lightGreen, // Optional: highlight active tab background
  },
  navText: {
    fontSize: 10,
    color: colors.textGray,
    marginTop: 2,
  },
  activeNavText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  languageButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    borderRadius: 5,
    backgroundColor: colors.gray,
  },
  languageButtonText: {
    color: colors.black,
    fontWeight: 'bold',
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
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.black,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.textGray,
  },
  formContainer: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: colors.black,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  authButton: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  authButtonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  authButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchAuthMode: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchAuthModeText: {
    color: colors.primary,
    fontSize: 14,
  },
  // Home Screen Styles
  screenContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.textGray,
  },
  welcomeSection: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  primaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderColor: colors.white,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    marginVertical: 10,
    width: '45%', // Two items per row
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: 'center',
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textGray,
  },
  // Chat Screen Styles
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gray,
  },
  messageText: {
    color: colors.white,
  },
  translatedText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 5,
  },
  timestamp: {
    fontSize: 10,
    color: colors.white,
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: colors.coral,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: colors.white,
    textAlign: 'center',
  },
});

export default CultureBridgeMobileApp;


