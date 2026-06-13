import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../../context/UserContext';
import { useTTS } from '../../context/TTSContext';
import LargeText from '../common/LargeText';
import IconButton from '../common/IconButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

function getDayIndex(): number {
  return Math.floor(Date.now() / 86400000);
}

interface Props {
  onPress?: () => void;
}

export default function FamilySpotlightCard({ onPress }: Props) {
  const { familyMembers } = useUser();
  const { speak } = useTTS();

  if (familyMembers.length === 0) {
    return (
      <View style={styles.card}>
        <LargeText size="H3" bold color={COLORS.WARM_WHITE}>Your Family</LargeText>
        <LargeText size="BODY" color={COLORS.WARM_WHITE} style={{ marginTop: SPACING.SM, opacity: 0.9 }}>
          Add family members in Settings to see them here.
        </LargeText>
      </View>
    );
  }

  const member = familyMembers[getDayIndex() % familyMembers.length];
  const ttsText = `This is ${member.name}, your ${member.relationship.toLowerCase()}.${member.traits.length > 0 ? ' ' + member.traits.join('. ') + '.' : ''}`;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <View style={styles.row}>
        {member.photoURL ? (
          <Image source={{ uri: member.photoURL }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <LargeText size="H2">👤</LargeText>
          </View>
        )}
        <View style={styles.info}>
          <LargeText size="CAPTION" color={COLORS.WARM_WHITE} style={styles.label}>
            Today's Family Spotlight
          </LargeText>
          <LargeText size="H2" bold color={COLORS.WARM_WHITE}>{member.name}</LargeText>
          <LargeText size="BODY" color={COLORS.WARM_WHITE} style={{ opacity: 0.9 }}>
            Your {member.relationship.toLowerCase()}
          </LargeText>
          {member.traits.length > 0 && (
            <View style={styles.traits}>
              {member.traits.slice(0, 2).map((t, i) => (
                <View key={i} style={styles.traitPill}>
                  <LargeText size="CAPTION" color={COLORS.CHARCOAL}>{t}</LargeText>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
      <IconButton
        name="volume-high"
        color={COLORS.WARM_WHITE}
        onPress={() => speak(ttsText)}
        style={styles.speakBtn}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.DUSTY_ROSE,
    borderRadius: RADIUS.LG,
    padding: SPACING.LG,
  },
  row: { flexDirection: 'row', gap: SPACING.MD, alignItems: 'center' },
  photo: { width: 90, height: 90, borderRadius: 45, flexShrink: 0 },
  photoPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1 },
  label: { opacity: 0.8, marginBottom: SPACING.XS },
  traits: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.XS, marginTop: SPACING.SM },
  traitPill: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: RADIUS.FULL,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 3,
  },
  speakBtn: { position: 'absolute', top: SPACING.SM, right: SPACING.SM },
});
