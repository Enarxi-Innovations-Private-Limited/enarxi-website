import { getYouTubeEmbedUrl } from './youtubeUtils';

/**
 * Inject YouTube iframe players into div placeholders in HTML content
 * @param {string} htmlContent - HTML content with <div id="yt[index]"></div> placeholders
 * @param {string[]} ytlinks - Array of YouTube URLs
 * @returns {string} HTML content with embedded YouTube players
 */
export const injectYouTubePlayers = (htmlContent, ytlinks) => {
  if (!ytlinks || ytlinks.length === 0) {
    return htmlContent;
  }

  let processedContent = htmlContent;

  ytlinks.forEach((url, index) => {
    const embedUrl = getYouTubeEmbedUrl(url);
    
    if (embedUrl) {
      // Create YouTube iframe HTML
      const iframeHtml = `
        <div class="youtube-embed-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1.5rem 0;">
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

      // Replace the placeholder div with the iframe
      const placeholderRegex = new RegExp(`<div\\s+id=["']yt${index}["'][^>]*>\\s*</div>`, 'gi');
      processedContent = processedContent.replace(placeholderRegex, iframeHtml);
    }
  });

  return processedContent;
};
