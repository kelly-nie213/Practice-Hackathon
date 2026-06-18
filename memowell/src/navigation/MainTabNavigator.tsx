import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from '../types/navigation';
import DailyOrientationScreen from '../screens/home/DailyOrientationScreen';
import GamesNavigator from './GamesNavigator';
import MemoriesNavigator from './MemoriesNavigator';
import SettingsNavigator from './SettingsNavigator';
import { COLORS } from '../constants/colors';
import { TAB_BAR_HEIGHT } from '../constants/spacing';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.WARM_WHITE,
          height: TAB_BAR_HEIGHT,
          borderTopColor: COLORS.LIGHT_GRAY,
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarActiveTintColor: COLORS.SAGE_GREEN,
        tabBarInactiveTintColor: COLORS.MEDIUM_GRAY,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Memories') iconName = 'heart';
          else if (route.name === 'Games') iconName = 'game-controller';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName} size={30} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DailyOrientationScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Memories" component={MemoriesNavigator} options={{ tabBarLabel: 'Memories' }} />
      <Tab.Screen name="Games" component={GamesNavigator} options={{ tabBarLabel: 'Games' }} />
      <Tab.Screen name="Settings" component={SettingsNavigator} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
}
