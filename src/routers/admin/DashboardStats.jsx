import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Star, Users, Clock, ArrowRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthProvider';

const DashboardStats = () => {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const [pendingBlogs, setPendingBlogs] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending blogs from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'blogs'),
      where('isAdminAccepted', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingBlogs(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  // Fetch pending customer reviews from Supabase
  useEffect(() => {
    const fetchPendingReviews = async () => {
      const { count, error } = await supabase
        .from('Testimonial Form')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (!error && count !== null) {
        setPendingReviews(count);
      }
    };

    fetchPendingReviews();
    
    // Poll every 30 seconds for updates
    const interval = setInterval(fetchPendingReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch total users from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setTotalUsers(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  // Fetch recent admin activities
  useEffect(() => {
    const q = query(
      collection(db, 'adminActivities'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentActivities(activities);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching admin activities:', error);
      // If permission denied or collection doesn't exist, set empty activities
      if (error.code === 'permission-denied' || error.code === 'not-found') {
        setRecentActivities([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = [
    {
      id: 1,
      title: 'Pending Blog Reviews',
      value: pendingBlogs,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/admin', { state: { section: 'blogs' } }),
    },
    {
      id: 2,
      title: 'Pending Customer Reviews',
      value: pendingReviews,
      icon: Star,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      action: () => navigate('/admin', { state: { section: 'reviews' } }),
    },
    {
      id: 3,
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => navigate('/admin', { state: { section: 'staff' } }),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to the Enarxi Admin Portal. Here's a quick overview of your system.</p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              onClick={stat.action}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600 truncate">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-[#0A1524]">
                    {stat.value}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className={`w-2 h-2 ${stat.color} rounded-full mr-2 animate-pulse`}></span>
                    Live data
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Additional Dashboard Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0A1524]">Recent Activity</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-gray-500 py-4">Loading activities...</div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center text-gray-500 py-4">No recent activities</div>
            ) : (
              recentActivities.map((activity) => {
                const getActivityColor = (action) => {
                  if (action.includes('approved') || action.includes('added')) return 'bg-green-500';
                  if (action.includes('rejected') || action.includes('deleted')) return 'bg-red-500';
                  if (action.includes('updated')) return 'bg-blue-500';
                  return 'bg-gray-500';
                };

                const getTimeAgo = (timestamp) => {
                  if (!timestamp) return 'Just now';
                  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
                  const seconds = Math.floor((new Date() - date) / 1000);
                  
                  if (seconds < 60) return 'Just now';
                  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
                  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
                  return `${Math.floor(seconds / 86400)}d ago`;
                };

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start text-sm"
                  >
                    <div className={`w-2 h-2 ${getActivityColor(activity.action)} rounded-full mr-3 mt-1.5 flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-600 block truncate">{activity.description}</span>
                      <span className="text-xs text-gray-400">{activity.adminName}</span>
                    </div>
                    <span className="ml-2 text-gray-400 text-xs whitespace-nowrap">{getTimeAgo(activity.timestamp)}</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#0A1524] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin', { state: { section: 'blogs' } })}
              className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-blue-600">Review Pending Blogs</div>
                  <div className="text-xs text-blue-500">{pendingBlogs} blogs waiting for approval</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin', { state: { section: 'reviews' } })}
              className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-yellow-600">Review Customer Feedback</div>
                  <div className="text-xs text-yellow-500">{pendingReviews} reviews pending approval</div>
                </div>
                <ArrowRight className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin', { state: { section: 'staff' } })}
              className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-green-600">Manage Staff</div>
                  <div className="text-xs text-green-500">{totalUsers} users in the system</div>
                </div>
                <ArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin', { state: { section: 'team' } })}
              className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-purple-600">Manage Team Members</div>
                  <div className="text-xs text-purple-500">Update team display on website</div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardStats;
