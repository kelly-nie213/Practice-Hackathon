import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
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
  { emoji: '🃏', title: 'Memory Match', desc: 'Find matching pairs of cards', color: COLORS.DUSTY_ROSE, comingSoon: true },
  { emoji: '📝', title: 'Word Search', desc: 'Find hidden words in the grid', color: COLORS.SAGE_GREEN, comingSoon: false },
  { emoji: '🔢', title: 'Number Puzzles', desc: 'Gentle number matching games', color: COLORS.SOFT_PEACH, comingSoon: true },
];

export default function GamesHubScreen() {
  const navigation = useNavigation<Nav>();
  const comingSoon = () =>
    Alert.alert('Coming Soon! 🎉', 'New games are on their way. Keep doing your daily routine to earn rewards!');

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
              speakText={game.title + '. ' + game.desc}
              onDoubleTap={game.comingSoon ? comingSoon : () => navigation.navigate('WordSearch')}
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
                {game.comingSoon && (
                  <View style={styles.badge}>
                    <LargeText size="CAPTION" bold color={COLORS.CHARCOAL}>Soon</LargeText>
                  </View>
                )}
              </View>
            </SpeakableCard>
          </AnimatedCard>
        ))}

        <AnimatedCard delay={400} style={styles.motivationCard}>
          <LargeText size="H2" center>🏅</LargeText>
          <LargeText size="H3" bold center style={{ marginTop: SPACING.SM }}>Keep it up!</LargeText>
          <LargeText size="BODY" center color={COLORS.MEDIUM_GRAY} style={{ marginTop: SPACING.XS }}>
            Complete your daily routine to earn achievement medals. Games coming soon!
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
  badge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: RADIUS.FULL,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
  },
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
