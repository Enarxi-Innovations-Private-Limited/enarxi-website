/**
 * Generate an SEO-friendly file name based on alt text.
 * @param {string} altText - The descriptive alt text for the image.
 * @param {string} originalFileName - The original filename to extract the extension from.
 * @returns {string} - The SEO-friendly filename.
 */
export function generateSeoFileName(altText, originalFileName) {
  if (!altText) return originalFileName;
  
  // Extract the original extension
  const extensionMatch = originalFileName.match(/\.([^.]+)$/);
  const extension = extensionMatch ? extensionMatch[1] : 'png';
  
  // Transform alt text: lowercase, replace spaces with hyphens, remove special chars
  const seoName = altText
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // remove special characters
    .replace(/-+/g, '-'); // collapse multiple hyphens into one
    
  // Fallback if seoName ends up empty
  const finalName = seoName || 'image';
  
  return `${finalName}.${extension}`;
}

/**
 * Validate that alt text is provided and meets the minimum word count.
 * @param {string} altText - The alt text to validate.
 * @param {number} minWords - Minimum number of words required.
 * @returns {Object} - { valid: boolean, error: string | null }
 */
export function validateAltText(altText, minWords = 3) {
  if (!altText || altText.trim() === '') {
    return { valid: false, error: 'Alt text is required for SEO.' };
  }
  
  const wordCount = altText.trim().split(/\s+/).length;
  if (wordCount < minWords) {
    return { valid: false, error: `Alt text must be at least ${minWords} words to be descriptive.` };
  }
  
  return { valid: true, error: null };
}
