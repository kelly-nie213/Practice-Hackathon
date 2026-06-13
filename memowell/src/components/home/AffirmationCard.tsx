import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAffirmation } from '../../hooks/useAffirmation';
import { useTTS } from '../../context/TTSContext';
import LargeText from '../common/LargeText';
import IconButton from '../common/IconButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

export default function AffirmationCard() {
  const affirmation = useAffirmation();
  const { speak } = useTTS();
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(184,169,201,${opacity.value})`,
  }));

  return (
    <Animated.View style={[styles.card, borderStyle]}>
      <View style={styles.header}>
        <LargeText size="BODY" bold color={COLORS.MEDIUM_GRAY} style={styles.label}>
          Today's Affirmation
        </LargeText>
        <IconButton name="volume-high" color={COLORS.LAVENDER} onPress={() => speak(affirmation)} />
      </View>
      <LargeText size="H2" center style={styles.text}>{affirmation}</LargeText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.LAVENDER + '33',
    borderRadius: RADIUS.LG,
    padding: SPACING.LG,
    borderWidth: 2,
    borderColor: COLORS.LAVENDER,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.SM },
  label: { opacity: 0.8 },
  text: { lineHeight: 40 },
});
