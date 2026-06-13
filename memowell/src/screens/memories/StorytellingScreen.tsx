import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useTTS } from '../../context/TTSContext';
import LargeText from '../../components/common/LargeText';
import IconButton from '../../components/common/IconButton';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

interface Chapter {
  title: string;
  emoji: string;
  getBody: (name: string, hometown: string, occupation: string, facts: string[]) => string;
}

const CHAPTERS: Chapter[] = [
  {
    title: 'Childhood',
    emoji: '🌟',
    getBody: (name, hometown) =>
      `${name} grew up in the wonderful town of ${hometown}. Those early years were filled with discovery, play, and the warmth of family. The sights, sounds, and flavors of childhood shaped the remarkable person ${name} would become. Each day was an adventure waiting to unfold.`,
  },
  {
    title: 'Work & Purpose',
    emoji: '💼',
    getBody: (name, _, occupation) =>
      `Throughout a fulfilling career, ${name} devoted years to being a dedicated ${occupation.toLowerCase()}. This work brought meaning, connection, and pride. The people ${name} touched through this work carry those memories with them still. A life of purpose is a life well lived.`,
  },
  {
    title: 'Family',
    emoji: '❤️',
    getBody: (name) =>
      `Family has always been the heart of ${name}'s life. The laughter shared at the dinner table, the milestones celebrated together, and the quiet moments of connection — these are the treasures that matter most. The love ${name} has given and received is a legacy that lives on forever.`,
  },
  {
    title: 'Passions',
    emoji: '🌸',
    getBody: (name, _, __, facts) => {
      const factsText = facts.slice(0, 2).join(' and ') || 'pursuing joy in everyday moments';
      return `Beyond work and family, ${name} has always made time for the things that bring joy. ${factsText.charAt(0).toUpperCase() + factsText.slice(1)} — these passions are a beautiful part of who ${name} is. A full life is one where we make room for the things that make our hearts sing.`;
    },
  },
];

export default function StorytellingScreen() {
  const navigation = useNavigation();
  const { profile } = useUser();
  const { speak, stop, isSpeaking } = useTTS();
  const [activeChapter, setActiveChapter] = useState(0);

  const name = profile?.displayName ?? 'You';
  const hometown = profile?.hometown ?? 'your hometown';
  const occupation = profile?.occupation ?? 'a dedicated professional';
  const facts = profile?.funFacts ?? [];

  const chapter = CHAPTERS[activeChapter];
  const body = chapter.getBody(name, hometown, occupation, facts);

  const handleListen = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(chapter.title + '. ' + body);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <IconButton name="chevron-back" onPress={() => navigation.goBack()} />
        <LargeText size="H2" bold>My Story</LargeText>
        <View style={{ width: 56 }} />
      </View>

      {/* Chapter selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapterRow} contentContainerStyle={{ paddingHorizontal: SPACING.LG, gap: SPACING.SM }}>
        {CHAPTERS.map((ch, i) => (
          <TouchableOpacity
            key={ch.title}
            onPress={() => setActiveChapter(i)}
            style={[styles.chapterPill, activeChapter === i && styles.chapterPillActive]}
          >
            <LargeText
              size="BODY"
              color={activeChapter === i ? COLORS.WARM_WHITE : COLORS.CHARCOAL}
            >
              {ch.emoji} {ch.title}
            </LargeText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.storyCard}>
          <LargeText size="DISPLAY" center style={styles.emoji}>{chapter.emoji}</LargeText>
          <LargeText size="H2" bold center style={styles.chapterTitle}>{chapter.title}</LargeText>
          <LargeText size="BODY_LARGE" style={styles.body}>{body}</LargeText>
        </View>

        <PrimaryButton
          label={isSpeaking ? 'Stop Listening' : 'Listen to This Chapter'}
          onPress={handleListen}
          variant={isSpeaking ? 'secondary' : 'primary'}
          style={{ marginTop: SPACING.LG }}
        />

        <View style={styles.navRow}>
          {activeChapter > 0 && (
            <PrimaryButton
              label="← Previous"
              onPress={() => setActiveChapter((i) => i - 1)}
              variant="secondary"
              style={styles.navBtn}
            />
          )}
          {activeChapter < CHAPTERS.length - 1 && (
            <PrimaryButton
              label="Next Chapter →"
              onPress={() => setActiveChapter((i) => i + 1)}
              style={styles.navBtn}
            />
          )}
        </View>
      </ScrollView>
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
  chapterRow: { marginBottom: SPACING.MD },
  chapterPill: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.FULL,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  chapterPillActive: { backgroundColor: COLORS.SAGE_GREEN },
  scroll: { flex: 1 },
  content: { padding: SPACING.LG, paddingBottom: SPACING.XXL },
  storyCard: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.LG,
    padding: SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: { marginBottom: SPACING.SM },
  chapterTitle: { marginBottom: SPACING.LG },
  body: { lineHeight: 32 },
  navRow: { flexDirection: 'row', gap: SPACING.MD, marginTop: SPACING.MD },
  navBtn: { flex: 1 },
});
