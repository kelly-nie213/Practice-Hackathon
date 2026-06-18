import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Modal,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS, TOUCH_TARGET } from '../../constants/spacing';
import LargeText from '../../components/common/LargeText';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useTTS } from '../../context/TTSContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GAME_BG = '#1C2040';
const CARD_BACK_COLOR = '#3D5A4A';
const CARD_FRONT_COLOR = '#2A2F52';
const HINT_COLOR = '#FFD700';

const PADDING = SPACING.MD;
const GAP = SPACING.SM;

// ─── Difficulty config ────────────────────────────────────────────────────────

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy:   { pairs: 4,  cols: 2, emoji: '🌱', label: 'Easy',   desc: '4 pairs · 8 cards',   color: COLORS.SAGE_GREEN },
  medium: { pairs: 7,  cols: 4, emoji: '🌿', label: 'Medium', desc: '7 pairs · 14 cards',  color: COLORS.DUSTY_ROSE },
  hard:   { pairs: 10, cols: 4, emoji: '🌳', label: 'Hard',   desc: '10 pairs · 20 cards', color: '#5A6BA8' },
} as const;

function cardSizeFor(difficulty: Difficulty): number {
  const { cols } = DIFFICULTY_CONFIG[difficulty];
  return (SCREEN_WIDTH - PADDING * 2 - GAP * (cols - 1)) / cols;
}

// ─── Card data ────────────────────────────────────────────────────────────────

const ALL_PAIRS = [
  { pairId: 'sunflower', emoji: '🌻', label: 'Sunflower' },
  { pairId: 'dog',       emoji: '🐕', label: 'Dog' },
  { pairId: 'cat',       emoji: '🐱', label: 'Cat' },
  { pairId: 'butterfly', emoji: '🦋', label: 'Butterfly' },
  { pairId: 'house',     emoji: '🏡', label: 'House' },
  { pairId: 'apple',     emoji: '🍎', label: 'Apple' },
  { pairId: 'flower',    emoji: '🌸', label: 'Flower' },
  { pairId: 'bird',      emoji: '🐦', label: 'Bird' },
  { pairId: 'heart',     emoji: '❤️', label: 'Heart' },
  { pairId: 'star',      emoji: '⭐', label: 'Star' },
];

type CardData = {
  instanceId: string;
  pairId: string;
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
};

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeCards(pairCount: number): CardData[] {
  const pool = shuffleArray(ALL_PAIRS).slice(0, pairCount);
  const doubled = pool.flatMap(p => [
    { instanceId: `${p.pairId}_a`, pairId: p.pairId, emoji: p.emoji, label: p.label, isFlipped: false, isMatched: false },
    { instanceId: `${p.pairId}_b`, pairId: p.pairId, emoji: p.emoji, label: p.label, isFlipped: false, isMatched: false },
  ]);
  return shuffleArray(doubled);
}

// ─── Single card component ───────────────────────────────────────────────────

function MemoryCard({
  card, flipAnim, showHint, onPress, cardSize,
}: {
  card: CardData;
  flipAnim: Animated.Value;
  showHint: boolean;
  onPress: () => void;
  cardSize: number;
}) {
  const backRotate  = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0.49, 0.5], outputRange: [1, 0], extrapolate: 'clamp' });
  const frontRotate  = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [0.49, 0.5], outputRange: [0, 1], extrapolate: 'clamp' });

  const isLarge = cardSize > 120;
  const emojiSize  = isLarge ? 'DISPLAY' as const : 'H1' as const;
  const labelSize  = isLarge ? 'BODY'    as const : 'CAPTION' as const;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[{ width: cardSize, height: cardSize }, styles.cardWrapper, showHint && styles.hintGlow]}
      accessibilityLabel={card.isFlipped || card.isMatched ? card.label : 'Face-down card'}
      accessibilityRole="button"
    >
      {/* Back face */}
      <Animated.View style={[
        styles.card,
        styles.cardBack,
        { width: cardSize, height: cardSize, opacity: backOpacity, transform: [{ perspective: 1200 }, { rotateY: backRotate }] },
      ]}>
        <LargeText size={emojiSize} center>🍃</LargeText>
      </Animated.View>

      {/* Front face */}
      <Animated.View style={[
        styles.card,
        styles.cardFront,
        { width: cardSize, height: cardSize, opacity: frontOpacity, transform: [{ perspective: 1200 }, { rotateY: frontRotate }] },
        card.isMatched && styles.matchedCard,
      ]}>
        <LargeText size={emojiSize} center>{card.emoji}</LargeText>
        <LargeText size={labelSize} bold center color={COLORS.WARM_WHITE} style={{ marginTop: SPACING.XS, opacity: 0.9 }}>
          {card.label}
        </LargeText>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Difficulty picker ────────────────────────────────────────────────────────

function DifficultyPicker({ onSelect }: { onSelect: (d: Difficulty) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.pickerContainer} showsVerticalScrollIndicator={false}>
      <LargeText size="DISPLAY" center>🃏</LargeText>
      <LargeText size="H1" bold center color={COLORS.WARM_WHITE} style={{ marginTop: SPACING.MD }}>
        Memory Match
      </LargeText>
      <LargeText size="BODY" center color="rgba(255,255,255,0.6)" style={{ marginTop: SPACING.XS, marginBottom: SPACING.XL }}>
        Choose a difficulty to begin
      </LargeText>

      {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(level => {
        const cfg = DIFFICULTY_CONFIG[level];
        return (
          <TouchableOpacity
            key={level}
            style={[styles.difficultyBtn, { backgroundColor: cfg.color }]}
            onPress={() => onSelect(level)}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel={`${cfg.label}, ${cfg.desc}`}
          >
            <LargeText size="H2" center>{cfg.emoji}</LargeText>
            <LargeText size="H3" bold center color={COLORS.WARM_WHITE} style={{ marginTop: SPACING.XS }}>
              {cfg.label}
            </LargeText>
            <LargeText size="BODY" center color="rgba(255,255,255,0.8)" style={{ marginTop: SPACING.XS }}>
              {cfg.desc}
            </LargeText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function MemoryMatchScreen() {
  const navigation = useNavigation();
  const { speak } = useTTS();

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [mismatchCounts, setMismatchCounts] = useState<Record<string, number>>({});

  const flipAnims = useRef<Record<string, Animated.Value>>({});

  const getAnim = (id: string): Animated.Value => {
    if (!flipAnims.current[id]) {
      flipAnims.current[id] = new Animated.Value(0);
    }
    return flipAnims.current[id];
  };

  const animFlip = (id: string, toValue: number, duration = 380) =>
    new Promise<void>(resolve =>
      Animated.timing(getAnim(id), { toValue, duration, useNativeDriver: true }).start(() => resolve())
    );

  useEffect(() => {
    cards.forEach(c => getAnim(c.instanceId));
  }, [cards]);

  const startGame = (level: Difficulty) => {
    flipAnims.current = {};
    setDifficulty(level);
    setCards(makeCards(DIFFICULTY_CONFIG[level].pairs));
    setSelected([]);
    setIsLocked(false);
    setGameComplete(false);
    setMismatchCounts({});
  };

  const handleChangeDifficulty = () => {
    setDifficulty(null);
    setCards([]);
    setGameComplete(false);
  };

  const handlePress = useCallback((card: CardData) => {
    if (isLocked || card.isFlipped || card.isMatched) return;
    if (selected.includes(card.instanceId)) return;

    animFlip(card.instanceId, 1);
    setCards(prev => prev.map(c =>
      c.instanceId === card.instanceId ? { ...c, isFlipped: true } : c
    ));

    const newSelected = [...selected, card.instanceId];

    if (newSelected.length < 2) {
      setSelected(newSelected);
      return;
    }

    setIsLocked(true);
    setSelected([]);

    const firstId = newSelected[0];
    const firstCard = cards.find(c => c.instanceId === firstId)!;
    const isMatch = firstCard.pairId === card.pairId;

    setTimeout(() => {
      if (isMatch) {
        speak(`${card.label}! You found a match!`);
        setCards(prev => {
          const updated = prev.map(c =>
            c.instanceId === firstId || c.instanceId === card.instanceId
              ? { ...c, isMatched: true }
              : c
          );
          if (updated.every(c => c.isMatched)) {
            setTimeout(() => {
              speak('Wonderful job! You matched every pair!');
              setGameComplete(true);
            }, 600);
          }
          return updated;
        });
        setIsLocked(false);
      } else {
        setMismatchCounts(prev => ({
          ...prev,
          [firstCard.pairId]: (prev[firstCard.pairId] ?? 0) + 1,
          [card.pairId]: (prev[card.pairId] ?? 0) + 1,
        }));
        setTimeout(() => {
          animFlip(firstId, 0);
          animFlip(card.instanceId, 0);
          setCards(prev => prev.map(c =>
            c.instanceId === firstId || c.instanceId === card.instanceId
              ? { ...c, isFlipped: false }
              : c
          ));
          setIsLocked(false);
        }, 2500);
      }
    }, 500);
  }, [isLocked, selected, cards, speak]);

  const shouldShowHint = (card: CardData): boolean => {
    if (card.isMatched || card.isFlipped || selected.length !== 1) return false;
    const sel = cards.find(c => c.instanceId === selected[0]);
    if (!sel) return false;
    return card.pairId === sel.pairId && (mismatchCounts[sel.pairId] ?? 0) >= 2;
  };

  const cardSize = difficulty ? cardSizeFor(difficulty) : 0;

  const handleBack = () => {
    if (difficulty) {
      handleChangeDifficulty();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={GAME_BG} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.headerBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={difficulty ? 'Change difficulty' : 'Go back'}
          >
            <Ionicons name="arrow-back" size={28} color={COLORS.WARM_WHITE} />
          </TouchableOpacity>
          <LargeText size="H3" bold color={COLORS.WARM_WHITE}>Memory Match</LargeText>
          <View style={{ width: TOUCH_TARGET }} />
        </View>

        {/* Difficulty picker or game board */}
        {!difficulty ? (
          <DifficultyPicker onSelect={startGame} />
        ) : (
          <>
            {/* Difficulty badge */}
            <View style={styles.badge}>
              <LargeText size="CAPTION" bold color={COLORS.WARM_WHITE}>
                {DIFFICULTY_CONFIG[difficulty].emoji}  {DIFFICULTY_CONFIG[difficulty].label}  ·  {DIFFICULTY_CONFIG[difficulty].desc}
              </LargeText>
            </View>

            <LargeText size="BODY" center color="rgba(255,255,255,0.6)" style={styles.hint}>
              Tap two cards to find a matching pair
            </LargeText>

            <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
              {cards.map(card => (
                <MemoryCard
                  key={card.instanceId}
                  card={card}
                  flipAnim={getAnim(card.instanceId)}
                  showHint={shouldShowHint(card)}
                  onPress={() => handlePress(card)}
                  cardSize={cardSize}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Completion modal */}
        <Modal visible={gameComplete} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modalCard}>
              <LargeText size="DISPLAY" center>🌟</LargeText>
              <LargeText size="H2" bold center style={styles.modalTitle}>
                Wonderful job!
              </LargeText>
              <LargeText size="BODY" center color={COLORS.MEDIUM_GRAY} style={styles.modalSub}>
                You matched every pair. Beautifully done.
              </LargeText>
              <PrimaryButton
                label="Play Again"
                onPress={() => difficulty && startGame(difficulty)}
                style={{ marginTop: SPACING.XL }}
              />
              <TouchableOpacity
                onPress={handleChangeDifficulty}
                style={{ marginTop: SPACING.MD, padding: SPACING.SM }}
              >
                <LargeText size="BODY" center color={COLORS.MEDIUM_GRAY}>
                  Change Difficulty
                </LargeText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: GAME_BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  headerBtn: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Difficulty picker
  pickerContainer: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.XXL,
    gap: SPACING.MD,
  },
  difficultyBtn: {
    borderRadius: RADIUS.MD,
    paddingVertical: SPACING.LG,
    paddingHorizontal: SPACING.LG,
    alignItems: 'center',
  },

  // Game board
  badge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.FULL,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    marginBottom: SPACING.SM,
  },
  hint: { marginBottom: SPACING.LG },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingHorizontal: PADDING,
    paddingBottom: SPACING.XL,
    justifyContent: 'center',
  },

  // Cards (width/height set via inline style from cardSize prop)
  cardWrapper: {},
  hintGlow: {
    borderRadius: RADIUS.MD,
    borderWidth: 3,
    borderColor: HINT_COLOR,
    shadowColor: HINT_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 12,
    elevation: 12,
  },
  card: {
    borderRadius: RADIUS.MD,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cardBack:    { backgroundColor: CARD_BACK_COLOR },
  cardFront:   { backgroundColor: CARD_FRONT_COLOR },
  matchedCard: { borderWidth: 3, borderColor: COLORS.SUCCESS_GREEN },

  // Completion modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.XL,
  },
  modalCard: {
    backgroundColor: COLORS.CREAM,
    borderRadius: RADIUS.LG,
    padding: SPACING.XL,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
  },
  modalTitle: { marginTop: SPACING.MD, color: COLORS.CHARCOAL },
  modalSub:   { marginTop: SPACING.SM, textAlign: 'center' },
});
