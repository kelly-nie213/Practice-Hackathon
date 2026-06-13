import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedCard({ children, delay = 0, style }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()} style={style}>
      {children}
    </Animated.View>
  );
}
