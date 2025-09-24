import React from "react";

// If you exported PNG/SVG from Figma:
import computer from "@assets/icons/computer.svg"
import Handpackage from "@assets/icons/package.svg"
import idea from "@assets/icons/idea.svg"
import people from "@assets/icons/people.svg"

// If you prefer lucide-react instead of assets, you can swap the above with icons.
// import { Package, GraduationCap, Users, Cpu } from "lucide-react";

const items = [
  { icon: computer, value: "500+", label: "Projects" },
  { icon: Handpackage, value: "50+", label: "Products" },
  { icon: idea, value: "30+", label: "Events & Workshops" },
  { icon: people, value: "2000+", label: "Participants" },
];

export default function StatsStrip({
  className = "",
  bgClass = "bg-[#0B1A27]", // tweak to match your figma color
}) {
  return (
    <section
      aria-label="Company statistics"
      className={`relative ${bgClass} ${className}`}
    >
      {/* Optional decorative blobs (remove if not needed) */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="container mx-auto max-w-7xl px-6 py-10 md:py-14">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {items.map(({ icon, value, label }) => (
            <li
              key={label}
              className="flex flex-col items-center text-center text-white"
            >
              {/* If using lucide: const Icon = icon; <Icon className="h-12 w-12 mb-3" /> */}
              <img
                src={icon}
                alt=""
                width="64"
                height="64"
                loading="lazy"
                className="mb-3 h-12 w-12 object-contain"
              />
              <p className="text-sm md:text-base">
                <span className="text-lg md:text-xl font-semibold">{value}</span>{" "}
                {label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
