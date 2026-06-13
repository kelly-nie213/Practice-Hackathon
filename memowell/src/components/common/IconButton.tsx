import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TOUCH_TARGET } from '../../constants/spacing';

interface Props {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function IconButton({ name, size = 28, color = '#2C2C2C', onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, style]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
