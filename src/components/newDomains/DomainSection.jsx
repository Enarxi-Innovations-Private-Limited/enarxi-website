import DomainCard from "./Domaincard";
import {domains} from "./DomainData";

const gradients = [
  "from-[#FFE1E1] to-[#E1E8FF]",
  "from-[#D9F9E8] to-[#C7E9FF]",
  "from-[#FDE1FF] to-[#C8E7F7]",
  "from-[#E0E7FF] to-[#FFF0E1]",
];

const DomainsSection = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-[#f9fafb]">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[#0f172a] mb-12">
        Our Working Domains
      </h2>

      {/* Desktop layout */}
      <div className="hidden sm:flex flex-wrap justify-center gap-x-8 gap-y-8">
        {domains.map((domain, i) => (
          <div
            key={i}
            className={`relative transform ${
              i % 2 === 0 ? "translate-y-6" : ""
            }`}
          >
            <DomainCard
              title={domain.title}
              icon={domain.icon}
              gradient={gradients[i % gradients.length]}
            />
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="sm:hidden overflow-x-auto no-scrollbar flex gap-4 px-6 snap-x snap-mandatory">
        {domains.map((domain, i) => (
          <div key={i} className="snap-center flex-shrink-0">
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
