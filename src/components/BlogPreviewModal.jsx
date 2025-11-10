import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import parse from 'html-react-parser';

// Helper function to extract YouTube video ID
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*$/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

// ImageBlock Carousel Component for Preview
const ImageBlockCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="text-red-500 text-center py-4">No images available</div>;
  }

  // Helper function to get the image URL (handles both staged and uploaded images)
  const getImageUrl = (img) => {
    if (!img) return '';
    // If it's a staged item with previewUrl (blob URL)
    if (img.previewUrl) return img.previewUrl;
    // If it's already a URL string
    if (typeof img === 'string') return img;
    // If it's an object with a url property
    if (img.url) return img.url;
    return '';
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const currentImage = images[currentIndex];
  const imageUrl = getImageUrl(currentImage);
  const altText = currentImage?.fileName || `Image ${currentIndex + 1}`;

  return (
    <div className="relative w-full my-8">
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/blogs/default.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
        
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <p className="text-center text-sm text-gray-500 mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      )}
    </div>
  );
};

// YouTube Embed Component
const YouTubeEmbed = ({ url }) => {
  const videoId = getYouTubeId(url);
  
  if (!videoId) {
    return <p className="text-red-500 text-center py-4">Invalid YouTube URL</p>;
  }

  return (
    <div className="relative w-full my-8" style={{ paddingTop: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// Blog Content Renderer Component
const BlogContentRenderer = ({ content, imageBlocks, ytlinks }) => {
  const options = {
    replace: (domNode) => {
      if (domNode.type === 'tag' && domNode.attribs) {
        // Handle image-block divs
        if (domNode.name === 'div' && domNode.attribs.class === 'image-block') {
          const blockId = domNode.attribs.id;
          const images = imageBlocks?.[blockId];
          
          if (images && images.length > 0) {
            return <ImageBlockCarousel images={images} />;
          }
          return <div className="text-gray-400 text-center py-4">Image block not found</div>;
        }
        
        // Handle YouTube divs
        if (domNode.name === 'div' && domNode.attribs.id && domNode.attribs.id.startsWith('yt')) {
          const index = parseInt(domNode.attribs.id.replace('yt', ''), 10);
          const url = ytlinks?.[index];
          
          if (url) {
            return <YouTubeEmbed url={url} />;
          }
          return <div className="text-gray-400 text-center py-4">Video not found</div>;
        }
      }
    },
  };

  return (
    <div className="prose prose-lg max-w-none mb-8 blog-content-renderer">
      {parse(content, options)}
    </div>
  );
};

/**
 * BlogPreviewModal Component
 * Shows a clean preview of the blog exactly as it will appear when published
 * Handles staged images (blob URLs) and YouTube embeds
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Callback when modal closes
 * @param {Object} props.previewData - Blog data to preview
 */
const BlogPreviewModal = ({ isOpen, onClose, previewData }) => {
  if (!isOpen || !previewData) return null;

  const { title, authorName, authorRole, content, featuredImage, imageBlocks, ytlinks } = previewData;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            .blog-content-renderer h1 {
              font-size: 2em;
              line-height: 1.2;
              font-weight: bold;
              margin-top: 0.67em;
              margin-bottom: 0.67em;
            }
            
            .blog-content-renderer h2 {
              font-size: 1.5em;
              line-height: 1.3;
              font-weight: bold;
              margin-top: 0.83em;
              margin-bottom: 0.83em;
            }
            
            .blog-content-renderer h3 {
              font-size: 1.17em;
              line-height: 1.4;
              font-weight: bold;
              margin-top: 1em;
              margin-bottom: 1em;
            }
            
            .blog-content-renderer ul,
            .blog-content-renderer ol {
              padding-left: 1.75rem;
              margin-top: 0.75em;
              margin-bottom: 0.75em;
            }
            
            .blog-content-renderer ul {
              list-style-type: disc;
            }
            
            .blog-content-renderer ol {
              list-style-type: decimal;
            }
            
            .blog-content-renderer li {
              margin-top: 0.25em;
              margin-bottom: 0.25em;
            }
            
            .blog-content-renderer p {
              margin-top: 0.75em;
              margin-bottom: 0.75em;
            }
            
            .blog-content-renderer strong {
              font-weight: 600;
            }
            
            .blog-content-renderer em {
              font-style: italic;
            }
          `}</style>
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Close Button */}
              <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <h3 className="text-white font-bold text-lg">Blog Preview</h3>
                  </div>
                  <span className="text-white/80 text-sm">How it will look when published</span>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  aria-label="Close preview"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-4xl mx-auto bg-white my-6 rounded-xl shadow-lg">
                  {/* Featured Image */}
                  {featuredImage && (
                    <div className="w-full aspect-video bg-gray-100 overflow-hidden rounded-t-xl">
                      <img
                        src={featuredImage}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className="p-8">
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-oswald">
                      {title || 'Untitled Blog'}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <User size={18} />
                        <span className="font-medium">{authorName || 'Anonymous'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{authorRole || 'Staff'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <span>{new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>

                    {/* Blog Content with Image Blocks and YouTube Embeds */}
                    {content && content !== '<p></p>' ? (
                      <BlogContentRenderer
                        content={content}
                        imageBlocks={imageBlocks}
                        ytlinks={ytlinks}
                      />
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <p className="text-lg">No content to preview yet</p>
                        <p className="text-sm mt-2">Start writing to see your blog preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BlogPreviewModal;
