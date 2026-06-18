import { WORD_SEARCH_COLORS } from '../constants/colors';
import type { Difficulty, GridCell, WordPlacement, WordSearchPuzzle } from '../types/wordSearch';

interface DirectionVector {
  dr: number;
  dc: number;
}

const DIRECTIONS: Record<string, DirectionVector> = {
  N: { dr: -1, dc: 0 },
  S: { dr: 1, dc: 0 },
  E: { dr: 0, dc: 1 },
  W: { dr: 0, dc: -1 },
  NE: { dr: -1, dc: 1 },
  NW: { dr: -1, dc: -1 },
  SE: { dr: 1, dc: 1 },
  SW: { dr: 1, dc: -1 },
};

interface DifficultyConfig {
  gridSize: number;
  wordCount: number;
  directions: DirectionVector[];
  wordPool: string[];
}

// Themed around the warm, everyday-joy vocabulary already used across MemoWell's home cards.
const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    gridSize: 8,
    wordCount: 5,
    // Forward/down only — friendliest for first-time or shaky-hand players.
    directions: [DIRECTIONS.E, DIRECTIONS.S, DIRECTIONS.SE],
    wordPool: ['GARDEN', 'MUSIC', 'COFFEE', 'FAMILY', 'SUNSET', 'PICNIC', 'PHOTOS', 'LAUGH', 'CANDLE', 'RECIPE'],
  },
  medium: {
    gridSize: 10,
    wordCount: 7,
    directions: [DIRECTIONS.E, DIRECTIONS.S, DIRECTIONS.SE, DIRECTIONS.NE, DIRECTIONS.SW],
    wordPool: ['BIRTHDAY', 'BLANKET', 'JOURNEY', 'HOLIDAY', 'SUNSHINE', 'BLOSSOM', 'BISCUITS', 'CHERISH', 'HARVEST', 'PORTRAIT'],
  },
  hard: {
    gridSize: 12,
    wordCount: 9,
    // Full 8 directions, including backwards — classic word-search difficulty.
    directions: Object.values(DIRECTIONS),
    wordPool: ['GRANDKIDS', 'BUTTERFLY', 'HARMONICA', 'CELEBRATE', 'MEMORIES', 'STORYTIME', 'SERENADE', 'TREASURE', 'FIREPLACE', 'CHOCOLATE'],
  },
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function tryPlaceWords(
  words: string[],
  gridSize: number,
  directions: DirectionVector[]
): { grid: (string | null)[][]; placements: WordPlacement[] } {
  const grid: (string | null)[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  const placements: WordPlacement[] = [];
  const sorted = [...words].sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    let placed = false;
    for (let attempt = 0; attempt < 300 && !placed; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const cells: GridCell[] = [];
      let fits = true;

      for (let i = 0; i < word.length; i++) {
        const r = row + dir.dr * i;
        const c = col + dir.dc * i;
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
          fits = false;
          break;
        }
        const existing = grid[r][c];
        if (existing && existing !== word[i]) {
          fits = false;
          break;
        }
        cells.push({ row: r, col: c });
      }

      if (fits) {
        cells.forEach((cell, i) => {
          grid[cell.row][cell.col] = word[i];
        });
        placements.push({ word, cells });
        placed = true;
      }
    }
  }

  return { grid, placements };
}

export function createWordSearchPuzzle(difficulty: Difficulty): WordSearchPuzzle {
  const config = DIFFICULTY_CONFIG[difficulty];
  let best: { grid: (string | null)[][]; placements: WordPlacement[] } | null = null;

  for (let pass = 0; pass < 5; pass++) {
    const words = shuffle(config.wordPool).slice(0, config.wordCount);
    const result = tryPlaceWords(words, config.gridSize, config.directions);
    if (!best || result.placements.length > best.placements.length) best = result;
    if (result.placements.length === config.wordCount) break;
  }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const filledGrid: string[][] = best!.grid.map((row) =>
    row.map((cell) => cell ?? letters[Math.floor(Math.random() * letters.length)])
  );

  const colors: Record<string, string> = {};
  best!.placements.forEach((p, i) => {
    colors[p.word] = WORD_SEARCH_COLORS[i % WORD_SEARCH_COLORS.length];
  });

  return {
    difficulty,
    gridSize: config.gridSize,
    grid: filledGrid,
    placements: best!.placements,
    colors,
  };
}
