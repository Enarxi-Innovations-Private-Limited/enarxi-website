import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Logs admin activities to Firestore
 * @param {string} adminId - The UID of the admin performing the action
 * @param {string} adminName - The name or email of the admin
 * @param {string} action - The action performed (e.g., 'approved_blog', 'rejected_review')
 * @param {string} description - Human-readable description of the action
 * @param {object} metadata - Additional metadata about the action
 */
export const logAdminActivity = async (adminId, adminName, action, description, metadata = {}) => {
  try {
    await addDoc(collection(db, 'adminActivities'), {
      adminId,
      adminName,
      action,
      description,
      metadata,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(), // Fallback for immediate display
    });
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
};
