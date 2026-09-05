"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, ExternalLink } from 'lucide-react';
import { injectBlogContent } from '@/utils/blogRenderer';

const BlogPreviewModal = ({
  isOpen,
  onClose,
  title,
  content,
  authorName,
  authorRole,
  featuredImage,
  ytlinks = [],
  imageBlocks = {}
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <ExternalLink size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Blog Preview</h3>
                <p className="text-xs text-gray-500 font-medium">This is how your blog will look to readers</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Preview Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50">
            <div className="max-w-4xl mx-auto py-12 px-6 sm:px-8">
              {/* Actual Blog Layout Mockup */}
              <article className="bg-white rounded-2xl shadow-sm border border-gray-100">

                {/* Featured Image */}
                {featuredImage && (
                  <div className="w-full bg-gray-100 rounded-t-2xl flex items-center justify-center">
                    <img
                      src={typeof featuredImage === 'string' ? featuredImage : URL.createObjectURL(featuredImage)}
                      alt="Thumbnail"
                      className="rounded-t-2xl"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '50vh',
                        width: 'auto',
                        height: 'auto',
                        display: 'block'
                      }}
                    />
                  </div>
                )}

                <div className="p-8 sm:p-12">
                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                    {title || "Untitled Blog"}
                  </h1>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-10 pb-10 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 rounded-full">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{authorName || "Author Name"}</span>
                        <span className="text-xs text-gray-500">{authorRole || "Role"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={18} />
                      <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Rich Text Content */}
                  <div
                    className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: injectBlogContent(content, ytlinks, imageBlocks)
                    }}
                  />
                </div>
              </article>

              {/* Bottom Padding */}
              <div className="h-20" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-4 border-t border-gray-100 bg-white flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-200"
            >
              Continue Editing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BlogPreviewModal;
