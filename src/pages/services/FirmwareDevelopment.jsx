import React from "react";
import SEO from "../../components/SEO";
import { motion } from "framer-motion";
import service_3 from "../../assets/images/service_3.svg";

export default function FirmwareDevelopment() {
  return (
    <section className="bg-gradient-to-b from-[#F5FBFF] via-white to-[#F5FBFF] overflow-hidden">
      <SEO 
        title="Embedded Firmware Development Services in Chennai"
        description="Expert microcontroller and processor firmware development. STM32, ESP32, ARM programming for IoT and embedded systems."
        keywords="embedded firmware development chennai, STM32 programming, ESP32 development, embedded C developer, IoT firmware services"
      />
      
      <div className="w-[90%] max-w-7xl mx-auto mt-10">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-40 font-bold text-gray-900 font-oswald mb-4">
            Firmware Development
          </h2>
          <p className="text-gray-600 font-poppins max-w-2xl mx-auto text-lg">
            The brains behind your hardware.
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 gap-10 mb-20">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={service_3} alt="Firmware Development" className="max-h-80 object-contain" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 font-oswald">
              Smart Devices Need Smart Code
            </h3>
            <p className="text-gray-600 leading-relaxed font-poppins text-lg">
              We speak fluent C, C++, and occasionally “why isn’t this compiling?” From STM32 to ESP32 and ARM processors, we develop secure and efficient firmware for sensors, actuators, and communication protocols (CAN, Modbus, I²C, SPI, UART).
            </p>
            <ul className="space-y-3 text-gray-700 font-poppins">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Microcontroller Programming (STM32, ESP32, ARM)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                IoT & Wireless Protocols
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Firmware Security & OTA Updates
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
