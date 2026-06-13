import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import type { ChecklistItem, ChecklistType } from '../types/checklist';
import {
  getChecklistItems,
  getChecklistLog,
  setChecklistLog,
} from '../services/firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface UseChecklistResult {
  items: ChecklistItem[];
  completedIds: string[];
  toggleItem: (id: string) => Promise<void>;
  progress: number;
  loading: boolean;
}

export function useChecklist(type: ChecklistType): UseChecklistResult {
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
        if (!cancelled) {
          setAllItems(items);
          setCompletedIds(log?.completedItemIds ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, today]);

  const items = allItems.filter((i) => i.type === type && i.defaultEnabled);

  const toggleItem = useCallback(
    async (id: string) => {
      if (!user) return;
      const next = completedIds.includes(id)
        ? completedIds.filter((x) => x !== id)
        : [...completedIds, id];
      setCompletedIds(next);
      await setChecklistLog(user.uid, today, { date: today, completedItemIds: next });
    },
    [user, today, completedIds]
  );

  const typeItems = allItems.filter((i) => i.type === type && i.defaultEnabled);
  const doneCount = typeItems.filter((i) => completedIds.includes(i.id)).length;
  const progress = typeItems.length > 0 ? doneCount / typeItems.length : 0;

  return { items, completedIds, toggleItem, progress, loading };
}
