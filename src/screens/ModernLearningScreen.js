import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ModernLearningScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProgress, setUserProgress] = useState({
    level: 'Intermediate',
    points: 1250,
    streak: 7,
    completedCourses: 12
  });

  const categories = [
    { id: 'all', name: '全部', icon: 'apps' },
    { id: 'language', name: '语言', icon: 'chatbubbles' },
    { id: 'culture', name: '文化', icon: 'globe' },
    { id: 'cooking', name: '烹饪', icon: 'restaurant' },
    { id: 'art', name: '艺术', icon: 'color-palette' }
  ];

  const courses = [
    {
      id: 1,
      title: '日语基础会话',
      subtitle: '从零开始学习日语',
      level: 'Beginner',
      duration: '4 周',
      progress: 65,
      students: '2.3K',
      rating: 4.8,
      category: 'language',
      color: ['#667eea', '#764ba2']
    },
    {
      id: 2,
      title: '意大利料理文化',
      subtitle: '探索地中海美食传统',
      level: 'Intermediate',
      duration: '3 周',
      progress: 30,
      students: '1.8K',
      rating: 4.9,
      category: 'culture',
      color: ['#f093fb', '#f5576c']
    },
    {
      id: 3,
      title: '法语发音技巧',
      subtitle: '掌握地道法语发音',
      level: 'Advanced',
      duration: '2 周',
      progress: 0,
      students: '1.2K',
      rating: 4.7,
      category: 'language',
      color: ['#4facfe', '#00f2fe']
    },
    {
      id: 4,
      title: '中国书法艺术',
      subtitle: '传统书法入门课程',
      level: 'Beginner',
      duration: '6 周',
      progress: 85,
      students: '950',
      rating: 4.6,
      category: 'art',
      color: ['#43e97b', '#38f9d7']
    }
  ];

  const achievements = [
    { id: 1, title: '语言新手', description: '完成第一门语言课程', icon: 'trophy', earned: true },
    { id: 2, title: '文化探索者', description: '学习5种不同文化', icon: 'globe', earned: true },
    { id: 3, title: '连续学习者', description: '连续学习7天', icon: 'flame', earned: true },
    { id: 4, title: '社交达人', description: '与10位朋友互动', icon: 'people', earned: false }
  ];

  const renderHeader = () => (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.header}
    >
      <SafeAreaView>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>学习中心</Text>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.levelText}>{userProgress.level}</Text>
              <Text style={styles.pointsText}>{userProgress.points} 积分</Text>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProgress.streak}</Text>
                <Text style={styles.statLabel}>连续天数</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProgress.completedCourses}</Text>
                <Text style={styles.statLabel}>已完成</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderCategories = () => (
    <View style={styles.categoriesSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={20}
              color={selectedCategory === category.id ? '#fff' : '#667eea'}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCourses = () => (
    <View style={styles.coursesSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>推荐课程</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>查看全部</Text>
        </TouchableOpacity>
      </View>
      
      {courses.map((course) => (
        <TouchableOpacity key={course.id} style={styles.courseCard}>
          <LinearGradient
            colors={course.color}
            style={styles.courseGradient}
          >
            <View style={styles.courseHeader}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
                <View style={styles.courseMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.metaText}>{course.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="people-outline" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.metaText}>{course.students}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.metaText}>{course.rating}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{course.level}</Text>
              </View>
            </View>
            
            {course.progress > 0 && (
              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${course.progress}%` }]} 
                  />
                </View>
                <Text style={styles.progressText}>{course.progress}% 完成</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsSection}>
      <Text style={styles.sectionTitle}>我的成就</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementsContent}
      >
        {achievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              achievement.earned && styles.achievementCardEarned
            ]}
          >
            <View
              style={[
                styles.achievementIcon,
                achievement.earned && styles.achievementIconEarned
              ]}
            >
              <Ionicons
                name={achievement.icon}
                size={24}
                color={achievement.earned ? '#FFD700' : '#ccc'}
              />
            </View>
            <Text
              style={[
                styles.achievementTitle,
                achievement.earned && styles.achievementTitleEarned
              ]}
            >
              {achievement.title}
            </Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderCategories()}
        {renderCourses()}
        {renderAchievements()}
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
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchButton: {
    padding: 8,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  progressStats: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categoriesSection: {
    paddingVertical: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  categoryButtonActive: {
    backgroundColor: '#667eea',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667eea',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#fff',
  },
  coursesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  courseCard: {
    marginBottom: 16,
    borderRadius: 16,
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
  courseGradient: {
    padding: 20,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'right',
  },
  achievementsSection: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  achievementsContent: {
    paddingLeft: 0,
    paddingRight: 20,
  },
  achievementCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementCardEarned: {
    backgroundColor: '#fff5e6',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconEarned: {
    backgroundColor: '#fff',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementTitleEarned: {
    color: '#2c3e50',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ModernLearningScreen;

