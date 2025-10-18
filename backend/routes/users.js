import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, db } from '../config/firebase.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   DELETE /api/users/:uid
 * @desc    Delete a user (Admin only)
 * @access  Private (Admin)
 */
router.delete(
  '/:uid',
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      const { uid } = req.params;

      if (!uid) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'User ID is required'
        });
      }

      // Prevent admin from deleting themselves
      if (uid === req.user.uid) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Cannot delete your own account'
        });
      }

      // Delete from Firebase Authentication
      await auth.deleteUser(uid);

      // Delete from Firestore
      await db.collection('users').doc(uid).delete();

      // Log admin activity
      await db.collection('adminActivities').add({
        adminUid: req.user.uid,
        adminEmail: req.user.email,
        action: 'deleted_user',
        description: `Deleted user with UID: ${uid}`,
        timestamp: new Date(),
        metadata: { deletedUserId: uid }
      });

      res.json({
        success: true,
        message: 'User deleted successfully',
        data: { uid }
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Failed to delete user'
      });
    }
  }
);

/**
 * @route   PUT /api/users/:uid/email
 * @desc    Update user email (Admin only)
 * @access  Private (Admin)
 */
router.put(
  '/:uid/email',
  authenticateUser,
  requireAdmin,
  [
    body('email').isEmail().withMessage('Valid email is required'),
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

      const { uid } = req.params;
      const { email } = req.body;

      if (!uid) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'User ID is required'
        });
      }

      // Update email in Firebase Authentication
      await auth.updateUser(uid, { email });

      // Update email in Firestore
      await db.collection('users').doc(uid).update({
        email,
        updatedAt: new Date()
      });

      // Log admin activity
      await db.collection('adminActivities').add({
        adminUid: req.user.uid,
        adminEmail: req.user.email,
        action: 'updated_user_email',
        description: `Updated email for user ${uid} to ${email}`,
        timestamp: new Date(),
        metadata: { userId: uid, newEmail: email }
      });

      res.json({
        success: true,
        message: 'Email updated successfully',
        data: { uid, email }
      });
    } catch (error) {
      console.error('Error updating email:', error);
      
      let message = 'Failed to update email';
      if (error.code === 'auth/email-already-exists') {
        message = 'This email is already in use by another account';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message
      });
    }
  }
);

/**
 * @route   PUT /api/users/:uid/password
 * @desc    Update user password (Admin only)
 * @access  Private (Admin)
 */
router.put(
  '/:uid/password',
  authenticateUser,
  requireAdmin,
  [
    body('password')
      .isLength({ min: 12 })
      .withMessage('Password must be at least 12 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
      .withMessage('Password must contain at least one special character'),
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

      const { uid } = req.params;
      const { password } = req.body;

      if (!uid) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'User ID is required'
        });
      }

      // Update password in Firebase Authentication
      await auth.updateUser(uid, { password });

      // Update timestamp in Firestore
      await db.collection('users').doc(uid).update({
        updatedAt: new Date()
      });

      // Log admin activity (don't log the actual password)
      await db.collection('adminActivities').add({
        adminUid: req.user.uid,
        adminEmail: req.user.email,
        action: 'updated_user_password',
        description: `Updated password for user ${uid}`,
        timestamp: new Date(),
        metadata: { userId: uid }
      });

      res.json({
        success: true,
        message: 'Password updated successfully',
        data: { uid }
      });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to update password'
      });
    }
  }
);

/**
 * @route   PUT /api/users/:uid
 * @desc    Update user profile (Admin only)
 * @access  Private (Admin)
 */
router.put(
  '/:uid',
  authenticateUser,
  requireAdmin,
  [
    body('name').optional().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('role').optional().isIn(['admin', 'employee', 'intern']).withMessage('Invalid role'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
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

      const { uid } = req.params;
      const { name, role, status } = req.body;

      if (!uid) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'User ID is required'
        });
      }

      const updateData = {
        updatedAt: new Date()
      };

      if (name) updateData.name = name;
      if (role) updateData.role = role;
      if (status) updateData.status = status;

      // Update in Firestore
      await db.collection('users').doc(uid).update(updateData);

      // Update display name in Firebase Auth if name is provided
      if (name) {
        await auth.updateUser(uid, { displayName: name });
      }

      // Log admin activity
      await db.collection('adminActivities').add({
        adminUid: req.user.uid,
        adminEmail: req.user.email,
        action: 'updated_user_profile',
        description: `Updated profile for user ${uid}`,
        timestamp: new Date(),
        metadata: { userId: uid, updates: updateData }
      });

      res.json({
        success: true,
        message: 'User profile updated successfully',
        data: { uid, ...updateData }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to update user profile'
      });
    }
  }
);

export default router;
