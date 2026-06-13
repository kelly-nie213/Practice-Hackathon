import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { SettingsStackParamList } from '../../types/navigation';
import type { FontScale, ColorScheme } from '../../types/user';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { signOut } from '../../services/firebase/authService';
import LargeText from '../../components/common/LargeText';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

type Nav = StackNavigationProp<SettingsStackParamList, 'SettingsHome'>;

function Row({ label, value, onPress }: { label: string; value?: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={0.7}>
      <LargeText size="BODY" style={{ flex: 1 }}>{label}</LargeText>
      {value && <LargeText size="BODY" color={COLORS.MEDIUM_GRAY}>{value}</LargeText>}
      <LargeText size="H3" color={COLORS.MEDIUM_GRAY}>›</LargeText>
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <LargeText size="CAPTION" bold color={COLORS.MEDIUM_GRAY} style={styles.sectionTitle}>{title.toUpperCase()}</LargeText>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

const FONT_OPTIONS: { label: string; value: FontScale }[] = [
  { label: 'Normal', value: 1.0 },
  { label: 'Large', value: 1.25 },
  { label: 'Extra Large', value: 1.5 },
];

const COLOR_OPTIONS: { label: string; value: ColorScheme }[] = [
  { label: 'Warm', value: 'warm' },
  { label: 'Cool', value: 'cool' },
  { label: 'High Contrast', value: 'high-contrast' },
];

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useUser();
  const { fontScale, colorScheme, setFontScale, setColorScheme, updateProfile } = { ...useTheme(), updateProfile: useUser().updateProfile };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LargeText size="H1" bold style={styles.heading}>Settings</LargeText>

      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Profile">
          <Row label="Edit My Profile" onPress={() => navigation.navigate('ProfileEdit')} />
          <Row label="Manage Family" onPress={() => navigation.navigate('FamilyEdit')} />
        </Section>

        <Section title="Appearance">
          <View style={styles.row}>
            <LargeText size="BODY" style={{ flex: 1 }}>Text Size</LargeText>
            <View style={styles.pillGroup}>
              {FONT_OPTIONS.map((o) => (
                <TouchableOpacity
                  key={o.value}
                  onPress={() => { setFontScale(o.value); updateProfile({ fontScale: o.value }); }}
                  style={[styles.pill, fontScale === o.value && styles.pillActive]}
                >
                  <LargeText size="CAPTION" color={fontScale === o.value ? COLORS.WARM_WHITE : COLORS.CHARCOAL}>
                    {o.label}
                  </LargeText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={[styles.row, { flexWrap: 'wrap', gap: SPACING.SM }]}>
            <LargeText size="BODY" style={{ width: '100%' }}>Color Theme</LargeText>
            {COLOR_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.value}
                onPress={() => { setColorScheme(o.value); updateProfile({ colorScheme: o.value }); }}
                style={[styles.pill, colorScheme === o.value && styles.pillActive]}
              >
                <LargeText size="CAPTION" color={colorScheme === o.value ? COLORS.WARM_WHITE : COLORS.CHARCOAL}>
                  {o.label}
                </LargeText>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title="Account">
          <TouchableOpacity onPress={handleSignOut} style={[styles.row, { justifyContent: 'center' }]}>
            <LargeText size="BODY" bold color={COLORS.DANGER_RED}>Sign Out</LargeText>
          </TouchableOpacity>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.CREAM },
  heading: { paddingHorizontal: SPACING.LG, paddingTop: SPACING.SM, marginBottom: SPACING.MD },
  content: { padding: SPACING.LG, paddingBottom: SPACING.XXL, gap: SPACING.LG },
  section: {},
  sectionTitle: { marginBottom: SPACING.SM, paddingHorizontal: SPACING.XS },
  sectionCard: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.MD,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
    minHeight: 56,
    gap: SPACING.SM,
  },
  pillGroup: { flexDirection: 'row', gap: SPACING.XS },
  pill: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 6,
    borderRadius: RADIUS.FULL,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  pillActive: { backgroundColor: COLORS.SAGE_GREEN },
});
