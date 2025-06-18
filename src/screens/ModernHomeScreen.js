import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [user] = useState({
    name: 'Sarah',
    username: '@sarah_s',
    avatar: 'https://via.placeholder.com/150',
    learningProgress: 'Intermediate',
    culturalExchangeAchievements: 12,
    points: 2300,
    level: 5,
    experience: 2550,
    nextLevelExp: 3000
  });

  const [currentView, setCurrentView] = useState('profile');

  const culturalContent = [
    {
      id: 1,
      title: 'Exploring Balinese Dance',
      image: 'https://via.placeholder.com/400x300',
      author: 'Kapri Tanaka',
      country: 'Indonesia',
      duration: '2:06',
      type: 'video'
    },
    {
      id: 2,
      title: 'Traditional Tea Ceremony',
      image: 'https://via.placeholder.com/200x200',
      author: 'esrrucbo',
      country: 'Japan',
      duration: '41:05',
      type: 'video'
    },
    {
      id: 3,
      title: 'African Storytelling',
      image: 'https://via.placeholder.com/200x200',
      author: 'Etrakatia bmos',
      country: 'Ghana',
      duration: '12:09',
      type: 'audio'
    }
  ];

  const chatRooms = [
    { id: 1, name: '🇯🇵 Japanese Culture', members: 24 },
    { id: 2, name: '🇫🇷 French Learning', members: 18 },
    { id: 3, name: '🇪🇸 Spanish Exchange', members: 31 }
  ];

  const renderProfileView = () => (
    <LinearGradient
      colors={['#6B46C1', '#9333EA']}
      style={styles.profileContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🌈</Text>
            <Text style={styles.logoText}>CultureBridge</Text>
          </View>
        </View>

        {/* User Profile */}
        <View style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userUsername}>{user.username}</Text>
          
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.statCard}
            >
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>⭐</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statTitle}>Learning Progress</Text>
                <Text style={styles.statValue}>{user.learningProgress}</Text>
              </View>
            </LinearGradient>
            
            <LinearGradient
              colors={['#F59E0B', '#F97316']}
              style={styles.statCard}
            >
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>🤝</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statTitle}>Cultural Exchange</Text>
                <Text style={styles.statValue}>{user.culturalExchangeAchievements} achievements</Text>
              </View>
            </LinearGradient>
            
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.statCard}
            >
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>⭐</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statTitle}>积分收益</Text>
                <Text style={styles.statValue}>{user.points} 积分</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderFeedView = () => (
    <LinearGradient
      colors={['#1E3A8A', '#3730A3']}
      style={styles.feedContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.feedHeader}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🌉</Text>
            <Text style={styles.logoText}>CultureBridge</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>9BOOK</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.feedTitle}>Cultural Content Feed</Text>
        
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          {/* Featured Content */}
          <View style={styles.featuredContent}>
            <Image source={{ uri: culturalContent[0].image }} style={styles.featuredImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featuredOverlay}
            >
              <View style={styles.authorInfo}>
                <View style={styles.authorAvatar} />
                <Text style={styles.authorName}>{culturalContent[0].author}</Text>
                <Text style={styles.contentDuration}>⏱️ {culturalContent[0].duration}</Text>
              </View>
              <Text style={styles.featuredTitle}>{culturalContent[0].title}</Text>
            </LinearGradient>
          </View>
          
          {/* Content Grid */}
          <View style={styles.contentGrid}>
            {culturalContent.slice(1).map(content => (
              <TouchableOpacity key={content.id} style={styles.contentCard}>
                <Image source={{ uri: content.image }} style={styles.contentImage} />
                <View style={styles.contentInfo}>
                  <View style={styles.authorInfo}>
                    <View style={styles.smallAuthorAvatar} />
                    <Text style={styles.smallAuthorName}>{content.author}</Text>
                  </View>
                  <Text style={styles.smallDuration}>{content.duration}</Text>
                </View>
                {content.type === 'video' && (
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>▶️</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderChatView = () => (
    <LinearGradient
      colors={['#7C3AED', '#5B21B6']}
      style={styles.chatContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <Text style={styles.chatTitle}>Global Chat Rooms</Text>
        
        <ScrollView style={styles.chatScroll} showsVerticalScrollIndicator={false}>
          {chatRooms.map(room => (
            <TouchableOpacity key={room.id} style={styles.roomCard}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomMembers}>{room.members} members online</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return renderProfileView();
      case 'feed':
        return renderFeedView();
      case 'chat':
        return renderChatView();
      default:
        return renderProfileView();
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentView()}
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navItem, currentView === 'profile' && styles.navItemActive]}
          onPress={() => setCurrentView('profile')}
        >
          <Text style={[styles.navIcon, currentView === 'profile' && styles.navIconActive]}>👤</Text>
          <Text style={[styles.navLabel, currentView === 'profile' && styles.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navItem, currentView === 'feed' && styles.navItemActive]}
          onPress={() => setCurrentView('feed')}
        >
          <Text style={[styles.navIcon, currentView === 'feed' && styles.navIconActive]}>🌍</Text>
          <Text style={[styles.navLabel, currentView === 'feed' && styles.navLabelActive]}>Feed</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navItem, currentView === 'learning' && styles.navItemActive]}
          onPress={() => navigation.navigate('Learning')}
        >
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navLabel}>Learning</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navItem, currentView === 'chat' && styles.navItemActive]}
          onPress={() => setCurrentView('chat')}
        >
          <Text style={[styles.navIcon, currentView === 'chat' && styles.navIconActive]}>💬</Text>
          <Text style={[styles.navLabel, currentView === 'chat' && styles.navLabelActive]}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  
  // Profile View Styles
  profileContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  profileContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#F97316',
    overflow: 'hidden',
    marginBottom: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  userUsername: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
  },
  statsContainer: {
    width: '100%',
    gap: 20,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    gap: 20,
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconText: {
    fontSize: 32,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  
  // Feed View Styles
  feedContainer: {
    flex: 1,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30,
  },
  bookButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  feedTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    paddingHorizontal: 30,
    marginBottom: 30,
    lineHeight: 38,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 30,
  },
  featuredContent: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  authorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F97316',
  },
  authorName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  contentDuration: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    paddingBottom: 100,
  },
  contentCard: {
    width: (width - 75) / 2,
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  contentInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallAuthorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F97316',
  },
  smallAuthorName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  smallDuration: {
    color: 'white',
    fontSize: 10,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 16,
  },
  
  // Chat View Styles
  chatContainer: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    paddingHorizontal: 30,
    paddingTop: 60,
    marginBottom: 30,
  },
  chatScroll: {
    flex: 1,
    paddingHorizontal: 30,
  },
  roomCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  roomMembers: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Bottom Navigation Styles
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  navItemActive: {
    // Active state styling handled by text color
  },
  navIcon: {
    fontSize: 24,
    color: '#6B7280',
  },
  navIconActive: {
    color: '#6B46C1',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  navLabelActive: {
    color: '#6B46C1',
  },
});

