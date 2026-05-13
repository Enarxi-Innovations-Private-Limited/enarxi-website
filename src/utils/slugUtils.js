import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - Blog title
 * @returns {string} URL slug
 */
export const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Resolves a unique slug by checking Firestore and appending suffixes if needed.
 * @param {string} title - Blog title
 * @param {string} currentBlogId - Optional current blog ID to exclude from uniqueness check
 * @returns {Promise<string>} A unique URL slug
 */
export const resolveUniqueSlug = async (title, currentBlogId = null) => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let suffix = 1;
  let isUnique = false;

  while (!isUnique) {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      isUnique = true;
    } else {
      // Check if the only match is the current blog itself
      const existingBlog = querySnapshot.docs[0];
      if (currentBlogId && existingBlog.id === currentBlogId) {
        isUnique = true;
      } else {
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }
  }

  return slug;
};

/**
 * Get blog ID from slug (legacy format: title-blogId)
 * @param {string} slug - URL slug
 * @returns {string|null} Blog ID or null
 */
export const getBlogIdFromSlug = (slug) => {
  if (!slug) return null;
  const parts = slug.split('-');
  return parts[parts.length - 1] || null;
};

/**
 * Create a full slug with blog ID (Legacy)
 * @param {string} title - Blog title
 * @param {string} id - Blog ID
 * @returns {string} Full slug
 */
export const createFullSlug = (title, id) => {
  const titleSlug = generateSlug(title);
  return `${titleSlug}-${id}`;
};
