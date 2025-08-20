import React from "react";
import aboutsus1 from "../assets/images/aboutUs1.svg";
import aboutusEye from "../assets/images/aboutusEye.svg";
import syedCTO from "../assets/images/syedCTO.jpeg";
import ayazCEO from "../assets/images/ayazCEO.jpeg";

const AboutEnarxi = () => {
  return (
    <div className="w-full font-sans bg-[#F8FFFF]">
      {/* About Header */}
      <section className="py-12 text-center">
        <h2 className="text-4xl font-semibold tracking-wide flex items-center justify-center gap-2 font-oswald">
          About Enarxi
        </h2>
      </section>

      {/* Our Story */}
      <section className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 md:px-12 text-[#0A1524]">
        {/* Left: Text */}
        <div>
          <h3 className="text-2xl font-bold mb-4 font-oswald">Our Story</h3>
          <p className="text-md leading-relaxed mb-3 font-poppins">
            Enarxi innovations Pvt Ltd was established in the year 2021, but the
            plan for the same was from late 2017. It was founded by{" "}
            <span className="font-bold">Mr. Syed Sameeullah </span> and{" "}
            <span className="font-bold">Mr. Ayaz Shaik</span>. Two different
            people with two different mindsets have come together with a common
            passion of initiating a technology startup, the idea of company is
            because notion between a senior and junior and their goal has never
            changed since their college days which is to create a environment of
            innovation and be the best in the field of Electronic product
            design.Enarxi’s founders are what we call the ardent zealot of
            technology, who knows and believes in the fact that advanced
            technology is indistinguishable from magic when sufficient. Enarxi’s
            multidisciplinary approach creates a culture where we ardently
            convert our hopes and visions into tangible achievements. Enarxi is
            a team of dreamers who accomplish and grow. We know no limits.
          </p>
        </div>

        {/* Right: Illustration */}
        <div className="flex justify-center">
          <img src={aboutsus1} alt="Our Story" className="w-auto h-auto" />
        </div>
      </section>

      {/* Mission Banner */}
      <section className="bg-gray-900 py-[7%] mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-lg md:text-3xl font-semibold text-white leading-snug">
            <span className="text-[#09B8DC]">Our Mission</span> Is To Empower
            Businesses Of All Sizes To Maximize Their Growth Potential And
            Revenue By Adapting Quickly And Increasing Customer Loyalty.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="w-[90%] mx-auto px-6 py-12">
        <h3 className="text-3xl font-bold mb-8 text-gray-900 font-oswald">
          Our Values
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {["Curiosity", "Curiosity", "Curiosity", "Curiosity"].map(
            (value, i) => (
              <div
                key={i}
                className="bg-white shadow-lg shadow-cyan-100 p-6 rounded-xl "
              >
                <img
                  className="w-24 h-24 mb-3 rounded-md bg-gray-200 "
                  src={aboutusEye}
                  alt="aboutusEye"
                />
                <h4 className="font-semibold text-xl font-oswald">{value}</h4>
                <p className="text-gray-500 text-sm mt-2 font-poppins">
                  Curiosity drives our innovation. We constantly explore new
                  technologies and methods to bring better solutions for our
                  clients.
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="w-[90%] mx-auto py-12 relative">
        <h3 className="text-3xl md:relative left-16 font-bold mb-8 font-oswald text-[#0A1524]">
          Our Leadership Team
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {[
            { name: "Mr. Ayaz Shaik", role: "CEO & Founder", img: ayazCEO },
            { name: "Mr. Ayaz Shaik", role: "CEO & Founder", img: ayazCEO },
            { name: "Mr. Ayaz Shaik", role: "CEO & Founder", img: ayazCEO },
            { name: "Mr. Syed ", role: "CTO & Founder", img: syedCTO },
            { name: "Mr. Syed ", role: "CTO & Founder", img: syedCTO },
            { name: "Mr. Syed ", role: "CTO & Founder", img: syedCTO },
          ].map((person, i) => (
            <div key={i} className="p-4 font-poppins ">
              <img
                src={person.img}
                alt={person.name}
                className="w-48 h-48 rounded-md object-cover mb-4"
              />
              <h4 className="font-semibold text-[#0A1524]">{person.name}</h4>
              <p className="text-[#676767] font-md text-sm">{person.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutEnarxi;
