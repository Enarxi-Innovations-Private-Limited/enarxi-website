import React, { useState } from 'react';
import { supabase } from './client/supabaseClient';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    rating: null, // Change to null to handle unselected rating
    comments: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === "rating" ? Number(value) : (type === 'checkbox' ? checked : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      customer_name: formData.customer_name,
      email: formData.email,
      rating: parseInt(formData.rating, 10), // Convert rating to number
      feedback: formData.comments, // Map `comments` to `feedback`
    };

    try {
      const { error } = await supabase
        .from('Testimonial Form') // Ensure this matches your table name
        .insert([feedbackData]);

      if (error) throw error;

      alert('Feedback submitted successfully!');
      setSubmitted(true);
      setFormData({ // Reset form data
        customer_name: '',
        email: '',
        rating: null,
        comments: ''
      });
    } catch (error) {
      console.error('Submission failed:', error.message);
      alert('An error occurred. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">✅ Thank You!</h2>
          <p className="text-gray-700">
            We've received your feedback. Your input is valuable and will help us improve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Customer Feedback Form</h1>
        <p className="text-gray-600 text-center mb-8">
          Hello there, and thank you for your feedback!
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Rating</label>
            <div className="flex flex-wrap gap-4">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={formData.rating === rating}
                    onChange={handleInputChange}
                    className="form-radio text-indigo-600"
                    required
                  />
                  <span className="ml-2 text-gray-600">{rating}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
