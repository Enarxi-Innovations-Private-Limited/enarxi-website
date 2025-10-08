// "use client";

// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { motion } from "framer-motion";

// import idea from "../../assets/images/idea.svg";
// import people from "../../assets/images/people.svg";
// import packageHands from "../../assets/images/package.svg";
// import computer from "../../assets/images/computer.svg";

// // ============================================================================
// // CONSTANTS
// // ============================================================================

// const ANIMATION_CONFIG = {
//   duration: 2000,
//   threshold: 0.3,
//   easing: (t) => t * (2 - t),
// };

// const STATS_DATA = [
//   { id: "projects", icon: idea, value: 500, label: "Projects Completed", suffix: "+" },
//   { id: "events", icon: people, value: 30, label: "Events & Workshops", suffix: "+" },
//   { id: "participants", icon: packageHands, value: 2000, label: "Participants", suffix: "+" },
//   { id: "clients", icon: computer, value: 500, label: "Happy Clients", suffix: "+" },
// ];

// // ============================================================================
// // CUSTOM HOOKS (No changes needed here)
// // ============================================================================
// const useIntersectionObserver = (callback, options = {}) => {
//   const ref = useRef(null);
//   useEffect(() => {
//     const element = ref.current;
//     if (!element) return;
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         callback(entry);
//         observer.disconnect();
//       }
//     }, options);
//     observer.observe(element);
//     return () => {
//       observer.disconnect();
//     };
//   }, [callback, options]);
//   return ref;
// };

// const useAnimatedCounter = (end, duration = ANIMATION_CONFIG.duration, shouldStart = false) => {
//   const [count, setCount] = useState(0);
//   const frameRef = useRef();
//   const startTimeRef = useRef();
//   useEffect(() => {
//     if (!shouldStart) return;
//     const animate = (currentTime) => {
//       if (!startTimeRef.current) {
//         startTimeRef.current = currentTime;
//       }
//       const elapsed = currentTime - startTimeRef.current;
//       const progress = Math.min(elapsed / duration, 1);
//       const easedProgress = ANIMATION_CONFIG.easing(progress);
//       const currentCount = Math.floor(easedProgress * end);
//       setCount(currentCount);
//       if (progress < 1) {
//         frameRef.current = requestAnimationFrame(animate);
//       } else {
//         setCount(end);
//       }
//     };
//     frameRef.current = requestAnimationFrame(animate);
//     return () => {
//       if (frameRef.current) {
//         cancelAnimationFrame(frameRef.current);
//       }
//     };
//   }, [shouldStart, end, duration]);
//   return count;
// };


// // ============================================================================
// // COMPONENTS
// // ============================================================================

// const Counter = ({ end, duration = ANIMATION_CONFIG.duration, suffix = "" }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const handleIntersection = useCallback(() => {
//     setIsVisible(true);
//   }, []);
//   const ref = useIntersectionObserver(handleIntersection, {
//     threshold: ANIMATION_CONFIG.threshold,
//     rootMargin: "0px",
//   });
//   const count = useAnimatedCounter(end, duration, isVisible);
//   return (
//     <span ref={ref} className="tabular-nums">
//       {count.toLocaleString()}
//       {suffix}
//     </span>
//   );
// };

// const StatCard = ({ stat, index }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-50px" }}
//       transition={{
//         duration: 0.5,
//         delay: index * 0.1,
//         ease: [0.25, 0.1, 0.25, 1],
//       }}
//       className="flex flex-col items-center gap-2 group"
//     >
//       {/* Icon Container */}
//       <div className="relative">
//         {/* 👉 CHANGE: Updated hover glow to a brighter cyan */}
//         <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/50 to-cyan-500/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
//         <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-3 ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 group-hover:scale-110">
//           <img
//             src={stat.icon}
//             alt={`${stat.label} icon`}
//             className="h-8 w-8 object-contain filter brightness-0 invert"
//             loading="lazy"
//           />
//         </div>
//       </div>

//       {/* Stats Content */}
//       <div className="flex flex-col items-center">
//         <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">
//           <Counter end={stat.value} suffix={stat.suffix} />
//         </div>
//         {/* 👉 CHANGE: Brightened the label text color for better contrast */}
//         <p className="text-xs text-slate-400 font-medium tracking-wide">
//           {stat.label}
//         </p>
//       </div>
//     </motion.div>
//   );
// };

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// export default function OurStats() {
//   const stats = useMemo(() => STATS_DATA, []);

//   return (
//     <section
//       // 👉 CHANGE: Swapped flat blue for a premium dark navy gradient
//       className="relative w-full bg-gradient-to-br from-gray-900 via-[#182857] to-gray-900 py-10 md:py-12 overflow-hidden"
//       aria-labelledby="stats-heading"
//     >
//       {/* Width Control Container */}
//       <div className="relative max-w-7xl mx-auto px-4 md:px-6">
//         {/* Section Header */}
//         <div className="text-center mb-8 md:mb-10">
//           <h2
//             id="stats-heading"
//             className="text-2xl font-bold text-white mb-3"
//           >
//             Our Impact in Numbers
//           </h2>
//           {/* 👉 CHANGE: Brightened the paragraph text color */}
//           <p className="text-slate-400 text-sm max-w-2xl mx-auto">
//             Trusted by hundreds of clients worldwide, delivering excellence in every project
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//           {stats.map((stat, index) => (
//             <StatCard key={stat.id} stat={stat} index={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }








"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

import idea from "../../assets/images/idea.svg";
import people from "../../assets/images/people.svg";
import packageHands from "../../assets/images/package.svg";
import computer from "../../assets/images/computer.svg";

// ============================================================================
// CONSTANTS
// ============================================================================

const ANIMATION_CONFIG = {
  duration: 2000,
  threshold: 0.3,
  easing: (t) => t * (2 - t),
};

const STATS_DATA = [
  { id: "projects", icon: idea, value: 500, label: "Projects Completed", suffix: "+" },
  { id: "events", icon: people, value: 30, label: "Events & Workshops", suffix: "+" },
  { id: "participants", icon: packageHands, value: 2000, label: "Participants", suffix: "+" },
  { id: "clients", icon: computer, value: 500, label: "Happy Clients", suffix: "+" },
];

// ============================================================================
// CUSTOM HOOKS (No changes needed here)
// ============================================================================
// ... (Your custom hooks remain the same)

const useIntersectionObserver = (callback, options = {}) => {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback(entry);
        observer.disconnect();
      }
    }, options);
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [callback, options]);
  return ref;
};

const useAnimatedCounter = (end, duration = ANIMATION_CONFIG.duration, shouldStart = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef();
  const startTimeRef = useRef();
  useEffect(() => {
    if (!shouldStart) return;
    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = ANIMATION_CONFIG.easing(progress);
      const currentCount = Math.floor(easedProgress * end);
      setCount(currentCount);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [shouldStart, end, duration]);
  return count;
};


// ============================================================================
// COMPONENTS
// ============================================================================

const Counter = ({ end, duration = ANIMATION_CONFIG.duration, suffix = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleIntersection = useCallback(() => {
    setIsVisible(true);
  }, []);
  const ref = useIntersectionObserver(handleIntersection, {
    threshold: ANIMATION_CONFIG.threshold,
    rootMargin: "0px",
  });
  const count = useAnimatedCounter(end, duration, isVisible);
  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatCard = ({ stat, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="flex flex-col items-center gap-2 group" // Reduced gap
    >
      {/* Icon Container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
        {/* 👉 CHANGE: Even smaller padding */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-3 ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 group-hover:scale-110">
          <img
            src={stat.icon}
            alt={`${stat.label} icon`}
            // 👉 CHANGE: Even smaller icon size
            className="h-8 w-8 object-contain filter brightness-0 invert"
            loading="lazy"
          />
        </div>
      </div>

      {/* Stats Content */}
      <div className="flex flex-col items-center">
        {/* 👉 CHANGE: Even smaller counter font size */}
        <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          <Counter end={stat.value} suffix={stat.suffix} />
        </div>
        {/* 👉 CHANGE: Even smaller label font size */}
        <p className="text-xs text-slate-300 font-medium tracking-wide">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OurStats() {
  const stats = useMemo(() => STATS_DATA, []);

  return (
    <section
      // 👉 CHANGE: Further reduced vertical padding
      className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 md:py-12 overflow-hidden"
      aria-labelledby="stats-heading"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(56,189,248,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      {/* ==================================================================
        👉 PINPOINTED: CHANGE THE WIDTH HERE 
        Change max-w-7xl to max-w-6xl, max-w-5xl, etc. to control the width.
        ==================================================================
      */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        {/* Optional Section Header */}
        {/* 👉 CHANGE: Further reduced margin-bottom */}
        <div className="text-center mb-8 md:mb-10">
          <h2
            id="stats-heading"
            // 👉 CHANGE: Even smaller heading font size
            className="text-3xl font-bold text-white mb-3"
          >
            Our Impact in Numbers
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Trusted by hundreds of clients worldwide, delivering excellence in every project
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}