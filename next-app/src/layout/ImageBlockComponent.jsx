"use client";
//path -> src/routers/Components/ImageBlockComponent.jsx
import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import MultiImageUploadModal from './MultiImageUploadModal';

const ImageBlockComponent = ({ node, updateAttributes, deleteNode }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { id, stagedItems = [] } = node.attrs;

  const getItems = () => {
    if (Array.isArray(stagedItems) && stagedItems.length > 0) return stagedItems;
    if (Array.isArray(node.attrs.images) && node.attrs.images.length > 0) return node.attrs.images;
    return [];
  };

  const items = getItems().map((item, index) => ({
    ...item,
    id: item.id || item.publicId || `existing-${index}`,
  }));

  const handleEdit = () => setShowEditModal(true);
  const handleCancel = () => setShowEditModal(false);

  const handleSave = ({ id: blockId, stagedItems: updatedItems }) => {
    updateAttributes({ stagedItems: updatedItems, images: [] });
    window.dispatchEvent(new CustomEvent('sync-staged-block', {
      detail: { id: blockId, stagedItems: updatedItems },
    }));
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
                Image Block ({items.length} {items.length === 1 ? 'image' : 'images'})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleEdit}
                className="p-2 hover:bg-indigo-100 rounded-lg transition-colors group"
                title="Edit block"
              >
                <Edit className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                title="Delete block"
              >
                <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
              </button>
            </div>
          </div>

          {/* Image Preview Grid */}
          {items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item, index) => {
                const imageUrl = item.previewUrl || item.url;
                const isStaged = !!item.previewUrl;

                // Display name: prefer altText, fall back to fileName, then generic
                const displayName = item.altText || item.fileName || `Image ${index + 1}`;

                return (
                  <div
                    key={item.id || item.publicId || index}
                    className="flex flex-col rounded-lg overflow-hidden bg-gray-200 shadow-sm"
                  >
                    {/* Image */}
                    <div className="relative aspect-square">
                      <img
                        src={imageUrl}
                        alt={item.altText || `Image ${index + 1}`}
                        title={item.title || item.altText || `Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Staged badge */}
                      {isStaged && (
                        <span className="absolute top-1.5 right-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                          Staged
                        </span>
                      )}
                    </div>

                    {/* Image name below */}
                    <div className="bg-white px-2 py-1.5 border-t border-gray-100">
                      <p
                        className="text-xs text-gray-700 font-medium truncate"
                        title={displayName}
                      >
                        {displayName}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {item.width && item.height ? `${item.width} × ${item.height}` : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No images in this block</p>
              <button
                type="button"
                onClick={handleEdit}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Add images
              </button>
            </div>
          )}
        </div>
      </NodeViewWrapper>

      <MultiImageUploadModal
        isOpen={showEditModal}
        onSave={handleSave}
        onCancel={handleCancel}
        existingBlock={{ id, stagedItems: items }}
      />
    </>
  );
};

export default ImageBlockComponent;