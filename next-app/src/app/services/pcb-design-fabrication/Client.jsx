"use client";
import React from "react";

import { motion } from "framer-motion";
import service_1 from '@/assets/images/service_1.svg';

export default function PCBDesignFabrication() {
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
            PCB Design & Fabrication
          </h2>
          <p className="text-gray-600 font-poppins max-w-2xl mx-auto text-lg">
            Professional PCB Design, Fabrication, and Testing
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 gap-10 mb-20">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={service_1} alt="PCB Design & Fabrication" className="max-h-80 object-contain" loading="lazy" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 font-oswald">
              From Idea to Reality
            </h3>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg">
              At Enarxi, we turn your “crazy circuit ideas” into real, working PCBs. Multi-layer, high-speed, or just a tiny IoT board — we handle the design, fabrication, and testing so you can focus on what really matters: making cool stuff. Based right here in Chennai, our electronics manufacturing facility adheres to strict international standards for quality and precision.
            </p>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg mt-4">
              Our team of engineers excels in minimizing electromagnetic interference (EMI) and optimizing thermal management for compact, high-performance devices. Whether you need rapid prototyping for an upcoming pitch or a robust fabrication run for mass deployment, we ensure your hardware foundation is rock solid.
            </p>
            <ul className="space-y-3 text-gray-700 font-poppins">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Multi-layer PCB Capabilities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                High-Speed Design
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Rigorous Testing Protocols
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
