/**
 * CultureBridge Mobile State Management
 * 移动端状态管理系统
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 初始状态
const initialState = {
  // 用户状态
  user: {
    isAuthenticated: false,
    profile: null,
    preferences: {
      language: 'zh',
      theme: 'dark',
      notifications: true,
      autoTranslate: true
    }
  },
  
  // 翻译状态
  translation: {
    history: [],
    favorites: [],
    currentTranslation: null,
    supportedLanguages: [
      { code: 'zh', name: '中文', flag: '🇨🇳' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ]
  },
  
  // 聊天状态
  chat: {
    conversations: [],
    activeConversation: null,
    messages: [],
    onlineUsers: [],
    typingUsers: []
  },
  
  // 学习状态
  learning: {
    currentCourse: null,
    progress: {},
    achievements: [],
    streak: 0,
    points: 0
  },
  
  // 社区状态
  community: {
    posts: [],
    friends: [],
    groups: [],
    notifications: []
  },
  
  // 应用状态
  app: {
    isLoading: false,
    error: null,
    networkStatus: 'online',
    currentTab: 'home',
    theme: 'dark'
  }
};

// Action Types
const ActionTypes = {
  // 用户相关
  SET_USER: 'SET_USER',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  
  // 翻译相关
  ADD_TRANSLATION: 'ADD_TRANSLATION',
  SET_TRANSLATION_HISTORY: 'SET_TRANSLATION_HISTORY',
  ADD_FAVORITE_TRANSLATION: 'ADD_FAVORITE_TRANSLATION',
  REMOVE_FAVORITE_TRANSLATION: 'REMOVE_FAVORITE_TRANSLATION',
  SET_CURRENT_TRANSLATION: 'SET_CURRENT_TRANSLATION',
  
  // 聊天相关
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  ADD_CONVERSATION: 'ADD_CONVERSATION',
  SET_ACTIVE_CONVERSATION: 'SET_ACTIVE_CONVERSATION',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_MESSAGES: 'SET_MESSAGES',
  UPDATE_ONLINE_USERS: 'UPDATE_ONLINE_USERS',
  SET_TYPING_USERS: 'SET_TYPING_USERS',
  
  // 学习相关
  SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  ADD_ACHIEVEMENT: 'ADD_ACHIEVEMENT',
  UPDATE_STREAK: 'UPDATE_STREAK',
  UPDATE_POINTS: 'UPDATE_POINTS',
  
  // 社区相关
  SET_POSTS: 'SET_POSTS',
  ADD_POST: 'ADD_POST',
  SET_FRIENDS: 'SET_FRIENDS',
  ADD_FRIEND: 'ADD_FRIEND',
  SET_GROUPS: 'SET_GROUPS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  
  // 应用相关
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_NETWORK_STATUS: 'SET_NETWORK_STATUS',
  SET_CURRENT_TAB: 'SET_CURRENT_TAB',
  SET_THEME: 'SET_THEME'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    // 用户相关
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload
        }
      };
      
    case ActionTypes.LOGIN:
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: true,
          profile: action.payload.user
        }
      };
      
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: {
          ...initialState.user,
          preferences: state.user.preferences
        },
        chat: initialState.chat,
        learning: initialState.learning,
        community: initialState.community
      };
      
    case ActionTypes.UPDATE_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...action.payload
          }
        }
      };
      
    // 翻译相关
    case ActionTypes.ADD_TRANSLATION:
      return {
        ...state,
        translation: {
          ...state.translation,
          history: [action.payload, ...state.translation.history.slice(0, 99)],
          currentTranslation: action.payload
        }
      };
      
    case ActionTypes.SET_TRANSLATION_HISTORY:
      return {
        ...state,
        translation: {
          ...state.translation,
          history: action.payload
        }
      };
      
    case ActionTypes.ADD_FAVORITE_TRANSLATION:
      return {
        ...state,
        translation: {
          ...state.translation,
          favorites: [...state.translation.favorites, action.payload]
        }
      };
      
    case ActionTypes.REMOVE_FAVORITE_TRANSLATION:
      return {
        ...state,
        translation: {
          ...state.translation,
          favorites: state.translation.favorites.filter(
            item => item.id !== action.payload
          )
        }
      };
      
    case ActionTypes.SET_CURRENT_TRANSLATION:
      return {
        ...state,
        translation: {
          ...state.translation,
          currentTranslation: action.payload
        }
      };
      
    // 聊天相关
    case ActionTypes.SET_CONVERSATIONS:
      return {
        ...state,
        chat: {
          ...state.chat,
          conversations: action.payload
        }
      };
      
    case ActionTypes.ADD_CONVERSATION:
      return {
        ...state,
        chat: {
          ...state.chat,
          conversations: [action.payload, ...state.chat.conversations]
        }
      };
      
    case ActionTypes.SET_ACTIVE_CONVERSATION:
      return {
        ...state,
        chat: {
          ...state.chat,
          activeConversation: action.payload
        }
      };
      
    case ActionTypes.ADD_MESSAGE:
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, action.payload]
        }
      };
      
    case ActionTypes.SET_MESSAGES:
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: action.payload
        }
      };
      
    case ActionTypes.UPDATE_ONLINE_USERS:
      return {
        ...state,
        chat: {
          ...state.chat,
          onlineUsers: action.payload
        }
      };
      
    case ActionTypes.SET_TYPING_USERS:
      return {
        ...state,
        chat: {
          ...state.chat,
          typingUsers: action.payload
        }
      };
      
    // 学习相关
    case ActionTypes.SET_CURRENT_COURSE:
      return {
        ...state,
        learning: {
          ...state.learning,
          currentCourse: action.payload
        }
      };
      
    case ActionTypes.UPDATE_PROGRESS:
      return {
        ...state,
        learning: {
          ...state.learning,
          progress: {
            ...state.learning.progress,
            ...action.payload
          }
        }
      };
      
    case ActionTypes.ADD_ACHIEVEMENT:
      return {
        ...state,
        learning: {
          ...state.learning,
          achievements: [...state.learning.achievements, action.payload]
        }
      };
      
    case ActionTypes.UPDATE_STREAK:
      return {
        ...state,
        learning: {
          ...state.learning,
          streak: action.payload
        }
      };
      
    case ActionTypes.UPDATE_POINTS:
      return {
        ...state,
        learning: {
          ...state.learning,
          points: action.payload
        }
      };
      
    // 社区相关
    case ActionTypes.SET_POSTS:
      return {
        ...state,
        community: {
          ...state.community,
          posts: action.payload
        }
      };
      
    case ActionTypes.ADD_POST:
      return {
        ...state,
        community: {
          ...state.community,
          posts: [action.payload, ...state.community.posts]
        }
      };
      
    case ActionTypes.SET_FRIENDS:
      return {
        ...state,
        community: {
          ...state.community,
          friends: action.payload
        }
      };
      
    case ActionTypes.ADD_FRIEND:
      return {
        ...state,
        community: {
          ...state.community,
          friends: [...state.community.friends, action.payload]
        }
      };
      
    case ActionTypes.SET_GROUPS:
      return {
        ...state,
        community: {
          ...state.community,
          groups: action.payload
        }
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        community: {
          ...state.community,
          notifications: [action.payload, ...state.community.notifications]
        }
      };
      
    // 应用相关
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        app: {
          ...state.app,
          isLoading: action.payload
        }
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        app: {
          ...state.app,
          error: action.payload
        }
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        app: {
          ...state.app,
          error: null
        }
      };
      
    case ActionTypes.SET_NETWORK_STATUS:
      return {
        ...state,
        app: {
          ...state.app,
          networkStatus: action.payload
        }
      };
      
    case ActionTypes.SET_CURRENT_TAB:
      return {
        ...state,
        app: {
          ...state.app,
          currentTab: action.payload
        }
      };
      
    case ActionTypes.SET_THEME:
      return {
        ...state,
        app: {
          ...state.app,
          theme: action.payload
        },
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            theme: action.payload
          }
        }
      };
      
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // 持久化状态
  useEffect(() => {
    const savedState = localStorage.getItem('culturebridge_mobile_state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // 恢复用户偏好设置
        if (parsedState.user?.preferences) {
          dispatch({
            type: ActionTypes.UPDATE_PREFERENCES,
            payload: parsedState.user.preferences
          });
        }
        // 恢复翻译历史
        if (parsedState.translation?.history) {
          dispatch({
            type: ActionTypes.SET_TRANSLATION_HISTORY,
            payload: parsedState.translation.history
          });
        }
        // 恢复收藏的翻译
        if (parsedState.translation?.favorites) {
          parsedState.translation.favorites.forEach(favorite => {
            dispatch({
              type: ActionTypes.ADD_FAVORITE_TRANSLATION,
              payload: favorite
            });
          });
        }
      } catch (error) {
        console.error('Failed to restore state:', error);
      }
    }
  }, []);
  
  // 保存状态到本地存储
  useEffect(() => {
    const stateToSave = {
      user: {
        preferences: state.user.preferences
      },
      translation: {
        history: state.translation.history.slice(0, 50), // 只保存最近50条
        favorites: state.translation.favorites
      }
    };
    localStorage.setItem('culturebridge_mobile_state', JSON.stringify(stateToSave));
  }, [state.user.preferences, state.translation.history, state.translation.favorites]);
  
  // 网络状态监听
  useEffect(() => {
    const handleOnline = () => {
      dispatch({
        type: ActionTypes.SET_NETWORK_STATUS,
        payload: 'online'
      });
    };
    
    const handleOffline = () => {
      dispatch({
        type: ActionTypes.SET_NETWORK_STATUS,
        payload: 'offline'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <AppContext.Provider value={{ state, dispatch, ActionTypes }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

// 选择器 Hooks
export const useUser = () => {
  const { state } = useAppState();
  return state.user;
};

export const useTranslation = () => {
  const { state } = useAppState();
  return state.translation;
};

export const useChat = () => {
  const { state } = useAppState();
  return state.chat;
};

export const useLearning = () => {
  const { state } = useAppState();
  return state.learning;
};

export const useCommunity = () => {
  const { state } = useAppState();
  return state.community;
};

export const useApp = () => {
  const { state } = useAppState();
  return state.app;
};

// Action Creators
export const useActions = () => {
  const { dispatch, ActionTypes } = useAppState();
  
  return {
    // 用户操作
    login: (userData) => dispatch({ type: ActionTypes.LOGIN, payload: userData }),
    logout: () => dispatch({ type: ActionTypes.LOGOUT }),
    updatePreferences: (preferences) => dispatch({ 
      type: ActionTypes.UPDATE_PREFERENCES, 
      payload: preferences 
    }),
    
    // 翻译操作
    addTranslation: (translation) => dispatch({ 
      type: ActionTypes.ADD_TRANSLATION, 
      payload: translation 
    }),
    addFavoriteTranslation: (translation) => dispatch({ 
      type: ActionTypes.ADD_FAVORITE_TRANSLATION, 
      payload: translation 
    }),
    removeFavoriteTranslation: (id) => dispatch({ 
      type: ActionTypes.REMOVE_FAVORITE_TRANSLATION, 
      payload: id 
    }),
    
    // 聊天操作
    setActiveConversation: (conversation) => dispatch({ 
      type: ActionTypes.SET_ACTIVE_CONVERSATION, 
      payload: conversation 
    }),
    addMessage: (message) => dispatch({ 
      type: ActionTypes.ADD_MESSAGE, 
      payload: message 
    }),
    
    // 学习操作
    updateProgress: (progress) => dispatch({ 
      type: ActionTypes.UPDATE_PROGRESS, 
      payload: progress 
    }),
    addAchievement: (achievement) => dispatch({ 
      type: ActionTypes.ADD_ACHIEVEMENT, 
      payload: achievement 
    }),
    
    // 应用操作
    setLoading: (loading) => dispatch({ 
      type: ActionTypes.SET_LOADING, 
      payload: loading 
    }),
    setError: (error) => dispatch({ 
      type: ActionTypes.SET_ERROR, 
      payload: error 
    }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    setCurrentTab: (tab) => dispatch({ 
      type: ActionTypes.SET_CURRENT_TAB, 
      payload: tab 
    }),
    setTheme: (theme) => dispatch({ 
      type: ActionTypes.SET_THEME, 
      payload: theme 
    })
  };
};

