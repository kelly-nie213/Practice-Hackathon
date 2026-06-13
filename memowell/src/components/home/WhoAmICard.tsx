import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from '../../context/UserContext';
import { useTTS } from '../../context/TTSContext';
import LargeText from '../common/LargeText';
import IconButton from '../common/IconButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

export default function WhoAmICard() {
  const { profile } = useUser();
  const { speak } = useTTS();
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const facts = buildFacts(profile);

  useEffect(() => {
    if (facts.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % facts.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [facts.length]);

  const currentFact = facts[index] ?? '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <LargeText size="H3" bold>Remember Who You Are</LargeText>
        <IconButton name="volume-high" color={COLORS.SAGE_GREEN} onPress={() => speak(currentFact)} />
      </View>

      <LargeText size="H2" style={styles.fact}>{currentFact}</LargeText>

      {facts.length > 1 && (
        <View style={styles.dots}>
          {facts.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setIndex(i)} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

function buildFacts(profile: ReturnType<typeof useUser>['profile']): string[] {
  if (!profile) return ['You are wonderful, exactly as you are.'];
  const facts: string[] = [];
  if (profile.displayName) facts.push(`Your name is ${profile.displayName}.`);
  if (profile.hometown) facts.push(`You grew up in ${profile.hometown}.`);
  if (profile.occupation) facts.push(`You were a ${profile.occupation.toLowerCase()}.`);
  profile.funFacts.forEach((f) => facts.push(f));
  if (facts.length === 0) facts.push('You are loved and cared for.');
  return facts;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.LG,
    padding: SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.MD },
  fact: { lineHeight: 40, minHeight: 80 },
  dots: { flexDirection: 'row', gap: SPACING.XS, marginTop: SPACING.MD, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.LIGHT_GRAY },
  dotActive: { backgroundColor: COLORS.SAGE_GREEN, width: 20 },
});
