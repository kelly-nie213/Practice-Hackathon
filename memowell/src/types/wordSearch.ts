export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GridCell {
  row: number;
  col: number;
}

export interface WordPlacement {
  word: string;
  cells: GridCell[];
}

export interface WordSearchPuzzle {
  difficulty: Difficulty;
  gridSize: number;
  grid: string[][];
  placements: WordPlacement[];
  colors: Record<string, string>;
}
