import React from "react";
import { FaXTwitter, FaLinkedin } from "react-icons/fa6";

export default function FooterNew() {
  return (
<footer className="relative text-white px-6 py-16 bg-black 
  bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(10,99,240,0.5),rgba(255,255,255,0))]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Left Side */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 via-purple-400 to-indigo-400"></div>
            <span className="text-xl font-semibold">Enarxi</span>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-gray-300">
              <FaXTwitter />
            </a>
            <a href="#" className="hover:text-gray-300">
              <FaLinkedin />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400">©2025 Enarxi. All rights reserved.</p>
        </div>

        {/* Right Side */}
        <div className="grid grid-cols-2 gap-10 text-sm">
          <div className="space-y-3">
            <h4 className="uppercase text-gray-400 tracking-wider text-xs">How We Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-300">Prior Authorization</a></li>
              <li><a href="#" className="hover:text-gray-300">Insurance Monitoring</a></li>
              <li><a href="#" className="hover:text-gray-300">Benefit Checks</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="uppercase text-gray-400 tracking-wider text-xs">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-300">About</a></li>
              <li><a href="#" className="hover:text-gray-300">Case Studies</a></li>
              <li><a href="#" className="hover:text-gray-300">Resources</a></li>
              <li><a href="#" className="hover:text-gray-300">Careers</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="mt-10 flex flex-col md:flex-row justify-end items-center gap-6 text-xs text-gray-400">
        <a href="#" className="hover:text-gray-300">Privacy Policy</a>
        <a href="#" className="hover:text-gray-300">Terms of Use</a>
      </div>
    </footer>
  );
}
