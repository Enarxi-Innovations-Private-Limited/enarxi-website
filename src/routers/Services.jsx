import React, { memo, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ASSET IMPORTS
// Make sure the paths to your assets are correct
import service_1 from "../assets/images/service_1.svg";
import service_2 from "../assets/images/service_2.svg";
import service_3 from "../assets/images/service_3.svg";
import service_4 from "../assets/images/service_4.svg";
import service_5 from "../assets/images/service_5.svg";
import service_bottom_girl from "../assets/images/service-bottom-girl.svg";

// --- DATA CONSTANTS ---

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

// --- REUSABLE & ACCESSIBLE FORM COMPONENTS ---

const InputField = ({ register, name, label, error, ...props }) => (
  <div>
    <label htmlFor={name} className="sr-only">
      {label}
    </label>
    <input
      id={name}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
        error ? "border-red-500" : "border-[#BCBCBC]"
      }`}
      {...register(name)}
      {...props}
    />
    {error && (
      <p id={`${name}-error`} role="alert" className="text-red-600 text-sm mt-1">
        {error.message}
      </p>
    )}
  </div>
);

const SelectField = ({ register, name, label, error, children, ...props }) => (
  <div>
    <label htmlFor={name} className="sr-only">
      {label}
    </label>
    <select
      id={name}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
        error ? "border-red-500" : "border-[#BCBCBC]"
      }`}
      {...register(name)}
      {...props}
    >
      {children}
    </select>
    {error && (
      <p id={`${name}-error`} role="alert" className="text-red-600 text-sm mt-1">
        {error.message}
      </p>
    )}
  </div>
);

const TextareaField = ({ register, name, label, error, ...props }) => (
  <div>
    <label htmlFor={name} className="sr-only">
      {label}
    </label>
    <textarea
      id={name}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
        error ? "border-red-500" : "border-[#BCBCBC]"
      }`}
      {...register(name)}
      {...props}
    />
    {error && (
      <p id={`${name}-error`} role="alert" className="text-red-600 text-sm mt-1">
        {error.message}
      </p>
    )}
  </div>
);

// --- FORM VALIDATION SCHEMA (ZOD) ---

// --- FORM VALIDATION SCHEMA (ZOD) ---

const contactSchema = z.object({
  firstName: z.string()
    // This rule was added
    .regex(/^[a-zA-Z -]*$/, "Name can only contain letters, spaces, and hyphens")
    .optional(),
  lastName: z.string()
    .min(1, "Last name is required")
    // This rule was added
    .regex(/^[a-zA-Z -]+$/, "Name can only contain letters, spaces, and hyphens"),
  mobile: z
    .string()
    .min(10, "Please enter a valid 10-digit mobile number")
    .regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  email: z.string().email("Please enter a valid email address"),
  service: z.string().min(1, "Please select a service"),
  type: z.string().min(1, "Please select a type"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

// --- UI COMPONENTS ---

const ServiceCard = memo(({ service, reverse }) => {
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
  const [serverStatus, setServerStatus] = useState({ message: "", type: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      service: "",
      type: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    setServerStatus({ message: "", type: "" });
    try {
      console.log("Submitting data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // throw new Error("Simulated server failure!"); // Uncomment to test an error

      setServerStatus({
        message: "Your message has been sent successfully!",
        type: "success",
      });
      reset();
    } catch (error) {
      setServerStatus({
        message: "Failed to send message. Please try again later.",
        type: "error",
      });
    }
  };

  return (
    <form
      className="bg-white shadow-2xl rounded-xl p-8 space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Contact form"
      noValidate
    >
      {serverStatus.message && (
        <div
          role="alert"
          className={`p-4 rounded-md ${
            serverStatus.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {serverStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          register={register}
          name="firstName"
          label="First Name"
          placeholder="First Name"
          error={errors.firstName}
        />
        <InputField
          register={register}
          name="lastName"
          label="Last Name"
          placeholder="Last Name *"
          error={errors.lastName}
        />
      </div>

      <InputField
        register={register}
        name="mobile"
        label="Mobile No"
        type="tel"
        placeholder="Mobile No *"
        error={errors.mobile}
      />
      <InputField
        register={register}
        name="email"
        label="Email ID"
        type="email"
        placeholder="Email ID *"
        error={errors.email}
      />

      <SelectField
        register={register}
        name="service"
        label="Select Service"
        error={errors.service}
      >
        <option value="">Select Service *</option>
        {FORM_OPTIONS.services.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </SelectField>

      <SelectField
        register={register}
        name="type"
        label="Select Type"
        error={errors.type}
      >
        <option value="">Select Type *</option>
        {FORM_OPTIONS.types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </SelectField>

      <TextareaField
        register={register}
        name="message"
        label="Message"
        placeholder="Message *"
        rows="2"
        error={errors.message}
      />

      <button
        type="submit"
        className="w-full bg-[#09B8DC] text-white py-3 rounded-md font-medium hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Enquiry"}
      </button>
    </form>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function Services() {
  return (
    <section className="bg-[#F5FBFF] py-12 md:py-16 overflow-hidden">
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