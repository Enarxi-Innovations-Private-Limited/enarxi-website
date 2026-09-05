import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize the primary app (guard against hot-reload re-init)
const primaryApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize a secondary app for user creation to avoid session conflicts.
const secondaryAppName = 'userCreation';
let secondaryApp;
if (getApps().find((app) => app.name === secondaryAppName)) {
  secondaryApp = getApp(secondaryAppName);
} else {
  secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
}

// Primary auth and db for the main application
export const auth = getAuth(primaryApp);
export const db = getFirestore(primaryApp);

// Enable offline persistence only in the browser (not during SSR/build)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Firestore persistence failed: Multiple tabs open.');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Firestore persistence not supported in this browser.');
    } else {
      console.warn('⚠️ Firestore persistence error:', err);
    }
  });
}

// Secondary auth specifically for creating new users in the background
export const secondaryAuth = getAuth(secondaryApp);
