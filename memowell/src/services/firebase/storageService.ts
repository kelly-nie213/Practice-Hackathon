import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export async function uploadPhoto(path: string, uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

export async function uploadUserProfilePhoto(uid: string, uri: string): Promise<string> {
  return uploadPhoto(`users/${uid}/profile/profile-photo.jpg`, uri);
}

export async function uploadFamilyMemberPhoto(uid: string, memberId: string, uri: string): Promise<string> {
  return uploadPhoto(`users/${uid}/family/${memberId}/photo.jpg`, uri);
}
