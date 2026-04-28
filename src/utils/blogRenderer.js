import { getYouTubeEmbedUrl } from './youtubeUtils';

/**
 * Inject YouTube iframe players and Image Blocks into div placeholders in HTML content
 * @param {string} htmlContent - HTML content with placeholders
 * @param {string[]} ytlinks - Array of YouTube URLs
 * @param {Object} imageBlocks - Map of blockId -> array of uploaded image objects
 * @returns {string} HTML content with embedded media
 */
export const injectBlogContent = (htmlContent, ytlinks = [], imageBlocks = {}) => {
  let processedContent = htmlContent;

  // 1. Inject YouTube Players
  if (ytlinks && ytlinks.length > 0) {
    ytlinks.forEach((url, index) => {
      const embedUrl = getYouTubeEmbedUrl(url);
      if (embedUrl) {
        const iframeHtml = `
          <div class="youtube-embed-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1.5rem 0; border-radius: 12px; shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            <iframe 
              src="${embedUrl}" 
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              title="YouTube video player ${index + 1}"
            ></iframe>
          </div>
        `;
        const placeholderRegex = new RegExp(`<div\\s+id=["']yt${index}["'][^>]*>\\s*</div>`, 'gi');
        processedContent = processedContent.replace(placeholderRegex, iframeHtml);
      }
    });
  }

  // 2. Inject Image Blocks
  if (imageBlocks && Object.keys(imageBlocks).length > 0) {
    Object.entries(imageBlocks).forEach(([blockId, images]) => {
      if (!images || images.length === 0) return;

      // Create a grid for the images
      let gridHtml = `
        <div class="blog-image-block" style="margin: 2rem 0; display: grid; gap: 1rem; grid-template-columns: repeat(${Math.min(images.length, 2)}, 1fr);">
      `;

      // Adjust grid columns based on number of images
      if (images.length === 1) {
        gridHtml = `<div class="blog-image-block" style="margin: 2rem 0;">`;
      } else if (images.length >= 3) {
        gridHtml = `<div class="blog-image-block" style="margin: 2rem 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">`;
      }

      images.forEach((img, idx) => {
        gridHtml += `
          <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <img 
              src="${img.url || img.previewUrl}" 
              alt="Blog image ${idx + 1}" 
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
              loading="lazy"
            />
          </div>
        `;
      });

      gridHtml += `</div>`;

      // Replace the placeholder div with the grid
      const placeholderRegex = new RegExp(`<div\\s+class=["']image-block["']\\s+id=["']${blockId}["'][^>]*>\\s*</div>`, 'gi');
      processedContent = processedContent.replace(placeholderRegex, gridHtml);
    });
  }

  return processedContent;
};
