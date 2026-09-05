"use client";
import React from "react";
import { motion } from "framer-motion";
import aboutsus1 from '@/assets/images/aboutUs1.svg';
import aboutusEye from '@/assets/images/aboutusEye.svg';
import syedCTO from '@/assets/images/syedCTO.jpeg';
import ayazCEO from '@/assets/images/ayazCEO.jpeg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const AboutUs = () => {
  return (
    <div className="w-full font-sans bg-[#F8FFFF]">
      
      {/* About Header */}
      <motion.section
        className="py-12 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="text-4xl font-semibold tracking-wide flex items-center justify-center gap-2 font-oswald">
          About Enarxi
        </h1>
      </motion.section>

      {/* Our Story */}
      <section className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 md:px-12 text-[#0A1524]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-2xl font-bold mb-4 font-oswald">Our Story</h3>
          <p className="text-md leading-relaxed mb-3 font-poppins">
            Enarxi innovations Pvt Ltd was established in the year 2021, but the
            plan for the same was from late 2017. It was founded by{" "}
            <span className="font-bold">Mr. Syed Sameeullah </span> and{" "}
            <span className="font-bold">Mr. Ayaz Shaik</span>. Two different
            people with two different mindsets have come together with a common
            passion of initiating a technology startup in Chennai.
          </p>
          <p className="text-md leading-relaxed mb-3 font-poppins">
            Today, Enarxi stands as a premier partner for <a href="/services/pcb-design-fabrication" className="text-blue-600 hover:underline">electronic manufacturing</a> and <a href="/services/web-development" className="text-blue-600 hover:underline">custom IT services</a>. Based in Chennai, India, we cater to businesses of all sizes, offering scalable solutions from prototype design to mass OEM production. Our goal is to bridge the gap between hardware innovations and digital experiences.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img src={aboutsus1} alt="Our Story" className="w-auto h-auto" />
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="w-[90%] mx-auto grid md:grid-cols-2 gap-8 py-12">
        <motion.div
          className="bg-gray-900 p-6 rounded-lg text-white font-poppins"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h4 className="font-bold text-xl mb-2">Our Mission</h4>
          <p>
            Empower Businesses Of All Sizes To Maximize Their Growth Potential
            And Revenue By Adapting Quickly And Increasing Customer Loyalty.
          </p>
        </motion.div>
        <motion.div
          className="bg-gray-900 p-6 rounded-lg text-white font-poppins"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h4 className="font-bold text-xl mb-2">Our Vision</h4>
          <p>
            To be the most trusted digital transformation partner for businesses
            worldwide, recognized for our innovation, integrity, and
            exceptional results.
          </p>
        </motion.div>
      </section>

      {/* Our Values */}
      <section className="w-[90%] mx-auto px-6 py-12">
        <h3 className="text-3xl font-bold mb-8 text-gray-900 font-oswald">
          Our Values
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {["Integrity", "Innovation", "Collaboration", "Curiosity"].map(
            (value, i) => (
              <motion.div
                key={i}
                className="bg-white shadow-lg shadow-cyan-100 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <img
                  className="w-24 h-24 mb-3 rounded-md bg-gray-200"
                  src={aboutusEye}
                  alt="aboutusEye"
                />
                <h4 className="font-semibold text-xl font-oswald">{value}</h4>
                <p className="text-gray-500 text-sm mt-2 font-poppins">
                  {value} drives our innovation. We constantly explore new
                  technologies to bring better solutions for our clients.
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Our Team */}
      <section className="w-[90%] mx-auto py-12 relative">
        <h3 className="text-3xl font-bold mb-8 font-oswald text-[#0A1524]">
          Our Leadership Team
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {[
            { name: "Mr. Ayaz Shaik", role: "CEO & Founder", img: ayazCEO },
            { name: "Mr. Ayaz Shaik", role: "CEO & Founder", img: ayazCEO },
            { name: "Mr. Ayaz Shaik", role: "CEO & Founder", img: ayazCEO },
            { name: "Mr. Syed", role: "CTO & Founder", img: syedCTO },
            { name: "Mr. Syed", role: "CTO & Founder", img: syedCTO },
            { name: "Mr. Syed", role: "CTO & Founder", img: syedCTO },
          ].map((person, i) => (
            <motion.div
              key={i}
              className="p-4 font-poppins"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <img
                src={person.img}
                alt={person.name}
                className="w-48 h-48 rounded-md object-cover mb-4"
              />
              <h4 className="font-semibold text-[#0A1524]">{person.name}</h4>
              <p className="text-[#676767] font-md text-sm">{person.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
