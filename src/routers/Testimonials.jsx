import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "./client/supabaseClient"; // Your Supabase client
import BentoReviews from "./Components/BentoGrid";

export default function Testimonials() {
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedTestimonials();
  }, []);

  const fetchApprovedTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Testimonial Form")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching approved testimonials:", error);
    } else {
      setApprovedTestimonials(data);
    }
    setLoading(false);
  };

  const next = () => {
    if (approvedTestimonials.length > 0) {
      setCurrent((prev) =>
        prev === approvedTestimonials.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prev = () => {
    if (approvedTestimonials.length > 0) {
      setCurrent((prev) =>
        prev === 0 ? approvedTestimonials.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-gray-50 py-16 px-2 text-center">
        <h2 className="text-2xl font-semibold mb-10">
          Their Experience With Us
        </h2>
        <p className="text-gray-700">Loading testimonials...</p>
      </section>
    );
  }

  if (approvedTestimonials.length === 0) {
    return (
      <section className="w-full bg-gray-50 py-16 px-2 text-center">
        <h2 className="text-2xl font-semibold mb-10">
          Their Experience With Us
        </h2>
        <p className="text-gray-700">No testimonials to display yet.</p>
      </section>
    );
  }

  const currentTestimonial = approvedTestimonials[current];

  return (
    <section className="w-full bg-gray-50 py-16 px-2">
      <h2 className="text-center text-2xl font-semibold mb-10">
        Their Experience With Us
      </h2>
      <div className="flex items-center justify-center gap-6 mb-10">
        <button
          onClick={prev}
          className="p-2 rounded-full border cursor-pointer"
        >
          <ArrowLeft />
        </button>

        <div className="max-w-md text-center flex flex-col items-center">
          <h3 className="mt-4 font-bold">
            {currentTestimonial.customer_name || "Anonymous"}
          </h3>
          {currentTestimonial.rating && (
            <div className="text-yellow-500 text-2xl mt-2">
              {"★".repeat(currentTestimonial.rating)}
            </div>
          )}
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
      <BentoReviews />;
    </section>
  );
}