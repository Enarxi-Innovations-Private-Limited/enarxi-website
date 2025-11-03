"use client";
import { useState } from "react";
import { href, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, AlertCircle, CheckCircle } from "lucide-react";
import enarxiLogo from "../../assets/images/enarxiHeaderLogo.svg";

import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";


// Navigation items
const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
  {label : "Gallery", href: "/gallery"},
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
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      mode: "onBlur", // validate on blur
    });
  
    const onSubmit = async (data) => {
      const payload = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        location: data.location,
        service: data.service,
        reachout: data.reachout,
        message: data.message,
      };
      try {
        console.log("Form Submitted ✅:", data);
        reset();
        setIsOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
  
        const result = await emailjs.send(
          "service_9kqymv2", 
          "template_by1gtll", 
          payload,
          "DrjvKCy8rORVEmghe" 
        );
  
        console.log(result.text);
        toast.success("Thanks! We'll reach out to you soon 🚀");
        methods.reset();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex w-[90%] flex-wrap items-center justify-between gap-4 py-4 lg:flex-nowrap lg:gap-6">
        {/* Logo + Hamburger */}
        <div className="flex w-full items-center justify-between gap-4 lg:w-auto lg:gap-6">
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
            className="lg:hidden text-gray-800  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#09B8DC] rounded"
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
          className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10 text-center lg:text-left"
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
        onClick={() => setIsOpen(true)}
          type="button"
          className="hidden relative top-[-2px] w-auto rounded-3xl bg-[#09B8DC] text-lets-connect px-6 py-2.5 text-white transition duration-300 hover:bg-[#08A0C6] lg:block hover:cursor-pointer"
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
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sliding Nav Menu */}
            <motion.nav
              id="mobile-navigation"
              className="fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-50 lg:hidden shadow-2xl"
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
                    onClick={() => setIsOpen(true)}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full text-white bg-[#09B8DC] rounded-full px-6 py-2.5 hover:bg-[#08A0C6] transition duration-300 text-lg cursor-pointer"
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

      {isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 ">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-500 hover:text-slate-700 cursor-pointer hover:bg-slate-300 hover:rounded-full "
            >
              <X className="h-6 w-6 " />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Connect With Us
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                    setValueAs: (v) => v.replace(/[^a-zA-Z\s]/g, "").trim(), // remove anything not letters or space
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // block typing numbers
                  }}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                    errors.name
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Invalid Indian phone number",
                    },
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                    minLength: { value: 2, message: "Too short" },
                    setValueAs: (v) => v.trim(),
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                    errors.location
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />{" "}
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Service */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Service Required
                </label>
                <select
                  {...register("service", {
                    required: "Please select a service",
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none cursor-pointer transition-all duration-300 ease-in-out bg-white hover:border-[#09B8DC]/50 hover:shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 ${
                    errors.service
                      ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                      : "border-slate-300 focus:ring-[#09B8DC] focus:border-[#09B8DC]"
                  }`}
                >
                  <option value="" className="text-slate-400">Select a service</option>
                  <option className="py-2 hover:bg-[#09B8DC]/10">Product Design & Prototyping</option>
                  <option className="py-2 hover:bg-[#09B8DC]/10">Micro Controller & Processor Coding</option>
                  <option className="py-2 hover:bg-[#09B8DC]/10">PCB Design & Fabrication</option>
                  <option className="py-2 hover:bg-[#09B8DC]/10">Custom Software Development</option>
                </select>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.service.message}
                  </p>
                )}
              </div>

              {/* Reachout */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  When can we reach out to you?
                </label>

                <select
                  {...register("reachout", {
                    required: "Please select a time",
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none cursor-pointer transition-all duration-300 ease-in-out bg-white hover:border-[#09B8DC]/50 hover:shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 ${
                    errors.reachout
                      ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                      : "border-slate-300 focus:ring-[#09B8DC] focus:border-[#09B8DC]"
                  }`}
                >
                  <option value="" className="text-slate-400">
                    Select a convenient time
                  </option>
                  <option value="Weekdays after 6 PM" className="py-2 hover:bg-[#09B8DC]/10">
                    Weekdays after 6 PM
                  </option>
                  <option value="Weekend after 4 PM" className="py-2 hover:bg-[#09B8DC]/10">Weekend after 4 PM</option>
                  <option value="Anytime this week" className="py-2 hover:bg-[#09B8DC]/10">Anytime this week</option>
                </select>

                {errors.reachout && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.reachout.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#09B8DC] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#08A0C6] cursor-pointer"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="fixed bottom-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-center items-center z-50 md:w-auto w-[80vw] mx-auto"
                >
                  <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-lg border border-slate-200">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-lg font-medium text-slate-900">
                        Thanks for reaching out!
                      </p>
                      <p className="text-md font-normal text-slate-700">
                        We will get back to you shortly.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
</AnimatePresence>
    </header>
  );
}
