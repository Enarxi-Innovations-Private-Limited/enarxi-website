"use client";
import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Trash2, ExternalLink } from 'lucide-react';

/**
 * YouTubeEmbedComponent - React Node View for YouTubeEmbed
 * Renders a thumbnail preview with YouTube logo play button
 */
const YouTubeEmbedComponent = ({ node, deleteNode }) => {
  const { url, videoId } = node.attrs;
  const [imageError, setImageError] = useState(false);

  // YouTube thumbnail URLs (try different qualities)
  const thumbnailUrl = imageError
    ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this YouTube embed?')) {
      deleteNode();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <NodeViewWrapper className="youtube-embed-wrapper my-4">
      <div
        className="relative max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg bg-black group"
        contentEditable={false}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video">
          <img
            src={thumbnailUrl}
            alt="YouTube video thumbnail"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />

          {/* Overlay with YouTube Play Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            {/* YouTube Logo Play Button */}
            <div className="relative">
              {/* Red YouTube button background */}
              <div className="w-20 h-14 bg-red-600 rounded-xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                {/* White play triangle */}
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>

          {/* Controls Overlay (appears on hover) */}
          <div className="absolute top-2 right-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-lg"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4 text-gray-700" />
            </a>
            <button
              onClick={handleDelete}
              className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-lg"
              title="Delete embed"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {/* Video URL Info */}
        <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <svg className="w-5 h-5 text-red-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-sm text-gray-300 truncate font-mono">
              {videoId}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors shrink-0 ml-2"
          >
            Watch
          </a>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default YouTubeEmbedComponent;
