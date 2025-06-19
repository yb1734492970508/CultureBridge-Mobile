import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../services/I18nService';

const { width, height } = Dimensions.get('window');

const ModernChatScreen = ({ navigation }) => {
  const { t } = useI18n();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, language, culture

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    // 模拟聊天数据
    setConversations([
      {
        id: 1,
        name: 'Maria González',
        lastMessage: '¡Hola! ¿Cómo estás hoy?',
        time: '2分钟前',
        avatar: '🇪🇸',
        language: 'Spanish',
        unread: 2,
        online: true,
        type: 'language_exchange'
      },
      {
        id: 2,
        name: 'Hiroshi Tanaka',
        lastMessage: '今日は茶道の体験はいかがでしたか？',
        time: '15分钟前',
        avatar: '🇯🇵',
        language: 'Japanese',
        unread: 0,
        online: true,
        type: 'culture_exchange'
      },
      {
        id: 3,
        name: 'Emma Wilson',
        lastMessage: 'The cooking class was amazing! Thank you for the recommendation.',
        time: '1小时前',
        avatar: '🇬🇧',
        language: 'English',
        unread: 1,
        online: false,
        type: 'language_exchange'
      },
      {
        id: 4,
        name: 'Pierre Dubois',
        lastMessage: 'Merci beaucoup pour la leçon de français!',
        time: '2小时前',
        avatar: '🇫🇷',
        language: 'French',
        unread: 0,
        online: false,
        type: 'language_exchange'
      },
      {
        id: 5,
        name: '文化交流群',
        lastMessage: '李明: 大家好，我想分享一些中国春节的习俗',
        time: '3小时前',
        avatar: '🌍',
        language: 'Multiple',
        unread: 5,
        online: true,
        type: 'group_chat'
      }
    ]);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'language') return matchesSearch && conv.type === 'language_exchange';
    if (activeTab === 'culture') return matchesSearch && (conv.type === 'culture_exchange' || conv.type === 'group_chat');
    
    return matchesSearch;
  });

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        // 导航到聊天详情页
        console.log('Open chat with:', item.name);
      }}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.conversationMeta}>
          <View style={styles.languageTag}>
            <Text style={styles.languageText}>{item.language}</Text>
          </View>
          <View style={[styles.typeTag, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.typeText}>{getTypeLabel(item.type)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getTypeColor = (type) => {
    switch (type) {
      case 'language_exchange': return '#3B82F6';
      case 'culture_exchange': return '#10B981';
      case 'group_chat': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'language_exchange': return '语言交换';
      case 'culture_exchange': return '文化交流';
      case 'group_chat': return '群聊';
      default: return '其他';
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>{t('chat.noMessages')}</Text>
      <Text style={styles.emptySubtitle}>开始与世界各地的朋友交流吧</Text>
      <TouchableOpacity style={styles.startChatButton}>
        <LinearGradient
          colors={['#6B46C1', '#9333EA']}
          style={styles.startChatGradient}
        >
          <Text style={styles.startChatText}>开始聊天</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <LinearGradient
        colors={['#6B46C1', '#9333EA']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('chat.title')}</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* 搜索框 */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('chat.searchPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* 标签页 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              全部
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'language' && styles.activeTab]}
            onPress={() => setActiveTab('language')}
          >
            <Text style={[styles.tabText, activeTab === 'language' && styles.activeTabText]}>
              语言交换
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'culture' && styles.activeTab]}
            onPress={() => setActiveTab('culture')}
          >
            <Text style={[styles.tabText, activeTab === 'culture' && styles.activeTabText]}>
              文化交流
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* 聊天列表 */}
      <View style={styles.content}>
        {filteredConversations.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredConversations}
            renderItem={renderConversation}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* 浮动操作按钮 */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={['#6B46C1', '#9333EA']}
          style={styles.fabGradient}
        >
          <Ionicons name="chatbubbles" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    paddingTop: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 32,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    overflow: 'hidden',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  conversationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageTag: {
    backgroundColor: '#E0F2F7',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  languageText: {
    fontSize: 12,
    color: '#007BFF',
    fontWeight: '500',
  },
  typeTag: {
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
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
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  startChatButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  startChatGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  startChatText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModernChatScreen;

