// import React from 'react';

import numberOne from '../../assets/images/1.svg'
import numberTwo from '../../assets/images/2.svg'
import numberThree from '../../assets/images/3.svg'
import numberFour from '../../assets/images/4.svg'
import numberFive from '../../assets/images/5.svg'
import numberSix from '../../assets/images/6.svg'
import numberSeven from '../../assets/images/7.svg'
import numberEight from '../../assets/images/8.svg'
import numberNine from '../../assets/images/9.svg'
import numberTen from '../../assets/images/10.svg'


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

// HexagonCard component for displaying each service
function HexagonCard({ service }) {
  return (
    <div className="relative w-48 h-52 mx-2 flex-shrink-0">
      <div
        className={`hexagon absolute w-full h-full bg-gradient-to-br ${service.gradient} flex flex-col items-center justify-center text-center p-4 shadow-lg transition-shadow duration-300 cursor-pointer`}
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
          className="w-28 h-28 object-contain"
        />
      </div>
    </div>
  );
}


// Main App component
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Main Content - Hexagonal Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Working Domain</h2>
        <div className="flex flex-col items-center">
          {/* Row 1 */}
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            {services.slice(0, 4).map((service, index) => (
              <HexagonCard key={index} service={service} />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap justify-center gap-4 -mt-12 mb-2">
            {services.slice(4, 9).map((service, index) => (
              <HexagonCard key={index} service={service} />
            ))}
          </div>

          {/* Row 3 */}
          <div className="flex flex-wrap justify-center gap-4 -mt-12">
            {services.slice(9, 13).map((service, index) => (
              <HexagonCard key={index} service={service} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


