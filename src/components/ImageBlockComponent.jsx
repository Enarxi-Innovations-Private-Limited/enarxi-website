import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import MultiImageUploadModal from './MultiImageUploadModal';

/**
 * ImageBlockComponent - React Node View for ImageBlock
 * Renders a non-editable block with image previews and edit/delete controls
 */
const ImageBlockComponent = ({ node, updateAttributes, deleteNode }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { id, images } = node.attrs;

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSave = ({ images: updatedImages }) => {
    updateAttributes({ images: updatedImages });
    setShowEditModal(false);
  };

  const handleCancel = () => {
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this image block? This will remove all images from the block.')) {
      deleteNode();
    }
  };

  return (
    <>
      <NodeViewWrapper className="image-block-wrapper my-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-indigo-400 transition-colors"
          contentEditable={false}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-700">
                Image Block ({images.length} {images.length === 1 ? 'image' : 'images'})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-indigo-100 rounded-lg transition-colors group"
                title="Edit block"
              >
                <Edit className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                title="Delete block"
              >
                <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
              </button>
            </div>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div
                  key={img.publicId || index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 shadow-sm"
                >
                  <img
                    src={img.url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white truncate">
                      {img.width} × {img.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No images in this block</p>
              <button
                onClick={handleEdit}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Add images
              </button>
            </div>
          )}
        </div>
      </NodeViewWrapper>

      {/* Edit Modal */}
      <MultiImageUploadModal
        isOpen={showEditModal}
        onSave={handleSave}
        onCancel={handleCancel}
        existingBlock={{ id, images }}
      />
    </>
  );
};

export default ImageBlockComponent;
