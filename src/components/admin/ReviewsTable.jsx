import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle, Trash2, Star, X, Mail } from 'lucide-react';

const ReviewsTable = () => {
  const [selectedReview, setSelectedReview] = useState(null);

  const reviewsData = [
    {
      id: 1,
      reviewBy: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      rating: 5,
      comments: 'Excellent service! The team was very professional and delivered exactly what we needed. The project was completed on time and exceeded our expectations. I would definitely recommend Enarxi to anyone looking for quality web development services.',
      submittedOn: '2024-01-15',
      status: 'Pending',
    },
    {
      id: 2,
      reviewBy: 'Robert Smith',
      email: 'robert.smith@email.com',
      rating: 4,
      comments: 'Great experience working with Enarxi. The communication was clear throughout the project.',
      submittedOn: '2024-01-14',
      status: 'Pending',
    },
    {
      id: 3,
      reviewBy: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      rating: 5,
      comments: 'Outstanding work! The website they created for our business has significantly improved our online presence. The design is modern, user-friendly, and perfectly captures our brand identity. The team was responsive to all our feedback and made revisions promptly.',
      submittedOn: '2024-01-13',
      status: 'Pending',
    },
    {
      id: 4,
      reviewBy: 'James Wilson',
      email: 'james.wilson@email.com',
      rating: 3,
      comments: 'Good service overall, but there were some delays in the initial phases.',
      submittedOn: '2024-01-12',
      status: 'Pending',
    },
    {
      id: 5,
      reviewBy: 'Lisa Brown',
      email: 'lisa.brown@email.com',
      rating: 5,
      comments: 'Fantastic team to work with! They understood our requirements perfectly and delivered a solution that works seamlessly. The attention to detail and quality of work is impressive.',
      submittedOn: '2024-01-11',
      status: 'Pending',
    },
  ];

  const handleViewMore = (review) => {
    setSelectedReview(review);
  };

  const handleApprove = (reviewId, reviewBy) => {
    console.log(`Approve action for review ID: ${reviewId}, Reviewer: ${reviewBy}`);
    setSelectedReview(null);
  };

  const handleDelete = (reviewId, reviewBy) => {
    console.log(`Delete action for review ID: ${reviewId}, Reviewer: ${reviewBy}`);
    setSelectedReview(null);
  };

  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
          <h2 className="text-2xl font-bold text-[#0A1524] mb-2">Customer Review Section</h2>
          <p className="text-gray-600">Review and manage customer feedback and testimonials.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {reviewsData.length} reviews pending approval
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
                  Review By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
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
              {reviewsData.map((review) => (
                <motion.tr
                  key={review.id}
                  variants={rowVariants}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#0A1524]">{review.reviewBy}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(review.submittedOn).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-1" />
                      {review.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs">
                      {truncateText(review.comments)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => handleViewMore(review)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View More
                      </motion.button>
                      <motion.button
                        onClick={() => handleApprove(review.id, review.reviewBy)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(review.id, review.reviewBy)}
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

      {/* Review Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">{reviewsData.length}</div>
          <div className="text-sm text-gray-600">Pending Reviews</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">
            {(reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">
            {reviewsData.filter(review => review.rating === 5).length}
          </div>
          <div className="text-sm text-gray-600">5-Star Reviews</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-[#0A1524]">156</div>
          <div className="text-sm text-gray-600">Total Approved</div>
        </div>
      </motion.div>

      {/* Modal for View More */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#0A1524]">Review Details</h3>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reviewer</label>
                    <p className="text-lg font-medium text-[#0A1524]">{selectedReview.reviewBy}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-600">{selectedReview.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rating</label>
                    <div className="flex items-center mt-1">
                      {renderStars(selectedReview.rating)}
                      <span className="ml-2 text-gray-600">({selectedReview.rating}/5)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Comments</label>
                    <p className="text-gray-700 leading-relaxed mt-1">{selectedReview.comments}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted On</label>
                    <p className="text-gray-600">{new Date(selectedReview.submittedOn).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <motion.button
                    onClick={() => handleApprove(selectedReview.id, selectedReview.reviewBy)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(selectedReview.id, selectedReview.reviewBy)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewsTable;
