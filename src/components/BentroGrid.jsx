import React from "react";
import { Star } from "lucide-react";

const BentoReviews = () => {
  const StarRating = ({ rating = 5 }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-[90%] mx-auto">
      {/* Bento Grid */}
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 auto-rows-min">
          {/* google tag */}
          <div className="col-span-2 lg:col-span-7">
            <div className="bg-[#23262B] text-white px-6 py-6 rounded-2xl shadow w-full">
              <p className="font-semibold flex items-center gap-2">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                Google Reviews{" "}
              </p>
              <span className="text-sm text-gray-300">( 165 Reviews )</span>
            </div>
          </div>

          {/* Top Row */}
          <div className="col-span-1 lg:col-span-2 bg-[#23262B] text-white p-4 rounded-lg flex flex-col justify-center items-center text-center gap-2 min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-semibold">TechTrendsHub</h4>
            <StarRating />
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              Excellent experience with professional service and timely
              delivery.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-2 bg-[#23262B] text-white p-4 rounded-lg flex flex-col justify-center items-center text-center gap-2 min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="TechTrendsHub"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-semibold">TechTrendsHub</h4>
            <StarRating />
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              Outstanding Digital Marketing Through Understanding Concerning
              client business, Prompt communication, and Results.
            </p>
          </div>

          <div className="col-span-2 lg:col-span-3 bg-[#23262B] text-white p-4 rounded-lg flex flex-col text-center justify-center items-center gap-2 min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="TechTrendsHub"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-semibold">TechTrendsHub</h4>
            <StarRating />
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              Professional and reliable service with excellent results.
            </p>
          </div>

          {/* Middle Row */}
          <div className="col-span-2 lg:col-span-3 bg-[#23262B] text-white p-4 rounded-lg flex flex-col text-center justify-center items-center gap-2 min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="TechTrendsHub"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-semibold">TechTrendsHub</h4>
            <StarRating />
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              Professional and reliable service with excellent results.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-2 bg-[#23262B] text-white p-4 rounded-lg flex flex-col justify-center items-center text-center gap-2 min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-semibold">TechTrendsHub</h4>
            <StarRating />
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              Excellent experience with professional service and timely
              delivery.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-2 bg-[#23262B] text-white p-4 rounded-lg flex flex-col justify-center items-center text-center gap-2 min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="TechTrendsHub"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-semibold">TechTrendsHub</h4>
            <StarRating />
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              Outstanding Digital Marketing Through Understanding Concerning
              client business, Prompt communication, and Results.
            </p>
          </div>

          {/* Bottom Row */}
          <div className="col-span-2 lg:col-span-5 bg-[#23262B] text-white p-6 rounded-lg flex flex-col text-center justify-center items-center gap-2 min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="TechTrendsHub"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-semibold">TechTrendsHub</h4>
            <StarRating />
            <p className="text-xs text-gray-300 text-center leading-relaxed max-w-md">
              They Really Study Responsive and Understand Their Clients' Content
              Converting Work Standards. Always pleased about good service and
              excellent turnaround time.
            </p>
          </div>

          <div className="col-span-2 lg:col-span-2 bg-[#23262B] text-white p-4 rounded-lg flex flex-col text-center justify-center items-center gap-2 min-h-[200px]">
            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="TechTrendsHub"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-semibold">TechTrendsHub</h4>
            <StarRating />
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              Professional service with excellent attention to detail and
              creative solutions for digital marketing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoReviews;
