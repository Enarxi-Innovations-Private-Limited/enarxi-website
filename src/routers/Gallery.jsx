import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import gallery1 from "../assets/images/gallery-1.svg";
import gallery2 from "../assets/images/gallery-2.svg";
import gallery3 from "../assets/images/gallery-3.svg";
import gallery4 from "../assets/images/gallery-4.svg";
import gallery5 from "../assets/images/gallery-5.svg";
import gallery6 from "../assets/images/gallery-6.svg";
import gallery7 from "../assets/images/gallery-7.svg";
import gallery8 from "../assets/images/gallery-8.svg";
import gallery9 from "../assets/images/gallery-9.svg";
import gallery10 from "../assets/images/gallery-10.svg";
import gallery11 from "../assets/images/gallery-11.svg";
import gallery12 from "../assets/images/gallery-12.svg";

const Gallery = () => {
  const [selected, setSelected] = useState(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else { 
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [selected]);

  const Galleries = [
    { img: gallery1, p: "CPU microchip electronic components" },
    { img: gallery2, p: "CPU microchip electronic components" },
    { img: gallery3, p: "CPU microchip electronic components" },
    { img: gallery4, p: "CPU microchip electronic components" },
    { img: gallery5, p: "CPU microchip electronic components" },
    { img: gallery6, p: "CPU microchip electronic components" },
    { img: gallery7, p: "CPU microchip electronic components" },
    { img: gallery8, p: "CPU microchip electronic components" },
    { img: gallery9, p: "CPU microchip electronic components" },
    { img: gallery10, p: "CPU microchip electronic components" },
    { img: gallery11, p: "CPU microchip electronic components" },
    { img: gallery12, p: "CPU microchip electronic components" },
  ];

  return (
    <div className="py-12 bg-[#F8FFFF]">
      <div className="flex flex-col mx-auto w-[90%]">
        <h1 className="text-3xl font-bold text-center mb-10 font-oswald">
          Gallery
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Galleries.map((data, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelected(data)}
            >
              <img
                src={data.img}
                alt={data.p}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-600 text-sm font-medium underline">{data.p}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setSelected(null)} // Close modal on backdrop click
          >
            
            <div
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-[90%] relative overflow-hidden animate-fadeIn"
              onClick={(e) => e.stopPropagation()} // Prevent closing on content click
              >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 bg-black text-white rounded-full p-3 cursor-pointer"
                >
                <X size={24} />
              </button>

              {/* Modal Content */}
              <div className="grid md:grid-cols-2">
                <img
                  src={selected.img}
                  alt={selected.p}
                  className="w-full h-full object-cover"
                  />
                <div className="p-6 flex flex-col justify-center">
                  <h2 className="text-xl font-semibold mb-3">{selected.p}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Enarxi Innovations Pvt Ltd was established in the year 2017
                    with a mission to transform how electronics innovation is
                    done. We provide PCB design, prototyping, and manufacturing
                    services with cutting-edge technology and high-quality
                    standards.
                  </p>
                </div>
                  </div>
              </div>
          
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
