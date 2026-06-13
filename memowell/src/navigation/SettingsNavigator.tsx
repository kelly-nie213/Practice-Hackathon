import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { SettingsStackParamList } from '../types/navigation';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileEditScreen from '../screens/settings/ProfileEditScreen';
import FamilySetupScreen from '../screens/onboarding/FamilySetupScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.CREAM },
      }}
    >
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="FamilyEdit" component={FamilySetupScreen} />
    </Stack.Navigator>
  );
}
