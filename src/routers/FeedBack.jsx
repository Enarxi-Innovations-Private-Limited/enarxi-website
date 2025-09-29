import React, { useState } from "react";
import { supabase } from "./client/supabaseClient";
import { Star } from "lucide-react"; // For star rating icons

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    rating: null,
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStarClick = (rating) => {
    setFormData((prevState) => ({
      ...prevState,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      customer_name: formData.customer_name,
      email: formData.email,
      rating: parseInt(formData.rating, 10),
      feedback: formData.comments,
    };

    try {
      const { error } = await supabase
        .from("Testimonial Form")
        .insert([feedbackData]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({
        customer_name: "",
        email: "",
        rating: null,
        comments: "",
      });
    } catch (error) {
      console.error("Submission failed:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-4">
        <div className="max-w-xl w-full bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-center border border-indigo-100">
          <h2 className="text-3xl font-extrabold text-green-600 mb-4">
            🎉 Thank You!
          </h2>
          <p className="text-gray-700 text-lg">
            We've received your feedback. Your input means a lot to us 💜
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-6">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-indigo-100">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
          Share Your Feedback
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your feedback helps us grow and serve you better ✨
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Rating
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  type="button"
                  key={rating}
                  onClick={() => handleStarClick(rating)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      formData.rating >= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300"
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
