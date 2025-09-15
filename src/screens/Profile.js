import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockUser = {
  name: '探索者小明',
  email: 'xiaoming@example.com',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=探索者小明',
  level: 5,
  totalPoints: 1250,
  learningStreak: 7,
};

const mockUserProgress = [
  {
    id: 'up1',
    courseId: 'c1',
    courseTitle: '中国传统文化概览',
    status: 'completed',
    progress: 100,
    pointsEarned: 100,
    completionDate: '2025-09-10',
  },
  {
    id: 'up2',
    courseId: 'c2',
    courseTitle: '日本动漫与次文化',
    status: 'in_progress',
    progress: 50,
    pointsEarned: 0,
    completionDate: null,
  },
  {
    id: 'up3',
    courseId: 'c3',
    courseTitle: '法国艺术与美食',
    status: 'not_started',
    progress: 0,
    pointsEarned: 0,
    completionDate: null,
  },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data and progress
    setTimeout(() => {
      setUser(mockUser);
      setUserProgress(mockUserProgress);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text style={styles.loadingText}>加载个人资料...</Text>
      </View>
    );
  }

  const completedCourses = userProgress.filter(p => p.status === 'completed');
  const inProgressCourses = userProgress.filter(p => p.status === 'in_progress');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="trophy-outline" size={24} color="#FFD700" />
            <Text style={styles.statValue}>{user.level}</Text>
            <Text style={styles.statLabel}>等级</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star-outline" size={24} color="#FF6347" />
            <Text style={styles.statValue}>{user.totalPoints}</Text>
            <Text style={styles.statLabel}>积分</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={24} color="#FFA500" />
            <Text style={styles.statValue}>{user.learningStreak}</Text>
            <Text style={styles.statLabel}>连击</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>我的课程</Text>
        {inProgressCourses.length > 0 && (
          <View style={styles.courseList}>
            <Text style={styles.courseListTitle}>进行中</Text>
            {inProgressCourses.map(course => (
              <View key={course.id} style={styles.courseCard}>
                <Text style={styles.courseCardTitle}>{course.courseTitle}</Text>
                <Text style={styles.courseCardProgress}>进度: {course.progress}%</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${course.progress}%` }]} />
                </View>
              </View>
            ))}
          </View>
        )}
        {completedCourses.length > 0 && (
          <View style={styles.courseList}>
            <Text style={styles.courseListTitle}>已完成</Text>
            {completedCourses.map(course => (
              <View key={course.id} style={styles.courseCard}>
                <Text style={styles.courseCardTitle}>{course.courseTitle}</Text>
                <Text style={styles.courseCardProgress}>完成日期: {course.completionDate}</Text>
                <Text style={styles.courseCardPoints}>获得积分: {course.pointsEarned}</Text>
              </View>
            ))}
          </View>
        )}
        {userProgress.length === 0 && (
          <Text style={styles.noCoursesText}>您还没有开始任何课程。</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>我的成就</Text>
        <View style={styles.achievementsContainer}>
          <View style={styles.achievementCard}>
            <Ionicons name="medal-outline" size={36} color="#4CAF50" />
            <Text style={styles.achievementText}>初级探索者</Text>
          </View>
          <View style={styles.achievementCard}>
            <Ionicons name="ribbon-outline" size={36} color="#2196F3" />
            <Text style={styles.achievementText}>文化桥梁建造者</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#6A5ACD',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  courseList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
    marginBottom: 10,
  },
  courseCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  courseCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  courseCardProgress: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  courseCardPoints: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  noCoursesText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginTop: 5,
    textAlign: 'center',
  },
});

