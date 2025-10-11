/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} uploadPreset - Optional upload preset (defaults to VITE_CLOUDINARY_UPLOAD_PRESET)
 * @returns {Promise<Object>} - Object with url and publicId
 */
export async function uploadToCloudinary(file, uploadPreset = null) {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = uploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
  console.log('Using upload preset:', UPLOAD_PRESET)

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const data = await res.json();
    
    // Return both URL and public_id for deletion later
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Generate SHA-1 hash for Cloudinary signature
 * Cloudinary requires SHA-1, not SHA-256!
 * @param {string} message - String to hash
 * @returns {Promise<string>} - Hex string of hash
 */
async function generateSHA1(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Delete image from Cloudinary using signed request
 * @param {string} publicId - Cloudinary public_id of the image
 * @returns {Promise<Object>} - Deletion result
 */
export async function deleteFromCloudinary(publicId) {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;
  
  // Debug logging to help identify the issue
  console.log('🔍 Cloudinary Delete - Environment Check:');
  console.log('  CLOUD_NAME:', CLOUD_NAME ? `✅ Set (${CLOUD_NAME})` : '❌ Missing');
  console.log('  API_KEY:', API_KEY ? `✅ Set (${API_KEY.substring(0, 4)}...)` : '❌ Missing');
  console.log('  API_SECRET:', API_SECRET ? `✅ Set (${API_SECRET.substring(0, 4)}...)` : '❌ Missing');
  
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    const missing = [];
    if (!CLOUD_NAME) missing.push('VITE_CLOUDINARY_CLOUD_NAME');
    if (!API_KEY) missing.push('VITE_CLOUDINARY_API_KEY');
    if (!API_SECRET) missing.push('VITE_CLOUDINARY_API_SECRET');
    
    throw new Error(
      `Cloudinary credentials missing: ${missing.join(', ')}. ` +
      `Please check your .env file has real values (not placeholders like "your_cloud_name") and restart your dev server.`
    );
  }

  if (!publicId) {
    throw new Error('Public ID is required for deletion');
  }

  try {
    // Generate timestamp (in seconds)
    const timestamp = Math.round(Date.now() / 1000);
    
    // Create signature string: public_id=<public_id>&timestamp=<timestamp><api_secret>
    // IMPORTANT: No '&' before API_SECRET!
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
    
    console.log('🔍 Deleting image:', publicId);
    console.log('🔍 Timestamp:', timestamp);
    console.log('🔍 String to sign:', `public_id=${publicId}&timestamp=${timestamp}`);
    
    // Generate SHA-1 signature (Cloudinary requires SHA-1, not SHA-256!)
    const signature = await generateSHA1(signatureString);
    console.log('🔍 Generated signature:', signature);
    
    // Prepare form data
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', API_KEY);
    formData.append('signature', signature);
    
    // Make delete request
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || `Failed to delete image: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Check if deletion was successful
    if (data.result === 'ok') {
      return { success: true, result: data.result, message: 'Image deleted successfully' };
    } else if (data.result === 'not found') {
      return { success: true, result: data.result, message: 'Image not found (may have been already deleted)' };
    } else {
      throw new Error(`Unexpected result: ${data.result}`);
    }
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
}

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export function extractPublicId(url) {
  if (!url) return null;
  
  try {
    // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/enarxi/blogs/image_id.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload/v{version}/'
    const pathParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version
    const publicIdWithExt = pathParts.join('/');
    
    // Remove file extension
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}
