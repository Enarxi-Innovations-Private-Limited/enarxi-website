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

const description = {
  iot: "Industrial IoT (IIoT) at Enarxi Innovations Private Limited focuses on connecting machines, sensors, and software to create intelligent, data-driven industrial ecosystems. By integrating advanced electronics, embedded firmware, PCB design, and AI-powered analytics, Enarxi enables factories and industries to monitor operations in real time, predict equipment failures, and optimize performance. The company’s expertise in product design, prototyping, and automation allows it to deliver complete end-to-end IIoT solutions—from sensor integration and edge computing to secure cloud connectivity. Through this, Enarxi helps businesses reduce downtime, cut operational costs, and transition toward smart, efficient, and scalable industrial systems.",
  drone: "Drone and UAV solutions at Enarxi Innovations Private Limited focus on designing and developing advanced aerial systems that combine precision engineering, embedded intelligence, and real-time data processing. Enarxi specializes in creating custom drones for industrial, agricultural, defense, and surveillance applications, integrating high-performance sensors, navigation systems, and autonomous flight controls. With expertise in electronics design, PCB development, firmware engineering, and AI-based analytics, the company delivers end-to-end UAV solutions from prototype to deployment. These systems enable clients to capture critical data, perform automated inspections, and enhance operational efficiency across industries, driving innovation in next-generation unmanned aerial technology.",
  wearable: "Wearable technology at Enarxi Innovations Private Limited focuses on developing smart, connected devices that integrate seamlessly with human activity to monitor, analyze, and enhance performance and wellbeing. Leveraging expertise in compact electronics, embedded firmware, PCB design, and low-power wireless communication, Enarxi builds wearables for healthcare, fitness, safety, and industrial applications. The company’s end-to-end development approach—from concept and sensor integration to mobile app connectivity and data analytics—enables the creation of reliable, ergonomic, and intelligent products. Through innovation in miniaturization, energy efficiency, and real-time tracking, Enarxi empowers businesses and users with next-generation wearable solutions that blend technology and comfort.",
  rapidPrototyping: "Rapid prototyping at Enarxi Innovations Private Limited enables fast, precise, and cost-effective product development from concept to functional model. Using advanced 3D printing, CNC machining, and quick-turn PCB fabrication, Enarxi transforms design ideas into tangible prototypes within short timelines. The company’s expertise in electronics, mechanical design, and embedded systems allows seamless integration of hardware and software during the prototyping phase. This approach helps clients validate designs, test usability, and accelerate time-to-market with minimal risk. By combining innovation, accuracy, and speed, Enarxi delivers high-quality prototypes that drive efficient product innovation and industrial advancement.",
  securityDevices: "Security devices at Enarxi Innovations Private Limited are engineered to deliver advanced protection and intelligent monitoring solutions for people, assets, and infrastructure. Combining embedded systems, IoT connectivity, and smart sensors, Enarxi designs custom surveillance, access control, and alarm systems that ensure safety, reliability, and real-time situational awareness across multiple environments.",
  mlAi: "Machine Learning and Artificial Intelligence (ML & AI) at Enarxi Innovations Private Limited drive innovation across all technology verticals. By embedding intelligent algorithms into hardware and software systems, Enarxi enables predictive analytics, process automation, and real-time decision-making. These AI-driven solutions enhance performance, optimize industrial operations, and unlock data-driven insights for smarter business outcomes.",
  homeAutomation: "Home automation solutions at Enarxi Innovations Private Limited bring intelligence, comfort, and energy efficiency to modern living spaces. Through smart sensors, IoT hubs, and mobile connectivity, Enarxi enables users to automate and control lighting, security, and appliances effortlessly. The company focuses on creating seamless, secure, and user-friendly systems that redefine convenience and home experience.",
  biometricDevices: "Biometric devices developed by Enarxi Innovations Private Limited provide secure, accurate, and efficient identity verification. Utilizing advanced fingerprint, facial, and iris recognition technologies, Enarxi designs reliable access control systems and authentication devices. These solutions enhance safety, prevent unauthorized access, and serve diverse applications across government, corporate, and industrial sectors.",
  electricVehicles: "Enarxi Innovations Private Limited contributes to the electric vehicle revolution by developing intelligent electronic modules, battery management systems, and motor controllers. The company’s expertise in embedded systems and power electronics supports reliable, efficient, and scalable EV technology, driving sustainable mobility and innovation in the automotive ecosystem.",
  healthcareDevices: "Healthcare device innovation at Enarxi Innovations Private Limited focuses on building connected medical systems that improve diagnostics, monitoring, and patient care. By integrating IoT connectivity, smart sensors, and data analytics, Enarxi delivers precise, reliable, and user-centric healthcare solutions that advance modern medical technology.",
  arVr: "Augmented Reality (AR) and Virtual Reality (VR) solutions at Enarxi Innovations Private Limited create immersive experiences for industrial training, design visualization, and education. Through a combination of advanced hardware engineering and interactive software systems, Enarxi enables realistic simulations that enhance productivity, learning, and innovation across industries.",
  biomedicalEquipment: "Biomedical equipment developed by Enarxi Innovations Private Limited merges engineering precision with medical innovation. Focusing on diagnostic and monitoring systems, Enarxi designs reliable, high-performance biomedical devices that comply with medical standards and improve patient outcomes through accurate sensing and data-driven insights.",
  industrialAutomation: "Industrial automation at Enarxi Innovations Private Limited integrates IoT, control systems, and intelligent software to optimize manufacturing processes. Enarxi designs and develops custom automation hardware and embedded systems that enhance productivity, reduce manual intervention, and ensure operational safety, empowering industries to achieve smarter, more efficient production."
};

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
    key: "iot",
    gradient: "from-yellow-200 via-orange-200 to-pink-200",
    icon: numberOne,
  },
  {
    title: "Drone & UAV",
    key: "drone",
    gradient: "from-blue-200 via-cyan-200 to-blue-300",
    icon: numberTwo,
  },
  {
    title: "Wearables",
    key: "wearable",
    gradient: "from-green-200 via-emerald-200 to-green-300",
    icon: numberThree,
  },
  {
    title: "Rapid Prototyping",
    key: "rapidPrototyping",
    gradient: "from-purple-200 via-indigo-200 to-blue-200",
    icon: numberFour,
  },
  {
    title: "Security Devices",
    key: "securityDevices",
    gradient: "from-blue-200 via-indigo-200 to-purple-200",
    icon: numberFive,
  },
  {
    title: "ML & AI",
    key: "mlAi",
    gradient: "from-green-200 via-lime-200 to-green-300",
    icon: numberSix,
  },
  {
    title: "Home Automation",
    key: "homeAutomation",
    gradient: "from-pink-200 via-purple-200 to-indigo-200",
    icon: numberSeven,
  },
  {
    title: "Biometric Devices",
    key: "biometricDevices",
    gradient: "from-lime-200 via-green-200 to-emerald-200",
    icon: numberEight,
  },
  {
    title: "Electric Vehicles",
    key: "electricVehicles",
    gradient: "from-green-200 via-teal-200 to-cyan-200",
    icon: numberNine,
  },
  {
    title: "Health Care Devices",
    key: "healthcareDevices",
    gradient: "from-green-200 via-emerald-200 to-teal-200",
    icon: numberTen,
  },
  {
    title: "AR & VR",
    key: "arVr",
    gradient: "from-blue-200 via-indigo-200 to-purple-200",
    icon: numberTen,
  },
  {
    title: "BioMedical Equipments",
    key: "biomedicalEquipment",
    gradient: "from-gray-200 via-blue-200 to-indigo-200",
    icon: numberTen,
  },
  {
    title: "Industrial Automation",
    key: "industrialAutomation",
    gradient: "from-green-200 via-lime-200 to-yellow-200",
    icon: numberTen,
  },
];

const HexagonCard = memo(function HexagonCard({ service, onClick, cardRef, scale = 1 }) {
  const elRef = useRef(null);
  const bp = useBreakpoint();

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const hoverTl = gsap.timeline({ paused: true });
    hoverTl.to(el, {
      scale: bp === "mobile" ? 1.03 * scale : 1.05 * scale,
      rotation: bp === "mobile" ? 0 : 5,
      duration: bp === "mobile" ? 0.2 : 0.3,
      ease: "power2.out",
    });
    hoverTl.to(el.querySelector(".hexagon-bg"), {
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    }, 0);

    const handleInteractionStart = () => hoverTl.play();
    const handleInteractionEnd = () => hoverTl.reverse();

    el.addEventListener("mouseenter", handleInteractionStart);
    el.addEventListener("mouseleave", handleInteractionEnd);
    el.addEventListener("touchstart", handleInteractionStart, { passive: true });
    el.addEventListener("touchend", handleInteractionEnd, { passive: true });

    return () => {
      el.removeEventListener("mouseenter", handleInteractionStart);
      el.removeEventListener("mouseleave", handleInteractionEnd);
      el.removeEventListener("touchstart", handleInteractionStart);
      el.removeEventListener("touchend", handleInteractionEnd);
    };
  }, [bp, scale]);

  const baseSize = bp === "mobile" ? 80 : 190;
  const adjustedSize = baseSize * scale;

  // dynamically calculate font size
  const fontSize = bp === "mobile"
    ? `${10 * scale}px`   // 👈 smaller on mobile + scaled
    : `${18 * scale}px`;  // 👈 normal size scaled

  return (
    <div
      ref={(node) => {
        elRef.current = node;
        if (typeof cardRef === "function") cardRef(node);
      }}
      className="relative flex-shrink-0 cursor-pointer"
      style={{ width: adjustedSize, height: adjustedSize }}
      onClick={onClick}
    >
      <div
        className={`hexagon-bg absolute w-full h-full bg-gradient-to-br ${service.gradient} flex flex-col items-center justify-center text-center p-1 shadow-md transition-all duration-300`}
        style={{
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        <h3
          className="font-poppins font-semibold text-[#444444] leading-tight"
          style={{ fontSize }}
        >
          {service.title}
        </h3>
        <img
          src={service.icon}
          alt={service.title}
          className={`${bp === "mobile" ? "object-fill" : ""}`}
          style={{
            width: bp === "mobile" ? 32 * scale : 96 * scale,
            height: bp === "mobile" ? 32 * scale : 96 * scale,
          }}
        />
      </div>
    </div>
  );
});


export default function WorkingDomain() {
  const bp = useBreakpoint();
  const cardRefs = useRef([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (
      bp !== "unknown" &&
      cardRefs.current.length === services.length
    ) {
      const ctx = gsap.context(() => {
        gsap.from(cardRefs.current, {
          scale: bp === "mobile" ? 0.9 : 0.8,
          opacity: 0,
          rotationY: bp === "mobile" ? 0 : 90,
          duration: bp === "mobile" ? 0.4 : 0.6,
          ease: "back.out(1.4)",
          stagger: bp === "mobile" ? 0.1 : 0.15,
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

  return (
    <div className="h-1/2 w-full bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Our Working Domain
        </h2>
        {bp === "mobile" ? (
          // Mobile: Custom 4-5-4 grid layout
          <div className="flex flex-col items-center overflow-hidden">
          {/* Row 1 */}
          <div className="flex justify-center gap-1 mb-2">
            {services.slice(0, 4).map((service, index) => (
              <HexagonCard
                key={`mobile-row1-${index}`}
                service={service}
                onClick={() => handleCardClick(service)}
                cardRef={(el) => (cardRefs.current[index] = el)}
              />
            ))}
          </div>
      
          {/* Row 2 (slightly offset for honeycomb effect) */}
          <div className="flex justify-center gap-1 mb-0.5">
            {services.slice(4, 9).map((service, index) => (
              <HexagonCard
                key={`mobile-row2-${index}`}
                service={service}
                scale={0.80}
                onClick={() => handleCardClick(service)}
                cardRef={(el) => (cardRefs.current[index + 4] = el)}
              />
            ))}
          </div>
      
          {/* Row 3 */}
          <div className="flex justify-center gap-1 mb-2">
            {services.slice(9, 13).map((service, index) => (
              <HexagonCard
                key={`mobile-row3-${index}`}
                service={service}
                onClick={() => handleCardClick(service)}
                cardRef={(el) => (cardRefs.current[index + 9] = el)}
              />
            ))}
          </div>
        </div>
        ) : (
          // Tablet/Desktop: Existing grid layout
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
                  key={index + 4}
                  service={service}
                  onClick={() => handleCardClick(service)}
                  cardRef={(el) => (cardRefs.current[index + 4] = el)}
                />
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 -mt-12">
              {services.slice(9, 13).map((service, index) => (
                <HexagonCard
                  key={index + 9}
                  service={service}
                  onClick={() => handleCardClick(service)}
                  cardRef={(el) => (cardRefs.current[index + 9] = el)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedService && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-60 backdrop-blur-sm"
        >
          <div className={`relative m-4 w-full ${bp === "mobile" ? "max-w-sm" : "max-w-xl"} rounded-lg bg-white p-4 sm:p-6 md:p-8 shadow-2xl max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-start justify-between">
              <h3 id="modal-title" className="text-xl font-oswald text-gray-900">
                {selectedService.title}
              </h3>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="rounded-full p-1 text-gray-500 transition-colors bg-gray-200 hover:bg-gray-300 hover:text-gray-800"
              >
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
            <div className="mt-4 text-gray-600 text-sm sm:text-base">
              <p>{description[selectedService.key]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// import React, { useState, useEffect, useRef, memo } from "react";
// import { gsap } from "gsap";

// import numberOne from "../../assets/images/1.svg";
// import numberTwo from "../../assets/images/2.svg";
// import numberThree from "../../assets/images/3.svg";
// import numberFour from "../../assets/images/4.svg";
// import numberFive from "../../assets/images/5.svg";
// import numberSix from "../../assets/images/6.svg";
// import numberSeven from "../../assets/images/7.svg";
// import numberEight from "../../assets/images/8.svg";
// import numberNine from "../../assets/images/9.svg";
// import numberTen from "../../assets/images/10.svg";
// // Replace with your real mobile fallback image
// import mobileFallback from "../../assets/images/ourDomainHexagonGrid.svg";


// const description = {
//   iot: "Industrial IoT (IIoT) at Enarxi Innovations Private Limited focuses on connecting machines, sensors, and software to create intelligent, data-driven industrial ecosystems. By integrating advanced electronics, embedded firmware, PCB design, and AI-powered analytics, Enarxi enables factories and industries to monitor operations in real time, predict equipment failures, and optimize performance. The company’s expertise in product design, prototyping, and automation allows it to deliver complete end-to-end IIoT solutions—from sensor integration and edge computing to secure cloud connectivity. Through this, Enarxi helps businesses reduce downtime, cut operational costs, and transition toward smart, efficient, and scalable industrial systems.",
//   drone: "Drone and UAV solutions at Enarxi Innovations Private Limited focus on designing and developing advanced aerial systems that combine precision engineering, embedded intelligence, and real-time data processing. Enarxi specializes in creating custom drones for industrial, agricultural, defense, and surveillance applications, integrating high-performance sensors, navigation systems, and autonomous flight controls. With expertise in electronics design, PCB development, firmware engineering, and AI-based analytics, the company delivers end-to-end UAV solutions from prototype to deployment. These systems enable clients to capture critical data, perform automated inspections, and enhance operational efficiency across industries, driving innovation in next-generation unmanned aerial technology.",
//   wearable: "Wearable technology at Enarxi Innovations Private Limited focuses on developing smart, connected devices that integrate seamlessly with human activity to monitor, analyze, and enhance performance and wellbeing. Leveraging expertise in compact electronics, embedded firmware, PCB design, and low-power wireless communication, Enarxi builds wearables for healthcare, fitness, safety, and industrial applications. The company’s end-to-end development approach—from concept and sensor integration to mobile app connectivity and data analytics—enables the creation of reliable, ergonomic, and intelligent products. Through innovation in miniaturization, energy efficiency, and real-time tracking, Enarxi empowers businesses and users with next-generation wearable solutions that blend technology and comfort.",
//   rapidPrototyping: "Rapid prototyping at Enarxi Innovations Private Limited enables fast, precise, and cost-effective product development from concept to functional model. Using advanced 3D printing, CNC machining, and quick-turn PCB fabrication, Enarxi transforms design ideas into tangible prototypes within short timelines. The company’s expertise in electronics, mechanical design, and embedded systems allows seamless integration of hardware and software during the prototyping phase. This approach helps clients validate designs, test usability, and accelerate time-to-market with minimal risk. By combining innovation, accuracy, and speed, Enarxi delivers high-quality prototypes that drive efficient product innovation and industrial advancement.",
//   securityDevices: "Security devices at Enarxi Innovations Private Limited are engineered to deliver advanced protection and intelligent monitoring solutions for people, assets, and infrastructure. Combining embedded systems, IoT connectivity, and smart sensors, Enarxi designs custom surveillance, access control, and alarm systems that ensure safety, reliability, and real-time situational awareness across multiple environments.",
//   mlAi: "Machine Learning and Artificial Intelligence (ML & AI) at Enarxi Innovations Private Limited drive innovation across all technology verticals. By embedding intelligent algorithms into hardware and software systems, Enarxi enables predictive analytics, process automation, and real-time decision-making. These AI-driven solutions enhance performance, optimize industrial operations, and unlock data-driven insights for smarter business outcomes.",
//   homeAutomation: "Home automation solutions at Enarxi Innovations Private Limited bring intelligence, comfort, and energy efficiency to modern living spaces. Through smart sensors, IoT hubs, and mobile connectivity, Enarxi enables users to automate and control lighting, security, and appliances effortlessly. The company focuses on creating seamless, secure, and user-friendly systems that redefine convenience and home experience.",
//   biometricDevices: "Biometric devices developed by Enarxi Innovations Private Limited provide secure, accurate, and efficient identity verification. Utilizing advanced fingerprint, facial, and iris recognition technologies, Enarxi designs reliable access control systems and authentication devices. These solutions enhance safety, prevent unauthorized access, and serve diverse applications across government, corporate, and industrial sectors.",
//   electricVehicles: "Enarxi Innovations Private Limited contributes to the electric vehicle revolution by developing intelligent electronic modules, battery management systems, and motor controllers. The company’s expertise in embedded systems and power electronics supports reliable, efficient, and scalable EV technology, driving sustainable mobility and innovation in the automotive ecosystem.",
//   healthcareDevices: "Healthcare device innovation at Enarxi Innovations Private Limited focuses on building connected medical systems that improve diagnostics, monitoring, and patient care. By integrating IoT connectivity, smart sensors, and data analytics, Enarxi delivers precise, reliable, and user-centric healthcare solutions that advance modern medical technology.",
//   arVr: "Augmented Reality (AR) and Virtual Reality (VR) solutions at Enarxi Innovations Private Limited create immersive experiences for industrial training, design visualization, and education. Through a combination of advanced hardware engineering and interactive software systems, Enarxi enables realistic simulations that enhance productivity, learning, and innovation across industries.",
//   biomedicalEquipment: "Biomedical equipment developed by Enarxi Innovations Private Limited merges engineering precision with medical innovation. Focusing on diagnostic and monitoring systems, Enarxi designs reliable, high-performance biomedical devices that comply with medical standards and improve patient outcomes through accurate sensing and data-driven insights.",
//   industrialAutomation: "Industrial automation at Enarxi Innovations Private Limited integrates IoT, control systems, and intelligent software to optimize manufacturing processes. Enarxi designs and develops custom automation hardware and embedded systems that enhance productivity, reduce manual intervention, and ensure operational safety, empowering industries to achieve smarter, more efficient production."
// };


// function useBreakpoint() {
//   const MOBILE_MAX = 760;
//   const TABLET_MAX = 1020;

//   const [bp, setBp] = useState("unknown");

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const mqMobile = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
//     const mqTablet = window.matchMedia(
//       `(min-width: ${MOBILE_MAX + 1}px) and (max-width: ${TABLET_MAX}px)`
//     );
//     const mqDesktop = window.matchMedia(`(min-width: ${TABLET_MAX + 1}px)`);

//     const update = () => {
//       if (mqMobile.matches) setBp("mobile");
//       else if (mqTablet.matches) setBp("tablet");
//       else if (mqDesktop.matches) setBp("desktop");
//       else setBp("desktop");
//     };

//     update();

//     const add = (m, fn) =>
//       m.addEventListener ? m.addEventListener("change", fn) : m.addListener(fn);
//     const remove = (m, fn) =>
//       m.removeEventListener
//         ? m.removeEventListener("change", fn)
//         : m.removeListener(fn);

//     add(mqMobile, update);
//     add(mqTablet, update);
//     add(mqDesktop, update);

//     return () => {
//       remove(mqMobile, update);
//       remove(mqTablet, update);
//       remove(mqDesktop, update);
//     };
//   }, []);

//   return bp;
// }
// const services = [
//     {
//       title: "Industrial IoT",
//       key: "iot",
//       gradient: "from-yellow-200 via-orange-200 to-pink-200",
//       icon: numberOne,
//     },
//     {
//       title: "Drone & UAV",
//       key: "drone",
//       gradient: "from-blue-200 via-cyan-200 to-blue-300",
//       icon: numberTwo,
//     },
//     {
//       title: "Wearables",
//       key: "wearable",
//       gradient: "from-green-200 via-emerald-200 to-green-300",
//       icon: numberThree,
//     },
//     {
//       title: "Rapid Prototyping",
//       key: "rapidPrototyping",
//       gradient: "from-purple-200 via-indigo-200 to-blue-200",
//       icon: numberFour,
//     },
//     {
//       title: "Security Devices",
//       key: "securityDevices",
//       gradient: "from-blue-200 via-indigo-200 to-purple-200",
//       icon: numberFive,
//     },
//     {
//       title: "ML & AI",
//       key: "mlAi",
//       gradient: "from-green-200 via-lime-200 to-green-300",
//       icon: numberSix,
//     },
//     {
//       title: "Home Automation",
//       key: "homeAutomation",
//       gradient: "from-pink-200 via-purple-200 to-indigo-200",
//       icon: numberSeven,
//     },
//     {
//       title: "Biometric Devices",
//       key: "biometricDevices",
//       gradient: "from-lime-200 via-green-200 to-emerald-200",
//       icon: numberEight,
//     },
//     {
//       title: "Electric Vehicles",
//       key: "electricVehicles",
//       gradient: "from-green-200 via-teal-200 to-cyan-200",
//       icon: numberNine,
//     },
//     {
//       title: "Health Care Devices",
//       key: "healthcareDevices",
//       gradient: "from-green-200 via-emerald-200 to-teal-200",
//       icon: numberTen,
//     },
//     {
//       title: "AR & VR",
//       key: "arVr",
//       gradient: "from-blue-200 via-indigo-200 to-purple-200",
//       icon: numberTen,
//     },
//     {
//       title: "BioMedical Equipments",
//       key: "biomedicalEquipment",
//       gradient: "from-gray-200 via-blue-200 to-indigo-200",
//       icon: numberTen,
//     },
//     {
//       title: "Industrial Automation",
//       key: "industrialAutomation",
//       gradient: "from-green-200 via-lime-200 to-yellow-200",
//       icon: numberTen,
//     },
//   ];

// const HexagonCard = memo(function HexagonCard({ service, onClick, cardRef }) {
//   const elRef = useRef(null);

//   useEffect(() => {
//     const el = elRef.current;
//     if (!el) return;

//     const hoverTl = gsap.timeline({ paused: true });
//     hoverTl.to(el, {
//       scale: 1.05,
//       rotation: 5,
//       duration: 0.3,
//       ease: "power2.out",
//     });
//     hoverTl.to(
//       el.querySelector(".hexagon-bg"),
//       { boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
//       0
//     );

//     el.addEventListener("mouseenter", () => hoverTl.play());
//     el.addEventListener("mouseleave", () => hoverTl.reverse());

//     return () => {
//       el.removeEventListener("mouseenter", () => hoverTl.play());
//       el.removeEventListener("mouseleave", () => hoverTl.reverse());
//     };
//   }, []);

//   return (
//     <div
//       ref={(node) => {
//         elRef.current = node;
//         if (typeof cardRef === "function") {
//           cardRef(node);
//         }
//       }}
//       className="relative w-48 h-48 mx-2 flex-shrink-0 cursor-pointer"
//       onClick={onClick}
//     >
//       <div
//         className={`hexagon-bg absolute w-full h-full bg-gradient-to-br ${service.gradient} flex flex-col items-center justify-center text-center p-2 shadow-md transition-all duration-300`}
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
//           className="w-24 h-24 object-fill"
//         />
//       </div>
//     </div>
//   );
// });

// export default function WorkingDomain({ mobileImage = mobileFallback }) {
//   const bp = useBreakpoint();
//   const cardRefs = useRef([]);
//   const [selectedService, setSelectedService] = useState(null);

//   useEffect(() => {
//     if (
//       bp !== "mobile" &&
//       bp !== "unknown" &&
//       cardRefs.current.length === services.length
//     ) {
//       const ctx = gsap.context(() => {
//         gsap.from(cardRefs.current, {
//           scale: 0.8,
//           opacity: 0,
//           rotationY: 90,
//           duration: 0.6,
//           ease: "back.out(1.4)",
//           stagger: 0.15,
//         });

//         const highlightTl = gsap.timeline({ repeat: -1 });
//         cardRefs.current.forEach((el, i) => {
//           highlightTl.to(
//             el,
//             {
//               filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 1))",
//               duration: 1,
//             },
//             i * 1.5
//           );
//           highlightTl.to(
//             el,
//             {
//               filter: "none",
//               duration: 0.5,
//             },
//             i * 1.5 + 1
//           );
//         });
//       });

//       return () => ctx.revert();
//     }
//   }, [bp]);

//   if (bp === "unknown") {
//     return (
//       <div className="min-h-[20rem] bg-gray-50 font-sans flex items-center justify-center">
//         <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
//             Our Working Domain
//           </h2>
//           <div
//             className="h-48 w-full rounded-md bg-gray-100 animate-pulse"
//             aria-hidden
//           />
//         </div>
//       </div>
//     );
//   }

//   const handleCardClick = (service) => {
//     setSelectedService(service);
//   };

//   const closeModal = () => {
//     setSelectedService(null);
//   };

//   // mobile -> single image to keep DOM light and simplify layout
//   if (bp === "mobile") {
//     return (
//       <div className="h-[40dvh] bg-gray-50 font-sans">
//         <main className="max-w-7xl mx-auto px-2 py-2">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
//             Our Working Domain
//           </h2>
//           <div className="flex justify-center">
//             <img
//               src={mobileImage}
//               alt="Our working domain overview"
//               className="w-full max-w-sm object-contain"
//               loading="lazy"
//             />
//           </div>
//         </main>
//       </div>
//     );
//   }

//   // tablet and desktop -> full interactive grid with animations and modal
//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
//           Our Working Domain
//         </h2>
//         <div className="flex flex-col items-center">
//           <div className="flex flex-wrap justify-center gap-4 mb-2">
//             {services.slice(0, 4).map((service, index) => (
//               <HexagonCard
//                 key={index}
//                 service={service}
//                 onClick={() => handleCardClick(service)}
//                 cardRef={(el) => (cardRefs.current[index] = el)}
//               />
//             ))}
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 -mt-12 mb-2">
//             {services.slice(4, 9).map((service, index) => (
//               <HexagonCard
//                 key={index}
//                 service={service}
//                 onClick={() => handleCardClick(service)}
//                 cardRef={(el) => (cardRefs.current[index + 4] = el)}
//               />
//             ))}
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 -mt-12">
//             {services.slice(9, 13).map((service, index) => (
//               <HexagonCard
//                 key={index}
//                 service={service}
//                 onClick={() => handleCardClick(service)}
//                 cardRef={(el) => (cardRefs.current[index + 9] = el)}
//               />
//             ))}
//           </div>
//         </div>
//       </main>

//       {selectedService && (
//        <div role="dialog"
//        aria-modal="true"
//        aria-labelledby="modal-title"
//        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
//      >
//        <div className="relative m-4 w-auto max-w-xl rounded-lg bg-white p-6 shadow-2xl md:p-8">
//          <div className="flex items-start justify-between">
//            <h3 id="modal-title" className="text-xl font-oswald text-gray-900">
//              {selectedService.title}
//            </h3>
//            <button
//              onClick={closeModal}
//              // aria-label makes the button's purpose clear to assistive technologies
//              aria-label="Close modal"
//              className="rounded-full p-1 text-gray-500 transition-colors bg-gray-200 hover:bg-gray-300 hover:text-gray-800"
//            >
//              {/* Using an SVG icon is more scalable and accessible than a text '×' */}
//              <svg
//                xmlns="http://www.w3.org/2000/svg"
//                fill="none"
//                viewBox="0 0 24 24"
//                strokeWidth={1.5}
//                stroke="currentColor"
//                className="h-6 w-6 cursor-pointer"
//              >
//                <path
//                  strokeLinecap="round"
//                  strokeLinejoin="round"
//                  d="M6 18L18 6M6 6l12 12"
//                />
//              </svg>
//            </button>
//          </div>
//          <div className="mt-4 text-gray-600">
//            <p>
//         {description[selectedService.key]}
//            </p>
//          </div>
//        </div>
//      </div>
//       )}
//     </div>
//   );
// }
// The above pasted component has worked on today and works fine while tap and it was hover the detailed about the product as description










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
