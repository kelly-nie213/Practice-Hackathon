import React, { useReducer, useRef } from 'react';
import { View, StyleSheet, PanResponder, LayoutChangeEvent, GestureResponderEvent } from 'react-native';
import LargeText from '../common/LargeText';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/colors';
import type { GridCell, WordSearchPuzzle } from '../../types/wordSearch';

interface Props {
  puzzle: WordSearchPuzzle;
  foundWords: string[];
  onWordFound: (word: string) => void;
  size: number;
}

function cellKey(c: GridCell): string {
  return `${c.row}-${c.col}`;
}

function cellsEqual(a: GridCell[], b: GridCell[]): boolean {
  return a.length === b.length && a.every((c, i) => c.row === b[i].row && c.col === b[i].col);
}

// Snaps a drag gesture to one of the 8 straight word-search directions.
function computeLine(start: GridCell, end: GridCell): GridCell[] | null {
  const dr = end.row - start.row;
  const dc = end.col - start.col;
  if (dr === 0 && dc === 0) return [start];
  const isStraight = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
  if (!isStraight) return null;

  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
  const cells: GridCell[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: start.row + stepR * i, col: start.col + stepC * i });
  }
  return cells;
}

export default function WordSearchGrid({ puzzle, foundWords, onWordFound, size }: Props) {
  const { colors, scaled } = useTheme();
  const [, bump] = useReducer((c) => c + 1, 0);
  const containerRef = useRef<View>(null);
  // pageX/Y of the grid container's top-left corner, used to convert touch
  // coordinates into container-relative ones (nativeEvent.locationX/Y is
  // relative to whichever nested cell view the touch actually landed on,
  // not the container, so it can't be used directly here).
  const containerOrigin = useRef({ x: 0, y: 0 });

  // Gesture-local state lives in a ref so it can be mutated without
  // triggering renders on every pixel of movement; `bump()` forces the
  // render only when the highlighted path actually changes.
  const sel = useRef<{ gestureStart: GridCell | null; activePath: GridCell[] }>({
    gestureStart: null,
    activePath: [],
  });

  const cellSize = size / puzzle.gridSize;

  const foundCellColor = new Map<string, string>();
  puzzle.placements.forEach((p) => {
    if (foundWords.includes(p.word)) {
      p.cells.forEach((c) => foundCellColor.set(cellKey(c), puzzle.colors[p.word]));
    }
  });

  const cellFromTouch = (x: number, y: number): GridCell => {
    const col = Math.min(puzzle.gridSize - 1, Math.max(0, Math.floor(x / cellSize)));
    const row = Math.min(puzzle.gridSize - 1, Math.max(0, Math.floor(y / cellSize)));
    return { row, col };
  };

  const relativeFromEvent = (evt: GestureResponderEvent) => {
    const { pageX, pageY } = evt.nativeEvent;
    return { x: pageX - containerOrigin.current.x, y: pageY - containerOrigin.current.y };
  };

  const evaluate = (path: GridCell[]) => {
    if (path.length < 2) return;
    const reversed = [...path].reverse();
    const match = puzzle.placements.find(
      (p) => !foundWords.includes(p.word) && (cellsEqual(p.cells, path) || cellsEqual(p.cells, reversed))
    );
    if (match) onWordFound(match.word);
  };

  // Recreated every render (cheap) so its closures always see the latest
  // cellSize/puzzle/foundWords — caching this in a one-time useRef froze
  // those values at their first-render state and broke selection entirely.
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    // The stack navigator's swipe-back gesture recognizer continuously
    // contests the responder while any touch moves across the screen. Without
    // refusing here, it intermittently wins mid-drag and silently kills the
    // selection, which is why dragging used to feel unreliable.
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (evt: GestureResponderEvent) => {
      const { x, y } = relativeFromEvent(evt);
      const cell = cellFromTouch(x, y);
      sel.current.gestureStart = cell;
      sel.current.activePath = [cell];
      bump();
    },
    onPanResponderMove: (evt: GestureResponderEvent) => {
      const base = sel.current.gestureStart;
      if (!base) return;
      const { x, y } = relativeFromEvent(evt);
      const cell = cellFromTouch(x, y);
      const line = computeLine(base, cell);
      if (line) {
        sel.current.activePath = line;
        bump();
      }
    },
    onPanResponderRelease: (evt: GestureResponderEvent) => {
      const base = sel.current.gestureStart;
      if (base) {
        const { x, y } = relativeFromEvent(evt);
        const cell = cellFromTouch(x, y);
        const line = computeLine(base, cell);
        if (line && line.length > 1) evaluate(line);
      }
      sel.current.gestureStart = null;
      sel.current.activePath = [];
      bump();
    },
  });

  const activeKeys = new Set(sel.current.activePath.map(cellKey));

  return (
    <View
      ref={containerRef}
      style={{ width: size, height: size }}
      onLayout={(_e: LayoutChangeEvent) => {
        containerRef.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
          containerOrigin.current = { x: pageX, y: pageY };
        });
      }}
      {...panResponder.panHandlers}
    >
      {puzzle.grid.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((letter, c) => {
            const key = `${r}-${c}`;
            const foundColor = foundCellColor.get(key);
            const isActive = activeKeys.has(key);
            const highlighted = foundColor ?? (isActive ? colors.primary : undefined);
            return (
              <View
                key={key}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  highlighted ? { backgroundColor: highlighted } : null,
                ]}
              >
                <LargeText
                  size="BODY"
                  bold
                  color={highlighted ? COLORS.WARM_WHITE : colors.text}
                  style={{ fontSize: scaled(Math.max(10, cellSize * 0.4)) }}
                >
                  {letter}
                </LargeText>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  cell: { justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
});
