import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const userStats = {
    points: 2550,
    level: 5,
    streak: 7,
    courses: 3,
  };

  const menuItems = [
    {
      id: 1,
      title: '个人信息',
      icon: 'person-outline',
      onPress: () => console.log('个人信息'),
    },
    {
      id: 2,
      title: '学习记录',
      icon: 'book-outline',
      onPress: () => console.log('学习记录'),
    },
    {
      id: 3,
      title: '成就徽章',
      icon: 'trophy-outline',
      onPress: () => console.log('成就徽章'),
    },
    {
      id: 4,
      title: '语言设置',
      icon: 'language-outline',
      onPress: () => console.log('语言设置'),
    },
    {
      id: 5,
      title: '帮助中心',
      icon: 'help-circle-outline',
      onPress: () => console.log('帮助中心'),
    },
    {
      id: 6,
      title: '关于我们',
      icon: 'information-circle-outline',
      onPress: () => console.log('关于我们'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 用户信息卡片 */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#007AFF" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>张小明</Text>
        <Text style={styles.userEmail}>zhangxiaoming@example.com</Text>
        <View style={styles.userLevel}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.levelText}>等级 {userStats.level}</Text>
        </View>
      </View>

      {/* 统计信息 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.points}</Text>
          <Text style={styles.statLabel}>积分</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.streak}</Text>
          <Text style={styles.statLabel}>连续天数</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.courses}</Text>
          <Text style={styles.statLabel}>课程数</Text>
        </View>
      </View>

      {/* 快速操作 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快速操作</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="gift-outline" size={24} color="#007AFF" />
            <Text style={styles.actionText}>每日签到</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#007AFF" />
            <Text style={styles.actionText}>邀请好友</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="star-outline" size={24} color="#007AFF" />
            <Text style={styles.actionText}>评价应用</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 设置选项 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设置</Text>
        
        {/* 通知设置 */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={20} color="#666" />
            <Text style={styles.settingText}>推送通知</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* 深色模式 */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={20} color="#666" />
            <Text style={styles.settingText}>深色模式</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* 菜单项 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>更多</Text>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={20} color="#666" />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* 退出登录 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>

      {/* 版本信息 */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>CultureBridge v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    margin: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  levelText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});

