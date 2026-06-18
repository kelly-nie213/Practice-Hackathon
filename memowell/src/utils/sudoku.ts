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
