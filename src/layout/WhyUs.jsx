import { motion } from "framer-motion";
import Bulb from "../assets/images/whyus/bulb.svg?component";
import Cpu from "../assets/images/whyus/cpu.svg?component";
import Run from "../assets/images/whyus/run.svg?component";
import Wallet from "../assets/images/whyus/wallet.svg?component";
import Scissors from "../assets/images/whyus/scissors.svg?component";
import Reliable from "../assets/images/whyus/reliable.svg?component";

/**
 * Icon-specific animation variants for hover
 */
const iconAnimations = {
  // Lightbulb: Glowing effect (removed opacity for clarity)
  bulb: {
    whileHover: {
      filter: [
        "drop-shadow(0 0 0px rgba(251, 191, 36, 0))",
        "drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))",
        "drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))",
        "drop-shadow(0 0 6px rgba(251, 191, 36, 0.5))",
        "drop-shadow(0 0 0px rgba(251, 191, 36, 0))",
      ],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  // Running figure: Running motion
  run: {
    whileHover: {
      x: [0, 3, 0, -3, 0],
      rotate: [0, -2, 0, 2, 0],
    },
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  // Reliable (Medal/Thumbs up): Pulse and slight bounce
  reliable: {
    whileHover: {
      scale: [1, 1.1, 1],
      y: [0, -4, 0],
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  // CPU/Chip: Electricity flow effect (removed opacity for clarity)
  cpu: {
    whileHover: {
      filter: [
        "drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
        "drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))",
        "drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
      ],
      scale: [1, 1.02, 1],
    },
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "linear",
    },
  },

  // Wallet: Money pop out effect
  wallet: {
    whileHover: {
      y: [0, -3, 0],
      scale: [1, 1.05, 1],
    },
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  // Scissors: Opening and closing
  scissors: {
    whileHover: {
      rotate: [0, 15, 0, -15, 0],
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const WhyUs = () => {
  const features = [
    { Icon: Bulb, title: "Innovative", animationKey: "bulb" },
    { Icon: Run, title: "Faster build time", animationKey: "run" },
    { Icon: Reliable, title: "Reliable", animationKey: "reliable" },
    { Icon: Cpu, title: "Industrial grade designs", animationKey: "cpu" },
    { Icon: Wallet, title: "Cost effective solutions", animationKey: "wallet" },
    { Icon: Scissors, title: "Value engineering", animationKey: "scissors" },
  ];

  // Container animation for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Card entrance animation
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="mt-20 flex flex-col items-center w-full px-4">
      {/* Why Us Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-16 max-w-4xl"
      >
        <h1 className="text-oswald-bold mb-4 text-4xl text-font-bold text-gray-900">
          Why us?
        </h1>
        <p className="text-poppins text-center text-sm md:text-base text-gray-600 leading-relaxed">
          We do it differently! We at ENARXI educate our customers on the
          complete technology to create insight into their dream products. We
          intend to blend the services with innovation to suit the market need,
          which makes us a brilliant choice. However, that's not all.
        </p>
      </motion.div>

      {/* FEATURES Grid */}
      <section className="w-full max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feat, index) => (
            <motion.div
              key={feat.title}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
              }}
              
              className="flex flex-col p-8 bg-white rounded-2xl shadow-[0_4px_15px_rgba(59,130,246,0.15)] justify-center items-center relative overflow-hidden group cursor-pointer"
            >
              {/* Animated Icon */}
              <motion.div
                className="mb-6 relative"
                whileHover={iconAnimations[feat.animationKey].whileHover}
                transition={iconAnimations[feat.animationKey].transition}
              >
                <img
                  src={feat.Icon}
                  alt={feat.title}
                  className="w-16 h-16 md:w-20 md:h-20 select-none pointer-events-none"
                  draggable="false"
                />
              </motion.div>

              {/* Title */}
              <h3 className="font-poppins text-center text-base md:text-lg font-semibold text-gray-800 leading-snug">
                {feat.title}
              </h3>

            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default WhyUs;



// import Bulb from "../../assets/images/whyus/bulb.svg?component";
// import Cpu from "../../assets/images/whyus/cpu.svg?component";
// import Run from "../../assets/images/whyus/run.svg?component";
// import Wallet from "../../assets/images/whyus/wallet.svg?component";
// import Scissors from "../../assets/images/whyus/scissors.svg?component";
// import Reliable from "../../assets/images/whyus/reliable.svg?component";

// const WhyUs = () => {
//   const features = [
//     { Icon: Bulb, title: "Innovative" },
//     { Icon: Run, title: "Faster build time" },
//     { Icon: Reliable, title: "Reliable" },
//     { Icon: Cpu, title: "Industrial grade designs" },
//     { Icon: Wallet, title: "Cost effective solutions" },
//     { Icon: Scissors, title: "Value engineering" },
//   ];

//   return (
//     <div className="py-16 flex flex-col items-center w-[90vw]">
//       {/* Why Us */}
//       <div className="flex flex-col items-center mb-16">
//         <h1 className="font-oswald mb-4  md:text-2xl">Why us?</h1>
//         <p className="text-poppins mx-auto text-center text-sm md:text-xl">
//           We do it differently! We at ENARXI educate our customers on the
//           complete technology to create insight into their dream products. We
//           intend to blend the services with innovation to suit the market need,
//           which makes us a brilliant choice. However, that's not all.
//         </p>
//       </div>

//       {/* FEATURES */}
//       <section className="py-4 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 ">
//             {features.map((feat) => (
//               <div
//                 key={feat.title}
//                 className="feature-card flex flex-col p-6 bg-white rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.2)]
//              transition-transform duration-300 hover:scale-105 justify-center items-center"
//               >
//                 {/* Animate the icon */}
//                 <img
//                   src={feat.Icon}
//                   alt="image"
//                   className="w-12 h-12 mb-4 text-blue-500 transition-transform duration-300 hover:scale-110"
//                 />
//                 <h3 className="font-poppins text-center leading-snug">{feat.title}</h3>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default WhyUs;
