"use client";
import React from "react";

import { motion } from "framer-motion";
import software from '@/assets/images/software.svg';

export default function MobileAppDevelopment() {
  return (
    <section className="bg-gradient-to-b from-[#F5FBFF] via-white to-[#F5FBFF] overflow-hidden">
      
      
      <div className="w-[90%] max-w-7xl mx-auto mt-10">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-40 font-bold text-gray-900 font-oswald mb-4">
            Mobile App Development
          </h2>
          <p className="text-gray-600 font-poppins max-w-2xl mx-auto text-lg">
            Empowering your business with intuitive and powerful mobile experiences.
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 gap-10 mb-20">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={software} alt="Mobile App Development" className="max-h-80 object-contain" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 font-oswald">
              Custom Mobile Solutions
            </h3>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg">
              In a mobile-first world, having a robust mobile application is essential. Enarxi provides end-to-end mobile app development services, from conceptualization to deployment on the App Store and Google Play. Whether you need a high-performance native app or a cost-effective cross-platform solution using React Native or Flutter, we deliver apps that are fast, reliable, and user-centric.
            </p>
            <ul className="space-y-3 text-gray-700 font-poppins">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                iOS & Android Native Development
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Cross-Platform (React Native / Flutter)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                IoT Companion Apps
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Enterprise Mobile Solutions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
