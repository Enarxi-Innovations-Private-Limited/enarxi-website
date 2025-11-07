import React from 'react';
import { motion } from 'framer-motion';

/**
 * ImageBlock Component
 * Renders a responsive grid of images for blog content
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the image block
 * @param {Array} props.images - Array of image objects with { url, publicId, format, width, height }
 */
const ImageBlock = ({ id, images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  // Determine grid layout based on number of images
  const getGridClass = () => {
    if (images.length === 1) return 'grid-cols-1';
    if (images.length === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-2 md:grid-cols-3';
  };

  return (
    <div className="my-6" id={id}>
      <div className={`grid ${getGridClass()} gap-4`}>
        {images.map((img, index) => (
          <motion.figure
            key={img.publicId || index}
            className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <img
              src={img.url}
              alt={`Image ${index + 1}`}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </motion.figure>
        ))}
      </div>
    </div>
  );
};

export default ImageBlock;
