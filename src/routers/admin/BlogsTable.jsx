import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Loader2, ChevronDown } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast, Toaster } from 'react-hot-toast';
import { deleteBlog, approveBlog } from '@/lib/api';
import { logAdminActivity } from '@/utils/adminActivityLogger';
import { useAuth } from '@/AuthProvider';
import BlogTile from './blogs/BlogTile';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { createFullSlug } from '@/utils/slugUtils';

const BlogsTable = () => {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending' or 'approved'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, blog: null });

  const fetchBlogs = async (status = filterStatus) => {
    try {
      setLoading(true);
      const isApproved = status === 'approved';
      const q = query(
        collection(db, 'blogs'),
        where('isAdminAccepted', '==', isApproved),
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
  }, [filterStatus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleApprove = async (blogId, blogTitle) => {
    try {
      // Use backend API for approval
      await approveBlog(blogId);
      
      // Also update visibility in Firestore (frontend operation)
      const blogRef = doc(db, 'blogs', blogId);
      await updateDoc(blogRef, {
        isAdminAccepted: true,
        visibility: true,
      });
      
      toast.success(`Blog "${blogTitle}" approved successfully!`);
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error('Error approving blog:', error);
      toast.error(error.message || 'Failed to approve blog');
    }
  };

  const handleToggleVisibility = async (blogId, blogTitle, currentVisibility) => {
    try {
      const blogRef = doc(db, 'blogs', blogId);
      const newVisibility = !currentVisibility;
      
      await updateDoc(blogRef, {
        visibility: newVisibility,
      });
      
      // Log activity
      if (firebaseUser) {
        await logAdminActivity(
          firebaseUser.uid,
          firebaseUser.displayName || firebaseUser.email,
          'toggled_blog_visibility',
          `${newVisibility ? 'Showed' : 'Hid'} blog: "${blogTitle}"`,
          { blogId, blogTitle, visibility: newVisibility }
        );
      }
      
      toast.success(`Blog "${blogTitle}" is now ${newVisibility ? 'visible' : 'hidden'}`);
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to toggle visibility');
    }
  };

  const handleDeleteClick = (blog) => {
    setDeleteConfirm({ isOpen: true, blog });
  };

  const handleDelete = async () => {
    const { blog } = deleteConfirm;
    if (!blog) return;

    const blogId = blog.id;
    const blogTitle = blog.title;
    
    setDeleteConfirm({ isOpen: false, blog: null });
    
    const toastId = toast.loading('Deleting blog and images...');
    
    try {
      // Use backend API to delete blog and its images
      // Backend handles Cloudinary deletion securely
      const result = await deleteBlog(blogId);
      
      toast.dismiss(toastId);
      
      if (result.success) {
        const { imagesDeleted, imagesFailed } = result.data;
        
        if (imagesFailed > 0) {
          toast.success(
            `Blog "${blogTitle}" deleted! ${imagesDeleted} image(s) deleted, ${imagesFailed} failed.`,
            { duration: 5000 }
          );
        } else {
          toast.success(`Blog "${blogTitle}" and all images deleted successfully!`);
        }
        
        // Refresh the blog list
        fetchBlogs();
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error('Error deleting blog:', error);
      toast.error(error.message || 'Failed to delete blog', { duration: 5000 });
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

  const handleFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
    setIsDropdownOpen(false);
  };

  const handleViewBlog = (blog) => {
    const slug = createFullSlug(blog.title, blog.id);
    navigate(`/admin/blog/${slug}`);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6 text-poppins">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Blog Review Section</h2>
            <p className="text-gray-600">Review and manage submitted blog posts.</p>
          </div>
          
          {/* Dropdown Filter */}
          <div className="relative dropdown-container">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 bg-white border-2 border-gray-300 hover:border-blue-500 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span className="capitalize">{filterStatus}</span>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </motion.button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
              >
                <button
                  onClick={() => handleFilterChange('pending')}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors cursor-pointer ${
                    filterStatus === 'pending' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange('approved')}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors cursor-pointer ${
                    filterStatus === 'approved' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Approved
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {filterStatus === 'pending' ? 'No blogs pending review' : 'No approved blogs'}
            </p>
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
                  onView={handleViewBlog}
                  onApprove={filterStatus === 'pending' ? (blog) => handleApprove(blog.id, blog.title) : null}
                  onDelete={handleDeleteClick}
                  onToggleVisibility={filterStatus === 'approved' ? (blog) => handleToggleVisibility(blog.id, blog.title, blog.visibility) : null}
                  isPending={filterStatus === 'pending'}
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
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-2xl font-bold text-[#0A1524]">{blogs.length}</div>
            <div className="text-sm text-gray-600 capitalize">{filterStatus} Blogs</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-2xl font-bold text-[#0A1524]">
              {new Set(blogs.map(blog => blog.authorName)).size}
            </div>
            <div className="text-sm text-gray-600">Active Authors</div>
          </div>
          {filterStatus === 'approved' && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="text-2xl font-bold text-[#0A1524]">
                {blogs.filter(blog => blog.visibility !== false).length}
              </div>
              <div className="text-sm text-gray-600">Visible Blogs</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, blog: null })}
        onConfirm={handleDelete}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteConfirm.blog?.title}"? ${deleteConfirm.blog?.images?.length > 0 ? `This will permanently delete ${deleteConfirm.blog.images.length} image(s) from Cloudinary and the blog from the database.` : 'This action cannot be undone.'}`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default BlogsTable;
