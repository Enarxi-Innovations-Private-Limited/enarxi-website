import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, User, Eye, EyeOff, CheckCircle, Trash2, Image as ImageIcon, RefreshCw } from 'lucide-react';

const BlogTile = ({ blog, onView, onApprove, onDelete, onToggleVisibility, isPending = true }) => {
  const thumbnailUrl = blog.images?.[0]?.url || blog.images?.[0] || null;
  const imageCount = blog.images?.length || 0;
  const isVisible = blog.visibility !== false; // Default to true if field doesn't exist

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return timestamp.toDate().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
      className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer ${
        !isPending && !isVisible ? 'opacity-50' : 'opacity-100'
      }`}
      onClick={() => onView(blog)}
      animate={{ opacity: !isPending && !isVisible ? 0.5 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-16 w-16 text-gray-300" />
          </div>
        )}
        
        {/* Image Count Badge */}
        {/* {imageCount > 0 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
            <ImageIcon className="h-3 w-3" />
            <span>{imageCount}</span>
          </div>
        )} */}

        {/* Status Badge */}
        <div className={`absolute top-2 left-2 ${
          blog.status === 'retry' ? 'bg-orange-600' :
          isPending ? 'bg-blue-600' : 
          isVisible ? 'bg-green-600' : 
          'bg-gray-600'
        } bg-opacity-90 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1`}>
          {blog.status === 'retry' ? (
            <>
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </>
          ) : isPending ? (
            <>
              <Eye className="h-3 w-3" />
              <span>Review</span>
            </>
          ) : isVisible ? (
            <>
              <Eye className="h-3 w-3" />
              <span>Visible</span>
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" />
              <span>Hidden</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-[#0A1524] mb-2 line-clamp-2 min-h-[3.5rem]">
          {blog.title || 'Untitled Blog'}
        </h3>
        
        {/* Author Info */}
        <div className="flex items-center text-xs text-gray-600 mb-2">
          <User className="h-3 w-3 mr-1" />
          <span className="line-clamp-1">{blog.authorName || 'Unknown'}</span>
        </div>

        {/* Date */}
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(blog.updatedAt)}</span>
        </div>

        {/* Action Buttons */}
        {isPending ? (
          // Pending Blog Actions: Approve & Delete
          <div className="flex items-center space-x-2 mt-auto">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onApprove(blog);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Accept</span>
            </motion.button>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(blog);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </motion.button>
          </div>
        ) : (
          // Approved Blog Actions: Visibility Toggle & Delete
          <div className="flex items-center space-x-2 mt-auto">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(blog);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 ${isVisible ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 cursor-pointer`}
            >
              {isVisible ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Show</span>
                </>
              )}
            </motion.button>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(blog);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogTile;
