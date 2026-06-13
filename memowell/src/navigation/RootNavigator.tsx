import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import OnboardingNavigator from './OnboardingNavigator';
import MainTabNavigator from './MainTabNavigator';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();

  if (authLoading || (user && profileLoading)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.CREAM }}>
        <ActivityIndicator size="large" color={COLORS.SAGE_GREEN} />
      </View>
    );
  }

  const showOnboarding = !user || !profile?.onboardingComplete;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
