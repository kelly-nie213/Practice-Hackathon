import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../types/navigation';
import type { FamilyMember, Relationship } from '../../types/user';
import LargeText from '../../components/common/LargeText';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';
import { addFamilyMember, getFamilyMembers } from '../../services/firebase/firestore';
import { uploadFamilyMemberPhoto } from '../../services/firebase/storageService';

type Nav = StackNavigationProp<OnboardingStackParamList, 'FamilySetup'>;

const RELATIONSHIPS: Relationship[] = ['Spouse', 'Son', 'Daughter', 'Grandchild', 'Friend', 'Caregiver', 'Other'];

function MemberCard({ member, onRemove }: { member: FamilyMember; onRemove: () => void }) {
  return (
    <View style={styles.memberCard}>
      {member.photoURL ? (
        <Image source={{ uri: member.photoURL }} style={styles.memberPhoto} />
      ) : (
        <View style={[styles.memberPhoto, styles.memberPhotoPlaceholder]}>
          <LargeText size="H2">👤</LargeText>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <LargeText size="BODY" bold>{member.name}</LargeText>
        <LargeText size="CAPTION" color={COLORS.MEDIUM_GRAY}>{member.relationship}</LargeText>
      </View>
      <TouchableOpacity onPress={onRemove}>
        <LargeText size="BODY" color={COLORS.DANGER_RED}>✕</LargeText>
      </TouchableOpacity>
    </View>
  );
}

export default function FamilySetupScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal form state
  const [mName, setMName] = useState('');
  const [mRelationship, setMRelationship] = useState<Relationship>('Daughter');
  const [mPhone, setMPhone] = useState('');
  const [mTrait, setMTrait] = useState('');
  const [mTraits, setMTraits] = useState<string[]>([]);
  const [mPhotoURI, setMPhotoURI] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      getFamilyMembers(user.uid).then(setMembers).catch(() => {});
    }
  }, [user]);

  const resetModal = () => {
    setMName(''); setMRelationship('Daughter'); setMPhone('');
    setMTrait(''); setMTraits([]); setMPhotoURI(null);
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setMPhotoURI(result.assets[0].uri);
  };

  const saveMember = async () => {
    if (!mName.trim() || !user) return;
    setSaving(true);
    try {
      const tempId = `tmp_${Date.now()}`;
      let photoURL = '';
      if (mPhotoURI) {
        photoURL = await uploadFamilyMemberPhoto(user.uid, tempId, mPhotoURI);
      }
      const newMember: Omit<FamilyMember, 'id'> = {
        name: mName.trim(),
        relationship: mRelationship,
        photoURL,
        phoneNumber: mPhone.trim(),
        traits: mTraits,
        birthday: null,
        displayOrder: members.length,
      };
      const id = await addFamilyMember(user.uid, newMember);
      setMembers((prev) => [...prev, { id, ...newMember }]);
      setModalVisible(false);
      resetModal();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const next = async () => {
    navigation.navigate('Preferences');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.CREAM }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progress}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </View>

        <LargeText size="H1" bold style={styles.title}>Your Family</LargeText>
        <LargeText size="BODY" color={COLORS.MEDIUM_GRAY} style={styles.subtitle}>
          Add family members so the app can show familiar faces and allow quick calls.
        </LargeText>

        {members.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            onRemove={() => setMembers((prev) => prev.filter((x) => x.id !== m.id))}
          />
        ))}

        <TouchableOpacity style={styles.addCard} onPress={() => setModalVisible(true)}>
          <LargeText size="H2" center color={COLORS.SAGE_GREEN}>+ Add Family Member</LargeText>
        </TouchableOpacity>

        <PrimaryButton label="Next: Preferences" onPress={next} style={{ marginTop: SPACING.LG }} />
        <PrimaryButton
          label="Skip for Now"
          onPress={next}
          variant="secondary"
          style={{ marginTop: SPACING.SM }}
        />
      </ScrollView>

      {/* Add member modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
          <LargeText size="H2" bold style={styles.title}>New Family Member</LargeText>

          <TouchableOpacity onPress={pickPhoto} style={styles.photoPicker}>
            {mPhotoURI ? (
              <Image source={{ uri: mPhotoURI }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder]}>
                <LargeText size="H2" center>📷</LargeText>
                <LargeText size="CAPTION" center color={COLORS.MEDIUM_GRAY}>Photo</LargeText>
              </View>
            )}
          </TouchableOpacity>

          <LargeText size="BODY" bold style={styles.label}>Name</LargeText>
          <TextInput value={mName} onChangeText={setMName} placeholder="e.g. Margaret" placeholderTextColor={COLORS.MEDIUM_GRAY} style={styles.input} />

          <LargeText size="BODY" bold style={[styles.label, { marginTop: SPACING.MD }]}>Relationship</LargeText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
            {RELATIONSHIPS.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setMRelationship(r)}
                style={[styles.relPill, mRelationship === r && styles.relPillActive]}
              >
                <LargeText size="BODY" color={mRelationship === r ? COLORS.WARM_WHITE : COLORS.CHARCOAL}>{r}</LargeText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <LargeText size="BODY" bold style={[styles.label, { marginTop: SPACING.MD }]}>Phone Number</LargeText>
          <TextInput value={mPhone} onChangeText={setMPhone} placeholder="+1 555-000-0000" placeholderTextColor={COLORS.MEDIUM_GRAY} style={styles.input} keyboardType="phone-pad" />

          <LargeText size="BODY" bold style={[styles.label, { marginTop: SPACING.MD }]}>Traits (up to 4)</LargeText>
          {mTraits.map((t, i) => (
            <View key={i} style={styles.memberCard}>
              <LargeText size="BODY" style={{ flex: 1 }}>{t}</LargeText>
              <TouchableOpacity onPress={() => setMTraits((p) => p.filter((_, j) => j !== i))}>
                <LargeText size="BODY" color={COLORS.DANGER_RED}>✕</LargeText>
              </TouchableOpacity>
            </View>
          ))}
          {mTraits.length < 4 && (
            <View style={styles.factRow}>
              <TextInput value={mTrait} onChangeText={setMTrait} placeholder='e.g. "Loves cooking"' placeholderTextColor={COLORS.MEDIUM_GRAY} style={[styles.input, { flex: 1 }]} onSubmitEditing={() => { if (mTrait.trim()) { setMTraits((p) => [...p, mTrait.trim()]); setMTrait(''); } }} returnKeyType="done" />
              <TouchableOpacity onPress={() => { if (mTrait.trim()) { setMTraits((p) => [...p, mTrait.trim()]); setMTrait(''); } }} style={styles.addBtn}>
                <LargeText size="H3" color={COLORS.SAGE_GREEN}>+</LargeText>
              </TouchableOpacity>
            </View>
          )}

          <PrimaryButton label="Save" onPress={saveMember} loading={saving} style={{ marginTop: SPACING.LG }} />
          <PrimaryButton label="Cancel" onPress={() => { setModalVisible(false); resetModal(); }} variant="secondary" style={{ marginTop: SPACING.SM }} />
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.LG, paddingBottom: SPACING.XXL },
  progress: { flexDirection: 'row', gap: SPACING.SM, marginBottom: SPACING.LG },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.LIGHT_GRAY },
  dotActive: { backgroundColor: COLORS.SAGE_GREEN, width: 28 },
  title: { marginBottom: SPACING.SM },
  subtitle: { marginBottom: SPACING.LG },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.SM,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    gap: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  memberPhoto: { width: 56, height: 56, borderRadius: 28 },
  memberPhotoPlaceholder: { backgroundColor: COLORS.LIGHT_GRAY, justifyContent: 'center', alignItems: 'center' },
  addCard: {
    borderWidth: 2,
    borderColor: COLORS.SAGE_GREEN,
    borderStyle: 'dashed',
    borderRadius: RADIUS.MD,
    padding: SPACING.LG,
    alignItems: 'center',
    marginTop: SPACING.SM,
  },
  modal: { flex: 1, backgroundColor: COLORS.CREAM },
  modalContent: { padding: SPACING.LG, paddingBottom: SPACING.XXL },
  photoPicker: { alignSelf: 'center', marginBottom: SPACING.LG },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoPlaceholder: { backgroundColor: COLORS.LIGHT_GRAY, justifyContent: 'center', alignItems: 'center' },
  label: { marginBottom: SPACING.XS },
  input: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.SM,
    padding: SPACING.MD,
    fontSize: 17,
    color: COLORS.CHARCOAL,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
  },
  pillRow: { marginBottom: SPACING.SM },
  relPill: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.FULL,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginRight: SPACING.SM,
  },
  relPillActive: { backgroundColor: COLORS.SAGE_GREEN },
  factRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.SM, marginTop: SPACING.XS },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
