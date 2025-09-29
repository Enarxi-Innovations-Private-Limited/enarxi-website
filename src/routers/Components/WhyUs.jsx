import bulb from "../../assets/images/bulb.svg";
import cpu from "../../assets/images/cpu.svg";
import run from "../../assets/images/run.svg";
import wallet from "../../assets/images/wallet.svg";
import Scissors from "../../assets/images/scissors.svg";
import badge from "../../assets/images/badge.svg";


const WhyUs = () => {

     const features = [
        { icon: bulb, title: "Innovative" },
        { icon: run, title: "Faster build time" },
        { icon: badge, title: "Reliable" },
        { icon: cpu, title: "Industrial grade designs" },
        { icon: wallet, title: "Cost effective solutions" },
        { icon: Scissors, title: "Value engineering" },
      ];

    return (
        <div className="py-16 flex flex-col items-center w-[80vw]">
        {/* Why Us */}
        <div className='flex flex-col items-center mb-16'>
        <h1 className='text-oswald mb-4'>
          Why us?
        </h1>
        <p className='text-poppins mx-auto px-4 text-center'>
          We do it differently! We at ENARXI educate our customers on the complete technology to create insight into their dream products. We intend to blend the services with innovation to suit the market need, which makes us a brilliant choice. However, that's not all.
        </p>
      </div>

      {/* FEATURES */}
      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div key={feat.title} className="flex flex-col items-center p-6 bg-white rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.2)]">
                <img src={feat.icon} alt={feat.title} className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold">{feat.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    )
}

export default WhyUs;