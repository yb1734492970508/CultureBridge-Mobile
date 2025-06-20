import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ActivityIndicator } from 'react-native';

// 导入国际化服务
import { I18nProvider, useI18n } from './src/services/I18nService';

// 导入屏幕组件
import ModernHomeScreen from './src/screens/ModernHomeScreen';
import ModernChatScreen from './src/screens/ModernChatScreen';
import ModernLearningScreen from './src/screens/ModernLearningScreen';
import ModernWalletScreen from './src/screens/ModernWalletScreen';
import ModernProfileScreen from './src/screens/ModernProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 加载屏幕组件
const LoadingScreen = () => {
  const { t } = useI18n();
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#F8FAFC' 
    }}>
      <ActivityIndicator size="large" color="#6B46C1" />
      <Text style={{ 
        marginTop: 20, 
        fontSize: 16, 
        color: '#6B7280' 
      }}>
        {t('common.loading')}
      </Text>
    </View>
  );
};

// 主要标签导航器
function MainTabNavigator() {
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Learning') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6B46C1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={ModernHomeScreen}
        options={{
          tabBarLabel: t('navigation.home'),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ModernChatScreen}
        options={{
          tabBarLabel: t('navigation.chat'),
        }}
      />
      <Tab.Screen 
        name="Learning" 
        component={ModernLearningScreen}
        options={{
          tabBarLabel: t('navigation.learning'),
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={ModernWalletScreen}
        options={{
          tabBarLabel: t('navigation.wallet'),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ModernProfileScreen}
        options={{
          tabBarLabel: t('navigation.profile'),
        }}
      />
    </Tab.Navigator>
  );
}

// 应用内容组件
function AppContent() {
  const { isLoading } = useI18n();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#6B46C1" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 主应用组件
export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

