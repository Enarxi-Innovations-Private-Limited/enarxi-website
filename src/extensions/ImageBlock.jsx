import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageBlockComponent from '@/components/ImageBlockComponent';

export const ImageBlock = Node.create({
  name: 'imageBlock',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      images: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-block"]',
        getAttrs: (dom) => {
          const id = dom.getAttribute('data-id');
          const imagesJson = dom.getAttribute('data-images');
          return {
            id,
            images: imagesJson ? JSON.parse(imagesJson) : [],
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'image-block',
        'data-id': HTMLAttributes.id,
        'data-images': JSON.stringify(HTMLAttributes.images),
        class: 'image-block',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockComponent);
  },
});
