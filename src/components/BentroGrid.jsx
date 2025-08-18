import React from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "TechnoTweets",
    text: "Good Job Team Enarxi.",
    img: "https://i.pravatar.cc/100?img=1",
    stars: 5,
    size: "md",
  },
  {
    id: 2,
    name: "TechnoTweets",
    text: "Alcohol Based Exposures Through Inadvertently Consuming Hand Sanitizer, Have Been Observed To Produce, Alcohol Based Exposures Through Inadvertently Consuming Hand Sanitizer, Have Been Observed To Produce, Alcohol Based Exposures Through Inadvertently Consuming Hand Sanitizer, Have Been Observed To Produce, Alcohol Based Exposures Through Inadvertently Consuming Hand Sanitizer, Have Been Observed To Produce, ",
    img: "https://i.pravatar.cc/100?img=2",
    stars: 5,
    size: "lg",
  },
  {
    id: 3,
    name: "TechnoTweets",
    text: "Good Job Team Enarxi.",
    img: "https://i.pravatar.cc/100?img=3",
    stars: 5,
    size: "sm",
  },
  {
    id: 4,
    name: "TechnoTweets",
    text: "Good Job Team Enarxi.",
    img: "https://i.pravatar.cc/100?img=4",
    stars: 5,
    size: "sm",
  },
  {
    id: 5,
    name: "TechnoTweets",
    text: "The Study Was Repeated With Three Brands Of Hand Sanitizers Containing 55%, 85%, And 95% Ethanol.",
    img: "https://i.pravatar.cc/100?img=5",
    stars: 5,
    size: "lg",
  },
  {
    id: 6,
    name: "TechnoTweets",
    text: "Simultaneously We Had A Problem With Prisoner Drunkenness That We Couldn’t Figure Out. I Mean, The",
    img: "https://i.pravatar.cc/100?img=6",
    stars: 5,
    size: "lg",
  },
];

export default function BentoReviews() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-block bg-gray-800 text-white px-6 py-8 gap-10 rounded-2xl shadow w-full">
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

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(150px,auto)]">
        {reviews.map((r) => (
          <div
            key={r.id}
            className={`bg-gray-900 text-white p-5 rounded-xl shadow flex flex-col justify-between ${
              r.size === "lg"
                ? "lg:col-span-2 lg:row-span-2"
                : r.size === "md"
                ? "lg:col-span-1 lg:row-span-1"
                : "lg:col-span-1"
            }`}
          >
            {/* Profile */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={r.img}
                alt={r.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
              />
              <h3 className="font-semibold">{r.name}</h3>
            </div>

            {/* Text */}
            <p className="text-sm text-gray-300 mb-3">{r.text}</p>

            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: r.stars }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
