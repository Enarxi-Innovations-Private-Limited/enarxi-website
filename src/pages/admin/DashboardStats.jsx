import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Star, Users, Clock, ArrowRight, RefreshCw, TrendingUp } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthProvider';
import { getVisitorStats } from '@/lib/api';
import VisitorTrendChart from './VisitorTrendChart';

const DashboardStats = () => {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const [pendingBlogs, setPendingBlogs] = useState(0);
  const [retryBlogs, setRetryBlogs] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [visitorData, setVisitorData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [viewPeriod, setViewPeriod] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // Fetch pending blogs from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'blogs'),
      where('isAdminAccepted', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allPending = snapshot.docs.map(doc => doc.data());
      const retryCount = allPending.filter(blog => blog.status === 'retry').length;
      const trulyPending = allPending.length - retryCount;

      setPendingBlogs(trulyPending);
      setRetryBlogs(retryCount);
    });

    return () => unsubscribe();
  }, []);

  // Fetch pending customer reviews from Firebase
  useEffect(() => {
    const q = query(
      collection(db, 'testimonials'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingReviews(snapshot.size);
      // console.log('📊 Dashboard: Pending reviews count:', snapshot.size);
    }, (error) => {
      console.error('❌ Dashboard: Error fetching pending reviews:', error);
      setPendingReviews(0);
    });

    return () => unsubscribe();
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

  // Fetch visitor statistics from Backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getVisitorStats();
        if (response.success) {
          setTotalVisitors(response.data.totalVisitors);
          setVisitorData(response.data.dailyStats);
        }
      } catch (error) {
        console.error('Error fetching visitor stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      id: 1,
      title: 'Pending Blogs',
      value: pendingBlogs,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/admin', { state: { activeTab: 'blogs' } }),
    },
    {
      id: 4,
      title: 'Retry Blogs',
      value: retryBlogs,
      icon: RefreshCw,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => navigate('/admin', { state: { activeTab: 'blogs', blogFilter: 'retry' } }),
    },
    {
      id: 2,
      title: 'Pending Customer Reviews',
      value: pendingReviews,
      icon: Star,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      action: () => navigate('/admin', { state: { activeTab: 'reviews' } }),
    },
    {
      id: 3,
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => navigate('/admin', { state: { activeTab: 'staff' } }),
    },
    {
      id: 5,
      title: 'Total Visitors',
      value: totalVisitors,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => { }, // No specific tab for visitors yet
    },
  ];

  // Helper to group data by period
  const getFilteredData = () => {
    if (viewPeriod === 'daily') return visitorData;

    if (viewPeriod === 'weekly') {
      const grouped = [];
      // Group by 7-day chunks (KISS)
      for (let i = 0; i < visitorData.length; i += 7) {
        const chunk = visitorData.slice(i, i + 7);
        const total = chunk.reduce((sum, item) => sum + item.count, 0);
        grouped.push({
          date: chunk[0].date,
          count: total,
          isWeekly: true
        });
      }
      return grouped;
    }

    if (viewPeriod === 'monthly') {
      const months = {};
      visitorData.forEach(item => {
        const month = item.date.substring(0, 7); // YYYY-MM
        if (!months[month]) months[month] = 0;
        months[month] += item.count;
      });
      return Object.keys(months).map(m => ({
        date: `${m}-01`,
        count: months[m],
        isMonthly: true
      })).sort((a, b) => a.date.localeCompare(b.date));
    }

    return visitorData;
  };

  const filteredVisitorData = getFilteredData();

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
        <h2 className="text-2xl text-poppins text-weight-700 text-[#0A1524] mb-2">Dashboard Overview</h2>
        <p className="text-gray-600 text-poppins text-weight-300">Welcome to the Enarxi Admin Portal. Here's a quick overview of your system.</p>
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
                  <p className="text-lg md:text-xl text-weight-500 text-poppins text-weight-500 text-gray-600 truncate">
                    {stat.title}
                  </p>
                  <p className="text-2xl text-poppins text-weight-700 text-[#0A1524]">
                    {stat.value}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-poppins text-weight-300 text-gray-500">
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

      {/* Visitor Trend Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg text-poppins text-weight-600 text-[#0A1524]">Visitor Trend</h3>
            <p className="text-sm text-gray-500 text-poppins">
              {viewPeriod === 'daily' ? 'Unique visitors over the last 30 days' :
                viewPeriod === 'weekly' ? 'Weekly visitor accumulation' :
                  'Monthly visitor accumulation'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['daily', 'weekly', 'monthly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setViewPeriod(p)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${viewPeriod === p
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-xs text-gray-600">Visitors</span>
            </div>
          </div>
        </div>

        {statsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <VisitorTrendChart data={filteredVisitorData} period={viewPeriod} />
        )}
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
            <h3 className="text-lg text-poppins text-weight-600 text-[#0A1524]">Recent Activity</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-poppins text-weight-300 text-gray-500 py-4">Loading activities...</div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center text-poppins text-weight-300 text-gray-500 py-4">No recent activities</div>
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
                      <span className="text-gray-600 text-poppins text-weight-300 block truncate">{activity.description}</span>
                      <span className="text-xs text-poppins text-weight-300 text-gray-400">{activity.adminName}</span>
                    </div>
                    <span className="ml-2 text-gray-400 text-poppins text-weight-300 text-xs whitespace-nowrap">{getTimeAgo(activity.timestamp)}</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg text-poppins text-weight-600 text-[#0A1524] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin', { state: { activeTab: 'blogs' } })}
              className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-poppins text-weight-600 text-blue-600">Review Pending Blogs</div>
                  <div className="text-xs text-poppins text-weight-300 text-blue-500">{pendingBlogs} blogs waiting for approval</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin', { state: { activeTab: 'reviews' } })}
              className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-poppins text-weight-600 text-yellow-600">Review Customer Feedback</div>
                  <div className="text-xs text-poppins text-weight-300 text-yellow-500">{pendingReviews} reviews pending approval</div>
                </div>
                <ArrowRight className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin', { state: { activeTab: 'staff' } })}
              className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-poppins text-weight-600 text-green-600">Manage Staff</div>
                  <div className="text-xs text-poppins text-weight-300 text-green-500">{totalUsers} users in the system</div>
                </div>
                <ArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin', { state: { activeTab: 'team' } })}
              className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-poppins text-weight-600 text-purple-600">Manage Team Members</div>
                  <div className="text-xs text-poppins text-weight-300 text-purple-500">Update team display on website</div>
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
