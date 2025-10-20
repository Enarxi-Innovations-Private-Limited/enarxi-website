/**
 * Firebase Admin SDK Test Script
 * Run this to diagnose Firebase connection issues
 */

import admin from './config/firebase.js';
import { db } from './config/firebase.js';

console.log('\n🧪 Testing Firebase Admin SDK Connection...\n');

async function testFirebaseConnection() {
  try {
    console.log('1️⃣ Testing Firestore read access...');
    
    // Try to read from users collection
    const usersSnapshot = await db.collection('users').limit(1).get();
    
    if (usersSnapshot.empty) {
      console.log('✅ Firestore connection successful (no users found)');
    } else {
      console.log('✅ Firestore connection successful!');
      console.log(`   Found ${usersSnapshot.size} user(s)`);
      
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - User: ${data.name || data.email} (Role: ${data.role})`);
      });
    }
    
    console.log('\n2️⃣ Testing Firestore write access...');
    
    // Try to write a test document
    const testRef = db.collection('_test').doc('connection-test');
    await testRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Connection test successful'
    });
    
    console.log('✅ Firestore write successful!');
    
    // Clean up test document
    await testRef.delete();
    console.log('✅ Test document cleaned up');
    
    console.log('\n3️⃣ Testing Firebase Auth access...');
    
    // Try to list users
    const listUsersResult = await admin.auth().listUsers(1);
    console.log('✅ Firebase Auth access successful!');
    console.log(`   Found ${listUsersResult.users.length} user(s) in Auth`);
    
    console.log('\n✅ ALL TESTS PASSED! Firebase Admin SDK is working correctly.\n');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 7 || error.message.includes('PERMISSION_DENIED')) {
      console.error('\n🔧 FIX REQUIRED:');
      console.error('   Your service account needs proper permissions.');
      console.error('   Follow these steps:');
      console.error('');
      console.error('   1. Go to: https://console.cloud.google.com/iam-admin/iam');
      console.error('   2. Find your service account email (from .env file)');
      console.error('   3. Click "Edit" (pencil icon)');
      console.error('   4. Click "ADD ANOTHER ROLE"');
      console.error('   5. Add these roles:');
      console.error('      - Cloud Datastore User');
      console.error('      - Firebase Admin');
      console.error('   6. Click "Save"');
      console.error('   7. Wait 1-2 minutes for changes to propagate');
      console.error('   8. Restart your backend server');
      console.error('');
    } else if (error.code === 'auth/invalid-credential') {
      console.error('\n🔧 FIX REQUIRED:');
      console.error('   Your Firebase credentials are invalid.');
      console.error('   Check your backend/.env file:');
      console.error('   - FIREBASE_PROJECT_ID');
      console.error('   - FIREBASE_PRIVATE_KEY (must have \\n characters)');
      console.error('   - FIREBASE_CLIENT_EMAIL');
      console.error('');
    }
    
    console.error('Full error details:', error);
    process.exit(1);
  }
}

testFirebaseConnection();
