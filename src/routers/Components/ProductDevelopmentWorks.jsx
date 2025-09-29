import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import RoadPng from "../../assets/images/RoadPng.png";
import IdeationIcon from "../../assets/images/Working-Domain/Ideation.svg";
import ConceptualizationIcon from "../../assets/images/conceptualization.svg";
import HardwareIcon from "../../assets/images/hardware.svg";
import SoftwareIcon from "../../assets/images/software.svg";
import EndProductIcon from "../../assets/images/endProduct.svg";

gsap.registerPlugin(ScrollTrigger);

const ProductDevelopmentWorks = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const horizontalRef = useRef(null);
  const horizontalScrollWrapper = useRef(null);
  const stepsRefs = useRef([]);

  const roadmapSteps = [
    {
      id: "ideation",
      title: "Ideation",
      description:
        "Understanding the customer need challenging it to a requirement chart",
      icon: IdeationIcon,
      style: { top: "-1%", left: "4%" },
      layout: "text-right",
    },
    {
      id: "conceptualization",
      title: "Conceptualization",
      description: "Structuring of Solution, Prototyping and Finalization",
      icon: ConceptualizationIcon,
      style: { top: "20%", left: "55%" },
      layout: "text-right",
    },
    {
      id: "hardware",
      title: "Hardware",
      description:
        "Hardware planning, Schematic Design, PCB Layout Routing, Components Assembly and Testing",
      icon: HardwareIcon,
      style: { top: "38%", left: "8%" },
      layout: "text-left",
    },
    {
      id: "software",
      title: "Software",
      description: "Firmware development, App and Cloud integrations.",
      icon: SoftwareIcon,
      style: { top: "60%", left: "40%" },
      layout: "text-right",
    },
    {
      id: "end-product",
      title: "End Product",
      description: "End Product Ready For Market",
      icon: EndProductIcon,
      style: { top: "58%", left: "70%" },
      layout: "text-left",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Desktop logic (unchanged) ---
      if (window.innerWidth >= 768) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              pin: contentRef.current,
            },
          })
          .to(stepsRefs.current, {
            opacity: 1,
            y: 0,
            ease: "power1.inOut",
            stagger: 0.5,
          });
      } else {
        // --- Mobile horizontal scroll (CORRECTED) ---
        if (!horizontalRef.current || !horizontalScrollWrapper.current) return;

        // Calculate the total distance the horizontal section needs to move
        const scrollDistance =
          horizontalRef.current.scrollWidth - window.innerWidth;

        gsap.to(horizontalRef.current, {
          x: -scrollDistance, // Animate the x position to the negative scroll distance
          ease: "none", // Linear animation
          scrollTrigger: {
            trigger: horizontalScrollWrapper.current, // The element that triggers the animation
            pin: true, // Pin the trigger element during the animation
            scrub: 1, // Smoothly scrub the animation on scroll
            start: "top top",
            // End the animation after scrolling a distance equal to the scrollDistance
            end: () => `+=${scrollDistance}`,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full relative bg-white py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-oswald text-center">
        How Product Development Works?
      </h1>

      {/* Desktop Roadmap */}
      <div
        ref={contentRef}
        className="hidden md:block h-screen w-full sticky flex flex-col items-center"
      >
        <div className="relative w-full h-full mx-auto">
          <img
            src={RoadPng}
            alt="Product development roadmap"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto object-contain"
          />

          {roadmapSteps.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => (stepsRefs.current[index] = el)}
              className={`absolute w-80 transform opacity-0 flex items-center gap-x-2 ${
                step.layout === "text-left" ? "flex-row-reverse" : ""
              }`}
              style={{ ...step.style, transform: "translateY(50px)" }}
            >
              <img
                src={step.icon}
                alt={`${step.title} icon`}
                className="w-32 h-32 flex-shrink-0"
              />

              <div
                className={`flex flex-col ${
                  step.layout === "text-left" ? "text-right" : "text-left"
                }`}
              >
                <h3 className="text-2xl font-semibold font-poppins">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Horizontal Scroll */}
      <div
        ref={horizontalScrollWrapper}
        className="block md:hidden overflow-x-hidden relative"
      >
        {/* The "sticky top-0" classes have been removed from the div below */}
        <div ref={horizontalRef} className="flex flex-row w-full h-screen">
          {roadmapSteps.map((step) => (
            <div
              key={step.id}
              className="h-step w-screen flex-shrink-0 flex flex-col items-center justify-center text-center px-6"
              style={{ margin: 0, padding: 0 }}
            >
              <img
                src={step.icon}
                alt={step.title}
                className="w-20 h-20 mb-4"
              />
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2 max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDevelopmentWorks;

// import { useRef, useEffect } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// import RoadPng from "../../assets/images/RoadPng.png";
// import IdeationIcon from "../../assets/images/Working-Domain/Ideation.svg";
// import ConceptualizationIcon from "../../assets/images/conceptualization.svg";
// import HardwareIcon from "../../assets/images/hardware.svg";
// import SoftwareIcon from "../../assets/images/software.svg";
// import EndProductIcon from "../../assets/images/endProduct.svg";

// gsap.registerPlugin(ScrollTrigger);

// const ProductDevelopmentWorks = () => {
//   const containerRef = useRef(null);
//   const contentRef = useRef(null);
//   const stepsRefs = useRef([]);

//   // Re-added the 'layout' property to control text direction
//   const roadmapSteps = [
//     {
//       id: "ideation",
//       title: "Ideation",
//       description:
//         "Understanding the customer need challenging it to a requirement chart",
//       icon: IdeationIcon,
//       style: { top: "-14%", left: "4%" },
//       layout: "text-right", // Text appears to the right of the icon
//     },
//     {
//       id: "conceptualization",
//       title: "Conceptualization",
//       description: "Structuring of Solution, Prototyping and Finalization",
//       icon: ConceptualizationIcon,
//       style: { top: "13%", left: "55%" },
//       layout: "text-right",
//     },
//     {
//       id: "hardware",
//       title: "Hardware",
//       description:
//         "Hardware planning, Schematic Design, PCB Layout Routing, Components Assembly and Testing",
//       icon: HardwareIcon,
//       style: { top: "35%", left: "8%" },
//       layout: "text-left",
//     },
//     {
//       id: "software",
//       title: "Software",
//       description: "Firmware development, App and Cloud integrations.",
//       icon: SoftwareIcon,
//       style: { top: "62%", left: "40%" },
//       layout: "text-right",
//     },
//     {
//       id: "end-product",
//       title: "End Product",
//       description: "End Product Ready For Market",
//       icon: EndProductIcon,
//       style: { top: "60%", left: "70%" },
//       layout: "text-left", // Text appears to the left of the icon
//     },
//   ];

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap
//         .timeline({
//           scrollTrigger: {
//             trigger: containerRef.current,
//             start: "top top",
//             end: "bottom bottom",
//             scrub: 1,
//             pin: contentRef.current,
//           },
//         })
//         .to(stepsRefs.current, {
//           opacity: 1,
//           y: 0,
//           ease: "power1.inOut",
//           stagger: 0.5,
//         });
//     }, containerRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={containerRef}
//       className="w-full relative bg-white py-12"
//       style={{ height: "300vh" }}
//     >
//       <div
//         ref={contentRef}
//         className="h-screen w-full sticky top-0 flex flex-col items-center"
//       >
//         <h1 className="text-4xl font-bold font-oswald my-14">
//           How Product Development Works ?
//         </h1>
//         <div className="relative w-full h-full mx-auto">
//           <img
//             src={RoadPng}
//             alt="Product development roadmap"
//             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto object-contain"
//           />

//           {roadmapSteps.map((step, index) => (
//             <div
//               key={step.id}
//               ref={(el) => (stepsRefs.current[index] = el)}
//               className={`absolute w-80 transform opacity-0 flex items-center gap-x-2 ${
//                 step.layout === "text-left" ? "flex-row-reverse" : ""
//               }`}
//               style={{ ...step.style, transform: "translateY(50px)" }}
//             >
//               <img
//                 src={step.icon}
//                 alt={`${step.title} icon`}
//                 className="w-32 h-32 flex-shrink-0"
//               />

//               <div
//                 className={`flex flex-col ${
//                   step.layout === "text-left" ? "text-right" : "text-left"
//                 }`}
//               >
//                 <h3 className="text-2xl font-semibold font-poppins">
//                   {step.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1">{step.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductDevelopmentWorks;
