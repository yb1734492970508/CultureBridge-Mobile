import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: '1', name: '历史', icon: 'hourglass-outline', color: '#FF6347' },
  { id: '2', name: '艺术', icon: 'color-palette-outline', color: '#4682B4' },
  { id: '3', name: '哲学', icon: 'bulb-outline', color: '#3CB371' },
  { id: '4', name: '风俗', icon: 'people-outline', color: '#DAA520' },
  { id: '5', name: '美食', icon: 'fast-food-outline', color: '#FF69B4' },
  { id: '6', name: '音乐', icon: 'musical-notes-outline', color: '#8A2BE2' },
  { id: '7', name: '科技', icon: 'laptop-outline', color: '#00CED1' },
  { id: '8', name: '时尚', icon: 'shirt-outline', color: '#FFD700' },
];

const featuredCourses = [
  {
    id: 'c1',
    title: '中国传统文化概览',
    image: 'https://images.unsplash.com/photo-1547989453-010379057888?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '深入了解中国的历史、哲学、艺术和风俗习惯。',
    progress: 75,
  },
  {
    id: 'c2',
    title: '日本动漫与次文化',
    image: 'https://images.unsplash.com/photo-1503756234508-e32369269eb3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '了解日本动漫、漫画、J-Pop和独特青年文化。',
    progress: 50,
  },
  {
    id: 'c3',
    title: '法国艺术与美食',
    image: 'https://images.unsplash.com/photo-1502602898664-343733af70e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '品味法国的绘画、雕塑、建筑和世界闻名的烹饪艺术。',
    progress: 0,
  },
];

export default function Home() {
  const navigation = useNavigation();

  const renderCategory = (category) => (
    <TouchableOpacity key={category.id} style={styles.categoryCard}>
      <Ionicons name={category.icon} size={36} color={category.color} />
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  const renderCourseCard = (course) => (
    <TouchableOpacity
      key={course.id}
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: course.id, courseTitle: course.title })}
    >
      <ImageBackground source={{ uri: course.image }} style={styles.courseImage}>
        <View style={styles.courseOverlay}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          {course.progress > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${course.progress}%` }]} />
            </View>
          )}
        </View>
      </ImageBackground>
      <Text style={styles.courseDescription}>{course.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>你好, 探索者!</Text>
        <Text style={styles.tagline}>开启你的文化之旅</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>探索文化类别</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {categories.map(renderCategory)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>精选课程</Text>
        <View style={styles.coursesContainer}>
          {featuredCourses.map(renderCourseCard)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最新活动</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>全球文化交流周</Text>
          <Text style={styles.activityDescription}>参与线上研讨会，与世界各地的文化爱好者交流。</Text>
          <TouchableOpacity style={styles.activityButton}>
            <Text style={styles.activityButtonText}>了解更多</Text>
          </TouchableOpacity>
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
  header: {
    padding: 20,
    backgroundColor: '#6A5ACD',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingVertical: 10,
  },
  categoryCard: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginTop: 8,
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    width: '48%', // Approximately half width with some spacing
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseImage: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
  },
  courseOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  courseDescription: {
    fontSize: 13,
    color: '#666666',
    padding: 10,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3CB371',
    borderRadius: 5,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  activityButton: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  activityButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

