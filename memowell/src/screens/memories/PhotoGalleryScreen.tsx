import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useTTS } from '../../context/TTSContext';
import type { FamilyMember } from '../../types/user';
import LargeText from '../../components/common/LargeText';
import IconButton from '../../components/common/IconButton';
import PrimaryButton from '../../components/common/PrimaryButton';
import AnimatedCard from '../../components/common/AnimatedCard';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

function MemberCard({ member, onPress }: { member: FamilyMember; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.memberCard}>
      {member.photoURL ? (
        <Image source={{ uri: member.photoURL }} style={styles.memberPhoto} />
      ) : (
        <View style={[styles.memberPhoto, styles.memberPhotoPlaceholder]}>
          <LargeText size="H2">👤</LargeText>
        </View>
      )}
      <LargeText size="BODY" bold center style={styles.memberName}>{member.name}</LargeText>
      <LargeText size="CAPTION" center color={COLORS.MEDIUM_GRAY}>{member.relationship}</LargeText>
    </TouchableOpacity>
  );
}

export default function PhotoGalleryScreen() {
  const navigation = useNavigation();
  const { familyMembers } = useUser();
  const { speak } = useTTS();
  const [selected, setSelected] = useState<FamilyMember | null>(null);

  const callMember = (member: FamilyMember) => {
    if (!member.phoneNumber) {
      Alert.alert('No phone number', 'This family member does not have a phone number saved.');
      return;
    }
    Linking.openURL(`tel:${member.phoneNumber}`);
  };

  const readDetails = (member: FamilyMember) => {
    const traitsText = member.traits.length > 0 ? ' ' + member.traits.join('. ') + '.' : '';
    speak(`This is ${member.name}, your ${member.relationship.toLowerCase()}.${traitsText}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <IconButton name="chevron-back" onPress={() => navigation.goBack()} />
        <LargeText size="H2" bold>Family Photos</LargeText>
        <View style={{ width: 56 }} />
      </View>

      {familyMembers.length === 0 ? (
        <View style={styles.empty}>
          <LargeText size="H2" center>👨‍👩‍👧</LargeText>
          <LargeText size="H3" center style={{ marginTop: SPACING.MD }}>No family members added yet.</LargeText>
          <LargeText size="BODY" center color={COLORS.MEDIUM_GRAY} style={{ marginTop: SPACING.SM }}>
            Add family members in Settings.
          </LargeText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {familyMembers.map((m, i) => (
            <AnimatedCard key={m.id} delay={i * 80} style={styles.cellWrapper}>
              <MemberCard member={m} onPress={() => { setSelected(m); readDetails(m); }} />
            </AnimatedCard>
          ))}
        </ScrollView>
      )}

      {/* Detail modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && (
          <SafeAreaView style={styles.modal}>
            <IconButton name="close" onPress={() => setSelected(null)} style={styles.closeBtn} />

            {selected.photoURL ? (
              <Image source={{ uri: selected.photoURL }} style={styles.modalPhoto} />
            ) : (
              <View style={[styles.modalPhoto, styles.memberPhotoPlaceholder]}>
                <LargeText size="DISPLAY">👤</LargeText>
              </View>
            )}

            <LargeText size="H1" bold center style={{ marginTop: SPACING.LG }}>{selected.name}</LargeText>
            <LargeText size="H3" center color={COLORS.MEDIUM_GRAY}>{selected.relationship}</LargeText>

            {selected.traits.length > 0 && (
              <View style={styles.traitsRow}>
                {selected.traits.map((t, i) => (
                  <View key={i} style={styles.traitPill}>
                    <LargeText size="BODY" color={COLORS.SAGE_DARK}>{t}</LargeText>
                  </View>
                ))}
              </View>
            )}

            <IconButton
              name="volume-high"
              color={COLORS.SAGE_GREEN}
              onPress={() => readDetails(selected)}
              style={styles.speakBtn}
            />

            {selected.phoneNumber ? (
              <PrimaryButton
                label={`Call ${selected.name}`}
                onPress={() => callMember(selected)}
                style={styles.callBtn}
              />
            ) : null}
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.CREAM },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.XL },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.MD,
    gap: SPACING.MD,
  },
  cellWrapper: { width: '46%' },
  memberCard: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  memberPhoto: { width: 90, height: 90, borderRadius: 45 },
  memberPhotoPlaceholder: {
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberName: { marginTop: SPACING.SM },
  modal: { flex: 1, backgroundColor: COLORS.CREAM, alignItems: 'center', padding: SPACING.LG },
  closeBtn: { alignSelf: 'flex-end' },
  modalPhoto: { width: 180, height: 180, borderRadius: 90, marginTop: SPACING.LG },
  traitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.SM, justifyContent: 'center', marginTop: SPACING.LG },
  traitPill: {
    backgroundColor: COLORS.SAGE_GREEN + '25',
    borderRadius: RADIUS.FULL,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.SAGE_GREEN,
  },
  speakBtn: { marginTop: SPACING.LG },
  callBtn: { marginTop: SPACING.MD, width: '100%' },
});
