// src/components/FeatureCard.jsx
import React from "react";

export function FeatureCard({ icon, title }) {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.5)]">
      <img src={icon} alt={title} className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}
