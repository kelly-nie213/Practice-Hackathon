import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { MemoriesStackParamList } from '../types/navigation';
import MemoriesHubScreen from '../screens/memories/MemoriesHubScreen';
import MusicPlayerScreen from '../screens/memories/MusicPlayerScreen';
import PhotoGalleryScreen from '../screens/memories/PhotoGalleryScreen';
import StorytellingScreen from '../screens/memories/StorytellingScreen';
import ReflectionJournalScreen from '../screens/memories/ReflectionJournalScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator<MemoriesStackParamList>();

export default function MemoriesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.CREAM },
      }}
    >
      <Stack.Screen name="MemoriesHub" component={MemoriesHubScreen} />
      <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
      <Stack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
      <Stack.Screen name="Storytelling" component={StorytellingScreen} />
      <Stack.Screen name="Reflection" component={ReflectionJournalScreen} />
    </Stack.Navigator>
  );
}
