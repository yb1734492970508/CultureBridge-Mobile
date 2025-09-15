import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockRewards = [
  {
    id: 'r1',
    name: '文化探索者徽章',
    description: '完成5门课程后获得的荣誉徽章，象征着您对世界文化的热爱。',
    pointsCost: 200,
    imageUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'digital',
    stock: -1, // -1 means unlimited
  },
  {
    id: 'r2',
    name: '全球文化地图',
    description: '一张精美的全球文化地图，标记了世界各地的文化遗产和风俗。',
    pointsCost: 500,
    imageUrl: 'https://images.unsplash.com/photo-1593640408187-3a270fa2172f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'physical',
    stock: 10,
  },
  {
    id: 'r3',
    name: '文化交流线上沙龙入场券',
    description: '参与每月一次的线上文化交流沙龙，与全球文化爱好者互动。',
    pointsCost: 300,
    imageUrl: 'https://images.unsplash.com/photo-1522204523234-8729aa6e993f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'experience',
    stock: 50,
  },
  {
    id: 'r4',
    name: '文化周边商品八折优惠券',
    description: '在CultureBridge周边商城购买任意商品可享八折优惠。',
    pointsCost: 150,
    imageUrl: 'https://images.unsplash.com/photo-1563297007-0686b7015608?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'discount',
    stock: -1,
  },
];

const mockUser = {
  totalPoints: 500,
};

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching rewards and user data
    setTimeout(() => {
      setRewards(mockRewards);
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  const handleExchange = (reward) => {
    if (!user || user.totalPoints < reward.pointsCost) {
      Alert.alert('积分不足', '您的积分不足以兑换此奖励。');
      return;
    }
    if (reward.stock !== -1 && reward.stock <= 0) {
      Alert.alert('库存不足', '此奖励已售罄。');
      return;
    }

    Alert.alert(
      '确认兑换',
      `您确定要花费 ${reward.pointsCost} 积分兑换 ${reward.name} 吗？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '确认', onPress: () => {
            // Simulate exchange API call
            setLoading(true);
            setTimeout(() => {
              setUser(prevUser => ({ ...prevUser, totalPoints: prevUser.totalPoints - reward.pointsCost }));
              setRewards(prevRewards =>
                prevRewards.map(r =>
                  r.id === reward.id ? { ...r, stock: r.stock !== -1 ? r.stock - 1 : -1 } : r
                )
              );
              setLoading(false);
              Alert.alert('兑换成功', `您已成功兑换 ${reward.name}！`);
            }, 1000);
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text style={styles.loadingText}>加载奖励商城...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>奖励商城</Text>
        {user && <Text style={styles.userPoints}>我的积分: {user.totalPoints}</Text>}
      </View>

      <View style={styles.rewardsGrid}>
        {rewards.map((reward) => (
          <View key={reward.id} style={styles.rewardCard}>
            <Image source={{ uri: reward.imageUrl }} style={styles.rewardImage} />
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>{reward.name}</Text>
              <Text style={styles.rewardDescription}>{reward.description}</Text>
              <View style={styles.rewardMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="star-outline" size={16} color="#FFD700" />
                  <Text style={styles.metaText}>{reward.pointsCost} 积分</Text>
                </View>
                {reward.stock !== -1 && (
                  <View style={styles.metaItem}>
                    <Ionicons name="cube-outline" size={16} color="#666" />
                    <Text style={styles.metaText}>库存: {reward.stock > 0 ? reward.stock : '售罄'}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={[styles.exchangeButton, (user.totalPoints < reward.pointsCost || (reward.stock !== -1 && reward.stock <= 0)) && styles.exchangeButtonDisabled]}
                onPress={() => handleExchange(reward)}
                disabled={user.totalPoints < reward.pointsCost || (reward.stock !== -1 && reward.stock <= 0)}
              >
                <Text style={styles.exchangeButtonText}>
                  {user.totalPoints < reward.pointsCost ? '积分不足' : (reward.stock !== -1 && reward.stock <= 0 ? '已售罄' : '立即兑换')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#6A5ACD',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userPoints: {
    fontSize: 18,
    color: '#E0E0E0',
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  rewardCard: {
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
  rewardImage: {
    width: '100%',
    height: 120,
  },
  rewardInfo: {
    padding: 10,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  rewardDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  rewardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  exchangeButton: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  exchangeButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  exchangeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

