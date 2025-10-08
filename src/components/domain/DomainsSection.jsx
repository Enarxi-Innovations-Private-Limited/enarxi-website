import DomainCard from "./DomainCard";
import { domains } from "./DomainData";
import styles from "./domain.module.css";

const gradients = [
  "from-[#FFE1E1] to-[#E1E8FF]",
  "from-[#D9F9E8] to-[#C7E9FF]",
  "from-[#FDE1FF] to-[#C8E7F7]",
  "from-[#E0E7FF] to-[#FFF0E1]",
];

const DomainsSection = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-[#f9fafb] flex flex-col items-center">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[#0f172a] mb-12">
        Our Working Domains
      </h2>

      <div
        className={`grid grid-cols-7 gap-6 place-items-center ${styles.gridContainer}`}
      >
        {domains.map((domain, i) => (
          <div
            key={i}
            className={`relative ${i % 7 === 1 || i % 7 === 4 ? "translate-y-10" : ""}`}
          >
            <DomainCard
              title={domain.title}
              icon={domain.icon}
              gradient={gradients[i % gradients.length]}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DomainsSection;
