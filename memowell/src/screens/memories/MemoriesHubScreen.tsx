import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MemoriesStackParamList } from '../../types/navigation';
import AnimatedCard from '../../components/common/AnimatedCard';
import SpeakableCard from '../../components/common/SpeakableCard';
import LargeText from '../../components/common/LargeText';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Nav = StackNavigationProp<MemoriesStackParamList, 'MemoriesHub'>;

const ITEMS = [
  { label: 'Music', emoji: '🎵', desc: 'Listen to your favorite songs', screen: 'MusicPlayer' as const, bg: COLORS.DUSTY_ROSE },
  { label: 'Family Photos', emoji: '👨‍👩‍👧', desc: 'See your loved ones', screen: 'PhotoGallery' as const, bg: COLORS.SAGE_GREEN },
  { label: 'My Story', emoji: '📖', desc: 'Read your life story', screen: 'Storytelling' as const, bg: COLORS.SOFT_PEACH },
  { label: "Today's Reflection", emoji: '✏️', desc: "Write about today's moments", screen: 'Reflection' as const, bg: COLORS.LAVENDER },
];

export default function MemoriesHubScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LargeText size="H1" bold style={styles.heading}>Your Memories</LargeText>

      <View style={styles.grid}>
        {ITEMS.map((item, i) => (
          <AnimatedCard key={item.label} delay={i * 100} style={styles.cellWrapper}>
            <SpeakableCard
              speakText={item.label + '. ' + item.desc}
              onDoubleTap={() => navigation.navigate(item.screen)}
              backgroundColor={item.bg}
              style={styles.cell}
            >
              <LargeText size="DISPLAY" center>{item.emoji}</LargeText>
              <LargeText size="H3" bold center color={COLORS.WARM_WHITE} style={styles.cellLabel}>
                {item.label}
              </LargeText>
              <LargeText size="CAPTION" center color={COLORS.WARM_WHITE} style={{ opacity: 0.85 }}>
                {item.desc}
              </LargeText>
              <LargeText size="CAPTION" center color={COLORS.WARM_WHITE} style={styles.hint}>
                Tap to hear · Double-tap to open
              </LargeText>
            </SpeakableCard>
          </AnimatedCard>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.CREAM, padding: SPACING.LG },
  heading: { marginBottom: SPACING.LG },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.MD,
  },
  cellWrapper: { width: '47%' },
  cell: { minHeight: 170, justifyContent: 'center', gap: SPACING.XS },
  cellLabel: { marginTop: SPACING.SM },
  hint: { marginTop: SPACING.SM, opacity: 0.7, fontSize: 11 },
});
