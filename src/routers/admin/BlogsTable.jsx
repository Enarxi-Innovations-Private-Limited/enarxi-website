import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast, Toaster } from 'react-hot-toast';
import { extractPublicId, deleteFromCloudinary } from '@/utils/uploadToCloudinary';
import { logAdminActivity } from '@/utils/adminActivityLogger';
import { useAuth } from '@/AuthProvider';
import BlogTile from './blogs/BlogTile';
import BlogViewModal from './blogs/BlogViewModal';

const BlogsTable = () => {
  const { firebaseUser } = useAuth();
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
      
      // Log activity
      if (firebaseUser) {
        await logAdminActivity(
          firebaseUser.uid,
          firebaseUser.displayName || firebaseUser.email,
          'approved_blog',
          `Approved blog: "${blogTitle}"`,
          { blogId, blogTitle }
        );
      }
      
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
      
      // Log activity
      if (firebaseUser) {
        await logAdminActivity(
          firebaseUser.uid,
          firebaseUser.displayName || firebaseUser.email,
          'deleted_blog',
          `Deleted blog: "${blogTitle}"`,
          { blogId, blogTitle, imagesDeleted: deletedImagesCount }
        );
      }
      
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
        staggerChildren: 0.08,
      },
    },
  };

  const tileVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
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
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No blogs pending review</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogs.map((blog) => (
              <motion.div key={blog.id} variants={tileVariants}>
                <BlogTile
                  blog={blog}
                  onView={setSelectedBlog}
                  onApprove={(blog) => handleApprove(blog.id, blog.title)}
                  onDelete={(blog) => handleDelete(blog.id, blog.title, blog.images)}
                />
              </motion.div>
            ))}
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
      <BlogViewModal
        blog={selectedBlog}
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        onApprove={handleApprove}
        onDelete={handleDelete}
      />
    </>
  );
};

export default BlogsTable;
