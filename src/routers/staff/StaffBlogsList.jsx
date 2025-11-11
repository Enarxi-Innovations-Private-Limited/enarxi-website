import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Loader2, ChevronDown, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast, Toaster } from 'react-hot-toast';
import { deleteBlog } from '@/lib/api';
import { useAuth } from '@/AuthProvider';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { createFullSlug } from '@/utils/slugUtils';

const StaffBlogsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending', 'approved', or 'rejected'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, blog: null });

  const fetchBlogs = async (status = filterStatus) => {
    try {
      setLoading(true);
      
      if (!user) {
        setBlogs([]);
        setLoading(false);
        return;
      }

      // Query blogs by current user only (no status filter to avoid index issues)
      const q = query(
        collection(db, 'blogs'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      let blogData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      
      // Filter blogs based on status (with fallback for old blogs)
      blogData = blogData.filter((blog) => {
        // If blog has status field, use it
        if (blog.status) {
          return blog.status === status;
        }
        
        // Fallback for old blogs without status field
        if (status === 'pending') {
          return blog.isAdminAccepted === false;
        } else if (status === 'approved') {
          return blog.isAdminAccepted === true;
        } else if (status === 'rejected') {
          return false; // Old blogs can't be rejected
        }
        return false;
      });
      
      setBlogs(blogData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      
      // Check if it's an index error
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        toast.error(
          'Database index required. Please contact admin.',
          { duration: 6000 }
        );
        console.error('Index URL:', error.message);
      } else {
        toast.error('Failed to load blogs. Please try again.');
      }
      
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [filterStatus, user]);

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

  const handleEdit = (blog) => {
    navigate(`/staff/blog/edit/${blog.id}`);
  };

  const handleViewBlog = (blog) => {
    const slug = createFullSlug(blog.title, blog.id);
    navigate(`/staff/blog/${slug}`);
  };

  const handleFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
    setIsDropdownOpen(false);
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'All';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return timestamp.toDate().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
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
      <div className="space-y-6 text-poppins">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1524] mb-2">My Blogs</h2>
            <p className="text-gray-600">View and manage your submitted blog posts.</p>
          </div>
          
          {/* Dropdown Filter */}
          <div className="relative dropdown-container">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 bg-white border-2 border-gray-300 hover:border-blue-500 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span>{getStatusLabel(filterStatus)}</span>
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
                <button
                  onClick={() => handleFilterChange('rejected')}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors cursor-pointer ${
                    filterStatus === 'rejected' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Rejected
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
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {filterStatus === 'pending' ? 'No pending blogs' : 
               filterStatus === 'approved' ? 'No approved blogs' : 
               'No rejected blogs'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {filterStatus === 'pending' && 'Submit a new blog to get started'}
              {filterStatus === 'approved' && 'Your approved blogs will appear here'}
              {filterStatus === 'rejected' && 'Rejected blogs can be edited and resubmitted'}
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogs.map((blog) => {
              const thumbnailUrl = blog.images?.[0]?.url || blog.images?.[0] || null;
              const isVisible = blog.visibility !== false;
              const opacity = filterStatus === 'approved' && !isVisible ? 'opacity-60' : 'opacity-100';

              return (
                <motion.div
                  key={blog.id}
                  variants={tileVariants}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
                  className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer ${opacity}`}
                  onClick={() => handleViewBlog(blog)}
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`absolute top-2 left-2 ${
                      filterStatus === 'pending' ? 'bg-blue-600' : 
                      filterStatus === 'rejected' ? 'bg-red-600' : 
                      isVisible ? 'bg-green-600' : 'bg-gray-600'
                    } bg-opacity-90 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1`}>
                      {filterStatus === 'pending' && <span>⏳ Pending Review</span>}
                      {filterStatus === 'rejected' && <span>❌ Rejected</span>}
                      {filterStatus === 'approved' && isVisible && (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Published</span>
                        </>
                      )}
                      {filterStatus === 'approved' && !isVisible && (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-[#0A1524] mb-2 line-clamp-2 min-h-14">
                      {blog.title || 'Untitled Blog'}
                    </h3>
                    
                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span>Updated: {formatDate(blog.updatedAt)}</span>
                    </div>

                    {/* Action Buttons */}
                    {filterStatus === 'rejected' ? (
                      <div className="flex items-center space-x-2 mt-auto">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(blog);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(blog);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </motion.button>
                      </div>
                    ) : (
                      <div className="mt-auto">
                        <p className="text-xs text-gray-500 italic">
                          {filterStatus === 'pending' && 'Waiting for admin approval'}
                          {filterStatus === 'approved' && isVisible && 'Live on website'}
                          {filterStatus === 'approved' && !isVisible && 'Hidden by admin'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Blog Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-2xl font-bold text-[#0A1524]">{blogs.length}</div>
            <div className="text-sm text-gray-600">{getStatusLabel(filterStatus)} Blogs</div>
          </div>
          {filterStatus === 'approved' && (
            <>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <div className="text-2xl font-bold text-green-600">
                  {blogs.filter(b => b.visibility !== false).length}
                </div>
                <div className="text-sm text-gray-600">Published</div>
              </div>
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <div className="text-2xl font-bold text-gray-600">
                  {blogs.filter(b => b.visibility === false).length}
                </div>
                <div className="text-sm text-gray-600">Hidden</div>
              </div>
            </>
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

export default StaffBlogsList;
