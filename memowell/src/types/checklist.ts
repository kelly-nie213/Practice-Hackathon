export type ChecklistType = 'morning' | 'afternoon' | 'evening';

export interface ChecklistItem {
  id: string;
  label: string;
  type: ChecklistType;
  defaultEnabled: boolean;
  iconName: string;
}

export interface ChecklistLog {
  date: string; // 'YYYY-MM-DD'
  completedItemIds: string[];
}
