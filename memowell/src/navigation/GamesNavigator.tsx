import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { GamesStackParamList } from '../types/navigation';
import GamesHubScreen from '../screens/games/GamesHubScreen';
import WordSearchScreen from '../screens/games/WordSearchScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator<GamesStackParamList>();

export default function GamesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.CREAM },
      }}
    >
      <Stack.Screen name="GamesHub" component={GamesHubScreen} />
      <Stack.Screen name="WordSearch" component={WordSearchScreen} />
    </Stack.Navigator>
  );
}
