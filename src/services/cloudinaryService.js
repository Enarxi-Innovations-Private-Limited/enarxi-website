import { 
  uploadToCloudinary as uploadUtil, 
  deleteFromCloudinary as deleteUtil, 
  extractPublicId as extractUtil 
} from "@/utils/uploadToCloudinary";

/**
 * Cloudinary Service
 * Wraps existing Cloudinary utilities to provide a consistent interface
 */
export const cloudinaryService = {
  /**
   * Upload an image file
   * @param {File} file 
   * @param {string} [preset] 
   */
  async uploadImage(file, preset = null) {
    return await uploadUtil(file, preset);
  },

  /**
   * Delete an image by its public ID
   * @param {string} publicId 
   */
  async deleteImage(publicId) {
    return await deleteUtil(publicId);
  },

  /**
   * Extract public ID from a Cloudinary URL
   * @param {string} url 
   */
  extractPublicId(url) {
    return extractUtil(url);
  }
};
