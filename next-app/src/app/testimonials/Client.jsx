"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import BentoReviews from '@/layout/BentoGrid';

export default function Testimonials() {
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedTestimonials();
  }, []);

  const fetchApprovedTestimonials = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'testimonials'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const testimonials = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().createdAt?.toDate().toISOString() || null
      }));
      
      setApprovedTestimonials(testimonials);
    } catch (error) {
      console.error("Error fetching approved testimonials:", error);
      setApprovedTestimonials([]);
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

  const currentTestimonial = approvedTestimonials[current];

  return (
    <section className="w-full bg-gray-50 py-16 px-2">
      <BentoReviews />;
    </section>
  );
}