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

const GalleryItem = ({ images, title }) => {
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
      className="bg-white rounded-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-48">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={title}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-700 ${
              idx === currentImage ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-800 text-sm p-4">{title}</p>
    </div>
  );
};

const Gallery = () => {
  const galleries = [
    { id: 1, images: [gallery1, gallery2, gallery3], title: "CPU Microchip Electronic Components" },
    { id: 2, images: [gallery4, gallery5, gallery6], title: "CPU Microchip Electronic Components" },
    { id: 3, images: [gallery7, gallery8, gallery9], title: "CPU Microchip Electronic Components" },
    { id: 4, images: [gallery10, gallery11, gallery12], title: "CPU Microchip Electronic Components" },
  ];

  return (
    <div className="py-12 bg-[#F8FFFF]">
      <h1 className="text-3xl font-bold text-center mb-10 font-oswald">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%] mx-auto">
        {galleries.map((item) => (
          <GalleryItem key={item.id} images={item.images} title={item.title} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
