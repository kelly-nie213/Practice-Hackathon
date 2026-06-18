import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AnimatedCard from '../../components/common/AnimatedCard';
import SpeakableCard from '../../components/common/SpeakableCard';
import LargeText from '../../components/common/LargeText';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import type { GamesStackParamList } from '../../types/navigation';

type Nav = StackNavigationProp<GamesStackParamList, 'GamesHub'>;

const GAMES = [
  {
    emoji: '🃏',
    title: 'Memory Match',
    desc: 'Find matching pairs of cards',
    color: COLORS.DUSTY_ROSE,
    screen: 'MemoryMatch' as const,
    speak: 'Memory Match. Find matching pairs of cards. Double-tap to play.',
  },
  {
    emoji: '🔢',
    title: 'Mini Sudoku',
    desc: 'Fill a 4 by 4 grid with numbers 1 to 4',
    color: COLORS.SOFT_PEACH,
    screen: 'MiniSudoku' as const,
    speak: 'Mini Sudoku. Fill a 4 by 4 grid with numbers 1 to 4. Double-tap to play.',
  },
  {
    emoji: '🧩',
    title: 'Classic Sudoku',
    desc: 'The classic 9 by 9 number puzzle',
    color: COLORS.SAGE_GREEN,
    screen: 'ClassicSudoku' as const,
    speak: 'Classic Sudoku. The classic 9 by 9 number puzzle. Double-tap to play.',
  },
  {
    emoji: '🎯',
    title: 'Number Match',
    desc: 'Flip tiles to find matching number pairs',
    color: COLORS.DUSTY_ROSE,
    screen: 'NumberMatch' as const,
    speak: 'Number Match. Flip tiles to find matching number pairs. Double-tap to play.',
  },
  {
    emoji: '📝',
    title: 'Word Search',
    desc: 'Find hidden words in the grid',
    color: COLORS.SAGE_GREEN,
    screen: 'WordSearch' as const,
    speak: 'Word Search. Find hidden words in the grid. Double-tap to play.',
  },
];

export default function GamesHubScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LargeText size="H1" bold style={styles.heading}>Brain Gym</LargeText>
      <LargeText size="BODY" color={COLORS.MEDIUM_GRAY} style={styles.sub}>
        Gentle exercises to keep your mind sharp and engaged.
      </LargeText>

      <ScrollView contentContainerStyle={styles.content}>
        {GAMES.map((game, i) => (
          <AnimatedCard key={game.title} delay={i * 120} style={styles.cardWrapper}>
            <SpeakableCard
              speakText={game.speak}
              onDoubleTap={() => navigation.navigate(game.screen)}
              backgroundColor={game.color}
              style={styles.gameCard}
            >
              <View style={styles.row}>
                <LargeText size="DISPLAY">{game.emoji}</LargeText>
                <View style={{ flex: 1 }}>
                  <LargeText size="H3" bold color={COLORS.WARM_WHITE}>{game.title}</LargeText>
                  <LargeText size="BODY" color={COLORS.WARM_WHITE} style={{ opacity: 0.85, marginTop: 4 }}>
                    {game.desc}
                  </LargeText>
                </View>
              </View>
              <LargeText size="CAPTION" color={COLORS.WARM_WHITE} style={styles.hint}>
                Tap to hear · Double-tap to play
              </LargeText>
            </SpeakableCard>
          </AnimatedCard>
        ))}

        <AnimatedCard delay={600} style={styles.motivationCard}>
          <LargeText size="H2" center>🧠</LargeText>
          <LargeText size="H3" bold center style={{ marginTop: SPACING.SM }}>Keep it up!</LargeText>
          <LargeText size="BODY" center color={COLORS.MEDIUM_GRAY} style={{ marginTop: SPACING.XS }}>
            Playing a little every day is great for your mind.
          </LargeText>
        </AnimatedCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.CREAM },
  heading: { paddingHorizontal: SPACING.LG, paddingTop: SPACING.SM },
  sub: { paddingHorizontal: SPACING.LG, marginBottom: SPACING.MD },
  content: { padding: SPACING.LG, gap: SPACING.MD, paddingBottom: SPACING.XXL },
  cardWrapper: {},
  gameCard: { padding: SPACING.LG },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.MD },
  hint: { marginTop: SPACING.SM, opacity: 0.75 },
  motivationCard: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.LG,
    padding: SPACING.XL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});
