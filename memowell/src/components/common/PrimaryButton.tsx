import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import LargeText from './LargeText';
import { COLORS } from '../../constants/colors';
import { RADIUS, SPACING } from '../../constants/spacing';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
}

const BG: Record<string, string> = {
  primary: COLORS.SAGE_GREEN,
  secondary: COLORS.WARM_WHITE,
  danger: COLORS.DANGER_RED,
};

const TEXT_COLOR: Record<string, string> = {
  primary: COLORS.WARM_WHITE,
  secondary: COLORS.SAGE_GREEN,
  danger: COLORS.WARM_WHITE,
};

export default function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: BG[variant], opacity: disabled ? 0.5 : 1 },
        variant === 'secondary' && styles.outlined,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={TEXT_COLOR[variant]} />
      ) : (
        <LargeText size="BODY_LARGE" bold color={TEXT_COLOR[variant]} center>
          {label}
        </LargeText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.XL,
  },
  outlined: {
    borderWidth: 2,
    borderColor: COLORS.SAGE_GREEN,
  },
});
