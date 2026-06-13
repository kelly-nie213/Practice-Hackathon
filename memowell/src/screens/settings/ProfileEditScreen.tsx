import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { uploadUserProfilePhoto } from '../../services/firebase/storageService';
import LargeText from '../../components/common/LargeText';
import PrimaryButton from '../../components/common/PrimaryButton';
import IconButton from '../../components/common/IconButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { profile, updateProfile } = useUser();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [hometown, setHometown] = useState(profile?.hometown ?? '');
  const [occupation, setOccupation] = useState(profile?.occupation ?? '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergencyContactPhone ?? '');
  const [funFact, setFunFact] = useState('');
  const [funFacts, setFunFacts] = useState<string[]>(profile?.funFacts ?? []);
  const [photoURI, setPhotoURI] = useState<string | null>(profile?.profilePhotoURL ?? null);
  const [saving, setSaving] = useState(false);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoURI(result.assets[0].uri);
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let profilePhotoURL = profile?.profilePhotoURL ?? '';
      if (photoURI && photoURI !== profile?.profilePhotoURL) {
        profilePhotoURL = await uploadUserProfilePhoto(user.uid, photoURI);
      }
      await updateProfile({
        displayName,
        hometown,
        occupation,
        emergencyContactPhone: emergencyPhone,
        funFacts,
        profilePhotoURL,
      });
      Alert.alert('Saved!', 'Profile updated successfully.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <IconButton name="chevron-back" onPress={() => navigation.goBack()} />
          <LargeText size="H2" bold>Edit Profile</LargeText>
          <View style={{ width: 56 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={pickPhoto} style={styles.photoPicker}>
            {photoURI ? (
              <Image source={{ uri: photoURI }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder]}>
                <LargeText size="H2" center>📷</LargeText>
              </View>
            )}
            <LargeText size="CAPTION" center color={COLORS.SAGE_GREEN} style={{ marginTop: SPACING.XS }}>
              Change Photo
            </LargeText>
          </TouchableOpacity>

          {[
            { label: 'Preferred Name', value: displayName, set: setDisplayName, placeholder: 'e.g. Eleanor' },
            { label: 'Hometown', value: hometown, set: setHometown, placeholder: 'e.g. Savannah, Georgia' },
            { label: 'Former Occupation', value: occupation, set: setOccupation, placeholder: 'e.g. Schoolteacher' },
            { label: 'Emergency Contact Phone', value: emergencyPhone, set: setEmergencyPhone, placeholder: '+1 555-000-0000' },
          ].map((f) => (
            <View key={f.label} style={styles.fieldGroup}>
              <LargeText size="BODY" bold style={styles.label}>{f.label}</LargeText>
              <TextInput
                value={f.value}
                onChangeText={f.set}
                placeholder={f.placeholder}
                placeholderTextColor={COLORS.MEDIUM_GRAY}
                style={styles.input}
              />
            </View>
          ))}

          <View style={styles.fieldGroup}>
            <LargeText size="BODY" bold style={styles.label}>Fun Facts</LargeText>
            {funFacts.map((f, i) => (
              <View key={i} style={styles.factRow}>
                <LargeText size="BODY" style={{ flex: 1 }}>{f}</LargeText>
                <TouchableOpacity onPress={() => setFunFacts((p) => p.filter((_, j) => j !== i))}>
                  <LargeText size="BODY" color={COLORS.DANGER_RED}>✕</LargeText>
                </TouchableOpacity>
              </View>
            ))}
            {funFacts.length < 6 && (
              <View style={styles.addRow}>
                <TextInput
                  value={funFact}
                  onChangeText={setFunFact}
                  placeholder='e.g. "Loves gardening"'
                  placeholderTextColor={COLORS.MEDIUM_GRAY}
                  style={[styles.input, { flex: 1 }]}
                  onSubmitEditing={() => { if (funFact.trim()) { setFunFacts((p) => [...p, funFact.trim()]); setFunFact(''); } }}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={() => { if (funFact.trim()) { setFunFacts((p) => [...p, funFact.trim()]); setFunFact(''); } }} style={styles.addBtn}>
                  <LargeText size="H3" color={COLORS.SAGE_GREEN}>+</LargeText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <PrimaryButton label="Save Changes" onPress={save} loading={saving} style={{ marginTop: SPACING.LG }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: { padding: SPACING.LG, paddingBottom: SPACING.XXL },
  photoPicker: { alignSelf: 'center', marginBottom: SPACING.LG },
  photo: { width: 110, height: 110, borderRadius: 55 },
  photoPlaceholder: { backgroundColor: COLORS.LIGHT_GRAY, justifyContent: 'center', alignItems: 'center' },
  fieldGroup: { marginBottom: SPACING.MD },
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
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.SM,
    padding: SPACING.SM,
    marginBottom: SPACING.XS,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    gap: SPACING.SM,
  },
  addRow: { flexDirection: 'row', gap: SPACING.SM, marginTop: SPACING.XS },
  addBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
