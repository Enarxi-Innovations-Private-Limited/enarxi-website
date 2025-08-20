import { useState } from "react";
import enarxiLogo from "../assets/images/image.png";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
  },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between py-4 mx-auto w-[90%] md:flex-row flex-col md:gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <a href="/" aria-label="Enarxi Home">
            <img
              src={enarxiLogo}
              alt="Enarxi Logo"
              className="h-10 w-auto"
              loading="lazy"
            />
          </a>
          {/* hamburger icon when mobile view */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-800"
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* header list */}
        <div
          className={`w-full md:w-auto md:flex md:items-center md:space-x-8 ${
            isMenuOpen ? "block" : "hidden"
          } mt-4 md:mt-0 transition-all duration-300 ease-in-out md:flex-grow md:justify-center`}
        >
          <nav className="mb-4 md:mb-0">
            <ul className="flex flex-col md:flex-row md:items-center md:space-x-8 md:space-y-0 space-y-4 text-black uppercase tracking-wide">
              {navItems.map((item) => (
                <li key={item.label} className="relative">
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `transition font-poppins cursor-pointer ${
                        isActive
                          ? "text-[#09B8DC] underline "
                          : "hover:text-[#09B8DC]"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="md:hidden">
                <button
                  type="button"
                  className="w-full text-white bg-[#09B8DC] rounded-full px-6 py-2.5 hover:bg-[#08A0C6] transition duration-300"
                >
                  Let’s Connect
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <button
          type="button"
          className="hidden md:block w-auto text-white bg-[#09B8DC] rounded-full px-6 py-2.5 hover:bg-[#08A0C6] transition duration-300"
        >
          Let’s Connect
        </button>
      </div>
    </header>
  );
}
