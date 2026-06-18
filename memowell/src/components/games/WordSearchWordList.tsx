import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import LargeText from '../common/LargeText';
import { useTTS } from '../../context/TTSContext';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import type { WordSearchPuzzle } from '../../types/wordSearch';

interface Props {
  puzzle: WordSearchPuzzle;
  foundWords: string[];
}

export default function WordSearchWordList({ puzzle, foundWords }: Props) {
  const { speak } = useTTS();

  return (
    <View style={styles.wrap}>
      {puzzle.placements.map((p) => {
        const found = foundWords.includes(p.word);
        const color = puzzle.colors[p.word];
        return (
          <TouchableOpacity
            key={p.word}
            onPress={() => speak(p.word)}
            activeOpacity={0.7}
            style={[styles.chip, { borderColor: color, backgroundColor: found ? color : COLORS.WARM_WHITE }]}
          >
            <View style={[styles.dot, { backgroundColor: color }]} />
            <LargeText
              size="BODY"
              bold
              color={found ? COLORS.WARM_WHITE : COLORS.CHARCOAL}
              style={found ? styles.foundText : undefined}
            >
              {p.word}
            </LargeText>
            {found && <LargeText size="BODY" color={COLORS.WARM_WHITE}>✓</LargeText>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.SM },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.FULL,
    borderWidth: 2,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  foundText: { textDecorationLine: 'line-through' },
});
