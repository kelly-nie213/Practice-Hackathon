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
