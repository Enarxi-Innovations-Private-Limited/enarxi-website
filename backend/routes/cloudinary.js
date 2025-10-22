import express from 'express';
import { body, validationResult } from 'express-validator';
import cloudinary from '../config/cloudinary.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { db } from '../config/firebase.js';

const router = express.Router();

/**
 * Helper function to extract public_id from Cloudinary URL
 */
function extractPublicId(url) {
  if (!url) return null;
  
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload/v{version}/'
    const pathParts = parts.slice(uploadIndex + 2);
    const publicIdWithExt = pathParts.join('/');
    
    // Remove file extension
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

/**
 * @route   POST /api/cloudinary/delete
 * @desc    Delete image from Cloudinary (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/delete',
  authenticateUser,
  requireAdmin,
  [
    body('publicId')
      .notEmpty()
      .withMessage('Public ID is required')
      .isString()
      .withMessage('Public ID must be a string'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: errors.array()[0].msg,
          errors: errors.array()
        });
      }

      const { publicId } = req.body;

      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);

      // Log admin activity
      await db.collection('adminActivities').add({
        adminUid: req.user.uid,
        adminEmail: req.user.email,
        action: 'deleted_cloudinary_image',
        description: `Deleted image with public ID: ${publicId}`,
        timestamp: new Date(),
        metadata: { publicId, result: result.result }
      });

      if (result.result === 'ok') {
        res.json({
          success: true,
          message: 'Image deleted successfully',
          data: { publicId, result: result.result }
        });
      } else if (result.result === 'not found') {
        res.json({
          success: true,
          message: 'Image not found (may have been already deleted)',
          data: { publicId, result: result.result }
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Cloudinary Error',
          message: `Unexpected result: ${result.result}`,
          data: result
        });
      }
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Failed to delete image from Cloudinary'
      });
    }
  }
);

/**
 * @route   POST /api/cloudinary/delete-by-url
 * @desc    Delete image from Cloudinary by URL (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/delete-by-url',
  authenticateUser,
  requireAdmin,
  [
    body('url')
      .notEmpty()
      .withMessage('Image URL is required')
      .isURL()
      .withMessage('Invalid URL format'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: errors.array()[0].msg,
          errors: errors.array()
        });
      }

      const { url } = req.body;

      // Extract public ID from URL
      const publicId = extractPublicId(url);

      if (!publicId) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Could not extract public ID from URL'
        });
      }

      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);

      // Log admin activity
      await db.collection('adminActivities').add({
        adminUid: req.user.uid,
        adminEmail: req.user.email,
        action: 'deleted_cloudinary_image',
        description: `Deleted image from URL: ${url}`,
        timestamp: new Date(),
        metadata: { url, publicId, result: result.result }
      });

      if (result.result === 'ok') {
        res.json({
          success: true,
          message: 'Image deleted successfully',
          data: { url, publicId, result: result.result }
        });
      } else if (result.result === 'not found') {
        res.json({
          success: true,
          message: 'Image not found (may have been already deleted)',
          data: { url, publicId, result: result.result }
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Cloudinary Error',
          message: `Unexpected result: ${result.result}`,
          data: result
        });
      }
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Failed to delete image from Cloudinary'
      });
    }
  }
);

/**
 * @route   POST /api/cloudinary/delete-multiple
 * @desc    Delete multiple images from Cloudinary (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/delete-multiple',
  authenticateUser,
  requireAdmin,
  [
    body('publicIds')
      .isArray({ min: 1 })
      .withMessage('publicIds must be a non-empty array'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: errors.array()[0].msg,
          errors: errors.array()
        });
      }

      const { publicIds } = req.body;

      // Delete multiple images
      const results = await Promise.allSettled(
        publicIds.map(publicId => cloudinary.uploader.destroy(publicId))
      );

      const successfulDeletes = results.filter(r => r.status === 'fulfilled' && r.value.result === 'ok');
      const failedDeletes = results.filter(r => r.status === 'rejected' || r.value.result !== 'ok');

      // Log admin activity
      await db.collection('adminActivities').add({
        adminUid: req.user.uid,
        adminEmail: req.user.email,
        action: 'deleted_multiple_cloudinary_images',
        description: `Deleted ${successfulDeletes.length} images, ${failedDeletes.length} failed`,
        timestamp: new Date(),
        metadata: { 
          publicIds, 
          successCount: successfulDeletes.length,
          failCount: failedDeletes.length
        }
      });

      res.json({
        success: true,
        message: `Deleted ${successfulDeletes.length} images successfully`,
        data: {
          total: publicIds.length,
          successful: successfulDeletes.length,
          failed: failedDeletes.length,
          results
        }
      });
    } catch (error) {
      console.error('Error deleting multiple images:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Failed to delete images from Cloudinary'
      });
    }
  }
);

export default router;
