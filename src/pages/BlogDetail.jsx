import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Loader2, Eye } from 'lucide-react';
import { injectBlogContent } from '@/utils/blogRenderer';
import { incrementBlogViews } from '@/lib/api';
import styles from './Blog.module.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const blogIdFromQuery = queryParams.get('id');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        let blogSnap = null;
        let blogData = null;
        let blogId = null;

        // 1. Handle legacy ?id=123 redirect
        if (blogIdFromQuery) {
          const blogRef = doc(db, 'blogs', blogIdFromQuery);
          blogSnap = await getDoc(blogRef);
          if (blogSnap.exists()) {
            const data = blogSnap.data();
            if (data.slug) {
              navigate(`/blog/${data.slug}`, { replace: true });
              return;
            }
          }
        }

        // 2. Fetch by slug field
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          blogSnap = querySnapshot.docs[0];
          blogData = blogSnap.data();
          blogId = blogSnap.id;
        } else {
          // 3. Fallback: try to extract ID from legacy slug (title-id)
          const potentialId = slug.split('-').pop();
          if (potentialId && potentialId.length >= 20) { // Firestore IDs are usually 20 chars
            const blogRef = doc(db, 'blogs', potentialId);
            blogSnap = await getDoc(blogRef);

            if (blogSnap.exists()) {
              const data = blogSnap.data();
              if (data.slug) {
                // Found legacy URL, redirect to new slug
                navigate(`/blog/${data.slug}`, { replace: true });
                return;
              }
              // If no slug field yet, use this one but we'll need to migrate later
              blogData = data;
              blogId = blogSnap.id;
            }
          }
        }

        if (!blogSnap || !blogSnap.exists()) {
          setError('Blog not found');
          setLoading(false);
          return;
        }

        // Session based view count
        incrementViewCount(blogId);

        // Check if blog is approved and visible
        if (!blogData.isAdminAccepted || blogData.visibility === false) {
          setError('Blog not available');
          setLoading(false);
          return;
        }

        // Handle image URL
        let imageUrl = '/blogs/default.jpg';
        if (blogData.images && blogData.images.length > 0) {
          const firstImage = blogData.images[0];
          if (typeof firstImage === 'object' && firstImage.url) {
            imageUrl = firstImage.url;
          } else if (typeof firstImage === 'string' && firstImage.includes('cloudinary')) {
            imageUrl = firstImage;
          } else if (typeof firstImage === 'string') {
            imageUrl = `/blogs/${firstImage}`;
          }
        }

        setBlog({
          id: blogId,
          title: blogData.title || 'Untitled Blog',
          content: blogData.content || '',
          date: blogData.createdAt?.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) || '',
          img: imageUrl,
          images: blogData.images || [],
          authorName: blogData.authorName || 'Anonymous',
          authorRole: blogData.authorRole || 'Staff',
          ytlinks: blogData.ytlinks || [],
          imageBlocks: blogData.imageBlocks || {},
          views: blogData.views || 0,
        });
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, blogIdFromQuery, navigate]);


  //blogs view count using session 
  const incrementViewCount = async (blogId) => {
    const SESSION_KEY = "enarxi-session-for-blog";
    const savedSession = sessionStorage.getItem(SESSION_KEY);
    let session = savedSession ? JSON.parse(savedSession) : { viewedBlogs: [] };

    if (!session.viewedBlogs.includes(blogId)) {

      try {
        // Call backend to increment views instead of direct Firestore update
        await incrementBlogViews(blogId);

        // Update local state to show the incremented count immediately
        setBlog(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : prev);

        session.viewedBlogs.push(blogId);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch (err) {
        console.error('Error incrementing view count:', err);
      }

    }
  }

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
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
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
              <div className="flex items-center gap-2 text-gray-500">
                <Eye size={18} />
                <span>{blog.views} views</span>
              </div>
            </div>

            {/* Blog Content with Embedded YouTube Videos */}
            <div
              className={`${styles.content} prose prose-lg max-w-none`}
              dangerouslySetInnerHTML={{ __html: injectBlogContent(blog.content, blog.ytlinks, blog.imageBlocks) }}
            />

            {/* Additional Images */}
            {blog.images && blog.images.length > 1 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">More Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {blog.images.slice(1).map((imgData, idx) => {
                    const imgUrl = typeof imgData === 'object' ? imgData.url : imgData;
                    return (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`${blog.title} - ${idx + 2}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
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

        {/* Back to Blogs Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
