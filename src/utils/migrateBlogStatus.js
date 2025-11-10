/**
 * Migration Utility: Add status field to existing blogs
 * 
 * This script updates all existing blogs in Firestore to include the 'status' field
 * based on their 'isAdminAccepted' value.
 * 
 * Run this once in the browser console or as a one-time admin action.
 */

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function migrateBlogStatus() {
  try {
    console.log('🔄 Starting blog status migration...');
    
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    const updatePromises = snapshot.docs.map(async (docSnap) => {
      const blogData = docSnap.data();
      
      // Skip if blog already has status field
      if (blogData.status) {
        skipped++;
        return;
      }
      
      try {
        const blogRef = doc(db, 'blogs', docSnap.id);
        
        // Set status based on isAdminAccepted
        const status = blogData.isAdminAccepted ? 'approved' : 'pending';
        
        await updateDoc(blogRef, {
          status: status,
          visibility: blogData.visibility !== undefined ? blogData.visibility : true,
        });
        
        updated++;
        console.log(`✅ Updated blog: ${blogData.title} -> status: ${status}`);
      } catch (error) {
        errors++;
        console.error(`❌ Error updating blog ${docSnap.id}:`, error);
      }
    });
    
    await Promise.all(updatePromises);
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Updated: ${updated} blogs`);
    console.log(`⏭️  Skipped: ${skipped} blogs (already have status)`);
    console.log(`❌ Errors: ${errors} blogs`);
    console.log('✨ Migration complete!');
    
    return {
      success: true,
      updated,
      skipped,
      errors,
    };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * How to use:
 * 
 * 1. Open browser console in your app
 * 2. Import and run:
 *    import { migrateBlogStatus } from './utils/migrateBlogStatus';
 *    migrateBlogStatus();
 * 
 * Or add a button in admin portal to trigger this migration.
 */
