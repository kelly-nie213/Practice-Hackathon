export type ColorScheme = 'warm' | 'cool' | 'high-contrast';
export type FontScale = 1.0 | 1.25 | 1.5;
export type MusicGenre = 'Jazz' | 'Classical' | 'Country' | 'Pop' | 'Folk' | 'None';
export type Relationship = 'Spouse' | 'Son' | 'Daughter' | 'Grandchild' | 'Friend' | 'Caregiver' | 'Other';
export type Mood = 'happy' | 'calm' | 'worried' | 'confused' | 'grateful';

export interface UserProfile {
  uid: string;
  displayName: string;
  fullName: string;
  dateOfBirth: string; // ISO string
  hometown: string;
  occupation: string;
  funFacts: string[];
  profilePhotoURL: string;
  fontScale: FontScale;
  colorScheme: ColorScheme;
  morningChecklistTime: string; // 'HH:mm'
  eveningChecklistTime: string;
  medicationReminderTimes: string[];
  musicGenrePreference: MusicGenre;
  homeAddress: string;
  homeLatLng: { lat: number; lng: number } | null;
  emergencyContactPhone: string;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: Relationship;
  photoURL: string;
  phoneNumber: string;
  traits: string[];
  birthday: string | null;
  displayOrder: number;
}

export interface MusicTrack {
  title: string;
  artist: string;
  url: string;
  thumbnailURL: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
}

export interface Memory {
  id: string;
  title: string;
  body: string;
  photoURLs: string[];
  decade: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  promptQuestion: string;
  responseText: string;
  responseAudioURL: string | null;
  mood: Mood | null;
}
