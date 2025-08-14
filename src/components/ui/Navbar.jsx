import { useState } from "react";
import { Menu, X } from "lucide-react"; // lightweight icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/logo.png" // Replace with your logo path
              alt="Enarxi Logo"
              className="h-9 w-auto"
            />
          </a>

          {/* Hamburger Icon */}
          <button
            className="text-gray-700 hover:text-black focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white px-4 pb-4 shadow-md">
          <a
            href="#"
            className="block py-2 text-gray-700 hover:text-black"
          >
            Home
          </a>
          <a
            href="#"
            className="block py-2 text-gray-700 hover:text-black"
          >
            About
          </a>
          <a
            href="#"
            className="block py-2 text-gray-700 hover:text-black"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
