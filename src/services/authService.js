import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class AuthService {
  // 用户登录
  async login(email, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      
      if (response.success && response.token) {
        // 这里可以保存 token 到 AsyncStorage
        // await AsyncStorage.setItem('authToken', response.token);
        // await AsyncStorage.setItem('user', JSON.stringify(response.user));
        return response;
      }
      
      throw new Error(response.message || '登录失败');
    } catch (error) {
      throw error;
    }
  }

  // 用户注册
  async register(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || '注册失败');
    } catch (error) {
      throw error;
    }
  }

  // 用户登出
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      // 清除本地存储的认证信息
      // await AsyncStorage.removeItem('authToken');
      // await AsyncStorage.removeItem('user');
      return true;
    } catch (error) {
      // 即使服务器请求失败，也要清除本地认证信息
      // await AsyncStorage.removeItem('authToken');
      // await AsyncStorage.removeItem('user');
      throw error;
    }
  }

  // 获取当前用户信息
  async getCurrentUser() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // 刷新 token
  async refreshToken() {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      
      if (response.success && response.token) {
        // 更新本地存储的 token
        // await AsyncStorage.setItem('authToken', response.token);
        return response;
      }
      
      throw new Error('Token 刷新失败');
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();

