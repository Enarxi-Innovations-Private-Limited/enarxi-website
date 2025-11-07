import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import parse from 'html-react-parser';
import styles from './Blog.module.css';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

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

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full my-8">
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].publicId || `Image ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
        
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            
            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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
    <div className={`${styles.content} prose prose-lg max-w-none`}>
      {parse(content, options)}
    </div>
  );
};

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        // Check if blog is approved and visible
        if (!data.isAdminAccepted || data.visibility === false) {
          setError('Blog not available');
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
          date: data.createdAt?.toDate().toLocaleDateString('en-US', {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{error || 'Blog not found'}</h1>
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </motion.button>

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
                <Link 
                  to={`/users/${blog.authorName}`}
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  {blog.authorName}
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{blog.authorRole}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{blog.date}</span>
              </div>
            </div>

            {/* Blog Content with Image Blocks and YouTube Embeds */}
            <BlogContentRenderer
              content={blog.content}
              imageBlocks={blog.imageBlocks}
              ytlinks={blog.ytlinks}
            />
          </div>
        </motion.article>

        {/* Back to Blogs Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#09B8DC] text-white rounded-lg hover:bg-[#08A0C6] transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back to All Blogs
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail;
