import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTTS } from '../../context/TTSContext';
import { COLORS } from '../../constants/colors';
import { RADIUS, SPACING } from '../../constants/spacing';

interface Props {
  children: React.ReactNode;
  speakText: string;
  onDoubleTap?: () => void;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

export default function SpeakableCard({ children, speakText, onDoubleTap, style, backgroundColor }: Props) {
  const { speak } = useTTS();
  const lastTap = React.useRef<number>(0);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 350 && onDoubleTap) {
      onDoubleTap();
    } else {
      speak(speakText);
    }
    lastTap.current = now;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: backgroundColor ?? COLORS.WARM_WHITE }, style]}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.MD,
    padding: SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
