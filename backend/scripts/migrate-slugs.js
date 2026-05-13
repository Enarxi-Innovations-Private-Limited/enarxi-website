import admin from 'firebase-admin';
import { db } from '../config/firebase.js';

/**
 * Generate a URL-friendly slug from a title
 */
const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const migrateSlugs = async () => {
  console.log('🚀 Starting slug migration...');
  
  try {
    const blogsRef = db.collection('blogs');
    const snapshot = await blogsRef.get();
    
    if (snapshot.empty) {
      console.log('No blogs found to migrate.');
      return;
    }

    console.log(`Found ${snapshot.size} blogs. Processing...`);

    const slugs = new Set();
    const batch = db.batch();
    let updatedCount = 0;

    // First pass: add existing slugs to the set
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.slug) {
        slugs.add(data.slug);
      }
    });

    // Second pass: generate slugs for blogs without them
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      if (!data.slug) {
        let baseSlug = generateSlug(data.title || 'untitled');
        if (!baseSlug) baseSlug = 'blog';
        
        let slug = baseSlug;
        let suffix = 1;

        while (slugs.has(slug)) {
          suffix++;
          slug = `${baseSlug}-${suffix}`;
        }

        slugs.add(slug);
        batch.update(doc.ref, { 
          slug,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`✅ [${doc.id}] -> ${slug}`);
        updatedCount++;
      } else {
        console.log(`⏭️ [${doc.id}] already has slug: ${data.slug}`);
      }
    }

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`\n🎉 Successfully updated ${updatedCount} blogs with slugs.`);
    } else {
      console.log('\n✅ No updates needed. All blogs already have slugs.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit(0);
  }
};

migrateSlugs();
