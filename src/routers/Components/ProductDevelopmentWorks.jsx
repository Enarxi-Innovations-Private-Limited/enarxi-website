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
  const desktopContainerRef = useRef(null);
  const desktopContentRef = useRef(null);
  const desktopStepsRefs = useRef([]);
  const mobileTimelineRef = useRef(null);
  const mobileStepRefs = useRef([]);

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

  const steps = [
    {
      id: "ideation",
      title: "Ideation",
      description:
        "Understanding the customer need challenging it to a requirement chart",
      icon: IdeationIcon,
    },
    {
      id: "conceptualization",
      title: "Conceptualization",
      description: "Structuring of Solution, Prototyping and Finalization",
      icon: ConceptualizationIcon,
    },
    {
      id: "hardware",
      title: "Hardware",
      description:
        "Hardware planning, Schematic Design, PCB Layout Routing, Components Assembly and Testing",
      icon: HardwareIcon,
    },
    {
      id: "software",
      title: "Software",
      description: "Firmware development, App and Cloud integrations.",
      icon: SoftwareIcon,
    },
    {
      id: "end-product",
      title: "End Product",
      description: "End Product Ready For Market",
      icon: EndProductIcon,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.innerWidth >= 768) {
        // Desktop: Reduced scroll distance for more compact experience
        gsap
          .timeline({
            scrollTrigger: {
              trigger: desktopContainerRef.current,
              start: "top top",
              end: "+=150vh", // Reduced from implicit 300vh to 150vh
              scrub: 1,
              pin: desktopContentRef.current,
            },
          })
          .to(desktopStepsRefs.current, {
            opacity: 1,
            y: 0,
            ease: "power1.inOut",
            stagger: 0.3, // Faster stagger for quicker animation
          });
      } else {
        // Mobile: Vertical timeline animations
        mobileStepRefs.current.forEach((stepEl, index) => {
          gsap.fromTo(
            stepEl,
            {
              scale: 0.8,
              rotationX: -90,
              opacity: 0,
              y: 50,
            },
            {
              scale: 1,
              rotationX: 0,
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: stepEl,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Animate timeline line
        gsap.to(".timeline-line", {
          height: "100%",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: mobileTimelineRef.current,
            start: "top 20%",
            end: "bottom 20%",
            scrub: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Desktop Section */}
      <section
        ref={desktopContainerRef}
        className="hidden md:block w-full relative bg-white"
      >
        <h1 className="text-3xl md:text-4xl font-bold font-oswald text-center py-12">
          How Product Development Works?
        </h1>

        <div ref={desktopContentRef} className="h-screen w-full">
          <div className="relative w-full h-full mx-auto">
            <img
              src={RoadPng}
              alt="Product development roadmap"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto object-contain max-h-[80vh]"
            />

            {roadmapSteps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => (desktopStepsRefs.current[index] = el)}
                className={`absolute w-72 md:w-80 transform opacity-0 flex items-center gap-x-2 ${
                  step.layout === "text-left" ? "flex-row-reverse" : ""
                }`}
                style={{ ...step.style, transform: "translateY(50px)" }}
              >
                <img
                  src={step.icon}
                  alt={`${step.title} icon`}
                  className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0"
                />

                <div
                  className={`flex flex-col ${
                    step.layout === "text-left" ? "text-right" : "text-left"
                  }`}
                >
                  <h3 className="text-xl md:text-2xl font-semibold font-poppins">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Section */}
      <section className="block md:hidden w-full bg-gradient-to-b from-white to-gray-50 py-8 px-4">
        <h1 className="text-2xl font-bold font-oswald text-center mb-12 text-gray-800">
          How Product Development Works?
        </h1>

        <div ref={mobileTimelineRef} className="relative max-w-md mx-auto">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-blue-500 h-0 timeline-line z-0"></div>

          {steps.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => (mobileStepRefs.current[index] = el)}
              className={`relative z-10 mb-8 flex flex-col items-center ${
                index % 2 === 0 ? "text-left" : "text-right"
              }`}
            >
              {/* Timeline Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-lg"></div>

              {/* Step Card */}
              <div className="w-full bg-white rounded-xl shadow-md p-6 transform perspective-1000">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-16 h-16 flex-shrink-0"
                  />
                </div>
                <h3 className="text-lg font-semibold font-poppins text-gray-800 mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  {step.description}
                </p>
              </div>

              {/* Step Number */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProductDevelopmentWorks;