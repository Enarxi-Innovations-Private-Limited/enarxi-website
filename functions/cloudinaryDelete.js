/**
 * Firebase Cloud Function for deleting images from Cloudinary
 * 
 * This function should be deployed as a Firebase Cloud Function
 * to securely delete images from Cloudinary using the Admin API.
 * 
 * Setup:
 * 1. Install dependencies: npm install cloudinary
 * 2. Set environment variables in Firebase:
 *    firebase functions:config:set cloudinary.cloud_name="YOUR_CLOUD_NAME"
 *    firebase functions:config:set cloudinary.api_key="YOUR_API_KEY"
 *    firebase functions:config:set cloudinary.api_secret="YOUR_API_SECRET"
 * 3. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: functions.config().cloudinary.cloud_name,
  api_key: functions.config().cloudinary.api_key,
  api_secret: functions.config().cloudinary.api_secret,
});

/**
 * HTTP Cloud Function to delete image from Cloudinary
 * 
 * Usage from frontend:
 * const response = await fetch('https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/deleteCloudinaryImage', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ publicId: 'enarxi/blogs/image_id' })
 * });
 */
exports.deleteCloudinaryImage = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated and is admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Optional: Check if user is admin (implement your own logic)
  // const isAdmin = context.auth.token.admin === true;
  // if (!isAdmin) {
  //   throw new functions.https.HttpsError('permission-denied', 'Only admins can delete images');
  // }

  const { publicId } = data;

  if (!publicId) {
    throw new functions.https.HttpsError('invalid-argument', 'publicId is required');
  }

  try {
    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true, // Invalidate CDN cache
    });

    console.log('Cloudinary deletion result:', result);

    if (result.result === 'ok' || result.result === 'not found') {
      return { 
        success: true, 
        result: result.result,
        message: `Image ${publicId} deleted successfully` 
      };
    } else {
      throw new Error(`Deletion failed: ${result.result}`);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Alternative: HTTP endpoint version (if you prefer REST API)
 */
exports.deleteCloudinaryImageHTTP = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { publicId } = req.body;

  if (!publicId) {
    res.status(400).json({ error: 'publicId is required' });
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    console.log('Cloudinary deletion result:', result);

    res.status(200).json({
      success: true,
      result: result.result,
      message: `Image ${publicId} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
