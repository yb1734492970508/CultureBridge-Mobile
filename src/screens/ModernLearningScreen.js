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
        title: t('learning.japaneseConversation'),
        subtitle: t('learning.japaneseConversationDesc'),
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
        title: t('learning.spanishSpeaking'),
        subtitle: t('learning.spanishSpeakingDesc'),
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
        title: t('learning.japaneseTeaCulture'),
        subtitle: t('learning.japaneseTeaCultureDesc'),
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
        title: t('learning.italianFoodCulture'),
        subtitle: t('learning.italianFoodCultureDesc'),
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
        title: t('learning.frenchPronunciation'),
        subtitle: t('learning.frenchPronunciationDesc'),
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
        title: t('learning.indianYogaPhilosophy'),
        subtitle: t('learning.indianYogaPhilosophyDesc'),
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
    { id: 'all', name: t('learning.all'), icon: 'apps' },
    { id: 'language', name: t('learning.languageLearning'), icon: 'chatbubbles' },
    { id: 'culture', name: t('learning.cultureExploration'), icon: 'globe' },
    { id: 'practice', name: t('learning.practiceExercises'), icon: 'fitness' }
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
              <Text style={styles.metaText}>{item.lessons}{t('learning.lessons')}</Text>
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
            <Text style={styles.studentsText}>{item.students}{t('learning.studentsLearning')}</Text>
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
            <Text style={styles.statLabel}>{t('learning.studyDuration')}</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.statGradient}
          >
            <Ionicons name="trophy" size={24} color="white" />
            <Text style={styles.statNumber}>{progress.completedCourses}</Text>
            <Text style={styles.statLabel}>{t('learning.completedCourses')}</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.statGradient}
          >
            <Ionicons name="flame" size={24} color="white" />
            <Text style={styles.statNumber}>{progress.currentStreak}</Text>
            <Text style={styles.statLabel}>{t('learning.currentStreak')}</Text>
          </LinearGradient>
        </View>
      </View>
      
      <View style={styles.weeklyGoal}>
        <Text style={styles.goalTitle}>{t('learning.weeklyGoal')}</Text>
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
            {progress.weeklyProgress}/{progress.weeklyGoal} {t('learning.courses')}
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
        <SafeAreaView>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t('learning.title')}</Text>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {renderStats()}
        </SafeAreaView>
      </LinearGradient>

      {/* 分类 */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
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
                color={activeCategory === category.id ? '#fff' : '#667eea'}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  activeCategory === category.id && styles.activeCategoryButtonText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 课程列表 */}
      <FlatList
        data={filteredData}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.coursesListContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>{t('learning.noCourses')}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 3,
    height: 100,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  weeklyGoal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: '#E0E7FF',
    borderRadius: 4,
    marginRight: 10,
  },
  goalFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesContainer: {
    marginTop: -20,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  categoriesScrollContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#667eea',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 5,
  },
  activeCategoryButtonText: {
    color: 'white',
  },
  coursesListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseGradient: {
    padding: 15,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseImage: {
    fontSize: 30,
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  courseContent: {
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  courseSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  courseMeta: {
    flexDirection: 'row',
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 5,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
    textAlign: 'right',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  studentsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ModernLearningScreen;

