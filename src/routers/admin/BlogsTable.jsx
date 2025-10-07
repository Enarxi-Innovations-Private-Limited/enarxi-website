import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trash2, FileText, Calendar, Eye, X } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast, Toaster } from 'react-hot-toast';
import { extractPublicId, deleteFromCloudinary } from '@/utils/uploadToCloudinary';

const BlogsTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'blogs'),
        where('isAdminAccepted', '==', false),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const blogData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setBlogs(blogData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      
      // Check if it's an index error
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        toast.error(
          'Database index required. Please create the composite index in Firebase Console.',
          { duration: 6000 }
        );
        console.error('Index URL:', error.message);
      } else {
        toast.error('Failed to load blogs. Please try again.');
      }
      
      // Set empty array so UI doesn't break
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleApprove = async (blogId, blogTitle) => {
    try {
      const blogRef = doc(db, 'blogs', blogId);
      await updateDoc(blogRef, {
        isAdminAccepted: true,
      });
      toast.success(`Blog "${blogTitle}" approved successfully!`);
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error('Error approving blog:', error);
      toast.error('Failed to approve blog');
    }
  };

  const handleDelete = async (blogId, blogTitle, blogImages = []) => {
    const imageCount = blogImages?.length || 0;
    const confirmMessage = imageCount > 0 
      ? `Are you sure you want to delete "${blogTitle}"? This will permanently delete ${imageCount} image(s) from Cloudinary and the blog from the database.`
      : `Are you sure you want to delete "${blogTitle}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    const toastId = toast.loading('Starting deletion process...');
    
    try {
      let deletedImagesCount = 0;
      let failedImagesCount = 0;
      const failedImages = [];
      
      // Step 1: Delete images from Cloudinary FIRST
      if (blogImages && blogImages.length > 0) {
        toast.loading(`Deleting ${blogImages.length} image(s) from Cloudinary...`, { id: toastId });
        
        for (let i = 0; i < blogImages.length; i++) {
          const imageData = blogImages[i];
          
          try {
            // Get public_id from stored data or extract from URL
            const publicId = imageData.publicId || extractPublicId(imageData.url || imageData);
            
            if (!publicId) {
              failedImagesCount++;
              failedImages.push({ imageData, reason: 'Could not extract public_id' });
              console.warn('⚠️ Could not extract public_id from:', imageData);
              continue;
            }
            
            toast.loading(`Deleting image ${i + 1}/${blogImages.length} from Cloudinary...`, { id: toastId });
            
            // Delete from Cloudinary using signed request
            const result = await deleteFromCloudinary(publicId);
            
            if (result.success) {
              deletedImagesCount++;
              console.log(`✅ Deleted image from Cloudinary: ${publicId}`);
            } else {
              failedImagesCount++;
              failedImages.push({ publicId, reason: result.message || 'Unknown error' });
              console.warn(`⚠️ Failed to delete image: ${publicId}`, result);
            }
          } catch (imgError) {
            failedImagesCount++;
            failedImages.push({ imageData, reason: imgError.message });
            console.error('❌ Error deleting image from Cloudinary:', imgError);
          }
        }
        
        // Check if all images were deleted successfully
        if (failedImagesCount > 0 && deletedImagesCount === 0) {
          // All images failed to delete - abort Firestore deletion
          toast.dismiss(toastId);
          toast.error(
            `❌ Failed to delete ${failedImagesCount} image(s) from Cloudinary. Blog was NOT deleted from database to maintain data integrity.`,
            { duration: 6000 }
          );
          console.error('Failed images:', failedImages);
          return; // Exit without deleting from Firestore
        }
        
        if (failedImagesCount > 0) {
          // Some images failed - warn but continue
          console.warn(`⚠️ ${failedImagesCount} image(s) failed to delete from Cloudinary:`, failedImages);
        }
      }
      
      // Step 2: Delete blog document from Firestore (only if Cloudinary deletion succeeded or no images)
      toast.loading('Deleting blog from database...', { id: toastId });
      await deleteDoc(doc(db, 'blogs', blogId));
      console.log(`✅ Deleted blog from Firestore: ${blogId}`);
      
      // Step 3: Show success message based on results
      toast.dismiss(toastId);
      
      if (imageCount > 0) {
        if (failedImagesCount === 0) {
          // Perfect success - all images and blog deleted
          toast.success(
            `✅ Blog "${blogTitle}" and ${deletedImagesCount} image(s) deleted successfully from Cloudinary and database!`,
            { duration: 4000 }
          );
        } else if (deletedImagesCount > 0) {
          // Partial success - some images deleted
          toast.success(
            `✅ Blog deleted! ${deletedImagesCount} image(s) deleted from Cloudinary, ${failedImagesCount} failed. Check console for details.`,
            { duration: 5000 }
          );
        } else {
          // This shouldn't happen due to early return, but just in case
          toast.warning(
            `⚠️ Blog deleted from database, but ${failedImagesCount} image(s) could not be deleted from Cloudinary. Manual cleanup may be required.`,
            { duration: 6000 }
          );
        }
      } else {
        // No images to delete
        toast.success(`✅ Blog "${blogTitle}" deleted successfully!`, { duration: 3000 });
      }
      
      // Refresh the blog list
      fetchBlogs();
    } catch (error) {
      console.error('Error during blog deletion:', error);
      toast.dismiss(toastId);
      toast.error(
        `❌ Failed to delete blog: ${error.message}. Please try again or contact support.`,
        { duration: 5000 }
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Blog Review Section</h2>
            <p className="text-gray-600">Review and manage submitted blog posts.</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {blogs.length} blogs pending review
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No blogs pending review</p>
          </div>
        ) : (
          <motion.div
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Written By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  className="bg-white divide-y divide-gray-200"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {blogs.map((blog) => (
                    <motion.tr
                      key={blog.id}
                      variants={rowVariants}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                          <div className="max-w-md">
                            <div className="text-sm font-medium text-[#0A1524] line-clamp-2 mb-1">
                              {blog.title || 'Untitled Blog'}
                            </div>
                            <motion.button
                              onClick={() => setSelectedBlog(blog)}
                              whileHover={{ scale: 1.05 }}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Blog
                            </motion.button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#0A1524]">
                          {blog.authorName || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {blog.updatedAt?.toDate().toLocaleDateString() || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleApprove(blog.id, blog.title)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accept
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(blog.id, blog.title, blog.images)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Blog Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-2xl font-bold text-[#0A1524]">{blogs.length}</div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-2xl font-bold text-[#0A1524]">
              {new Set(blogs.map(blog => blog.authorName)).size}
            </div>
            <div className="text-sm text-gray-600">Active Authors</div>
          </div>
        </motion.div>
      </div>

      {/* Blog View Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-3 right-3 text-white bg-black/75 hover:bg-black p-2 cursor-pointer rounded-full z-10 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Image */}
              {selectedBlog.images && selectedBlog.images.length > 0 && (
                <div className="w-full flex justify-center items-center bg-gray-100 p-4 flex-shrink-0">
                  <img
                    src={selectedBlog.images[0].url || selectedBlog.images[0]}
                    alt={selectedBlog.title}
                    className="w-full max-h-[35vh] object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = '/blogs/default.jpg';
                    }}
                  />
                </div>
              )}

              {/* Scrollable content */}
              <div className="p-6 overflow-y-auto flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedBlog.title || 'Untitled Blog'}
                </h2>
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <span>By {selectedBlog.authorName}</span>
                  <span>•</span>
                  <span>{selectedBlog.updatedAt?.toDate().toLocaleDateString()}</span>
                </div>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content || '<p>No content available</p>' }}
                />
              </div>

              {/* Action buttons */}
              <div className="border-t border-gray-200 p-4 flex justify-end space-x-3 bg-gray-50">
                <motion.button
                  onClick={() => {
                    handleApprove(selectedBlog.id, selectedBlog.title);
                    setSelectedBlog(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Blog
                </motion.button>
                <motion.button
                  onClick={() => {
                    handleDelete(selectedBlog.id, selectedBlog.title, selectedBlog.images);
                    setSelectedBlog(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Blog
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogsTable;
