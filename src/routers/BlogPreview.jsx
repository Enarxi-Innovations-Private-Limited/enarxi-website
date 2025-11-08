import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import parse from 'html-react-parser';

const BlogPreview = () => {
  const { previewId } = useParams();
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Retrieve draft data from localStorage
      const storedData = localStorage.getItem(previewId);
      
      if (!storedData) {
        setError('Preview not found or has expired');
        setLoading(false);
        return;
      }

      const draftData = JSON.parse(storedData);
      
      // Check if preview has expired
      if (Date.now() > draftData.expiresAt) {
        localStorage.removeItem(previewId);
        setError('This preview link has expired');
        setLoading(false);
        return;
      }

      setPreviewData(draftData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading preview:', err);
      setError('Failed to load preview');
      setLoading(false);
    }
  }, [previewId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Preview Not Available</h1>
          <p className="text-gray-600 mb-6">{error || 'This preview could not be loaded.'}</p>
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mx-auto"
          >
            <ArrowLeft size={20} />
            Go to Blogs
          </button>
        </div>
      </div>
    );
  }

  const timeRemaining = Math.ceil((previewData.expiresAt - Date.now()) / (1000 * 60 * 60));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <style>{`
        .blog-preview-content h1 {
          font-size: 2em;
          line-height: 1.2;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        
        .blog-preview-content h2 {
          font-size: 1.5em;
          line-height: 1.3;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        
        .blog-preview-content h3 {
          font-size: 1.17em;
          line-height: 1.4;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        
        .blog-preview-content ul,
        .blog-preview-content ol {
          padding-left: 1.75rem;
          margin-top: 0.75em;
          margin-bottom: 0.75em;
        }
        
        .blog-preview-content ul {
          list-style-type: disc;
        }
        
        .blog-preview-content ol {
          list-style-type: decimal;
        }
        
        .blog-preview-content li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }
        
        .blog-preview-content p {
          margin-top: 0.75em;
          margin-bottom: 0.75em;
          line-height: 1.6;
        }
        
        .blog-preview-content strong {
          font-weight: 600;
        }
        
        .blog-preview-content em {
          font-style: italic;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Preview Banner */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-yellow-600" />
              <p className="text-sm text-yellow-800 font-medium">
                Preview Mode - This is a draft preview
              </p>
            </div>
            <p className="text-xs text-yellow-600">
              Expires in {timeRemaining} hour{timeRemaining !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium mb-6"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </button>

        {/* Blog Content */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {previewData.imageUrl && (
            <div className="w-full aspect-video overflow-hidden">
              <img
                src={previewData.imageUrl}
                alt={previewData.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Blog Header */}
          <div className="p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-oswald">
              {previewData.title || 'Untitled Blog Post'}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="font-medium">{previewData.authorName || 'Anonymous'}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{previewData.authorRole || 'Staff'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">
                  Preview created: {new Date(previewData.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="blog-preview-content">
              {previewData.content ? (
                parse(previewData.content)
              ) : (
                <p className="text-gray-400 italic">No content available</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPreview;
