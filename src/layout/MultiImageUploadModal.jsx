import React, { useState, useCallback } from 'react';
import { X, Upload, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { generateSeoFileName, validateAltText } from '@/utils/seoUtils';

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

  const isOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (isOpen && !isOpenRef.current) {
      setStagedItems(
        existingBlock?.stagedItems?.length > 0 ? existingBlock.stagedItems : []
      );
      setError('');
    }
    isOpenRef.current = isOpen;
  }, [isOpen, existingBlock?.id]);

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
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image file`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" is too large (max 5MB)`);
        continue;
      }

      try {
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
          altText: '',
          title: '',        // optional — auto-filled from altText on blur/change
          titleEdited: false, // track if user manually edited title
        });
        validCount++;
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
        setError(`Failed to process "${file.name}"`);
      }
    }

    setStagedItems((prev) => [...prev, ...newStagedItems]);
    setProcessing(false);
    e.target.value = '';
    if (validCount > 0) setError('');
  }, []);

  const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.width, height: img.height }); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
      img.src = url;
    });
  };

  const handleRemoveImage = useCallback((itemId) => {
    setStagedItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === itemId);
      if (itemToRemove?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((item) => item.id !== itemId);
    });
  }, []);

  /**
   * Handle alt text change — also auto-fills title and fileName live as user types
   */
  const handleAltTextChange = useCallback((id, value) => {
    setStagedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // Generate SEO file name live from alt text
        const ext = item.file
          ? `.${item.file.name.split('.').pop()}`
          : item.fileName
            ? `.${item.fileName.split('.').pop()}`
            : '';
        const seoBase = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 80);
        const liveFileName = seoBase ? `${seoBase}${ext}` : item.fileName;

        return {
          ...item,
          altText: value,
          fileName: liveFileName,
          // Auto-fill title only if user hasn't manually edited it
          title: item.titleEdited ? item.title : value,
        };
      })
    );
  }, []);

  /**
   * Handle title change — marks as manually edited so auto-fill stops
   */
  const handleTitleChange = useCallback((id, value) => {
    setStagedItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, title: value, titleEdited: value !== item.altText }
          : item
      )
    );
  }, []);

  /**
   * If user clears the title field, revert to auto-fill from altText
   */
  const handleTitleBlur = useCallback((id) => {
    setStagedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (!item.title.trim()) {
          return { ...item, title: item.altText, titleEdited: false };
        }
        return item;
      })
    );
  }, []);

  const handleSave = useCallback(() => {
    if (stagedItems.length === 0) {
      setError('Please select at least one image');
      return;
    }

    for (const item of stagedItems) {
      const validation = validateAltText(item.altText, 3);
      if (!validation.valid) {
        setError(`Alt text for "${item.fileName || 'image'}" is invalid: ${validation.error}`);
        return;
      }
    }

    const renamedStagedItems = stagedItems.map((item) => {
      // Always derive file name from alt text
      const seoName = item.file && item.altText
        ? generateSeoFileName(item.altText, item.file.name)
        : item.fileName;

      const seoFile = item.file && item.altText
        ? new File([item.file], seoName, { type: item.file.type })
        : item.file;

      // Title: use whatever is in the field (auto-filled or edited), fallback to altText
      const resolvedTitle = item.title?.trim() || item.altText;

      return {
        ...item,
        file: seoFile,
        fileName: seoName,
        title: resolvedTitle,
      };
    });

    const blockId = existingBlock?.id || `image-block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    onSave({ id: blockId, stagedItems: renamedStagedItems });
  }, [stagedItems, existingBlock, onSave]);

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
                type="button"
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
                    <p className="text-sm text-gray-600 font-medium">Click to select images</p>
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
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-move"
                      >
                        <GripVertical className="w-5 h-5 text-gray-400 shrink-0 mt-1" />

                        <img
                          src={item.previewUrl || item.url}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-md shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1.5">
                          {/* File name */}
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {item.fileName || item.publicId || 'Uploaded image'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.width} × {item.height}
                            {item.format ? ` • ${item.format.toUpperCase()}` : ''}
                          </p>

                          {/* Alt Text — mandatory */}
                          <div>
                            <input
                              type="text"
                              value={item.altText || ''}
                              onChange={(e) => handleAltTextChange(item.id, e.target.value)}
                              placeholder="Alt text (min 3 words) *"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                              onPointerDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                            <p className="text-xs text-gray-400 mt-0.5">
                              Required · used for SEO and accessibility
                            </p>
                          </div>

                          {/* Image Title — optional, auto-filled */}
                          <div>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => handleTitleChange(item.id, e.target.value)}
                              onBlur={() => handleTitleBlur(item.id)}
                              placeholder="Image title (optional — auto-filled from alt text)"
                              className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-gray-600"
                              onPointerDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                            <p className="text-xs text-gray-400 mt-0.5">
                              Optional · shown as tooltip on hover
                            </p>
                          </div>

                          <p className={`text-xs font-medium ${item.previewUrl ? 'text-indigo-600' : 'text-green-600'}`}>
                            {item.previewUrl ? 'Staged (will upload on submit)' : 'Already uploaded'}
                          </p>
                        </div>

                        <button
                          type="button"
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
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="button"
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