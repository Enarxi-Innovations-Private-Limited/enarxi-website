import React from "react";
import SEO from "../../components/SEO";
import { motion } from "framer-motion";
import service_5 from "../../assets/images/service_5.svg";

export default function TechnicalWorkshops() {
  return (
    <section className="bg-gradient-to-b from-[#F5FBFF] via-white to-[#F5FBFF] overflow-hidden">
      <SEO 
        title="Technical Workshops & IoT Training in Chennai"
        description="Hands-on technical workshops on PCB design, embedded systems, IoT, and microcontroller programming. Learn from industry experts at Enarxi."
        keywords="technical workshops chennai, IoT training, embedded systems workshop, PCB design course, microcontroller programming"
      />
      
      <div className="w-[90%] max-w-7xl mx-auto mt-10">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-40 font-bold text-gray-900 font-oswald mb-4">
            Technical Workshops
          </h2>
          <p className="text-gray-600 font-poppins max-w-2xl mx-auto text-lg">
            We don’t just build tech - we teach it.
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 gap-10 mb-20">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={service_5} alt="Technical Workshops" className="max-h-80 object-contain" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 font-oswald">
              Learn From The Experts
            </h3>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg">
              Our hands-on workshops turn curious minds into confident creators. Whether you are a student or a professional, we offer training in PCB design, embedded systems, IoT, and microcontroller programming. Bring your curiosity; leave with working prototypes.
            </p>
            <ul className="space-y-3 text-gray-700 font-poppins">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Hands-On Project Building
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Industry-Standard Tools
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Expert Mentorship
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
