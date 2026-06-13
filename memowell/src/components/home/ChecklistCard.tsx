import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useChecklist } from '../../hooks/useChecklist';
import type { ChecklistType } from '../../types/checklist';
import LargeText from '../common/LargeText';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS, TOUCH_TARGET } from '../../constants/spacing';

function CheckItem({
  label,
  iconName,
  checked,
  onToggle,
}: {
  label: string;
  iconName: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(1.25, { damping: 5 }, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.item}>
      <Ionicons name={iconName as any} size={24} color={checked ? COLORS.SUCCESS_GREEN : COLORS.MEDIUM_GRAY} style={styles.itemIcon} />
      <LargeText size="BODY" style={[styles.itemLabel, checked && styles.itemDone]}>{label}</LargeText>
      <Animated.View style={[styles.checkbox, checked && styles.checkboxDone, animStyle]}>
        {checked && <Ionicons name="checkmark" size={20} color={COLORS.WARM_WHITE} />}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ChecklistCard({ type }: { type: ChecklistType }) {
  const { items, completedIds, toggleItem, progress, loading } = useChecklist(type);

  if (loading) {
    return (
      <View style={[styles.card, styles.center]}>
        <ActivityIndicator color={COLORS.SAGE_GREEN} />
      </View>
    );
  }

  const doneCount = items.filter((i) => completedIds.includes(i.id)).length;
  const title = type === 'morning' ? 'Morning Routine' : 'Evening Routine';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <LargeText size="H3" bold>{title}</LargeText>
        <LargeText size="BODY" color={COLORS.MEDIUM_GRAY}>{doneCount} of {items.length}</LargeText>
      </View>

      {items.map((item) => (
        <CheckItem
          key={item.id}
          label={item.label}
          iconName={item.iconName}
          checked={completedIds.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      {progress === 1 && (
        <LargeText size="BODY" bold color={COLORS.SUCCESS_GREEN} center style={{ marginTop: SPACING.SM }}>
          All done! Great job! 🎉
        </LargeText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.LG,
    padding: SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  center: { justifyContent: 'center', alignItems: 'center', minHeight: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.MD },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOUCH_TARGET,
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  itemIcon: { marginRight: SPACING.MD, width: 28 },
  itemLabel: { flex: 1 },
  itemDone: { textDecorationLine: 'line-through', color: COLORS.MEDIUM_GRAY },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: { backgroundColor: COLORS.SUCCESS_GREEN, borderColor: COLORS.SUCCESS_GREEN },
  progressBg: { height: 8, backgroundColor: COLORS.LIGHT_GRAY, borderRadius: RADIUS.FULL, marginTop: SPACING.MD, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.SUCCESS_GREEN, borderRadius: RADIUS.FULL },
});
