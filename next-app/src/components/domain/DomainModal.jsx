"use client";
import React, { useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DomainModal = memo(({ isOpen, onClose, title, description, isMobile = false }) => {
  const modalRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg px-4 sm:px-6"
          style={{ willChange: "opacity" }}
          onClick={onClose}
        >
          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.92, y: isMobile ? 20 : 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: isMobile ? 15 : 20 }}
            transition={{
              duration: isMobile ? 0.2 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`relative w-full ${
              isMobile ? "max-w-sm" : "max-w-2xl"
            } text-poppins flex flex-col rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden`}
            style={{
              maxHeight: "min(90vh, 800px)",
              background:
                "linear-gradient(145deg, rgba(17,18,23,0.85) 0%, rgba(40,42,55,0.9) 50%, rgba(15,17,21,0.85) 100%)",
              backdropFilter: "blur(16px)",
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent Glow Border */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 opacity-90" />

            {/* Header */}
            <div className="flex items-start justify-between p-6 sm:p-8 border-b border-white/10 flex-shrink-0 sticky top-0 z-10 bg-gradient-to-b from-[#1a1b22]/95 to-transparent backdrop-blur-xl">
              <h3
                id="modal-title"
                className="text-xl sm:text-3xl font-oswald font-semibold text-white tracking-wide leading-snug"
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-full p-2 sm:p-2.5 text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 backdrop-blur-sm"
                style={{ willChange: "transform" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
                  stroke="currentColor"
                  className="h-6 w-6 sm:h-7 sm:w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto px-6 sm:px-8 py-6 text-base sm:text-lg text-white/90 leading-relaxed custom-scrollbar">
              {description.split("<br>").map((line, index) => (
                <p
                  key={index}
                  className="mb-5 text-white/80 font-light tracking-wide"
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              ))}
            </div>

            {/* Subtle bottom glow */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            {/* Soft outline */}
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

DomainModal.displayName = 'DomainModal';

export default DomainModal;
