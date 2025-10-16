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
import React, { useState, useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";

import IconProduct from "../../assets/images/product-design.svg";
import IconMCFirmware from "../../assets/images/mc-firmware.svg";
import IconPCB from "../../assets/images/pcb-design.svg";

const services = [
  { icon: IconProduct, title: "Product Design & Prototyping", text: "Perfect balance of functionality, transformation, and innovation in electronics." },
  { icon: IconMCFirmware, title: "Micro Controller & Processor Coding Services", text: "Advanced firmware solutions for microcontroller and processor boards to complement your product." },
  { icon: IconPCB, title: "PCB Design & Fabrication", text: "High-density PCB layouts to meet market demands for sophisticated designs driven by miniaturization and semiconductor technology." },
];

const ServicesSection = () => {
  const headerRef = useRef(null);
  const [baseTop, setBaseTop] = useState(280); // fallback

  useLayoutEffect(() => {
    const mobileExtraGap = 2; // increase for more mobile spacing
    const desktopExtraGap = 12;

    const compute = () => {
      const el = headerRef.current;
      if (!el) return setBaseTop(280);
      const cs = getComputedStyle(el);
      const topOffsetPx = parseFloat(cs.top) || 0; // top from CSS (e.g. top-16)
      const headerHeight = Math.round(el.offsetHeight || 0);
      const isMobile = window.innerWidth < 768;
      const extra = isMobile ? mobileExtraGap : desktopExtraGap;
      setBaseTop(Math.round(topOffsetPx + headerHeight + extra)); // px
    };

    compute();
    window.addEventListener("resize", compute);
    // observe header size changes (fonts, dynamic content)
    let ro;
    if (headerRef.current && window.ResizeObserver) {
      ro = new ResizeObserver(compute);
      ro.observe(headerRef.current);
    }
    return () => {
      window.removeEventListener("resize", compute);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <section className="padding-y lg:py-20 relative min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div
          ref={headerRef}
          className="sticky top-16 md:top-14 lg:z-20 bg-white/95 backdrop-blur-md py-4 md:py-6 -mx-4 md:-mx-6 px-4 md:px-6 mb-6 md:mb-8 flex flex-col items-center border-b border-slate-200/50"
        >
          <h2 className="text-40 font-bold tracking-tight font-oswald text-slate-900">
            Services We Offer You
          </h2>

          <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-600 leading-relaxed max-w-xl text-center">
            Our custom software design and development teams can design,
            build, test, and deliver a product that fits both your vision and
            market demand. With our support, you will find customers, build
            income, and attract new investors.
          </p>

          <a
            href="/services"
            className="mt-4 md:mt-5 inline-flex items-center gap-2 text-sm md:text-base font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-800 transition-colors"
          >
            SEE WHAT WE CAN DO
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
          </a>
        </div>

        {/* Stacked Cards Section */}
        <div className="flex flex-col gap-12 md:gap-16 items-center">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#EBF7FF] via-[#D8EEFF] to-white border border-slate-300 px-6 py-6 md:px-8 md:py-8 lg:px-12 lg:py-10 sticky after:pointer-events-none w-full max-w-5xl z-30"
              style={{ top: `${baseTop + index * 30}px` }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center">
                <div className="order-2 lg:order-1">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight font-poppins">
                    {service.title}
                  </h3>
                  <hr className="border-t-2 border-slate-900/10 mt-3 md:mt-4" />
                  <p className="mt-3 md:mt-4 text-slate-600 text-sm md:text-base leading-relaxed">
                    {service.text}
                  </p>

                  <div className="mt-5 md:mt-6">
                    <a
                      href="/services"
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  </div>
                </div>

                <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-end">
                  <div className="rounded-xl md:rounded-2xl bg-white p-5 md:p-6 lg:p-8 ring-1 ring-slate-200 shadow-sm lg:mr-10">
                    <img
                      src={service.icon}
                      alt={service.title}
                      loading="lazy"
                      className="h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;