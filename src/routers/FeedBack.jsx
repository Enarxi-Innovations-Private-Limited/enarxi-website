import React, { useState } from 'react';
import { supabase } from './client/supabaseClient';

const Feedback = () => {
  const [formData, setFormData] = useState({
    customer_name: '', // Maps to customer_name in the DB
    feedback: '',      // Maps to feedback in the DB
    isTestimonial: false,
    rating: '',
    whatLiked: '',
    whatToImprove: '',
    additionalComments: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine all feedback text fields into a single `feedback` string
    const combinedFeedback = `${formData.rating ? 'Rating: ' + formData.rating + '\n\n' : ''}` +
                             `${formData.whatLiked ? 'What I liked: ' + formData.whatLiked + '\n\n' : ''}` +
                             `${formData.whatToImprove ? 'What to improve: ' + formData.whatToImprove + '\n\n' : ''}` +
                             `${formData.additionalComments ? 'Additional Comments: ' + formData.additionalComments : ''}`;

    const feedbackData = {
      customer_name: formData.customer_name,
      feedback: combinedFeedback.trim()
    };

    try {
      const { error } = await supabase
        .from('Testimonial Form') // Use the exact table name from your screenshot
        .insert([feedbackData]);

      if (error) throw error;

      // alert('Feedback submitted successfully!');
      setSubmitted(true);
      // Reset form data if needed
    } catch (error) {
      console.error('Submission failed:', error.message);
      alert('An error occurred. Please try again.');
    }
  };

  if (submitted) {
    return (
      // Your success message JSX
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
          Hello there, and thank you for being a valued customer! We'd love to hear your thoughts so we can continue to improve.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Experience */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">1. Overall Experience</label>
            <div className="flex flex-wrap gap-4">
              {['Excellent', 'Good', 'Fair', 'Poor'].map(rating => (
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

          {/* Combined Text Areas for `feedback` */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">2. What did you like most?</label>
            <textarea
              name="whatLiked"
              value={formData.whatLiked}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">3. What can we do to improve?</label>
            <textarea
              name="whatToImprove"
              value={formData.whatToImprove}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">4. Additional Comments</label>
            <textarea
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            ></textarea>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Testimonial Section */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isTestimonial"
              checked={formData.isTestimonial}
              onChange={handleInputChange}
              className="form-checkbox text-indigo-600 h-5 w-5"
            />
            <label className="ml-2 text-gray-700 font-semibold">
              5. Would you like us to use your feedback as a testimonial?
            </label>
          </div>

          {formData.isTestimonial && (
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
          )}
          
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

export default Feedback;