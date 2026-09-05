"use client";
import React from "react";

import { motion } from "framer-motion";
import service_4 from '@/assets/images/service_4.svg';

export default function ThreeDPrinting() {
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
            3D Printing Services
          </h2>
          <p className="text-gray-600 font-poppins max-w-2xl mx-auto text-lg">
            Your ideas, printed into reality.
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 gap-10 mb-20">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={service_4} alt="3D Printing" className="max-h-80 object-contain" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 font-oswald">
              Rapid Prototyping
            </h3>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg">
              From quick concept models to functional prototypes, we deliver precise, clean, and ready-to-use 3D prints. It’s the perfect way to test, tweak, and bring your designs to life — one layer at a time.
            </p>
            <ul className="space-y-3 text-gray-700 font-poppins">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Concept Modeling
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Functional Prototyping
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Custom Enclosures
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
