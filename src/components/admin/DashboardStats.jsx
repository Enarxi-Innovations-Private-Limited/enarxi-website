import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Star, Users } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      id: 1,
      title: 'Pending Blog Reviews',
      value: '12',
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      title: 'Pending Customer Reviews',
      value: '8',
      icon: Star,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 3,
      title: 'Total Users',
      value: '5',
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
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
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
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
                <div className="flex items-center text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className={`w-2 h-2 ${stat.color} rounded-full mr-2`}></span>
                    Last updated: Today
                  </span>
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
          <h3 className="text-lg font-semibold text-[#0A1524] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New blog submitted by John Doe</span>
              <span className="ml-auto text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Customer review pending approval</span>
              <span className="ml-auto text-gray-400">4 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New staff member added</span>
              <span className="ml-auto text-gray-400">1 day ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#0A1524] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
            >
              <div className="text-sm font-medium text-blue-600">Review Pending Blogs</div>
              <div className="text-xs text-blue-500">12 blogs waiting for approval</div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200"
            >
              <div className="text-sm font-medium text-yellow-600">Review Customer Feedback</div>
              <div className="text-xs text-yellow-500">8 reviews pending approval</div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200"
            >
              <div className="text-sm font-medium text-green-600">Manage Staff</div>
              <div className="text-xs text-green-500">View and update staff information</div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardStats;
