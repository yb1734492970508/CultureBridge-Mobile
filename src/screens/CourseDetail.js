import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const mockCourses = [
  {
    id: 'c1',
    title: '中国传统文化概览',
    image: 'https://images.unsplash.com/photo-1547989453-010379057888?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '深入了解中国的历史、哲学、艺术和风俗习惯。',
    content: '本课程将带您领略中国传统文化的博大精深，从儒家思想、道家哲学到诗词歌赋、书法绘画，再到传统节日和民间艺术，全面展现中华文明的独特魅力。您将学习到中国传统文化的形成与发展，理解其核心价值观，并欣赏到丰富多彩的文化遗产。',
    difficulty: '初级',
    duration: '60分钟',
    points: 100,
    tags: ['历史', '哲学', '艺术', '风俗'],
  },
  {
    id: 'c2',
    title: '日本动漫与次文化',
    image: 'https://images.unsplash.com/photo-1503756234508-e32369269eb3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '了解日本动漫、漫画、J-Pop和独特青年文化。',
    content: '本课程将带您走进日本动漫的奇妙世界，从经典作品到最新潮流，深入探讨其艺术风格、叙事技巧和全球影响力。同时，您还将了解到日本独特的次文化，如Cosplay、偶像文化和电子游戏，以及它们如何塑造了日本年轻一代的生活方式和价值观。',
    difficulty: '中级',
    duration: '75分钟',
    points: 120,
    tags: ['动漫', '漫画', 'J-Pop', '青年文化'],
  },
  {
    id: 'c3',
    title: '法国艺术与美食',
    image: 'https://images.unsplash.com/photo-1502602898664-343733af70e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '品味法国的绘画、雕塑、建筑和世界闻名的烹饪艺术。',
    content: '本课程将带领您沉浸在法国的艺术与美食之中。您将探索法国绘画大师的杰作、哥特式教堂的宏伟建筑、卢浮宫的珍藏，并了解法国艺术史的演变。此外，课程还将介绍法国烹饪的精髓，从米其林星级餐厅到地方特色小吃，让您领略法式美食的独特魅力和文化内涵。',
    difficulty: '高级',
    duration: '120分钟',
    points: 200,
    tags: ['艺术', '美食', '绘画', '建筑'],
  },
];

export default function CourseDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate fetching course data
    const fetchedCourse = mockCourses.find(c => c.id === courseId);
    if (fetchedCourse) {
      setCourse(fetchedCourse);
      // Simulate checking enrollment status and progress
      // In a real app, this would involve API calls to backend
      if (courseId === 'c1') { // Example: user is enrolled in c1 with 75% progress
        setIsEnrolled(true);
        setProgress(75);
      } else if (courseId === 'c2') { // Example: user is enrolled in c2 with 50% progress
        setIsEnrolled(true);
        setProgress(50);
      } else {
        setIsEnrolled(false);
        setProgress(0);
      }
    }
    setLoading(false);
  }, [courseId]);

  const handleEnroll = () => {
    Alert.alert(
      '确认报名',
      `您确定要报名 ${course.title} 课程吗？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '确认', onPress: () => {
            // Simulate enrollment API call
            setLoading(true);
            setTimeout(() => {
              setIsEnrolled(true);
              setProgress(0);
              setLoading(false);
              Alert.alert('报名成功', `您已成功报名 ${course.title}！`);
            }, 1000);
          }
        },
      ]
    );
  };

  const handleContinueLearning = () => {
    Alert.alert(
      '继续学习',
      `您将继续学习 ${course.title} 课程。`,
      [
        { text: '好的', onPress: () => console.log('继续学习') },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text style={styles.loadingText}>加载课程详情...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>课程未找到。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={{ uri: course.image }} style={styles.imageBackground}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="hourglass-outline" size={20} color="#6A5ACD" />
            <Text style={styles.infoText}>{course.duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cellular-outline" size={20} color="#6A5ACD" />
            <Text style={styles.infoText}>{course.difficulty}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="trophy-outline" size={20} color="#6A5ACD" />
            <Text style={styles.infoText}>{course.points} 积分</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>课程介绍</Text>
        <Text style={styles.sectionContent}>{course.content}</Text>

        <Text style={styles.sectionHeader}>标签</Text>
        <View style={styles.tagsContainer}>
          {course.tags.map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {isEnrolled ? (
          <View style={styles.enrollmentStatus}>
            <Text style={styles.enrollmentText}>您已报名此课程</Text>
            <View style={styles.progressBarWrapper}>
              <View style={[styles.progressBarBase, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>学习进度: {progress}%</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleContinueLearning}>
              <Text style={styles.actionButtonText}>继续学习</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={handleEnroll}>
            <Text style={styles.actionButtonText}>立即报名</Text>
          </TouchableOpacity>
        )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  imageBackground: {
    width: '100%',
    height: 250,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  contentContainer: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    marginTop: 5,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    marginTop: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tagBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    color: '#555555',
  },
  actionButton: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  enrollmentStatus: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  enrollmentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  progressBarWrapper: {
    width: '100%',
    height: 8,
    backgroundColor: '#C8E6C9',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressBarBase: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#2E7D32',
  },
});

