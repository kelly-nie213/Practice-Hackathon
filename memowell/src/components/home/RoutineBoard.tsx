import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRoutineBoard } from '../../hooks/useRoutineBoard';
import type { ChecklistType, ChecklistItem } from '../../types/checklist';
import LargeText from '../common/LargeText';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';

const SCREEN_W = Dimensions.get('window').width;
const CARD_PAD = SPACING.MD;
const COL_GAP = 6;
// Column width: screen minus outer card padding (applied in parent) and inner gaps
// Parent AnimatedCard adds ~0 padding; DailyOrientationScreen content has SPACING.LG on each side
const AVAIL = SCREEN_W - SPACING.LG * 2 - CARD_PAD * 2;
const COL_W = (AVAIL - COL_GAP * 2) / 3;

const COLUMN_CONFIG: { type: ChecklistType; label: string; emoji: string; accent: string }[] = [
  { type: 'morning',   label: 'Morning',   emoji: '🌅', accent: COLORS.SOFT_PEACH },
  { type: 'afternoon', label: 'Afternoon', emoji: '☀️', accent: COLORS.SAGE_GREEN },
  { type: 'evening',   label: 'Evening',   emoji: '🌙', accent: COLORS.DUSTY_ROSE },
];

// ── Task row ──────────────────────────────────────────────────────────────────

function TaskRow({
  item,
  checked,
  onToggle,
  onDelete,
}: {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handleToggle = () => {
    scale.value = withSpring(1.3, { damping: 4 }, () => { scale.value = withSpring(1); });
    onToggle();
  };

  return (
    <View style={styles.taskRow}>
      <TouchableOpacity onPress={handleToggle} activeOpacity={0.7} style={styles.taskMain}>
        <Animated.View style={[styles.miniCheckbox, checked && styles.miniCheckboxDone, animStyle]}>
          {checked && <Ionicons name="checkmark" size={9} color={COLORS.WARM_WHITE} />}
        </Animated.View>
        <LargeText
          size="CAPTION"
          numberOfLines={2}
          style={[styles.taskLabel, checked && styles.taskDone]}
        >
          {item.label}
        </LargeText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
        style={styles.deleteBtn}
      >
        <Ionicons name="close-circle" size={14} color={COLORS.LIGHT_GRAY} />
      </TouchableOpacity>
    </View>
  );
}

// ── Single column ─────────────────────────────────────────────────────────────

function RoutineColumn({
  config,
  items,
  completedIds,
  onToggle,
  onDelete,
  isAdding,
  addText,
  onStartAdd,
  onChangeText,
  onConfirmAdd,
  onCancelAdd,
}: {
  config: typeof COLUMN_CONFIG[number];
  items: ChecklistItem[];
  completedIds: string[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isAdding: boolean;
  addText: string;
  onStartAdd: () => void;
  onChangeText: (t: string) => void;
  onConfirmAdd: () => void;
  onCancelAdd: () => void;
}) {
  const inputRef = useRef<TextInput>(null);
  const doneCount = items.filter((i) => completedIds.includes(i.id)).length;
  const total = items.length;
  const progress = total > 0 ? doneCount / total : 0;
  const allDone = total > 0 && doneCount === total;

  return (
    <View style={[styles.col, { width: COL_W }]}>
      {/* Header */}
      <View style={[styles.colHeader, { backgroundColor: config.accent + '30' }]}>
        <LargeText size="CAPTION" center style={styles.colEmoji}>{config.emoji}</LargeText>
        <LargeText size="CAPTION" bold center style={styles.colTitle}>{config.label}</LargeText>
        <LargeText size="CAPTION" center style={styles.colCount}>
          {allDone ? '✓ Done' : `${doneCount}/${total}`}
        </LargeText>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: config.accent }]} />
      </View>

      {/* Tasks */}
      <View style={styles.taskList}>
        {items.map((item) => (
          <TaskRow
            key={item.id}
            item={item}
            checked={completedIds.includes(item.id)}
            onToggle={() => onToggle(item.id)}
            onDelete={() => onDelete(item.id)}
          />
        ))}

        {/* Inline add-task input */}
        {isAdding && (
          <View style={styles.addInputRow}>
            <TextInput
              ref={inputRef}
              style={styles.addInput}
              value={addText}
              onChangeText={onChangeText}
              placeholder="New task…"
              placeholderTextColor={COLORS.MEDIUM_GRAY}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onConfirmAdd}
            />
            <TouchableOpacity onPress={onConfirmAdd} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.SUCCESS_GREEN} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancelAdd} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
              <Ionicons name="close-circle" size={18} color={COLORS.DANGER_RED} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Add task button */}
      {!isAdding && (
        <TouchableOpacity onPress={onStartAdd} style={styles.addRow} activeOpacity={0.6}>
          <Ionicons name="add-circle-outline" size={13} color={COLORS.MEDIUM_GRAY} />
          <LargeText size="CAPTION" color={COLORS.MEDIUM_GRAY} style={styles.addLabel}>
            Add task
          </LargeText>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Board ─────────────────────────────────────────────────────────────────────

export default function RoutineBoard() {
  const { grouped, completedIds, toggleItem, addItem, deleteItem, loading } = useRoutineBoard();
  const [activeAdd, setActiveAdd] = useState<ChecklistType | null>(null);
  const [newTaskText, setNewTaskText] = useState('');

  const handleStartAdd = (type: ChecklistType) => {
    setActiveAdd(type);
    setNewTaskText('');
  };

  const handleConfirmAdd = async () => {
    if (activeAdd && newTaskText.trim()) {
      await addItem(activeAdd, newTaskText);
    }
    setActiveAdd(null);
    setNewTaskText('');
  };

  const handleCancelAdd = () => {
    setActiveAdd(null);
    setNewTaskText('');
  };

  const totalDone = (Object.values(grouped) as ChecklistItem[][])
    .flat()
    .filter((i) => completedIds.includes(i.id)).length;
  const totalAll = (Object.values(grouped) as ChecklistItem[][]).flat().length;

  if (loading) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <ActivityIndicator color={COLORS.SAGE_GREEN} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Board header */}
      <View style={styles.boardHeader}>
        <LargeText size="H3" bold>Daily Routine</LargeText>
        <LargeText size="BODY" color={COLORS.MEDIUM_GRAY}>
          {totalDone} of {totalAll} done
        </LargeText>
      </View>

      {/* Three columns */}
      <View style={styles.columnsRow}>
        {COLUMN_CONFIG.map((col) => (
          <RoutineColumn
            key={col.type}
            config={col}
            items={grouped[col.type]}
            completedIds={completedIds}
            onToggle={toggleItem}
            onDelete={deleteItem}
            isAdding={activeAdd === col.type}
            addText={activeAdd === col.type ? newTaskText : ''}
            onStartAdd={() => handleStartAdd(col.type)}
            onChangeText={setNewTaskText}
            onConfirmAdd={handleConfirmAdd}
            onCancelAdd={handleCancelAdd}
          />
        ))}
      </View>

      {totalAll > 0 && totalDone === totalAll && (
        <LargeText size="BODY" bold color={COLORS.SUCCESS_GREEN} center style={styles.allDoneMsg}>
          Amazing! All done today! 🎉
        </LargeText>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.LG,
    padding: CARD_PAD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingCard: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  boardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: COL_GAP,
  },
  col: {
    flex: 1,
    minWidth: 0,
  },
  colHeader: {
    borderRadius: RADIUS.SM,
    paddingVertical: SPACING.XS,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  colEmoji: { fontSize: 16, lineHeight: 20 },
  colTitle: { fontSize: 11, lineHeight: 14 },
  colCount: { fontSize: 10, lineHeight: 13, color: COLORS.MEDIUM_GRAY, marginTop: 1 },
  progressBg: {
    height: 3,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: RADIUS.FULL,
    marginBottom: SPACING.SM,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.FULL,
  },
  taskList: {
    gap: 2,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    minHeight: 32,
  },
  taskMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minWidth: 0,
  },
  miniCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  miniCheckboxDone: {
    backgroundColor: COLORS.SUCCESS_GREEN,
    borderColor: COLORS.SUCCESS_GREEN,
  },
  taskLabel: {
    flex: 1,
    fontSize: 12,
    lineHeight: 15,
    minWidth: 0,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: COLORS.MEDIUM_GRAY,
  },
  deleteBtn: {
    paddingLeft: 3,
    flexShrink: 0,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingTop: SPACING.SM,
    opacity: 0.55,
  },
  addLabel: {
    fontSize: 11,
    lineHeight: 14,
  },
  addInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: SPACING.XS,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
    marginTop: 2,
  },
  addInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.CHARCOAL,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SAGE_GREEN,
    minWidth: 0,
  },
  allDoneMsg: {
    marginTop: SPACING.MD,
  },
});
