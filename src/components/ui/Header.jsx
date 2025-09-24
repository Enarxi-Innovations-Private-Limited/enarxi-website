import { useState } from "react";

import enarxiLogo from "@assets/images/logo/logo.svg";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    dropdown: [
      { label: "Web Development", href: "/services/web-development" },
      { label: "App Development", href: "/services/app-development" },
      { label: "AI Solutions", href: "/services/ai-solutions" },
    ],
  },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
];

export default function Header() {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      {/* Logo */}
      <a href="/" aria-label="Enarxi Home">
        <img
          src={enarxiLogo}
          alt="Enarxi Logo"
          className="h-10 w-auto"
          loading="lazy"
        />
      </a>

      {/* Navigation */}
      <nav>
        <ul className="flex items-center space-x-8 font-semibold text-black uppercase tracking-wide">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {!item.dropdown ? (
                <a href={item.href} className="hover:text-[#09B8DC] transition">
                  {item.label}
                </a>
              ) : (
                <>
                  <div className="flex items-center space-x-1 hover:text-[#09B8DC] transition">
                    <span>{item.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                  {hoveredItem === item.label && (
                    <ul className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md overflow-hidden min-w-[180px] z-50">
                      {item.dropdown.map((sub) => (
                        <li key={sub.label}>
                          <a
                            href={sub.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* CTA Button */}
      <button
        type="button"
        className="text-white bg-[#09B8DC] rounded-full px-6 py-2.5 hover:bg-[#08A0C6] transition duration-300"
      >
        Let’s Connect
      </button>
    </header>
  );
}
