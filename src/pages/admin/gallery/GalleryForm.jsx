import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { addDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/uploadToCloudinary';
import { logAdminActivity } from '@/utils/adminActivityLogger';
import { useAuth } from '@/AuthProvider';

const GalleryForm = ({ isOpen, onClose, post }) => {
  const { firebaseUser } = useAuth();
  const isEditMode = !!post;

  // Form state
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with post data when editing
  useEffect(() => {
    if (isEditMode && post) {
      setTitle(post.title || '');
      setVisibility(post.visibility ?? true);
      setThumbnailPreview(post.thumbnail?.url || '');
      setImages(post.images?.map(img => ({
        ...img,
        isExisting: true
      })) || []);
    } else {
      resetForm();
    }
  }, [post, isEditMode]);

  const resetForm = () => {
    setTitle('');
    setVisibility(true);
    setThumbnail(null);
    setThumbnailPreview('');
    setImages([]);
    setErrors({});
  };

  // Handle thumbnail upload
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Add new image entry
  const addImageEntry = () => {
    setImages([...images, {
      file: null,
      url: '',
      title: '',
      description: '',
      preview: '',
      isExisting: false
    }]);
  };

  // Remove image entry
  const removeImageEntry = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Handle image file change
  const handleImageFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      const newImages = [...images];
      newImages[index] = {
        ...newImages[index],
        file: file,
        preview: URL.createObjectURL(file)
      };
      setImages(newImages);
    }
  };

  // Handle image field changes
  const handleImageFieldChange = (index, field, value) => {
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      [field]: value
    };
    setImages(newImages);
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Post title is required';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    images.forEach((img, index) => {
      if (!img.isExisting && !img.file) {
        newErrors[`image_${index}_file`] = 'Image file is required';
      }
      if (!img.title?.trim()) {
        newErrors[`image_${index}_title`] = 'Image title is required';
      }
      if (!img.description?.trim()) {
        newErrors[`image_${index}_description`] = 'Image description is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix all validation errors');
      return;
    }

    setUploading(true);
    const toastId = toast.loading(isEditMode ? 'Updating post...' : 'Creating post...');

    try {
      // Upload thumbnail if new file is provided
      let thumbnailData = post?.thumbnail || null;
      if (thumbnail) {
        toast.loading('Uploading thumbnail...', { id: toastId });
        
        // Delete old thumbnail if editing
        if (isEditMode && post?.thumbnail?.public_id) {
          await deleteFromCloudinary(post.thumbnail.public_id);
        }

        const uploadResult = await uploadToCloudinary(
          thumbnail,
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_GALLERY
        );
        thumbnailData = {
          url: uploadResult.url,
          public_id: uploadResult.publicId
        };
      }

      // Process images
      const processedImages = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        
        if (img.isExisting) {
          // Keep existing image
          processedImages.push({
            url: img.url,
            title: img.title,
            description: img.description,
            public_id: img.public_id
          });
        } else if (img.file) {
          // Upload new image
          toast.loading(`Uploading image ${i + 1}/${images.length}...`, { id: toastId });
          const uploadResult = await uploadToCloudinary(
            img.file,
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_GALLERY
          );
          processedImages.push({
            url: uploadResult.url,
            title: img.title,
            description: img.description,
            public_id: uploadResult.publicId
          });
        }
      }

      // If no thumbnail provided, use first image as thumbnail
      if (!thumbnailData && processedImages.length > 0) {
        thumbnailData = {
          url: processedImages[0].url,
          public_id: processedImages[0].public_id
        };
      }

      // Prepare document data
      const postData = {
        title: title.trim(),
        visibility,
        thumbnail: thumbnailData,
        images: processedImages,
        updatedAt: serverTimestamp()
      };

      if (isEditMode) {
        // Update existing post
        toast.loading('Updating database...', { id: toastId });
        
        // Delete removed images from Cloudinary
        if (post.images) {
          const existingPublicIds = new Set(processedImages.map(img => img.public_id));
          for (const oldImg of post.images) {
            if (oldImg.public_id && !existingPublicIds.has(oldImg.public_id)) {
              try {
                await deleteFromCloudinary(oldImg.public_id);
                // console.log(`✅ Deleted removed image: ${oldImg.public_id}`);
              } catch (err) {
                console.warn(`⚠️ Failed to delete image: ${oldImg.public_id}`, err);
              }
            }
          }
        }

        await updateDoc(doc(db, 'gallery', post.id), postData);

        // Log activity
        if (firebaseUser) {
          await logAdminActivity(
            firebaseUser.uid,
            firebaseUser.displayName || firebaseUser.email,
            'updated_gallery_post',
            `Updated gallery post: ${title}`,
            { postId: post.id, postTitle: title }
          );
        }

        toast.success('Gallery post updated successfully!', { id: toastId });
      } else {
        // Create new post
        toast.loading('Saving to database...', { id: toastId });
        postData.createdAt = serverTimestamp();
        
        const docRef = await addDoc(collection(db, 'gallery'), postData);

        // Log activity
        if (firebaseUser) {
          await logAdminActivity(
            firebaseUser.uid,
            firebaseUser.displayName || firebaseUser.email,
            'created_gallery_post',
            `Created gallery post: ${title}`,
            { postId: docRef.id, postTitle: title }
          );
        }

        toast.success('Gallery post created successfully!', { id: toastId });
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(`Failed to save post: ${error.message}`, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      resetForm();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-[#0A1524]">
                  {isEditMode ? 'Edit Gallery Post' : 'Add New Gallery Post'}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={uploading}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Post Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={uploading}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="visibility"
                    checked={visibility}
                    onChange={(e) => setVisibility(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    disabled={uploading}
                  />
                  <label htmlFor="visibility" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Visible on website
                  </label>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image (Optional)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    If not uploaded, the first image will be used as thumbnail
                  </p>
                  <div className="flex items-start space-x-4">
                    {thumbnailPreview && (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {thumbnail ? thumbnail.name : 'Click to upload thumbnail'}
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Images Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Images <span className="text-red-500">*</span>
                    </label>
                    <motion.button
                      type="button"
                      onClick={addImageEntry}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={uploading}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Image</span>
                    </motion.button>
                  </div>

                  {errors.images && images.length === 0 && (
                    <p className="text-red-500 text-sm mb-3">{errors.images}</p>
                  )}

                  <div className="space-y-4">
                    {images.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Image {index + 1}
                          </h4>
                          <motion.button
                            type="button"
                            onClick={() => removeImageEntry(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={uploading}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>

                        <div className="space-y-3">
                          {/* Image Upload */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Image File {!img.isExisting && <span className="text-red-500">*</span>}
                            </label>
                            <div className="flex items-start space-x-3">
                              {(img.preview || img.url) && (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                                  <img
                                    src={img.preview || img.url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              {!img.isExisting && (
                                <label className="flex-1 cursor-pointer">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-500 transition-colors">
                                    <div className="flex items-center space-x-2">
                                      <ImageIcon className="h-5 w-5 text-gray-400" />
                                      <span className="text-xs text-gray-600">
                                        {img.file ? img.file.name : 'Click to upload'}
                                      </span>
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageFileChange(index, e)}
                                    className="hidden"
                                    disabled={uploading}
                                  />
                                </label>
                              )}
                            </div>
                            {errors[`image_${index}_file`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`image_${index}_file`]}
                              </p>
                            )}
                          </div>

                          {/* Image Title */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Image Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={img.title || ''}
                              onChange={(e) => handleImageFieldChange(index, 'title', e.target.value)}
                              placeholder="Enter image title"
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors[`image_${index}_title`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={uploading}
                            />
                            {errors[`image_${index}_title`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`image_${index}_title`]}
                              </p>
                            )}
                          </div>

                          {/* Image Description */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Image Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={img.description || ''}
                              onChange={(e) => handleImageFieldChange(index, 'description', e.target.value)}
                              placeholder="Enter image description"
                              rows={2}
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors[`image_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={uploading}
                            />
                            {errors[`image_${index}_description`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`image_${index}_description`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {images.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No images added yet. Click "Add Image" to start.</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={uploading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={uploading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{uploading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post')}</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GalleryForm;
