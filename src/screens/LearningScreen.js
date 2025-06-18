import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 为 iOS 创建一个简单的进度条组件
const ProgressBar = ({ progress, style }) => {
  if (Platform.OS === 'android') {
    return <ProgressBarAndroid styleAttr="Horizontal" progress={progress} style={style} />;
  }
  
  return (
    <View style={[styles.progressBarContainer, style]}>
      <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
    </View>
  );
};

export default function LearningScreen() {
  const courses = [
    {
      id: 1,
      title: '英语基础课程',
      description: '从零开始学习英语',
      progress: 0.6,
      lessons: 20,
      completed: 12,
      difficulty: '初级',
      icon: '🇺🇸',
    },
    {
      id: 2,
      title: '日语入门',
      description: '学习日语假名和基础语法',
      progress: 0.3,
      lessons: 15,
      completed: 5,
      difficulty: '初级',
      icon: '🇯🇵',
    },
    {
      id: 3,
      title: '法语发音',
      description: '掌握法语发音技巧',
      progress: 0.8,
      lessons: 10,
      completed: 8,
      difficulty: '中级',
      icon: '🇫🇷',
    },
  ];

  const achievements = [
    { id: 1, title: '连续学习7天', icon: '🔥', unlocked: true },
    { id: 2, title: '完成第一课', icon: '🎯', unlocked: true },
    { id: 3, title: '语音练习达人', icon: '🎤', unlocked: false },
    { id: 4, title: '文化探索者', icon: '🌍', unlocked: true },
  ];

  const dailyGoals = {
    lessons: { current: 2, target: 3 },
    minutes: { current: 25, target: 30 },
    words: { current: 15, target: 20 },
  };

  return (
    <ScrollView style={styles.container}>
      {/* 每日目标 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>今日目标</Text>
        <View style={styles.goalsContainer}>
          <View style={styles.goalItem}>
            <Ionicons name="book-outline" size={20} color="#007AFF" />
            <Text style={styles.goalLabel}>课程</Text>
            <Text style={styles.goalProgress}>
              {dailyGoals.lessons.current}/{dailyGoals.lessons.target}
            </Text>
          </View>
          <View style={styles.goalItem}>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
            <Text style={styles.goalLabel}>分钟</Text>
            <Text style={styles.goalProgress}>
              {dailyGoals.minutes.current}/{dailyGoals.minutes.target}
            </Text>
          </View>
          <View style={styles.goalItem}>
            <Ionicons name="library-outline" size={20} color="#007AFF" />
            <Text style={styles.goalLabel}>单词</Text>
            <Text style={styles.goalProgress}>
              {dailyGoals.words.current}/{dailyGoals.words.target}
            </Text>
          </View>
        </View>
      </View>

      {/* 我的课程 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>我的课程</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>
        
        {courses.map((course) => (
          <TouchableOpacity key={course.id} style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <Text style={styles.courseIcon}>{course.icon}</Text>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.difficulty}>{course.difficulty}</Text>
                  <Text style={styles.lessonCount}>
                    {course.completed}/{course.lessons} 课程
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <ProgressBar progress={course.progress} style={styles.courseProgress} />
              <Text style={styles.progressText}>
                {Math.round(course.progress * 100)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 成就徽章 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>成就徽章</Text>
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement) => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementItem,
                !achievement.unlocked && styles.achievementLocked
              ]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={[
                styles.achievementTitle,
                !achievement.unlocked && styles.achievementTitleLocked
              ]}>
                {achievement.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 学习统计 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>学习统计</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>学习天数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2,340</Text>
            <Text style={styles.statLabel}>学习分钟</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>掌握单词</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>完成课程</Text>
          </View>
        </View>
      </View>

      {/* 推荐课程 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>推荐课程</Text>
        <TouchableOpacity style={styles.recommendedCourse}>
          <View style={styles.recommendedIcon}>
            <Ionicons name="star" size={24} color="#FFD700" />
          </View>
          <View style={styles.recommendedContent}>
            <Text style={styles.recommendedTitle}>商务英语进阶</Text>
            <Text style={styles.recommendedDescription}>
              提升职场英语沟通能力
            </Text>
            <View style={styles.recommendedMeta}>
              <Text style={styles.recommendedDifficulty}>中级</Text>
              <Text style={styles.recommendedLessons}>25 课程</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  goalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalItem: {
    alignItems: 'center',
    flex: 1,
  },
  goalLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 2,
  },
  courseCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  courseHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  courseIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficulty: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  lessonCount: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseProgress: {
    flex: 1,
    marginRight: 10,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    alignItems: 'center',
    width: '48%',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  recommendedCourse: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  recommendedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recommendedContent: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recommendedDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recommendedMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendedDifficulty: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recommendedLessons: {
    fontSize: 12,
    color: '#666',
  },
});

