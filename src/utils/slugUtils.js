/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - Blog title
 * @returns {string} URL slug
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Get blog ID from slug (slug format: title-blogId)
 * @param {string} slug - URL slug
 * @returns {string|null} Blog ID or null
 */
export const getBlogIdFromSlug = (slug) => {
  const parts = slug.split('-');
  return parts[parts.length - 1] || null;
};

/**
 * Create a full slug with blog ID
 * @param {string} title - Blog title
 * @param {string} id - Blog ID
 * @returns {string} Full slug
 */
export const createFullSlug = (title, id) => {
  const titleSlug = generateSlug(title);
  return `${titleSlug}-${id}`;
};
