import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

const GalleryTile = ({ post, onEdit, onDelete, onToggleVisibility }) => {
  const thumbnailUrl = post.thumbnail?.url || post.images?.[0]?.url || null;
  const imageCount = post.images?.length || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-gray-300" />
          </div>
        )}
        
        {/* Image Count Badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
          <ImageIcon className="h-3 w-3" />
          <span>{imageCount}</span>
        </div>

        {/* Visibility Toggle */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(post);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 left-2 bg-white bg-opacity-90 p-2 rounded-full shadow-md"
        >
          {post.visibility ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-[#0A1524] mb-2 line-clamp-2">
          {post.title || 'Untitled Post'}
        </h3>
        
        <div className="text-xs text-gray-500 mb-3">
          {post.createdAt && (
            <span>
              Created: {new Date(post.createdAt.toDate()).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mt-auto">
          <motion.button
            onClick={() => onEdit(post)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit</span>
          </motion.button>
          
          <motion.button
            onClick={() => onDelete(post)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryTile;
