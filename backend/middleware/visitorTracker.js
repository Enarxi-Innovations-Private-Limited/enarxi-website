import { db } from '../config/firebase.js';
import admin from 'firebase-admin';

/**
 * Middleware to track unique visitors per session
 */
export const trackVisitor = async (req, res, next) => {
  try {
    // Only track if not already counted in this session
    if (req.session && !req.session.isVisitorCounted) {
      
      // Skip if user is logged in (admin/staff)
      // Note: optionalAuthenticate must run before this to set req.user/req.userData
      const isStaff = req.userData && ['admin', 'employee', 'intern'].includes(req.userData.role);
      
      if (!req.user && !isStaff) {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        const totalRef = db.collection('stats').doc('visitors');
        const dailyRef = db.collection('stats').doc('daily').collection('records').doc(today);

        // Batch update for efficiency and atomicity
        const batch = db.batch();

        // Increment total visitors
        batch.set(totalRef, { 
          total: admin.firestore.FieldValue.increment(1) 
        }, { merge: true });

        // Increment daily count
        batch.set(dailyRef, { 
          count: admin.firestore.FieldValue.increment(1),
          date: today
        }, { merge: true });

        await batch.commit();

        // Mark as counted in session
        req.session.isVisitorCounted = true;
        // console.log(`📊 New visitor tracked: ${today}`);
      } else if (isStaff) {
        // If staff, mark as counted so we don't keep checking their role every request
        req.session.isVisitorCounted = true;
      }
    }
  } catch (error) {
    console.error('❌ Error tracking visitor:', error);
    // Don't block the request if tracking fails
  }
  next();
};
