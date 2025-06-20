import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Image,
  RefreshControl,
  Animated,
  FlatList,
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
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 模拟加载数据
    setFeaturedCultures([
      {
        id: 1,
        name: t('home.japaneseTeaCeremony'),
        description: t('home.japaneseTeaCeremonyDesc'),
        image: '🍵',
        participants: 1234,
        country: '日本',
        gradient: ['#FF6B6B', '#FF8E53']
      },
      {
        id: 2,
        name: t('home.italianCuisine'),
        description: t('home.italianCuisineDesc'),
        image: '🍝',
        participants: 2156,
        country: '意大利',
        gradient: ['#4ECDC4', '#44A08D']
      },
      {
        id: 3,
        name: t('home.indianYoga'),
        description: t('home.indianYogaDesc'),
        image: '🧘',
        participants: 3421,
        country: '印度',
        gradient: ['#667eea', '#764ba2']
      },
      {
        id: 4,
        name: t('home.mexicanFiesta'),
        description: t('home.mexicanFiestaDesc'),
        image: '🎉',
        participants: 1876,
        country: '墨西哥',
        gradient: ['#F093FB', '#F5576C']
      }
    ]);

    setRecentActivities([
      {
        id: 1,
        type: 'language_exchange',
        title: t('home.activitySpanish'),
        time: t('home.activityTime2h'),
        icon: 'chatbubbles',
        color: '#4F46E5'
      },
      {
        id: 2,
        type: 'cultural_post',
        title: t('home.activityChineseNewYear'),
        time: t('home.activityTime5h'),
        icon: 'camera',
        color: '#EF4444'
      },
      {
        id: 3,
        type: 'learning_progress',
        title: t('home.activityFrenchCourse'),
        time: t('home.activityTime1d'),
        icon: 'book',
        color: '#10B981'
      }
    ]);

    setTrendingPosts([
      {
        id: 1,
        author: '东京茶道师',
        avatar: '👘',
        content: '今天在浅草寺体验了传统茶道，感受到了日本文化的深邃之美...',
        likes: 234,
        comments: 45,
        time: '3小时前',
        tags: ['茶道', '日本文化'],
        location: '东京·浅草寺'
      },
      {
        id: 2,
        author: '巴黎美食家',
        avatar: '🥐',
        content: '在蒙马特高地发现了一家百年老店，他们的可颂酥脆香甜...',
        likes: 189,
        comments: 32,
        time: '5小时前',
        tags: ['法式美食', '巴黎'],
        location: '巴黎·蒙马特'
      }
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const renderFeaturedCulture = ({ item: culture }) => (
    <TouchableOpacity
      style={styles.cultureCard}
      onPress={() => {
        // 导航到文化详情页
      }}
    >
      <LinearGradient
        colors={culture.gradient}
        style={styles.cultureGradient}
      >
        <Text style={styles.cultureEmoji}>{culture.image}</Text>
        <View style={styles.cultureOverlay}>
          <Text style={styles.cultureCountry}>{culture.country}</Text>
        </View>
      </LinearGradient>
      <View style={styles.cultureInfo}>
        <Text style={styles.cultureName}>{culture.name}</Text>
        <Text style={styles.cultureDescription}>{culture.description}</Text>
        <View style={styles.cultureStats}>
          <Ionicons name="people" size={14} color="#666" />
          <Text style={styles.cultureParticipants}>
            {culture.participants.toLocaleString()} {t('home.participants')}
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
      <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
        <Ionicons name={activity.icon} size={20} color={activity.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#ccc" />
    </TouchableOpacity>
  );

  const renderTrendingPost = (post) => (
    <TouchableOpacity
      key={post.id}
      style={styles.postCard}
      onPress={() => {
        // 导航到帖子详情
      }}
    >
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <Text style={styles.authorAvatar}>{post.avatar}</Text>
          <View>
            <Text style={styles.authorName}>{post.author}</Text>
            <Text style={styles.postLocation}>{post.location}</Text>
          </View>
        </View>
        <Text style={styles.postTime}>{post.time}</Text>
      </View>
      
      <Text style={styles.postContent}>{post.content}</Text>
      
      <View style={styles.postTags}>
        {post.tags.map((tag, index) => (
          <View key={index} style={styles.postTag}>
            <Text style={styles.postTagText}>#{tag}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="heart-outline" size={18} color="#666" />
          <Text style={styles.postActionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="chatbubble-outline" size={18} color="#666" />
          <Text style={styles.postActionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="share-outline" size={18} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6B46C1" />
      
      {/* 头部区域 */}
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#F093FB']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
              <Text style={styles.subtitleText}>{t('home.subtitle')}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* 快速操作按钮 */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="search" size={20} color="white" />
                <Text style={styles.quickActionText}>{t('home.exploreButton')}</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="people" size={20} color="white" />
                <Text style={styles.quickActionText}>{t('navigation.community')}</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="mic" size={20} color="white" />
                <Text style={styles.quickActionText}>{t('home.translate')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* 主要内容 */}
      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* 精选文化 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.featuredCultures')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredCultures}
            renderItem={renderFeaturedCulture}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* 热门动态 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>热门动态</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.postsContainer}>
            {trendingPosts.map(renderTrendingPost)}
          </View>
        </View>

        {/* 最近活动 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.recentActivities')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
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
            {['#文化交流', '#语言学习', '#美食分享', '#旅行故事', '#节日庆典', '#艺术创作'].map((topic, index) => (
              <TouchableOpacity key={index} style={styles.topicTag}>
                <Text style={styles.topicText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    position: 'relative',
    zIndex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
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
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  quickActionButton: {
    width: width / 3 - 30,
    height: 80,
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F8FAFC',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
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
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  horizontalList: {
    paddingRight: 20,
  },
  cultureCard: {
    width: width * 0.45,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cultureGradient: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cultureEmoji: {
    fontSize: 50,
  },
  cultureOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cultureCountry: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  cultureInfo: {
    padding: 15,
  },
  cultureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  cultureDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  cultureStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cultureParticipants: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 5,
  },
  postsContainer: {
    marginBottom: 10,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    fontSize: 24,
    marginRight: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  postLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 10,
  },
  postTags: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  postTag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  postTagText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 5,
  },
  activitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicTag: {
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  topicText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
});

export default ModernHomeScreen;

