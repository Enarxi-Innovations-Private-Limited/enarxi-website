import { useState } from "react";
import enarxiLogo from "../../assets/images/enarxiHeaderLogo.svg";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/aboutus" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between py-4 mx-auto w-[90%] md:flex-row flex-col md:gap-4">
        {/* Logo + Hamburger */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <a href="/" aria-label="Go to Enarxi homepage">
            <img
              src={enarxiLogo}
              alt="Enarxi - Company Logo"
              className="h-10 w-auto"
              loading="lazy"
            />
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#09B8DC] rounded"
            aria-controls="primary-navigation"
            aria-expanded={isMenuOpen}
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

        {/* Navigation */}
        <nav
          id="primary-navigation"
          className={`w-full md:w-auto ${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-10 mt-4 md:mt-0 
          transition-all duration-300 ease-in-out text-center md:text-left`}
          aria-label="Primary"
        >
          <ul className="flex flex-col md:flex-row items-center md:space-x-10 space-y-4 md:space-y-0 text-black uppercase tracking-wide text-sm lg:text-base xl:text-lg">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  to={item.href}
                  className={({ isActive }) =>
                    `transition font-poppins cursor-pointer ${
                      isActive
                        ? "text-[#09B8DC] underline underline-offset-4 decoration-2"
                        : "hover:text-[#09B8DC]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {/* CTA button in mobile menu */}
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

        {/* Desktop CTA button */}
        <button
          type="button"
          className="hidden md:block w-auto text-white bg-[#09B8DC] rounded-full px-6 py-2.5 hover:bg-[#08A0C6] transition cursor-pointer duration-300"
          aria-label="Lets connect button"
        >
          Let’s Connect
        </button>
      </div>
    </header>
  );
}
