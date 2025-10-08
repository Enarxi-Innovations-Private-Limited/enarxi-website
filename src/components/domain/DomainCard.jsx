import { motion } from "framer-motion";

const DomainCard = ({ title, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.97 }}
      className="relative w-40 h-44 sm:w-48 sm:h-52 flex flex-col items-center justify-center text-center"
    >
      <img
        src={icon}
        alt={title}
        className="w-full h-full object-contain select-none pointer-events-none"
        loading="lazy"
      />
    </motion.div>
  );
};

export default DomainCard;
