import React, { useState, useCallback } from 'react';
import { X, Upload, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';

/**
 * MultiImageUploadModal Component
 * Modal for uploading, previewing, reordering, and managing multiple images
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onSave - Callback with { id, images } when saved
 * @param {Function} props.onCancel - Callback when user cancels
 * @param {Object} props.existingBlock - Optional existing block data for editing
 */
const MultiImageUploadModal = ({ isOpen, onSave, onCancel, existingBlock = null }) => {
  const [images, setImages] = useState(existingBlock?.images || []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');

  /**
   * Handle file selection and upload to Cloudinary
   */
  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setError('');
    setUploading(true);
    setUploadProgress(`Uploading 0/${files.length} images...`);

    const uploadedImages = [];
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

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
        setUploadProgress(`Uploading ${i + 1}/${files.length} images...`);
        const result = await uploadToCloudinary(file);
        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          format: result.format,
          width: result.width,
          height: result.height,
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        setError(`Failed to upload "${file.name}"`);
      }
    }

    setImages((prev) => [...prev, ...uploadedImages]);
    setUploading(false);
    setUploadProgress('');

    // Clear file input
    e.target.value = '';

    if (successCount > 0) {
      setError('');
    }
  }, []);

  /**
   * Remove an image from the list
   */
  const handleRemoveImage = useCallback((publicId) => {
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  }, []);

  /**
   * Handle save
   */
  const handleSave = useCallback(() => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    const blockId = existingBlock?.id || `image-block-${Date.now()}`;
    onSave({ id: blockId, images });
  }, [images, existingBlock, onSave]);

  /**
   * Handle reorder
   */
  const handleReorder = useCallback((newOrder) => {
    setImages(newOrder);
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
                disabled={uploading}
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
                      Click to upload images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB each
                    </p>
                  </div>
                  <input
                    id="multi-image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-blue-800 font-medium">{uploadProgress}</span>
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
              {images.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Uploaded Images ({images.length})
                    </h3>
                    <p className="text-xs text-gray-500">Drag to reorder</p>
                  </div>
                  <Reorder.Group
                    axis="y"
                    values={images}
                    onReorder={handleReorder}
                    className="space-y-2"
                  >
                    {images.map((img) => (
                      <Reorder.Item
                        key={img.publicId}
                        value={img}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-move"
                      >
                        <GripVertical className="w-5 h-5 text-gray-400 shrink-0" />
                        <img
                          src={img.url}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-md shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {img.publicId.split('/').pop()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {img.width} × {img.height} • {img.format.toUpperCase()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveImage(img.publicId)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                          disabled={uploading}
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
                  <p className="text-sm text-gray-500">No images uploaded yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={uploading || images.length === 0}
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
