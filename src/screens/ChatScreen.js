import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const chatRooms = [
    { 
      id: 1, 
      name: '语言交换', 
      description: '中英文语言交换聊天室',
      members: 156,
      lastMessage: '大家好！有人想练习英语吗？',
      lastTime: '5分钟前',
      unread: 3
    },
    { 
      id: 2, 
      name: '日本文化', 
      description: '探讨日本传统文化',
      members: 89,
      lastMessage: '今天分享一下日本茶道文化',
      lastTime: '15分钟前',
      unread: 0
    },
    { 
      id: 3, 
      name: '美食分享', 
      description: '世界各地美食交流',
      members: 234,
      lastMessage: '刚做了意大利面，味道不错！',
      lastTime: '1小时前',
      unread: 1
    },
    { 
      id: 4, 
      name: '旅行故事', 
      description: '分享旅行见闻',
      members: 178,
      lastMessage: '巴黎的夜景真的很美',
      lastTime: '2小时前',
      unread: 0
    },
  ];

  const onlineUsers = [
    { id: 1, name: 'Alice', avatar: '👩', status: 'learning Chinese' },
    { id: 2, name: 'Hiroshi', avatar: '👨', status: 'teaching Japanese' },
    { id: 3, name: 'Maria', avatar: '👩‍🦱', status: 'practicing English' },
    { id: 4, name: 'Ahmed', avatar: '👨‍🦲', status: 'sharing culture' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 在线用户 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>在线用户</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.onlineUsersContainer}>
            {onlineUsers.map((user) => (
              <TouchableOpacity key={user.id} style={styles.userCard}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>{user.avatar}</Text>
                  <View style={styles.onlineIndicator} />
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userStatus}>{user.status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 聊天室列表 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>聊天室</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        {chatRooms.map((room) => (
          <TouchableOpacity key={room.id} style={styles.chatRoomCard}>
            <View style={styles.roomIcon}>
              <Ionicons name="chatbubbles" size={24} color="#007AFF" />
            </View>
            <View style={styles.roomContent}>
              <View style={styles.roomHeader}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomTime}>{room.lastTime}</Text>
              </View>
              <Text style={styles.roomDescription}>{room.description}</Text>
              <Text style={styles.lastMessage}>{room.lastMessage}</Text>
              <View style={styles.roomFooter}>
                <View style={styles.membersInfo}>
                  <Ionicons name="people" size={14} color="#666" />
                  <Text style={styles.membersCount}>{room.members} 成员</Text>
                </View>
                {room.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{room.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 快速操作 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快速操作</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="language" size={24} color="#007AFF" />
            <Text style={styles.actionText}>翻译工具</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="mic" size={24} color="#007AFF" />
            <Text style={styles.actionText}>语音翻译</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="search" size={24} color="#007AFF" />
            <Text style={styles.actionText}>找语伴</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineUsersContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  userCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 5,
  },
  avatar: {
    fontSize: 32,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    backgroundColor: '#f0f8ff',
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  chatRoomCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  roomIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roomContent: {
    flex: 1,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  roomTime: {
    fontSize: 12,
    color: '#999',
  },
  roomDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#007AFF',
    textAlign: 'center',
  },
});

