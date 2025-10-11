import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, User } from 'lucide-react';
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { uploadToCloudinary, extractPublicId, deleteFromCloudinary } from '@/utils/uploadToCloudinary';
import CropImageModal from '@/components/CropImageModal';

const AddEditTeamModal = ({ isOpen, onClose, member, existingMembersCount }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    visibility: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [originalFileName, setOriginalFileName] = useState('');

  const isEditMode = !!member;

  // Initialize form with member data if editing
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        visibility: member.visibility ?? true,
      });
      // Set existing image preview
      if (member.images && member.images.length > 0) {
        setImagePreview(member.images[0].url);
      }
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        role: '',
        visibility: true,
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [member, isOpen]);

  // Validate image aspect ratio
  const validateImageAspectRatio = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const targetAspectRatio = 4 / 5; // 0.8
        const tolerance = 0.01;
        
        URL.revokeObjectURL(url);
        
        if (Math.abs(aspectRatio - targetAspectRatio) < tolerance) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  };

  // Handle image selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    try {
      const isCorrectAspectRatio = await validateImageAspectRatio(file);
      
      if (isCorrectAspectRatio) {
        // Image is already 4:5, use it directly
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        toast.success('Image uploaded successfully');
      } else {
        // Image needs cropping
        toast('Image is not 4:5 — opening crop tool', { icon: '✂️' });
        setOriginalFileName(file.name);
        setImageToCrop(URL.createObjectURL(file));
        setShowCropModal(true);
      }
    } catch (error) {
      console.error('Error validating image:', error);
      toast.error('Failed to process image');
    }
  };

  // Handle cropped image
  const handleCropComplete = (croppedFile) => {
    setImageFile(croppedFile);
    setImagePreview(URL.createObjectURL(croppedFile));
    setShowCropModal(false);
    setImageToCrop(null);
    toast.success('Image cropped successfully');
  };

  // Handle crop cancel
  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
    URL.revokeObjectURL(imageToCrop);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Employee name is required');
      return;
    }
    if (!formData.role.trim()) {
      toast.error('Role is required');
      return;
    }
    if (!isEditMode && !imageFile) {
      toast.error('Employee image is required');
      return;
    }

    setLoading(true);
    const toastId = toast.loading(isEditMode ? 'Updating team member...' : 'Adding team member...');

    try {
      let imageData = null;

      // Upload image to Cloudinary if new image is provided
      if (imageFile) {
        toast.loading('Uploading image to Cloudinary...', { id: toastId });
        
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_OUR_TEAM;
        const cloudinaryResponse = await uploadToCloudinary(imageFile, uploadPreset);

        imageData = {
          format: cloudinaryResponse.format,
          height: cloudinaryResponse.height,
          width: cloudinaryResponse.width,
          publicId: cloudinaryResponse.publicId,
          url: cloudinaryResponse.url,
        };
      }

      if (isEditMode) {
        // Update existing member
        const memberRef = doc(db, 'teamMembers', member.id);
        const updateData = {
          name: formData.name.trim(),
          role: formData.role.trim(),
          visibility: formData.visibility,
          updatedAt: serverTimestamp(),
        };

        // Atomic deletion: If new image was uploaded, delete old image first
        if (imageData && member.images && member.images.length > 0) {
          toast.loading('Deleting old image from Cloudinary...', { id: toastId });
          
          const oldImageData = member.images[0];
          const oldPublicId = oldImageData.publicId || extractPublicId(oldImageData.url);

          if (oldPublicId) {
            // Delete old image from Cloudinary FIRST
            const deleteResult = await deleteFromCloudinary(oldPublicId);

            if (!deleteResult.success) {
              // If Cloudinary deletion fails, abort the entire update
              toast.error(
                'Failed to delete old image from Cloudinary. Update aborted to maintain data integrity.',
                { id: toastId }
              );
              setLoading(false);
              return;
            }

            console.log(`✅ Deleted old image from Cloudinary: ${oldPublicId}`);
          }

          // Only update with new image if old image deletion succeeded
          updateData.images = [imageData];
          toast.loading('Updating team member...', { id: toastId });
        } else if (imageData) {
          // No old image exists, just add the new one
          updateData.images = [imageData];
        }

        await updateDoc(memberRef, updateData);
        toast.success('Team member updated successfully!', { id: toastId });
      } else {
        // Add new member
        const newMember = {
          name: formData.name.trim(),
          role: formData.role.trim(),
          images: [imageData],
          visibility: formData.visibility,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          order: existingMembersCount, // Set order to end of list
        };

        await addDoc(collection(db, 'teamMembers'), newMember);
        toast.success('Team member added successfully!', { id: toastId });
      }

      onClose();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} team member: ${error.message}`, {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {isEditMode ? 'Edit Team Member' : 'Add New Team Member'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {isEditMode ? 'Update team member details' : 'Add a new member to your team'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-start space-x-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <div className="relative w-32 h-40 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Required aspect ratio: <strong>4:5</strong> (e.g., 800x1000px)
                        <br />
                        Images with different ratios will be cropped automatically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Employee Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role / Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Developer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="visibility"
                    name="visibility"
                    checked={formData.visibility}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <label htmlFor="visibility" className="text-sm font-medium text-gray-700">
                    Visible on website
                  </label>
                </div>
              </form>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isEditMode ? 'Updating...' : 'Adding...'}</span>
                    </>
                  ) : (
                    <span>{isEditMode ? 'Update Member' : 'Add Member'}</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crop Modal */}
      <CropImageModal
        isOpen={showCropModal}
        imageSrc={imageToCrop}
        fileName={originalFileName}
        aspect={4 / 5}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    </>
  );
};

export default AddEditTeamModal;
