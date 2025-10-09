import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import DomainsCluster from '@/components/domains/DomainsCluster';

// Import existing number icons
import numberOne from "../../assets/images/1.svg";
import numberTwo from "../../assets/images/2.svg";
import numberThree from "../../assets/images/3.svg";
import numberFour from "../../assets/images/4.svg";
import numberFive from "../../assets/images/5.svg";
import numberSix from "../../assets/images/6.svg";
import numberSeven from "../../assets/images/7.svg";
import numberEight from "../../assets/images/8.svg";
import numberNine from "../../assets/images/9.svg";
import numberTen from "../../assets/images/10.svg";

// Existing descriptions
const description = {
  iot: "Industrial IoT (IIoT) at Enarxi Innovations Private Limited focuses on connecting machines, sensors, and software to create intelligent, data-driven industrial ecosystems. By integrating advanced electronics, embedded firmware, PCB design, and AI-powered analytics, Enarxi enables factories and industries to monitor operations in real time, predict equipment failures, and optimize performance. The company's expertise in product design, prototyping, and automation allows it to deliver complete end-to-end IIoT solutions—from sensor integration and edge computing to secure cloud connectivity. Through this, Enarxi helps businesses reduce downtime, cut operational costs, and transition toward smart, efficient, and scalable industrial systems.",
  drone: "Drone and UAV solutions at Enarxi Innovations Private Limited focus on designing and developing advanced aerial systems that combine precision engineering, embedded intelligence, and real-time data processing. Enarxi specializes in creating custom drones for industrial, agricultural, defense, and surveillance applications, integrating high-performance sensors, navigation systems, and autonomous flight controls. With expertise in electronics design, PCB development, firmware engineering, and AI-based analytics, the company delivers end-to-end UAV solutions from prototype to deployment. These systems enable clients to capture critical data, perform automated inspections, and enhance operational efficiency across industries, driving innovation in next-generation unmanned aerial technology.",
  wearable: "Wearable technology at Enarxi Innovations Private Limited focuses on developing smart, connected devices that integrate seamlessly with human activity to monitor, analyze, and enhance performance and wellbeing. Leveraging expertise in compact electronics, embedded firmware, PCB design, and low-power wireless communication, Enarxi builds wearables for healthcare, fitness, safety, and industrial applications. The company's end-to-end development approach—from concept and sensor integration to mobile app connectivity and data analytics—enables the creation of reliable, ergonomic, and intelligent products. Through innovation in miniaturization, energy efficiency, and real-time tracking, Enarxi empowers businesses and users with next-generation wearable solutions that blend technology and comfort.",
  rapidPrototyping: "Rapid prototyping at Enarxi Innovations Private Limited enables fast, precise, and cost-effective product development from concept to functional model. Using advanced 3D printing, CNC machining, and quick-turn PCB fabrication, Enarxi transforms design ideas into tangible prototypes within short timelines. The company's expertise in electronics, mechanical design, and embedded systems allows seamless integration of hardware and software during the prototyping phase. This approach helps clients validate designs, test usability, and accelerate time-to-market with minimal risk. By combining innovation, accuracy, and speed, Enarxi delivers high-quality prototypes that drive efficient product innovation and industrial advancement.",
  securityDevices: "Security devices at Enarxi Innovations Private Limited are engineered to deliver advanced protection and intelligent monitoring solutions for people, assets, and infrastructure. Combining embedded systems, IoT connectivity, and smart sensors, Enarxi designs custom surveillance, access control, and alarm systems that ensure safety, reliability, and real-time situational awareness across multiple environments.",
  mlAi: "Machine Learning and Artificial Intelligence (ML & AI) at Enarxi Innovations Private Limited drive innovation across all technology verticals. By embedding intelligent algorithms into hardware and software systems, Enarxi enables predictive analytics, process automation, and real-time decision-making. These AI-driven solutions enhance performance, optimize industrial operations, and unlock data-driven insights for smarter business outcomes.",
  homeAutomation: "Home automation solutions at Enarxi Innovations Private Limited bring intelligence, comfort, and energy efficiency to modern living spaces. Through smart sensors, IoT hubs, and mobile connectivity, Enarxi enables users to automate and control lighting, security, and appliances effortlessly. The company focuses on creating seamless, secure, and user-friendly systems that redefine convenience and home experience.",
  biometricDevices: "Biometric devices developed by Enarxi Innovations Private Limited provide secure, accurate, and efficient identity verification. Utilizing advanced fingerprint, facial, and iris recognition technologies, Enarxi designs reliable access control systems and authentication devices. These solutions enhance safety, prevent unauthorized access, and serve diverse applications across government, corporate, and industrial sectors.",
  electricVehicles: "Enarxi Innovations Private Limited contributes to the electric vehicle revolution by developing intelligent electronic modules, battery management systems, and motor controllers. The company's expertise in embedded systems and power electronics supports reliable, efficient, and scalable EV technology, driving sustainable mobility and innovation in the automotive ecosystem.",
  healthcareDevices: "Healthcare device innovation at Enarxi Innovations Private Limited focuses on building connected medical systems that improve diagnostics, monitoring, and patient care. By integrating IoT connectivity, smart sensors, and data analytics, Enarxi delivers precise, reliable, and user-centric healthcare solutions that advance modern medical technology.",
  arVr: "Augmented Reality (AR) and Virtual Reality (VR) solutions at Enarxi Innovations Private Limited create immersive experiences for industrial training, design visualization, and education. Through a combination of advanced hardware engineering and interactive software systems, Enarxi enables realistic simulations that enhance productivity, learning, and innovation across industries.",
  biomedicalEquipment: "Biomedical equipment developed by Enarxi Innovations Private Limited merges engineering precision with medical innovation. Focusing on diagnostic and monitoring systems, Enarxi designs reliable, high-performance biomedical devices that comply with medical standards and improve patient outcomes through accurate sensing and data-driven insights.",
  industrialAutomation: "Industrial automation at Enarxi Innovations Private Limited integrates IoT, control systems, and intelligent software to optimize manufacturing processes. Enarxi designs and develops custom automation hardware and embedded systems that enhance productivity, reduce manual intervention, and ensure operational safety, empowering industries to achieve smarter, more efficient production."
};

// Transform existing services data to new format
const domains = [
  {
    id: "iot",
    title: "Industrial IoT",
    description: "Connecting machines, sensors, and software to create intelligent ecosystems",
    imageUrl: numberOne,
    size: "large",
    gradient: "from-yellow-500 via-orange-500 to-pink-500",
    key: "iot"
  },
  {
    id: "drone",
    title: "Drone & UAV",
    description: "Advanced aerial systems with precision engineering and real-time processing",
    imageUrl: numberTwo,
    size: "medium",
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    key: "drone"
  },
  {
    id: "wearable",
    title: "Wearables",
    description: "Smart connected devices that integrate seamlessly with human activity",
    imageUrl: numberThree,
    size: "small",
    gradient: "from-green-500 via-emerald-500 to-green-600",
    key: "wearable"
  },
  {
    id: "rapidPrototyping",
    title: "Rapid Prototyping",
    description: "Fast, precise product development from concept to functional model",
    imageUrl: numberFour,
    size: "small",
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
    key: "rapidPrototyping"
  },
  {
    id: "securityDevices",
    title: "Security Devices",
    description: "Advanced protection and intelligent monitoring solutions",
    imageUrl: numberFive,
    size: "large",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    key: "securityDevices"
  },
  {
    id: "mlAi",
    title: "ML & AI",
    description: "Intelligent algorithms driving predictive analytics and automation",
    imageUrl: numberSix,
    size: "small",
    gradient: "from-green-500 via-lime-500 to-green-600",
    key: "mlAi"
  },
  {
    id: "homeAutomation",
    title: "Home Automation",
    description: "Intelligence, comfort, and energy efficiency for modern living",
    imageUrl: numberSeven,
    size: "medium",
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    key: "homeAutomation"
  },
  {
    id: "biometricDevices",
    title: "Biometric Devices",
    description: "Secure, accurate identity verification and access control",
    imageUrl: numberEight,
    size: "large",
    gradient: "from-lime-500 via-green-500 to-emerald-500",
    key: "biometricDevices"
  },
  {
    id: "electricVehicles",
    title: "Electric Vehicles",
    description: "Intelligent electronic modules and battery management systems",
    imageUrl: numberNine,
    size: "small",
    gradient: "from-green-500 via-teal-500 to-cyan-500",
    key: "electricVehicles"
  },
  {
    id: "healthcareDevices",
    title: "Healthcare Devices",
    description: "Connected medical systems improving diagnostics and patient care",
    imageUrl: numberTen,
    size: "large",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    key: "healthcareDevices"
  },
  {
    id: "arVr",
    title: "AR & VR",
    description: "Immersive experiences for training, visualization, and education",
    imageUrl: numberTen,
    size: "large",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    key: "arVr"
  },
  {
    id: "biomedicalEquipment",
    title: "Biomedical Equipment",
    description: "Engineering precision merged with medical innovation",
    imageUrl: numberTen,
    size: "medium",
    gradient: "from-gray-500 via-blue-500 to-indigo-500",
    key: "biomedicalEquipment"
  },
  {
    id: "industrialAutomation",
    title: "Industrial Automation",
    description: "IoT and control systems optimizing manufacturing processes",
    imageUrl: numberTen,
    size: "large",
    gradient: "from-green-500 via-lime-500 to-yellow-500",
    key: "industrialAutomation"
  },
];

/**
 * Modern Working Domain Component
 * Replaces the old hexagon grid with modern asymmetric card cluster
 */
export default function ModernWorkingDomain() {
  const [selectedDomain, setSelectedDomain] = useState(null);

  /**
   * Handle domain card click
   */
  const handleCardClick = (domain) => {
    setSelectedDomain(domain);
    
    // Optional: Track analytics
    // analytics.track('domain_viewed', {
    //   domain_id: domain.id,
    //   domain_title: domain.title,
    // });
  };

  /**
   * Close modal
   */
  const closeModal = () => {
    setSelectedDomain(null);
  };

  /**
   * Handle keyboard close
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Our Working Domains
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Explore our expertise across cutting-edge technologies and industries
        </motion.p>
      </div>

      {/* Domains Cluster */}
      <div className="max-w-7xl mx-auto">
        <DomainsCluster
          domains={domains}
          onCardClick={handleCardClick}
        />
      </div>

      {/* Modal for domain details */}
      <AnimatePresence>
        {selectedDomain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between z-10">
                <h3 id="modal-title" className="text-2xl font-bold text-gray-900">
                  {selectedDomain.title}
                </h3>
                <button
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6">
                {/* Domain Icon */}
                <div className="mb-6 flex justify-center">
                  <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${selectedDomain.gradient} flex items-center justify-center shadow-lg`}>
                    <img
                      src={selectedDomain.imageUrl}
                      alt={selectedDomain.title}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {description[selectedDomain.key]}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={closeModal}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
