import { auth, db } from '../config/firebase.js';

/**
 * Middleware to verify Firebase ID token and authenticate user
 */
export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired authentication token'
    });
  }
};

/**
 * Middleware to optionally verify Firebase ID token
 * Does not return error if token is missing or invalid
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(idToken);
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      };

      // Also get user doc for role
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      if (userDoc.exists) {
        req.userData = userDoc.data();
      }
    }
    next();
  } catch (error) {
    // Silently fail authentication for optional paths
    next();
  }
};

/**
 * Middleware to verify user is an admin
 */
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    // console.log('🔍 Checking admin status for user:', req.user.uid);

    // Get user document from Firestore using Admin SDK (bypasses security rules)
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      console.error('❌ User document not found:', req.user.uid);
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User profile not found'
      });
    }

    const userData = userDoc.data();
    // console.log('✅ User data retrieved:', { uid: req.user.uid, role: userData.role });

    if (userData.role !== 'admin') {
      console.error('❌ User is not admin:', { uid: req.user.uid, role: userData.role });
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    // Attach user data to request
    req.userData = userData;

    console.log('✅ Admin verification successful');
    next();
  } catch (error) {
    console.error('❌ Admin verification error:', error);
    console.error('Error code:', error.code);
    console.error('Error details:', error.details);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to verify admin status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Middleware to verify user is admin or staff (employee/intern)
 */
export const requireStaff = async (req, res, next) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    // Get user document from Firestore
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User profile not found'
      });
    }

    const userData = userDoc.data();
    const allowedRoles = ['admin', 'employee', 'intern'];

    if (!allowedRoles.includes(userData.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Staff access required'
      });
    }

    // Attach user data to request
    req.userData = userData;

    next();
  } catch (error) {
    console.error('Staff verification error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to verify staff status'
    });
  }
};
