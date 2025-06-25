/**
 * CultureBridge Mobile API Service
 * 移动端API服务，处理与后端的所有通信
 */

class APIService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    this.token = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    
    // 请求拦截器
    this.setupInterceptors();
  }
  
  setupInterceptors() {
    // 设置默认请求头
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (this.token) {
      this.defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }
  }
  
  // 基础请求方法
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      
      // 处理401错误（token过期）
      if (response.status === 401 && this.refreshToken) {
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          // 重试原请求
          config.headers['Authorization'] = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, config);
          return this.handleResponse(retryResponse);
        } else {
          // 刷新失败，跳转到登录页
          this.handleAuthFailure();
          throw new Error('Authentication failed');
        }
      }
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
  
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } else {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    }
  }
  
  // 刷新访问令牌
  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: this.refreshToken
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access_token);
        return data.access_token;
      } else {
        this.clearTokens();
        return null;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return null;
    }
  }
  
  // 设置令牌
  setToken(token) {
    this.token = token;
    localStorage.setItem('access_token', token);
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  // 设置刷新令牌
  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
    localStorage.setItem('refresh_token', refreshToken);
  }
  
  // 清除令牌
  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete this.defaultHeaders['Authorization'];
  }
  
  // 处理认证失败
  handleAuthFailure() {
    this.clearTokens();
    // 这里可以触发全局状态更新或路由跳转
    window.dispatchEvent(new CustomEvent('auth-failure'));
  }
  
  // GET请求
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET'
    });
  }
  
  // POST请求
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  // PUT请求
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  // DELETE请求
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
  
  // 文件上传
  async upload(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });
    
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        // 不设置Content-Type，让浏览器自动设置
        'Authorization': this.defaultHeaders['Authorization']
      },
      body: formData
    });
  }
  
  // 认证相关API
  auth = {
    // 登录
    login: async (credentials) => {
      const response = await this.post('/auth/login', credentials);
      if (response.access_token) {
        this.setToken(response.access_token);
        this.setRefreshToken(response.refresh_token);
      }
      return response;
    },
    
    // 注册
    register: async (userData) => {
      const response = await this.post('/auth/register', userData);
      if (response.access_token) {
        this.setToken(response.access_token);
        this.setRefreshToken(response.refresh_token);
      }
      return response;
    },
    
    // 登出
    logout: async () => {
      try {
        await this.post('/auth/logout');
      } finally {
        this.clearTokens();
      }
    },
    
    // 获取当前用户信息
    getCurrentUser: () => this.get('/auth/me'),
    
    // 钱包登录
    walletLogin: (walletData) => this.post('/auth/wallet-login', walletData),
    
    // OAuth登录
    oauthLogin: (oauthData) => this.post('/auth/oauth-login', oauthData)
  };
  
  // 用户相关API
  users = {
    // 获取用户列表
    getUsers: (params) => this.get('/users', params),
    
    // 获取用户详情
    getUser: (userId) => this.get(`/users/${userId}`),
    
    // 更新用户信息
    updateUser: (userId, userData) => this.put(`/users/${userId}`, userData),
    
    // 获取用户语言
    getUserLanguages: (userId) => this.get(`/users/${userId}/languages`),
    
    // 添加用户语言
    addUserLanguage: (userId, languageData) => this.post(`/users/${userId}/languages`, languageData),
    
    // 获取用户朋友
    getFriends: (userId) => this.get(`/users/${userId}/friends`),
    
    // 添加朋友
    addFriend: (userId, friendId) => this.post(`/users/${userId}/friends/${friendId}`),
    
    // 移除朋友
    removeFriend: (userId, friendId) => this.delete(`/users/${userId}/friends/${friendId}`),
    
    // 搜索用户
    searchUsers: (query) => this.get('/users/search', { q: query })
  };
  
  // 翻译相关API
  translation = {
    // 翻译文本
    translateText: (data) => this.post('/translation/translate', data),
    
    // 批量翻译
    batchTranslate: (data) => this.post('/translation/batch-translate', data),
    
    // 检测语言
    detectLanguage: (text) => this.post('/translation/detect-language', { text }),
    
    // 语音转文字
    speechToText: (audioFile, language) => {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('language', language);
      return this.upload('/translation/speech-to-text', audioFile, { language });
    },
    
    // 文字转语音
    textToSpeech: (data) => this.post('/translation/text-to-speech', data),
    
    // 获取支持的语言
    getSupportedLanguages: () => this.get('/translation/languages'),
    
    // 获取翻译历史
    getHistory: (params) => this.get('/translation/history', params),
    
    // 删除翻译记录
    deleteHistory: (translationId) => this.delete(`/translation/history/${translationId}`),
    
    // 评价翻译
    rateTranslation: (translationId, rating) => 
      this.post(`/translation/history/${translationId}/rate`, rating)
  };
  
  // 聊天相关API
  chat = {
    // 获取对话列表
    getConversations: (params) => this.get('/chat/conversations', params),
    
    // 创建对话
    createConversation: (data) => this.post('/chat/conversations', data),
    
    // 获取消息
    getMessages: (conversationId, params) => 
      this.get(`/chat/conversations/${conversationId}/messages`, params),
    
    // 发送消息
    sendMessage: (conversationId, message) => 
      this.post(`/chat/conversations/${conversationId}/messages`, message)
  };
  
  // 学习相关API
  learning = {
    // 获取学习会话
    getSessions: (params) => this.get('/learning/sessions', params),
    
    // 创建学习会话
    createSession: (data) => this.post('/learning/sessions', data),
    
    // 更新学习进度
    updateProgress: (sessionId, progress) => 
      this.put(`/learning/sessions/${sessionId}`, progress)
  };
  
  // 社区相关API
  community = {
    // 获取帖子
    getPosts: (params) => this.get('/community/posts', params),
    
    // 创建帖子
    createPost: (data) => this.post('/community/posts', data)
  };
  
  // 区块链相关API
  blockchain = {
    // 获取钱包余额
    getWalletBalance: () => this.get('/blockchain/wallet/balance'),
    
    // 获取代币信息
    getTokenInfo: () => this.get('/blockchain/token/info'),
    
    // 转账代币
    transferTokens: (data) => this.post('/blockchain/transfer', data)
  };
  
  // 内容相关API
  content = {
    // 上传文件
    uploadFile: (file, additionalData) => this.upload('/content/upload', file, additionalData)
  };
}

// 创建API服务实例
const apiService = new APIService();

// 监听认证失败事件
window.addEventListener('auth-failure', () => {
  // 这里可以触发全局状态更新或显示登录模态框
  console.log('Authentication failed, please login again');
});

export default apiService;

