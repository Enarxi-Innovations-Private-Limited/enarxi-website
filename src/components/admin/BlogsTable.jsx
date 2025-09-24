import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trash2, FileText, Calendar } from 'lucide-react';

const BlogsTable = () => {
  const blogsData = [
    {
      id: 1,
      title: 'The Future of Web Development: Trends to Watch in 2024',
      author: 'John Smith',
      submittedOn: '2024-01-15',
      status: 'Pending',
      category: 'Technology',
    },
    {
      id: 2,
      title: 'Building Scalable React Applications with Modern Tools',
      author: 'Sarah Johnson',
      submittedOn: '2024-01-14',
      status: 'Pending',
      category: 'Development',
    },
    {
      id: 3,
      title: 'UI/UX Design Principles for Better User Experience',
      author: 'Michael Chen',
      submittedOn: '2024-01-13',
      status: 'Pending',
      category: 'Design',
    },
    {
      id: 4,
      title: 'Cloud Computing: A Comprehensive Guide for Beginners',
      author: 'Emily Rodriguez',
      submittedOn: '2024-01-12',
      status: 'Pending',
      category: 'Cloud',
    },
    {
      id: 5,
      title: 'Machine Learning in Web Development: Practical Applications',
      author: 'David Thompson',
      submittedOn: '2024-01-11',
      status: 'Pending',
      category: 'AI/ML',
    },
  ];

  const handleApprove = (blogId, blogTitle) => {
    console.log(`Approve action for blog ID: ${blogId}, Title: ${blogTitle}`);
  };

  const handleDelete = (blogId, blogTitle) => {
    console.log(`Delete action for blog ID: ${blogId}, Title: ${blogTitle}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Blog Review Section</h2>
          <p className="text-gray-600">Review and manage submitted blog posts.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {blogsData.length} blogs pending review
          </span>
        </div>
      </div>

      <motion.div
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blog Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Written By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="bg-white divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {blogsData.map((blog) => (
                <motion.tr
                  key={blog.id}
                  variants={rowVariants}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-[#0A1524] line-clamp-2">
                          {blog.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Status: {blog.status}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#0A1524]">{blog.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(blog.submittedOn).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => handleApprove(blog.id, blog.title)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(blog.id, blog.title)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      {/* Blog Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">{blogsData.length}</div>
          <div className="text-sm text-gray-600">Pending Reviews</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">24</div>
          <div className="text-sm text-gray-600">Approved This Month</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">3</div>
          <div className="text-sm text-gray-600">Rejected This Month</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">
            {new Set(blogsData.map(blog => blog.author)).size}
          </div>
          <div className="text-sm text-gray-600">Active Authors</div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogsTable;
