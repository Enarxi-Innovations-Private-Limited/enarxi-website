// import RoadPng from "../../assets/images/RoadPng.png";

// import { useRef, useEffect } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // Register the GSAP plugin
// gsap.registerPlugin(ScrollTrigger);
  
// const ProductDevelopmentWorks = () => {
//     const containerRef = useRef(null);
//     const contentRef = useRef(null);
//     const stepsRefs = useRef([]);

//     useEffect(() => {
//         const ctx = gsap.context(() => {
//             gsap.timeline({
//                 scrollTrigger: {
//                     trigger: containerRef.current,
//                     start: 'top top',
//                     end: 'bottom bottom',
//                     pin: contentRef.current,
//                     scrub: 1,
//                 },
//             })
//             .to(stepsRefs.current, {
//                 opacity: 1,
//                 y: 0,
//                 ease: 'power1.inOut',
//                 stagger: 0.5,
//             });

//         }, containerRef);

//         return () => ctx.revert();
//     }, []);

//     // Updated step data with the new "Software" step and adjusted positions
//     const roadmapSteps = [
//         {
//             icon: '🧠',
//             title: 'Ideation',
//             description: 'Understanding the customer need challenging it.',
//             style: { left: '3%', top: '12%' }, // Adjusted position
//             initialTransform: '-translate-y-full',
//         },
//         {
//             icon: '⚙️',
//             title: 'Hardware',
//             description: 'Hardware planning, Schematic Design, PCB Layout.',
//             style: { left: '20%', top: '39%' }, // Adjusted position
//             initialTransform: 'translate-y-full',
//         },
//         {
//             icon: '🎯',
//             title: 'Conceptualization',
//             description: 'Structuring of Solution, Prototyping and Finalization.',
//             style: { left: '44%', top: '65%' }, // Adjusted position
//             initialTransform: '-translate-y-full',
//         },
//         {
//             icon: '📊', // New "Software" step from your image
//             title: 'Software',
//             description: 'Firmware development, App and Cloud integrations.',
//             style: { left: '66%', top: '60%' }, // Adjusted position
//             initialTransform: 'translate-y-full',
//         },
//         {
//             icon: '🌍',
//             title: 'End Product',
//             description: 'End Product Ready For Market.',
//             style: { left: '85%', top: '41%' }, // Adjusted position
//             initialTransform: '-translate-y-full',
//         }
//     ];

//     return (
//         <section ref={containerRef} className="relative" style={{ height: '300vh' }}>
//             <div ref={contentRef} className="h-screen w-full sticky top-0 flex flex-col justify-center overflow-hidden px-4">
//             <h1 className="text-4xl font-geist text-center my-12 font-oswald text-black">How Product Development Works</h1>
//                 <img
//           src={RoadPng}
//           alt="roadPng"
//           className="w-full h-auto object-contain my-12 mx-auto"
//         />
//                 {roadmapSteps.map((step, index) => (
//                     <div
//                         key={index}
//                         ref={el => stepsRefs.current[index] = el}
//                         style={step.style}
//                           className={`absolute w-52 p-5 text-center rounded-xl border border-white/30 bg-white/20 backdrop-blur-md opacity-0 dark:bg-white/10  transform ${step.initialTransform}`}
//                     >
//                         <div className="text-4xl leading-none">{step.icon}</div>
//                         <h3 className="text-2xl mt-2 text-black tracking-tighter font-geist">{step.title}</h3>
//                         <p className="mt-1 text-sm text-black/80">{step.description}</p>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default ProductDevelopmentWorks;




import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import your assets
import RoadPng from "../../assets/images/RoadPng.png";
import IdeationIcon from "../../assets/images/ideation.svg"; // Replace with your actual icon path
import ConceptualizationIcon from "../../assets/images/conceptualization.svg"; // Replace with your actual icon path
import HardwareIcon from "../../assets/images/hardware.svg"; // Replace with your actual icon path
import SoftwareIcon from "../../assets/images/software.svg"; // Replace with your actual icon path
import EndProductIcon from "../../assets/images/endProduct.svg"; // Replace with your actual icon path
// Register the GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const ProductDevelopmentWorks = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const stepsRefs = useRef([]);

    // Re-added the 'layout' property to control text direction
    const roadmapSteps = [
        {
            id: 'ideation',
            title: 'Ideation',
            description: 'Understanding the customer need challenging it to a requirement chart',
            icon: IdeationIcon,
            style: { top: '-14%', left: '4%' },
            layout: 'text-right', // Text appears to the right of the icon
        },
        {
            id: 'conceptualization',
            title: 'Conceptualization',
            description: 'Structuring of Solution, Prototyping and Finalization',
            icon: ConceptualizationIcon,
            style: { top: '13%', left:'55%' },
            layout: 'text-right',
        },
        {
            id: 'hardware',
            title: 'Hardware',
            description: 'Hardware planning, Schematic Design, PCB Layout Routing, Components Assembly and Testing',
            icon: HardwareIcon,
            style: { top: '35%', left: '8%' },
            layout: 'text-left',
        },
        {
            id: 'software',
            title: 'Software',
            description: 'Firmware development, App and Cloud integrations.',
            icon: SoftwareIcon,
            style: { top: '62%', left: '40%' },
            layout: 'text-right',
        },
        {
            id: 'end-product',
            title: 'End Product',
            description: 'End Product Ready For Market',
            icon: EndProductIcon,
            style: { top: '60%', left: '70%' },
            layout: 'text-left', // Text appears to the left of the icon
        },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    pin: contentRef.current,
                },
            })
            .to(stepsRefs.current, {
                opacity: 1,
                y: 0,
                ease: 'power1.inOut',
                stagger: 0.5,
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full relative bg-white py-12" style={{ height: '300vh' }}>
            <div ref={contentRef} className="h-screen w-full sticky top-0 flex flex-col items-center">
                <h1 className="text-4xl font-bold font-oswald my-14">How Product Development Works ?</h1>
                <div className="relative w-full h-full mx-auto">
                    <img
                      src={RoadPng}
                      alt="Product development roadmap"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto object-contain"
                    />

                    {roadmapSteps.map((step, index) => (
                        <div
                            key={step.id}
                            ref={el => stepsRefs.current[index] = el}
                            
                            className={`absolute w-80 transform opacity-0 flex items-center gap-x-2 ${
                                step.layout === 'text-left' ? 'flex-row-reverse' : ''
                            }`}
                            style={{ ...step.style, transform: 'translateY(50px)' }}
                        >
                            <img src={step.icon} alt={`${step.title} icon`} className="w-32 h-32 flex-shrink-0" />
                                                       
                            <div className={`flex flex-col ${
                                step.layout === 'text-left' ? 'text-right' : 'text-left'
                            }`}>
                                <h3 className="text-2xl font-semibold font-poppins">{step.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductDevelopmentWorks;