import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Loader2, Eye } from "lucide-react";
import { injectBlogContent } from "@/utils/blogRenderer";
import styles from "@/pages/Blog.module.css";

export const BlogDetailView = ({ blog, loading, error, onBack }) => {
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
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{error || "Blog not found"}</h1>
        <button
          onClick={onBack}
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
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </motion.button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="w-full aspect-video overflow-hidden bg-gray-100">
            <img
              src={blog.img?.includes('res.cloudinary.com') ? blog.img.replace('/upload/', '/upload/f_auto,q_auto/') : blog.img}
              alt={blog.title}
              width="1280"
              height="720"
              fetchpriority="high"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/blogs/default.jpg"; }}
            />
          </div>

          <div className="p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-oswald">
              {blog.title}
            </h1>

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

            <div
              className={`${styles.content} prose prose-lg max-w-none`}
              dangerouslySetInnerHTML={{ __html: injectBlogContent(blog.content, blog.ytlinks, blog.imageBlocks) }}
            />

            {blog.images && blog.images.length > 1 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">More Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {blog.images.slice(1).map((imgData, idx) => {
                    const imgUrl = typeof imgData === "object" ? imgData.url : imgData;
                    return (
                      <img
                        key={idx}
                        src={imgUrl?.includes('res.cloudinary.com') ? imgUrl.replace('/upload/', '/upload/f_auto,q_auto/') : imgUrl}
                        alt={`${blog.title} - ${idx + 2}`}
                        loading="lazy"
                        className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.article>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <button
            onClick={onBack}
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
