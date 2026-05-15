import React from "react";
import SEO from "../../components/SEO";
import { motion } from "framer-motion";
import computer from "../../assets/images/computer.svg";

export default function UIUXDesign() {
  return (
    <section className="bg-gradient-to-b from-[#F5FBFF] via-white to-[#F5FBFF] overflow-hidden">
      <SEO 
        title="UI/UX Design Services in Chennai"
        description="Professional UI/UX design services in Chennai. We create user-centric designs, wireframes, and prototypes that enhance user engagement and product usability."
        keywords="UI/UX design chennai, user interface design, user experience design, product design services, wireframing and prototyping india"
      />
      
      <div className="w-[90%] max-w-7xl mx-auto mt-10">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-40 font-bold text-gray-900 font-oswald mb-4">
            UI/UX Design Services
          </h2>
          <p className="text-gray-600 font-poppins max-w-2xl mx-auto text-lg">
            Designing experiences that are not just beautiful, but deeply functional.
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 gap-10 mb-20">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={computer} alt="UI/UX Design" className="max-h-80 object-contain" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 font-oswald">
              User-Centric Design
            </h3>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg">
              Great products are built on great experiences. At Enarxi, our UI/UX design process focuses on understanding your users' needs and translating them into intuitive digital interfaces. From initial wireframing to high-fidelity prototypes and final UI design, we ensure every interaction is seamless and meaningful.
            </p>
            <ul className="space-y-3 text-gray-700 font-poppins">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                User Research & Persona Building
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Information Architecture & Wireframing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Interactive Prototyping
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Visual Design & Brand Integration
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
