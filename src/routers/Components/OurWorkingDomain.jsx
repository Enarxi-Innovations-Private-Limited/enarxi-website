import React, { useState, useEffect, useRef, memo } from "react";
import { gsap } from "gsap";

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
// Replace with your real mobile fallback image
import mobileFallback from "../../assets/images/ourDomainHexagonGrid.svg";

function useBreakpoint() {
  const MOBILE_MAX = 760;
  const TABLET_MAX = 1020;

  const [bp, setBp] = useState("unknown");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqMobile = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const mqTablet = window.matchMedia(
      `(min-width: ${MOBILE_MAX + 1}px) and (max-width: ${TABLET_MAX}px)`
    );
    const mqDesktop = window.matchMedia(`(min-width: ${TABLET_MAX + 1}px)`);

    const update = () => {
      if (mqMobile.matches) setBp("mobile");
      else if (mqTablet.matches) setBp("tablet");
      else if (mqDesktop.matches) setBp("desktop");
      else setBp("desktop");
    };

    update();

    const add = (m, fn) =>
      m.addEventListener ? m.addEventListener("change", fn) : m.addListener(fn);
    const remove = (m, fn) =>
      m.removeEventListener
        ? m.removeEventListener("change", fn)
        : m.removeListener(fn);

    add(mqMobile, update);
    add(mqTablet, update);
    add(mqDesktop, update);

    return () => {
      remove(mqMobile, update);
      remove(mqTablet, update);
      remove(mqDesktop, update);
    };
  }, []);

  return bp;
}

const services = [
  {
    title: "Industrial IoT",
    gradient: "from-yellow-200 via-orange-200 to-pink-200",
    icon: numberOne,
  },
  {
    title: "Drone & UAV",
    gradient: "from-blue-200 via-cyan-200 to-blue-300",
    icon: numberTwo,
  },
  {
    title: "Wearables",
    gradient: "from-green-200 via-emerald-200 to-green-300",
    icon: numberThree,
  },
  {
    title: "Rapid Prototyping",
    gradient: "from-purple-200 via-indigo-200 to-blue-200",
    icon: numberFour,
  },
  {
    title: "Security Devices",
    gradient: "from-blue-200 via-indigo-200 to-purple-200",
    icon: numberFive,
  },
  {
    title: "ML & AI",
    gradient: "from-green-200 via-lime-200 to-green-300",
    icon: numberSix,
  },
  {
    title: "Home Automation",
    gradient: "from-pink-200 via-purple-200 to-indigo-200",
    icon: numberSeven,
  },
  {
    title: "Biometric Devices",
    gradient: "from-lime-200 via-green-200 to-emerald-200",
    icon: numberEight,
  },
  {
    title: "Electric Vehicles",
    gradient: "from-green-200 via-teal-200 to-cyan-200",
    icon: numberNine,
  },
  {
    title: "Health Care Devices",
    gradient: "from-green-200 via-emerald-200 to-teal-200",
    icon: numberTen,
  },
  {
    title: "AR & VR",
    gradient: "from-blue-200 via-indigo-200 to-purple-200",
    icon: numberTen,
  },
  {
    title: "BioMedical Equipments",
    gradient: "from-gray-200 via-blue-200 to-indigo-200",
    icon: numberTen,
  },
  {
    title: "Industrial Automation",
    gradient: "from-green-200 via-lime-200 to-yellow-200",
    icon: numberTen,
  },
];

const HexagonCard = memo(function HexagonCard({ service, onClick, cardRef }) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const hoverTl = gsap.timeline({ paused: true });
    hoverTl.to(el, {
      scale: 1.05,
      rotation: 5,
      duration: 0.3,
      ease: "power2.out",
    });
    hoverTl.to(
      el.querySelector(".hexagon-bg"),
      { boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
      0
    );

    el.addEventListener("mouseenter", () => hoverTl.play());
    el.addEventListener("mouseleave", () => hoverTl.reverse());

    return () => {
      el.removeEventListener("mouseenter", () => hoverTl.play());
      el.removeEventListener("mouseleave", () => hoverTl.reverse());
    };
  }, []);

  return (
    <div
      ref={(node) => {
        elRef.current = node;
        if (typeof cardRef === "function") {
          cardRef(node);
        }
      }}
      className="relative w-48 h-48 mx-2 flex-shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`hexagon-bg absolute w-full h-full bg-gradient-to-br ${service.gradient} flex flex-col items-center justify-center text-center p-2 shadow-md transition-all duration-300`}
        style={{
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        <h3 className="text-lg font-poppins font-semibold text-[#444444] leading-tight">
          {service.title}
        </h3>
        <img
          src={service.icon}
          alt={service.title}
          className="w-24 h-24 object-fill"
        />
      </div>
    </div>
  );
});

export default function WorkingDomain({ mobileImage = mobileFallback }) {
  const bp = useBreakpoint();
  const cardRefs = useRef([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (
      bp !== "mobile" &&
      bp !== "unknown" &&
      cardRefs.current.length === services.length
    ) {
      const ctx = gsap.context(() => {
        gsap.from(cardRefs.current, {
          scale: 0.8,
          opacity: 0,
          rotationY: 90,
          duration: 0.6,
          ease: "back.out(1.4)",
          stagger: 0.15,
        });

        const highlightTl = gsap.timeline({ repeat: -1 });
        cardRefs.current.forEach((el, i) => {
          highlightTl.to(
            el,
            {
              filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 1))",
              duration: 1,
            },
            i * 1.5
          );
          highlightTl.to(
            el,
            {
              filter: "none",
              duration: 0.5,
            },
            i * 1.5 + 1
          );
        });
      });

      return () => ctx.revert();
    }
  }, [bp]);

  if (bp === "unknown") {
    return (
      <div className="min-h-[20rem] bg-gray-50 font-sans flex items-center justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Working Domain
          </h2>
          <div
            className="h-48 w-full rounded-md bg-gray-100 animate-pulse"
            aria-hidden
          />
        </div>
      </div>
    );
  }

  const handleCardClick = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  // mobile -> single image to keep DOM light and simplify layout
  if (bp === "mobile") {
    return (
      <div className="h-[40dvh] bg-gray-50 font-sans">
        <main className="max-w-7xl mx-auto px-2 py-2">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Our Working Domain
          </h2>
          <div className="flex justify-center">
            <img
              src={mobileImage}
              alt="Our working domain overview"
              className="w-full max-w-sm object-contain"
              loading="lazy"
            />
          </div>
        </main>
      </div>
    );
  }

  // tablet and desktop -> full interactive grid with animations and modal
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Working Domain
        </h2>
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            {services.slice(0, 4).map((service, index) => (
              <HexagonCard
                key={index}
                service={service}
                onClick={() => handleCardClick(service)}
                cardRef={(el) => (cardRefs.current[index] = el)}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 -mt-12 mb-2">
            {services.slice(4, 9).map((service, index) => (
              <HexagonCard
                key={index}
                service={service}
                onClick={() => handleCardClick(service)}
                cardRef={(el) => (cardRefs.current[index + 4] = el)}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 -mt-12">
            {services.slice(9, 13).map((service, index) => (
              <HexagonCard
                key={index}
                service={service}
                onClick={() => handleCardClick(service)}
                cardRef={(el) => (cardRefs.current[index + 9] = el)}
              />
            ))}
          </div>
        </div>
      </main>

      {selectedService && (
       <div role="dialog"
       aria-modal="true"
       aria-labelledby="modal-title"
       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
     >
       <div className="relative m-4 w-auto max-w-md rounded-lg bg-white p-6 shadow-2xl md:p-8">
         <div className="flex items-start justify-between">
           <h3 id="modal-title" className="text-xl font-oswald text-gray-900">
             {selectedService.title}
           </h3>
           <button
             onClick={closeModal}
             // aria-label makes the button's purpose clear to assistive technologies
             aria-label="Close modal"
             className="rounded-full p-1 text-gray-500 transition-colors bg-gray-200 hover:bg-gray-300 hover:text-gray-800"
           >
             {/* Using an SVG icon is more scalable and accessible than a text '×' */}
             <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth={1.5}
               stroke="currentColor"
               className="h-6 w-6 cursor-pointer"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M6 18L18 6M6 6l12 12"
               />
             </svg>
           </button>
         </div>
         <div className="mt-4 text-gray-600">
           <p>
             Detailed information about {selectedService.title} would go here.
           </p>
         </div>
       </div>
     </div>
      )}
    </div>
  );
}

// // import React from 'react';

// import numberOne from '../../assets/images/1.svg'
// import numberTwo from '../../assets/images/2.svg'
// import numberThree from '../../assets/images/3.svg'
// import numberFour from '../../assets/images/4.svg'
// import numberFive from '../../assets/images/5.svg'
// import numberSix from '../../assets/images/6.svg'
// import numberSeven from '../../assets/images/7.svg'
// import numberEight from '../../assets/images/8.svg'
// import numberNine from '../../assets/images/9.svg'
// import numberTen from '../../assets/images/10.svg'

// const services = [
//   {
//     title: "Industrial IoT",
//     gradient: "from-yellow-200 via-orange-200 to-pink-200",
//     icon: numberOne,
//   },
//   {
//     title: "Drone & UAV",
//     gradient: "from-blue-200 via-cyan-200 to-blue-300",
//     icon: numberTwo,
//   },
//   {
//     title: "Wearables",
//     gradient: "from-green-200 via-emerald-200 to-green-300",
//     icon: numberThree,
//   },
//   {
//     title: "Rapid Prototyping",
//     gradient: "from-purple-200 via-indigo-200 to-blue-200",
//     icon: numberFour,
//   },
//   {
//     title: "Security Devices",
//     gradient: "from-blue-200 via-indigo-200 to-purple-200",
//     icon: numberFive,
//   },
//   {
//     title: "ML & AI",
//     gradient: "from-green-200 via-lime-200 to-green-300",
//     icon: numberSix,
//   },
//   {
//     title: "Home Automation",
//     gradient: "from-pink-200 via-purple-200 to-indigo-200",
//     icon: numberSeven,
//   },
//   {
//     title: "Biometric Devices",
//     gradient: "from-lime-200 via-green-200 to-emerald-200",
//     icon: numberEight,
//   },
//   {
//     title: "Electric Vehicles",
//     gradient: "from-green-200 via-teal-200 to-cyan-200",
//     icon: numberNine,
//   },
//   {
//     title: "Health Care Devices",
//     gradient: "from-green-200 via-emerald-200 to-teal-200",
//     icon: numberTen,
//   },
//   {
//     title: "AR & VR",
//     gradient: "from-blue-200 via-indigo-200 to-purple-200",
//     icon: numberTen,
//   },
//   {
//     title: "BioMedical Equipments",
//     gradient: "from-gray-200 via-blue-200 to-indigo-200",
//     icon: numberTen,
//   },
//   {
//     title: "Industrial Automation",
//     gradient: "from-green-200 via-lime-200 to-yellow-200",
//     icon: numberTen,
//   },
// ];

// // HexagonCard component for displaying each service
// function HexagonCard({ service }) {
//   return (
//     <div className="relative w-48 h-52 mx-2 flex-shrink-0">
//       <div
//         className={`hexagon absolute w-full h-full bg-gradient-to-br ${service.gradient} flex flex-col items-center justify-center text-center p-4 shadow-lg transition-shadow duration-300 cursor-pointer`}
//         style={{
//           clipPath:
//             "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
//         }}
//       >
//         <h3 className="text-lg font-poppins font-semibold text-[#444444] leading-tight">
//           {service.title}
//         </h3>
//         <img
//           src={service.icon}
//           alt={service.title}
//           className="w-28 h-28 object-contain"
//         />
//       </div>
//     </div>
//   );
// }

// // Main App component
// export default function App() {
//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       {/* Main Content - Hexagonal Grid */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Working Domain</h2>
//         <div className="flex flex-col items-center">
//           {/* Row 1 */}
//           <div className="flex flex-wrap justify-center gap-4 mb-2">
//             {services.slice(0, 4).map((service, index) => (
//               <HexagonCard key={index} service={service} />
//             ))}
//           </div>

//           {/* Row 2 */}
//           <div className="flex flex-wrap justify-center gap-4 -mt-12 mb-2">
//             {services.slice(4, 9).map((service, index) => (
//               <HexagonCard key={index} service={service} />
//             ))}
//           </div>

//           {/* Row 3 */}
//           <div className="flex flex-wrap justify-center gap-4 -mt-12">
//             {services.slice(9, 13).map((service, index) => (
//               <HexagonCard key={index} service={service} />
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
