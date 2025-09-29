import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


import avatar1 from "../../assets/images/avatar-1.png";
import avatar2 from "../../assets/images/avatar-2.png";
import avatar3 from "../../assets/images/avatar-3.png";

const CTA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted ✅:", data);

    reset();
    setIsOpen(false);

    // show toast
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 py-16">
      {/* CTA card */}
      <div className="rounded-3xl bg-[#0B1A27] text-white shadow-xl ring-1 ring-black/5 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="md:pr-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Lets get started implement on your ideas 💡
            </h2>
            <p className="mt-5 text-slate-300 leading-relaxed">
              Let's Stay home, Stay safe and save lives. Connect us digitally,
              we are all ears for you.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="order-1 md:order-2 mt-6 md:mt-0 flex flex-col items-center gap-2">
              <div className="flex -space-x-3">
                <img src={avatar1} alt="Team member 1" className="h-10 w-10 rounded-full ring-2 ring-white object-cover" />
                <img src={avatar2} alt="Team member 2" className="h-10 w-10 rounded-full ring-2 ring-white object-cover" />
                <img src={avatar3} alt="Team member 3" className="h-10 w-10 rounded-full ring-2 ring-white object-cover" />
              </div>
              <p className="text-sm text-slate-300">
                Join with our team to get your product ideas done
              </p>
            </div>

            <div className="order-2 md:order-1 mt-6 md:mt-0 md:pb-4">
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-full bg-[#09B8DC] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[#08A0C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09B8DC] focus:ring-offset-[#0B1A27]"
              >
                Let’s Connect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Connect With Us
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-[#09B8DC] focus:outline-none"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  {...register("phone", { required: "Phone number is required" })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-[#09B8DC] focus:outline-none"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-[#09B8DC] focus:outline-none"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <input
                  type="text"
                  {...register("location", { required: "Location is required" })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-[#09B8DC] focus:outline-none"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Service Required</label>
                <select
                  {...register("service", { required: "Please select a service" })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-[#09B8DC] focus:outline-none"
                >
                  <option value="">Select a service</option>
                  <option>Product Design & Prototyping</option>
                  <option>Micro Controller & Processor Coding</option>
                  <option>PCB Design & Fabrication</option>
                  <option>Custom Software Development</option>
                </select>
                {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>}
              </div>

              {/* Reachout */}
              <div>
                <label className="block text-sm font-medium text-slate-700">When can we reach out to you?</label>
                <input
                  type="text"
                  {...register("reachout", { required: "Please specify" })}
                  placeholder="e.g. Weekdays after 6 PM"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:ring-2 focus:ring-[#09B8DC] focus:outline-none"
                />
                {errors.reachout && <p className="text-red-500 text-sm mt-1">{errors.reachout.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#09B8DC] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#08A0C6]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast (bottom-right) */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-lg border border-slate-200">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Thanks for reaching out!
                </p>
                <p className="text-xs text-slate-600">
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























// import avatar1 from "../../assets/images/avatar-1.png";
// import avatar2 from "../../assets/images/avatar-2.png";
// import avatar3 from "../../assets/images/avatar-3.png";

// const CTA = () => {
// return (
//     <section className="mx-auto max-w-7xl px-6 pb-16 py-16">
//              <div className="rounded-3xl bg-[#0B1A27] text-white shadow-xl ring-1 ring-black/5 p-8 md:p-12">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
//                     {/* Left: headline + copy */}
//                     <div className="md:pr-6">
//                       <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
//                         Lets get started implement on your ideas 💡
//                       </h2>
//                       <p className="mt-5 text-slate-300 leading-relaxed">
//                         Let's Stay home, Stay safe and save lives. Connect us digitally, we are all ears for you.
//                       </p>
//                     </div>
        
//                     {/* Right: CTA stack */}
//                     <div className="flex flex-col items-center justify-center text-center">
//                       {/* Avatars + Text */}
//                       <div className="order-1 md:order-2 mt-6 md:mt-0 flex flex-col items-center gap-2">
//                         <div className="flex -space-x-3">
//                           <img src={avatar1} alt="Team member 1" className="h-10 w-10 rounded-full ring-2 ring-white object-cover" loading="lazy" />
//                           <img src={avatar2} alt="Team member 2" className="h-10 w-10 rounded-full ring-2 ring-white object-cover" loading="lazy" />
//                           <img src={avatar3} alt="Team member 3" className="h-10 w-10 rounded-full ring-2 ring-white object-cover" loading="lazy" />
//                         </div>
//                         <p className="text-sm text-slate-300">
//                           Join with our team to get your product ideas done
//                         </p>
//                       </div>
        
//                       {/* Button */}
//                       <div className="order-2 md:order-1 mt-6 md:mt-0 md:pb-4">
//                         <a
//                           href="/contact"
//                           className="inline-flex items-center justify-center rounded-full bg-[#09B8DC] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[#08A0C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09B8DC] focus:ring-offset-[#0B1A27]"
//                         >
//                           Let’s Connect
//                         </a>
//                       </div>
//                     </div>  
//                   </div>
//                 </div>
//         </section>  
// )
// }

// export default CTA;




