import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class ChatService {
  // 获取聊天室列表
  async getChatRooms() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CHAT.ROOMS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // 获取聊天室消息
  async getChatMessages(roomId, page = 1, limit = 50) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CHAT.MESSAGES}/${roomId}?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // 翻译消息
  async translateMessage(text, targetLanguage) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CHAT.TRANSLATE, {
        text,
        targetLanguage,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

class LearningService {
  // 获取课程列表
  async getCourses() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LEARNING.COURSES);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // 更新学习进度
  async updateProgress(courseId, lessonId, progress) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LEARNING.PROGRESS, {
        courseId,
        lessonId,
        progress,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // 获取成就列表
  async getAchievements() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LEARNING.ACHIEVEMENTS);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

class UserService {
  // 获取用户资料
  async getUserProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // 更新用户资料
  async updateUserProfile(profileData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.PROFILE, profileData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户统计
  async getUserStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.STATS);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const chatService = new ChatService();
export const learningService = new LearningService();
export const userService = new UserService();

