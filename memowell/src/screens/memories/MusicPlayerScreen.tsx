import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import { getMusicPlaylists } from '../../services/firebase/firestore';
import { useMusic } from '../../hooks/useMusic';
import { useTTS } from '../../context/TTSContext';
import type { MusicTrack, MusicPlaylist } from '../../types/user';
import LargeText from '../../components/common/LargeText';
import IconButton from '../../components/common/IconButton';
import PrimaryButton from '../../components/common/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';

function msToTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function MusicPlayerScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { speak } = useTTS();
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMusicPlaylists(user.uid)
      .then((playlists) => setTracks(playlists.flatMap((p) => p.tracks)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const { currentTrack, state, position, duration, play, pause, next, prev } = useMusic(tracks);

  useEffect(() => {
    if (currentTrack && state === 'playing') {
      speak(`Now playing: ${currentTrack.title} by ${currentTrack.artist}`);
    }
  }, [currentTrack?.title]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.SAGE_GREEN} />
      </SafeAreaView>
    );
  }

  if (tracks.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <LargeText size="H2" center>🎵</LargeText>
        <LargeText size="H3" center style={{ marginTop: SPACING.MD }}>No music added yet.</LargeText>
        <LargeText size="BODY" center color={COLORS.MEDIUM_GRAY} style={{ marginTop: SPACING.SM }}>
          Ask a family member to add songs in Settings.
        </LargeText>
        <PrimaryButton label="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: SPACING.LG, width: 200 }} />
      </SafeAreaView>
    );
  }

  const progress = duration > 0 ? position / duration : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <IconButton name="chevron-back" onPress={() => navigation.goBack()} style={styles.back} />

      {/* Album art */}
      <View style={styles.artContainer}>
        {currentTrack?.thumbnailURL ? (
          <Image source={{ uri: currentTrack.thumbnailURL }} style={styles.art} />
        ) : (
          <View style={[styles.art, styles.artPlaceholder]}>
            <LargeText size="DISPLAY" center>🎵</LargeText>
          </View>
        )}
      </View>

      {/* Track info */}
      <LargeText size="H2" bold center style={styles.trackTitle}>
        {currentTrack?.title ?? 'Unknown Title'}
      </LargeText>
      <LargeText size="H3" center color={COLORS.MEDIUM_GRAY}>
        {currentTrack?.artist ?? 'Unknown Artist'}
      </LargeText>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <LargeText size="CAPTION" color={COLORS.MEDIUM_GRAY}>{msToTime(position)}</LargeText>
          <LargeText size="CAPTION" color={COLORS.MEDIUM_GRAY}>{msToTime(duration)}</LargeText>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <IconButton name="play-skip-back" size={36} color={COLORS.CHARCOAL} onPress={prev} />
        <View style={styles.playBtn}>
          {state === 'loading' ? (
            <ActivityIndicator size="large" color={COLORS.WARM_WHITE} />
          ) : (
            <IconButton
              name={state === 'playing' ? 'pause' : 'play'}
              size={40}
              color={COLORS.WARM_WHITE}
              onPress={state === 'playing' ? pause : play}
            />
          )}
        </View>
        <IconButton name="play-skip-forward" size={36} color={COLORS.CHARCOAL} onPress={next} />
      </View>

      <LargeText size="CAPTION" center color={COLORS.MEDIUM_GRAY} style={styles.trackCount}>
        Track {tracks.indexOf(currentTrack!) + 1} of {tracks.length}
      </LargeText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.CREAM, paddingHorizontal: SPACING.LG },
  center: { justifyContent: 'center', alignItems: 'center' },
  back: { marginTop: SPACING.SM },
  artContainer: { alignItems: 'center', marginTop: SPACING.LG, marginBottom: SPACING.LG },
  art: { width: 220, height: 220, borderRadius: RADIUS.LG },
  artPlaceholder: {
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackTitle: { marginBottom: SPACING.XS },
  progressContainer: { marginTop: SPACING.XL },
  progressBg: { height: 6, backgroundColor: COLORS.LIGHT_GRAY, borderRadius: RADIUS.FULL, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.SAGE_GREEN },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.XS },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.XL,
    marginTop: SPACING.XL,
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.SAGE_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.SAGE_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  trackCount: { marginTop: SPACING.LG },
});
