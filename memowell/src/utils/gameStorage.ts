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
