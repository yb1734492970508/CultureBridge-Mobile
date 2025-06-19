import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入屏幕组件
import ModernHomeScreen from './src/screens/ModernHomeScreen';
import ModernChatScreen from './src/screens/ModernChatScreen';
import ModernLearningScreen from './src/screens/ModernLearningScreen';
import ModernProfileScreen from './src/screens/ModernProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// 导入本地化服务
import { I18nProvider, useI18n } from './src/services/I18nService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 主要的标签导航器
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
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6B46C1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={ModernHomeScreen} 
        options={{ title: t('nav.home') }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ModernChatScreen} 
        options={{ title: t('nav.chat') }}
      />
      <Tab.Screen 
        name="Learning" 
        component={ModernLearningScreen} 
        options={{ title: t('nav.learning') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ModernProfileScreen} 
        options={{ title: t('nav.profile') }}
      />
    </Tab.Navigator>
  );
}

// 应用内容组件
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('检查认证状态失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // 或者显示加载屏幕
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
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

