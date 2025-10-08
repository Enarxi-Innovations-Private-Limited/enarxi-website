"use client";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import enarxiLogo from "../../assets/images/enarxiHeaderLogo.svg";

// Navigation items
const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/aboutus" },
];

// Animation variants
const mobileMenuVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const mobileNavItemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex w-[90%] flex-wrap items-center justify-between gap-4 py-4 md:flex-nowrap md:gap-6">
        {/* Logo + Hamburger */}
        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:gap-6">
          <a href="/" aria-label="Go to Enarxi homepage">
            <img
              src={enarxiLogo}
              alt="Enarxi - Company Logo"
              className="h-10 w-auto"
              loading="lazy"
            />
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#09B8DC] rounded"
            aria-controls="primary-navigation"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <X className="size-8 text-[#09B8DC]" />
              ) : (
                <Menu className="size-8 text-gray-800" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav
          id="primary-navigation"
          className="hidden md:flex md:items-center md:justify-center md:space-x-10 text-center md:text-left"
          aria-label="Primary"
        >
          <ul className="flex items-center space-x-10 text-[#4f4f4f] uppercase tracking-wide text-sm lg:text-base xl:text-lg">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `transition text-poppins-md cursor-pointer ${
                      isActive
                        ? "text-[#09B8DC] decoration-2"
                        : "transition-all duration-300 ease-in-out hover:text-[#09B8DC] hover:text-xl"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA Button */}
        <div
          type="button"
          className="hidden relative top-[-2px] w-auto rounded-3xl bg-[#09B8DC] text-lets-connect px-6 py-2.5 text-white transition duration-300 hover:bg-[#08A0C6] md:block"
          aria-label="Lets connect button"
        >
          Let’s Connect
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sliding Nav Menu */}
            <motion.nav
              id="mobile-navigation"
              className="fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-50 md:hidden shadow-2xl"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              aria-label="Mobile Navigation"
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ul className="flex flex-col items-center space-y-6 text-[#4f4f4f] uppercase tracking-wide text-sm lg:text-base">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.label}
                      custom={i}
                      variants={mobileNavItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <NavLink
                        onClick={() => setIsMenuOpen(false)}
                        to={item.href}
                        className={({ isActive }) =>
                          `transition text-poppins-md cursor-pointer text-lg ${
                            isActive
                              ? "text-[#09B8DC]"
                              : "hover:text-[#09B8DC] hover:scale-105 transition-all duration-300"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </motion.li>
                  ))}

                  {/* CTA Button */}
                  <motion.li
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: navItems.length * 0.08 }}
                  >
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full text-white bg-[#09B8DC] rounded-full px-6 py-2.5 hover:bg-[#08A0C6] transition duration-300 text-lg"
                    >
                      Let’s Connect
                    </motion.button>
                  </motion.li>
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
