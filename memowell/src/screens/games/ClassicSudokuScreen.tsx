import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LargeText from '../../components/common/LargeText';
import PrimaryButton from '../../components/common/PrimaryButton';
import IconButton from '../../components/common/IconButton';
import SpeakableCard from '../../components/common/SpeakableCard';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { useTheme } from '../../context/ThemeContext';
import { generateClassic, isBoardComplete, Board } from '../../utils/sudoku';
import { saveGame, loadGame, GAME_KEYS } from '../../utils/gameStorage';

interface ClassicState {
  puzzle: Board;
  board: Board;
  solution: Board;
}

const INSTRUCTIONS =
  'Classic Sudoku. Fill the 9 by 9 grid so every row, every column, and every 3 by 3 box contains the digits 1 through 9. Tap a cell to select it, then tap a number to fill it in.';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ClassicSudokuScreen() {
  const navigation = useNavigation();
  const { scaled } = useTheme();
  const [gameState, setGameState] = useState<ClassicState | null>(null);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const cellSize = Math.floor((SCREEN_WIDTH - SPACING.LG * 2) / 9);
  const numBtnSize = scaled(52);

  const startNewGame = useCallback(async () => {
    const { puzzle, solution } = generateClassic();
    const fresh: ClassicState = { puzzle, solution, board: puzzle.map(r => [...r]) };
    setGameState(fresh);
    setSelected(null);
    await saveGame(GAME_KEYS.CLASSIC_SUDOKU, fresh);
  }, []);

  useEffect(() => {
    loadGame<ClassicState>(GAME_KEYS.CLASSIC_SUDOKU).then(saved => {
      if (saved) {
        Alert.alert('Continue?', 'You have an unfinished game.', [
          { text: 'New Game', style: 'destructive', onPress: startNewGame },
          { text: 'Resume', onPress: () => setGameState(saved) },
        ]);
      } else {
        startNewGame();
      }
    });
  }, [startNewGame]);

  const handleCellPress = (row: number, col: number) => {
    if (!gameState || gameState.puzzle[row][col] !== 0) return;
    setSelected([row, col]);
  };

  const handleNumberPress = async (num: number) => {
    if (!gameState || !selected) return;
    const [row, col] = selected;
    if (gameState.puzzle[row][col] !== 0) return;
    const newBoard = gameState.board.map(r => [...r]);
    newBoard[row][col] = num;
    const updated: ClassicState = { ...gameState, board: newBoard };
    setGameState(updated);
    await saveGame(GAME_KEYS.CLASSIC_SUDOKU, updated);
    if (isBoardComplete(newBoard, gameState.solution)) {
      Alert.alert('Well done! 🎉', 'You completed the Classic Sudoku!', [
        { text: 'New Game', onPress: startNewGame },
      ]);
    }
  };

  const handleClear = async () => {
    if (!gameState || !selected) return;
    const [row, col] = selected;
    if (gameState.puzzle[row][col] !== 0) return;
    const newBoard = gameState.board.map(r => [...r]);
    newBoard[row][col] = 0;
    const updated: ClassicState = { ...gameState, board: newBoard };
    setGameState(updated);
    await saveGame(GAME_KEYS.CLASSIC_SUDOKU, updated);
  };

  const getCellTextColor = (row: number, col: number): string => {
    if (!gameState) return COLORS.CHARCOAL;
    if (gameState.puzzle[row][col] !== 0) return COLORS.CHARCOAL;
    const val = gameState.board[row][col];
    if (val === 0) return COLORS.MEDIUM_GRAY;
    return val !== gameState.solution[row][col] ? COLORS.DANGER_RED : COLORS.SAGE_DARK;
  };

  const isSelected = (r: number, c: number) =>
    selected !== null && selected[0] === r && selected[1] === c;

  const isSameBox = (r: number, c: number) => {
    if (!selected) return false;
    return Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
           Math.floor(selected[1] / 3) === Math.floor(c / 3);
  };

  if (!gameState) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <IconButton name="arrow-back" onPress={() => navigation.goBack()} color={COLORS.CHARCOAL} />
        <LargeText size="H2" bold>Classic Sudoku</LargeText>
        <View style={{ flex: 1 }} />
        <PrimaryButton label="New" onPress={startNewGame} variant="secondary" style={styles.newBtn} />
      </View>

      <SpeakableCard speakText={INSTRUCTIONS} style={styles.instructions}>
        <LargeText size="CAPTION" color={COLORS.MEDIUM_GRAY} center>
          🔊 Tap to hear instructions
        </LargeText>
      </SpeakableCard>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.gridContainer}>
          {gameState.board.map((row, r) => (
            <View key={r} style={styles.gridRow}>
              {row.map((val, c) => {
                const preSet = gameState.puzzle[r][c] !== 0;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => handleCellPress(r, c)}
                    activeOpacity={preSet ? 1 : 0.7}
                    style={[
                      styles.cell,
                      { width: cellSize, height: cellSize },
                      isSelected(r, c) && styles.cellSelected,
                      isSameBox(r, c) && !isSelected(r, c) && styles.cellHighlight,
                      c === 2 && styles.boxBorderRight,
                      c === 5 && styles.boxBorderRight,
                      r === 2 && styles.boxBorderBottom,
                      r === 5 && styles.boxBorderBottom,
                    ]}
                  >
                    <LargeText
                      size="BODY"
                      bold={preSet}
                      color={getCellTextColor(r, c)}
                      center
                    >
                      {val !== 0 ? String(val) : ''}
                    </LargeText>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.numPad}>
          {[[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((rowNums, ri) => (
            <View key={ri} style={styles.numRow}>
              {rowNums.map(n => (
                <TouchableOpacity
                  key={n}
                  style={[styles.numBtn, { width: numBtnSize, height: numBtnSize }]}
                  onPress={() => handleNumberPress(n)}
                  activeOpacity={0.7}
                >
                  <LargeText size="H3" bold color={COLORS.CHARCOAL} center>{String(n)}</LargeText>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <TouchableOpacity
            style={[styles.numBtn, styles.clearBtn, { alignSelf: 'center', paddingHorizontal: SPACING.LG, height: numBtnSize }]}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <LargeText size="BODY" bold color={COLORS.DANGER_RED} center>Clear Cell</LargeText>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginBottom: SPACING.SM,
    padding: SPACING.SM,
    backgroundColor: COLORS.WARM_WHITE,
  },
  scroll: { paddingBottom: SPACING.XXL },
  gridContainer: { alignItems: 'center', marginTop: SPACING.SM, paddingHorizontal: SPACING.LG },
  gridRow: { flexDirection: 'row' },
  cell: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WARM_WHITE,
  },
  cellSelected: { borderColor: COLORS.SAGE_GREEN, borderWidth: 2, backgroundColor: '#EEF7EF' },
  cellHighlight: { backgroundColor: '#F5FAF5' },
  boxBorderRight: { borderRightWidth: 3, borderRightColor: COLORS.CHARCOAL },
  boxBorderBottom: { borderBottomWidth: 3, borderBottomColor: COLORS.CHARCOAL },
  numPad: { marginTop: SPACING.LG, paddingHorizontal: SPACING.LG, alignItems: 'center', gap: SPACING.SM },
  numRow: { flexDirection: 'row', gap: SPACING.SM },
  numBtn: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.SM,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  clearBtn: { backgroundColor: '#FFF0F0' },
});
