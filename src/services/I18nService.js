<<<<<<< HEAD
// I18n Service for CultureBridge Mobile App
// 多语言国际化服务

class I18nService {
  constructor() {
    this.currentLanguage = 'zh-CN'; // 默认中文
    this.fallbackLanguage = 'en';
    this.translations = {};
    this.loadTranslations();
  }

  // 加载翻译文件
  loadTranslations() {
    this.translations = {
      'zh-CN': {
        // 通用
        common: {
          loading: '加载中...',
          error: '出错了',
          success: '成功',
          cancel: '取消',
          confirm: '确认',
          save: '保存',
          delete: '删除',
          edit: '编辑',
          back: '返回',
          next: '下一步',
          previous: '上一步',
          finish: '完成',
          retry: '重试',
          refresh: '刷新'
        },
        
        // 导航
        navigation: {
          home: '首页',
          chat: '聊天',
          learning: '学习',
          community: '社区',
          profile: '我的'
        },
        
        // 首页
        home: {
          welcome: '欢迎回来！',
          welcomeSubtext: '继续你的文化探索之旅',
          exploreFeatures: '探索功能',
          culturalSpotlights: '文化聚焦',
          quickActions: '快速操作',
          seeAll: '查看全部',
          startChat: '开始聊天',
          learningCourse: '学习课程',
          voiceTranslation: '语音翻译',
          points: '积分',
          streak: '连续天数',
          friends: '好友',
          participants: '参与者'
        },
        
        // 功能模块
        features: {
          culturalExploration: '文化探索',
          culturalExplorationSub: '发现世界文化',
          languageExchange: '语言交流',
          languageExchangeSub: '实时对话练习',
          globalCommunity: '全球社区',
          globalCommunitySub: '连接世界朋友',
          smartLearning: '智能学习',
          smartLearningSub: 'AI个性化课程'
        },
        
        // 认证
        auth: {
          login: '登录',
          register: '注册',
          email: '邮箱',
          password: '密码',
          confirmPassword: '确认密码',
          username: '用户名',
          forgotPassword: '忘记密码？',
          orLoginWith: '或使用以下方式登录',
          alreadyHaveAccount: '已有账户？',
          noAccount: '还没有账户？',
          welcome: '欢迎回来',
          createAccount: '创建账户',
          joinCommunity: '加入全球文化社区'
        },
        
        // 聊天
        chat: {
          typeMessage: '输入消息...',
          send: '发送',
          online: '在线',
          offline: '离线',
          typing: '正在输入...',
          translate: '翻译',
          voiceMessage: '语音消息',
          imageMessage: '图片消息',
          fileMessage: '文件消息'
        },
        
        // 学习
        learning: {
          courses: '课程',
          progress: '进度',
          achievements: '成就',
          level: '等级',
          beginner: '初级',
          intermediate: '中级',
          advanced: '高级',
          native: '母语',
          startLearning: '开始学习',
          continueLearning: '继续学习',
          completed: '已完成',
          inProgress: '进行中'
        },
        
        // 社区
        community: {
          posts: '动态',
          groups: '群组',
          events: '活动',
          trending: '热门',
          latest: '最新',
          popular: '热门',
          joinGroup: '加入群组',
          createPost: '发布动态',
          like: '点赞',
          comment: '评论',
          share: '分享'
        },
        
        // 个人资料
        profile: {
          editProfile: '编辑资料',
          settings: '设置',
          language: '语言',
          notifications: '通知',
          privacy: '隐私',
          help: '帮助',
          about: '关于',
          logout: '退出登录',
          myPosts: '我的动态',
          myGroups: '我的群组',
          achievements: '我的成就'
        }
      },
      
      'en': {
        // Common
        common: {
          loading: 'Loading...',
          error: 'Error',
          success: 'Success',
          cancel: 'Cancel',
          confirm: 'Confirm',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          back: 'Back',
          next: 'Next',
          previous: 'Previous',
          finish: 'Finish',
          retry: 'Retry',
          refresh: 'Refresh'
        },
        
        // Navigation
        navigation: {
          home: 'Home',
          chat: 'Chat',
          learning: 'Learning',
          community: 'Community',
          profile: 'Profile'
        },
        
        // Home
        home: {
          welcome: 'Welcome Back!',
          welcomeSubtext: 'Continue your cultural exploration journey',
          exploreFeatures: 'Explore Features',
          culturalSpotlights: 'Cultural Spotlights',
          quickActions: 'Quick Actions',
          seeAll: 'See All',
          startChat: 'Start Chat',
          learningCourse: 'Learning Course',
          voiceTranslation: 'Voice Translation',
          points: 'Points',
          streak: 'Streak',
          friends: 'Friends',
          participants: 'Participants'
        },
        
        // Features
        features: {
          culturalExploration: 'Cultural Exploration',
          culturalExplorationSub: 'Discover World Cultures',
          languageExchange: 'Language Exchange',
          languageExchangeSub: 'Real-time Conversation Practice',
          globalCommunity: 'Global Community',
          globalCommunitySub: 'Connect with World Friends',
          smartLearning: 'Smart Learning',
          smartLearningSub: 'AI Personalized Courses'
        },
        
        // Auth
        auth: {
          login: 'Login',
          register: 'Register',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          username: 'Username',
          forgotPassword: 'Forgot Password?',
          orLoginWith: 'Or login with',
          alreadyHaveAccount: 'Already have an account?',
          noAccount: "Don't have an account?",
          welcome: 'Welcome Back',
          createAccount: 'Create Account',
          joinCommunity: 'Join Global Cultural Community'
        },
        
        // Chat
        chat: {
          typeMessage: 'Type a message...',
          send: 'Send',
          online: 'Online',
          offline: 'Offline',
          typing: 'Typing...',
          translate: 'Translate',
          voiceMessage: 'Voice Message',
          imageMessage: 'Image Message',
          fileMessage: 'File Message'
        },
        
        // Learning
        learning: {
          courses: 'Courses',
          progress: 'Progress',
          achievements: 'Achievements',
          level: 'Level',
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced',
          native: 'Native',
          startLearning: 'Start Learning',
          continueLearning: 'Continue Learning',
          completed: 'Completed',
          inProgress: 'In Progress'
        },
        
        // Community
        community: {
          posts: 'Posts',
          groups: 'Groups',
          events: 'Events',
          trending: 'Trending',
          latest: 'Latest',
          popular: 'Popular',
          joinGroup: 'Join Group',
          createPost: 'Create Post',
          like: 'Like',
          comment: 'Comment',
          share: 'Share'
        },
        
        // Profile
        profile: {
          editProfile: 'Edit Profile',
          settings: 'Settings',
          language: 'Language',
          notifications: 'Notifications',
          privacy: 'Privacy',
          help: 'Help',
          about: 'About',
          logout: 'Logout',
          myPosts: 'My Posts',
          myGroups: 'My Groups',
          achievements: 'My Achievements'
        }
      }
    };
  }

  // 获取当前语言
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // 设置语言
  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      return true;
    }
    return false;
  }

  // 获取翻译文本
  t(key, params = {}) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    // 遍历键路径
    for (const k of keys) {
      if (translation && typeof translation === 'object' && translation[k]) {
        translation = translation[k];
      } else {
        // 如果当前语言没有找到，尝试回退语言
        translation = this.translations[this.fallbackLanguage];
        for (const fallbackKey of keys) {
          if (translation && typeof translation === 'object' && translation[fallbackKey]) {
            translation = translation[fallbackKey];
          } else {
            return key; // 如果都没找到，返回原始键
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 翻译数据
const translations = {
  'zh-CN': {
    nav: {
      home: '首页',
      chat: '聊天',
      learning: '学习',
      profile: '我的'
    },
    auth: {
      login: '登录',
      register: '注册',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      forgotPassword: '忘记密码？',
      loginButton: '登录',
      registerButton: '注册',
      orLoginWith: '或使用以下方式登录',
      alreadyHaveAccount: '已有账号？',
      noAccount: '没有账号？',
      welcome: '欢迎回来',
      createAccount: '创建账号',
      joinCommunity: '加入全球文化社区'
    },
    home: {
      welcome: '欢迎来到CultureBridge',
      subtitle: '连接世界文化的桥梁',
      exploreButton: '开始探索',
      featuredCultures: '精选文化',
      recentActivities: '最近活动',
      trendingTopics: '热门话题'
    },
    chat: {
      title: '聊天',
      searchPlaceholder: '搜索对话...',
      noMessages: '暂无消息',
      typeMessage: '输入消息...',
      send: '发送'
    },
    learning: {
      title: '语言学习',
      myProgress: '我的进度',
      recommendedCourses: '推荐课程',
      practiceToday: '今日练习',
      achievements: '成就',
      continue: '继续学习',
      startLearning: '开始学习'
    },
    profile: {
      title: '个人资料',
      editProfile: '编辑资料',
      settings: '设置',
      language: '语言',
      notifications: '通知',
      privacy: '隐私',
      help: '帮助',
      about: '关于',
      logout: '退出登录',
      myStats: '我的统计',
      postsCount: '帖子数',
      followersCount: '关注者',
      followingCount: '关注中'
    },
    common: {
      loading: '加载中...',
      error: '出错了',
      retry: '重试',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      share: '分享',
      like: '点赞',
      comment: '评论',
      follow: '关注',
      unfollow: '取消关注'
    }
  },
  'en-US': {
    nav: {
      home: 'Home',
      chat: 'Chat',
      learning: 'Learning',
      profile: 'Profile'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      loginButton: 'Login',
      registerButton: 'Register',
      orLoginWith: 'Or login with',
      alreadyHaveAccount: 'Already have an account?',
      noAccount: 'Don\\'t have an account?',
      welcome: 'Welcome Back',
      createAccount: 'Create Account',
      joinCommunity: 'Join Global Cultural Community'
    },
    home: {
      welcome: 'Welcome to CultureBridge',
      subtitle: 'Bridge Cultures, Connect Hearts',
      exploreButton: 'Start Exploring',
      featuredCultures: 'Featured Cultures',
      recentActivities: 'Recent Activities',
      trendingTopics: 'Trending Topics'
    },
    chat: {
      title: 'Chat',
      searchPlaceholder: 'Search conversations...',
      noMessages: 'No messages yet',
      typeMessage: 'Type a message...',
      send: 'Send'
    },
    learning: {
      title: 'Language Learning',
      myProgress: 'My Progress',
      recommendedCourses: 'Recommended Courses',
      practiceToday: 'Practice Today',
      achievements: 'Achievements',
      continue: 'Continue Learning',
      startLearning: 'Start Learning'
    },
    profile: {
      title: 'Profile',
      editProfile: 'Edit Profile',
      settings: 'Settings',
      language: 'Language',
      notifications: 'Notifications',
      privacy: 'Privacy',
      help: 'Help',
      about: 'About',
      logout: 'Logout',
      myStats: 'My Stats',
      postsCount: 'Posts',
      followersCount: 'Followers',
      followingCount: 'Following'
    },
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Retry',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      share: 'Share',
      like: 'Like',
      comment: 'Comment',
      follow: 'Follow',
      unfollow: 'Unfollow'
    }
  },
  'es-ES': {
    nav: {
      home: 'Inicio',
      chat: 'Chat',
      learning: 'Aprender',
      profile: 'Perfil'
    },
    auth: {
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      email: 'Correo',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      loginButton: 'Iniciar Sesión',
      registerButton: 'Registrarse',
      orLoginWith: 'O inicia sesión con',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      noAccount: '¿No tienes una cuenta?',
      welcome: 'Bienvenido de Vuelta',
      createAccount: 'Crear Cuenta',
      joinCommunity: 'Únete a la Comunidad Cultural Global'
    },
    home: {
      welcome: 'Bienvenido a CultureBridge',
      subtitle: 'Conecta Culturas, Une Corazones',
      exploreButton: 'Comenzar a Explorar',
      featuredCultures: 'Culturas Destacadas',
      recentActivities: 'Actividades Recientes',
      trendingTopics: 'Temas Populares'
    },
    chat: {
      title: 'Chat',
      searchPlaceholder: 'Buscar conversaciones...',
      noMessages: 'Aún no hay mensajes',
      typeMessage: 'Escribe un mensaje...',
      send: 'Enviar'
    },
    learning: {
      title: 'Aprendizaje de Idiomas',
      myProgress: 'Mi Progreso',
      recommendedCourses: 'Cursos Recomendados',
      practiceToday: 'Práctica de Hoy',
      achievements: 'Logros',
      continue: 'Continuar Aprendiendo',
      startLearning: 'Comenzar a Aprender'
    },
    profile: {
      title: 'Perfil',
      editProfile: 'Editar Perfil',
      settings: 'Configuración',
      language: 'Idioma',
      notifications: 'Notificaciones',
      privacy: 'Privacidad',
      help: 'Ayuda',
      about: 'Acerca de',
      logout: 'Cerrar Sesión',
      myStats: 'Mis Estadísticas',
      postsCount: 'Publicaciones',
      followersCount: 'Seguidores',
      followingCount: 'Siguiendo'
    },
    common: {
      loading: 'Cargando...',
      error: 'Algo salió mal',
      retry: 'Reintentar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      share: 'Compartir',
      like: 'Me gusta',
      comment: 'Comentar',
      follow: 'Seguir',
      unfollow: 'Dejar de seguir'
    }
  },
  'fr-FR': {
    nav: {
      home: 'Accueil',
      chat: 'Chat',
      learning: 'Apprentissage',
      profile: 'Profil'
    },
    auth: {
      login: 'Se Connecter',
      register: 'S\\'inscrire',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      loginButton: 'Se Connecter',
      registerButton: 'S\\'inscrire',
      orLoginWith: 'Ou se connecter avec',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
      noAccount: 'Vous n\\'avez pas de compte?',
      welcome: 'Bon Retour',
      createAccount: 'Créer un Compte',
      joinCommunity: 'Rejoindre la Communauté Culturelle Mondiale'
    },
    home: {
      welcome: 'Bienvenue sur CultureBridge',
      subtitle: 'Connecter les Cultures, Unir les Cœurs',
      exploreButton: 'Commencer à Explorer',
      featuredCultures: 'Cultures en Vedette',
      recentActivities: 'Activités Récentes',
      trendingTopics: 'Sujets Tendance'
    },
    chat: {
      title: 'Chat',
      searchPlaceholder: 'Rechercher des conversations...',
      noMessages: 'Pas encore de messages',
      typeMessage: 'Tapez un message...',
      send: 'Envoyer'
    },
    learning: {
      title: 'Apprentissage des Langues',
      myProgress: 'Mon Progrès',
      recommendedCourses: 'Cours Recommandés',
      practiceToday: 'Pratique d\\'Aujourd\\'hui',
      achievements: 'Réalisations',
      continue: 'Continuer l\\'Apprentissage',
      startLearning: 'Commencer l\\'Apprentissage'
    },
    profile: {
      title: 'Profil',
      editProfile: 'Modifier le Profil',
      settings: 'Paramètres',
      language: 'Langue',
      notifications: 'Notifications',
      privacy: 'Confidentialité',
      help: 'Aide',
      about: 'À propos',
      logout: 'Se Déconnecter',
      myStats: 'Mes Statistiques',
      postsCount: 'Publications',
      followersCount: 'Abonnés',
      followingCount: 'Abonnements'
    },
    common: {
      loading: 'Chargement...',
      error: 'Quelque chose s\\'est mal passé',
      retry: 'Réessayer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Sauvegarder',
      edit: 'Modifier',
      delete: 'Supprimer',
      share: 'Partager',
      like: 'J\\'aime',
      comment: 'Commenter',
      follow: 'Suivre',
      unfollow: 'Ne plus suivre'
    }
  },
  'ja-JP': {
    nav: {
      home: 'ホーム',
      chat: 'チャット',
      learning: '学習',
      profile: 'プロフィール'
    },
    auth: {
      login: 'ログイン',
      register: '登録',
      email: 'メール',
      password: 'パスワード',
      confirmPassword: 'パスワード確認',
      forgotPassword: 'パスワードを忘れましたか？',
      loginButton: 'ログイン',
      registerButton: '登録',
      orLoginWith: 'または以下でログイン',
      alreadyHaveAccount: 'すでにアカウントをお持ちですか？',
      noAccount: 'アカウントをお持ちでないですか？',
      welcome: 'おかえりなさい',
      createAccount: 'アカウント作成',
      joinCommunity: 'グローバル文化コミュニティに参加'
    },
    home: {
      welcome: 'CultureBridgeへようこそ',
      subtitle: '文化をつなぎ、心を結ぶ',
      exploreButton: '探索を始める',
      featuredCultures: '注目の文化',
      recentActivities: '最近のアクティビティ',
      trendingTopics: 'トレンドトピック'
    },
    chat: {
      title: 'チャット',
      searchPlaceholder: '会話を検索...',
      noMessages: 'まだメッセージがありません',
      typeMessage: 'メッセージを入力...',
      send: '送信'
    },
    learning: {
      title: '言語学習',
      myProgress: '私の進捗',
      recommendedCourses: 'おすすめコース',
      practiceToday: '今日の練習',
      achievements: '達成',
      continue: '学習を続ける',
      startLearning: '学習を始める'
    },
    profile: {
      title: 'プロフィール',
      editProfile: 'プロフィール編集',
      settings: '設定',
      language: '言語',
      notifications: '通知',
      privacy: 'プライバシー',
      help: 'ヘルプ',
      about: 'について',
      logout: 'ログアウト',
      myStats: '私の統計',
      postsCount: '投稿数',
      followersCount: 'フォロワー',
      followingCount: 'フォロー中'
    },
    common: {
      loading: '読み込み中...',
      error: '何かが間違っています',
      retry: '再試行',
      cancel: 'キャンセル',
      confirm: '確認',
      save: '保存',
      edit: '編集',
      delete: '削除',
      share: '共有',
      like: 'いいね',
      comment: 'コメント',
      follow: 'フォロー',
      unfollow: 'フォロー解除'
    }
  }
};

// 国家代码到语言的映射
const countryToLanguage = {
  'CN': 'zh-CN',
  'TW': 'zh-CN',
  'HK': 'zh-CN',
  'US': 'en-US',
  'GB': 'en-US',
  'CA': 'en-US',
  'AU': 'en-US',
  'ES': 'es-ES',
  'MX': 'es-ES',
  'AR': 'es-ES',
  'FR': 'fr-FR',
  'BE': 'fr-FR',
  'CH': 'fr-FR',
  'JP': 'ja-JP'
};

// 获取设备语言
const getDeviceLanguage = () => {
  const locale = Localization.locale;
  const region = Localization.region;
  
  // 首先尝试完整的语言-地区代码
  if (translations[locale]) {
    return locale;
  }
  
  // 然后尝试根据地区映射
  if (region && countryToLanguage[region]) {
    return countryToLanguage[region];
  }
  
  // 最后尝试语言代码
  const languageCode = locale.split('-')[0];
  const matchingLocale = Object.keys(translations).find(key => 
    key.startsWith(languageCode)
  );
  
  return matchingLocale || 'en-US'; // 默认英语
};

// 创建上下文
const I18nContext = createContext();

// I18n Provider 组件
export const I18nProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      // 首先检查用户是否已经设置了语言偏好
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      
      if (savedLanguage && translations[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
      } else {
        // 如果没有保存的语言偏好，使用设备语言
        const deviceLanguage = getDeviceLanguage();
        setCurrentLanguage(deviceLanguage);
        await AsyncStorage.setItem('userLanguage', deviceLanguage);
      }
    } catch (error) {
      console.error('初始化语言失败:', error);
      setCurrentLanguage('en-US');
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode) => {
    try {
      if (translations[languageCode]) {
        setCurrentLanguage(languageCode);
        await AsyncStorage.setItem('userLanguage', languageCode);
      }
    } catch (error) {
      console.error('更改语言失败:', error);
    }
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // 如果找不到翻译，尝试英语
        value = translations['en-US'];
        for (const k2 of keys) {
          if (value && typeof value === 'object') {
            value = value[k2];
          } else {
            value = key; // 最后返回原始key
            break;
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
          }
        }
        break;
      }
    }
    
<<<<<<< HEAD
    // 如果找到的是字符串，进行参数替换
    if (typeof translation === 'string') {
      return this.interpolate(translation, params);
    }
    
    return key; // 如果没找到合适的翻译，返回原始键
  }

  // 字符串插值
  interpolate(template, params) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  // 获取支持的语言列表
  getSupportedLanguages() {
    return Object.keys(this.translations);
  }

  // 检测设备语言
  detectDeviceLanguage() {
    // 这里可以使用 react-native 的 I18nManager 或其他库来检测设备语言
    // 暂时返回默认语言
    return 'zh-CN';
  }

  // 根据国家代码设置语言
  setLanguageByCountry(countryCode) {
    const languageMap = {
      'CN': 'zh-CN',
      'US': 'en',
      'GB': 'en',
      'JP': 'ja',
      'KR': 'ko',
      'FR': 'fr',
      'DE': 'de',
      'ES': 'es',
      'IT': 'it',
      'RU': 'ru'
    };
    
    const language = languageMap[countryCode] || 'en';
    return this.setLanguage(language);
  }
}

// 创建单例实例
const i18nService = new I18nService();

export default i18nService;
=======
    if (typeof value === 'string') {
      // 替换参数
      return value.replace(/\\{\\{(\\w+)\\}\\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return key;
  };

  const getSupportedLanguages = () => {
    return Object.keys(translations).map(code => ({
      code,
      name: getLanguageName(code),
      nativeName: getLanguageNativeName(code)
    }));
  };

  const getLanguageName = (code) => {
    const names = {
      'zh-CN': 'Chinese (Simplified)',
      'en-US': 'English',
      'es-ES': 'Spanish',
      'fr-FR': 'French',
      'ja-JP': 'Japanese'
    };
    return names[code] || code;
  };

  const getLanguageNativeName = (code) => {
    const nativeNames = {
      'zh-CN': '简体中文',
      'en-US': 'English',
      'es-ES': 'Español',
      'fr-FR': 'Français',
      'ja-JP': '日本語'
    };
    return nativeNames[code] || code;
  };

  const isRTL = () => {
    const rtlLanguages = ['ar', 'he', 'fa'];
    const languageCode = currentLanguage.split('-')[0];
    return rtlLanguages.includes(languageCode);
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    getSupportedLanguages,
    getLanguageName,
    getLanguageNativeName,
    isRTL,
    isLoading
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook for using I18n
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export default I18nContext;
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3

