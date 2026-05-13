import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { X, Crop, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCroppedImg } from '@/utils/imageCropUtils';

/**
 * CropImageModal Component
 * A responsive modal for cropping images to specified aspect ratio
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {string} props.imageSrc - Source image URL
 * @param {string} props.fileName - Original file name
 * @param {number} props.aspect - Aspect ratio (default: 16/9)
 * @param {Function} props.onCropComplete - Callback with cropped image file
 * @param {Function} props.onCancel - Callback when user cancels
 */
const CropImageModal = ({ isOpen, imageSrc, fileName, aspect = 16/9, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(3);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate minZoom to fit entire image in crop area
  useEffect(() => {
    if (!imageSrc) return;
    const img = new window.Image();
    img.onload = () => {
      const imgW = img.width;
      const imgH = img.height;
      let minZoomCalc = 1;
      if ((imgW / imgH) > aspect) {
        minZoomCalc = (aspect * imgH) / imgW;
      } else {
        minZoomCalc = imgW / (imgH * aspect);
      }
      minZoomCalc = Math.max(minZoomCalc, 1e-6);
      setMinZoom(minZoomCalc);
      setZoom(minZoomCalc);
    };
    img.src = imageSrc;
  }, [imageSrc, aspect]);

  /**
   * Handle crop area change
   */
  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  /**
   * Handle zoom change
   */
  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  /**
   * Handle crop complete
   */
  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    console.log('Crop complete - croppedArea:', croppedArea);
    console.log('Crop complete - croppedAreaPixels:', croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  /**
   * Process and return cropped image
   */
  const handleCropConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);

    try {
      // Get cropped image blob
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );

      // Convert blob to file
      const croppedFile = new File([croppedBlob], fileName, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      // Return cropped file
      onCropComplete(croppedFile);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [croppedAreaPixels, imageSrc, rotation, fileName, onCropComplete]);

  /**
   * Reset rotation
   */
  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  /**
   * Zoom in
   */
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  }, []);

  /**
   * Zoom out
   */
  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 1));
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Crop className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Crop Image to {aspect === 16/9 ? '16:9' : aspect === 4/5 ? '4:5' : 'Custom'}</h2>
                  <p className="text-sm text-gray-500">Adjust the crop area to fit your image</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isProcessing}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Crop Area */}
            <div className="relative flex-1 bg-gray-900 min-h-[400px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                minZoom={minZoom}
                maxZoom={maxZoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropCompleteCallback}
                objectFit="contain"
                showGrid={true}
                cropShape="rect"
                restrictPosition={true}
                style={{
                  containerStyle: {
                    backgroundColor: '#111827',
                  },
                  cropAreaStyle: {
                    border: '2px solid #3b82f6',
                  },
                }}
              />
            </div>

            {/* Controls */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {/* Zoom & Rotation Controls */}
              <div className="flex items-center justify-center space-x-6 mb-4">
                {/* Zoom Out */}
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={zoom <= 1 || isProcessing}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </button>

                {/* Zoom Slider */}
                <div className="flex items-center space-x-3 flex-1 max-w-md">
                  <span className="text-sm text-gray-600 font-medium">Zoom</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isProcessing}
                  />
                  <span className="text-sm text-gray-600 font-medium">{zoom.toFixed(1)}x</span>
                </div>

                {/* Zoom In */}
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={zoom >= 3 || isProcessing}
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>

                {/* Rotate */}
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isProcessing}
                  title="Rotate 90°"
                >
                  <RotateCw className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Crop className="w-4 h-4" />
                      <span>Crop & Continue</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Help Text */}
            <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
              <p className="text-sm text-blue-800 text-center">
                💡 <strong>Tip:</strong> Drag to move the crop area, use the slider to zoom, and click rotate to adjust orientation
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CropImageModal;
