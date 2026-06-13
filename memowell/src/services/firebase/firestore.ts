import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, FamilyMember, JournalEntry, MusicPlaylist, Memory } from '../../types/user';
import type { ChecklistItem, ChecklistLog } from '../../types/checklist';

// --- User ---
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function setUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export function subscribeUserProfile(uid: string, cb: (profile: UserProfile | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    cb(snap.exists() ? (snap.data() as UserProfile) : null);
  });
}

// --- Family Members ---
export async function getFamilyMembers(uid: string): Promise<FamilyMember[]> {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'familyMembers'), orderBy('displayOrder'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FamilyMember));
}

export async function addFamilyMember(uid: string, member: Omit<FamilyMember, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'familyMembers'), member);
  return ref.id;
}

export async function updateFamilyMember(uid: string, memberId: string, data: Partial<FamilyMember>): Promise<void> {
  await updateDoc(doc(db, 'users', uid, 'familyMembers', memberId), data);
}

export async function deleteFamilyMember(uid: string, memberId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'familyMembers', memberId));
}

// --- Checklist Items ---
export async function getChecklistItems(uid: string): Promise<ChecklistItem[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'checklistItems'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChecklistItem));
}

export async function seedChecklistItems(uid: string, items: Omit<ChecklistItem, 'id'>[]): Promise<void> {
  const batch = items.map((item) => addDoc(collection(db, 'users', uid, 'checklistItems'), item));
  await Promise.all(batch);
}

// --- Checklist Log ---
export async function getChecklistLog(uid: string, date: string): Promise<ChecklistLog | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'checklistLog', date));
  return snap.exists() ? (snap.data() as ChecklistLog) : null;
}

export async function setChecklistLog(uid: string, date: string, log: ChecklistLog): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'checklistLog', date), log);
}

// --- Journal ---
export async function getJournalEntries(uid: string): Promise<JournalEntry[]> {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'journalEntries'), orderBy('date', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as JournalEntry));
}

export async function addJournalEntry(uid: string, entry: Omit<JournalEntry, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'journalEntries'), entry);
  return ref.id;
}

// --- Music Playlists ---
export async function getMusicPlaylists(uid: string): Promise<MusicPlaylist[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'musicPlaylists'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MusicPlaylist));
}

export async function setMusicPlaylist(uid: string, playlistId: string, playlist: MusicPlaylist): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'musicPlaylists', playlistId), playlist);
}

// --- Memories ---
export async function getMemories(uid: string): Promise<Memory[]> {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'memories'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Memory));
}

export async function addMemory(uid: string, memory: Omit<Memory, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'memories'), memory);
  return ref.id;
}
