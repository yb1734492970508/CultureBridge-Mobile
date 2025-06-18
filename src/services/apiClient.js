import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证 token
apiClient.interceptors.request.use(
  (config) => {
    // 这里可以添加从 AsyncStorage 获取 token 的逻辑
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      
      if (status === 401) {
        // 未授权，可能需要重新登录
        // 这里可以添加清除 token 和跳转到登录页的逻辑
        console.log('未授权，需要重新登录');
      }
      
      return Promise.reject(data || error.message);
    } else if (error.request) {
      // 网络错误
      return Promise.reject('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      return Promise.reject(error.message);
    }
  }
);

export default apiClient;

