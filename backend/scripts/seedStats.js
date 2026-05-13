/**
 * Seed Script for Visitor Statistics
 * Run this to populate Firestore with sample visitor data for testing the dashboard.
 * Usage: node backend/scripts/seedStats.js
 */

import { db } from '../config/firebase.js';
import admin from 'firebase-admin';

async function seedStats() {
  console.log('🌱 Seeding visitor statistics...');

  try {
    const today = new Date();
    let totalCount = 0;

    // Generate data for the last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Random count between 50 and 200
      const count = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
      totalCount += count;

      console.log(`   - Seeding ${dateString}: ${count} visitors`);

      await db.collection('stats')
        .doc('daily')
        .collection('records')
        .doc(dateString)
        .set({
          date: dateString,
          count: count
        }, { merge: true });
    }

    // Update total count
    await db.collection('stats').doc('visitors').set({
      total: totalCount
    }, { merge: true });

    console.log(`\n✅ Seeding complete!`);
    console.log(`📊 Total Visitors Seeded: ${totalCount}`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedStats();
