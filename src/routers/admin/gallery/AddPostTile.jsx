import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const AddPostTile = ({ onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-8 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] group"
    >
      <motion.div
        animate={{ 
          rotate: [0, 90, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
        className="bg-blue-600 rounded-full p-4 mb-4 group-hover:bg-blue-700 transition-colors duration-300"
      >
        <Plus className="h-8 w-8 text-white" />
      </motion.div>
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Add New Post</h3>
      <p className="text-sm text-blue-700 text-center">
        Create a new gallery showcase
      </p>
    </motion.div>
  );
};

export default AddPostTile;
