"use client";
import React, { useState } from "react";
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Star } from "lucide-react";
import { useFormStatus } from "react-dom";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    rating: null,
    comments: "",
  });

  // Separate state for each field's error message
  const [errors, setErrors] = useState({
    customer_name: "",
    phone: "",
    email: "",
    rating: "",
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    // Update form data
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Real-time validation
    if (name === "customer_name") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        errorMessage = "Name can only contain letters and spaces.";
      } else if (value.trim() === "") {
        errorMessage = "Name is required.";
      }
    } else if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        errorMessage = "Phone number can only contain digits.";
      } else if (value.length > 0 && value.length < 10) {
        errorMessage = "Phone number must be at least 10 digits.";
      }
    } else if (name === "email") {
      if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMessage = "Please enter a valid email address.";
      }
    } else if (name === "comments") {
      if (value.length > 0 && value.trim().length < 5) {
        errorMessage = "Comments must be at least 5 characters long.";
      }
    }

    // Update the error state for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleStarClick = (rating) => {
    setFormData((prevState) => ({
      ...prevState,
      rating,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      rating: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    let hasError = false;
    const newErrors = {};

    // Full form validation on submit
    if (formData.customer_name.trim() === "") {
      newErrors.customer_name = "Name is required.";
      hasError = true;
    } else if (!/^[A-Za-z\s]*$/.test(formData.customer_name)) {
      newErrors.customer_name = "Name can only contain letters and spaces.";
      hasError = true;
    }

    if (formData.phone.trim() === "" || formData.phone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
      hasError = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }

    if (!formData.rating) {
      newErrors.rating = "Please select a rating.";
      hasError = true;
    }

    if (formData.comments.trim().length < 5) {
      newErrors.comments = "Comments must be at least 5 characters long.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    const feedbackData = {
      customer_name: formData.customer_name,
      phone: formData.phone,
      email: formData.email,
      rating: parseInt(formData.rating, 10),
      feedback: formData.comments,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "testimonials"), feedbackData);
      setSubmitted(true);
      setFormData({
        customer_name: "",
        phone: "",
        email: "",
        rating: null,
        comments: "",
      });
      setErrors({
        customer_name: "",
        phone: "",
        email: "",
        rating: "",
        comments: "",
      });
    } catch (error) {
      console.error("❌ Submission failed:", error);
      let errorMessage = "An error occurred. Please try again.";
      if (error.code === "permission-denied") {
        errorMessage = "Permission denied. Please contact the administrator.";
      } else if (error.code === "unavailable") {
        errorMessage = "Service unavailable. Please check your internet connection.";
      }
      setFormError(errorMessage);
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
        <p className="text-gray-600 text-center mb-6">
          Your feedback helps us grow and serve you better ✨
        </p>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-center">
            {formError}
          </div>
        )}

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
              placeholder="Enter your name"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                errors.customer_name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-400'
              }`}
              required
            />
            {errors.customer_name && (
              <p className="mt-2 text-sm text-red-500">{errors.customer_name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              maxLength={10}
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-400'
              }`}
              required
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
            )}
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
              placeholder="example@email.com"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-400'
              }`}
              required
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email}</p>
            )}
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
            {errors.rating && (
              <p className="mt-2 text-sm text-red-500">{errors.rating}</p>
            )}
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
              placeholder="Write your feedback..."
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                errors.comments ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-400'
              }`}
              required
            ></textarea>
            {errors.comments && (
              <p className="mt-2 text-sm text-red-500">{errors.comments}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 cursor-pointer transition duration-300"
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