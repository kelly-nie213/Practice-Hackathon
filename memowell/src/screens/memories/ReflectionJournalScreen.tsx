import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useAuth } from '../../context/AuthContext';
import { addJournalEntry, getJournalEntries } from '../../services/firebase/firestore';
import type { JournalEntry, Mood } from '../../types/user';
import { JOURNAL_PROMPTS } from '../../constants/checklistItems';
import LargeText from '../../components/common/LargeText';
import IconButton from '../../components/common/IconButton';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'grateful', emoji: '🙏', label: 'Grateful' },
  { value: 'worried', emoji: '😟', label: 'Worried' },
  { value: 'confused', emoji: '😕', label: 'Confused' },
];

function getTodayPrompt(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return JOURNAL_PROMPTS[dayOfYear % JOURNAL_PROMPTS.length];
}

export default function ReflectionJournalScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [response, setResponse] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [listening, setListening] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>([]);

  const prompt = getTodayPrompt();

  useEffect(() => {
    if (!user) return;
    getJournalEntries(user.uid).then(setPastEntries).catch(() => {});
  }, [user]);

  useSpeechRecognitionEvent('result', (event) => {
    if (event.results[0]) {
      setResponse((prev) => prev + ' ' + event.results[0].transcript);
    }
  });

  useSpeechRecognitionEvent('end', () => setListening(false));

  const toggleListening = async () => {
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      setListening(false);
    } else {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert('Permission needed', 'Please allow microphone access to use voice input.');
        return;
      }
      ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true });
      setListening(true);
    }
  };

  const save = async () => {
    if (!user || !response.trim()) {
      Alert.alert('Empty entry', 'Please write or speak your reflection before saving.');
      return;
    }
    setSaving(true);
    try {
      const entry: Omit<JournalEntry, 'id'> = {
        date: new Date().toISOString(),
        promptQuestion: prompt,
        responseText: response.trim(),
        responseAudioURL: null,
        mood,
      };
      await addJournalEntry(user.uid, entry);
      const updated = await getJournalEntries(user.uid);
      setPastEntries(updated);
      setResponse('');
      setMood(null);
      Alert.alert('Saved!', 'Your reflection has been saved. 💛');
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
          <LargeText size="H2" bold>Reflection</LargeText>
          <View style={{ width: 56 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Prompt */}
          <View style={styles.promptCard}>
            <LargeText size="CAPTION" color={COLORS.MEDIUM_GRAY} style={styles.promptLabel}>
              Today's Question
            </LargeText>
            <LargeText size="H2" bold>{prompt}</LargeText>
          </View>

          {/* Response input */}
          <View style={styles.inputCard}>
            <TextInput
              value={response}
              onChangeText={setResponse}
              placeholder="Write your thoughts here..."
              placeholderTextColor={COLORS.MEDIUM_GRAY}
              multiline
              style={styles.textInput}
              textAlignVertical="top"
            />
            <TouchableOpacity onPress={toggleListening} style={[styles.voiceBtn, listening && styles.voiceBtnActive]}>
              <LargeText size="BODY" color={listening ? COLORS.WARM_WHITE : COLORS.SAGE_GREEN} bold>
                {listening ? '🎤 Listening... Tap to Stop' : '🎤 Speak Instead'}
              </LargeText>
            </TouchableOpacity>
          </View>

          {/* Mood */}
          <LargeText size="H3" bold style={styles.sectionLabel}>How are you feeling?</LargeText>
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.value}
                onPress={() => setMood(m.value)}
                style={[styles.moodBtn, mood === m.value && styles.moodBtnActive]}
              >
                <LargeText size="H2" center>{m.emoji}</LargeText>
                <LargeText size="CAPTION" center color={mood === m.value ? COLORS.SAGE_DARK : COLORS.MEDIUM_GRAY}>
                  {m.label}
                </LargeText>
              </TouchableOpacity>
            ))}
          </View>

          <PrimaryButton label="Save Reflection" onPress={save} loading={saving} style={styles.saveBtn} />

          {/* Past entries */}
          {pastEntries.length > 0 && (
            <>
              <LargeText size="H3" bold style={styles.sectionLabel}>Past Reflections</LargeText>
              {pastEntries.slice(0, 5).map((e) => (
                <View key={e.id} style={styles.pastEntry}>
                  <LargeText size="CAPTION" color={COLORS.MEDIUM_GRAY}>
                    {format(new Date(e.date), 'MMMM d, yyyy')}
                  </LargeText>
                  <LargeText size="BODY" style={styles.pastText} numberOfLines={3}>{e.responseText}</LargeText>
                </View>
              ))}
            </>
          )}
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
  promptCard: {
    backgroundColor: COLORS.LAVENDER + '33',
    borderRadius: RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.LAVENDER,
  },
  promptLabel: { marginBottom: SPACING.XS },
  inputCard: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.LG,
    padding: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: SPACING.LG,
  },
  textInput: {
    fontSize: 18,
    color: COLORS.CHARCOAL,
    minHeight: 120,
    lineHeight: 28,
  },
  voiceBtn: {
    marginTop: SPACING.MD,
    padding: SPACING.SM,
    borderRadius: RADIUS.SM,
    borderWidth: 1.5,
    borderColor: COLORS.SAGE_GREEN,
    alignItems: 'center',
  },
  voiceBtnActive: { backgroundColor: COLORS.SAGE_GREEN },
  sectionLabel: { marginBottom: SPACING.MD },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.LG },
  moodBtn: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.SM,
    borderRadius: RADIUS.SM,
    gap: SPACING.XS,
  },
  moodBtnActive: { backgroundColor: COLORS.SAGE_GREEN + '25', borderRadius: RADIUS.SM },
  saveBtn: { marginBottom: SPACING.LG },
  pastEntry: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    gap: SPACING.XS,
  },
  pastText: { color: COLORS.CHARCOAL },
});
