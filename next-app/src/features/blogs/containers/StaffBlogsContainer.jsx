import React from "react";
import { useStaffBlogs } from '@/hooks/useStaffBlogs';
import { StaffBlogsView } from "../presentational/StaffBlogsView";

const StaffBlogsContainer = () => {
  const staffBlogs = useStaffBlogs();

  return (
    <StaffBlogsView {...staffBlogs} />
  );
};

export default StaffBlogsContainer;
