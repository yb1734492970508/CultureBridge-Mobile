import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  SafeAreaView,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ModernProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('achievements');

  const userProfile = {
    name: "Sarah",
    username: "@sarah_s",
    avatar: "👩🏻‍🦱",
    level: "Intermediate",
    points: 2300,
    streak: 15,
    languagesLearning: 3,
    culturesExplored: 12,
    friendsConnected: 89
  };

  const achievements = [
    {
      id: 1,
      title: "Cultural Explorer",
      description: "Explored 10+ different cultures",
      icon: "🌍",
      progress: 12,
      total: 15,
      color: ['#FF6B6B', '#FF8E53']
    },
    {
      id: 2,
      title: "Language Master",
      description: "Completed 50 language lessons",
      icon: "🗣️",
      progress: 47,
      total: 50,
      color: ['#4ECDC4', '#44A08D']
    },
    {
      id: 3,
      title: "Social Butterfly",
      description: "Connected with 100 learners",
      icon: "👥",
      progress: 89,
      total: 100,
      color: ['#667eea', '#764ba2']
    },
    {
      id: 4,
      title: "Streak Champion",
      description: "Maintained 30-day learning streak",
      icon: "🔥",
      progress: 15,
      total: 30,
      color: ['#f093fb', '#f5576c']
    }
  ];

  const learningStats = [
    {
      label: "Languages Learning",
      value: userProfile.languagesLearning,
      icon: "🌐",
      color: '#667eea'
    },
    {
      label: "Cultures Explored",
      value: userProfile.culturesExplored,
      icon: "🏛️",
      color: '#4ECDC4'
    },
    {
      label: "Friends Connected",
      value: userProfile.friendsConnected,
      icon: "👥",
      color: '#FF6B6B'
    },
    {
      label: "Current Streak",
      value: `${userProfile.streak} days`,
      icon: "🔥",
      color: '#f093fb'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "lesson",
      title: "Completed Spanish Conversation",
      time: "2 hours ago",
      points: "+50 points",
      icon: "📚"
    },
    {
      id: 2,
      type: "culture",
      title: "Explored Japanese Tea Ceremony",
      time: "1 day ago",
      points: "+75 points",
      icon: "🍵"
    },
    {
      id: 3,
      type: "social",
      title: "Connected with Maria from Spain",
      time: "2 days ago",
      points: "+25 points",
      icon: "🤝"
    },
    {
      id: 4,
      type: "achievement",
      title: "Earned Cultural Explorer badge",
      time: "3 days ago",
      points: "+100 points",
      icon: "🏆"
    }
  ];

  const renderAchievement = ({ item }) => (
    <View style={styles.achievementCard}>
      <LinearGradient
        colors={item.color}
        style={styles.achievementGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementIcon}>{item.icon}</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>{item.title}</Text>
            <Text style={styles.achievementDescription}>{item.description}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(item.progress / item.total) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{item.progress}/{item.total}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderActivity = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
      <Text style={styles.activityPoints}>{item.points}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Profile Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.profileHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{userProfile.avatar}</Text>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userHandle}>{userProfile.username}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{userProfile.level}</Text>
          </View>
        </View>

        {/* Points Display */}
        <View style={styles.pointsContainer}>
          <View style={styles.pointsCard}>
            <Text style={styles.pointsIcon}>💎</Text>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Total Points</Text>
              <Text style={styles.pointsValue}>{userProfile.points.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          {learningStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Text style={styles.statEmoji}>{stat.icon}</Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
          onPress={() => setActiveTab('activity')}
        >
          <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'achievements' ? (
          <View style={styles.achievementsContainer}>
            <FlatList
              data={achievements}
              renderItem={renderAchievement}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.achievementsList}
            />
          </View>
        ) : (
          <View style={styles.activityContainer}>
            <FlatList
              data={recentActivity}
              renderItem={renderActivity}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.activityList}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  profileHeader: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatar: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  pointsContainer: {
    width: '100%',
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pointsIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  statsContainer: {
    padding: 20,
    paddingTop: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    width: (width - 56) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#718096',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  achievementsContainer: {
    paddingHorizontal: 20,
  },
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  achievementGradient: {
    padding: 20,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  activityContainer: {
    paddingHorizontal: 20,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#718096',
  },
  activityPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
});

export default ModernProfileScreen;

