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
        const placeholderRegex = new RegExp(`<div\\s+id=["']yt${index}["'][^>]*>\\s*</div>`, 'i');
        processedContent = processedContent.replace(placeholderRegex, iframeHtml);
      }
    });
  }

  // 2. Inject Image Blocks
  if (imageBlocks && Object.keys(imageBlocks).length > 0) {
    console.log(`🎨 blogRenderer: Injecting ${Object.keys(imageBlocks).length} image blocks`);

    Object.entries(imageBlocks).forEach(([blockId, images]) => {
      if (!images || images.length === 0) return;

      console.log(`📸 blogRenderer: Block "${blockId}" has ${images.length} images`);

      let gridHtml = images.length === 1
        ? `<div class="blog-image-block" style="margin: 2rem 0; display: flex; justify-content: center;">`
        : `<div class="blog-image-block" style="margin: 2rem 0; display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start;">`;

      images.forEach((img, idx) => {
        const rawSrc = img.url || img.previewUrl || '';
        const src = rawSrc.includes('res.cloudinary.com') ? rawSrc.replace('/upload/', '/upload/f_auto,q_auto/') : rawSrc;
        const alt = img.altText || `Blog image ${idx + 1}`;
        const title = img.title?.trim() || '';   // empty string = don't render the label
        const showLabel = title.length > 0;

        if (images.length === 1) {
          gridHtml += `
            <div style="display: flex; flex-direction: column; align-items: center; max-width: 100%;">
              <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 100%;">
                <img
                  src="${src}"
                  alt="${alt}"
                  title="${title || alt}"
                  style="max-width: 100%; max-height: 500px; width: auto; height: auto; display: block; margin: 0; object-fit: contain;"
                  loading="lazy"
                />
              </div>
              ${showLabel ? `
              <p style="margin: 0.1rem 0 0; font-size: 1.1rem; color: #000000ff; text-align: center; font-style: italic;">
                ${title}
              </p>` : ''}
            </div>
          `;
        } else {
          gridHtml += `
            <div style="flex: 1 1 calc(50% - 0.5rem); min-width: 200px; display: flex; flex-direction: column;">
              <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <img
                  src="${src}"
                  alt="${alt}"
                  title="${title || alt}"
                  style="width: 100%; height: auto; display: block;"
                  loading="lazy"
                />
              </div>
              ${showLabel ? `
              <p style="margin: 0.4rem 0 0; font-size: 1.1rem; color: #000102ff; text-align: center; font-style: italic;">
                ${title}
              </p>` : ''}
            </div>
          `;
        }
      });

      gridHtml += `</div>`;

      const escapedBlockId = blockId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // 'i' only — no 'g'. Never .test() before .replace() on same regex instance.
      const placeholderRegex = new RegExp(
        `<div[^>]*class=["']image-block["'][^>]*id=["']${escapedBlockId}["'][^>]*>\\s*</div>`,
        'i'
      );

      const replaced = processedContent.replace(placeholderRegex, gridHtml);

      if (replaced !== processedContent) {
        console.log(`✅ blogRenderer: Replaced placeholder for "${blockId}"`);
        processedContent = replaced;
      } else {
        // Fallback: alternate attribute order (id before class)
        const fallbackRegex = new RegExp(
          `<div[^>]*id=["']${escapedBlockId}["'][^>]*class=["']image-block["'][^>]*>\\s*</div>`,
          'i'
        );
        const fallbackReplaced = processedContent.replace(fallbackRegex, gridHtml);
        if (fallbackReplaced !== processedContent) {
          console.log(`✅ blogRenderer: Replaced placeholder for "${blockId}" (fallback attr order)`);
          processedContent = fallbackReplaced;
        } else {
          console.warn(
            `❌ blogRenderer: Placeholder NOT found for "${blockId}". Nearby HTML:`,
            processedContent.includes(blockId)
              ? processedContent.slice(
                Math.max(0, processedContent.indexOf(blockId) - 50),
                processedContent.indexOf(blockId) + 100
              )
              : '(blockId not found anywhere in HTML)'
          );
        }
      }
    });
  }

  return processedContent;
};