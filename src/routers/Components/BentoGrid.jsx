import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating = 5 }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div
    className={`col-span-${review.colSpan} bg-[#23262B] text-white p-4 rounded-lg flex flex-col justify-between min-h-[200px]`}
  >
    <div className="flex flex-col gap-2 items-center text-center pt-8">
      <StarRating rating={review.rating} />
      <p className="text-sm text-gray-300 leading-relaxed">{review.text}</p>
    </div>
    <div className="flex items-center gap-3 mt-4">
      <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
        <img
          src={review.image}
          alt={review.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-left">
        <h4 className="text-sm font-semibold">{review.name}</h4>
        <p className="text-xs text-gray-400">{review.role}</p>
      </div>
    </div>
  </div>
);

const BentoReviews = () => {
  const reviews = [
    {
      text: "Excellent experience with professional service and timely delivery.",
      name: "TechTrendsHub",
      role: "CEO, Tech Company",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      colSpan: "1 lg:col-span-2",
    },
    {
      text: "Outstanding Digital Marketing through understanding client business, prompt communication, and results.",
      name: "TechTrendsHub",
      role: "Marketing Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      colSpan: "1 lg:col-span-2",
    },
    {
      text: "Professional and reliable service with excellent results.",
      name: "TechTrendsHub",
      role: "Product Manager",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      colSpan: "2 lg:col-span-3",
    },
    {
      text: "They study responsive and understand client needs. Always pleased with good service and fast turnaround.",
      name: "TechTrendsHub",
      role: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      colSpan: "2 lg:col-span-5",
    },
    {
      text: "Professional service with excellent attention to detail and creative digital marketing solutions.",
      name: "TechTrendsHub",
      role: "Operations Manager",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      colSpan: "2 lg:col-span-2",
    },
  ];

  return (
    <div className="w-[90%] mx-auto">
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 auto-rows-min">
          <div className="col-span-2 lg:col-span-7">
            <div className="bg-[#23262B] text-white px-6 py-6 rounded-2xl shadow w-full">
              <p className="font-semibold flex items-center gap-2">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                Google Reviews
              </p>
              <span className="text-sm text-gray-300">(165 Reviews)</span>
            </div>
          </div>

          {reviews.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BentoReviews;
