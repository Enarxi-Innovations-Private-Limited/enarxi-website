import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "./client/supabaseClient"; // Your Supabase client
import BentoReviews from "@/components/BentroGrid";

export default function Testimonials() {
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // UseEffect to fetch approved testimonials when the component mounts
  useEffect(() => {
    fetchApprovedTestimonials();
  }, []);

  const fetchApprovedTestimonials = async () => {
    setLoading(true);
    // Fetch all testimonials that have been approved
    const { data, error } = await supabase
      .from('Testimonial Form') // Use the exact table name from your Supabase project
      .select('*')
      .eq('status', 'approved') // Filter for approved testimonials only
      .order('created_at', { ascending: false }); // Sort by newest first
      
    if (error) {
      console.error('Error fetching approved testimonials:', error);
      // In a production app, you might display an error message to the user
    } else {
      setApprovedTestimonials(data);
    }
    setLoading(false);
  };

  const next = () => {
    if (approvedTestimonials.length > 0) {
      setCurrent((prev) => (prev === approvedTestimonials.length - 1 ? 0 : prev + 1));
    }
  };

  const prev = () => {
    if (approvedTestimonials.length > 0) {
      setCurrent((prev) => (prev === 0 ? approvedTestimonials.length - 1 : prev - 1));
    }
  };

  // Render a loading state while fetching data
  if (loading) {
    return (
      <section className="w-full bg-gray-50 py-16 px-2 text-center">
        <h2 className="text-2xl font-semibold mb-10">Their Experience With Us</h2>
        <p className="text-gray-700">Loading testimonials...</p>
      </section>
    );
  }

  // Render a message if there are no testimonials to display
  if (approvedTestimonials.length === 0) {
    return (
      <section className="w-full bg-gray-50 py-16 px-2 text-center">
        <h2 className="text-2xl font-semibold mb-10">Their Experience With Us</h2>
        <p className="text-gray-700">No testimonials to display yet.</p>
      </section>
    );
  }

  // Get the current testimonial from the dynamically fetched array
  const currentTestimonial = approvedTestimonials[current];

  return (
    <section className="w-full bg-gray-50 py-16 px-2">
      {/* Title */}
      <h2 className="text-center text-2xl font-semibold mb-10">
        Their Experience With Us
      </h2>

      {/* Testimonials Carousel */}
      <div className="flex items-center justify-center gap-6 mb-10">
        <button
          onClick={prev}
          className="p-2 rounded-full border cursor-pointer"
        >
          <ArrowLeft />
        </button>

        <div className="max-w-md text-center flex flex-col items-center">
          {/* Note: Image, role, and rating fields from the original code are not present in your database. */}
          {/* The code has been updated to use the `customer_name` and `feedback` fields from your Supabase table. */}
          <h3 className="mt-4 font-bold">{currentTestimonial.customer_name || 'Anonymous'}</h3>
          <p className="mt-2 text-gray-700 italic">
            "{currentTestimonial.feedback}"
          </p>
        </div>

        <button
          onClick={next}
          className="p-2 rounded-full border cursor-pointer"
        >
          <ArrowRight />
        </button>
      </div>

      {/* Google Reviews Section */}
      <BentoReviews />
    </section>
  );
}



// import { useState } from "react";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import person1 from "../assets/images/testi_person1.svg";
// import person2 from "../assets/images/testi_person2.svg";
// import person3 from "../assets/images/testi_person3.svg";
// import BentoReviews from "@/components/BentroGrid";

// const testimonials = [
//   {
//     name: "Vrini",
//     role: "Assistant Professor, SRMIST, Ramapuram",
//     img: person1,
//     review: "Good job! Team Enarxi.",
//     rating: 5,
//   },
//   {
//     name: "Mohamed Shuaib",
//     role: "HOD & Associate Professor, Crescent Institute of Science and Technology",
//     img: person2,
//     review:
//       "Course designed for students from top researchers, making learning engaging and impactful.",
//     rating: 5,
//   },
//   {
//     name: "Mohamed Shuaib",
//     role: "HOD & Assistant Professor, Crescent Institute of Science and Technology",
//     img: person3,
//     review: "Good job! Team Enarxi.",
//     rating: 5,
//   },
// ];

// export default function Testimonials() {
//   const [current, setCurrent] = useState(0);

//   const next = () =>
//     setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
//   const prev = () =>
//     setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

//   return (
//     <section className="w-full bg-gray-50 py-16 px-2">
//       {/* Title */}
//       <h2 className="text-center text-2xl font-semibold mb-10">
//         Their Experience With Us
//       </h2>

//       {/* Testimonials Carousel */}
//       <div className="flex items-center justify-center gap-6 mb-10">
//         <button
//           onClick={prev}
//           className="p-2 rounded-full border cursor-pointer"
//         >
//           <ArrowLeft />
//         </button>

//         <div className="max-w-md text-center flex flex-col items-center">
//           <img
//             src={testimonials[current].img}
//             alt={testimonials[current].name}
//             className="w-24 h-24 rounded-full object-cover"
//           />
//           <h3 className="mt-4 font-bold">{testimonials[current].name}</h3>
//           <p className="text-sm text-gray-500">{testimonials[current].role}</p>
//           <p className="mt-2 text-gray-700 italic">
//             "{testimonials[current].review}"
//           </p>
//           <div className="flex justify-center mt-2">
//             {"⭐".repeat(testimonials[current].rating)}
//           </div>
//         </div>

//         <button
//           onClick={next}
//           className="p-2 rounded-full border cursor-pointer"
//         >
//           <ArrowRight />
//         </button>
//       </div>

//       {/* Google Reviews Section */}
//       <BentoReviews />
//     </section>
//   );
// }
