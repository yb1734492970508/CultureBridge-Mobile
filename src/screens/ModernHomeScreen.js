import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
<<<<<<< HEAD
  StatusBar,
  SafeAreaView,
  Platform
=======
  Image,
  StatusBar,
  RefreshControl,
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../services/I18nService';

const { width, height } = Dimensions.get('window');

const ModernHomeScreen = ({ navigation }) => {
<<<<<<< HEAD
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userStats, setUserStats] = useState({
    points: 1250,
    level: 'Intermediate',
    streak: 7,
    friends: 23
  });

  const features = [
    {
      icon: 'globe-outline',
      title: '文化探索',
      subtitle: '发现世界文化',
      color: ['#667eea', '#764ba2'],
      count: '150+ 国家'
    },
    {
      icon: 'chatbubbles-outline',
      title: '语言交流',
      subtitle: '实时对话练习',
      color: ['#f093fb', '#f5576c'],
      count: '20+ 语言'
    },
    {
      icon: 'people-outline',
      title: '全球社区',
      subtitle: '连接世界朋友',
      color: ['#4facfe', '#00f2fe'],
      count: '100K+ 用户'
    },
    {
      icon: 'school-outline',
      title: '智能学习',
      subtitle: 'AI个性化课程',
      color: ['#43e97b', '#38f9d7'],
      count: '1000+ 课程'
    }
  ];

  const culturalSpotlights = [
    {
      id: 1,
      title: '日本茶道',
      subtitle: '禅意生活艺术',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
      participants: '1.2K',
      category: '传统文化'
    },
    {
      id: 2,
      title: '意大利料理',
      subtitle: '地中海美食文化',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      participants: '2.8K',
      category: '美食文化'
    },
    {
      id: 3,
      title: '印度瑜伽',
      subtitle: '身心灵的和谐',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      participants: '3.5K',
      category: '健康生活'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % culturalSpotlights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const renderHeader = () => (
    <SafeAreaView style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="globe" size={24} color="#fff" />
              </View>
              <Text style={styles.logoText}>CultureBridge</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>欢迎回来！</Text>
            <Text style={styles.welcomeSubtext}>继续你的文化探索之旅</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.points}</Text>
              <Text style={styles.statLabel}>积分</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.streak}</Text>
              <Text style={styles.statLabel}>连续天数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.friends}</Text>
              <Text style={styles.statLabel}>好友</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );

  const renderFeatures = () => (
    <View style={styles.featuresSection}>
      <Text style={styles.sectionTitle}>探索功能</Text>
      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => navigation.navigate(getFeatureRoute(feature.title))}
          >
            <LinearGradient
              colors={feature.color}
              style={styles.featureGradient}
            >
              <Ionicons name={feature.icon} size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            <Text style={styles.featureCount}>{feature.count}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCulturalSpotlights = () => (
    <View style={styles.spotlightsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>文化聚焦</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>查看全部</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.spotlightsScroll}
        contentContainerStyle={styles.spotlightsContent}
      >
        {culturalSpotlights.map((spotlight, index) => (
          <TouchableOpacity
            key={spotlight.id}
            style={styles.spotlightCard}
            onPress={() => navigation.navigate('CulturalDetail', { spotlight })}
          >
            <Image source={{ uri: spotlight.image }} style={styles.spotlightImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.spotlightOverlay}
            >
              <View style={styles.spotlightContent}>
                <Text style={styles.spotlightCategory}>{spotlight.category}</Text>
                <Text style={styles.spotlightTitle}>{spotlight.title}</Text>
                <Text style={styles.spotlightSubtitle}>{spotlight.subtitle}</Text>
                <View style={styles.spotlightStats}>
                  <Ionicons name="people" size={16} color="#fff" />
                  <Text style={styles.spotlightParticipants}>{spotlight.participants} 参与者</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>快速操作</Text>
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: '#667eea' }]}
          onPress={() => navigation.navigate('Chat')}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
          <Text style={styles.quickActionText}>开始聊天</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: '#f093fb' }]}
          onPress={() => navigation.navigate('Learning')}
        >
          <Ionicons name="book" size={24} color="#fff" />
          <Text style={styles.quickActionText}>学习课程</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: '#43e97b' }]}
          onPress={() => navigation.navigate('VoiceTranslation')}
        >
          <Ionicons name="mic" size={24} color="#fff" />
          <Text style={styles.quickActionText}>语音翻译</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getFeatureRoute = (title) => {
    switch (title) {
      case '文化探索': return 'Community';
      case '语言交流': return 'Chat';
      case '全球社区': return 'Community';
      case '智能学习': return 'Learning';
      default: return 'Community';
    }
=======
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
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
<<<<<<< HEAD
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderFeatures()}
        {renderCulturalSpotlights()}
        {renderQuickActions()}
        
        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
=======
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'transparent',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
=======
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
<<<<<<< HEAD
=======
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
<<<<<<< HEAD
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4757',
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureCount: {
    fontSize: 11,
    color: '#3498db',
    fontWeight: '500',
  },
  spotlightsSection: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  spotlightsScroll: {
    marginLeft: -20,
  },
  spotlightsContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  spotlightCard: {
    width: 280,
    height: 200,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  spotlightOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  spotlightContent: {
    padding: 16,
  },
  spotlightCategory: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  spotlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  spotlightSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  spotlightStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotlightParticipants: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
  },
  quickActionsSection: {
    padding: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
=======
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
<<<<<<< HEAD
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
=======
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
});

export default ModernHomeScreen;

