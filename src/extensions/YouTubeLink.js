import { Mark, mergeAttributes } from '@tiptap/core';

export const YouTubeLink = Mark.create({
  name: 'youtubeLink',

  priority: 1000,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'youtube-link',
        style: 'color: #1e90ff; text-decoration: underline;',
      },
    };
  },

  addAttributes() {
    return {
      'data-youtube-url': {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-youtube-url]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setYouTubeLink:
        (url) =>
        ({ commands }) => {
          return commands.setMark(this.name, { 'data-youtube-url': url });
        },
      toggleYouTubeLink:
        (url) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, { 'data-youtube-url': url });
        },
      unsetYouTubeLink:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
