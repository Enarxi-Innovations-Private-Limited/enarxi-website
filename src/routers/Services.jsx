import service_1 from "../assets/images/service_1.svg";
import service_2 from "../assets/images/service_2.svg";
import service_3 from "../assets/images/service_3.svg";
import service_4 from "../assets/images/service_4.svg";
import service_5 from "../assets/images/service_5.svg";
import service_bottom_girl from "../assets/images/service-bottom-girl.svg";

export default function Services() {
  const services = [
    {
      id: "01",
      title: "PCB Design & Fabrication",
      desc: "ENARXI’s team of qualified PCB designers and fabricators perform swift and dense multilayer layouts for your printed circuit boards. We understand the complex demands of the design, which inspires us to provide you with top-notch designs linking to the best standards of practice and quality.",
      img: service_1,
    },
    {
      id: "02",
      title: "OEM Manufacturing",
      desc: "ENARXI’s team of qualified PCB designers and fabricators perform swift and dense multilayer layouts for your printed circuit boards. We understand the complex demands of the design, which inspires us to provide you with top-notch designs linking to the best standards of practice and quality.",
      img: service_2,
    },
    {
      id: "03",
      title: "Microcontroller and Processor Firmware",
      desc: "ENARXI’s team of qualified PCB designers and fabricators perform swift and dense multilayer layouts for your printed circuit boards. We understand the complex demands of the design, which inspires us to provide you with top-notch designs linking to the best standards of practice and quality.",
      img: service_3,
    },
    {
      id: "04",
      title: "3D Printing",
      desc: "ENARXI’s team of qualified PCB designers and fabricators perform swift and dense multilayer layouts for your printed circuit boards. We understand the complex demands of the design, which inspires us to provide you with top-notch designs linking to the best standards of practice and quality.",
      img: service_4,
    },
    {
      id: "05",
      title: "Technical Workshop & Training",
      desc: "ENARXI’s team of qualified PCB designers and fabricators perform swift and dense multilayer layouts for your printed circuit boards. We understand the complex demands of the design, which inspires us to provide you with top-notch designs linking to the best standards of practice and quality.",
      img: service_5,
    },
  ];

  return (
    <section className="bg-[#F5FBFF] py-16 ">
      <div className="w-[90%] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 font-oswald">
            Services We Offer You
          </h2>
        </div>

        {/* Services List */}
        <div className=" mx-auto space-y-8">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`flex flex-col md:flex-row items-center bg-white rounded-2xl shadow p-6 md:p-10 gap-6 ${
                idx % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={service.img}
                  alt={service.title}
                  className="max-h-56 object-contain"
                />
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-lg font-bold text-project_text_color_primary">
                  {service.id}. {service.title.toUpperCase()}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                <div className="flex gap-4">
                  <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition">
                    Enquiry
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition">
                    How it Works →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* get in touch */}
        <div className="flex flex-col md:flex-row gap-8 mt-14">
          {/* Left Side - Text */}
          <div className="flex-1 flex flex-col gap-3">
            <h1 className="text-3xl font-semibold font-oswald">Get in Touch</h1>
            <p className="font-poppins text-[#676767]">
              Please select a Services below related to your inquiry. <br />
              Fill out our contact form
            </p>
            <ul className="text-project_text_color_primary list-disc space-y-2 ml-6 font-poppins">
              <li>
                Proven track record delivering diverse electronic products, from
                gadgets to industrial systems.
              </li>
              <li>
                Proficient in circuit design, collaboration with
                cross-functional teams, and validation
              </li>
              <li>
                Expertise in embedded systems, FPGA programming, and advanced
                devices
              </li>
              <li>
                Experienced in testing, compliance, and sustainable designs
              </li>
            </ul>
            <img
              src={service_bottom_girl}
              alt="girlImageAtBottom"
              className="w-[80%] h-auto object-contain mx-auto"
            />
          </div>

          {/* Right Side - Form */}
          <div className="flex-1">
            <div className="bg-white shadow-2xl rounded-xl p-8">
              <form className="space-y-5">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name *"
                    className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>

                {/* Mobile & Email */}
                <input
                  type="tel"
                  placeholder="Mobile No *"
                  className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />
                <input
                  type="email"
                  placeholder="Email ID *"
                  className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />

                {/* Services */}
                <select
                  className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                >
                  <option value="">Select Service *</option>
                  <option>Web Development</option>
                  <option>Mobile App Development</option>
                  <option>UI/UX Design</option>
                  <option>Other</option>
                </select>

                {/* Type */}
                <select
                  className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                >
                  <option value="">Select Type *</option>
                  <option>Business</option>
                  <option>Personal</option>
                  <option>Partnership</option>
                </select>

                {/* Message */}
                <textarea
                  placeholder="Message *"
                  rows="2"
                  className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                ></textarea>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#09B8DC] text-white py-3 rounded-md font-medium hover:bg-sky-600 transition"
                >
                  Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
