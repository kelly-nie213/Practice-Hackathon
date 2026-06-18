import type { ChecklistItem } from '../types/checklist';

export const DEFAULT_MORNING_ITEMS: Omit<ChecklistItem, 'id'>[] = [
  { label: 'Take morning medication', type: 'morning', defaultEnabled: true, iconName: 'medical' },
  { label: 'Eat breakfast', type: 'morning', defaultEnabled: true, iconName: 'restaurant' },
  { label: 'Brush teeth', type: 'morning', defaultEnabled: true, iconName: 'water' },
  { label: 'Get dressed', type: 'morning', defaultEnabled: true, iconName: 'shirt' },
  { label: 'Drink a glass of water', type: 'morning', defaultEnabled: true, iconName: 'cafe' },
];

export const DEFAULT_AFTERNOON_ITEMS: Omit<ChecklistItem, 'id'>[] = [
  { label: 'Eat lunch', type: 'afternoon', defaultEnabled: true, iconName: 'restaurant' },
  { label: 'Take afternoon medication', type: 'afternoon', defaultEnabled: false, iconName: 'medical' },
  { label: 'Go for a walk', type: 'afternoon', defaultEnabled: true, iconName: 'walk' },
  { label: 'Rest or nap', type: 'afternoon', defaultEnabled: true, iconName: 'bed' },
  { label: 'Drink water', type: 'afternoon', defaultEnabled: true, iconName: 'water' },
];

export const DEFAULT_EVENING_ITEMS: Omit<ChecklistItem, 'id'>[] = [
  { label: 'Take evening medication', type: 'evening', defaultEnabled: true, iconName: 'medical' },
  { label: 'Eat dinner', type: 'evening', defaultEnabled: true, iconName: 'restaurant' },
  { label: 'Brush teeth before bed', type: 'evening', defaultEnabled: true, iconName: 'water' },
  { label: 'Call a family member', type: 'evening', defaultEnabled: false, iconName: 'call' },
  { label: 'Relax and unwind', type: 'evening', defaultEnabled: true, iconName: 'moon' },
];

export const JOURNAL_PROMPTS: string[] = [
  'What made you smile today?',
  'Describe something you enjoyed this week.',
  'What is one thing you are grateful for right now?',
  'Tell me about a favorite memory from your past.',
  'What did you do today that made you feel good?',
  'Who is someone you love, and why do you love them?',
  'What is your favorite season and why?',
  'Describe your favorite meal.',
  'What song makes you feel happy when you hear it?',
  'Tell me about a place that holds special meaning for you.',
  'What is something you are looking forward to?',
  'Describe a time when someone made you feel really loved.',
  'What hobby or activity brings you the most joy?',
  'Tell me about your favorite holiday tradition.',
  'What is a piece of advice you would give to someone younger?',
];
