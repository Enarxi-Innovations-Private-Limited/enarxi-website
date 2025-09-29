// import { useRef, useEffect } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // Register the GSAP plugin
// gsap.registerPlugin(ScrollTrigger);

// // SVG component remains the same, but uses default Tailwind stroke colors
// const RoadmapSVG = () => (
//     <svg className="absolute w-full max-w-4xl h-auto" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
//         <path d="M 66.05,73.49 C 66.05,73.49 211.13,73.49 211.13,73.49 275.29,73.49 327.93,126.13 327.93,190.29 327.93,254.45 275.29,307.08 211.13,307.08 146.97,307.08 66.05,307.08 66.05,307.08 -16.14,307.08 30.63,423.86 112.42,423.86 194.21,423.86 327.93,423.86 327.93,423.86 392.08,423.86 444.72,476.50 444.72,540.66"
//               fill="none" strokeWidth="8" strokeLinecap="round" className="stroke-gray-400 dark:stroke-slate-600"/>
//     </svg>
// );

// const Roadmap = () => {
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

//     const roadmapSteps = [
//         // The positioning is now handled by an inline style object
//         {
//             icon: '🧠',
//             title: 'Ideation',
//             description: 'Understanding the customer need and challenging it.',
//             style: { left: '10%', top: '5%' },
//             initialTransform: '-translate-y-full',
//         },
//         {
//             icon: '⚙️',
//             title: 'Hardware',
//             description: 'Hardware planning, Schematic Design, PCB Layout.',
//             style: { left: '5%', bottom: '25%' },
//             initialTransform: 'translate-y-full',
//         },
//         {
//             icon: '🎯',
//             title: 'Conceptualization',
//             description: 'Structuring of Solution, Prototyping and Finalization.',
//             style: { left: '35%', top: '20%' },
//             initialTransform: '-translate-y-full',
//         },
//         {
//             icon: '📊',
//             title: 'Analytics',
//             description: '(Added for example)',
//             style: { left: '45%', bottom: '5%' },
//             initialTransform: 'translate-y-full',
//         },
//         {
//             icon: '🌍',
//             title: 'End Product',
//             description: 'End Product Ready For Market.',
//             style: { right: '10%', bottom: '20%' },
//             initialTransform: 'translate-y-full',
//         }
//     ];

//     return (
//         // The 300vh height is now applied via an inline style
//         <section ref={containerRef} className="relative" style={{ height: '300vh' }}>
//             <div ref={contentRef} className="h-screen w-full sticky top-0 flex justify-center items-center overflow-hidden">
//                 <RoadmapSVG />

//                 {roadmapSteps.map((step, index) => (
//                     <div
//                         key={index}
//                         // Add the step's specific ref to the array of refs
//                         ref={el => stepsRefs.current[index] = el}
//                         // The style attribute is used for positioning
//                         style={step.style}
//                         // Classes are used for everything else. Note the default Tailwind colors.
//                         className={`absolute w-52 p-5 text-center bg-gray-100 border border-gray-300 rounded-xl
//                                     dark:bg-slate-800 dark:border-slate-700
//                                     opacity-0 transform ${step.initialTransform}`}
//                     >
//                         <div className="text-4xl leading-none">{step.icon}</div>
//                         <h3 className="text-xl font-bold mt-2 text-slate-900 dark:text-white">{step.title}</h3>
//                         <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default Roadmap;



import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// SVG component with the new, wider road path
const RoadmapSVG = () => (
    <svg
      className="absolute w-full max-w-9xl h-auto"
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Road background (thick black line) */}
      <path
        d="
          M 50,150
          H 250
          Q 300,150 300,200
          V 250
          Q 300,300 350,300
          H 550
          Q 600,300 600,350
          V 400
          Q 600,450 650,450
          H 850
          Q 900,450 900,400
          V 350
          Q 900,300 950,300
          H 1150
        "
        fill="none"
        stroke="black"
        strokeWidth="30"
        strokeLinecap="round"
        className="stroke-slate-200 dark:stroke-slate-800"
      />
  
      {/* Center dashed divider (white, thinner) */}
      <path
        d="
          M 50,150
          H 250
          Q 300,150 300,200
          V 250
          Q 300,300 350,300
          H 550
          Q 600,300 600,350
          V 400
          Q 600,450 650,450
          H 850
          Q 900,450 900,400
          V 350
          Q 900,300 950,300
          H 1150
        "
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeDasharray="30,20"
        strokeLinecap="round"
        className="stroke-slate-800 dark:stroke-slate-800"
      />
    </svg>
  );
  
const Roadmap = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const stepsRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    pin: contentRef.current,
                    scrub: 1,
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

    // Updated step data with the new "Software" step and adjusted positions
    const roadmapSteps = [
        {
            icon: '🧠',
            title: 'Ideation',
            description: 'Understanding the customer need challenging it.',
            style: { left: '3%', top: '12%' }, // Adjusted position
            initialTransform: '-translate-y-full',
        },
        {
            icon: '⚙️',
            title: 'Hardware',
            description: 'Hardware planning, Schematic Design, PCB Layout.',
            style: { left: '20%', top: '39%' }, // Adjusted position
            initialTransform: 'translate-y-full',
        },
        {
            icon: '🎯',
            title: 'Conceptualization',
            description: 'Structuring of Solution, Prototyping and Finalization.',
            style: { left: '44%', top: '65%' }, // Adjusted position
            initialTransform: '-translate-y-full',
        },
        {
            icon: '📊', // New "Software" step from your image
            title: 'Software',
            description: 'Firmware development, App and Cloud integrations.',
            style: { left: '66%', top: '60%' }, // Adjusted position
            initialTransform: 'translate-y-full',
        },
        {
            icon: '🌍',
            title: 'End Product',
            description: 'End Product Ready For Market.',
            style: { left: '85%', top: '41%' }, // Adjusted position
            initialTransform: '-translate-y-full',
        }
    ];

    return (
        <section ref={containerRef} className="relative bg-[#060607]" style={{ height: '300vh' }}>
            <div ref={contentRef} className="h-screen w-full sticky top-0 flex justify-center overflow-hidden px-4">
            <h1 className="text-4xl font-geist text-center my-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-orange-100 to-white">How Product Development Works</h1>
                <RoadmapSVG />
                {roadmapSteps.map((step, index) => (
                    <div
                        key={index}
                        ref={el => stepsRefs.current[index] = el}
                        style={step.style}
                          className={`absolute w-52 p-5 text-center rounded-xl border border-white/30 bg-white/20 backdrop-blur-md opacity-0 dark:bg-white/10  transform ${step.initialTransform}`}
                    >
                        <div className="text-4xl leading-none">{step.icon}</div>
                        <h3 className="text-2xl mt-2 text-black tracking-tighter font-geist">{step.title}</h3>
                        <p className="mt-1 text-sm text-black/80">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Roadmap;

