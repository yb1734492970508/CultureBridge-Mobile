import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../services/I18nService';

const { width, height } = Dimensions.get('window');

const ModernLearningScreen = ({ navigation }) => {
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
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
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
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
  },
});

export default ModernLearningScreen;

