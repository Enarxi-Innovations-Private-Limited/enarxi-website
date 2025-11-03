import React, { useState, useCallback } from 'react';
import { X, Upload, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

/**
 * MultiImageUploadModal Component
 * Modal for selecting, previewing, reordering, and managing multiple images
 * Images are staged locally (not uploaded to Cloudinary until blog submission)
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onSave - Callback with { id, stagedItems } when saved
 * @param {Function} props.onCancel - Callback when user cancels
 * @param {Object} props.existingBlock - Optional existing block data for editing
 */
const MultiImageUploadModal = ({ isOpen, onSave, onCancel, existingBlock = null }) => {
  const [stagedItems, setStagedItems] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Reset staged items when modal opens with existing block
  React.useEffect(() => {
    if (isOpen) {
      setStagedItems(existingBlock?.stagedItems || []);
      setError('');
    }
  }, [isOpen, existingBlock]);

  // Cleanup object URLs when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      // Cleanup any temporary object URLs that weren't saved
      return () => {
        stagedItems.forEach((item) => {
          if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(item.previewUrl);
          }
        });
      };
    }
  }, [isOpen, stagedItems]);

  /**
   * Handle file selection and stage locally (no upload yet)
   */
  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setError('');
    setProcessing(true);

    const newStagedItems = [];
    let validCount = 0;

    for (const file of files) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" is too large (max 5MB)`);
        continue;
      }

      try {
        // Create preview URL and get dimensions
        const previewUrl = URL.createObjectURL(file);
        const dimensions = await getImageDimensions(file);

        newStagedItems.push({
          id: `staged-${Date.now()}-${Math.random()}`,
          file,
          previewUrl,
          status: 'staged',
          format: file.type.split('/')[1] || 'unknown',
          width: dimensions.width,
          height: dimensions.height,
          fileName: file.name,
        });
        validCount++;
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
        setError(`Failed to process "${file.name}"`);
      }
    }

    setStagedItems((prev) => [...prev, ...newStagedItems]);
    setProcessing(false);

    // Clear file input
    e.target.value = '';

    if (validCount > 0) {
      setError('');
    }
  }, []);

  /**
   * Helper to get image dimensions from file
   */
  const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  };

  /**
   * Remove a staged item from the list
   */
  const handleRemoveImage = useCallback((itemId) => {
    setStagedItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === itemId);
      
      // Cleanup object URL if it's a blob
      if (itemToRemove?.previewUrl && itemToRemove.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      
      return prev.filter((item) => item.id !== itemId);
    });
  }, []);

  /**
   * Handle save
   */
  const handleSave = useCallback(() => {
    if (stagedItems.length === 0) {
      setError('Please select at least one image');
      return;
    }

    const blockId = existingBlock?.id || `image-block-${Date.now()}`;
    onSave({ id: blockId, stagedItems });
  }, [stagedItems, existingBlock, onSave]);

  /**
   * Handle reorder
   */
  const handleReorder = useCallback((newOrder) => {
    setStagedItems(newOrder);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {existingBlock ? 'Edit Image Block' : 'Insert Image Block'}
                  </h2>
                  <p className="text-sm text-gray-500">Upload and arrange multiple images</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={processing}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Upload Area */}
              <div className="mb-6">
                <label
                  htmlFor="multi-image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to select images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB each (will upload on blog submission)
                    </p>
                  </div>
                  <input
                    id="multi-image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={processing}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Processing Indicator */}
              {processing && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-blue-800 font-medium">Processing images...</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Image List */}
              {stagedItems.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Selected Images ({stagedItems.length})
                    </h3>
                    <p className="text-xs text-gray-500">Drag to reorder</p>
                  </div>
                  <Reorder.Group
                    axis="y"
                    values={stagedItems}
                    onReorder={handleReorder}
                    className="space-y-2"
                  >
                    {stagedItems.map((item) => (
                      <Reorder.Item
                        key={item.id}
                        value={item}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-move"
                      >
                        <GripVertical className="w-5 h-5 text-gray-400 shrink-0" />
                        <img
                          src={item.previewUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-md shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {item.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.width} × {item.height} • {item.format.toUpperCase()}
                          </p>
                          <p className="text-xs text-indigo-600 font-medium mt-0.5">
                            Staged (will upload on submit)
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveImage(item.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                          disabled={processing}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No images selected yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={processing || stagedItems.length === 0}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {existingBlock ? 'Update Block' : 'Insert Block'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MultiImageUploadModal;
