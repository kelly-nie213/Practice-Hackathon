import { useState, useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import type { MusicTrack } from '../types/user';

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused';

interface UseMusicResult {
  currentTrack: MusicTrack | null;
  currentIndex: number;
  state: PlaybackState;
  position: number;  // ms
  duration: number;  // ms
  play: () => Promise<void>;
  pause: () => Promise<void>;
  next: () => void;
  prev: () => void;
  seekTo: (ms: number) => Promise<void>;
}

export function useMusic(tracks: MusicTrack[]): UseMusicResult {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = tracks[currentIndex] ?? null;

  const unloadSound = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const loadAndPlay = useCallback(
    async (index: number) => {
      if (!tracks[index]) return;
      setPlaybackState('loading');
      await unloadSound();

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        { uri: tracks[index].url },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setPosition(status.positionMillis);
        setDuration(status.durationMillis ?? 0);
        if (status.isPlaying) setPlaybackState('playing');
        else if (status.didJustFinish) {
          setCurrentIndex((i) => (i + 1) % tracks.length);
        } else {
          setPlaybackState('paused');
        }
      });
    },
    [tracks]
  );

  useEffect(() => {
    if (tracks.length > 0) loadAndPlay(currentIndex);
    return () => { unloadSound(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, tracks]);

  useEffect(() => {
    return () => { unloadSound(); };
  }, []);

  const play = async () => {
    if (soundRef.current) await soundRef.current.playAsync();
  };

  const pause = async () => {
    if (soundRef.current) await soundRef.current.pauseAsync();
  };

  const next = () => setCurrentIndex((i) => (i + 1) % Math.max(tracks.length, 1));
  const prev = () => setCurrentIndex((i) => (i - 1 + Math.max(tracks.length, 1)) % Math.max(tracks.length, 1));

  const seekTo = async (ms: number) => {
    if (soundRef.current) await soundRef.current.setPositionAsync(ms);
  };

  return {
    currentTrack,
    currentIndex,
    state: playbackState,
    position,
    duration,
    play,
    pause,
    next,
    prev,
    seekTo,
  };
}
