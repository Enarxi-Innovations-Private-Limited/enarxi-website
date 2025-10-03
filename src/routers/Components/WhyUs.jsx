import Bulb from "../../assets/images/bulb.svg?component";
import Cpu from "../../assets/images/cpu.svg?component";
import Run from "../../assets/images/run.svg?component";
import Wallet from "../../assets/images/wallet.svg?component";
import Scissors from "../../assets/images/scissors.svg?component";

const WhyUs = () => {
  const features = [
    { Icon: Bulb, title: "Innovative" },
    { Icon: Cpu, title: "Faster build time" },
    { Icon: Run, title: "Reliable" },
    { Icon: Wallet, title: "Cost effective solutions" },
    { Icon: Scissors, title: "Value engineering" },
    { Icon: Run, title: "Reliable" },
  ];

  return (
    <div className="py-16 flex flex-col items-center w-[80vw]">
      {/* Why Us */}
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-oswald mb-4">Why us?</h1>
        <p className="text-poppins mx-auto px-4 text-center">
          We do it differently! We at ENARXI educate our customers on the
          complete technology to create insight into their dream products. We
          intend to blend the services with innovation to suit the market need,
          which makes us a brilliant choice. However, that's not all.
        </p>
      </div>

      {/* FEATURES */}
      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="feature-card flex flex-col items-center p-6 bg-white rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.2)]
             transition-transform duration-300 hover:scale-105"
              >
                {/* Animate the icon */}
                <img
                  src={feat.Icon}
                  alt="image"
                  className="w-12 h-12 mb-4 text-blue-500 transition-transform duration-300 hover:scale-110"
                />
                <h3 className="text-lg font-semibold">{feat.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyUs;
