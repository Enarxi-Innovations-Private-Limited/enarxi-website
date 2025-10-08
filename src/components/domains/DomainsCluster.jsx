import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DomainCard from './DomainCard';

/**
 * DomainsCluster Component
 * Modern asymmetric card layout with mobile carousel
 * 
 * @param {Object} props
 * @param {Array} props.domains - Array of domain objects
 * @param {number} props.initialIndex - Initial carousel index (mobile)
 * @param {Function} props.onCardClick - Card click handler
 * @param {string} props.className - Additional CSS classes
 */
const DomainsCluster = ({ 
  domains = [], 
  initialIndex = 0, 
  onCardClick,
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

  /**
   * Detect mobile viewport
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Handle carousel navigation
   */
  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth',
      });
    }
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? domains.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === domains.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  /**
   * Detect scroll snap position
   */
  useEffect(() => {
    if (!isMobile || !carouselRef.current) return;

    const handleScroll = () => {
      const scrollLeft = carouselRef.current.scrollLeft;
      const slideWidth = carouselRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setCurrentIndex(newIndex);
    };

    const carousel = carouselRef.current;
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Frame animation
  const frameVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
  };

  if (domains.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-500">No domains to display</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop/Tablet: Asymmetric Grid Layout */}
      {!isMobile ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          {/* Single frame container with asymmetric grid */}
          <motion.div
            variants={frameVariants}
            className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-3xl -z-10" />

            {/* Asymmetric masonry-style grid */}
            <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-fr">
              {domains.map((domain, index) => {
                // Asymmetric layout pattern (matching reference image style)
                const layouts = [
                  'col-span-12 md:col-span-5 row-span-1', // Large left
                  'col-span-12 md:col-span-4 row-span-1', // Medium center-top
                  'col-span-12 md:col-span-3 row-span-1', // Small right-top
                  'col-span-12 md:col-span-3 row-span-1', // Small left-bottom
                  'col-span-12 md:col-span-6 row-span-1', // Large center-bottom
                  'col-span-12 md:col-span-3 row-span-1', // Small right-bottom
                  'col-span-12 md:col-span-4 row-span-1', // Medium left
                  'col-span-12 md:col-span-5 row-span-1', // Large center
                  'col-span-12 md:col-span-3 row-span-1', // Small right
                  'col-span-12 md:col-span-6 row-span-1', // Large left
                  'col-span-12 md:col-span-6 row-span-1', // Large right
                  'col-span-12 md:col-span-4 row-span-1', // Medium center
                  'col-span-12 md:col-span-8 row-span-1', // Extra large
                ];

                const layoutClass = layouts[index % layouts.length];

                // Add slight rotation and offset for asymmetric feel
                const rotations = ['-2deg', '1deg', '-1deg', '2deg', '0deg', '-1.5deg'];
                const rotation = rotations[index % rotations.length];

                return (
                  <motion.div
                    key={domain.id}
                    className={layoutClass}
                    style={{
                      transform: `rotate(${rotation})`,
                    }}
                    whileHover={{
                      transform: `rotate(0deg)`,
                      zIndex: 10,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <DomainCard
                      domain={domain}
                      index={index}
                      onClick={onCardClick}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      ) : (
        /* Mobile: Horizontal Carousel */
        <div
          className="relative"
          onKeyDown={handleKeyDown}
          role="region"
          aria-roledescription="carousel"
          aria-label="Domains carousel"
        >
          {/* Carousel container */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4 pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {domains.map((domain, index) => (
              <div
                key={domain.id}
                className="flex-shrink-0 w-[85vw] snap-center"
              >
                <DomainCard
                  domain={domain}
                  index={index}
                  onClick={onCardClick}
                />
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              aria-label="Previous slide"
              aria-controls="carousel"
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dot Indicators */}
            <div className="flex space-x-2">
              {domains.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentIndex === index ? 'true' : 'false'}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    currentIndex === index
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              aria-label="Next slide"
              aria-controls="carousel"
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-4 text-sm text-gray-600">
            <span className="font-semibold">{currentIndex + 1}</span> / {domains.length}
          </div>
        </div>
      )}

      {/* Hide scrollbar globally for carousel */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DomainsCluster;
