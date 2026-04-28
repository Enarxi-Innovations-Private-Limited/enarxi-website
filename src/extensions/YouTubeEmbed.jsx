import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import YouTubeEmbedComponent from '@/routers/Components/YouTubeEmbedComponent';

/**
 * Extract YouTube video ID from URL
 */
export const extractYouTubeId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

export const YouTubeEmbed = Node.create({
  name: 'youtubeEmbed',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      url: {
        default: null,
      },
      videoId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="youtube-embed"]',
        getAttrs: (dom) => {
          const url = dom.getAttribute('data-url');
          const videoId = dom.getAttribute('data-video-id');
          return {
            url,
            videoId,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'youtube-embed',
        'data-url': HTMLAttributes.url,
        'data-video-id': HTMLAttributes.videoId,
        class: 'youtube-embed',
      }),
    ];
  },

  addCommands() {
    return {
      setYouTubeEmbed:
        (url) =>
        ({ commands }) => {
          const videoId = extractYouTubeId(url);
          if (!videoId) {
            return false;
          }
          return commands.insertContent({
            type: this.name,
            attrs: { url, videoId },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(YouTubeEmbedComponent);
  },
});
