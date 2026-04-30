import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useMediaStaging Hook
 * Manages staged files for image blocks before final upload to Cloudinary
 * 
 * Features:
 * - Stores files locally with preview URLs
 * - Tracks which blocks have staged vs uploaded images
 * - Handles cleanup of object URLs
 * - Orchestrates batch upload on submission
 */
export const useMediaStaging = () => {
  // Map of blockId -> array of staged items
  // Each item: { id, file, previewUrl, status: 'staged' | 'uploading' | 'uploaded' | 'error', url?, publicId?, error? }
  const [stagedBlocks, setStagedBlocks] = useState({});
  
  // Track object URLs for cleanup
  const objectUrlsRef = useRef(new Set());

  /**
   * Add staged files for a block
   */
  const stageFiles = useCallback((blockId, files) => {
    const stagedItems = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      objectUrlsRef.current.add(previewUrl);
      
      return {
        id: `${blockId}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl,
        status: 'staged',
        // Store file metadata for display
        width: null,
        height: null,
        format: file.type.split('/')[1] || 'unknown',
      };
    });

    setStagedBlocks((prev) => ({
      ...prev,
      [blockId]: stagedItems,
    }));

    return stagedItems;
  }, []);

  /**
   * Update staged files for a block (reorder or modify)
   */
  const updateStagedFiles = useCallback((blockId, updatedItems) => {
    setStagedBlocks((prev) => ({
      ...prev,
      [blockId]: updatedItems,
    }));
  }, []);

  /**
   * Remove a specific staged file from a block
   */
  const removeStagedFile = useCallback((blockId, fileId) => {
    setStagedBlocks((prev) => {
      const blockFiles = prev[blockId] || [];
      const fileToRemove = blockFiles.find((f) => f.id === fileId);
      
      // Cleanup object URL
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
        objectUrlsRef.current.delete(fileToRemove.previewUrl);
      }

      const updatedFiles = blockFiles.filter((f) => f.id !== fileId);
      
      if (updatedFiles.length === 0) {
        const { [blockId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [blockId]: updatedFiles,
      };
    });
  }, []);

  /**
   * Remove entire block from staging
   */
  const removeStagedBlock = useCallback((blockId) => {
    setStagedBlocks((prev) => {
      const blockFiles = prev[blockId] || [];
      
      // Cleanup all object URLs for this block
      blockFiles.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
          objectUrlsRef.current.delete(file.previewUrl);
        }
      });

      const { [blockId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  /**
   * Get staged files for a specific block
   */
  const getStagedBlock = useCallback((blockId) => {
    return stagedBlocks[blockId] || [];
  }, [stagedBlocks]);

  /**
   * Upload all staged files to Cloudinary
   * Returns a map of blockId -> uploaded images array
   */
  const flushUploads = useCallback(async (uploadFn, onProgress, activeBlocks = null) => {
    const blocksToProcess = activeBlocks || stagedBlocks;
    const blockIds = Object.keys(blocksToProcess);
    
    if (blockIds.length === 0) {
      return {};
    }

    const uploadedBlocks = {};
    let totalFiles = 0;
    let uploadedCount = 0;

    // Count total files
    blockIds.forEach((blockId) => {
      totalFiles += blocksToProcess[blockId].length;
    });

    // Upload files block by block
    for (const blockId of blockIds) {
      const files = blocksToProcess[blockId];
      const uploadedImages = [];

      for (const stagedItem of files) {
        try {
          // Update status to uploading
          setStagedBlocks((prev) => ({
            ...prev,
            [blockId]: prev[blockId].map((item) =>
              item.id === stagedItem.id ? { ...item, status: 'uploading' } : item
            ),
          }));

          // Call progress callback
          if (onProgress) {
            onProgress({
              current: uploadedCount + 1,
              total: totalFiles,
              blockId,
              fileName: stagedItem.file.name,
            });
          }

          // Upload to Cloudinary
          const result = await uploadFn(stagedItem.file);

          uploadedImages.push({
            url: result.url,
            publicId: result.publicId,
            format: result.format,
            width: result.width,
            height: result.height,
          });

          // Update status to uploaded
          setStagedBlocks((prev) => ({
            ...prev,
            [blockId]: prev[blockId].map((item) =>
              item.id === stagedItem.id
                ? { ...item, status: 'uploaded', url: result.url, publicId: result.publicId }
                : item
            ),
          }));

          uploadedCount++;
        } catch (error) {
          console.error(`Failed to upload ${stagedItem.file.name}:`, error);
          
          // Update status to error
          setStagedBlocks((prev) => ({
            ...prev,
            [blockId]: prev[blockId].map((item) =>
              item.id === stagedItem.id
                ? { ...item, status: 'error', error: error.message }
                : item
            ),
          }));

          throw new Error(`Failed to upload "${stagedItem.file.name}": ${error.message}`);
        }
      }

      uploadedBlocks[blockId] = uploadedImages;
    }

    return uploadedBlocks;
  }, [stagedBlocks]);

  /**
   * Clear all staged data and cleanup object URLs
   */
  const clearAll = useCallback(() => {
    // Cleanup all object URLs
    objectUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    objectUrlsRef.current.clear();

    setStagedBlocks({});
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      objectUrlsRef.current.clear();
    };
  }, []);

  return {
    stagedBlocks,
    stageFiles,
    updateStagedFiles,
    removeStagedFile,
    removeStagedBlock,
    getStagedFiles: getStagedBlock, // Renamed for clarity
    getStagedBlock, // Alias for backward compatibility
    flushUploads,
    clearAll,
  };
};
