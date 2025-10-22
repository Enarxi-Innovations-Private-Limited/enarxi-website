import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize the primary app
const primaryApp = initializeApp(firebaseConfig);

// Initialize a secondary app for user creation to avoid session conflicts.
// This checks if the app already exists to prevent re-initialization on hot reloads.
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

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('⚠️ Firestore persistence failed: Multiple tabs open. Only one tab can have persistence enabled.');
  } else if (err.code === 'unimplemented') {
    console.warn('⚠️ Firestore persistence not supported in this browser.');
  } else {
    console.warn('⚠️ Firestore persistence error:', err);
  }
});

// Secondary auth specifically for creating new users in the background
export const secondaryAuth = getAuth(secondaryApp);
