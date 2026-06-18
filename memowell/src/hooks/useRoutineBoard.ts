import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import type { ChecklistItem, ChecklistType } from '../types/checklist';
import {
  getChecklistItems,
  getChecklistLog,
  setChecklistLog,
  addChecklistItem,
  deleteChecklistItem,
  seedChecklistItems,
} from '../services/firebase/firestore';
import { DEFAULT_AFTERNOON_ITEMS } from '../constants/checklistItems';
import { useAuth } from '../context/AuthContext';

export type GroupedItems = Record<ChecklistType, ChecklistItem[]>;

export interface UseRoutineBoardResult {
  grouped: GroupedItems;
  completedIds: string[];
  toggleItem: (id: string) => Promise<void>;
  addItem: (type: ChecklistType, label: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  loading: boolean;
}

const ICON_FOR_TYPE: Record<ChecklistType, string> = {
  morning: 'sunny',
  afternoon: 'partly-sunny',
  evening: 'moon',
};

export function useRoutineBoard(): UseRoutineBoardResult {
  const { user } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [allItems, setAllItems] = useState<ChecklistItem[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [items, log] = await Promise.all([
          getChecklistItems(user.uid),
          getChecklistLog(user.uid, today),
        ]);

        // Seed afternoon items for users who don't have them yet
        const hasAfternoon = items.some((i) => i.type === 'afternoon');
        if (!hasAfternoon) {
          await seedChecklistItems(user.uid, DEFAULT_AFTERNOON_ITEMS);
          const seeded = await getChecklistItems(user.uid);
          if (!cancelled) setAllItems(seeded);
        } else {
          if (!cancelled) setAllItems(items);
        }

        if (!cancelled) setCompletedIds(log?.completedItemIds ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, today]);

  const grouped: GroupedItems = {
    morning: allItems.filter((i) => i.type === 'morning' && i.defaultEnabled),
    afternoon: allItems.filter((i) => i.type === 'afternoon' && i.defaultEnabled),
    evening: allItems.filter((i) => i.type === 'evening' && i.defaultEnabled),
  };

  const toggleItem = useCallback(async (id: string) => {
    if (!user) return;
    const next = completedIds.includes(id)
      ? completedIds.filter((x) => x !== id)
      : [...completedIds, id];
    setCompletedIds(next);
    await setChecklistLog(user.uid, today, { date: today, completedItemIds: next });
  }, [user, today, completedIds]);

  const addItem = useCallback(async (type: ChecklistType, label: string) => {
    if (!user || !label.trim()) return;
    const newItem: Omit<ChecklistItem, 'id'> = {
      label: label.trim(),
      type,
      defaultEnabled: true,
      iconName: ICON_FOR_TYPE[type],
    };
    const id = await addChecklistItem(user.uid, newItem);
    setAllItems((prev) => [...prev, { ...newItem, id }]);
  }, [user]);

  const deleteItem = useCallback(async (id: string) => {
    if (!user) return;
    await deleteChecklistItem(user.uid, id);
    setAllItems((prev) => prev.filter((i) => i.id !== id));
    setCompletedIds((prev) => {
      const next = prev.filter((x) => x !== id);
      if (next.length !== prev.length) {
        setChecklistLog(user.uid, today, { date: today, completedItemIds: next });
      }
      return next;
    });
  }, [user, today]);

  return { grouped, completedIds, toggleItem, addItem, deleteItem, loading };
}
