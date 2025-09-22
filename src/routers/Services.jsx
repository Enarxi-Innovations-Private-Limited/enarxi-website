import React, { memo, useState, useCallback, useMemo } from "react";
import service_1 from "../assets/images/service_1.svg";
import service_2 from "../assets/images/service_2.svg";
import service_3 from "../assets/images/service_3.svg";
import service_4 from "../assets/images/service_4.svg";
import service_5 from "../assets/images/service_5.svg";
import service_bottom_girl from "../assets/images/service-bottom-girl.svg";

// 1. Static Data & Constants
//    Moved outside the component for performance.

const SERVICES_DATA = [
  {
    id: "01",
    title: "PCB Design & Fabrication",
    desc: "ENARXI’s team of qualified PCB designers and fabricators perform swift and dense multilayer layouts for your printed circuit boards. We understand the complex demands of the design, which inspires us to provide you with top-notch designs linking to the best standards of practice and quality.",
    img: service_1,
  },
  {
    id: "02",
    title: "OEM Manufacturing",
    desc: "ENARXI’s OEM services deliver high-quality manufacturing solutions tailored to client specifications, ensuring scalability and reliability.",
    img: service_2,
  },
  {
    id: "03",
    title: "Microcontroller and Processor Firmware",
    desc: "We specialize in embedded software development, delivering efficient and optimized firmware for a wide range of devices.",
    img: service_3,
  },
  {
    id: "04",
    title: "3D Printing",
    desc: "Rapid prototyping and product development with precision 3D printing technologies, helping you iterate faster.",
    img: service_4,
  },
  {
    id: "05",
    title: "Technical Workshop & Training",
    desc: "Hands-on training sessions and workshops led by industry experts to upskill teams in electronics and IoT.",
    img: service_5,
  },
];

const FORM_OPTIONS = {
  services: [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Other",
  ],
  types: ["Business", "Personal", "Partnership"],
};

// 2. Memoized Sub-Components
//    Keep components pure and avoid unnecessary re-renders.

const ServiceCard = memo(({ service, reverse }) => {
  // Use useMemo for computed values to prevent recalculation on every render
  const flexDirection = useMemo(
    () => (reverse ? "md:flex-row-reverse" : "md:flex-row"),
    [reverse]
  );

  return (
    <article
      className={`flex flex-col items-center bg-white rounded-2xl shadow p-6 md:p-10 gap-6 ${flexDirection}`}
      aria-labelledby={`service-${service.id}`}
    >
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={service.img}
          alt={`${service.title} illustration`}
          className="max-h-56 object-contain"
          loading="lazy"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <h3
          id={`service-${service.id}`}
          className="text-lg font-bold text-project_text_color_primary"
        >
          {service.id}. {service.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">{service.desc}</p>
        <div className="flex gap-4">
          <button
            type="button"
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition"
            aria-label={`Enquiry about ${service.title}`}
          >
            Enquiry
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition"
            aria-label={`Learn how ${service.title} works`}
          >
            How it Works →
          </button>
        </div>
      </div>
    </article>
  );
});

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    service: "",
    type: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: null,
    error: null,
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFormStatus({ submitting: true, success: null, error: null });

      // Client-side validation
      if (
        !formData.lastName ||
        !formData.mobile ||
        !formData.email ||
        !formData.service ||
        !formData.type ||
        !formData.message
      ) {
        setFormStatus({
          submitting: false,
          success: false,
          error: "Please fill out all required fields.",
        });
        return;
      }

      // Basic email regex for front-end feedback
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setFormStatus({
          submitting: false,
          success: false,
          error: "Please enter a valid email address.",
        });
        return;
      }
      setTimeout(() => {
        setFormStatus({ submitting: false, success: true, error: null });
        setFormData({
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          service: "",
          type: "",
          message: "",
        });
      }, 1500);
    },
    [formData]
  );

  return (
    <form
      className="bg-white shadow-2xl rounded-xl p-8 space-y-5"
      onSubmit={handleSubmit}
      aria-label="Contact form"
      noValidate // Disable default browser validation to control it with React state
    >
      {formStatus.success && (
        <div
          role="alert"
          className="p-4 bg-green-100 text-green-700 rounded-md"
        >
          Your message has been sent successfully!
        </div>
      )}
      {formStatus.error && (
        <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-md">
          {formStatus.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="sr-only">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="sr-only">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name *"
            className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="mobile" className="sr-only">
          Mobile No
        </label>
        <input
          id="mobile"
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile No *"
          className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          Email ID
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email ID *"
          className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
          required
        />
      </div>

      <div>
        <label htmlFor="service" className="sr-only">
          Select Service
        </label>
        <select id="service"
  name="service"
  value={formData.service}
  onChange={handleChange}
  className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 overflow-x-hidden"
  required
>
          <option value="">Select Service *</option>
          {FORM_OPTIONS.services.map((service, index) => (
            <option key={index} value={service} className="truncate overflow-x-hidden">
              {service}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="type" className="sr-only">
          Select Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
          required
        >
          <option value="">Select Type *</option>
          {FORM_OPTIONS.types.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message *"
          rows="2"
          className="w-full border border-[#BCBCBC] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-[#09B8DC] text-white py-3 rounded-md font-medium hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={formStatus.submitting}
      >
        {formStatus.submitting ? "Submitting..." : "Enquiry"}
      </button>
    </form>
  );
};

// 4. Main Services Component
//    Composed of smaller, manageable pieces.

export default function Services() {
  return (
    <section className="bg-[#F5FBFF] py-16">
      <div className="w-[90%] mx-auto">
        <header className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 font-oswald">
            Services We Offer You
          </h2>
        </header>

        <div className="space-y-8">
          {SERVICES_DATA.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              reverse={idx % 2 !== 0}
            />
          ))}
        </div>
        <hr className="my-14 border-t-2 border-gray-200" />
        <section className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-3">
            <h3 className="text-3xl font-semibold font-oswald">Get in Touch</h3>
            <p className="font-poppins text-[#676767]">
              Please select a service below related to your inquiry.
              <br />
              Fill out our contact form
            </p>
            <ul
              className="text-project_text_color_primary list-disc space-y-2 ml-6 font-poppins"
              aria-label="Company strengths"
            >
              <li>
                Proven track record delivering diverse electronic products, from
                gadgets to industrial systems.
              </li>
              <li>
                Proficient in circuit design, collaboration with
                cross-functional teams, and validation.
              </li>
              <li>
                Expertise in embedded systems, FPGA programming, and advanced
                devices.
              </li>
              <li>
                Experienced in testing, compliance, and sustainable designs.
              </li>
            </ul>
            <div className="mt-8 flex justify-center md:justify-start">
              <img
                src={service_bottom_girl}
                alt="Illustration of a person working with electronics"
                className="w-full max-w-sm h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex-1">
            <ContactForm />
          </div>
        </section>
      </div>
    </section>
  );
}
