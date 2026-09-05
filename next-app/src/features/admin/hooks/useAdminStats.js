"use client";
import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { getVisitorStats } from "@/lib/api";

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    pendingBlogs: 0,
    retryBlogs: 0,
    pendingReviews: 0,
    totalUsers: 0,
    totalVisitors: 0,
  });
  const [visitorData, setVisitorData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to pending blogs
    const unsubBlogs = adminService.subscribeToPendingBlogs((data) => {
      setStats(prev => ({ 
        ...prev, 
        pendingBlogs: data.trulyPending, 
        retryBlogs: data.retryCount 
      }));
    });

    // Subscribe to pending reviews
    const unsubReviews = adminService.subscribeToPendingReviews((count) => {
      setStats(prev => ({ ...prev, pendingReviews: count }));
    });

    // Subscribe to total users
    const unsubUsers = adminService.subscribeToTotalUsers((count) => {
      setStats(prev => ({ ...prev, totalUsers: count }));
    });

    // Subscribe to activities
    const unsubActivities = adminService.subscribeToRecentActivities((activities) => {
      setRecentActivities(activities);
      setLoading(false);
    });

    // Fetch visitor stats (one-time)
    const fetchVisitors = async () => {
      try {
        const response = await getVisitorStats();
        if (response.success) {
          setStats(prev => ({ ...prev, totalVisitors: response.data.totalVisitors }));
          setVisitorData(response.data.dailyStats);
        }
      } catch (err) {
        console.error("Error fetching visitor stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchVisitors();

    return () => {
      unsubBlogs();
      unsubReviews();
      unsubUsers();
      unsubActivities();
    };
  }, []);

  return {
    stats,
    visitorData,
    recentActivities,
    loading,
    statsLoading,
  };
};
