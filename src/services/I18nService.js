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
          }
        }
        break;
      }
    }
    
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

