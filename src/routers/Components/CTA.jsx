import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

import avatar1 from "../../assets/images/avatar-1.png";
import avatar2 from "../../assets/images/avatar-2.png";
import avatar3 from "../../assets/images/avatar-3.png";

const CTA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur", // validate on blur
  });

  const onSubmit = async (data) => {
    const payload = {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      location: data.location,
      service: data.service,
      reachout: data.reachout,
      message: data.message,
    };
    try {
      console.log("Form Submitted ✅:", data);
      reset();
      setIsOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      const result = await emailjs.send(
        "service_n7kz6xp", 
        "template_71as93u", 
        payload,
        "4YeEjxO8U73uvXDOk" 
      );

      console.log(result.text);
      toast.success("Thanks! We'll reach out to you soon 🚀");
      methods.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 py-16">
      {/* CTA card */}
      <div className="rounded-3xl bg-[#0B1A27] text-white shadow-xl ring-1 ring-black/5 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* Left: Headline */}
          <div className="md:pr-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Let's get started on your ideas 💡
            </h2>
            <p className="mt-5 text-slate-300 leading-relaxed">
              Stay home, stay safe, and save lives. Connect with us digitally —
              we’re all ears!
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="order-1 md:order-2 mt-6 md:mt-0 flex flex-col items-center gap-2">
              <div className="flex -space-x-3">
                <img
                  src={avatar1}
                  alt="Team member 1"
                  className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src={avatar2}
                  alt="Team member 2"
                  className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src={avatar3}
                  alt="Team member 3"
                  className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
                />
              </div>
              <p className="text-sm text-slate-300">
                Join our team to get your product ideas implemented.
              </p>
            </div>

            <div className="order-2 md:order-1 mt-6 md:mt-0 md:pb-4">
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-full bg-[#09B8DC] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[#08A0C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09B8DC] focus:ring-offset-[#0B1A27] cursor-pointer"
              >
                Let’s Connect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 ">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-500 hover:text-slate-700 cursor-pointer hover:bg-slate-300 hover:rounded-full "
            >
              <X className="h-6 w-6 " />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Connect With Us
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                    setValueAs: (v) => v.replace(/[^a-zA-Z\s]/g, "").trim(), // remove anything not letters or space
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // block typing numbers
                  }}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                    errors.name
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Invalid Indian phone number",
                    },
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                    minLength: { value: 2, message: "Too short" },
                    setValueAs: (v) => v.trim(),
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                    errors.location
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />{" "}
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Service */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">
                  Service Required
                </label>
                <select
                  {...register("service", {
                    required: "Please select a service",
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none cursor-pointer ${
                    errors.service
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                >
                  <option value="">Select a service</option>
                  <option>Product Design & Prototyping</option>
                  <option>Micro Controller & Processor Coding</option>
                  <option>PCB Design & Fabrication</option>
                  <option>Custom Software Development</option>
                </select>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.service.message}
                  </p>
                )}
              </div>

              {/* Reachout */}
              <div className="relative ">
                <label className="block text-sm font-medium text-slate-700">
                  When can we reach out to you?
                </label>

                <select
                  {...register("reachout", {
                    required: "Please select a time",
                  })}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none cursor-pointer ${
                    errors.reachout
                      ? "border-red-500 focus:ring-red-400"
                      : "border-slate-300 focus:ring-[#09B8DC]"
                  }`}
                >
                  <option className="rounded-xl" value="">
                    Select a convenient time
                  </option>
                  <option value="Weekdays after 6 PM">
                    Weekdays after 6 PM
                  </option>
                  <option value="Weekend after 4 PM">Weekend after 4 PM</option>
                  <option value="Anytime this week">Anytime this week</option>
                </select>

                {errors.reachout && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.reachout.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#09B8DC] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#08A0C6] cursor-pointer"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-center items-center z-50 md:w-auto w-[80vw] mx-auto"
          >
            <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-lg border border-slate-200">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-lg font-medium text-slate-900">
                  Thanks for reaching out!
                </p>
                <p className="text-md font-normal text-slate-700">
                  We will get back to you shortly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
export default CTA;

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { X, CheckCircle, AlertCircle } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import emailjs from "@emailjs/browser";

// import avatar1 from "../../assets/images/avatar-1.png";
// import avatar2 from "../../assets/images/avatar-2.png";
// import avatar3 from "../../assets/images/avatar-3.png";

// const CTA = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     mode: "onBlur", // validate on blur
//   });

//   const onSubmit = (data) => {
//     console.log("Form Submitted ✅:", data);
//     reset();
//     setIsOpen(false);
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   return (
//     <section className="mx-auto max-w-7xl px-6 pb-16 py-16">
//       {/* CTA card */}
//       <div className="rounded-3xl bg-[#0B1A27] text-white shadow-xl ring-1 ring-black/5 p-8 md:p-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
//           {/* Left: Headline */}
//           <div className="md:pr-6">
//             <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
//               Let's get started on your ideas 💡
//             </h2>
//             <p className="mt-5 text-slate-300 leading-relaxed">
//               Stay home, stay safe, and save lives. Connect with us digitally —
//               we’re all ears!
//             </p>
//           </div>

//           {/* Right: CTA */}
//           <div className="flex flex-col items-center justify-center text-center">
//             <div className="order-1 md:order-2 mt-6 md:mt-0 flex flex-col items-center gap-2">
//               <div className="flex -space-x-3">
//                 <img
//                   src={avatar1}
//                   alt="Team member 1"
//                   className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
//                 />
//                 <img
//                   src={avatar2}
//                   alt="Team member 2"
//                   className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
//                 />
//                 <img
//                   src={avatar3}
//                   alt="Team member 3"
//                   className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
//                 />
//               </div>
//               <p className="text-sm text-slate-300">
//                 Join our team to get your product ideas implemented.
//               </p>
//             </div>

//             <div className="order-2 md:order-1 mt-6 md:mt-0 md:pb-4">
//               <button
//                 onClick={() => setIsOpen(true)}
//                 className="inline-flex items-center justify-center rounded-full bg-[#09B8DC] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[#08A0C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09B8DC] focus:ring-offset-[#0B1A27]"
//               >
//                 Let’s Connect
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 ">
//           <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={() => setIsOpen(false)}
//               className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
//             >
//               <X className="h-6 w-6" />
//             </button>

//             <h3 className="text-xl font-bold text-slate-900 mb-4">
//               Connect With Us
//             </h3>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               {/* Name */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-slate-700">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   {...register("name", {
//                     required: "Name is required",
//                     minLength: { value: 3, message: "Minimum 3 characters" },
//                     setValueAs: (v) => v.replace(/[^a-zA-Z\s]/g, "").trim(), // remove anything not letters or space
//                   })}
//                   onInput={(e) => {
//                     e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // block typing numbers
//                   }}
//                   className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
//                     errors.name
//                       ? "border-red-500 focus:ring-red-400"
//                       : "border-slate-300 focus:ring-[#09B8DC]"
//                   }`}
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="h-4 w-4" /> {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-slate-700">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   {...register("phone", {
//                     required: "Phone number is required",
//                     pattern: {
//                       value: /^[6-9]\d{9}$/,
//                       message: "Invalid Indian phone number",
//                     },
//                   })}
//                   className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
//                     errors.phone
//                       ? "border-red-500 focus:ring-red-400"
//                       : "border-slate-300 focus:ring-[#09B8DC]"
//                   }`}
//                 />
//                 {errors.phone && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="h-4 w-4" /> {errors.phone.message}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-slate-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
//                       message: "Invalid email address",
//                     },
//                   })}
//                   className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
//                     errors.email
//                       ? "border-red-500 focus:ring-red-400"
//                       : "border-slate-300 focus:ring-[#09B8DC]"
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="h-4 w-4" /> {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Location */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-slate-700">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   {...register("location", {
//                     required: "Location is required",
//                     minLength: { value: 2, message: "Too short" },
//                     setValueAs: (v) => v.trim(),
//                   })}
//                   className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
//                     errors.location
//                       ? "border-red-500 focus:ring-red-400"
//                       : "border-slate-300 focus:ring-[#09B8DC]"
//                   }`}
//                 />
//                 {errors.location && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="h-4 w-4" />{" "}
//                     {errors.location.message}
//                   </p>
//                 )}
//               </div>

//               {/* Service */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-slate-700">
//                   Service Required
//                 </label>
//                 <select
//                   {...register("service", {
//                     required: "Please select a service",
//                   })}
//                   className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none cursor-pointer ${
//                     errors.service
//                       ? "border-red-500 focus:ring-red-400"
//                       : "border-slate-300 focus:ring-[#09B8DC]"
//                   }`}
//                 >
//                   <option value="">Select a service</option>
//                   <option>Product Design & Prototyping</option>
//                   <option>Micro Controller & Processor Coding</option>
//                   <option>PCB Design & Fabrication</option>
//                   <option>Custom Software Development</option>
//                 </select>
//                 {errors.service && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="h-4 w-4" /> {errors.service.message}
//                   </p>
//                 )}
//               </div>

//               {/* Reachout */}
//               <div className="relative ">
//                 <label className="block text-sm font-medium text-slate-700">
//                   When can we reach out to you?
//                 </label>

//                 <select
//                   {...register("reachout", {
//                     required: "Please select a time",
//                   })}
//                   className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
//                     errors.reachout
//                       ? "border-red-500 focus:ring-red-400"
//                       : "border-slate-300 focus:ring-[#09B8DC]"
//                   }`}
//                 >
//                   <option className="rounded-xl" value="">
//                     Select a convenient time
//                   </option>
//                   <option value="Weekdays after 6 PM">
//                     Weekdays after 6 PM
//                   </option>
//                   <option value="Weekend after 4 PM">Weekend after 4 PM</option>
//                   <option value="Anytime this week">Anytime this week</option>
//                 </select>

//                 {errors.reachout && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="h-4 w-4" />
//                     {errors.reachout.message}
//                   </p>
//                 )}
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="w-full rounded-lg bg-[#09B8DC] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#08A0C6] cursor-pointer"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Success Toast */}
//       <AnimatePresence>
//         {!showSuccess && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             transition={{ duration: 0.4, ease: "easeInOut" }}
//             className="fixed bottom-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-center items-center z-50 w-auto"
//           >
//             <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-lg border border-slate-200">
//               <CheckCircle className="h-6 w-6 text-green-500" />
//               <div>
//                 <p className="text-lg font-medium text-slate-900">
//                   Thanks for reaching out!
//                 </p>
//                 <p className="text-md font-normal text-slate-700">
//                   We will get back to you shortly.
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// };

// export default CTA;
