import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle, Trash2, Star, X, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { logAdminActivity } from '@/utils/adminActivityLogger';
import { useAuth } from '@/AuthProvider';

const ReviewsTable = () => {
  const { firebaseUser } = useAuth();
  const [reviewsData, setReviewsData] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch pending reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Testimonial Form') // ⚠️ exact table name
      .select('*')
      .eq('status', 'pending'); // fetch only pending reviews

    if (error) {
      console.error('Error fetching reviews:', error);
      setReviewsData([]);
    } else {
      setReviewsData(data);
    }
    setLoading(false);
  };

  // Approve / Reject handlers
  const handleUpdateStatus = async (reviewId, newStatus) => {
    const review = reviewsData.find(r => r.id === reviewId);
    const { error } = await supabase
      .from('Testimonial Form')
      .update({ status: newStatus })
      .eq('id', reviewId);

    if (error) {
      console.error(`Error updating review ${reviewId}:`, error);
      alert('Failed to update review status.');
    } else {
      // Log activity
      if (firebaseUser && review) {
        const action = newStatus === 'approved' ? 'approved_review' : 'rejected_review';
        const description = `${newStatus === 'approved' ? 'Approved' : 'Rejected'} review from ${review.customer_name || 'Anonymous'}`;
        await logAdminActivity(
          firebaseUser.uid,
          firebaseUser.displayName || firebaseUser.email,
          action,
          description,
          { reviewId, customerName: review.customer_name, status: newStatus }
        );
      }
      
      fetchReviews(); // refresh after update
      setSelectedReview(null);
    }
  };

  // Utilities
  const truncateText = (text, maxLength = 60) =>
    text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));

  // Animation configs
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading reviews...
      </div>
    );
  }

  // No reviews state
  if (reviewsData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        No new reviews to review at this time.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1524] mb-2">
            Customer Review Section
          </h2>
          <p className="text-gray-600">
            Review and manage customer feedback and testimonials.
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {reviewsData.length} reviews pending approval
        </span>
      </div>

      {/* Table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Review By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Comments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
                    <div className="text-sm font-medium text-[#0A1524]">
                      {review.customer_name || 'Anonymous'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString()
                        : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-1" />
                      {review.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderStars(review.rating || 0)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({review.rating || 0}/5)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs">
                      {truncateText(review.feedback || '')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => setSelectedReview(review)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View More
                      </motion.button>
                      <motion.button
                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Reject
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
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
                    <p className="text-lg font-medium text-[#0A1524]">
                      {selectedReview.customer_name || 'Anonymous'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-600">{selectedReview.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rating</label>
                    <div className="flex items-center mt-1">
                      {renderStars(selectedReview.rating || 0)}
                      <span className="ml-2 text-gray-600">
                        ({selectedReview.rating || 0}/5)
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Comments</label>
                    <p className="text-gray-700 leading-relaxed mt-1">
                      {selectedReview.feedback}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted On</label>
                    <p className="text-gray-600">
                      {selectedReview.created_at
                        ? new Date(selectedReview.created_at).toLocaleDateString()
                        : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <motion.button
                    onClick={() => handleUpdateStatus(selectedReview.id, 'approved')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </motion.button>
                  <motion.button
                    onClick={() => handleUpdateStatus(selectedReview.id, 'rejected')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reject
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
