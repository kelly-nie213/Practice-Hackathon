# Number Games Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three playable number games (4×4 Mini Sudoku, 9×9 Classic Sudoku, Number Match) to the MemoWell Games tab with AsyncStorage save/resume and no scoring.

**Architecture:** Convert the Games tab from a direct screen link to a stack navigator (like `MemoriesNavigator`), add shared utility files for puzzle logic and persistence, then implement each game as its own screen.

**Tech Stack:** React Native / Expo SDK 56, `@react-native-async-storage/async-storage` 2.2.0, `@react-navigation/stack`, TypeScript.

## Global Constraints

- Expo SDK 56 — check https://docs.expo.dev/versions/v56.0.0/ before using any Expo API.
- All font sizes and spacing that should scale must use `useTheme().scaled(n)`.
- Minimum cell touch target: 52pt (scaled). Minimum number pad button: 64pt (scaled).
- Colors must come from `src/constants/colors.ts` COLORS constants.
- No scoring, timers, streak tracking, or badges in any game screen.
- AsyncStorage keys: `'miniSudoku'`, `'classicSudoku'`, `'numberMatch'`.
- All commands run from inside the `memowell/` subdirectory.

---

### Task 1: Navigation Scaffolding

**Files:**
- Modify: `src/types/navigation.ts`
- Create: `src/navigation/GamesNavigator.tsx`
- Modify: `src/navigation/MainTabNavigator.tsx`
- Create (stub): `src/screens/games/MiniSudokuScreen.tsx`
- Create (stub): `src/screens/games/ClassicSudokuScreen.tsx`
- Create (stub): `src/screens/games/NumberMatchScreen.tsx`

**Interfaces:**
- Produces: `GamesStackParamList` type with `GamesHub`, `MiniSudoku`, `ClassicSudoku`, `NumberMatch` routes; `GamesNavigator` default export.

- [ ] **Step 1: Add `GamesStackParamList` to navigation types**

Open `src/types/navigation.ts` and add after the existing `MainTabParamList` block:

```typescript
export type GamesStackParamList = {
  GamesHub: undefined;
  MiniSudoku: undefined;
  ClassicSudoku: undefined;
  NumberMatch: undefined;
};
```

- [ ] **Step 2: Create stub game screens**

Create `src/screens/games/MiniSudokuScreen.tsx`:
```typescript
import React from 'react';
import { View } from 'react-native';
import LargeText from '../../components/common/LargeText';
import { COLORS } from '../../constants/colors';

export default function MiniSudokuScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.CREAM, justifyContent: 'center', alignItems: 'center' }}>
      <LargeText size="H2" bold>Mini Sudoku</LargeText>
    </View>
  );
}
```

Create `src/screens/games/ClassicSudokuScreen.tsx`:
```typescript
import React from 'react';
import { View } from 'react-native';
import LargeText from '../../components/common/LargeText';
import { COLORS } from '../../constants/colors';

export default function ClassicSudokuScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.CREAM, justifyContent: 'center', alignItems: 'center' }}>
      <LargeText size="H2" bold>Classic Sudoku</LargeText>
    </View>
  );
}
```

Create `src/screens/games/NumberMatchScreen.tsx`:
```typescript
import React from 'react';
import { View } from 'react-native';
import LargeText from '../../components/common/LargeText';
import { COLORS } from '../../constants/colors';

export default function NumberMatchScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.CREAM, justifyContent: 'center', alignItems: 'center' }}>
      <LargeText size="H2" bold>Number Match</LargeText>
    </View>
  );
}
```

- [ ] **Step 3: Create `GamesNavigator`**

Create `src/navigation/GamesNavigator.tsx`:
```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { GamesStackParamList } from '../types/navigation';
import GamesHubScreen from '../screens/games/GamesHubScreen';
import MiniSudokuScreen from '../screens/games/MiniSudokuScreen';
import ClassicSudokuScreen from '../screens/games/ClassicSudokuScreen';
import NumberMatchScreen from '../screens/games/NumberMatchScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator<GamesStackParamList>();

export default function GamesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.CREAM },
      }}
    >
      <Stack.Screen name="GamesHub" component={GamesHubScreen} />
      <Stack.Screen name="MiniSudoku" component={MiniSudokuScreen} />
      <Stack.Screen name="ClassicSudoku" component={ClassicSudokuScreen} />
      <Stack.Screen name="NumberMatch" component={NumberMatchScreen} />
    </Stack.Navigator>
  );
}
```

- [ ] **Step 4: Update `MainTabNavigator` to use `GamesNavigator`**

In `src/navigation/MainTabNavigator.tsx`, replace:
```typescript
import GamesHubScreen from '../screens/games/GamesHubScreen';
```
with:
```typescript
import GamesNavigator from './GamesNavigator';
```

Replace:
```typescript
<Tab.Screen name="Games" component={GamesHubScreen} options={{ tabBarLabel: 'Games' }} />
```
with:
```typescript
<Tab.Screen name="Games" component={GamesNavigator} options={{ tabBarLabel: 'Games' }} />
```

- [ ] **Step 5: Type-check**

Run from `memowell/`:
```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Manual verification**

Run `npx expo start --web` and confirm the Games tab still loads the Brain Gym hub.

- [ ] **Step 7: Commit**

```bash
git add src/types/navigation.ts src/navigation/GamesNavigator.tsx src/navigation/MainTabNavigator.tsx src/screens/games/MiniSudokuScreen.tsx src/screens/games/ClassicSudokuScreen.tsx src/screens/games/NumberMatchScreen.tsx
git commit -m "feat: add Games stack navigator and stub game screens"
```

---

### Task 2: Utility Functions

**Files:**
- Create: `src/utils/gameStorage.ts`
- Create: `src/utils/sudoku.ts`

**Interfaces:**
- Produces (gameStorage):
  - `saveGame(key: string, state: unknown): Promise<void>`
  - `loadGame<T>(key: string): Promise<T | null>`
  - `clearGame(key: string): Promise<void>`
  - `GAME_KEYS: { MINI_SUDOKU: 'miniSudoku'; CLASSIC_SUDOKU: 'classicSudoku'; NUMBER_MATCH: 'numberMatch' }`
- Produces (sudoku):
  - `Board = number[][]`
  - `SudokuPuzzle = { puzzle: Board; solution: Board }`
  - `generateMini(): SudokuPuzzle`
  - `generateClassic(): SudokuPuzzle`
  - `isBoardComplete(board: Board, solution: Board): boolean`

- [ ] **Step 1: Create `gameStorage.ts`**

Create `src/utils/gameStorage.ts`:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GAME_KEYS = {
  MINI_SUDOKU: 'miniSudoku',
  CLASSIC_SUDOKU: 'classicSudoku',
  NUMBER_MATCH: 'numberMatch',
} as const;

export async function saveGame(key: string, state: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(state));
}

export async function loadGame<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function clearGame(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
```

- [ ] **Step 2: Create `sudoku.ts`**

Create `src/utils/sudoku.ts`:
```typescript
export type Board = number[][];

export interface SudokuPuzzle {
  puzzle: Board;
  solution: Board;
}

function makeEmpty(size: number): Board {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function clone(b: Board): Board {
  return b.map(row => [...row]);
}

function isValid(board: Board, row: number, col: number, val: number, box: number): boolean {
  const size = board.length;
  for (let c = 0; c < size; c++) if (board[row][c] === val) return false;
  for (let r = 0; r < size; r++) if (board[r][col] === val) return false;
  const br = Math.floor(row / box) * box;
  const bc = Math.floor(col / box) * box;
  for (let r = br; r < br + box; r++)
    for (let c = bc; c < bc + box; c++)
      if (board[r][c] === val) return false;
  return true;
}

function fill(board: Board, box: number): boolean {
  const size = board.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) {
        const nums = Array.from({ length: size }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        for (const n of nums) {
          if (isValid(board, r, c, n, box)) {
            board[r][c] = n;
            if (fill(board, box)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function carve(solution: Board, empties: number): Board {
  const puzzle = clone(solution);
  const size = puzzle.length;
  const positions = Array.from({ length: size * size }, (_, i) => i)
    .sort(() => Math.random() - 0.5);
  for (let i = 0; i < empties; i++) {
    const pos = positions[i];
    puzzle[Math.floor(pos / size)][pos % size] = 0;
  }
  return puzzle;
}

// 4×4 puzzle: 10 pre-filled cells (6 empty) — gentle for elderly users
export function generateMini(): SudokuPuzzle {
  const solution = makeEmpty(4);
  fill(solution, 2);
  return { puzzle: carve(solution, 6), solution };
}

// 9×9 puzzle: 35 pre-filled cells (46 empty) — Easy difficulty
export function generateClassic(): SudokuPuzzle {
  const solution = makeEmpty(9);
  fill(solution, 3);
  return { puzzle: carve(solution, 46), solution };
}

export function isBoardComplete(board: Board, solution: Board): boolean {
  return board.every((row, r) => row.every((val, c) => val === solution[r][c]));
}
```

- [ ] **Step 3: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/utils/gameStorage.ts src/utils/sudoku.ts
git commit -m "feat: add gameStorage and sudoku utility functions"
```

---

### Task 3: Update GamesHubScreen

**Files:**
- Modify: `src/screens/games/GamesHubScreen.tsx`

**Interfaces:**
- Consumes: `GamesStackParamList` from `src/types/navigation.ts`; `StackNavigationProp` from `@react-navigation/stack`
- Produces: Hub where double-tapping a game card navigates to that game screen.

- [ ] **Step 1: Rewrite `GamesHubScreen`**

Replace the entire contents of `src/screens/games/GamesHubScreen.tsx` with:

```typescript
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { GamesStackParamList } from '../../types/navigation';
import AnimatedCard from '../../components/common/AnimatedCard';
import SpeakableCard from '../../components/common/SpeakableCard';
import LargeText from '../../components/common/LargeText';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

type Nav = StackNavigationProp<GamesStackParamList, 'GamesHub'>;

const GAMES = [
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
    emoji: '🃏',
    title: 'Number Match',
    desc: 'Flip tiles to find matching number pairs',
    color: COLORS.DUSTY_ROSE,
    screen: 'NumberMatch' as const,
    speak: 'Number Match. Flip tiles to find matching number pairs. Double-tap to play.',
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

        <AnimatedCard delay={400} style={styles.motivationCard}>
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
```

- [ ] **Step 2: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Manual verification**

In the dev server, open Brain Gym. Confirm:
- Three game cards show with no "Soon" badges.
- Single tap speaks the description aloud.
- Double-tap navigates to the stub screen.
- Back from stub returns to hub.

- [ ] **Step 4: Commit**

```bash
git add src/screens/games/GamesHubScreen.tsx
git commit -m "feat: wire GamesHubScreen game cards to navigator"
```

---

### Task 4: MiniSudokuScreen

**Files:**
- Modify: `src/screens/games/MiniSudokuScreen.tsx` (replace stub with full implementation)

**Interfaces:**
- Consumes: `generateMini`, `isBoardComplete`, `Board`, `SudokuPuzzle` from `src/utils/sudoku.ts`; `saveGame`, `loadGame`, `GAME_KEYS` from `src/utils/gameStorage.ts`

- [ ] **Step 1: Implement `MiniSudokuScreen`**

Replace `src/screens/games/MiniSudokuScreen.tsx` entirely:

```typescript
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
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
```

- [ ] **Step 2: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Manual verification**

In dev server, double-tap Mini Sudoku from hub. Verify:
- 4×4 grid renders with some pre-filled numbers.
- Tapping an empty cell highlights it with a green border.
- Tapping a number button fills the selected cell.
- Pre-filled cells cannot be selected.
- Incorrect entries appear in red.
- Correct entries appear in SAGE_DARK green.
- Clearing a cell sets it back to empty.
- Completing the puzzle shows the "Well done!" alert.
- Going back and returning shows the Resume / New Game prompt.

- [ ] **Step 4: Commit**

```bash
git add src/screens/games/MiniSudokuScreen.tsx
git commit -m "feat: implement Mini Sudoku game screen (4x4)"
```

---

### Task 5: ClassicSudokuScreen

**Files:**
- Modify: `src/screens/games/ClassicSudokuScreen.tsx` (replace stub)

**Interfaces:**
- Consumes: `generateClassic`, `isBoardComplete`, `Board` from `src/utils/sudoku.ts`; `saveGame`, `loadGame`, `GAME_KEYS` from `src/utils/gameStorage.ts`

- [ ] **Step 1: Implement `ClassicSudokuScreen`**

Replace `src/screens/games/ClassicSudokuScreen.tsx` entirely:

```typescript
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

        {/* Number pad: 3 rows of 3 + Clear */}
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
```

- [ ] **Step 2: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Manual verification**

Double-tap Classic Sudoku from hub. Verify:
- 9×9 grid renders, fitting the screen width.
- 3×3 box boundaries are visually distinct (thicker borders).
- Tapping an empty cell highlights it; tapping a number fills it.
- Incorrect entries appear red; correct entries appear SAGE_DARK.
- "Clear Cell" button erases the selected cell.
- Completing the puzzle shows the "Well done!" alert.
- Resume / New Game prompt appears on return.

- [ ] **Step 4: Commit**

```bash
git add src/screens/games/ClassicSudokuScreen.tsx
git commit -m "feat: implement Classic Sudoku game screen (9x9, Easy)"
```

---

### Task 6: NumberMatchScreen

**Files:**
- Modify: `src/screens/games/NumberMatchScreen.tsx` (replace stub)

**Interfaces:**
- Consumes: `saveGame`, `loadGame`, `GAME_KEYS` from `src/utils/gameStorage.ts`

- [ ] **Step 1: Implement `NumberMatchScreen`**

Replace `src/screens/games/NumberMatchScreen.tsx` entirely:

```typescript
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
  const [flipped, setFlipped] = useState<number[]>([]);    // at most 2 indices currently face-up
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
        // Match found
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
        // No match — flip back after pause
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
```

- [ ] **Step 2: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Manual verification**

Double-tap Number Match from hub. Verify:
- 4×4 grid of face-down tiles (green, showing "?").
- Tapping a tile flips it face-up showing its number.
- Tapping a second tile: if numbers match, both stay face-up in SUCCESS_GREEN; if not, both flip back after ~800ms.
- Progress counter increments with each matched pair.
- Completing all 8 pairs shows the "You did it!" alert.
- Returning and re-entering shows Resume / New Game prompt; resumed game shows already-matched pairs face-up.

- [ ] **Step 4: Commit**

```bash
git add src/screens/games/NumberMatchScreen.tsx
git commit -m "feat: implement Number Match tile game"
```

---

## Self-Review

**Spec coverage check:**
- ✅ 4×4 Mini Sudoku (Task 4)
- ✅ 9×9 Classic Sudoku Easy (Task 5)
- ✅ Number Match tile game (Task 6)
- ✅ Save progress on every change / matched pair (Tasks 4, 5, 6)
- ✅ Resume / New Game prompt on screen entry (Tasks 4, 5, 6)
- ✅ No scoring, timers, or badges (all game screens)
- ✅ Large cells (≥52pt scaled), large number pad buttons (≥64pt scaled) (Tasks 4, 5, 6)
- ✅ SpeakableCard instructions header on each screen (Tasks 4, 5, 6)
- ✅ GamesHub double-tap to navigate, single-tap speaks description (Task 3)
- ✅ GamesStackParamList + GamesNavigator + MainTabNavigator wired (Task 1)
- ✅ gameStorage helpers with `saveGame`, `loadGame`, `clearGame`, `GAME_KEYS` (Task 2)
- ✅ sudoku.ts with `generateMini`, `generateClassic`, `isBoardComplete` (Task 2)

**Type consistency:**
- `Board = number[][]` used consistently across sudoku.ts and all game screens.
- `MiniState`, `ClassicState`, `MatchState` are local to their screens — no cross-screen type coupling.
- `GAME_KEYS` constants match AsyncStorage key strings used in each screen.
- `isBoardComplete(board, solution)` signature matches every call site.

**No placeholders:** All steps contain complete code.
