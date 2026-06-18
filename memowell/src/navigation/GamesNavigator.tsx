import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { GamesStackParamList } from '../types/navigation';
import GamesHubScreen from '../screens/games/GamesHubScreen';
import MiniSudokuScreen from '../screens/games/MiniSudokuScreen';
import ClassicSudokuScreen from '../screens/games/ClassicSudokuScreen';
import NumberMatchScreen from '../screens/games/NumberMatchScreen';
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
      <Stack.Screen name="MiniSudoku" component={MiniSudokuScreen} />
      <Stack.Screen name="ClassicSudoku" component={ClassicSudokuScreen} />
      <Stack.Screen name="NumberMatch" component={NumberMatchScreen} />
    </Stack.Navigator>
  );
}
