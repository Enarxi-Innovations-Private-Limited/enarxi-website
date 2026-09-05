"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useBlogs } from "../hooks/useBlogs";
import { BlogView } from "../presentational/BlogView";
import { createFullSlug } from "@/utils/slugUtils";

const BlogContainer = () => {
  const router = useRouter();
  const { blogs, loading, error } = useBlogs();

  const handleBlogClick = (blog) => {
    const slug = blog.slug || createFullSlug(blog.title, blog.id);
    router.push(`/blog/${slug}`);
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <BlogView 
      blogs={blogs} 
      loading={loading} 
      onBlogClick={handleBlogClick} 
    />
  );
};

export default BlogContainer;
