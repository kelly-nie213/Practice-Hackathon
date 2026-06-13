import { useMemo } from 'react';
import { AFFIRMATIONS } from '../constants/affirmations';

export function useAffirmation(): string {
  return useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
  }, []);
}
