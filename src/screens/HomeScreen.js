import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const featuredTopics = [
    { id: 1, title: '中国传统文化', description: '探索中华文明的深厚底蕴', icon: '🏮' },
    { id: 2, title: '日本文化体验', description: '感受和风之美', icon: '🗾' },
    { id: 3, title: '欧洲艺术之旅', description: '领略欧洲艺术的魅力', icon: '🎨' },
    { id: 4, title: '美食文化交流', description: '品味世界各地美食', icon: '🍜' },
  ];

  const recentActivities = [
    { id: 1, type: 'chat', title: '参与了"语言交换"聊天室', time: '2小时前' },
    { id: 2, type: 'learning', title: '完成了日语基础课程', time: '1天前' },
    { id: 3, type: 'post', title: '发布了关于中国茶文化的帖子', time: '2天前' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 欢迎横幅 */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeTitle}>欢迎来到 CultureBridge</Text>
        <Text style={styles.welcomeSubtitle}>连接世界文化，共享学习之旅</Text>
      </View>

      {/* 快速操作 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快速开始</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubbles" size={24} color="#007AFF" />
            <Text style={styles.actionText}>加入聊天</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="book" size={24} color="#007AFF" />
            <Text style={styles.actionText}>开始学习</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people" size={24} color="#007AFF" />
            <Text style={styles.actionText}>文化交流</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="language" size={24} color="#007AFF" />
            <Text style={styles.actionText}>翻译工具</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 精选话题 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>精选话题</Text>
        {featuredTopics.map((topic) => (
          <TouchableOpacity key={topic.id} style={styles.topicCard}>
            <Text style={styles.topicIcon}>{topic.icon}</Text>
            <View style={styles.topicContent}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicDescription}>{topic.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* 最近活动 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最近活动</Text>
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons 
                name={
                  activity.type === 'chat' ? 'chatbubbles' :
                  activity.type === 'learning' ? 'book' : 'create'
                } 
                size={16} 
                color="#007AFF" 
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeBanner: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#007AFF',
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  topicIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  topicDescription: {
    fontSize: 14,
    color: '#666',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});

