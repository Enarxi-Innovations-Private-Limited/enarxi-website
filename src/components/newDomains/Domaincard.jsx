import { motion } from "framer-motion";

const DomainCard = ({ title, icon, gradient }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 0.5 }}
      whileTap={{ scale: 0.97 }}
      className={`relative w-36 h-44 sm:w-48 sm:h-52 bg-gradient-to-br ${gradient} shadow-xl 
        flex flex-col items-center justify-center text-center p-4 
        transition-all duration-300 will-change-transform clip-hex`}
    >
      <img
        src={icon}
        alt={title}
        className="w-16 h-16 sm:w-20 sm:h-20 mb-3 object-contain"
        loading="lazy"
      />
      <h3 className="text-sm sm:text-base font-semibold text-[#333]">
        {title}
      </h3>

      {/* subtle overlay effect */}
      <div className="absolute inset-0 bg-white/20 clip-hex pointer-events-none"></div>
    </motion.div>
  );
};

export default DomainCard;
