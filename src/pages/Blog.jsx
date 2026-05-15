import React from "react";
import BlogContainer from "@/features/blogs/containers/BlogContainer";
import SEO from "../components/SEO";

const Blog = () => {
  return (
    <>
      <SEO 
        title="Insights & Innovation Blog"
        description="Stay updated with the latest trends in electronic manufacturing, IoT, embedded systems, and custom software development from the experts at Enarxi Innovations."
        keywords="electronics blog, IoT trends, PCB design tips, manufacturing news, software development blog, Enarxi insights"
      />
      <BlogContainer />
    </>
  );
};

export default Blog;
