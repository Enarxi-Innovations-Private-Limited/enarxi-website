"use client";
import React from "react";

import { motion } from "framer-motion";
import service_2 from '@/assets/images/service_2.svg';

export default function OEMManufacturing() {
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
            OEM Manufacturing
          </h2>
          <p className="text-gray-600 font-poppins max-w-2xl mx-auto text-lg">
            Your Reliable OEM Partner for Electronic Manufacturing
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 gap-10 mb-20">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={service_2} alt="OEM Manufacturing" className="max-h-80 object-contain" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 font-oswald">
              Scale Your Production
            </h3>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg">
              Got a product idea? We make it happen, start to finish. From sourcing components to SMT/THT assembly, wiring, and final QA - we scale from a one-off prototype to full production runs.
            </p>
            <ul className="space-y-3 text-gray-700 font-poppins">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Component Sourcing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                SMT/THT Assembly
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Quality Assurance & Testing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
