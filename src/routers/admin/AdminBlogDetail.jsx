import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Loader2, Eye, EyeOff, CheckCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { deleteBlog, approveBlog } from '@/lib/api';
import { useAuth } from '@/AuthProvider';
import ConfirmModal from '@/components/shared/ConfirmModal';
import parse from 'html-react-parser';

// Helper function to extract YouTube video ID
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*$/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

// ImageBlock Carousel Component
const ImageBlockCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="text-red-500 text-center py-4">No images available</div>;
  }

  // Helper function to get the image URL
  const getImageUrl = (img) => {
    if (!img) return '';
    // If it's already a URL, return it
    if (typeof img === 'string') return img;
    // If it's an object with a url property
    if (img.url) return img.url;
    // If it's an object with a publicId (Cloudinary)
    if (img.publicId) return `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${img.publicId}`;
    return '';
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const currentImage = images[currentIndex];
  const imageUrl = getImageUrl(currentImage);
  const altText = currentImage?.publicId || `Image ${currentIndex + 1}`;

  return (
    <div className="relative w-full my-8">
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = '/blogs/default.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
        
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <p className="text-center text-sm text-gray-500 mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      )}
    </div>
  );
};

// YouTube Embed Component
const YouTubeEmbed = ({ url }) => {
  const videoId = getYouTubeId(url);
  
  if (!videoId) {
    return <p className="text-red-500 text-center py-4">Invalid YouTube URL</p>;
  }

  return (
    <div className="relative w-full my-8" style={{ paddingTop: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// Blog Content Renderer Component
const BlogContentRenderer = ({ content, imageBlocks, ytlinks }) => {
  const options = {
    replace: (domNode) => {
      if (domNode.type === 'tag' && domNode.attribs) {
        // Handle image-block divs
        if (domNode.name === 'div' && domNode.attribs.class === 'image-block') {
          const blockId = domNode.attribs.id;
          const images = imageBlocks?.[blockId];
          
          if (images && images.length > 0) {
            return <ImageBlockCarousel images={images} />;
          }
          return <div className="text-gray-400 text-center py-4">Image block not found</div>;
        }
        
        // Handle YouTube divs
        if (domNode.name === 'div' && domNode.attribs.id && domNode.attribs.id.startsWith('yt')) {
          const index = parseInt(domNode.attribs.id.replace('yt', ''), 10);
          const url = ytlinks?.[index];
          
          if (url) {
            return <YouTubeEmbed url={url} />;
          }
          return <div className="text-gray-400 text-center py-4">Video not found</div>;
        }
      }
    },
  };

  return (
    <div className="prose prose-lg max-w-none mb-8">
      {parse(content, options)}
    </div>
  );
};

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
          imageBlocks: data.imageBlocks || {},
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

              {/* Blog Content with Image Blocks and YouTube Embeds */}
              <BlogContentRenderer
                content={blog.content}
                imageBlocks={blog.imageBlocks}
                ytlinks={blog.ytlinks}
              />
            </div>
          </motion.article>
        </div>
      </div>

     
    </>
  );
};

export default AdminBlogDetail;
