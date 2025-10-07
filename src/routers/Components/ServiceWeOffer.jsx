// import React, { useState, useEffect } from "react";
// import { ArrowRight } from "lucide-react";
// import IconProduct from "../../assets/images/product-design.svg";
// import IconMCFirmware from "../../assets/images/mc-firmware.svg";
// import IconPCB from "../../assets/images/pcb-design.svg";

// const services = [
//   {
//     icon: IconProduct,
//     title: "Product Design & Prototyping",
//     text: "Perfect balance of functionality, transformation, and innovation in electronics.",
//   },
//   {
//     icon: IconMCFirmware,
//     title: "Micro Controller & Processor Coding Services",
//     text: "Advanced firmware solutions for microcontroller and processor boards to complement your product.",
//   },
//   {
//     icon: IconPCB,
//     title: "PCB Design & Fabrication",
//     text: "High-density PCB layouts to meet market demands for sophisticated designs driven by miniaturization and semiconductor technology.",
//   },
// ];

// const ServicesSection = () => {
//   const [index, setIndex] = useState(0);

//   // auto-rotate every 3s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % services.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section>
//       <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
//         <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
//           {/* Left column: heading + copy */}
//           <div className="lg:col-span-5">
//             <h2 className="text-oswald-md font-extrabold tracking-tight text-slate-900">
//               Services We Offer You
//             </h2>

//             <p className="mt-6 text-slate-600 leading-relaxed">
//               Our custom software design and development teams can design,
//               build, test, and deliver a product that fits both your vision and
//               market demand. With our support, you will find customers, build
//               income and attract new investors.
//             </p>

//             <a
//               href="/services"
//               className="mt-8 inline-flex items-center gap-2 font-semibold text-slate-900 underline underline-offset-8 decoration-slate-300 hover:decoration-slate-800"
//             >
//               SEE WHAT WE CAN DO
//               <ArrowRight className="h-5 w-5" aria-hidden="true" />
//             </a>
//           </div>

//           {/* Right column: rotating services */}
//           {/* <div className="lg:col-span-7 relative h-[200px]">
//             {services.map((s, i) => (
//               <div
//                 key={s.title}
//                 className={`absolute inset-0 transition-opacity duration-700 ${
//                   i === index ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 <ul className="divide-y divide-slate-200">
//                   <li className="flex items-start gap-6 py-6">
//                     <div className="shrink-0 rounded-2xl bg-slate-100 p-4 ring-1 ring-slate-200">
//                       <img
//                         src={s.icon}
//                         alt={s.title}
//                         width="64"
//                         height="64"
//                         loading="lazy"
//                         className="h-16 w-16 object-contain"
//                       />
//                     </div>

//                     <div>
//                       <h3 className="text-xl font-semibold text-slate-900">
//                         {s.title}
//                       </h3>
//                       <p className="mt-2 text-slate-600">{s.text}</p>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             ))}
//           </div> */}

//         </div>
//       </div>
//     </section>
//   );
// };

// export default ServicesSection;


"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import IconProduct from "../../assets/images/product-design.svg";
import IconMCFirmware from "../../assets/images/mc-firmware.svg";
import IconPCB from "../../assets/images/pcb-design.svg";

// --- Service Data ---
const services = [
  {
    icon: IconProduct,
    title: "Product Design & Prototyping",
    text: "Perfect balance of functionality, transformation, and innovation in electronics.",
  },
  {
    icon: IconMCFirmware,
    title: "Micro Controller & Processor Coding Services",
    text: "Advanced firmware solutions for microcontroller and processor boards to complement your product.",
  },
  {
    icon: IconPCB,
    title: "PCB Design & Fabrication",
    text: "High-density PCB layouts to meet market demands for sophisticated designs driven by miniaturization and semiconductor technology.",
  },
];

// --- Utility Hook ---
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

let interval;

// --- CardStack Component ---
const CardStack = ({ items, offset = 12, scaleFactor = 0.07 }) => {
  const [cards, setCards] = useState(items);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (interval) clearInterval(interval);
    if (!isMobile) {
      interval = setInterval(() => {
        setCards((prev) => {
          const newArray = [...prev];
          newArray.unshift(newArray.pop());
          return newArray;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isMobile]);

  // --- Enable vertical → horizontal scroll for mobile ---
  useEffect(() => {
    if (!isMobile) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isMobile]);

  // --- Mobile View ---
  if (isMobile) {
    return (
      <div
        ref={scrollContainerRef}
        className="flex w-full space-x-4 overflow-x-auto p-1 pb-4 scrollbar-hide"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="w-[85%] flex-shrink-0 rounded-3xl bg-gray-200 p-4 shadow-xl border border-slate-300 snap-center flex flex-col justify-center h-72"
          >
            {card.content}
          </div>
        ))}
      </div>
    );
  }

  // --- Desktop View ---
  return (
    <div className="relative h-72 w-full md:h-80">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute bg-gray-200 h-72 md:h-60 w-full rounded-3xl p-4 md:p-6 shadow-xl border border-slate-300 shadow-black/[0.05] dark:shadow-white/[0.05] flex flex-col justify-center"
          style={{ transformOrigin: "top center" }}
          animate={{
            top: index * -offset,
            scale: 1 - index * scaleFactor,
            zIndex: cards.length - index,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {card.content}
        </motion.div>
      ))}
    </div>
  );
};

// --- Main Section ---
const ServicesSection = () => {
  return (
    <section>
      <div className="mx-auto max-w-7xl md:h-[90dvh] h-full px-6 py-16 md:py-20 flex items-center">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Services We Offer You
            </h2>

            <p className="mt-6 text-slate-600 leading-relaxed">
              Our custom software design and development teams can design,
              build, test, and deliver a product that fits both your vision and
              market demand. With our support, you will find customers, build
              income, and attract new investors.
            </p>

            <a
              href="/services"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-slate-900 underline underline-offset-8 decoration-slate-300 hover:decoration-slate-800"
            >
              SEE WHAT WE CAN DO
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>

          {/* Right column: CardStack */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <CardStack
              items={services.map((s, i) => ({
                id: i,
                content: (
                  <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:gap-6 md:text-left">
                    <div className="shrink-0 rounded-2xl bg-slate-100 p-4 ring-1 ring-slate-200">
                      <img
                        src={s.icon}
                        alt={s.title}
                        loading="lazy"
                        className="h-16 w-16 object-contain md:h-24 md:w-24"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-slate-600">{s.text}</p>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
