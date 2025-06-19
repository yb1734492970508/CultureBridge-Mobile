import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../services/I18nService';

const { width, height } = Dimensions.get('window');

const ModernHomeScreen = ({ navigation }) => {
  const { t } = useI18n();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredCultures, setFeaturedCultures] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 模拟加载数据
    setFeaturedCultures([
      {
        id: 1,
        name: '日本茶道',
        description: '体验禅意的茶艺文化',
        image: '🍵',
        participants: 1234,
        country: '日本'
      },
      {
        id: 2,
        name: '意大利美食',
        description: '学习正宗意式料理',
        image: '🍝',
        participants: 2156,
        country: '意大利'
      },
      {
        id: 3,
        name: '印度瑜伽',
        description: '探索身心灵的平衡',
        image: '🧘',
        participants: 3421,
        country: '印度'
      },
      {
        id: 4,
        name: '墨西哥节庆',
        description: '感受热情的拉美文化',
        image: '🎉',
        participants: 1876,
        country: '墨西哥'
      }
    ]);

    setRecentActivities([
      {
        id: 1,
        type: 'language_exchange',
        title: '与Maria练习西班牙语',
        time: '2小时前',
        icon: 'chatbubbles'
      },
      {
        id: 2,
        type: 'cultural_post',
        title: '分享了中国春节习俗',
        time: '5小时前',
        icon: 'camera'
      },
      {
        id: 3,
        type: 'learning_progress',
        title: '完成法语课程第3章',
        time: '1天前',
        icon: 'book'
      }
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderFeaturedCulture = (culture) => (
    <TouchableOpacity
      key={culture.id}
      style={styles.cultureCard}
      onPress={() => {
        // 导航到文化详情页
      }}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.cultureGradient}
      >
        <Text style={styles.cultureEmoji}>{culture.image}</Text>
      </LinearGradient>
      <View style={styles.cultureInfo}>
        <Text style={styles.cultureName}>{culture.name}</Text>
        <Text style={styles.cultureDescription}>{culture.description}</Text>
        <View style={styles.cultureStats}>
          <Ionicons name="people" size={14} color="#666" />
          <Text style={styles.cultureParticipants}>
            {culture.participants.toLocaleString()} 参与者
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderActivity = (activity) => (
    <TouchableOpacity
      key={activity.id}
      style={styles.activityItem}
      onPress={() => {
        // 处理活动点击
      }}
    >
      <View style={styles.activityIcon}>
        <Ionicons name={activity.icon} size={20} color="#6B46C1" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6B46C1" />
      
      {/* 头部区域 */}
      <LinearGradient
        colors={['#6B46C1', '#9333EA', '#EC4899']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
            <Text style={styles.subtitleText}>{t('home.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* 快速操作按钮 */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="search" size={20} color="white" />
              <Text style={styles.quickActionText}>探索</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="people" size={20} color="white" />
              <Text style={styles.quickActionText}>社区</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="mic" size={20} color="white" />
              <Text style={styles.quickActionText}>翻译</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* 主要内容 */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 精选文化 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.featuredCultures')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>查看全部</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {featuredCultures.map(renderFeaturedCulture)}
          </ScrollView>
        </View>

        {/* 最近活动 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.recentActivities')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>查看全部</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activitiesContainer}>
            {recentActivities.map(renderActivity)}
          </View>
        </View>

        {/* 热门话题 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.trendingTopics')}</Text>
          </View>
          
          <View style={styles.topicsContainer}>
            {['#文化交流', '#语言学习', '#美食分享', '#旅行故事', '#节日庆典'].map((topic, index) => (
              <TouchableOpacity key={index} style={styles.topicTag}>
                <Text style={styles.topicText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: StatusBar.currentHeight + 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  quickActionGradient: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#f8fafc',
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '600',
  },
  horizontalScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  cultureCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cultureGradient: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cultureEmoji: {
    fontSize: 40,
  },
  cultureInfo: {
    padding: 15,
  },
  cultureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  cultureDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  cultureStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cultureParticipants: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 5,
  },
  activitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  topicTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  topicText: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '600',
  },
});

export default ModernHomeScreen;

