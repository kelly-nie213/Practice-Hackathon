import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useWeather } from '../../hooks/useWeather';
import { useTTS } from '../../context/TTSContext';
import { useUser } from '../../context/UserContext';
import LargeText from '../common/LargeText';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

function getGreeting(displayName: string): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  return `Good ${part}, ${displayName}`;
}

export default function DateWeatherCard({ autoSpeak = true }: { autoSpeak?: boolean }) {
  const { profile } = useUser();
  const { weather } = useWeather(
    profile?.homeLatLng?.lat ?? null,
    profile?.homeLatLng?.lng ?? null
  );
  const { speak } = useTTS();

  const now = new Date();
  const dateStr = format(now, 'EEEE, MMMM d, yyyy');
  const timeStr = format(now, 'h:mm a');
  const greeting = getGreeting(profile?.displayName ?? 'Friend');

  useEffect(() => {
    if (!autoSpeak) return;
    const ttsText = `${greeting}. Today is ${dateStr}. The time is ${timeStr}.${weather ? ` It is ${weather.temperatureF} degrees and ${weather.condition} in ${profile?.hometown ?? 'your area'}.` : ''}`;
    const t = setTimeout(() => speak(ttsText), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSpeak, profile?.displayName, weather]);

  return (
    <View style={styles.card}>
      <LargeText size="H2" bold color={COLORS.WARM_WHITE}>{greeting}</LargeText>
      <LargeText size="DISPLAY" bold color={COLORS.WARM_WHITE} style={styles.time}>{timeStr}</LargeText>
      <LargeText size="H3" color={COLORS.WARM_WHITE} style={styles.date}>{dateStr}</LargeText>

      {weather && (
        <View style={styles.weatherRow}>
          <Ionicons name={weather.iconName as any} size={28} color={COLORS.WARM_WHITE} />
          <LargeText size="H3" color={COLORS.WARM_WHITE} style={styles.weatherText}>
            {weather.temperatureF}°F · {weather.condition}
          </LargeText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.SAGE_GREEN,
    borderRadius: RADIUS.LG,
    padding: SPACING.LG,
    paddingVertical: SPACING.XL,
  },
  time: {
    marginTop: SPACING.SM,
    lineHeight: 56,
  },
  date: {
    marginTop: SPACING.XS,
    opacity: 0.9,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.MD,
    gap: SPACING.SM,
  },
  weatherText: { opacity: 0.95 },
});
