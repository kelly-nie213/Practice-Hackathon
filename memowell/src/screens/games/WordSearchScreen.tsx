import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import LargeText from '../../components/common/LargeText';
import IconButton from '../../components/common/IconButton';
import PrimaryButton from '../../components/common/PrimaryButton';
import AnimatedCard from '../../components/common/AnimatedCard';
import SpeakableCard from '../../components/common/SpeakableCard';
import WordSearchGrid from '../../components/games/WordSearchGrid';
import WordSearchWordList from '../../components/games/WordSearchWordList';
import { useTTS } from '../../context/TTSContext';
import { createWordSearchPuzzle, DIFFICULTY_LABEL } from '../../utils/wordSearchGenerator';
import type { Difficulty, WordSearchPuzzle } from '../../types/wordSearch';
import type { GamesStackParamList } from '../../types/navigation';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

type Nav = StackNavigationProp<GamesStackParamList, 'WordSearch'>;

const DIFFICULTY_INFO: { key: Difficulty; emoji: string; desc: string; color: string }[] = [
  { key: 'easy', emoji: '🌱', desc: '8x8 grid · 5 words', color: COLORS.SAGE_GREEN },
  { key: 'medium', emoji: '🌻', desc: '10x10 grid · 7 words', color: COLORS.SOFT_PEACH },
  { key: 'hard', emoji: '🌳', desc: '12x12 grid · 9 words', color: COLORS.DUSTY_ROSE },
];

const GRID_CARD_PADDING = SPACING.SM;

export default function WordSearchScreen() {
  const navigation = useNavigation<Nav>();
  const { speak } = useTTS();
  const [puzzle, setPuzzle] = useState<WordSearchPuzzle | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [gridAreaSize, setGridAreaSize] = useState({ width: 0, height: 0 });

  const startGame = (difficulty: Difficulty) => {
    const p = createWordSearchPuzzle(difficulty);
    setPuzzle(p);
    setFoundWords([]);
    speak(`${DIFFICULTY_LABEL[difficulty]} word search started. Find the ${p.placements.length} hidden words.`);
  };

  const handleWordFound = (word: string) => {
    setFoundWords((prev) => {
      if (prev.includes(word)) return prev;
      const next = [...prev, word];
      if (puzzle && next.length === puzzle.placements.length) {
        speak(`Wonderful! You found ${word}. You completed the puzzle!`);
      } else {
        speak(`Nice! You found ${word}.`);
      }
      return next;
    });
  };

  const complete = puzzle !== null && foundWords.length === puzzle.placements.length;

  if (!puzzle) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerRow}>
          <IconButton name="chevron-back" onPress={() => navigation.goBack()} />
          <LargeText size="H1" bold>Word Search</LargeText>
        </View>
        <LargeText size="BODY" color={COLORS.MEDIUM_GRAY} style={styles.sub}>
          Choose a difficulty to begin. Click and drag across letters to find a word.
        </LargeText>

        <ScrollView contentContainerStyle={styles.content}>
          {DIFFICULTY_INFO.map((d, i) => (
            <AnimatedCard key={d.key} delay={i * 120}>
              <SpeakableCard
                speakText={`${DIFFICULTY_LABEL[d.key]}. ${d.desc}`}
                onDoubleTap={() => startGame(d.key)}
                backgroundColor={d.color}
                style={styles.diffCard}
              >
                <LargeText size="DISPLAY">{d.emoji}</LargeText>
                <View style={styles.diffText}>
                  <LargeText size="H3" bold color={COLORS.WARM_WHITE}>{DIFFICULTY_LABEL[d.key]}</LargeText>
                  <LargeText size="BODY" color={COLORS.WARM_WHITE} style={{ opacity: 0.9 }}>{d.desc}</LargeText>
                </View>
              </SpeakableCard>
              <PrimaryButton
                label={`Play ${DIFFICULTY_LABEL[d.key]}`}
                onPress={() => startGame(d.key)}
                style={styles.diffButton}
              />
            </AnimatedCard>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // onLayout reports gridArea's own frame size, which still includes its
  // paddingHorizontal/paddingVertical (padding shrinks the space available
  // to children, not the reported frame) — subtract it here, otherwise the
  // square grid card is sized too large and bleeds past its intended margins.
  const availableWidth = Math.max(0, gridAreaSize.width - SPACING.LG * 2);
  const availableHeight = Math.max(0, gridAreaSize.height - SPACING.SM * 2);
  const outerSize = Math.max(0, Math.min(availableWidth, availableHeight));
  const innerSize = Math.max(0, outerSize - GRID_CARD_PADDING * 2);

  const onGridAreaLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setGridAreaSize({ width, height });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <IconButton name="chevron-back" onPress={() => setPuzzle(null)} />
        <LargeText size="H2" bold style={{ flex: 1 }}>{DIFFICULTY_LABEL[puzzle.difficulty]} Word Search</LargeText>
        <LargeText size="BODY" color={COLORS.MEDIUM_GRAY}>
          {foundWords.length}/{puzzle.placements.length}
        </LargeText>
      </View>

      <View style={styles.wordListWrap}>
        <WordSearchWordList puzzle={puzzle} foundWords={foundWords} />
      </View>

      <View style={styles.gridArea} onLayout={onGridAreaLayout}>
        {outerSize > 0 && (
          <View style={[styles.gridCard, { width: outerSize, height: outerSize }]}>
            <WordSearchGrid puzzle={puzzle} foundWords={foundWords} onWordFound={handleWordFound} size={innerSize} />
          </View>
        )}

        {complete && (
          <View style={styles.winOverlay}>
            <AnimatedCard style={styles.winCard}>
              <LargeText size="H2" center>🎉</LargeText>
              <LargeText size="H3" bold center style={{ marginTop: SPACING.SM }}>Puzzle Complete!</LargeText>
              <PrimaryButton label="Play Again" onPress={() => startGame(puzzle.difficulty)} style={styles.diffButton} />
              <PrimaryButton
                label="Change Difficulty"
                variant="secondary"
                onPress={() => setPuzzle(null)}
                style={styles.diffButton}
              />
            </AnimatedCard>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.CREAM },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.LG, gap: SPACING.SM },
  sub: { paddingHorizontal: SPACING.LG, marginTop: SPACING.SM, marginBottom: SPACING.MD },
  content: { padding: SPACING.LG, gap: SPACING.LG, paddingBottom: SPACING.XXL },
  diffCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.LG, borderRadius: RADIUS.MD },
  diffText: { flex: 1, marginLeft: SPACING.MD },
  diffButton: { marginTop: SPACING.SM },
  wordListWrap: { paddingHorizontal: SPACING.LG, paddingTop: SPACING.SM },
  gridArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
  },
  gridCard: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.MD,
    padding: GRID_CARD_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winCard: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.LG,
    padding: SPACING.XL,
    alignItems: 'center',
    width: '85%',
  },
});
