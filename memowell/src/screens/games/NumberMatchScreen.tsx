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
