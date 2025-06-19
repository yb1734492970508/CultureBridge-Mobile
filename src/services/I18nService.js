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
      noAccount: "Don't have an account?",
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
      register: 'S\'inscrire',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      loginButton: 'Se Connecter',
      registerButton: 'S\'inscrire',
      orLoginWith: 'Ou se connecter avec',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
      noAccount: 'Vous n\'avez pas de compte?',
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
      practiceToday: 'Pratique du Jour',
      achievements: 'Réalisations',
      continue: 'Continuer l\'apprentissage',
      startLearning: 'Commencer l\'apprentissage'
    },
    profile: {
      title: 'Profil',
      editProfile: 'Modifier le Profil',
      settings: 'Paramètres',
      language: 'Langue',
      notifications: 'Notifications',
      privacy: 'Confidentialité',
      help: 'Aide',
      about: 'À Propos',
      logout: 'Se Déconnecter',
      myStats: 'Mes Statistiques',
      postsCount: 'Publications',
      followersCount: 'Abonnés',
      followingCount: 'Abonnements'
    },
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      retry: 'Réessayer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Sauvegarder',
      edit: 'Modifier',
      delete: 'Supprimer',
      share: 'Partager',
      like: 'J\'aime',
      comment: 'Commenter',
      follow: 'Suivre',
      unfollow: 'Ne plus suivre'
    }
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(Localization.locale);
  const [currentTranslations, setCurrentTranslations] = useState(translations[locale] || translations['en-US']);

  useEffect(() => {
    const loadSavedLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem('appLocale');
        if (savedLocale && translations[savedLocale]) {
          setLocale(savedLocale);
          setCurrentTranslations(translations[savedLocale]);
        } else {
          // Fallback to device locale if no saved locale or saved locale is invalid
          const deviceLocale = Localization.locale;
          const supportedLocale = Object.keys(translations).find(key => deviceLocale.startsWith(key)) || 'en-US';
          setLocale(supportedLocale);
          setCurrentTranslations(translations[supportedLocale]);
          await AsyncStorage.setItem('appLocale', supportedLocale);
        }
      } catch (error) {
        console.error('Failed to load saved locale:', error);
        // Fallback to default if loading fails
        setLocale('en-US');
        setCurrentTranslations(translations['en-US']);
      }
    };
    loadSavedLocale();
  }, []);

  const setAppLocale = async (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      setCurrentTranslations(translations[newLocale]);
      await AsyncStorage.setItem('appLocale', newLocale);
    } else {
      console.warn(`Locale ${newLocale} is not supported.`);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let text = currentTranslations;
    for (const k of keys) {
      if (text && typeof text === 'object' && text[k] !== undefined) {
        text = text[k];
      } else {
        // Fallback to English if key not found in current locale
        let fallbackText = translations['en-US'];
        for (const fbKey of keys) {
          if (fallbackText && typeof fallbackText === 'object' && fallbackText[fbKey] !== undefined) {
            fallbackText = fallbackText[fbKey];
          } else {
            return key; // Return key if not found in English either
          }
        }
        return fallbackText;
      }
    }
    return text;
  };

  return (
    <I18nContext.Provider value={{ t, locale, setAppLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

