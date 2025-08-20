import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import person1 from "../assets/images/testi_person1.svg";
import person2 from "../assets/images/testi_person2.svg";
import person3 from "../assets/images/testi_person3.svg";
import BentoReviews from "@/components/BentroGrid";

const testimonials = [
  {
    name: "Vrini",
    role: "Assistant Professor, SRMIST, Ramapuram",
    img: person1,
    review: "Good job! Team Enarxi.",
    rating: 5,
  },
  {
    name: "Mohamed Shuaib",
    role: "HOD & Associate Professor, Crescent Institute of Science and Technology",
    img: person2,
    review:
      "Course designed for students from top researchers, making learning engaging and impactful.",
    rating: 5,
  },
  {
    name: "Mohamed Shuaib",
    role: "HOD & Assistant Professor, Crescent Institute of Science and Technology",
    img: person3,
    review: "Good job! Team Enarxi.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () =>
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  const prev = () =>
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

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
          <img
            src={testimonials[current].img}
            alt={testimonials[current].name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <h3 className="mt-4 font-bold">{testimonials[current].name}</h3>
          <p className="text-sm text-gray-500">{testimonials[current].role}</p>
          <p className="mt-2 text-gray-700 italic">
            "{testimonials[current].review}"
          </p>
          <div className="flex justify-center mt-2">
            {"⭐".repeat(testimonials[current].rating)}
          </div>
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
