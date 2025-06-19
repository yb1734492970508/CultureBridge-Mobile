import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
<<<<<<< HEAD
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
=======
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../services/I18nService';
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3

const { width, height } = Dimensions.get('window');

const ModernLearningScreen = ({ navigation }) => {
<<<<<<< HEAD
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
=======
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState('all');
  const [learningData, setLearningData] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    loadLearningData();
    loadProgress();
  }, []);

  const loadLearningData = () => {
    setLearningData([
      {
        id: 1,
        title: '日语基础会话',
        subtitle: '从零开始学习日语',
        language: 'Japanese',
        level: 'Beginner',
        duration: '30分钟',
        lessons: 12,
        completed: 8,
        rating: 4.8,
        students: 1234,
        image: '🇯🇵',
        category: 'language',
        color: ['#FF6B6B', '#FF8E8E']
      },
      {
        id: 2,
        title: '西班牙语口语练习',
        subtitle: '提升西班牙语口语能力',
        language: 'Spanish',
        level: 'Intermediate',
        duration: '45分钟',
        lessons: 15,
        completed: 5,
        rating: 4.9,
        students: 2156,
        image: '🇪🇸',
        category: 'language',
        color: ['#4ECDC4', '#44A08D']
      },
      {
        id: 3,
        title: '日本茶道文化',
        subtitle: '深入了解日本茶道精神',
        language: 'Chinese',
        level: 'All Levels',
        duration: '60分钟',
        lessons: 8,
        completed: 3,
        rating: 4.7,
        students: 856,
        image: '🍵',
        category: 'culture',
        color: ['#A8E6CF', '#7FCDCD']
      },
      {
        id: 4,
        title: '意大利美食文化',
        subtitle: '探索意大利饮食传统',
        language: 'Italian',
        level: 'Beginner',
        duration: '40分钟',
        lessons: 10,
        completed: 0,
        rating: 4.6,
        students: 1567,
        image: '🍝',
        category: 'culture',
        color: ['#FFD93D', '#6BCF7F']
      },
      {
        id: 5,
        title: '法语发音训练',
        subtitle: '掌握标准法语发音',
        language: 'French',
        level: 'Beginner',
        duration: '25分钟',
        lessons: 20,
        completed: 12,
        rating: 4.5,
        students: 987,
        image: '🇫🇷',
        category: 'language',
        color: ['#667eea', '#764ba2']
      },
      {
        id: 6,
        title: '印度瑜伽哲学',
        subtitle: '了解瑜伽的精神内涵',
        language: 'English',
        level: 'All Levels',
        duration: '50分钟',
        lessons: 6,
        completed: 2,
        rating: 4.8,
        students: 2341,
        image: '🧘',
        category: 'culture',
        color: ['#f093fb', '#f5576c']
      }
    ]);
  };

  const loadProgress = () => {
    setProgress({
      totalHours: 45,
      completedCourses: 8,
      currentStreak: 12,
      weeklyGoal: 5,
      weeklyProgress: 3
    });
  };

  const categories = [
    { id: 'all', name: '全部', icon: 'apps' },
    { id: 'language', name: '语言学习', icon: 'chatbubbles' },
    { id: 'culture', name: '文化探索', icon: 'globe' },
    { id: 'practice', name: '实践练习', icon: 'fitness' }
  ];

  const filteredData = activeCategory === 'all' 
    ? learningData 
    : learningData.filter(item => item.category === activeCategory);

  const renderCourse = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => {
        console.log('Open course:', item.title);
      }}
    >
      <LinearGradient
        colors={item.color}
        style={styles.courseGradient}
      >
        <View style={styles.courseHeader}>
          <Text style={styles.courseImage}>{item.image}</Text>
          <View style={styles.courseRating}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.courseContent}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseSubtitle}>{item.subtitle}</Text>
          
          <View style={styles.courseMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="book" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{item.lessons}课</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(item.completed / item.lessons) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {item.completed}/{item.lessons}
            </Text>
          </View>
          
          <View style={styles.courseFooter}>
            <Text style={styles.levelText}>{item.level}</Text>
            <Text style={styles.studentsText}>{item.students}人学习</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.statGradient}
          >
            <Ionicons name="time" size={24} color="white" />
            <Text style={styles.statNumber}>{progress.totalHours}</Text>
            <Text style={styles.statLabel}>学习时长</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.statGradient}
          >
            <Ionicons name="trophy" size={24} color="white" />
            <Text style={styles.statNumber}>{progress.completedCourses}</Text>
            <Text style={styles.statLabel}>完成课程</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.statGradient}
          >
            <Ionicons name="flame" size={24} color="white" />
            <Text style={styles.statNumber}>{progress.currentStreak}</Text>
            <Text style={styles.statLabel}>连续天数</Text>
          </LinearGradient>
        </View>
      </View>
      
      <View style={styles.weeklyGoal}>
        <Text style={styles.goalTitle}>本周目标</Text>
        <View style={styles.goalProgress}>
          <View style={styles.goalBar}>
            <View 
              style={[
                styles.goalFill, 
                { width: `${(progress.weeklyProgress / progress.weeklyGoal) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.goalText}>
            {progress.weeklyProgress}/{progress.weeklyGoal} 课程
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>{t('learning.title')}</Text>
            <Text style={styles.headerSubtitle}>继续你的学习之旅</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 统计数据 */}
        {renderStats()}
        
        {/* 分类标签 */}
        <View style={styles.categoriesContainer}>
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
                  activeCategory === category.id && styles.activeCategoryButton
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Ionicons 
                  name={category.icon} 
                  size={20} 
                  color={activeCategory === category.id ? 'white' : '#6B7280'} 
                />
                <Text style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.activeCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* 课程列表 */}
        <View style={styles.coursesContainer}>
          <Text style={styles.sectionTitle}>推荐课程</Text>
          <FlatList
            data={filteredData}
            renderItem={renderCourse}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.courseRow}
            scrollEnabled={false}
            contentContainerStyle={styles.coursesList}
          />
        </View>
      </ScrollView>
    </View>
  );
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
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
=======
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F8FAFC',
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 15,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  weeklyGoal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 10,
  },
  goalFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoriesContainer: {
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
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCategoryButton: {
    backgroundColor: '#667eea',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 6,
  },
  activeCategoryText: {
    color: 'white',
  },
  coursesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  coursesList: {
    paddingBottom: 20,
  },
  courseRow: {
    justifyContent: 'space-between',
  },
  courseCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  courseGradient: {
    padding: 15,
    minHeight: 220,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  courseImage: {
    fontSize: 32,
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 12,
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
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
  courseMeta: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBar: {
<<<<<<< HEAD
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
=======
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
<<<<<<< HEAD
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
=======
    color: 'white',
    fontWeight: 'bold',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  studentsText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
});

export default ModernLearningScreen;

