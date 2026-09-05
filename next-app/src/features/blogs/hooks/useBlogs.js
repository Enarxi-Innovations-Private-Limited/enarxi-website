"use client";
import { useState, useEffect, useCallback } from "react";
import { blogService } from "@/services/blogService";

/**
 * Hook for fetching approved blogs
 */
export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await blogService.getApprovedBlogs();
      setBlogs(data);
      setError(null);
    } catch (err) {
      console.error("Error in useBlogs:", err);
      setError("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refresh: fetchBlogs };
};

/**
 * Hook for fetching a single blog by slug
 */
export const useBlogDetail = (slug, blogIdFromQuery = null) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlog = useCallback(async () => {
    if (!slug && !blogIdFromQuery) return;
    
    try {
      setLoading(true);
      let data = null;

      if (blogIdFromQuery) {
        data = await blogService.getBlogById(blogIdFromQuery);
      } else {
        data = await blogService.getBlogBySlug(slug);
      }

      if (data) {
        setBlog(data);
        setError(null);
      } else {
        setError("Blog not found");
      }
    } catch (err) {
      console.error("Error in useBlogDetail:", err);
      setError("Failed to fetch blog details.");
    } finally {
      setLoading(false);
    }
  }, [slug, blogIdFromQuery]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const incrementViews = useCallback(async (blogId) => {
    try {
      await blogService.incrementViews(blogId);
      setBlog(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : prev);
    } catch (err) {
      console.error("Error incrementing views in hook:", err);
    }
  }, []);

  return { blog, loading, error, incrementViews };
};
