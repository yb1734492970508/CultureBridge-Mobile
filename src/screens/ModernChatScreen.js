import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
<<<<<<< HEAD
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ModernChatScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! Welcome to CultureBridge! 🌍',
      sender: 'other',
      time: '10:30',
      translated: false
    },
    {
      id: 2,
      text: '你好！欢迎来到文化桥梁！',
      sender: 'me',
      time: '10:31',
      translated: false
    },
    {
      id: 3,
      text: 'I would love to learn about Chinese culture!',
      sender: 'other',
      time: '10:32',
      translated: false
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        translated: false
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = (msg) => (
    <View
      key={msg.id}
      style={[
        styles.messageContainer,
        msg.sender === 'me' ? styles.myMessage : styles.otherMessage
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          msg.sender === 'me' ? styles.myBubble : styles.otherBubble
        ]}
      >
        <Text
          style={[
            styles.messageText,
            msg.sender === 'me' ? styles.myMessageText : styles.otherMessageText
          ]}
        >
          {msg.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messageTime,
              msg.sender === 'me' ? styles.myMessageTime : styles.otherMessageTime
            ]}
          >
            {msg.time}
          </Text>
          <TouchableOpacity style={styles.translateButton}>
            <Ionicons 
              name="language-outline" 
              size={14} 
              color={msg.sender === 'me' ? '#fff' : '#667eea'} 
            />
          </TouchableOpacity>
        </View>
      </View>
=======
  KeyboardAvoidingView,
  Platform,
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
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
<<<<<<< HEAD
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userStatus}>在线 • 正在输入...</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
=======
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
          </TouchableOpacity>
        </View>
      </LinearGradient>

<<<<<<< HEAD
      {/* Messages */}
      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add" size={24} color="#667eea" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="输入消息..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity style={styles.voiceButton}>
            <Ionicons name="mic" size={20} color="#667eea" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={message.trim() ? "#fff" : "#999"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
=======
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
=======
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
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
  languageTag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
<<<<<<< HEAD
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
=======
  languageText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
<<<<<<< HEAD
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  moreButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myBubble: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 8,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#2c3e50',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  otherMessageTime: {
    color: '#999',
  },
  translateButton: {
    padding: 4,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    marginLeft: 4,
  },
  sendButtonActive: {
    backgroundColor: '#667eea',
=======
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
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
    alignItems: 'center',
  },
  startChatText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
>>>>>>> a3e2607a343e2ea52e9c4b7020d8f74c268068d3
  },
});

export default ModernChatScreen;

