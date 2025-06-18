import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LearningScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('culture');
  
  const languages = [
    { id: 'japanese', name: '日语', flag: '🇯🇵', level: 'Intermediate', progress: 65 },
    { id: 'french', name: '法语', flag: '🇫🇷', level: 'Beginner', progress: 30 },
    { id: 'spanish', name: '西班牙语', flag: '🇪🇸', level: 'Advanced', progress: 85 },
    { id: 'korean', name: '韩语', flag: '🇰🇷', level: 'Beginner', progress: 15 }
  ];

  const culturalContent = [
    {
      id: 1,
      title: 'Exploring Balinese Dance',
      description: '深入了解巴厘岛传统舞蹈的历史和文化意义',
      image: '🏛️',
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      title: 'Japanese Tea Ceremony',
      description: '体验日本茶道的精神和仪式',
      image: '🍵',
      difficulty: 'Beginner'
    }
  ];

  const translationExercise = {
    question: "'a pomme",
    options: ['apple', 'pear', 'grapes'],
    correct: 0
  };

  const chatPartners = [
    { id: 1, name: 'Santiago', age: 21, language: 'Spanish', message: 'Hello! Would you like to practice Spanish?' },
    { id: 2, name: 'Marie', age: 25, language: 'French', message: 'Bonjour! Let\'s practice together!' }
  ];

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'culture' && styles.activeTab]}
        onPress={() => setSelectedTab('culture')}
      >
        <Text style={[styles.tabText, selectedTab === 'culture' && styles.activeTabText]}>Culture</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'language' && styles.activeTab]}
        onPress={() => setSelectedTab('language')}
      >
        <Text style={[styles.tabText, selectedTab === 'language' && styles.activeTabText]}>Language</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'chat' && styles.activeTab]}
        onPress={() => setSelectedTab('chat')}
      >
        <Text style={[styles.tabText, selectedTab === 'chat' && styles.activeTabText]}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCultureTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.featuredCard}>
        <Text style={styles.featuredIcon}>🏛️</Text>
        <Text style={styles.featuredTitle}>Exploring Balinese Dance</Text>
        <Text style={styles.featuredDescription}>深入了解巴厘岛传统舞蹈的历史和文化意义</Text>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>开始探索</Text>
        </TouchableOpacity>
      </View>
      
      {culturalContent.map(content => (
        <TouchableOpacity key={content.id} style={styles.contentCard}>
          <Text style={styles.contentIcon}>{content.image}</Text>
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{content.title}</Text>
            <Text style={styles.contentDescription}>{content.description}</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{content.difficulty}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderLanguageTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.translationCard}>
        <Text style={styles.translationTitle}>Translate the following</Text>
        <Text style={styles.translationQuestion}>Q. {translationExercise.question}</Text>
        <View style={styles.optionsContainer}>
          {translationExercise.options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>选择学习语言</Text>
      {languages.map(language => (
        <TouchableOpacity key={language.id} style={styles.languageCard}>
          <Text style={styles.languageFlag}>{language.flag}</Text>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>{language.name}</Text>
            <Text style={styles.languageLevel}>{language.level}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${language.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{language.progress}%</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderChatTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.chatCard}>
        <Text style={styles.chatIcon}>💬</Text>
        <Text style={styles.chatTitle}>Chat</Text>
        <View style={styles.chatDropdown}>
          <Text style={styles.chatPartner}>Santiago ▼</Text>
          <Text style={styles.chatMessage}>Hello! Would you like to practice Spanish?</Text>
          <Text style={styles.chatAge}>21 age</Text>
        </View>
        <TouchableOpacity style={styles.chatReplyButton}>
          <Text style={styles.chatReplyText}>Sure! Let's get started.</Text>
          <Text style={styles.chatReplyAge}>21 age</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>语言伙伴</Text>
      {chatPartners.map(partner => (
        <TouchableOpacity key={partner.id} style={styles.partnerCard}>
          <View style={styles.partnerAvatar}>
            <Text style={styles.partnerInitial}>{partner.name[0]}</Text>
          </View>
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName}>{partner.name}</Text>
            <Text style={styles.partnerLanguage}>{partner.language} • {partner.age} 岁</Text>
            <Text style={styles.partnerMessage}>{partner.message}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'culture':
        return renderCultureTab();
      case 'language':
        return renderLanguageTab();
      case 'chat':
        return renderChatTab();
      default:
        return renderCultureTab();
    }
  };

  return (
    <LinearGradient
      colors={['#0D9488', '#0F766E']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CultureBridge</Text>
        </View>
        
        {renderTabBar()}
        {renderTabContent()}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  
  // Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 30,
    borderRadius: 25,
    padding: 5,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  activeTabText: {
    color: 'white',
  },
  
  // Tab Content Styles
  tabContent: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 100,
  },
  
  // Culture Tab Styles
  featuredCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featuredIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  featuredDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  contentIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
  },
  contentDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
    lineHeight: 18,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Language Tab Styles
  translationCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  translationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  translationQuestion: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  languageCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 15,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
  },
  languageLevel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  
  // Chat Tab Styles
  chatCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chatIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 15,
  },
  chatTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  chatDropdown: {
    backgroundColor: '#0D9488',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  chatPartner: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  chatMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  chatAge: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  chatReplyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 15,
    padding: 15,
  },
  chatReplyText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  chatReplyAge: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  partnerCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  partnerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  partnerInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
  },
  partnerLanguage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  partnerMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
});

