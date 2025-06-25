/**
 * CultureBridge Mobile Offline Features
 * 移动端离线功能组件
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WifiOff, 
  Wifi, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Sync,
  Database,
  Languages,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppState, useActions } from '../store/AppState';

// 离线存储管理器
class OfflineStorageManager {
  constructor() {
    this.dbName = 'CultureBridgeOfflineDB';
    this.dbVersion = 1;
    this.db = null;
    this.init();
  }
  
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 翻译缓存存储
        if (!db.objectStoreNames.contains('translations')) {
          const translationStore = db.createObjectStore('translations', { keyPath: 'id', autoIncrement: true });
          translationStore.createIndex('sourceText', 'sourceText', { unique: false });
          translationStore.createIndex('sourceLang', 'sourceLang', { unique: false });
          translationStore.createIndex('targetLang', 'targetLang', { unique: false });
          translationStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // 离线消息存储
        if (!db.objectStoreNames.contains('offlineMessages')) {
          const messageStore = db.createObjectStore('offlineMessages', { keyPath: 'id', autoIncrement: true });
          messageStore.createIndex('conversationId', 'conversationId', { unique: false });
          messageStore.createIndex('timestamp', 'timestamp', { unique: false });
          messageStore.createIndex('status', 'status', { unique: false });
        }
        
        // 离线语言包存储
        if (!db.objectStoreNames.contains('languagePacks')) {
          const langStore = db.createObjectStore('languagePacks', { keyPath: 'language' });
          langStore.createIndex('version', 'version', { unique: false });
          langStore.createIndex('downloadDate', 'downloadDate', { unique: false });
        }
        
        // 用户数据缓存
        if (!db.objectStoreNames.contains('userCache')) {
          const userStore = db.createObjectStore('userCache', { keyPath: 'key' });
          userStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // 学习内容缓存
        if (!db.objectStoreNames.contains('learningContent')) {
          const learningStore = db.createObjectStore('learningContent', { keyPath: 'id' });
          learningStore.createIndex('courseId', 'courseId', { unique: false });
          learningStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }
  
  // 保存翻译到离线缓存
  async saveTranslation(translation) {
    const transaction = this.db.transaction(['translations'], 'readwrite');
    const store = transaction.objectStore('translations');
    
    const translationData = {
      ...translation,
      timestamp: Date.now(),
      cached: true
    };
    
    return store.add(translationData);
  }
  
  // 从离线缓存获取翻译
  async getTranslation(sourceText, sourceLang, targetLang) {
    const transaction = this.db.transaction(['translations'], 'readonly');
    const store = transaction.objectStore('translations');
    const index = store.index('sourceText');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(sourceText);
      request.onsuccess = () => {
        const results = request.result.filter(
          item => item.sourceLang === sourceLang && item.targetLang === targetLang
        );
        resolve(results.length > 0 ? results[0] : null);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  // 保存离线消息
  async saveOfflineMessage(message) {
    const transaction = this.db.transaction(['offlineMessages'], 'readwrite');
    const store = transaction.objectStore('offlineMessages');
    
    const messageData = {
      ...message,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    return store.add(messageData);
  }
  
  // 获取待发送的离线消息
  async getPendingMessages() {
    const transaction = this.db.transaction(['offlineMessages'], 'readonly');
    const store = transaction.objectStore('offlineMessages');
    const index = store.index('status');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll('pending');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // 更新消息状态
  async updateMessageStatus(messageId, status) {
    const transaction = this.db.transaction(['offlineMessages'], 'readwrite');
    const store = transaction.objectStore('offlineMessages');
    
    const request = store.get(messageId);
    request.onsuccess = () => {
      const message = request.result;
      if (message) {
        message.status = status;
        store.put(message);
      }
    };
  }
  
  // 下载语言包
  async downloadLanguagePack(language, packData) {
    const transaction = this.db.transaction(['languagePacks'], 'readwrite');
    const store = transaction.objectStore('languagePacks');
    
    const languagePackData = {
      language,
      data: packData,
      version: packData.version || '1.0.0',
      downloadDate: Date.now(),
      size: JSON.stringify(packData).length
    };
    
    return store.put(languagePackData);
  }
  
  // 获取语言包
  async getLanguagePack(language) {
    const transaction = this.db.transaction(['languagePacks'], 'readonly');
    const store = transaction.objectStore('languagePacks');
    
    return new Promise((resolve, reject) => {
      const request = store.get(language);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // 获取存储使用情况
  async getStorageUsage() {
    const usage = {
      translations: 0,
      messages: 0,
      languagePacks: 0,
      userCache: 0,
      learningContent: 0,
      total: 0
    };
    
    const stores = ['translations', 'offlineMessages', 'languagePacks', 'userCache', 'learningContent'];
    
    for (const storeName of stores) {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore('translations');
      
      const count = await new Promise((resolve) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
      });
      
      usage[storeName === 'offlineMessages' ? 'messages' : storeName] = count;
      usage.total += count;
    }
    
    return usage;
  }
  
  // 清理过期数据
  async cleanupExpiredData(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7天
    const cutoffTime = Date.now() - maxAge;
    
    // 清理过期翻译
    const translationTransaction = this.db.transaction(['translations'], 'readwrite');
    const translationStore = translationTransaction.objectStore('translations');
    const translationIndex = translationStore.index('timestamp');
    
    const translationRequest = translationIndex.openCursor(IDBKeyRange.upperBound(cutoffTime));
    translationRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
    
    // 清理已发送的离线消息
    const messageTransaction = this.db.transaction(['offlineMessages'], 'readwrite');
    const messageStore = messageTransaction.objectStore('offlineMessages');
    const messageIndex = messageStore.index('status');
    
    const messageRequest = messageIndex.openCursor('sent');
    messageRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.timestamp < cutoffTime) {
          cursor.delete();
        }
        cursor.continue();
      }
    };
  }
}

// 离线翻译器
class OfflineTranslator {
  constructor(storageManager) {
    this.storage = storageManager;
    this.basicTranslations = new Map();
    this.loadBasicTranslations();
  }
  
  loadBasicTranslations() {
    // 加载基础翻译对照表
    const basicPairs = [
      { zh: '你好', en: 'Hello', ja: 'こんにちは', ko: '안녕하세요' },
      { zh: '谢谢', en: 'Thank you', ja: 'ありがとう', ko: '감사합니다' },
      { zh: '再见', en: 'Goodbye', ja: 'さようなら', ko: '안녕히 가세요' },
      { zh: '是的', en: 'Yes', ja: 'はい', ko: '네' },
      { zh: '不是', en: 'No', ja: 'いいえ', ko: '아니요' },
      { zh: '请', en: 'Please', ja: 'お願いします', ko: '부탁합니다' },
      { zh: '对不起', en: 'Sorry', ja: 'すみません', ko: '죄송합니다' },
      { zh: '帮助', en: 'Help', ja: '助けて', ko: '도움' },
      { zh: '水', en: 'Water', ja: '水', ko: '물' },
      { zh: '食物', en: 'Food', ja: '食べ物', ko: '음식' }
    ];
    
    basicPairs.forEach(pair => {
      Object.keys(pair).forEach(sourceLang => {
        Object.keys(pair).forEach(targetLang => {
          if (sourceLang !== targetLang) {
            const key = `${pair[sourceLang]}_${sourceLang}_${targetLang}`;
            this.basicTranslations.set(key, pair[targetLang]);
          }
        });
      });
    });
  }
  
  async translate(text, sourceLang, targetLang) {
    // 首先检查基础翻译
    const basicKey = `${text}_${sourceLang}_${targetLang}`;
    if (this.basicTranslations.has(basicKey)) {
      return {
        translatedText: this.basicTranslations.get(basicKey),
        source: 'basic',
        confidence: 0.9
      };
    }
    
    // 检查缓存
    const cached = await this.storage.getTranslation(text, sourceLang, targetLang);
    if (cached) {
      return {
        translatedText: cached.translatedText,
        source: 'cache',
        confidence: cached.confidence || 0.8
      };
    }
    
    // 如果没有缓存，返回原文本并标记为需要在线翻译
    return {
      translatedText: text,
      source: 'offline',
      confidence: 0.1,
      needsOnlineTranslation: true
    };
  }
}

// 离线状态指示器组件
const OfflineIndicator = () => {
  const { app } = useAppState();
  const [showDetails, setShowDetails] = useState(false);
  
  if (app.networkStatus === 'online') {
    return null;
  }
  
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-4 right-4 z-50"
    >
      <Card className="bg-orange-500/90 backdrop-blur-sm border-orange-400">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WifiOff className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">离线模式</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-white hover:bg-white/20"
            >
              详情
            </Button>
          </div>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 text-white text-xs"
              >
                <p>您当前处于离线状态。部分功能可能受限，但您仍可以：</p>
                <ul className="mt-1 space-y-1">
                  <li>• 查看翻译历史</li>
                  <li>• 使用基础离线翻译</li>
                  <li>• 浏览已下载的内容</li>
                  <li>• 编写消息（将在联网后发送）</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// 离线功能管理组件
const OfflineManager = () => {
  const [storageUsage, setStorageUsage] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [availableLanguagePacks, setAvailableLanguagePacks] = useState([]);
  const [downloadedPacks, setDownloadedPacks] = useState([]);
  const { app } = useAppState();
  const actions = useActions();
  
  const storageManager = new OfflineStorageManager();
  
  useEffect(() => {
    loadStorageUsage();
    loadAvailableLanguagePacks();
    loadDownloadedPacks();
  }, []);
  
  const loadStorageUsage = async () => {
    try {
      const usage = await storageManager.getStorageUsage();
      setStorageUsage(usage);
    } catch (error) {
      console.error('Failed to load storage usage:', error);
    }
  };
  
  const loadAvailableLanguagePacks = () => {
    // 模拟可下载的语言包
    setAvailableLanguagePacks([
      { language: 'zh', name: '中文', size: '2.5MB', version: '1.0.0' },
      { language: 'en', name: 'English', size: '2.1MB', version: '1.0.0' },
      { language: 'ja', name: '日本語', size: '2.8MB', version: '1.0.0' },
      { language: 'ko', name: '한국어', size: '2.3MB', version: '1.0.0' },
      { language: 'fr', name: 'Français', size: '2.4MB', version: '1.0.0' },
      { language: 'es', name: 'Español', size: '2.2MB', version: '1.0.0' }
    ]);
  };
  
  const loadDownloadedPacks = async () => {
    try {
      const packs = [];
      for (const pack of availableLanguagePacks) {
        const downloaded = await storageManager.getLanguagePack(pack.language);
        if (downloaded) {
          packs.push({
            ...pack,
            downloadDate: downloaded.downloadDate,
            localVersion: downloaded.version
          });
        }
      }
      setDownloadedPacks(packs);
    } catch (error) {
      console.error('Failed to load downloaded packs:', error);
    }
  };
  
  const downloadLanguagePack = async (languagePack) => {
    if (app.networkStatus === 'offline') {
      actions.setError('需要网络连接才能下载语言包');
      return;
    }
    
    try {
      setDownloadProgress(prev => ({ ...prev, [languagePack.language]: 0 }));
      
      // 模拟下载过程
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setDownloadProgress(prev => ({ ...prev, [languagePack.language]: i }));
      }
      
      // 模拟语言包数据
      const packData = {
        version: languagePack.version,
        translations: {
          // 这里应该包含实际的翻译数据
          basic: {},
          phrases: {},
          vocabulary: {}
        }
      };
      
      await storageManager.downloadLanguagePack(languagePack.language, packData);
      
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[languagePack.language];
        return newProgress;
      });
      
      loadDownloadedPacks();
      loadStorageUsage();
      
      actions.setError(null);
    } catch (error) {
      console.error('Failed to download language pack:', error);
      actions.setError('下载语言包失败');
      
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[languagePack.language];
        return newProgress;
      });
    }
  };
  
  const cleanupStorage = async () => {
    try {
      await storageManager.cleanupExpiredData();
      loadStorageUsage();
      actions.setError(null);
    } catch (error) {
      console.error('Failed to cleanup storage:', error);
      actions.setError('清理存储失败');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* 存储使用情况 */}
      {storageUsage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>存储使用情况</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">翻译缓存</span>
                <Badge variant="secondary">{storageUsage.translations} 条</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">离线消息</span>
                <Badge variant="secondary">{storageUsage.messages} 条</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">语言包</span>
                <Badge variant="secondary">{downloadedPacks.length} 个</Badge>
              </div>
              
              <div className="pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cleanupStorage}
                  className="w-full"
                >
                  <Sync className="h-4 w-4 mr-2" />
                  清理过期数据
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 语言包管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="h-5 w-5" />
            <span>离线语言包</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableLanguagePacks.map(pack => {
              const isDownloaded = downloadedPacks.some(d => d.language === pack.language);
              const isDownloading = downloadProgress[pack.language] !== undefined;
              const progress = downloadProgress[pack.language] || 0;
              
              return (
                <div key={pack.language} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Languages className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{pack.name}</div>
                      <div className="text-sm text-gray-500">{pack.size}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isDownloaded ? (
                      <Badge variant="success" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        已下载
                      </Badge>
                    ) : isDownloading ? (
                      <div className="flex items-center space-x-2">
                        <Progress value={progress} className="w-20" />
                        <span className="text-sm text-gray-500">{progress}%</span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadLanguagePack(pack)}
                        disabled={app.networkStatus === 'offline'}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* 离线功能说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>离线功能</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>基础翻译：常用词汇和短语的离线翻译</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>翻译缓存：自动保存已翻译的内容供离线查看</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>离线消息：在无网络时编写消息，联网后自动发送</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>学习内容：下载课程内容供离线学习</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { OfflineStorageManager, OfflineTranslator, OfflineIndicator, OfflineManager };

