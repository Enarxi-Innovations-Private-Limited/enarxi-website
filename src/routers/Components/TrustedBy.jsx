import tp1 from "../../assets/images/tp1.svg";
import tp2 from "../../assets/images/tp2.svg";
import tp3 from "../../assets/images/tp3.svg";
import tp4 from "../../assets/images/tp4.svg";
import tp5 from "../../assets/images/tp5.svg";
import "../../index.css";

const TrustedBy = () => {
  const logos = [tp1, tp2, tp3, tp4, tp5];
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos]; // ensure long enough

  return (
    <section className="padding-y w-full flex flex-col justify-center items-center overflow-hidden">
      <h2 className="text-center mb-6 text-40 text-oswald-bold">Trusted By</h2>

      <div className="w-full overflow-hidden flex flex-col gap-10">
        {/* Left scrolling row */}
        <div className="scroll flex gap-20 items-center">
          {duplicatedLogos.map((src, i) => (
            <img key={`left-${i}`} src={src} alt={`Client ${i}`} className="h-12 object-contain" />
          ))}
        </div>

        {/* Right scrolling row (reverse direction) */}
        <div className="scroll-rev flex gap-20 items-center">
          {duplicatedLogos.map((src, i) => (
            <img key={`right-${i}`} src={src} alt={`Client ${i}`} className="h-12 object-contain" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
