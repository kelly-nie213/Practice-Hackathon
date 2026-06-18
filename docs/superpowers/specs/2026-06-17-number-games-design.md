# Number Games — Design Spec
**Date:** 2026-06-17
**Branch:** number-puzzle

## Overview

Add three playable number games to the MemoWell "Brain Gym" Games tab: a 4×4 Mini Sudoku, a 9×9 Classic Sudoku (Easy difficulty), and a Number Match tile-flipping game. All games save progress to AsyncStorage so users can resume mid-puzzle. No scoring, timers, or rewards — the focus is calm, pressure-free cognitive engagement for elderly users.

---

## Architecture

The Games tab is converted from a direct screen link to a stack navigator, matching the existing pattern used by `MemoriesNavigator`.

### Navigation Changes

`MainTabNavigator` replaces `GamesHubScreen` with `GamesNavigator`.

`GamesStackParamList` (added to `src/types/navigation.ts`):
```
GamesHub       — hub listing all three games
MiniSudoku     — 4×4 Sudoku screen
ClassicSudoku  — 9×9 Sudoku screen
NumberMatch    — number tile-matching screen
```

### New Files

| File | Purpose |
|---|---|
| `src/navigation/GamesNavigator.tsx` | Stack navigator for the Games tab |
| `src/screens/games/MiniSudokuScreen.tsx` | 4×4 Sudoku game screen |
| `src/screens/games/ClassicSudokuScreen.tsx` | 9×9 Sudoku game screen |
| `src/screens/games/NumberMatchScreen.tsx` | Number tile-matching game screen |
| `src/utils/sudoku.ts` | Puzzle generation and board validation logic |
| `src/utils/gameStorage.ts` | AsyncStorage save/resume helpers |

### Updated Files

| File | Change |
|---|---|
| `src/navigation/MainTabNavigator.tsx` | Import and use `GamesNavigator` instead of `GamesHubScreen` |
| `src/screens/games/GamesHubScreen.tsx` | Remove "Soon" badges; wire cards to navigate to game screens |
| `src/types/navigation.ts` | Add `GamesStackParamList` |

---

## Game Designs

### Mini Sudoku (4×4)

- **Grid:** 4×4; each row, column, and 2×2 box contains digits 1–4
- **Interaction:** Tap a cell to select it (SAGE_GREEN highlighted border), then tap a number from a 4-button number pad to fill it
- **Visual states:** Pre-filled cells in CHARCOAL; user-entered in SAGE_DARK; errors in DANGER_RED
- **Actions:** "Check" button validates the full board; completion triggers a "Well done! 🎉" alert
- **Entry flow:** On mount, if saved state exists, show "Resume" / "New Game" choice; otherwise start fresh
- **Save:** AsyncStorage key `'miniSudoku'`; saved on every cell change

### Classic Sudoku (9×9)

- **Grid:** 9×9; standard Sudoku rules; Easy difficulty (~35 pre-filled cells, 46 empty)
- **Interaction:** Same tap-cell → tap-number-pad model; 9-button number pad
- **Extra action:** "Clear Cell" button erases the selected user-entered cell
- **Visual states:** Same color scheme as Mini Sudoku
- **Entry flow:** Same Resume / New Game choice as Mini Sudoku
- **Save:** AsyncStorage key `'classicSudoku'`; saved on every cell change

### Number Match

- **Grid:** 4×4 of 16 tiles; digits 1–8 each appearing exactly twice (shuffled)
- **Interaction:** Tap a tile to flip it face-up; tap a second tile to attempt a match
  - Match: both tiles stay revealed
  - No match: both tiles flip face-down after a short pause (~800ms)
- **Completion:** "All matched! 🎉" alert when all 8 pairs are found
- **Entry flow:** Saved state is the set of already-revealed pairs; on resume, revealed pairs stay face-up
- **Save:** AsyncStorage key `'numberMatch'`; saved after each matched pair

---

## UX & Accessibility

- **Cell size:** Minimum 52×52pt; scales up with `useTheme().scaled()` at 1.25× and 1.5× font scale
- **Number pad buttons:** Minimum 64×64pt, generously spaced
- **Screen header:** A `SpeakableCard` with brief game instructions; tap to hear them read aloud via TTSContext
- **Back navigation:** Standard stack back arrow returns to GamesHub; progress is already saved
- **No timer, no score, no badges** — purely the puzzle experience

---

## Data Flow

### `gameStorage.ts`

```ts
saveGame(key: string, state: unknown): Promise<void>
loadGame<T>(key: string): Promise<T | null>
clearGame(key: string): Promise<void>
```

Uses `AsyncStorage` from `@react-native-async-storage/async-storage` (already available in Expo SDK 56).

### `sudoku.ts`

```ts
generateMini(): { puzzle: Board4x4; solution: Board4x4 }
generateClassic(): { puzzle: Board9x9; solution: Board9x9 }
isValidPlacement(board: number[][], row: number, col: number, value: number): boolean
isBoardComplete(board: number[][], solution: number[][]): boolean
```

Puzzle generation uses a backtracking algorithm. For Easy 9×9, the generator removes cells until 46 are empty while ensuring a unique solution.

---

## Spec Self-Review

- No TBDs or placeholders remaining
- Architecture consistent with existing `MemoriesNavigator` pattern
- All three games fully specified with interaction, visual states, save/resume, and completion
- Scope is focused: no scoring, no difficulty selection, no cloud sync — just local play
- No ambiguous requirements; color constants, sizing rules, and AsyncStorage keys are all explicit
