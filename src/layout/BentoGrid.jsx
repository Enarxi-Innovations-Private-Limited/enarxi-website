import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved testimonials from Firebase
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      setLoading(true);
      try {
        // Try with orderBy first (requires composite index)
        const q = query(
          collection(db, 'testimonials'),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const approvedReviews = querySnapshot.docs.map((doc, index) => {
          const data = doc.data();
          // Assign dynamic colSpan for bento grid layout
          const colSpans = [
            "1 lg:col-span-2",
            "1 lg:col-span-2",
            "2 lg:col-span-3",
            "2 lg:col-span-5",
            "2 lg:col-span-2"
          ];
          
          return {
            text: data.feedback || '',
            name: data.customer_name || 'Anonymous',
            role: data.email || 'Customer',
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            rating: data.rating || 5,
            colSpan: colSpans[index % colSpans.length]
          };
        });
        
        setReviews(approvedReviews);
        // console.log('✅ BentoGrid: Fetched approved reviews:', approvedReviews.length);
      } catch (error) {
        console.error('❌ BentoGrid: Error fetching approved reviews:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // If index error or permission issue, try without orderBy
        if (error.code === 'failed-precondition' || error.message?.includes('index') || error.code === 'permission-denied') {
          console.warn('⚠️ Trying fallback query without orderBy...');
          try {
            const simpleQuery = query(
              collection(db, 'testimonials'),
              where('status', '==', 'approved'),
              limit(10)
            );
            
            const querySnapshot = await getDocs(simpleQuery);
            const approvedReviews = querySnapshot.docs.map((doc, index) => {
              const data = doc.data();
              const colSpans = [
                "1 lg:col-span-2",
                "1 lg:col-span-2",
                "2 lg:col-span-3",
                "2 lg:col-span-5",
                "2 lg:col-span-2"
              ];
              
              return {
                text: data.feedback || '',
                name: data.customer_name || 'Anonymous',
                role: data.email || 'Customer',
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                rating: data.rating || 5,
                colSpan: colSpans[index % colSpans.length]
              };
            });
            
            // Sort manually by createdAt
            approvedReviews.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
              const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
              return dateB - dateA;
            });
            
            setReviews(approvedReviews);
            // console.log('✅ BentoGrid: Fetched approved reviews (fallback):', approvedReviews.length);
          } catch (fallbackError) {
            console.error('❌ BentoGrid: Fallback query also failed:', fallbackError);
            setReviews([]);
          }
        } else {
          setReviews([]);
        }
      }
      setLoading(false);
    };

    fetchApprovedReviews();
  }, []);

  if (loading) {
    return (
      <div className="w-[90%] mx-auto">
        <div className="bg-white rounded-lg p-8 text-center text-gray-600">
          Loading testimonials...
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="w-[90%] mx-auto">
        <div className="bg-white rounded-lg p-8 text-center text-gray-600">
          No testimonials available yet.
        </div>
      </div>
    );
  }

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
                Customer Reviews
              </p>
              <span className="text-sm text-gray-300">({reviews.length} Reviews)</span>
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
