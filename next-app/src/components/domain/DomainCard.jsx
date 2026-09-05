"use client";
import { motion } from "framer-motion";
import { memo } from "react";

const DomainCard = memo(({ title, icon, onClick }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.08,
        y: -8,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      }}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center text-center cursor-pointer hexagon-card"
      style={{
        width: "200px",
        height: "200px",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
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
          decoding="async"
        />
      </div>
    </motion.div>
  );
});

DomainCard.displayName = 'DomainCard';

export default DomainCard;
