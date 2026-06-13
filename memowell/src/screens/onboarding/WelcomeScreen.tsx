import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../types/navigation';
import LargeText from '../../components/common/LargeText';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Nav = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle} />

      <Animated.View entering={FadeIn.duration(800)} style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <LargeText size="DISPLAY" center>🧠</LargeText>
        </View>
        <LargeText size="H1" bold center color={COLORS.CHARCOAL} style={styles.appName}>
          MemoWell
        </LargeText>
      </Animated.View>

      <Animated.View entering={SlideInUp.delay(400).duration(600)} style={styles.taglineContainer}>
        <LargeText size="H3" center color={COLORS.MEDIUM_GRAY} style={styles.tagline}>
          Helping you stay connected{'\n'}to who you are.
        </LargeText>
      </Animated.View>

      <Animated.View entering={SlideInUp.delay(700).duration(600)} style={styles.buttonContainer}>
        <PrimaryButton label="Let's Get Started" onPress={() => navigation.navigate('ProfileSetup')} />
        <LargeText size="CAPTION" center color={COLORS.MEDIUM_GRAY} style={styles.note}>
          Set up by a family member or caregiver
        </LargeText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.CREAM,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.XL,
  },
  bgCircle: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: COLORS.SOFT_PEACH,
    opacity: 0.35,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.WARM_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: SPACING.MD,
  },
  appName: {
    letterSpacing: 1,
  },
  taglineContainer: {
    marginBottom: SPACING.XXL,
  },
  tagline: {
    lineHeight: 34,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.MD,
  },
  note: {
    marginTop: SPACING.SM,
  },
});
