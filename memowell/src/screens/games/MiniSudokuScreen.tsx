import React, { useEffect, useState, useCallback } from 'react';
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
import { generateMini, isBoardComplete, Board } from '../../utils/sudoku';
import { saveGame, loadGame, GAME_KEYS } from '../../utils/gameStorage';

interface MiniState {
  puzzle: Board;
  board: Board;
  solution: Board;
}

const INSTRUCTIONS =
  'Mini Sudoku. Fill the 4 by 4 grid so each row, column, and 2 by 2 box contains the numbers 1 through 4. Tap a cell to select it, then tap a number below to fill it in. Tap here again to hear this again.';

export default function MiniSudokuScreen() {
  const navigation = useNavigation();
  const { scaled } = useTheme();
  const [gameState, setGameState] = useState<MiniState | null>(null);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const cellSize = scaled(72);
  const numBtnSize = scaled(64);

  const startNewGame = useCallback(async () => {
    const { puzzle, solution } = generateMini();
    const fresh: MiniState = { puzzle, solution, board: puzzle.map(r => [...r]) };
    setGameState(fresh);
    setSelected(null);
    await saveGame(GAME_KEYS.MINI_SUDOKU, fresh);
  }, []);

  useEffect(() => {
    loadGame<MiniState>(GAME_KEYS.MINI_SUDOKU).then(saved => {
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
    const updated: MiniState = { ...gameState, board: newBoard };
    setGameState(updated);
    await saveGame(GAME_KEYS.MINI_SUDOKU, updated);

    if (isBoardComplete(newBoard, gameState.solution)) {
      Alert.alert('Well done! 🎉', 'You completed the Mini Sudoku!', [
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
    const updated: MiniState = { ...gameState, board: newBoard };
    setGameState(updated);
    await saveGame(GAME_KEYS.MINI_SUDOKU, updated);
  };

  const getCellTextColor = (row: number, col: number): string => {
    if (!gameState) return COLORS.CHARCOAL;
    if (gameState.puzzle[row][col] !== 0) return COLORS.CHARCOAL;
    const val = gameState.board[row][col];
    if (val === 0) return COLORS.MEDIUM_GRAY;
    return val !== gameState.solution[row][col] ? COLORS.DANGER_RED : COLORS.SAGE_DARK;
  };

  const isSelected = (row: number, col: number) =>
    selected !== null && selected[0] === row && selected[1] === col;

  const isSameBox = (row: number, col: number) => {
    if (!selected) return false;
    return Math.floor(selected[0] / 2) === Math.floor(row / 2) &&
           Math.floor(selected[1] / 2) === Math.floor(col / 2);
  };

  if (!gameState) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <IconButton name="arrow-back" onPress={() => navigation.goBack()} color={COLORS.CHARCOAL} />
        <LargeText size="H2" bold>Mini Sudoku</LargeText>
        <View style={{ flex: 1 }} />
        <PrimaryButton label="New" onPress={startNewGame} variant="secondary" style={styles.newBtn} />
      </View>

      <SpeakableCard speakText={INSTRUCTIONS} style={styles.instructions}>
        <LargeText size="CAPTION" color={COLORS.MEDIUM_GRAY} center>
          🔊 Tap to hear instructions
        </LargeText>
      </SpeakableCard>

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
                    c === 1 && styles.boxBorderRight,
                    r === 1 && styles.boxBorderBottom,
                  ]}
                >
                  <LargeText
                    size="H2"
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
        {[1, 2, 3, 4].map(n => (
          <TouchableOpacity
            key={n}
            style={[styles.numBtn, { width: numBtnSize, height: numBtnSize }]}
            onPress={() => handleNumberPress(n)}
            activeOpacity={0.7}
          >
            <LargeText size="H2" bold color={COLORS.CHARCOAL} center>{String(n)}</LargeText>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.numBtn, styles.clearBtn, { width: numBtnSize, height: numBtnSize }]}
          onPress={handleClear}
          activeOpacity={0.7}
        >
          <LargeText size="BODY" bold color={COLORS.DANGER_RED} center>Clear</LargeText>
        </TouchableOpacity>
      </View>
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
  gridContainer: { alignItems: 'center', marginTop: SPACING.MD },
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
  numPad: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.XL,
    gap: SPACING.MD,
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.LG,
  },
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
