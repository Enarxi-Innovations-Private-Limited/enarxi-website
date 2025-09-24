import React, { useState, useEffect } from 'react';
import { supabase } from './client/supabaseClient';

const AdminPortal = () => {
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingTestimonials();
  }, []);

  const fetchPendingTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Testimonial Form')
      .select('*')
      .eq('status', 'pending');
      
    if (error) {
      console.error('Error fetching testimonials:', error);
    } else {
      setPendingTestimonials(data);
    }
    setLoading(false);
  };

  const handleApproval = async (id, newStatus) => {
    if (window.confirm(`Are you sure you want to ${newStatus} this testimonial?`)) {
      const { error } = await supabase
        .from('Testimonial Form')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        alert('Failed to update testimonial status.');
      } else {
        fetchPendingTestimonials();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-700">Loading pending testimonials...</div>
      </div>
    );
  }

  if (pendingTestimonials.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-700">No new testimonials to review at this time.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Admin Portal</h1>
        
        <div className="space-y-6">
          {pendingTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-xl text-gray-900">{testimonial.customer_name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">{testimonial.email}</p>
                </div>
                {testimonial.rating && (
                  <div className="text-yellow-500 font-bold text-lg">
                    {'★'.repeat(testimonial.rating)}
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.feedback}"
              </p>
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => handleApproval(testimonial.id, 'approved')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(testimonial.id, 'rejected')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;