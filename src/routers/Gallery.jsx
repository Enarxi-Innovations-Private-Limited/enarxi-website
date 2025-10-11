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
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl shadow-lg border border-gray-100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full h-64 overflow-hidden">
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
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
          {currentImage + 1} / {images.length}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-gray-800 font-semibold text-base leading-relaxed group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        <div className="mt-2 flex items-center text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
          <span>View Details</span>
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  const galleries = [
    { 
      id: 1, 
      images: [gallery1, gallery2, gallery3], 
      title: "CPU Microchip Electronic Components",
      description: "A CPU microchip is the central computing unit of any electronic system, built from billions of transistors etched on a silicon wafer. It includes the Arithmetic Logic Unit (ALU), Control Unit (CU), and registers, along with cache memory and multi-core architectures for parallel processing.",
      details: "Fabrication involves photolithography, doping, etching, and metallization, using nanometer-scale EUV technology. Materials like copper interconnects and high-k metal gates reduce power loss. After testing and packaging, the chips are integrated into computing boards.",
      industry: "Industry leaders such as Intel, AMD, TSMC, and Samsung operate at 3nm process nodes, advancing transistor design and efficiency."
    },
    { 
      id: 2, 
      images: [gallery4, gallery5, gallery6], 
      title: "Mobile Phone Chip Manufacturing",
      description: "Mobile chips or System-on-Chips (SoCs) combine CPU, GPU, modem, DSP, and AI accelerators into one compact silicon die. Design starts with RTL coding and verification, followed by wafer fabrication using FinFET or GAAFET transistors at 5nm or smaller.",
      details: "Packaging uses Fan-Out Wafer-Level or 3D stacking for better performance and compactness. Each chip is tested for power, speed, and thermal efficiency.",
      industry: "Firms like Qualcomm, Apple, and MediaTek focus on balancing performance and battery life, integrating AI and 5G for high-end mobile devices."
    },
    { 
      id: 3, 
      images: [gallery7, gallery8, gallery9], 
      title: "Embedded System Design Engineering",
      description: "Embedded systems are specialized computers built for dedicated functions inside larger products. Engineers design both hardware (microcontrollers, sensors, PCBs) and software (firmware, drivers, RTOS). These systems rely on interfaces like SPI, I2C, UART, and CAN for real-time communication.",
      details: "They are used in industrial automation, consumer electronics, automotive control, and medical devices. New trends include IoT connectivity, edge AI, and secure firmware to prevent cyber attacks.",
      industry: ""
    },
    { 
      id: 4, 
      images: [gallery10, gallery11, gallery12], 
      title: "Automotive Electronics Manufacturing",
      description: "Automotive electronics integrate embedded control units (ECUs) with sensors and actuators for systems like engine control, safety, infotainment, and ADAS. Components must meet strict AEC-Q100 and ISO 26262 standards.",
      details: "Manufacturing includes PCB assembly, testing, and reliability validation under extreme conditions. Power systems use SiC and GaN semiconductors for higher efficiency, especially in electric vehicles (EVs).",
      industry: "Leaders such as Bosch, Continental, Denso, and NXP are driving advancements in vehicle automation, EV power management, and AI-based control systems."
    },
  ];

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

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-900 font-oswald mb-4 tracking-tight">
          Gallery
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full" />
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Explore our collection of premium electronic components
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-[90%] max-w-7xl mx-auto">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setSelectedIndex(null)}
        >
          <div 
            className="bg-white w-full max-w-6xl h-[85vh] flex flex-col md:flex-row rounded-3xl overflow-hidden relative shadow-2xl transform transition-all duration-500 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Left: Image Carousel */}
            <div className="w-full md:w-3/5 relative bg-gradient-to-br from-gray-900 to-gray-800">
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
                className="absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 shadow-lg transition-all duration-300 z-10"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex((prev) => (prev + 1) % galleries[selectedIndex - 1].images.length);
                }}
                className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 shadow-lg transition-all duration-300 z-10"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                {modalImageIndex + 1} / {galleries[selectedIndex - 1].images.length}
              </div>
            </div>

            {/* Right: Description */}
            <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50 overflow-y-auto">
              <div>
                <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  Gallery Item {selectedIndex}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-6">
                  {galleries[selectedIndex - 1].title}
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-base transition-opacity duration-500 opacity-100 ">
                    {galleries[selectedIndex - 1].description}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {galleries[selectedIndex - 1].details}
                  </p>
                  {galleries[selectedIndex - 1].industry && (
                    <p className="text-gray-600 leading-relaxed text-base font-medium">
                      {galleries[selectedIndex - 1].industry}
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
              className="absolute top-6 right-6 cursor-pointer bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 z-20"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* External Navigation Arrows - Outside Modal (Instagram Style) */}
          {/* Left Arrow - Previous Post */}
          {selectedIndex > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => prev - 1);
                setModalImageIndex(0);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 z-10 group cursor-pointer"
              aria-label="Previous gallery item"
            >
              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow - Next Post */}
          {selectedIndex < galleries.length && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => prev + 1);
                setModalImageIndex(0);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 z-10 group cursor-pointer"
              aria-label="Next gallery item"
            >
              <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
