import React, { createContext, useContext, useState } from 'react';
import type { ColorScheme, FontScale } from '../types/user';
import { COLORS } from '../constants/colors';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
}

interface ThemeContextValue {
  fontScale: FontScale;
  colorScheme: ColorScheme;
  colors: ThemeColors;
  setFontScale: (s: FontScale) => void;
  setColorScheme: (s: ColorScheme) => void;
  scaled: (base: number) => number;
}

function buildColors(scheme: ColorScheme): ThemeColors {
  if (scheme === 'high-contrast') {
    return {
      background: '#000000',
      card: '#1A1A1A',
      text: '#FFFFFF',
      subtext: '#CCCCCC',
      border: '#FFFFFF',
      primary: '#FFD700',
    };
  }
  if (scheme === 'cool') {
    return {
      background: '#F0F4F8',
      card: '#FFFFFF',
      text: '#1A2B3C',
      subtext: '#5A7080',
      border: '#CBD5E0',
      primary: '#4A90C4',
    };
  }
  return {
    background: COLORS.CREAM,
    card: COLORS.WARM_WHITE,
    text: COLORS.CHARCOAL,
    subtext: COLORS.MEDIUM_GRAY,
    border: COLORS.LIGHT_GRAY,
    primary: COLORS.SAGE_GREEN,
  };
}

const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [fontScale, setFontScale] = useState<FontScale>(1.0);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('warm');

  const colors = buildColors(colorScheme);
  const scaled = (base: number) => Math.round(base * fontScale);

  return (
    <ThemeContext.Provider value={{ fontScale, colorScheme, colors, setFontScale, setColorScheme, scaled }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
