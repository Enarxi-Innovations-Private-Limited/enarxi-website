import tp1 from "../../assets/images/tp1.svg";
import tp2 from "../../assets/images/tp2.svg";
import tp3 from "../../assets/images/tp3.svg";
import tp4 from "../../assets/images/tp4.svg";
import tp5 from "../../assets/images/tp5.svg";
import "../../index.css";

const TrustedBy = () => {
  const logos = [
    { src: tp1, alt: "Client 1" },
    { src: tp2, alt: "Client 2" },
    { src: tp3, alt: "Client 3" },
    { src: tp4, alt: "Client 4" },
    { src: tp5, alt: "Client 5" },
  ];
  return (
    <section className="py-10 w-full flex flex-col justify-center items-center overflow-hidden">
      <h2 className="text-center text-2xl font-bold mb-6 font-oswald">
        Trusted By
      </h2>

      <div className="w-[90%] mx-auto overflow-hidden">
        <div className="flex gap-20 justify-center items-center scroll">
          {logos.concat(logos).map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className="h-12 object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default TrustedBy;
