import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ModernChatScreen = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const chatRooms = [
    {
      id: 1,
      name: "Spanish Learners",
      language: "🇪🇸",
      members: 1247,
      lastMessage: "¡Hola! ¿Cómo están todos?",
      time: "2 min ago",
      online: 23,
      color: ['#FF6B6B', '#FF8E53']
    },
    {
      id: 2,
      name: "Japanese Culture",
      language: "🇯🇵",
      members: 892,
      lastMessage: "今日は桜について話しましょう",
      time: "5 min ago",
      online: 18,
      color: ['#4ECDC4', '#44A08D']
    },
    {
      id: 3,
      name: "French Café",
      language: "🇫🇷",
      members: 634,
      lastMessage: "Bonjour mes amis!",
      time: "12 min ago",
      online: 31,
      color: ['#667eea', '#764ba2']
    },
    {
      id: 4,
      name: "Korean K-Pop",
      language: "🇰🇷",
      members: 2156,
      lastMessage: "새로운 노래 추천해주세요!",
      time: "18 min ago",
      online: 45,
      color: ['#f093fb', '#f5576c']
    },
    {
      id: 5,
      name: "Italian Cooking",
      language: "🇮🇹",
      members: 789,
      lastMessage: "Chi vuole la ricetta della pasta?",
      time: "25 min ago",
      online: 12,
      color: ['#ffecd2', '#fcb69f']
    },
    {
      id: 6,
      name: "German Philosophy",
      language: "🇩🇪",
      members: 445,
      lastMessage: "Guten Tag! Wie geht es euch?",
      time: "1 hour ago",
      online: 8,
      color: ['#a8edea', '#fed6e3']
    }
  ];

  const sampleMessages = [
    {
      id: 1,
      user: "Maria",
      avatar: "👩🏻",
      message: "¡Hola! ¿Cómo están todos hoy?",
      time: "10:30 AM",
      isMe: false
    },
    {
      id: 2,
      user: "You",
      avatar: "👤",
      message: "¡Muy bien! Estoy practicando español.",
      time: "10:32 AM",
      isMe: true
    },
    {
      id: 3,
      user: "Carlos",
      avatar: "👨🏽",
      message: "¡Excelente! ¿De dónde eres?",
      time: "10:33 AM",
      isMe: false
    },
    {
      id: 4,
      user: "You",
      avatar: "👤",
      message: "Soy de China. Me encanta la cultura española.",
      time: "10:35 AM",
      isMe: true
    }
  ];

  useEffect(() => {
    if (selectedRoom) {
      setMessages(sampleMessages);
    }
  }, [selectedRoom]);

  const renderChatRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={() => setSelectedRoom(item)}
    >
      <LinearGradient
        colors={item.color}
        style={styles.roomGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.roomHeader}>
          <View style={styles.roomInfo}>
            <Text style={styles.roomLanguage}>{item.language}</Text>
            <View style={styles.roomDetails}>
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.roomMembers}>{item.members.toLocaleString()} members</Text>
            </View>
          </View>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>{item.online} online</Text>
          </View>
        </View>
        
        <View style={styles.roomFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.isMe ? styles.myMessage : styles.otherMessage]}>
      {!item.isMe && (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{item.avatar}</Text>
        </View>
      )}
      <View style={[styles.messageBubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
        {!item.isMe && <Text style={styles.userName}>{item.user}</Text>}
        <Text style={[styles.messageText, item.isMe ? styles.myMessageText : styles.otherMessageText]}>
          {item.message}
        </Text>
        <Text style={[styles.messageTime, item.isMe ? styles.myMessageTime : styles.otherMessageTime]}>
          {item.time}
        </Text>
      </View>
      {item.isMe && (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{item.avatar}</Text>
        </View>
      )}
    </View>
  );

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: "You",
        avatar: "👤",
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  if (selectedRoom) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        
        {/* Chat Header */}
        <LinearGradient
          colors={selectedRoom.color}
          style={styles.chatHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedRoom(null)}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatRoomName}>{selectedRoom.name}</Text>
            <Text style={styles.chatRoomStatus}>{selectedRoom.online} online • {selectedRoom.members.toLocaleString()} members</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor="#A0AEC0"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Text style={styles.sendIcon}>→</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Global Chat Rooms</Text>
        <Text style={styles.headerSubtitle}>Connect with language learners worldwide</Text>
      </LinearGradient>

      {/* Chat Rooms List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.roomsContainer}>
          <FlatList
            data={chatRooms}
            renderItem={renderChatRoom}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.roomsList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  roomsContainer: {
    padding: 20,
  },
  roomsList: {
    gap: 16,
  },
  roomCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  roomGradient: {
    padding: 20,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomLanguage: {
    fontSize: 32,
    marginRight: 12,
  },
  roomDetails: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  roomMembers: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Chat Screen Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: '600',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatRoomName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  chatRoomStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  avatar: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: width * 0.7,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#2D3748',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#A0AEC0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#F7FAFC',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});

export default ModernChatScreen;

