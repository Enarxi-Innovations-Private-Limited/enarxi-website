import DomainCard from "./DomainCard";
import { domains } from "./DomainData";
import styles from "./domain.module.css";

const DomainsSection = () => {
  // Arrange domains in honeycomb pattern matching reference image
  // Row 1: 4 cards (indices 0-3)
  // Row 2: 5 cards (indices 4-8) - offset to the left
  // Row 3: 4 cards (indices 9-12) - aligned with row 1
  
  const row1 = domains.slice(0, 4);   // Industrial IOT, Drone & UAV, Wearables, Rapid Prototyping
  const row2 = domains.slice(4, 9);   // Security Devices, ML & AI, Home Automation, Access Control, Electric Vehicles
  const row3 = domains.slice(9, 13);  // Health Care Devices, AR & VR, BioMedical Equipments, Industrial Automation

  return (
    <section className="w-full py-12 md:py-16  bg-gradient-to-b from-white to-[#f9fafb] flex flex-col items-center overflow-hidden">
      <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-8 md:mb-12">
        Our Working Domains
      </h2>

      <div className={styles.honeycombContainer}>
        {/* Row 1: 4 cards */}
        <div className={styles.row1}>
          {row1.map((domain, i) => (
            <DomainCard key={`row1-${i}`} title={domain.title} icon={domain.icon} />
          ))}
        </div>

        {/* Row 2: 5 cards (offset) */}
        <div className={styles.row2}>
          {row2.map((domain, i) => (
            <DomainCard key={`row2-${i}`} title={domain.title} icon={domain.icon} />
          ))}
        </div>

        {/* Row 3: 4 cards */}
        <div className={styles.row3}>
          {row3.map((domain, i) => (
            <DomainCard key={`row3-${i}`} title={domain.title} icon={domain.icon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainsSection;
