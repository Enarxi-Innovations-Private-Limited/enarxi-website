import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Trash2, Calendar, User } from 'lucide-react';

const BlogViewModal = ({ blog, isOpen, onClose, onApprove, onDelete }) => {
  if (!blog) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return timestamp.toDate().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
          >
            {/* Modal with smooth scale and fade */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300,
                duration: 0.4 
              }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Close button - stays in place */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white bg-black/75 hover:bg-black p-2 rounded-full z-20 transition-all duration-200 hover:scale-110"
              >
                <X size={20} />
              </button>

              {/* Scrollable content area */}
              <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* Image - scrolls with content */}
                {blog.images && blog.images.length > 0 && (
                  <div className="w-full bg-gray-100 p-6">
                    <img
                      src={blog.images[0].url || blog.images[0]}
                      alt={blog.title}
                      className="w-full max-h-[50vh] object-contain rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.src = '/blogs/default.jpg';
                      }}
                    />
                  </div>
                )}

                {/* Content section - scrolls with image */}
                <div className="p-6 md:p-8">
                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {blog.title || 'Untitled Blog'}
                  </h2>

                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{blog.authorName || 'Unknown Author'}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>{formatDate(blog.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Blog content */}
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                    dangerouslySetInnerHTML={{ 
                      __html: blog.content || '<p class="text-gray-500 italic">No content available</p>' 
                    }}
                  />
                </div>
              </div>

              {/* Fixed Action buttons at bottom */}
              <div className="border-t border-gray-200 p-4 md:p-6 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50 flex-shrink-0">
                <motion.button
                  onClick={() => {
                    onApprove(blog.id, blog.title);
                    onClose();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Accept Blog</span>
                </motion.button>
                <motion.button
                  onClick={() => {
                    onDelete(blog.id, blog.title, blog.images);
                    onClose();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Blog</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BlogViewModal;
