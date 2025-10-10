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
            className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700 ${
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
    { id: 1, images: [gallery1, gallery2, gallery3], title: "CPU Microchip Electronic Components" },
    { id: 2, images: [gallery4, gallery5, gallery6], title: "CPU Microchip Electronic Components" },
    { id: 3, images: [gallery7, gallery8, gallery9], title: "CPU Microchip Electronic Components" },
    { id: 4, images: [gallery10, gallery11, gallery12], title: "CPU Microchip Electronic Components" },
  ];

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header Section */}
      <div className="text-center mb-16">
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex((prev) => (prev + 1) % galleries[selectedIndex - 1].images.length);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                {modalImageIndex + 1} / {galleries[selectedIndex - 1].images.length}
              </div>
            </div>

            {/* Right: Description */}
            <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50">
              <div>
                <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  Gallery Item {selectedIndex}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-6">
                  {galleries[selectedIndex - 1].title}
                </h2>
                <div className="prose prose-gray">
                  <p className="text-gray-600 leading-relaxed text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-base mt-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                </div>
              </div>

              {/* Gallery navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => (prev - 1 < 1 ? galleries.length : prev - 1));
                    setModalImageIndex(0);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
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
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-90 z-20"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
