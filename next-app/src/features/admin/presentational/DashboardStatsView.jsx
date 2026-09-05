"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, Star, Users, Clock, ArrowRight, RefreshCw, TrendingUp 
} from "lucide-react";
import VisitorTrendChart from "@/pages/admin/VisitorTrendChart";

const DashboardStatsView = ({
  stats,
  recentActivities,
  loading,
  statsLoading,
  viewPeriod,
  setViewPeriod,
  filteredVisitorData,
  onNavigate
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, y: 0, scale: 1, 
      transition: { type: "spring", stiffness: 300, damping: 20 } 
    },
  };

  const statCards = [
    {
      id: 1, title: "Pending Blogs", value: stats.pendingBlogs, icon: FileText,
      color: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50",
      action: () => onNavigate("/admin", { state: { activeTab: "blogs" } }),
    },
    {
      id: 4, title: "Retry Blogs", value: stats.retryBlogs, icon: RefreshCw,
      color: "bg-orange-500", textColor: "text-orange-600", bgColor: "bg-orange-50",
      action: () => onNavigate("/admin", { state: { activeTab: "blogs", blogFilter: "retry" } }),
    },
    {
      id: 2, title: "Pending Customer Reviews", value: stats.pendingReviews, icon: Star,
      color: "bg-yellow-500", textColor: "text-yellow-600", bgColor: "bg-yellow-50",
      action: () => onNavigate("/admin", { state: { activeTab: "reviews" } }),
    },
    {
      id: 3, title: "Total Users", value: stats.totalUsers, icon: Users,
      color: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50",
      action: () => onNavigate("/admin", { state: { activeTab: "staff" } }),
    },
    {
      id: 5, title: "Total Visitors", value: stats.totalVisitors, icon: TrendingUp,
      color: "bg-purple-500", textColor: "text-purple-600", bgColor: "bg-purple-50",
      action: () => { },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A1524] mb-2 font-poppins">Dashboard Overview</h2>
        <p className="text-gray-600 font-poppins">Welcome to the Enarxi Admin Portal. Here's a quick overview of your system.</p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              onClick={stat.action}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-lg text-gray-600 font-medium truncate font-poppins">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#0A1524] font-poppins">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500 font-poppins">
                <span className="flex items-center">
                  <span className={`w-2 h-2 ${stat.color} rounded-full mr-2 animate-pulse`}></span>
                  Live data
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
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
            <h3 className="text-lg font-semibold text-[#0A1524] font-poppins">Visitor Trend</h3>
            <p className="text-sm text-gray-500 font-poppins">
              {viewPeriod === "daily" ? "Unique visitors over the last 30 days" :
                viewPeriod === "weekly" ? "Weekly visitor accumulation" :
                  "Monthly visitor accumulation"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {["daily", "weekly", "monthly"].map((p) => (
                <button
                  key={p}
                  onClick={() => setViewPeriod(p)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewPeriod === p ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
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

      {/* Activities & Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0A1524] font-poppins">Recent Activity</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-gray-500 py-4 font-poppins">Loading activities...</div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center text-gray-500 py-4 font-poppins">No recent activities</div>
            ) : (
              recentActivities.map((activity) => {
                const getActivityColor = (action) => {
                  if (action.includes("approved") || action.includes("added")) return "bg-green-500";
                  if (action.includes("rejected") || action.includes("deleted")) return "bg-red-500";
                  if (action.includes("updated")) return "bg-blue-500";
                  return "bg-gray-500";
                };

                const getTimeAgo = (timestamp) => {
                  if (!timestamp) return "Just now";
                  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
                  const seconds = Math.floor((new Date() - date) / 1000);
                  if (seconds < 60) return "Just now";
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
                      <span className="text-gray-600 font-poppins block truncate">{activity.description}</span>
                      <span className="text-xs text-gray-400 font-poppins">{activity.adminName}</span>
                    </div>
                    <span className="ml-2 text-gray-400 text-xs whitespace-nowrap font-poppins">{getTimeAgo(activity.timestamp)}</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#0A1524] mb-4 font-poppins">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: "Review Pending Blogs", sub: `${stats.pendingBlogs} blogs waiting`, color: "bg-blue-50", text: "text-blue-600", subText: "text-blue-500", action: () => onNavigate("/admin", { state: { activeTab: "blogs" } }) },
              { label: "Review Customer Feedback", sub: `${stats.pendingReviews} reviews pending`, color: "bg-yellow-50", text: "text-yellow-600", subText: "text-yellow-500", action: () => onNavigate("/admin", { state: { activeTab: "reviews" } }) },
              { label: "Manage Staff", sub: `${stats.totalUsers} users in system`, color: "bg-green-50", text: "text-green-600", subText: "text-green-500", action: () => onNavigate("/admin", { state: { activeTab: "staff" } }) },
              { label: "Manage Team Members", sub: "Update team display", color: "bg-purple-50", text: "text-purple-600", subText: "text-purple-500", action: () => onNavigate("/admin", { state: { activeTab: "team" } }) },
            ].map((qa, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={qa.action}
                className={`w-full text-left p-3 rounded-lg ${qa.color} hover:shadow-sm transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-bold ${qa.text} font-poppins`}>{qa.label}</div>
                    <div className={`text-xs ${qa.subText} font-poppins`}>{qa.sub}</div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${qa.text} group-hover:translate-x-1 transition-transform`} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardStatsView;
