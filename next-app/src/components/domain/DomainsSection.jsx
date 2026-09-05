"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import DomainCard from "./DomainCard";
import DomainModal from "./DomainModal";
import { domains } from "./DomainData";
import styles from "./domain.module.css";
import "./Domains.css";

const DomainsSection = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport with debouncing for better performance
  useEffect(() => {
    let timeoutId;
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    checkMobile();
    window.addEventListener('resize', debouncedCheck);
    
    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  // Memoize domain rows to prevent recalculation
  const { row1, row2, row3 } = useMemo(() => ({
    row1: domains.slice(0, 4),   // Industrial IOT, Drone & UAV, Wearables, Rapid Prototyping
    row2: domains.slice(4, 9),   // Security Devices, ML & AI, Home Automation, Access Control, Electric Vehicles
    row3: domains.slice(9, 13),  // Health Care Devices, AR & VR, BioMedical Equipments, Industrial Automation
  }), []);

  const handleCardClick = useCallback((domain) => {
    setSelectedDomain(domain);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDomain(null);
  }, []);

  return (
    <section className="w-full mt-28  bg-gradient-to-b from-[#DEF4FF]/10 via-[#DEF4FF] to-white flex flex-col items-center overflow-hidden">
      <h2 className="text-center  text-[#0f172a] mb-8 md:mb-12 text-oswald-bold text-40">
        Our Working Domains
      </h2>

      <div className={styles.honeycombContainer}>
        {/* Row 1: 4 cards */}
        <div className={styles.row1}>
          {row1.map((domain) => (
            <DomainCard 
              key={domain.title} 
              title={domain.title} 
              icon={domain.icon}
              onClick={() => handleCardClick(domain)}
            />
          ))}
        </div>

        {/* Row 2: 5 cards (offset) */}
        <div className={styles.row2}>
          {row2.map((domain) => (
            <DomainCard 
              key={domain.title} 
              title={domain.title} 
              icon={domain.icon}
              onClick={() => handleCardClick(domain)}
            />
          ))}
        </div>

        {/* Row 3: 4 cards */}
        <div className={styles.row3}>
          {row3.map((domain) => (
            <DomainCard 
              key={domain.title} 
              title={domain.title} 
              icon={domain.icon}
              onClick={() => handleCardClick(domain)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <DomainModal
        isOpen={!!selectedDomain}
        onClose={handleCloseModal}
        title={selectedDomain?.title || ""}
        description={selectedDomain?.description || ""}
        isMobile={isMobile}
      />
    </section>
  );
};

export default DomainsSection;
