import { motion } from "framer-motion";

const DomainCard = ({ title, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.11, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 120, // softer spring
        damping: 15, // more gentle damping
        mass: 0.8, // optional: makes it feel lighter
      }}
      className="relative flex flex-col items-center justify-center text-center cursor-pointer"
      style={{
        width: "200px",
        height: "200px",
      }}
    >
      {/* Hexagon background with gradient */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        <img
          src={icon}
          alt={title}
          className="w-full h-full object-contain select-none pointer-events-none"
          loading="lazy"
          draggable="false"
        />
      </div>
    </motion.div>
  );
};

export default DomainCard;
