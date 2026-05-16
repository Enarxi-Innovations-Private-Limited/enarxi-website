import React, { useState } from "react";
import SEO from "../../components/SEO";
import { motion } from "framer-motion";
import software from "../../assets/images/software.svg";
// Reuse the ContactForm from Services or create a local version
// For now, I'll build a standalone page that feels consistent

export default function WebDevelopment() {
  const [showMeetLoader, setShowMeetLoader] = useState(false);

  return (
    <section className="bg-gradient-to-b from-[#F5FBFF] via-white to-[#F5FBFF] overflow-hidden">
      <SEO 
        title="Web Development Services in Chennai | Enarxi"
        description="Expert custom web development services in Chennai. We build high-performance React, Next.js, and Full-stack web applications tailored for your business needs."
        keywords="web development chennai, custom website development, React developers, Next.js development, full stack web development india, IT software solutions"
        canonical="https://www.enarxi.com/services/web-development"
      />
      
      <div className="w-[90%] max-w-7xl mx-auto mt-10">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-40 font-bold text-gray-900 font-oswald mb-4">
            Web Development Services
          </h2>
          <p className="text-gray-600 font-poppins max-w-2xl mx-auto text-lg">
            Building robust, scalable, and high-performance web applications that drive digital growth.
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 gap-10 mb-20">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={software} alt="Web Development" className="max-h-80 object-contain" loading="lazy" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 font-oswald">
              Custom Web Solutions
            </h3>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg">
              At Enarxi, we specialize in creating modern web platforms that are not just visually stunning but also technically superior. As a leading IT software provider in Chennai, we understand the local and global market demands. From corporate websites to complex enterprise dashboards, we use the latest technology stacks like React, Node.js, and Supabase to ensure your web presence is fast, secure, and future-proof.
            </p>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg mt-4">
              Our web development lifecycle encompasses deep research, scalable architecture design, and rigorous testing. We believe that a powerful digital footprint is essential for modern businesses to thrive, which is why we build SEO-friendly, mobile-first applications that rank well on search engines and engage users effortlessly.
            </p>
            <ul className="space-y-3 text-gray-700 font-poppins">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Progressive Web Applications (PWA)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                E-commerce Platforms
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Admin Dashboards & Portals
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                API Development & Integration
              </li>
            </ul>
          </div>
        </div>

        {/* Similar sections for other services can be added here or in their own pages */}
      </div>
    </section>
  );
}
