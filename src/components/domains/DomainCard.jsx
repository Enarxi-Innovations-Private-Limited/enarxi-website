import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * DomainCard Component
 * Individual card with hover effects, lazy loading, and 3D tilt
 * 
 * @param {Object} props
 * @param {Object} props.domain - Domain data
 * @param {string} props.domain.id - Unique identifier
 * @param {string} props.domain.title - Card title
 * @param {string} props.domain.description - Card description
 * @param {string} props.domain.imageUrl - Image URL
 * @param {string} props.domain.href - Link destination
 * @param {string} props.domain.size - Card size variant ('small'|'medium'|'large')
 * @param {string} props.domain.gradient - Tailwind gradient classes
 * @param {number} props.index - Card index for stagger animation
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const DomainCard = ({ 
  domain, 
  index = 0, 
  onClick, 
  className = '' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);

  // 3D tilt effect on hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  /**
   * Handle mouse move for 3D tilt effect
   */
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  /**
   * Reset tilt on mouse leave
   */
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  /**
   * Handle card click
   */
  const handleClick = () => {
    if (onClick) {
      onClick(domain);
    } else if (domain.href) {
      window.location.href = domain.href;
    }
  };

  /**
   * Handle keyboard activation
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Size variants
  const sizeClasses = {
    small: 'w-full h-48 md:h-56',
    medium: 'w-full h-56 md:h-72',
    large: 'w-full h-72 md:h-96',
  };

  const size = domain.size || 'medium';

  // Card entrance animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      },
    },
  };

  // Hover animation
  const hoverVariants = {
    rest: {
      scale: 1,
      y: 0,
    },
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 17,
      },
    },
    tap: {
      scale: 0.98,
      y: 0,
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <motion.div
        variants={hoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details about ${domain.title}`}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`
          relative h-full w-full rounded-2xl overflow-hidden cursor-pointer
          bg-gradient-to-br ${domain.gradient || 'from-blue-500 to-purple-600'}
          shadow-lg hover:shadow-2xl transition-shadow duration-300
          focus:outline-none focus:ring-4 focus:ring-blue-500/50
          group
        `}
      >
        {/* Background Image with Blur-up */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Low-res placeholder (blur-up effect) */}
          {domain.imageUrl && !imageError && (
            <>
              <img
                src={`${domain.imageUrl}?w=50&q=10`}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-0' : 'opacity-100'
                }`}
                aria-hidden="true"
              />
              
              {/* High-res image */}
              <img
                src={domain.imageUrl}
                alt={domain.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          )}

          {/* Fallback icon if no image or error */}
          {(!domain.imageUrl || imageError) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Sparkles className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 z-10">
          {/* Title */}
          <motion.h3
            className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight"
            style={{ transform: 'translateZ(20px)' }}
          >
            {domain.title}
          </motion.h3>

          {/* Description */}
          {domain.description && (
            <motion.p
              className="text-sm md:text-base text-white/90 mb-4 line-clamp-2 group-hover:line-clamp-3 transition-all"
              style={{ transform: 'translateZ(15px)' }}
            >
              {domain.description}
            </motion.p>
          )}

          {/* Action Button */}
          <motion.div
            className="flex items-center space-x-2 text-white font-semibold"
            style={{ transform: 'translateZ(25px)' }}
          >
            <span className="text-sm md:text-base">Explore</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"
          style={{ transform: 'translateZ(30px)' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default DomainCard;
