"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import RoadPng from '@/assets/images/RoadPng.png';
import IdeationIcon from '@/assets/images/Working-Domain/Ideation.svg';
import ConceptualizationIcon from '@/assets/images/conceptualization.svg';
import HardwareIcon from '@/assets/images/hardware.svg';
import SoftwareIcon from '@/assets/images/software.svg';
import EndProductIcon from '@/assets/images/endProduct.svg';

gsap.registerPlugin(ScrollTrigger);

const ProductDevelopmentWorks = () => {
  const desktopContainerRef = useRef(null);
  const desktopContentRef = useRef(null);
  const desktopStepsRefs = useRef([]);
  const roadRef = useRef(null);
  const mobileTimelineRef = useRef(null);
  const mobileStepRefs = useRef([]);
  const mobileHeadingRef = useRef(null);

  const roadmapSteps = [
    {
      id: "ideation",
      title: "Ideation",
      description:
        "Understanding the customer need and challenging it to a requirement chart",
      icon: IdeationIcon,
      style: { top: "-30%", left: "10%" },
      layout: "text-right",
    },
    {
      id: "conceptualization",
      title: "Conceptualization",
      description: "Structuring of solution, prototyping, and finalization",
      icon: ConceptualizationIcon,
      style: { top: "5%", left: "54.5%" },
      layout: "text-right",
    },
    {
      id: "hardware",
      title: "Hardware",
      description:
        "Hardware planning, schematic design, PCB layout routing, components assembly, and testing",
      icon: HardwareIcon,
      style: { top: "33%", left: "8%" },
      layout: "text-left",
    },
    {
      id: "software",
      title: "Software",
      description: "Firmware development, app, and cloud integrations",
      icon: SoftwareIcon,
      style: { top: "63%", left: "41%" },
      layout: "text-right",
    },
    {
      id: "end-product",
      title: "End Product",
      description: "End product ready for market",
      icon: EndProductIcon,
      style: { top: "65%", left: "69%" },
      layout: "text-left",
    },
  ];

  const steps = [
    {
      id: "ideation",
      title: "Ideation",
      description:
        "Understanding the customer need and challenging it to a requirement chart",
      icon: IdeationIcon,
    },
    {
      id: "conceptualization",
      title: "Conceptualization",
      description: "Structuring of solution, prototyping, and finalization",
      icon: ConceptualizationIcon,
    },
    {
      id: "hardware",
      title: "Hardware",
      description:
        "Hardware planning, schematic design, PCB layout routing, components assembly, and testing",
      icon: HardwareIcon,
    },
    {
      id: "software",
      title: "Software",
      description: "Firmware development, app, and cloud integrations",
      icon: SoftwareIcon,
    },
    {
      id: "end-product",
      title: "End Product",
      description: "End product ready for market",
      icon: EndProductIcon,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Desktop Animation
      if (desktopContainerRef.current) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: desktopContainerRef.current,
              start: "top top",
              end: "+=150vh",
              scrub: 1,
              pin: desktopContentRef.current,
            },
          })
          .to(desktopStepsRefs.current, {
            opacity: 1,
            y: 0,
            ease: "power1.inOut",
            stagger: 0.3,
          });
      }

      // Mobile Animation
      if (mobileTimelineRef.current) {
        const updateFontSizes = () => {
          const width = window.innerWidth;
          let headingSize, titleSize, descSize, iconSize;

          if (width < 480) {
            headingSize = "1.875rem";
            titleSize = "1.25rem";
            descSize = "1rem";
            iconSize = "64px";
          } else if (width < 640) {
            headingSize = "2rem";
            titleSize = "1.375rem";
            descSize = "1.05rem";
            iconSize = "72px";
          } else if (width < 768) {
            headingSize = "2.25rem";
            titleSize = "1.5rem";
            descSize = "1.125rem";
            iconSize = "80px";
          } else if (width < 1024) {
            headingSize = "2.5rem";
            titleSize = "1.75rem";
            descSize = "1.25rem";
            iconSize = "96px";
          } else if (width < 1536) {
            headingSize = "2.75rem";
            titleSize = "1.875rem";
            descSize = "1.375rem";
            iconSize = "104px";
          }

          if (mobileHeadingRef.current) {
            gsap.to(mobileHeadingRef.current, {
              fontSize: headingSize,
              duration: 0.3,
            });
          }

          mobileStepRefs.current.forEach((stepEl) => {
            if (stepEl) {
              const titleEl = stepEl.querySelector("h3");
              const descEl = stepEl.querySelector("p");
              const imgEl = stepEl.querySelector("img");
              if (titleEl)
                gsap.to(titleEl, { fontSize: titleSize, duration: 0.3 });
              if (descEl)
                gsap.to(descEl, { fontSize: descSize, duration: 0.3 });
              if (imgEl)
                gsap.to(imgEl, {
                  width: iconSize,
                  height: iconSize,
                  duration: 0.3,
                });
            }
          });
        };

        updateFontSizes();
        window.addEventListener("resize", updateFontSizes);

        // Scroll Animations for each step
        mobileStepRefs.current.forEach((stepEl) => {
          if (stepEl) {
            gsap.fromTo(
              stepEl,
              { scale: 0.95, y: 40, opacity: 0 },
              {
                scale: 1,
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: stepEl,
                  start: "top 85%",
                  end: "top 40%",
                  scrub: 0.5,
                },
              }
            );
          }
        });

        // Animate timeline line
        gsap.to(".timeline-line", {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: mobileTimelineRef.current,
            start: "top 65%",
            end: "bottom 75%",
            scrub: true,
          },
        });

        return () => window.removeEventListener("resize", updateFontSizes);
      }

      // ✅ Refresh GSAP triggers on resize/fullscreen
      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);
      window.addEventListener("fullscreenchange", handleResize);
    });

    return () => {
      ctx.revert();
      window.removeEventListener("resize", ScrollTrigger.refresh);
      window.removeEventListener("fullscreenchange", ScrollTrigger.refresh);
    };
  }, []);

  return (
    <>
      {/* Desktop Section */}
      <section
        ref={desktopContainerRef}
        className="hidden 2xl:block w-full relative bg-white"
      >
        <div ref={desktopContentRef} className="min-h-screen w-full flex flex-col justify-center mt-20">
          <h1 className="text-40 font-bold font-oswald text-center">
            How Product Development Works?
          </h1>

          {/* ✅ Fixed wrapper so road + icons scale together */}
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            <div className="relative w-full">
              <img
                ref={roadRef}
                src={RoadPng}
                alt="Product development roadmap"
                className="w-full h-auto object-contain"
              />

              {roadmapSteps.map((step, index) => (
                <div
                  key={step.id}
                  ref={(el) => (desktopStepsRefs.current[index] = el)}
                  className={`absolute w-72 lg:w-80 transform opacity-0 flex items-center ${
                    step.layout === "text-left" ? "flex-row-reverse" : ""
                  }`}
                  style={{
                    top: step.style.top,
                    left: step.style.left,
                    transform: "translateY(50px)",
                  }}
                >
                  <img
                    src={step.icon}
                    alt={`${step.title} icon`}
                    className="w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0"
                  />
                  <div
                    className={`flex flex-col ${
                      step.layout === "text-left" ? "text-right" : "text-left"
                    }`}
                  >
                    <h3 className="text-xl lg:text-2xl font-semibold font-poppins">
                      {step.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Section */}
      <section className="block  2xl:hidden w-full bg-gradient-to-b from-white to-gray-50 py-8 px-4 mt-12">
        <h1
          ref={mobileHeadingRef}
          className="text-40 font-bold font-oswald text-center mb-12 text-gray-800"
        >
          How Product Development Works?
        </h1>
        <div ref={mobileTimelineRef} className="relative max-w-lg mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-blue-500 h-0 timeline-line z-0"></div>
          {steps.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => (mobileStepRefs.current[index] = el)}
              className={`relative z-10 mb-8 flex flex-col items-center ${
                index % 2 === 0 ? "text-left" : "text-right"
              }`}
            >
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-lg"></div>
              <div className="w-full bg-white rounded-xl shadow-md p-6 transform perspective-1000">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 transition-all duration-300 ease-in-out"
                  />
                </div>
                <h3 className="text-lg font-semibold font-poppins text-gray-800 mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  {step.description}
                </p>
              </div>
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
