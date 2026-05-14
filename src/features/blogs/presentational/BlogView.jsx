import React from "react";
import { motion } from "framer-motion";
import BlogSkeleton from "@/components/ui/BlogSkeleton";
import { Eye } from "lucide-react";

export const BlogView = ({ blogs, loading, onBlogClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((n) => <BlogSkeleton key={n} />)}
      </div>
    );
  }

  return (
    <section className="w-[90%] mx-auto py-12 min-h-[60vh]">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold font-oswald">Our Blogs</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto font-poppins">
          Stay updated with the latest trends and insights in technology and innovation.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onBlogClick(blog)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = "/blogs/default.jpg"; }}
                />
                {/* View count removed from here to move to metadata */}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span>{blog.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="font-medium text-blue-600">{blog.authorRole}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-gray-400" />
                    <span>{blog.views} views</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 font-oswald">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-poppins">
                  {blog.desc.replace(/<[^>]*>/g, "")}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">By {blog.authorName}</span>
                  <span className="text-blue-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                    Read More →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
