import React, { memo, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

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
    desc: "At Enarxi, we turn your “crazy circuit ideas” into real, working PCBs. Multi-layer, high-speed, or just a tiny IoT board — we handle the design, fabrication, and testing so you can focus on what really matters: making cool stuff (and maybe bragging a little).",
    img: service_1,
  },
  {
    id: "02",
    title: "OEM Manufacturing",
    desc: "Got a product idea? We make it happen, start to finish. From sourcing components to SMT/THT assembly, wiring, and final QA - we scale from a one-off prototype to full production runs. You dream it, we build it, and yes, we promise to handle the chaos.",
    img: service_2,
  },
  {
    id: "03",
    title: "Microcontroller and Processor Firmware",
    desc: "The brains behind your hardware. We speak fluent C, C++, and occasionally “why isn’t this compiling?” STM32, ESP32, Arduino, ARM - sensors, actuators, communication protocols (CAN, Modbus, I²C, SPI, UART) - we code it so your devices run smarter, faster, and sometimes even cooler than you imagined.",
    img: service_3,
  },
  {
    id: "04",
    title: "3D Printing",
    desc: "Your ideas, printed into reality. From quick concept models to functional prototypes, we deliver precise, clean, and ready-to-use 3D prints. It’s the perfect way to test, tweak, and bring your designs to life — one layer at a time.",
    img: service_4,
  },
  {
    id: "05",
    title: "Technical Workshop & Training",
    desc: "We don’t just build tech - we teach it, hands-on. PCB design, embedded systems, IoT, microcontroller programming - our workshops turn curious minds into confident creators. Bring your curiosity; leave with working prototypes (and maybe a few bragging rights).",
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

const ServiceCard = memo(({ service, reverse, index }) => {
  const flexDirection = useMemo(
    () => (reverse ? "md:flex-row-reverse" : "md:flex-row"),
    [reverse]
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -8 }}
      className={`flex flex-col items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 md:p-10 gap-6 ${flexDirection} overflow-hidden group`}
      aria-labelledby={`service-${service.id}`}
    >
      <motion.div 
        className="w-full md:w-1/2 flex justify-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={service.img}
          alt={`${service.title} illustration`}
          className="max-h-56 object-contain"
          loading="lazy"
        />
      </motion.div>
      <div className="w-full md:w-1/2 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: reverse ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="inline-block text-sm font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full mb-2">
            {service.id}
          </span>
          <h3
            id={`service-${service.id}`}
            className="text-2xl md:text-3xl font-bold text-gray-900 font-oswald"
          >
            {service.title}
          </h3>
        </motion.div>
        <motion.p 
          className="text-gray-600 leading-relaxed font-poppins"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {service.desc}
        </motion.p>
        <motion.div 
          className="flex gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
        </motion.div>
      </div>
    </motion.article>
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
    <motion.form
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-2xl rounded-xl p-8 space-y-5 border border-gray-100"
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Contact form"
      noValidate
    >
      {serverStatus.message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          role="alert"
          className={`p-4 rounded-md ${
            serverStatus.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {serverStatus.message}
        </motion.div>
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

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[#09B8DC] text-white py-3 rounded-md font-medium hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Enquiry"}
      </motion.button>
    </motion.form>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function Services() {
  return (
    <section className="bg-gradient-to-b from-[#F5FBFF] via-white to-[#F5FBFF] padding-y overflow-hidden">
      <div className="w-[90%] max-w-7xl mx-auto">
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-40 font-bold text-gray-900 font-oswald mb-4">
              Services We Offer You
            </h2>
            <p className="text-gray-600 font-poppins max-w-2xl mx-auto">
              Comprehensive solutions tailored to bring your innovative ideas to life
            </p>
          </motion.div>
        </motion.header>

        <div className="space-y-12">
          {SERVICES_DATA.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              reverse={idx % 2 !== 0}
              index={idx}
            />
          ))}
        </div>
        <motion.hr 
          className="my-14 border-t-2 border-gray-200"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <section className="flex flex-col md:flex-row gap-12">
          <motion.div 
            className="flex-1 flex flex-col gap-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold font-oswald text-gray-900 mb-3">
                Get in Touch
              </h3>
              <p className="font-poppins text-gray-600 text-lg">
                Please select a service below related to your inquiry.
                <br />
                Fill out our contact form
              </p>
            </motion.div>
            <motion.ul
              className="text-gray-700 space-y-3 font-poppins"
              aria-label="Company strengths"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                "Proven track record delivering diverse electronic products, from gadgets to industrial systems.",
                "Proficient in circuit design, collaboration with cross-functional teams, and validation.",
                "Expertise in embedded systems, FPGA programming, and advanced devices.",
                "Experienced in testing, compliance, and sustainable designs."
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                >
                  <span className="text-blue-500 mt-1 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div 
              className="mt-8 flex justify-center md:justify-start"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.img
                src={service_bottom_girl}
                alt="Illustration of a person working with electronics"
                className="w-full max-w-sm h-auto object-contain"
                loading="lazy"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
          <div className="flex-1">
            <ContactForm />
          </div>
        </section>
      </div>
    </section>
  );
}