import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../types/navigation';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import ProfileSetupScreen from '../screens/onboarding/ProfileSetupScreen';
import FamilySetupScreen from '../screens/onboarding/FamilySetupScreen';
import PreferencesScreen from '../screens/onboarding/PreferencesScreen';

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#FAF7F2' } }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="FamilySetup" component={FamilySetupScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
    </Stack.Navigator>
  );
}
