import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAj06pEur3tVEXUVPgGqvYnqDb5oLuNVuo',
  authDomain: 'practice-8b8a6.firebaseapp.com',
  projectId: 'practice-8b8a6',
  storageBucket: 'practice-8b8a6.firebasestorage.app',
  messagingSenderId: '628317196169',
  appId: '1:628317196169:web:37399ab11f7b1a4fd5db58',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
