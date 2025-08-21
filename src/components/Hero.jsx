import React from "react";
import {
  ArrowRight,
} from "lucide-react";

// Assets
import avatar1 from "../assets/images/avatar-1.png";
import avatar2 from "../assets/images/avatar-2.png";
import avatar3 from "../assets/images/avatar-3.png";
import bulb from "../assets/images/bulb.svg";
import cpu from "../assets/images/cpu.svg";
import run from "../assets/images/run.svg";
import wallet from "../assets/images/wallet.svg";
import Scissors from "../assets/images/scissors.svg";
import badge from "../assets/images/badge.svg";
import computer from "../assets/images/computer.svg";
// import Handpackage from "../assets/vpackage.svg";
import idea from "../assets/images/idea.svg";
import people from "../assets/images/people.svg";
import HowWeTravel from "../assets/images/how-we-travel.svg";
import IconProduct from "../assets/images/product-design.svg";
import IconMCFirmware from "../assets/images/mc-firmware.svg";
import IconPCB from "../assets/images/pcb-design.svg";
import workDomain from "../assets/images/workdomain.svg";
import tp1 from "../assets/images/tp1.svg";
import tp2 from "../assets/images/tp2.svg";
import tp3 from "../assets/images/tp3.svg";
import tp4 from "../assets/images/tp4.svg";
import tp5 from "../assets/images/tp5.svg";
import heroImage from "../assets/images/heroImage.svg";

export default function Home() {
  const services = [
    {
      icon: IconProduct,
      title: "Product Design & Prototyping",
      text: "Perfect balance of functionality, transformation, and innovation in electronics.",
    },
    {
      icon: IconMCFirmware,
      title: "Micro Controller & Processor Coding Services",
      text: "Advanced firmware solutions for microcontroller and processor boards to complement your product.",
    },
    {
      icon: IconPCB,
      title: "PCB Design & Fabrication",
      text: "High-density PCB layouts to meet market demands for sophisticated designs driven by miniaturization and semiconductor technology.",
    },
  ];

  const stats = [
    { icon: computer, value: "500+", label: "Projects" },
    // { icon: Handpackage, value: "50+", label: "Products" },
    { icon: idea, value: "30+", label: "Events & Workshops" },
    { icon: people, value: "2000+", label: "Participants" },
  ];

  const features = [
    { icon: bulb, title: "Innovative" },
    { icon: run, title: "Faster build time" },
    { icon: badge, title: "Reliable" },
    { icon: cpu, title: "Industrial grade designs" },
    { icon: wallet, title: "Cost effective solutions" },
    { icon: Scissors, title: "Value engineering" },
  ];

  const logos = [
    { src: tp1, alt: "Client 1" },
    { src: tp2, alt: "Client 2" },
    { src: tp3, alt: "Client 3" },
    { src: tp4, alt: "Client 4" },
    { src: tp5, alt: "Client 5" },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* HERO */}
      <section className="w-full h-[calc(100vh-64px)] bg-gradient-to-b from-[#DEF4FF] to-white flex flex-col items-center justify-center text-center px-4">
        <p className="text-[#1840A7] capitalize text-xl md:text-3xl lg:4xl font-noto mb-4 mt-6">
          Don't just dream it, build it
        </p>

        <h1 className="font-semibold text-[#0A1524] max-w-4xl text-xl md:text-[34px] font-poppins leading-snug capitalize mb-6">
          Your imagination knows no bounds. Let's make something amazing
          together!
        </h1>

        <button className="bg-[#0A1524] text-white px-8 py-3 rounded-full shadow transition flex items-center gap-2 cursor-pointer mb-12">
          Explore →
        </button>

        {/* img */}
        <div className="w-full flex justify-center bottom-0">
          <img
            src={heroImage}
            alt="heroImage"
            className="w-48 h-44 mt-6 md:w-1/4 md:h-auto object-cover "
          />
        </div>
      </section>

      {/* STATS */}
      <section className="w-full bg-[#0B1A27] py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <img
                src={s.icon}
                alt=""
                className="h-12 w-12 mb-2 object-contain"
              />
              <p>
                <span className="text-xl font-semibold">{s.value}</span>{" "}
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WORKING DOMAINS */}
      <div className="w-full flex justify-center py-12">
        <img
          src={workDomain}
          alt="Work Domain"
          className="w-full max-w-[1120px] h-auto"
        />
      </div>

      {/* SERVICES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-4xl font-extrabold">Services We Offer You</h2>
            <p className="mt-6 text-slate-600">
              Our custom software design and development teams can deliver
              market-ready products.
            </p>
            <a
              href="/services"
              className="mt-6 inline-flex items-center gap-2 font-semibold underline text-slate-900 hover:text-[#09B8DC]"
            >
              SEE WHAT WE CAN DO <ArrowRight className="h-5 w-5" />
            </a>
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-slate-200">
              {services.map((s) => (
                <li key={s.title} className="flex gap-6 py-6">
                  <img
                    src={s.icon}
                    alt=""
                    className="h-16 w-16 object-contain"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-slate-600">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#0B1A27] py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 rounded-3xl shadow-xl text-white">
          <div>
            <h2 className="text-3xl font-extrabold">
              Lets get started implement on your ideas 💡
            </h2>
            <p className="mt-5 text-slate-300">
              Let's Stay home, Stay safe and save lives. Connect us digitally,
              we are all ears for you.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex -space-x-3 mb-2">
              <img
                src={avatar1}
                alt="team1"
                className="h-10 w-10 rounded-full ring-2 ring-white"
              />
              <img
                src={avatar2}
                alt="team2"
                className="h-10 w-10 rounded-full ring-2 ring-white"
              />
              <img
                src={avatar3}
                alt="team3"
                className="h-10 w-10 rounded-full ring-2 ring-white"
              />
            </div>
            <p className="text-sm text-slate-300 text-center mb-4">
              Join with our team to get your product ideas done
            </p>
            <a
              href="/contact"
              className="inline-flex rounded-full bg-[#09B8DC] px-8 py-3 font-semibold hover:bg-[#08A0C6] transition"
            >
              Let’s Connect
            </a>
          </div>
        </div>
      </section>

      {/* HOW WE TRAVEL */}
      <section className="w-full py-16 flex flex-col items-center bg-white">
        <h1 className="font-oswald text-2xl md:text-3xl mb-6">
          How Product Development Works?
        </h1>
        <img
          src={HowWeTravel}
          alt="How we travel"
          className="w-full max-w-4xl h-auto object-contain"
        />
      </section>

      {/* WHY US */}
      <section className="w-full py-16 flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-3xl mb-4">Why us?</h1>
        <p className="max-w-2xl text-center text-slate-700">
          We do it differently! We at ENARXI educate our customers on the
          complete technology to create insight into their dream products.
        </p>
      </section>

      {/* FEATURES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 bg-white rounded-xl shadow text-center"
            >
              <img
                src={f.icon}
                alt={f.title}
                className="h-12 w-12 mb-4 mx-auto"
              />
              <h3 className="text-lg font-semibold">{f.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-10">
        <h2 className="text-center text-2xl font-bold mb-6">Trusted By</h2>
        <div className="flex justify-center flex-wrap gap-8">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="h-12 object-contain"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// import heroImage from "../assets/images/heroImage.svg";

// const Hero = () => {
//   return (
//     <div className="h-[89vh] bg-gradient-to-b from-[#DEF4FF] to-white flex flex-col items-center text-center justify-center px-4 ">
//       {/* text */}
//       <div>
//       <p className="text-[#1840A7] capitalize text-[30px] font-noto mt-20">
//         Don't just dream it, build it
//       </p>
//       <h1 className=" font-semibold text-[#0A1524] max-w-4xl text-2xl md:text-[34px] font-poppins leading-snug capitalize">
//         Your imagination knows no bounds. Let's make something amazing together!
//       </h1>

//       <div className="mt-6">
//         <button className="bg-[#0A1524] text-white px-8 py-3 rounded-full shadow transition flex items-center gap-2 cursor-pointer">
//           Explore →
//         </button>
//       </div>

//       {/* image */}
//       <div className="mt-12 w-full flex justify-center">
//         <img src={heroImage} alt="heroImage" className="w-1/4 h-auto " />
//       </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

// src/pages/Home.jsx
