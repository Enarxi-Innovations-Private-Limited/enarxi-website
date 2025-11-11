import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Loader2, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { deleteBlog } from '@/lib/api';
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
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
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
              e.target.onerror = null;
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
    <div className="prose prose-lg max-w-none mb-8 blog-content-renderer">
      {parse(content, options)}
    </div>
  );
};

const StaffBlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

        // Check if this blog belongs to the current user
        if (data.userId !== user?.uid) {
          setError('You do not have permission to view this blog');
          setLoading(false);
          return;
        }

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
          status: data.status || 'pending',
          visibility: data.visibility !== false,
        });
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBlog();
    }
  }, [slug, user]);

  const handleEdit = () => {
    navigate(`/staff/blog/edit/${blog.id}`);
  };

  const handleDelete = async () => {
    setDeleteConfirm(false);
    const toastId = toast.loading('Deleting blog and images...');
    
    try {
      const result = await deleteBlog(blog.id);
      
      toast.dismiss(toastId);
      
      if (result.success) {
        toast.success(`Blog "${blog.title}" deleted successfully!`);
        setTimeout(() => navigate('/staff'), 1500);
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
          onClick={() => navigate('/staff')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Staff Portal
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .blog-content-renderer h1 {
          font-size: 2em;
          line-height: 1.2;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        
        .blog-content-renderer h2 {
          font-size: 1.5em;
          line-height: 1.3;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        
        .blog-content-renderer h3 {
          font-size: 1.17em;
          line-height: 1.4;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        
        .blog-content-renderer ul,
        .blog-content-renderer ol {
          padding-left: 1.75rem;
          margin-top: 0.75em;
          margin-bottom: 0.75em;
        }
        
        .blog-content-renderer ul {
          list-style-type: disc;
        }
        
        .blog-content-renderer ol {
          list-style-type: decimal;
        }
        
        .blog-content-renderer li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }
        
        .blog-content-renderer p {
          margin-top: 0.75em;
          margin-bottom: 0.75em;
        }
        
        .blog-content-renderer strong {
          font-weight: 600;
        }
        
        .blog-content-renderer em {
          font-style: italic;
        }
      `}</style>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Actions */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/staff')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Back to My Blogs
            </motion.button>

            {/* Action Buttons - Only show for rejected blogs */}
            {blog.status === 'rejected' && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Edit size={18} />
                  Edit & Resubmit
                </button>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              blog.status === 'pending'
                ? 'bg-blue-100 text-blue-800'
                : blog.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : blog.visibility
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {blog.status === 'pending' && '⏳ Pending Review'}
              {blog.status === 'rejected' && '❌ Rejected - Edit & Resubmit'}
              {blog.status === 'approved' && blog.visibility && '✓ Published'}
              {blog.status === 'approved' && !blog.visibility && '✓ Approved (Hidden by Admin)'}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Blog"
        message={`Are you sure you want to delete "${blog.title}"? This will permanently delete all images and cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default StaffBlogDetail;
