"use client";
import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useBlogDetail } from '@/hooks/useBlogs';
import { BlogDetailView } from "../presentational/BlogDetailView";
import SEO from "@/components/SEO";

const BlogDetailContainer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const blogIdFromQuery = queryParams.get("id");

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
      {blog && (
        <SEO 
          title={blog.title}
          description={blog.excerpt || blog.content?.substring(0, 160).replace(/<[^>]*>/g, '')}
          keywords={blog.tags?.join(', ') || "electronic manufacturing, IoT, software development"}
          ogImage={blog.featuredImage}
          ogType="article"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blog.title,
            "image": blog.featuredImage ? [blog.featuredImage] : [],
            "datePublished": blog.createdAt?.seconds ? new Date(blog.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
            "author": [{
              "@type": "Person",
              "name": blog.authorName || "Enarxi Team"
            }],
            "publisher": {
              "@type": "Organization",
              "name": "Enarxi Innovations",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.enarxi.com/favicon/apple-touch-icon.png"
              }
            }
          }}
        />
      )}
      <BlogDetailView 
        blog={blog} 
        loading={loading} 
        error={error} 
        onBack={() => navigate("/blogs")} 
      />
    </>
  );
};

export default BlogDetailContainer;
