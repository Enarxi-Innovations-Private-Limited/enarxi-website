"use client";
import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useBlogDetail } from '@/features/blogs/hooks/useBlogs';
import { BlogDetailView } from "@/features/blogs/presentational/BlogDetailView";

const BlogDetailContainer = () => {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogIdFromQuery = searchParams.get("id");

  const { blog, loading, error, incrementViews } = useBlogDetail(slug, blogIdFromQuery);

  useEffect(() => {
    if (blog && blog.id) {
      const SESSION_KEY = "enarxi-session-for-blog";
      const savedSession = sessionStorage.getItem(SESSION_KEY);
      let session = savedSession ? JSON.parse(savedSession) : { viewedBlogs: [] };

      if (!session.viewedBlogs.includes(blog.id)) {
        incrementViews(blog.id);
        session.viewedBlogs.push(blog.id);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    }
  }, [blog, incrementViews]);

  return (
    <>  
      <BlogDetailView 
        blog={blog} 
        loading={loading} 
        error={error} 
        onBack={() => router.push("/blogs")} 
      />
    </>
  );
};

export default BlogDetailContainer;
