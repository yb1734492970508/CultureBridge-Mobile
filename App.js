import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import CoursesScreen from './screens/CoursesScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import RewardsScreen from './screens/RewardsScreen';
import CommunityScreen from './screens/CommunityScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: '课程详情' }} />
    </Stack.Navigator>
  );
}

function CoursesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Courses" component={CoursesScreen} options={{ title: '所有课程' }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: '课程详情' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: '我的资料' }} />
    </Stack.Navigator>
  );
}

function RewardsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Rewards" component={RewardsScreen} options={{ title: '我的奖励' }} />
    </Stack.Navigator>
  );
}

function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Community" component={CommunityScreen} options={{ title: '社区' }} />
    </Stack.Navigator>
  );
}

function LeaderboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: '排行榜' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === '首页') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === '课程') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === '奖励') {
              iconName = focused ? 'gift' : 'gift-outline';
            } else if (route.name === '社区') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === '我的') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="首页" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="课程" component={CoursesStack} options={{ headerShown: false }} />
        <Tab.Screen name="奖励" component={RewardsStack} options={{ headerShown: false }} />
        <Tab.Screen name="社区" component={CommunityStack} options={{ headerShown: false }} />
        <Tab.Screen name="我的" component={ProfileStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}



