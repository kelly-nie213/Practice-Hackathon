import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile, FamilyMember } from '../types/user';
import { subscribeUserProfile, getFamilyMembers, setUserProfile } from '../services/firebase/firestore';
import { useAuth } from './AuthContext';

interface UserContextValue {
  profile: UserProfile | null;
  familyMembers: FamilyMember[];
  loading: boolean;
  refreshFamily: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextValue>({} as UserContextValue);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setFamilyMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeUserProfile(user.uid, (p) => {
      setProfile(p);
      setLoading(false);
    });

    getFamilyMembers(user.uid).then(setFamilyMembers).catch(() => {});

    return unsub;
  }, [user]);

  const refreshFamily = async () => {
    if (!user) return;
    const members = await getFamilyMembers(user.uid);
    setFamilyMembers(members);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await setUserProfile(user.uid, data);
  };

  return (
    <UserContext.Provider value={{ profile, familyMembers, loading, refreshFamily, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
