import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Loader2, Eye, EyeOff, CheckCircle, Trash2, RefreshCw } from 'lucide-react'; // ← added RefreshCw
import { injectYouTubePlayers } from '@/utils/injectYouTubePlayers';
import { toast, Toaster } from 'react-hot-toast';
import { deleteBlog, approveBlog, retryBlog } from '@/lib/api'; // ← added retryBlog
import { useAuth } from '@/AuthProvider';
import ConfirmModal from '@/components/shared/ConfirmModal';

// ── Retry feedback modal ──────────────────────────────────────────────────────
const RetryModal = ({ isOpen, onClose, onConfirm }) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!feedback.trim()) return;
    onConfirm(feedback.trim());
    setFeedback('');
  };

  const handleClose = () => {
    setFeedback('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <RefreshCw size={18} className="text-orange-500" />
          Request Revision
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          The blog will be sent back to the staff member with your feedback.
        </p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Describe what needs to be changed..."
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!feedback.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Send for Revision
          </button>
        </div>
      </motion.div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const AdminBlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [retryModal, setRetryModal] = useState(false); // ← new

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blogId = slug.split('-').pop();
        const blogRef = doc(db, 'blogs', blogId);
        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) {
          setError('Blog not found');
          setLoading(false);
          return;
        }

        const data = blogSnap.data();

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
            year: 'numeric', month: 'long', day: 'numeric'
          }) || '',
          updatedAt: data.updatedAt?.toDate().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
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
      await updateDoc(blogRef, { isAdminAccepted: true, visibility: true });
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
      await updateDoc(blogRef, { visibility: newVisibility });
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

  // ── NEW: retry handler ──────────────────────────────────────────────────────
  const handleRetry = async (feedback) => {
    setRetryModal(false);
    const toastId = toast.loading('Sending blog back for revision...');
    try {
      await retryBlog(blog.id, feedback); // hits PUT /api/blogs/:blogId/retry
      toast.dismiss(toastId);
      toast.success(`Blog sent back to ${blog.authorName} for revision.`);
      setBlog(prev => ({ ...prev, status: 'retry' }));
    } catch (error) {
      toast.dismiss(toastId);
      console.error('Error sending retry:', error);
      toast.error(error.message || 'Failed to request revision');
    }
  };
  // ───────────────────────────────────────────────────────────────────────────

  // ── Status badge helper ────────────────────────────────────────────────────
  const statusBadge = () => {
    if (blog.status === 'retry') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
          <RefreshCw size={13} /> Sent for Revision
        </span>
      );
    }
    if (blog.isAdminAccepted) {
      return blog.visibility
        ? <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">✓ Approved & Visible</span>
        : <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">✓ Approved (Hidden)</span>;
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        ⏳ Pending Review
      </span>
    );
  };
  // ───────────────────────────────────────────────────────────────────────────

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

      {/* Retry feedback modal */}
      <RetryModal
        isOpen={retryModal}
        onClose={() => setRetryModal(false)}
        onConfirm={handleRetry}
      />

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
              {/* Approve — only when pending */}
              {blog.status === 'pending' && (
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
              )}

              {/* Retry — only when pending (can't retry already-approved blogs) */}
              {blog.status === 'pending' && (
                <button
                  onClick={() => setRetryModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  <RefreshCw size={18} />
                  Request Revision
                </button>
              )}

              {/* Visibility toggle — only when approved */}
              {blog.isAdminAccepted && (
                <button
                  onClick={handleToggleVisibility}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${blog.visibility
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {blog.visibility ? <EyeOff size={18} /> : <Eye size={18} />}
                  {blog.visibility ? 'Hide' : 'Show'}
                </button>
              )}

              {/* Delete — always available */}
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
          <div className="mb-6">{statusBadge()}</div>

          {/* Blog Content — unchanged below */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="w-full aspect-video overflow-hidden bg-gray-100">
              <img
                src={blog.img}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/blogs/default.jpg'; }}
              />
            </div>

            <div className="p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-oswald">
                {blog.title}
              </h1>

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

              <div
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: injectYouTubePlayers(blog.content, blog.ytlinks) }}
              />

              {blog.ytlinks && blog.ytlinks.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">
                    YouTube Videos in Content ({blog.ytlinks.length})
                  </h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {blog.ytlinks.map((url, index) => (
                      <li key={index}>
                        <span className="font-mono">yt{index}</span>: {url}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {blog.images && blog.images.length > 1 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Additional Images ({blog.images.length - 1})
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {blog.images.slice(1).map((imgData, idx) => {
                      const imgUrl = typeof imgData === 'object' ? imgData.url : imgData;
                      return (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt={`${blog.title} - ${idx + 2}`}
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                          onError={(e) => { e.target.style.display = 'none'; }}
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