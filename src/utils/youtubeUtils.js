/**
 * Extract all YouTube links from HTML content
 * @param {string} htmlContent - HTML content to search
 * @returns {string[]} Array of YouTube URLs
 */
export const extractYouTubeLinks = (htmlContent) => {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
  const links = [];
  const matches = htmlContent.matchAll(youtubeRegex);
  
  for (const match of matches) {
    links.push(match[0]);
  }
  
  // Remove duplicates
  return [...new Set(links)];
};

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null
 */
export const getYouTubeVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Check if a URL is a valid YouTube URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export const isYouTubeUrl = (url) => {
  const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return regex.test(url);
};

/**
 * Get YouTube embed URL from regular URL
 * @param {string} url - YouTube URL
 * @returns {string|null} Embed URL or null
 */
export const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

/**
 * Mark YouTube links in HTML content with a special class
 * @param {string} htmlContent - HTML content
 * @returns {string} HTML with marked YouTube links
 */
export const markYouTubeLinksInHtml = (htmlContent) => {
  const youtubeRegex = /((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11}))/g;
  
  return htmlContent.replace(youtubeRegex, (match) => {
    return `<a href="${match}" class="youtube-link" style="color: #1e90ff; text-decoration: underline;" data-youtube-url="${match}">${match}</a>`;
  });
};
