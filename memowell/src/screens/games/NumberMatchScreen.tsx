import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LargeText from '../../components/common/LargeText';
import PrimaryButton from '../../components/common/PrimaryButton';
import IconButton from '../../components/common/IconButton';
import SpeakableCard from '../../components/common/SpeakableCard';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { useTheme } from '../../context/ThemeContext';
import { saveGame, loadGame, GAME_KEYS } from '../../utils/gameStorage';

interface MatchState {
  tiles: number[];      // 16 entries, values 1–8 each twice
  matched: number[];    // indices of matched (permanently revealed) tiles
}

const INSTRUCTIONS =
  'Number Match. Tap a tile to flip it over and see its number. Tap a second tile to try to find its pair. If the numbers match, they stay open. If not, they flip back. Find all 8 pairs to win!';

function shuffleTiles(): number[] {
  const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

export default function NumberMatchScreen() {
  const navigation = useNavigation();
  const { scaled } = useTheme();
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [flipped, setFlipped] = useState<number[]>([]);
  const isChecking = useRef(false);

  const tileSize = scaled(72);

  const startNewGame = useCallback(async () => {
    const fresh: MatchState = { tiles: shuffleTiles(), matched: [] };
    setMatchState(fresh);
    setFlipped([]);
    isChecking.current = false;
    await saveGame(GAME_KEYS.NUMBER_MATCH, fresh);
  }, []);

  useEffect(() => {
    loadGame<MatchState>(GAME_KEYS.NUMBER_MATCH).then(saved => {
      if (saved && saved.matched.length < 16) {
        Alert.alert('Continue?', 'You have an unfinished game.', [
          { text: 'New Game', style: 'destructive', onPress: startNewGame },
          { text: 'Resume', onPress: () => { setMatchState(saved); setFlipped([]); } },
        ]);
      } else {
        startNewGame();
      }
    });
  }, [startNewGame]);

  const handleTilePress = async (index: number) => {
    if (!matchState) return;
    if (isChecking.current) return;
    if (matchState.matched.includes(index)) return;
    if (flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (matchState.tiles[a] === matchState.tiles[b]) {
        const newMatched = [...matchState.matched, a, b];
        const updated: MatchState = { ...matchState, matched: newMatched };
        setMatchState(updated);
        setFlipped([]);
        await saveGame(GAME_KEYS.NUMBER_MATCH, updated);

        if (newMatched.length === 16) {
          Alert.alert('You did it! 🎉', 'All pairs matched! Great memory!', [
            { text: 'Play Again', onPress: startNewGame },
          ]);
        }
      } else {
        isChecking.current = true;
        setTimeout(() => {
          setFlipped([]);
          isChecking.current = false;
        }, 800);
      }
    }
  };

  const isFaceUp = (index: number): boolean =>
    matchState !== null &&
    (matchState.matched.includes(index) || flipped.includes(index));

  const isMatched = (index: number): boolean =>
    matchState !== null && matchState.matched.includes(index);

  if (!matchState) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <IconButton name="arrow-back" onPress={() => navigation.goBack()} color={COLORS.CHARCOAL} />
        <LargeText size="H2" bold>Number Match</LargeText>
        <View style={{ flex: 1 }} />
        <PrimaryButton label="New" onPress={startNewGame} variant="secondary" style={styles.newBtn} />
      </View>

      <SpeakableCard speakText={INSTRUCTIONS} style={styles.instructions}>
        <LargeText size="CAPTION" color={COLORS.MEDIUM_GRAY} center>
          🔊 Tap to hear instructions
        </LargeText>
      </SpeakableCard>

      <View style={styles.grid}>
        {[0, 1, 2, 3].map(row => (
          <View key={row} style={styles.gridRow}>
            {[0, 1, 2, 3].map(col => {
              const index = row * 4 + col;
              const faceUp = isFaceUp(index);
              const matched = isMatched(index);
              return (
                <TouchableOpacity
                  key={col}
                  onPress={() => handleTilePress(index)}
                  activeOpacity={faceUp ? 1 : 0.7}
                  style={[
                    styles.tile,
                    { width: tileSize, height: tileSize },
                    faceUp && styles.tileFaceUp,
                    matched && styles.tileMatched,
                  ]}
                >
                  {faceUp ? (
                    <LargeText size="H1" bold color={matched ? COLORS.WARM_WHITE : COLORS.CHARCOAL} center>
                      {String(matchState.tiles[index])}
                    </LargeText>
                  ) : (
                    <LargeText size="H2" color={COLORS.WARM_WHITE} center>?</LargeText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <LargeText size="BODY" color={COLORS.MEDIUM_GRAY} center style={styles.progress}>
        {matchState.matched.length / 2} of 8 pairs found
      </LargeText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.CREAM },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.SM,
    paddingBottom: SPACING.SM,
    gap: SPACING.SM,
  },
  newBtn: { height: 40, paddingHorizontal: SPACING.MD },
  instructions: {
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
    padding: SPACING.SM,
    backgroundColor: COLORS.WARM_WHITE,
  },
  grid: { alignItems: 'center', gap: SPACING.SM, paddingHorizontal: SPACING.LG },
  gridRow: { flexDirection: 'row', gap: SPACING.SM },
  tile: {
    backgroundColor: COLORS.SAGE_GREEN,
    borderRadius: RADIUS.SM,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tileFaceUp: {
    backgroundColor: COLORS.WARM_WHITE,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GRAY,
  },
  tileMatched: {
    backgroundColor: COLORS.SUCCESS_GREEN,
    borderWidth: 0,
  },
  progress: { marginTop: SPACING.LG },
});
