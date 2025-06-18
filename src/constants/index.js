// API 基础配置
export const API_BASE_URL = 'http://localhost:5000/api';

// API 端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  
  // 用户相关
  USERS: {
    PROFILE: '/users/profile',
    STATS: '/users/stats',
    SEARCH: '/users/search',
    LEADERBOARD: '/users/leaderboard',
  },
  
  // 聊天相关
  CHAT: {
    ROOMS: '/chat/rooms',
    MESSAGES: '/chat/messages',
    TRANSLATE: '/chat/translate',
  },
  
  // 学习相关
  LEARNING: {
    COURSES: '/learning/courses',
    PROGRESS: '/learning/progress',
    ACHIEVEMENTS: '/learning/achievements',
  },
  
  // 奖励相关
  REWARDS: {
    USER: '/rewards/user',
    CHECKIN: '/rewards/checkin',
    POINTS: '/rewards/points',
    SHOP: '/rewards/shop',
    LEADERBOARD: '/rewards/leaderboard',
  },
  
  // 翻译相关
  TRANSLATION: {
    TEXT: '/translation/text',
    VOICE: '/translation/voice',
  },
  
  // 文化交流相关
  CULTURAL_EXCHANGE: {
    EVENTS: '/cultural-exchange/events',
    POSTS: '/cultural-exchange/posts',
  },
};

// Socket.IO 配置
export const SOCKET_URL = 'http://localhost:5000';

// 应用配置
export const APP_CONFIG = {
  NAME: 'CultureBridge',
  VERSION: '1.0.0',
  DESCRIPTION: '连接世界文化的学习交流平台',
};

// 颜色主题
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  BACKGROUND: '#f5f5f5',
  CARD_BACKGROUND: '#ffffff',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_LIGHT: '#999999',
  BORDER: '#e0e0e0',
};

// 字体大小
export const FONT_SIZES = {
  SMALL: 12,
  MEDIUM: 14,
  LARGE: 16,
  XLARGE: 18,
  XXLARGE: 20,
  TITLE: 24,
  HEADER: 28,
};

// 间距
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

// 边框半径
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 10,
  XL: 15,
  ROUND: 50,
};

// 阴影样式
export const SHADOWS = {
  LIGHT: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  HEAVY: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 9,
  },
};

