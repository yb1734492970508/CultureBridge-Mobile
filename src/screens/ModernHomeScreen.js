import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ModernHomeScreen = ({ navigation }) => {
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
  };

  return (
    <View style={styles.container}>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
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
  },
});

export default ModernHomeScreen;

