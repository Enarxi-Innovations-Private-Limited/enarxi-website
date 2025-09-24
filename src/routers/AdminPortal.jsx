import React, { useState, useEffect } from 'react';
import { supabase } from './client/supabaseClient';

const AdminPortal = () => {
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchPendingTestimonials();
  }, []);

  // Function to fetch all testimonials with a 'pending' status
  const fetchPendingTestimonials = async () => {
    // Set loading to true while fetching data
    setLoading(true);
    const { data, error } = await supabase
      .from('Testimonial Form') // Use the exact table name from your Supabase project
      .select('*')
      .eq('status', 'pending'); // Filter for pending testimonials only
      
    if (error) {
      console.error('Error fetching testimonials:', error);
      // You could set an error state here to display a message to the user
    } else {
      setPendingTestimonials(data);
    }
    // Set loading to false after the data is fetched
    setLoading(false);
  };

  // Function to handle the approval or rejection of a testimonial
  const handleApproval = async (id, newStatus) => {
    // Show a confirmation dialog to the user
    if (window.confirm(`Are you sure you want to ${newStatus} this testimonial?`)) {
      const { error } = await supabase
        .from('Testimonial Form')
        .update({ status: newStatus }) // Update the status column
        .eq('id', id); // Identify the specific row by its ID

      if (error) {
        console.error('Error updating status:', error);
        alert('Failed to update testimonial status.');
      } else {
        // If successful, re-fetch the list to update the UI
        fetchPendingTestimonials();
      }
    }
  };

  // Display a loading message while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-700">Loading pending testimonials...</div>
      </div>
    );
  }

  // Display a message if there are no pending testimonials
  if (pendingTestimonials.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-700">No new testimonials to review at this time.</div>
      </div>
    );
  }

  // Main JSX for the admin portal
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Admin Portal</h1>
        
        <div className="space-y-6">
          {pendingTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
              {/* Display the testimonial content */}
              <p className="font-semibold text-xl text-gray-900 mb-2">
                {testimonial.customer_name || 'Anonymous'}
              </p>
              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.feedback}"
              </p>
              
              {/* Approval/Rejection buttons */}
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