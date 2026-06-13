import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../types/navigation';
import type { FontScale, ColorScheme, MusicGenre } from '../../types/user';
import LargeText from '../../components/common/LargeText';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { setUserProfile, seedChecklistItems } from '../../services/firebase/firestore';
import { DEFAULT_MORNING_ITEMS, DEFAULT_EVENING_ITEMS } from '../../constants/checklistItems';

type Nav = StackNavigationProp<OnboardingStackParamList, 'Preferences'>;

const FONT_OPTIONS: { label: string; value: FontScale; preview: string }[] = [
  { label: 'Normal', value: 1.0, preview: 'Aa' },
  { label: 'Large', value: 1.25, preview: 'Aa' },
  { label: 'Extra Large', value: 1.5, preview: 'Aa' },
];

const COLOR_OPTIONS: { label: string; value: ColorScheme; bg: string; accent: string }[] = [
  { label: 'Warm', value: 'warm', bg: COLORS.CREAM, accent: COLORS.SAGE_GREEN },
  { label: 'Cool', value: 'cool', bg: '#F0F4F8', accent: '#4A90C4' },
  { label: 'High Contrast', value: 'high-contrast', bg: '#000000', accent: '#FFD700' },
];

const MUSIC_GENRES: MusicGenre[] = ['Jazz', 'Classical', 'Country', 'Pop', 'Folk', 'None'];

const EMERGENCY_DEFAULT = '';

export default function PreferencesScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { setFontScale, setColorScheme } = useTheme();

  const [fontScale, setFS] = useState<FontScale>(1.0);
  const [colorScheme, setCS] = useState<ColorScheme>('warm');
  const [musicGenre, setMG] = useState<MusicGenre>('None');
  const [emergencyPhone, setEP] = useState('');
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setUserProfile(user.uid, {
        fontScale,
        colorScheme,
        musicGenrePreference: musicGenre,
        emergencyContactPhone: emergencyPhone,
        onboardingComplete: true,
      });
      await seedChecklistItems(user.uid, [...DEFAULT_MORNING_ITEMS, ...DEFAULT_EVENING_ITEMS]);
      setFontScale(fontScale);
      setColorScheme(colorScheme);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
    // RootNavigator will auto-redirect to Main once onboardingComplete = true
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.progress}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 2 && styles.dotActive]} />
        ))}
      </View>

      <LargeText size="H1" bold style={styles.title}>Personalize</LargeText>
      <LargeText size="BODY" color={COLORS.MEDIUM_GRAY} style={styles.subtitle}>
        Set up the app to feel just right.
      </LargeText>

      {/* Font size */}
      <LargeText size="H3" bold style={styles.sectionLabel}>Text Size</LargeText>
      <View style={styles.row}>
        {FONT_OPTIONS.map((o) => (
          <TouchableOpacity
            key={o.value}
            onPress={() => setFS(o.value)}
            style={[styles.fontCard, fontScale === o.value && styles.cardActive]}
          >
            <LargeText
              size="BODY"
              style={{ fontSize: 20 * o.value }}
              bold
              center
              color={fontScale === o.value ? COLORS.SAGE_GREEN : COLORS.CHARCOAL}
            >
              {o.preview}
            </LargeText>
            <LargeText size="CAPTION" center color={fontScale === o.value ? COLORS.SAGE_GREEN : COLORS.MEDIUM_GRAY}>
              {o.label}
            </LargeText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Color scheme */}
      <LargeText size="H3" bold style={styles.sectionLabel}>Color Theme</LargeText>
      <View style={styles.row}>
        {COLOR_OPTIONS.map((o) => (
          <TouchableOpacity
            key={o.value}
            onPress={() => setCS(o.value)}
            style={[styles.colorCard, { backgroundColor: o.bg }, colorScheme === o.value && styles.cardActive]}
          >
            <View style={[styles.colorDot, { backgroundColor: o.accent }]} />
            <LargeText size="CAPTION" center color={o.bg === '#000000' ? '#FFF' : COLORS.CHARCOAL}>
              {o.label}
            </LargeText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Music */}
      <LargeText size="H3" bold style={styles.sectionLabel}>Favorite Music Style</LargeText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
        {MUSIC_GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setMG(g)}
            style={[styles.genrePill, musicGenre === g && styles.genrePillActive]}
          >
            <LargeText size="BODY" color={musicGenre === g ? COLORS.WARM_WHITE : COLORS.CHARCOAL}>{g}</LargeText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <PrimaryButton label="Finish Setup" onPress={finish} loading={loading} style={{ marginTop: SPACING.XL }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.CREAM },
  content: { padding: SPACING.LG, paddingBottom: SPACING.XXL },
  progress: { flexDirection: 'row', gap: SPACING.SM, marginBottom: SPACING.LG },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.LIGHT_GRAY },
  dotActive: { backgroundColor: COLORS.SAGE_GREEN, width: 28 },
  title: { marginBottom: SPACING.SM },
  subtitle: { marginBottom: SPACING.LG },
  sectionLabel: { marginTop: SPACING.LG, marginBottom: SPACING.SM },
  row: { flexDirection: 'row', gap: SPACING.MD },
  fontCard: {
    flex: 1,
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.SM,
    padding: SPACING.MD,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: SPACING.XS,
  },
  colorCard: {
    flex: 1,
    borderRadius: RADIUS.SM,
    padding: SPACING.MD,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: SPACING.SM,
    minHeight: 80,
    justifyContent: 'center',
  },
  cardActive: { borderColor: COLORS.SAGE_GREEN },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  pillRow: { marginBottom: SPACING.SM },
  genrePill: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.FULL,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginRight: SPACING.SM,
  },
  genrePillActive: { backgroundColor: COLORS.SAGE_GREEN },
});
