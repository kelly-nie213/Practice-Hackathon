import React, { useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../types/navigation';
import LargeText from '../../components/common/LargeText';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';
import { signUp } from '../../services/firebase/authService';
import { setUserProfile } from '../../services/firebase/firestore';
import { uploadUserProfilePhoto } from '../../services/firebase/storageService';

type Nav = StackNavigationProp<OnboardingStackParamList, 'ProfileSetup'>;

interface Field {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

const FIELDS: Field[] = [
  { key: 'displayName', label: 'Preferred First Name', placeholder: 'e.g. Eleanor' },
  { key: 'fullName', label: 'Full Name', placeholder: 'e.g. Eleanor Rose Jamison' },
  { key: 'dateOfBirth', label: 'Date of Birth', placeholder: 'e.g. March 14, 1945' },
  { key: 'hometown', label: 'Hometown', placeholder: 'e.g. Savannah, Georgia' },
  { key: 'occupation', label: 'Former Occupation', placeholder: 'e.g. Retired schoolteacher' },
];

export default function ProfileSetupScreen() {
  const navigation = useNavigation<Nav>();
  const [form, setForm] = useState<Record<string, string>>({});
  const [funFact, setFunFact] = useState('');
  const [funFacts, setFunFacts] = useState<string[]>([]);
  const [photoURI, setPhotoURI] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoURI(result.assets[0].uri);
  };

  const addFact = () => {
    if (funFact.trim() && funFacts.length < 6) {
      setFunFacts((f) => [...f, funFact.trim()]);
      setFunFact('');
    }
  };

  const next = async () => {
    if (!form.displayName || !form.fullName || !email || !password) {
      Alert.alert('Missing info', 'Please fill in at least the name, email, and password fields.');
      return;
    }
    setLoading(true);
    try {
      const user = await signUp(email, password);
      let profilePhotoURL = '';
      if (photoURI) {
        profilePhotoURL = await uploadUserProfilePhoto(user.uid, photoURI);
      }
      await setUserProfile(user.uid, {
        uid: user.uid,
        displayName: form.displayName ?? '',
        fullName: form.fullName ?? '',
        dateOfBirth: form.dateOfBirth ?? '',
        hometown: form.hometown ?? '',
        occupation: form.occupation ?? '',
        funFacts,
        profilePhotoURL,
        fontScale: 1.0,
        colorScheme: 'warm',
        morningChecklistTime: '08:00',
        eveningChecklistTime: '21:00',
        medicationReminderTimes: [],
        musicGenrePreference: 'None',
        homeAddress: '',
        homeLatLng: null,
        emergencyContactPhone: '',
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      });
      navigation.navigate('FamilySetup');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Progress */}
        <View style={styles.progress}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
          ))}
        </View>

        <LargeText size="H1" bold style={styles.title}>About the Patient</LargeText>
        <LargeText size="BODY" color={COLORS.MEDIUM_GRAY} style={styles.subtitle}>
          Tell us a little about the person using MemoWell.
        </LargeText>

        {/* Photo */}
        <TouchableOpacity onPress={pickPhoto} style={styles.photoPicker}>
          {photoURI ? (
            <Image source={{ uri: photoURI }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <LargeText size="H2" center>📷</LargeText>
              <LargeText size="CAPTION" center color={COLORS.MEDIUM_GRAY}>Add Photo</LargeText>
            </View>
          )}
        </TouchableOpacity>

        {FIELDS.map((f) => (
          <View key={f.key} style={styles.fieldGroup}>
            <LargeText size="BODY" bold style={styles.label}>{f.label}</LargeText>
            <TextInput
              value={form[f.key] ?? ''}
              onChangeText={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
              placeholder={f.placeholder}
              placeholderTextColor={COLORS.MEDIUM_GRAY}
              style={styles.input}
              multiline={f.multiline}
            />
          </View>
        ))}

        {/* Fun facts */}
        <View style={styles.fieldGroup}>
          <LargeText size="BODY" bold style={styles.label}>Fun Facts (up to 6)</LargeText>
          {funFacts.map((f, i) => (
            <View key={i} style={styles.pill}>
              <LargeText size="BODY" color={COLORS.SAGE_DARK}>{f}</LargeText>
              <TouchableOpacity onPress={() => setFunFacts((prev) => prev.filter((_, j) => j !== i))}>
                <LargeText size="BODY" color={COLORS.DANGER_RED}> ✕</LargeText>
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.factRow}>
            <TextInput
              value={funFact}
              onChangeText={setFunFact}
              placeholder='e.g. "Loves gardening"'
              placeholderTextColor={COLORS.MEDIUM_GRAY}
              style={[styles.input, { flex: 1 }]}
              onSubmitEditing={addFact}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={addFact} style={styles.addBtn}>
              <LargeText size="H3" color={COLORS.SAGE_GREEN}>+</LargeText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account */}
        <LargeText size="H3" bold style={[styles.title, { marginTop: SPACING.LG }]}>Caregiver Account</LargeText>
        <View style={styles.fieldGroup}>
          <LargeText size="BODY" bold style={styles.label}>Email</LargeText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="caregiver@email.com"
            placeholderTextColor={COLORS.MEDIUM_GRAY}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.fieldGroup}>
          <LargeText size="BODY" bold style={styles.label}>Password</LargeText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor={COLORS.MEDIUM_GRAY}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <PrimaryButton label="Next: Add Family" onPress={next} loading={loading} style={styles.btn} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  photoPicker: { alignSelf: 'center', marginBottom: SPACING.LG },
  photo: { width: 120, height: 120, borderRadius: 60 },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.FULL,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    marginBottom: SPACING.XS,
    borderWidth: 1,
    borderColor: COLORS.SAGE_GREEN,
    alignSelf: 'flex-start',
  },
  factRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.SM },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: { marginTop: SPACING.LG },
});
