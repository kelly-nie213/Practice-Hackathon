import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BASE_FONT } from '../../constants/typography';

interface Props {
  children: React.ReactNode;
  size?: keyof typeof BASE_FONT;
  color?: string;
  bold?: boolean;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export default function LargeText({
  children,
  size = 'BODY',
  color,
  bold,
  center,
  style,
  numberOfLines,
}: Props) {
  const { scaled, colors } = useTheme();

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize: scaled(BASE_FONT[size]),
          lineHeight: scaled(BASE_FONT[size]) * 1.45,
          color: color ?? colors.text,
          fontWeight: bold ? '700' : '400',
          textAlign: center ? 'center' : 'left',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
