import admin from 'firebase-admin';
import { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } from './env.js';

// Validate required environment variables
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    `Please check your .env file and ensure all Firebase Admin SDK variables are set.`
  );
}

const formattedKey = FIREBASE_PRIVATE_KEY ? FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : null;

// Initialize Firebase Admin SDK
const serviceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  // privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  privateKey:formattedKey,
  clientEmail: FIREBASE_CLIENT_EMAIL,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });

  console.log('✅ Firebase Admin SDK initialized successfully');
  console.log('📊 Project ID:', process.env.FIREBASE_PROJECT_ID);
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  throw error;
}

export const auth = admin.auth();
export const db = admin.firestore();

export default admin;
