import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const mockCourses = [
  {
    id: 'c1',
    title: '中国传统文化概览',
    image: 'https://images.unsplash.com/photo-1547989453-010379057888?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '深入了解中国的历史、哲学、艺术和风俗习惯。',
    difficulty: '初级',
    points: 100,
    country: 'china',
  },
  {
    id: 'c2',
    title: '美国流行文化',
    image: 'https://images.unsplash.com/photo-1516251193007-455270677a17?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '探索美国电影、音乐、时尚和科技如何影响全球。',
    difficulty: '中级',
    points: 150,
    country: 'usa',
  },
  {
    id: 'c3',
    title: '日本动漫与次文化',
    image: 'https://images.unsplash.com/photo-1503756234508-e32369269eb3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '了解日本动漫、漫画、J-Pop和独特青年文化。',
    difficulty: '初级',
    points: 120,
    country: 'japan',
  },
  {
    id: 'c4',
    title: '法国艺术与美食',
    image: 'https://images.unsplash.com/photo-1502602898664-343733af70e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '品味法国的绘画、雕塑、建筑和世界闻名的烹饪艺术。',
    difficulty: '高级',
    points: 200,
    country: 'france',
  },
  {
    id: 'c5',
    title: '德国工业与哲学',
    image: 'https://images.unsplash.com/photo-1523784003020-81992013919e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '解析德国的工业革命、古典哲学和现代科技创新。',
    difficulty: '中级',
    points: 160,
    country: 'germany',
  },
  {
    id: 'c6',
    title: '意大利文艺复兴',
    image: 'https://images.unsplash.com/photo-1529253355930-dd3811186320?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '重温意大利文艺复兴时期的辉煌艺术、文学和科学成就。',
    difficulty: '高级',
    points: 180,
    country: 'italy',
  },
  {
    id: 'c7',
    title: '西班牙弗拉门戈与斗牛',
    image: 'https://images.unsplash.com/photo-1560928960-93716942004a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '体验西班牙独特的弗拉门戈舞蹈、音乐和传统斗牛文化。',
    difficulty: '初级',
    points: 90,
    country: 'spain',
  },
  {
    id: 'c8',
    title: '韩国流行音乐与时尚',
    image: 'https://images.unsplash.com/photo-1580971033971-06769123013a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '分析K-Pop、韩剧、韩国美妆和时尚潮流的全球影响力。',
    difficulty: '中级',
    points: 140,
    country: 'korea',
  },
  {
    id: 'c9',
    title: '印度瑜伽与哲学',
    image: 'https://images.unsplash.com/photo-1552196563-55cd13ea31ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '学习印度瑜伽的起源、体式、冥想和古老哲学思想。',
    difficulty: '初级',
    points: 110,
    country: 'india',
  },
  {
    id: 'c10',
    title: '巴西桑巴与狂欢节',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd458ce93?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '感受巴西桑巴舞的节奏、狂欢节的激情和多元文化。',
    difficulty: '中级',
    points: 130,
    country: 'brazil',
  },
];

const countries = [
  { name: '全部', value: 'all' },
  { name: '中国', value: 'china' },
  { name: '美国', value: 'usa' },
  { name: '日本', value: 'japan' },
  { name: '法国', value: 'france' },
  { name: '德国', value: 'germany' },
  { name: '意大利', value: 'italy' },
  { name: '西班牙', value: 'spain' },
  { name: '韩国', value: 'korea' },
  { name: '印度', value: 'india' },
  { name: '巴西', value: 'brazil' },
];

const difficulties = [
  { name: '全部', value: 'all' },
  { name: '初级', value: '初级' },
  { name: '中级', value: '中级' },
  { name: '高级', value: '高级' },
];

export default function Courses() {
  const navigation = useNavigation();
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);

  useEffect(() => {
    // Simulate filtering courses
    setLoading(true);
    setTimeout(() => {
      let tempCourses = mockCourses;
      if (selectedCountry !== 'all') {
        tempCourses = tempCourses.filter(course => course.country === selectedCountry);
      }
      if (selectedDifficulty !== 'all') {
        tempCourses = tempCourses.filter(course => course.difficulty === selectedDifficulty);
      }
      setFilteredCourses(tempCourses);
      setLoading(false);
    }, 300);
  }, [selectedCountry, selectedDifficulty]);

  const renderCourseCard = (course) => (
    <TouchableOpacity
      key={course.id}
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: course.id, courseTitle: course.title })}
    >
      <ImageBackground source={{ uri: course.image }} style={styles.courseImage}>
        <View style={styles.courseOverlay}>
          <Text style={styles.courseTitle}>{course.title}</Text>
        </View>
      </ImageBackground>
      <View style={styles.courseInfo}>
        <Text style={styles.courseDescription}>{course.description}</Text>
        <View style={styles.courseMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="cellular-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{course.difficulty}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="trophy-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{course.points} 积分</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>探索课程</Text>
        <Text style={styles.headerSubtitle}>发现世界各地的文化知识</Text>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {countries.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.filterButton, selectedCountry === item.value && styles.filterButtonActive]}
              onPress={() => setSelectedCountry(item.value)}
            >
              <Text style={[styles.filterButtonText, selectedCountry === item.value && styles.filterButtonTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {difficulties.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.filterButton, selectedDifficulty === item.value && styles.filterButtonActive]}
              onPress={() => setSelectedDifficulty(item.value)}
            >
              <Text style={[styles.filterButtonText, selectedDifficulty === item.value && styles.filterButtonTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5ACD" />
          <Text style={styles.loadingText}>加载课程中...</Text>
        </View>
      ) : filteredCourses.length > 0 ? (
        <View style={styles.coursesGrid}>
          {filteredCourses.map(renderCourseCard)}
        </View>
      ) : (
        <View style={styles.noResultsContainer}>
          <Ionicons name="sad-outline" size={50} color="#999" />
          <Text style={styles.noResultsText}>没有找到符合条件的课程。</Text>
        </View>
      )}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterScrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#6A5ACD',
    borderColor: '#6A5ACD',
  },
  filterButtonText: {
    color: '#555555',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  courseCard: {
    width: '48%', // Adjust as needed for spacing
    marginBottom: 15,
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
  courseInfo: {
    padding: 10,
  },
  courseDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#999',
    marginTop: 10,
  },
});

