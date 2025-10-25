import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Loader2, Eye, EyeOff, CheckCircle, Trash2 } from 'lucide-react';
import { injectYouTubePlayers } from '@/utils/injectYouTubePlayers';
import { toast, Toaster } from 'react-hot-toast';
import { deleteBlog, approveBlog } from '@/lib/api';
import { useAuth } from '@/AuthProvider';
import ConfirmModal from '@/components/shared/ConfirmModal';

const AdminBlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        
        // Extract blog ID from slug (last part after last hyphen)
        const blogId = slug.split('-').pop();
        
        const blogRef = doc(db, 'blogs', blogId);
        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) {
          setError('Blog not found');
          setLoading(false);
          return;
        }

        const data = blogSnap.data();

        // Handle image URL
        let imageUrl = '/blogs/default.jpg';
        if (data.images && data.images.length > 0) {
          const firstImage = data.images[0];
          if (typeof firstImage === 'object' && firstImage.url) {
            imageUrl = firstImage.url;
          } else if (typeof firstImage === 'string' && firstImage.includes('cloudinary')) {
            imageUrl = firstImage;
          } else if (typeof firstImage === 'string') {
            imageUrl = `/blogs/${firstImage}`;
          }
        }

        setBlog({
          id: blogSnap.id,
          title: data.title || 'Untitled Blog',
          content: data.content || '',
          createdAt: data.createdAt?.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) || '',
          updatedAt: data.updatedAt?.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) || '',
          img: imageUrl,
          images: data.images || [],
          authorName: data.authorName || 'Anonymous',
          authorRole: data.authorRole || 'Staff',
          ytlinks: data.ytlinks || [],
          isAdminAccepted: data.isAdminAccepted || false,
          visibility: data.visibility !== false,
          status: data.status || 'pending',
        });
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleApprove = async () => {
    try {
      await approveBlog(blog.id);
      
      const blogRef = doc(db, 'blogs', blog.id);
      await updateDoc(blogRef, {
        isAdminAccepted: true,
        visibility: true,
      });
      
      toast.success(`Blog "${blog.title}" approved successfully!`);
      setBlog(prev => ({ ...prev, isAdminAccepted: true, visibility: true, status: 'approved' }));
    } catch (error) {
      console.error('Error approving blog:', error);
      toast.error(error.message || 'Failed to approve blog');
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const blogRef = doc(db, 'blogs', blog.id);
      const newVisibility = !blog.visibility;
      
      await updateDoc(blogRef, {
        visibility: newVisibility,
      });
      
      toast.success(`Blog is now ${newVisibility ? 'visible' : 'hidden'}`);
      setBlog(prev => ({ ...prev, visibility: newVisibility }));
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to toggle visibility');
    }
  };

  const handleDelete = async () => {
    setDeleteConfirm(false);
    const toastId = toast.loading('Deleting blog and images...');
    
    try {
      const result = await deleteBlog(blog.id);
      
      toast.dismiss(toastId);
      
      if (result.success) {
        toast.success(`Blog "${blog.title}" deleted successfully!`);
        setTimeout(() => navigate('/admin'), 1500);
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error('Error deleting blog:', error);
      toast.error(error.message || 'Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{error || 'Blog not found'}</h1>
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Admin Portal
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Actions */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Back to Admin Portal
            </motion.button>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {!blog.isAdminAccepted && (
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
              )}
              {blog.isAdminAccepted && (
                <button
                  onClick={handleToggleVisibility}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                    blog.visibility
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {blog.visibility ? <EyeOff size={18} /> : <Eye size={18} />}
                  {blog.visibility ? 'Hide' : 'Show'}
                </button>
              )}
              <button
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              blog.isAdminAccepted
                ? blog.visibility
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {blog.isAdminAccepted
                ? blog.visibility
                  ? '✓ Approved & Visible'
                  : '✓ Approved (Hidden)'
                : '⏳ Pending Review'}
            </span>
          </div>

          {/* Blog Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Featured Image */}
            <div className="w-full aspect-video overflow-hidden bg-gray-100">
              <img
                src={blog.img}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/blogs/default.jpg';
                }}
              />
            </div>

            {/* Blog Header */}
            <div className="p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-oswald">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span className="font-medium">{blog.authorName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{blog.authorRole}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>Created: {blog.createdAt}</span>
                </div>
                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Updated: {blog.updatedAt}</span>
                  </div>
                )}
              </div>

              {/* Blog Content with Embedded YouTube Videos */}
              <div
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: injectYouTubePlayers(blog.content, blog.ytlinks) }}
              />

              {/* YouTube Links Info (for admin reference) */}
              {blog.ytlinks && blog.ytlinks.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">YouTube Videos in Content ({blog.ytlinks.length})</h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {blog.ytlinks.map((url, index) => (
                      <li key={index}>
                        <span className="font-mono">yt{index}</span>: {url}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Images */}
              {blog.images && blog.images.length > 1 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Images ({blog.images.length - 1})</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {blog.images.slice(1).map((imgData, idx) => {
                      const imgUrl = typeof imgData === 'object' ? imgData.url : imgData;
                      return (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt={`${blog.title} - ${idx + 2}`}
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.article>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Blog"
        message={`Are you sure you want to delete "${blog?.title}"? ${blog?.images?.length > 0 ? `This will permanently delete ${blog.images.length} image(s) from Cloudinary and the blog from the database.` : 'This action cannot be undone.'}`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default AdminBlogDetail;
