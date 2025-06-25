import { useState, useEffect, createContext, useContext } from 'react';
import translations from '../locales/translations.json';

// 创建语言上下文
const LanguageContext = createContext();

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('zh');

  // 检测用户的首选语言
  useEffect(() => {
    const detectLanguage = () => {
      // 首先检查本地存储
      const savedLanguage = localStorage.getItem('culturebridge_language');
      if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
      }

      // 检测浏览器语言
      const browserLanguage = navigator.language || navigator.userLanguage;
      
      // 语言映射
      const languageMap = {
        'zh': 'zh',
        'zh-CN': 'zh',
        'zh-TW': 'zh',
        'zh-HK': 'zh',
        'en': 'en',
        'en-US': 'en',
        'en-GB': 'en',
        'ja': 'zh', // 暂时映射到中文，后续可添加日语
        'ko': 'zh', // 暂时映射到中文，后续可添加韩语
        'fr': 'en', // 暂时映射到英语，后续可添加法语
        'es': 'en', // 暂时映射到英语，后续可添加西班牙语
        'de': 'en', // 暂时映射到英语，后续可添加德语
        'ru': 'en', // 暂时映射到英语，后续可添加俄语
        'ar': 'en', // 暂时映射到英语，后续可添加阿拉伯语
        'pt': 'en', // 暂时映射到英语，后续可添加葡萄牙语
        'it': 'en', // 暂时映射到英语，后续可添加意大利语
        'th': 'en', // 暂时映射到英语，后续可添加泰语
        'vi': 'en', // 暂时映射到英语，后续可添加越南语
        'hi': 'en', // 暂时映射到英语，后续可添加印地语
      };

      // 精确匹配
      if (languageMap[browserLanguage]) {
        return languageMap[browserLanguage];
      }

      // 模糊匹配（只匹配语言代码，忽略地区）
      const languageCode = browserLanguage.split('-')[0];
      if (languageMap[languageCode]) {
        return languageMap[languageCode];
      }

      // 默认返回中文
      return 'zh';
    };

    const detectedLanguage = detectLanguage();
    setCurrentLanguage(detectedLanguage);
  }, []);

  // 切换语言
  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('culturebridge_language', language);
    }
  };

  // 获取翻译文本
  const t = (key, defaultValue = key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return typeof value === 'string' ? value : defaultValue;
  };

  // 获取当前语言信息
  const getCurrentLanguageInfo = () => {
    const languageInfo = {
      'zh': { name: '中文', flag: '🇨🇳', direction: 'ltr' },
      'en': { name: 'English', flag: '🇺🇸', direction: 'ltr' }
    };
    return languageInfo[currentLanguage] || languageInfo['zh'];
  };

  // 获取可用语言列表
  const getAvailableLanguages = () => {
    return [
      { code: 'zh', name: '中文', flag: '🇨🇳' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ];
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    getCurrentLanguageInfo,
    getAvailableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// 简化的翻译Hook
export const useTranslation = () => {
  const { t } = useLanguage();
  return { t };
};

