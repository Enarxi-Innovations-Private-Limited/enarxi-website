import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react"; 
import IconProduct from "../../assets/images/product-design.svg";
import IconMCFirmware from "../../assets/images/mc-firmware.svg";
import IconPCB from "../../assets/images/pcb-design.svg";

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


const ServicesSection = () => {
  const [index, setIndex] = useState(0);

  // auto-rotate every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left column: heading + copy */}
          <div className="lg:col-span-5">
            <h2 className="text-oswald-md font-extrabold tracking-tight text-slate-900">
              Services We Offer You
            </h2>

            <p className="mt-6 text-slate-600 leading-relaxed">
              Our custom software design and development teams can design, build,
              test, and deliver a product that fits both your vision and market
              demand. With our support, you will find customers, build income and
              attract new investors.
            </p>

            <a
              href="/services"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-slate-900 underline underline-offset-8 decoration-slate-300 hover:decoration-slate-800"
            >
              SEE WHAT WE CAN DO
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>

          {/* Right column: rotating services */}
          <div className="lg:col-span-7 relative h-[200px]">
            {services.map((s, i) => (
              <div
                key={s.title}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <ul className="divide-y divide-slate-200">
                  <li className="flex items-start gap-6 py-6">
                    <div className="shrink-0 rounded-2xl bg-slate-100 p-4 ring-1 ring-slate-200">
                      <img
                        src={s.icon}
                        alt={s.title}
                        width="64"
                        height="64"
                        loading="lazy"
                        className="h-16 w-16 object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-slate-600">{s.text}</p>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;




    //   <section>
    //     <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
    //       <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
           
    //         <div className="lg:col-span-5">
    //           <h2 className="text-oswald-md font-extrabold tracking-tight text-slate-900 ">
    //             Services We Offer You
    //           </h2>

    //           <p className="mt-6 text-slate-600 leading-relaxed">
    //             Our custom software design and development teams can design, build,
    //             test, and deliver a product that fits both your vision and market
    //             demand. With our support, you will find customers, build income and
    //             attract new investors.
    //           </p>

    //           <a
    //             href="/services"
    //             className="mt-8 inline-flex items-center gap-2 font-semibold text-slate-900 underline underline-offset-8 decoration-slate-300 hover:decoration-slate-800"
    //           >
    //             SEE WHAT WE CAN DO
    //             <ArrowRight className="h-5 w-5" aria-hidden="true" />
    //           </a>
    //         </div>

            
    //         <div className="lg:col-span-7">
    //           <ul className="divide-y divide-slate-200">
    //             {services.map((s) => (
    //               <li key={s.title} className="flex items-start gap-6 py-6">
    //                 <div className="shrink-0 rounded-2xl bg-slate-100 p-4 ring-1 ring-slate-200">
    //                   <img
    //                     src={s.icon}
    //                     alt=""
    //                     width="64"
    //                     height="64"
    //                     loading="lazy"
    //                     className="h-16 w-16 object-contain"
    //                   />
    //                 </div>

    //                 <div>
    //                   <h3 className="text-xl font-semibold text-slate-900">
    //                     {s.title}
    //                   </h3>
    //                   <p className="mt-2 text-slate-600">{s.text}</p>
    //                 </div>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       </div>
    //     </div>
    //   </section>