/**
 * Image Crop Utilities
 * Helper functions for image validation and cropping
 */

/**
 * Check if image has 16:9 aspect ratio (with tolerance)
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} tolerance - Tolerance percentage (default 2%)
 * @returns {boolean} - True if aspect ratio is 16:9
 */
export function isAspectRatio16x9(width, height, tolerance = 0.02) {
  const targetRatio = 16 / 9;
  const actualRatio = width / height;
  const difference = Math.abs(actualRatio - targetRatio);
  const allowedDifference = targetRatio * tolerance;
  
  return difference <= allowedDifference;
}

/**
 * Get image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Create cropped image from canvas
 * @param {string} imageSrc - Source image URL
 * @param {Object} pixelCrop - Crop area in pixels {x, y, width, height}
 * @param {number} rotation - Rotation angle in degrees
 * @returns {Promise<Blob>} - Cropped image blob
 */
export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Calculate bounding box of the rotated image
  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  // Create data for the cropped image
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // Set canvas width to final desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // Return as blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Create image element from source
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>} - Image element
 */
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} - Radians
 */
function getRadianAngle(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate rotated size
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @param {number} rotation - Rotation angle in degrees
 * @returns {{width: number, height: number}} - Rotated dimensions
 */
function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Convert blob to file
 * @param {Blob} blob - Image blob
 * @param {string} fileName - File name
 * @returns {File} - File object
 */
export function blobToFile(blob, fileName) {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
}

/**
 * Validate image file
 * @param {File} file - Image file
 * @returns {{valid: boolean, error?: string}} - Validation result
 */
export function validateImageFile(file) {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 10MB' };
  }

  return { valid: true };
}
