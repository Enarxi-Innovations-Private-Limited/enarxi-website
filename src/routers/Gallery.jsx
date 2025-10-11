import React, { useState, useEffect } from "react";

import gallery1 from "../assets/images/gallery-1.jpg";
import gallery2 from "../assets/images/gallery-2.jpg";
import gallery3 from "../assets/images/gallery-3.jpg";
import gallery4 from "../assets/images/gallery-4.jpg";
import gallery5 from "../assets/images/gallery-5.svg";
import gallery6 from "../assets/images/gallery-6.svg";
import gallery7 from "../assets/images/gallery-7.svg";
import gallery8 from "../assets/images/gallery-8.svg";
import gallery9 from "../assets/images/gallery-9.svg";
import gallery10 from "../assets/images/gallery-10.svg";
import gallery11 from "../assets/images/gallery-11.svg";
import gallery12 from "../assets/images/gallery-12.svg";

const GalleryItem = ({ images, title, onClick }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (hovered) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      setCurrentImage(0);
    }
    return () => clearInterval(interval);
  }, [hovered, images.length]);

  return (
    <div
      className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-700 hover:-translate-y-2 md:hover:-translate-y-3 hover:shadow-2xl shadow-md md:shadow-lg border border-gray-100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={title}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-all duration-700 ${
              idx === currentImage ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          />
        ))}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Image counter indicator */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 md:px-3 rounded-full font-medium">
          {currentImage + 1} / {images.length}
        </div>
      </div>
      
      <div className="p-4 md:p-5">
        <h3 className="text-gray-800 font-semibold text-sm md:text-base leading-relaxed group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        <div className="mt-2 flex items-center text-xs md:text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
          <span>View Details</span>
          <svg className="w-3 h-3 md:w-4 md:h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const galleries = [
    { 
      id: 1, 
      images: [gallery1, gallery2, gallery3], 
      title: "CPU Microchip Electronic Components",
      imageDescriptions: [
        {
          heading: "CPU Architecture & Core Components",
          description: "A CPU microchip is the central computing unit of any electronic system, built from billions of transistors etched on a silicon wafer. It includes the Arithmetic Logic Unit (ALU), Control Unit (CU), and registers, along with cache memory and multi-core architectures for parallel processing.",
          details: "Modern CPUs feature multiple cores, each capable of executing instructions independently. The integration of L1, L2, and L3 cache hierarchies ensures rapid data access, while advanced branch prediction and out-of-order execution maximize throughput.",
          industry: "Industry leaders such as Intel, AMD, TSMC, and Samsung operate at 3nm process nodes, advancing transistor design and efficiency."
        },
        {
          heading: "Semiconductor Fabrication Process",
          description: "Fabrication involves photolithography, doping, etching, and metallization, using nanometer-scale EUV (Extreme Ultraviolet) technology. This process creates intricate circuit patterns on silicon wafers with precision down to atomic layers.",
          details: "Materials like copper interconnects and high-k metal gates reduce power loss and improve signal integrity. The manufacturing process takes place in ultra-clean rooms with air quality 10,000 times cleaner than a hospital operating room.",
          industry: "TSMC and Samsung lead in advanced node manufacturing, with ASML providing cutting-edge EUV lithography equipment for sub-5nm production."
        },
        {
          heading: "Testing & Quality Assurance",
          description: "After fabrication, each chip undergoes rigorous testing including wafer-level testing, burn-in tests, and functional verification. Only chips that pass all quality benchmarks are packaged and shipped.",
          details: "Advanced testing methodologies include thermal cycling, voltage stress testing, and performance validation across different operating conditions. Chips are binned based on their performance characteristics, with higher-performing units sold as premium products.",
          industry: "Quality standards like JEDEC and ISO 9001 ensure reliability, with major manufacturers achieving defect rates below 0.1% through automated inspection and AI-driven quality control."
        }
      ]
    },
    { 
      id: 2, 
      images: [gallery4, gallery5, gallery6], 
      title: "Mobile Phone Chip Manufacturing",
      imageDescriptions: [
        {
          heading: "System-on-Chip (SoC) Integration",
          description: "Mobile chips or System-on-Chips (SoCs) combine CPU, GPU, modem, DSP, and AI accelerators into one compact silicon die. Design starts with RTL coding and verification, followed by wafer fabrication using FinFET or GAAFET transistors at 5nm or smaller.",
          details: "SoCs integrate heterogeneous computing elements including high-performance cores, efficiency cores, neural processing units (NPUs), and image signal processors (ISPs). This integration reduces power consumption and improves performance per watt.",
          industry: "Qualcomm's Snapdragon, Apple's A-series and M-series, and MediaTek's Dimensity chips lead the mobile SoC market with advanced 4nm and 3nm process technologies."
        },
        {
          heading: "Advanced Packaging Technologies",
          description: "Packaging uses Fan-Out Wafer-Level (FOWLP) or 3D stacking techniques for better performance and compactness. These methods allow for higher density interconnects and improved thermal management.",
          details: "3D stacking enables vertical integration of memory and logic chips, reducing latency and power consumption. Technologies like TSMC's InFO (Integrated Fan-Out) and Samsung's I-Cube provide superior electrical performance compared to traditional packaging.",
          industry: "Major foundries invest billions in advanced packaging R&D, with chiplet architectures becoming increasingly popular for mixing different process nodes in a single package."
        },
        {
          heading: "Performance Testing & Optimization",
          description: "Each chip is tested for power efficiency, processing speed, thermal characteristics, and 5G/Wi-Fi connectivity. Comprehensive validation ensures devices meet stringent mobile performance standards.",
          details: "Testing includes benchmark suites for CPU/GPU performance, AI inference speed, camera processing capabilities, and battery life optimization. Chips are validated across different temperature ranges and usage scenarios.",
          industry: "Companies like Qualcomm, Apple, and MediaTek focus on balancing peak performance with battery life, integrating advanced AI capabilities and 5G modems for flagship mobile devices."
        }
      ]
    },
    { 
      id: 3, 
      images: [gallery7, gallery8, gallery9], 
      title: "Embedded System Design Engineering",
      imageDescriptions: [
        {
          heading: "Hardware & Software Co-Design",
          description: "Embedded systems are specialized computers built for dedicated functions inside larger products. Engineers design both hardware (microcontrollers, sensors, PCBs) and software (firmware, drivers, RTOS) in an integrated approach.",
          details: "The design process involves selecting appropriate microcontrollers (ARM Cortex-M, RISC-V), designing power management circuits, and implementing communication protocols. Real-Time Operating Systems (RTOS) like FreeRTOS or Zephyr provide deterministic task scheduling.",
          industry: "ARM dominates the embedded processor market with Cortex-M series, while RISC-V is gaining traction as an open-source alternative for IoT and edge computing applications."
        },
        {
          heading: "Communication Protocols & Interfaces",
          description: "These systems rely on interfaces like SPI, I2C, UART, and CAN for real-time communication between components. Protocol selection depends on speed requirements, distance, and number of connected devices.",
          details: "SPI offers high-speed serial communication for sensors and displays, I2C enables multi-device communication with just two wires, UART provides simple point-to-point serial communication, and CAN bus ensures reliable automotive and industrial networking.",
          industry: "Modern embedded systems increasingly adopt Ethernet, USB, and wireless protocols (BLE, Zigbee, LoRa) for IoT connectivity and edge computing applications."
        },
        {
          heading: "Applications & Future Trends",
          description: "Embedded systems are used in industrial automation, consumer electronics, automotive control, and medical devices. New trends include IoT connectivity, edge AI, and secure firmware to prevent cyber attacks.",
          details: "Edge AI enables on-device machine learning for applications like predictive maintenance, voice recognition, and computer vision. Security features include secure boot, encrypted firmware updates, and hardware-based cryptographic accelerators.",
          industry: "The embedded systems market is projected to reach $116 billion by 2025, driven by IoT expansion, Industry 4.0 automation, and the proliferation of smart devices across all sectors."
        }
      ]
    },
    { 
      id: 4, 
      images: [gallery10, gallery11, gallery12], 
      title: "Automotive Electronics Manufacturing",
      imageDescriptions: [
        {
          heading: "Electronic Control Units (ECUs)",
          description: "Automotive electronics integrate embedded control units (ECUs) with sensors and actuators for systems like engine control, safety, infotainment, and ADAS (Advanced Driver Assistance Systems). Modern vehicles contain 50-100 ECUs managing different functions.",
          details: "ECUs control critical functions including fuel injection, anti-lock braking (ABS), electronic stability control (ESC), airbag deployment, and adaptive cruise control. Each ECU runs specialized firmware optimized for real-time performance and safety.",
          industry: "Bosch, Continental, and Denso are leading ECU manufacturers, with increasing focus on domain controllers that consolidate multiple ECU functions to reduce complexity and cost."
        },
        {
          heading: "Safety Standards & Reliability",
          description: "Components must meet strict AEC-Q100 and ISO 26262 standards for automotive safety and reliability. These standards ensure electronics can withstand extreme temperatures, vibrations, and electromagnetic interference.",
          details: "Manufacturing includes PCB assembly with automotive-grade components, extensive testing protocols, and reliability validation under extreme conditions (-40°C to +125°C). Functional safety requirements demand redundancy and fail-safe mechanisms.",
          industry: "ISO 26262 defines Automotive Safety Integrity Levels (ASIL) from A to D, with ASIL-D representing the highest safety requirements for critical systems like steering and braking."
        },
        {
          heading: "Electric Vehicle Power Electronics",
          description: "Power systems use SiC (Silicon Carbide) and GaN (Gallium Nitride) semiconductors for higher efficiency, especially in electric vehicles (EVs). These wide-bandgap materials enable faster switching and reduced energy losses.",
          details: "EV power electronics include inverters for motor control, DC-DC converters for battery management, and onboard chargers. SiC and GaN devices operate at higher temperatures and frequencies, improving power density and reducing cooling requirements.",
          industry: "Leaders such as Bosch, Continental, Denso, and NXP are driving advancements in vehicle electrification, autonomous driving systems, and AI-based predictive maintenance for next-generation mobility."
        }
      ]
    },
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedIndex]);

  // Keyboard navigation for gallery posts
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && selectedIndex > 1) {
        setSelectedIndex((prev) => prev - 1);
        setModalImageIndex(0);
      } else if (e.key === 'ArrowRight' && selectedIndex < galleries.length) {
        setSelectedIndex((prev) => prev + 1);
        setModalImageIndex(0);
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, galleries.length]);

  // Touch swipe handlers for mobile navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedIndex < galleries.length) {
      setSelectedIndex((prev) => prev + 1);
      setModalImageIndex(0);
    }
    if (isRightSwipe && selectedIndex > 1) {
      setSelectedIndex((prev) => prev - 1);
      setModalImageIndex(0);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-oswald mb-3 md:mb-4 tracking-tight">
          Gallery
        </h1>
        <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full" />
        <p className="mt-3 md:mt-4 text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4">
          Explore our collection of premium electronic components
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 w-[90%] max-w-7xl mx-auto">
        {galleries.map((item) => (
          <GalleryItem 
            key={item.id} 
            images={item.images} 
            title={item.title} 
            onClick={() => { 
              setSelectedIndex(item.id); 
              setModalImageIndex(0);
            }} 
          />
        ))}
      </div>

      {/* Premium Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-4 animate-fadeIn overflow-hidden"
          onClick={() => setSelectedIndex(null)}
        >
          <div 
            className="bg-white w-full max-w-6xl h-[92vh] md:h-[85vh] flex flex-col md:flex-row rounded-2xl md:rounded-3xl overflow-hidden relative shadow-2xl transform transition-all duration-500 scale-100"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            
            {/* Left: Image Carousel */}
            <div className="w-full md:w-3/5 h-[45vh] md:h-full relative bg-gradient-to-br from-gray-900 to-gray-800 flex-shrink-0">
              <img
                src={galleries[selectedIndex - 1].images[modalImageIndex]}
                alt={galleries[selectedIndex - 1].title}
                className="w-full h-full object-contain transition-all duration-500"
              />
              
              {/* Image navigation arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex((prev) => (prev - 1 + galleries[selectedIndex - 1].images.length) % galleries[selectedIndex - 1].images.length);
                }}
                className="absolute cursor-pointer left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 md:p-2 shadow-lg transition-all duration-300 z-10"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex((prev) => (prev + 1) % galleries[selectedIndex - 1].images.length);
                }}
                className="absolute cursor-pointer right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 md:p-2 shadow-lg transition-all duration-300 z-10"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium">
                {modalImageIndex + 1} / {galleries[selectedIndex - 1].images.length}
              </div>
            </div>

            {/* Right: Description */}
            <div className="w-full md:w-2/5 p-5 md:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50 overflow-y-auto flex-1 min-h-0">
              <div key={`${selectedIndex}-${modalImageIndex}`} className="animate-fadeIn">
                <div className="inline-block px-3 md:px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
                  Product No: {selectedIndex}
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2 md:mb-3">
                  {galleries[selectedIndex - 1].title}
                </h2>
                {/* <h3 className="text-lg md:text-xl font-semibold text-blue-600 mb-4 md:mb-6 transition-all duration-300">
                  {galleries[selectedIndex - 1].imageDescriptions[modalImageIndex].heading}
                </h3> */}
                <div className="space-y-3 md:space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {galleries[selectedIndex - 1].imageDescriptions[modalImageIndex].description}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {galleries[selectedIndex - 1].imageDescriptions[modalImageIndex].details}
                  </p>
                  {galleries[selectedIndex - 1].imageDescriptions[modalImageIndex].industry && (
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                      {galleries[selectedIndex - 1].imageDescriptions[modalImageIndex].industry}
                    </p>
                  )}
                </div>
              </div>

              {/* Gallery navigation */}
              {/* <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => (prev - 1 < 1 ? galleries.length : prev - 1));
                    setModalImageIndex(0);
                  }}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => (prev % galleries.length) + 1);
                    setModalImageIndex(0);
                  }}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div> */}
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-3 right-3 md:top-6 md:right-6 cursor-pointer bg-white/90 hover:bg-white rounded-full p-1.5 md:p-2 shadow-lg transition-all duration-300 hover:scale-110 z-20"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* External Navigation Arrows - Outside Modal (Instagram Style) */}
          {/* Left Arrow - Previous Post - Hidden on mobile */}
          {selectedIndex > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => prev - 1);
                setModalImageIndex(0);
              }}
              className="hidden md:flex absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 md:p-3 shadow-xl transition-all duration-300 hover:scale-110 z-10 group cursor-pointer items-center justify-center"
              aria-label="Previous gallery item"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow - Next Post - Hidden on mobile */}
          {selectedIndex < galleries.length && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => prev + 1);
                setModalImageIndex(0);
              }}
              className="hidden md:flex absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 md:p-3 shadow-xl transition-all duration-300 hover:scale-110 z-10 group cursor-pointer items-center justify-center"
              aria-label="Next gallery item"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
